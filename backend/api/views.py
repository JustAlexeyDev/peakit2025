from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.http import JsonResponse
from django.db.models import F
import math

from .models import AudioTrack, PointOfInterest, Route, OfflinePackage
from .serializers import (
    AudioTrackSerializer, PointOfInterestSerializer, 
    RouteSerializer, OfflinePackageSerializer
)

class AudioTrackViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AudioTrack.objects.all()
    serializer_class = AudioTrackSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['language']

class PointOfInterestViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PointOfInterest.objects.filter(is_active=True)
    serializer_class = PointOfInterestSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['poi_type', 'has_parking']
    
    def haversine_distance(self, lat1, lon1, lat2, lon2):
        """Вычисление расстояния между двумя точками в метрах"""
        R = 6371000  # радиус Земли в метрах
        phi1 = math.radians(lat1)
        phi2 = math.radians(lat2)
        delta_phi = math.radians(lat2 - lat1)
        delta_lambda = math.radians(lon2 - lon1)
        
        a = math.sin(delta_phi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(delta_lambda/2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        
        return R * c
    
    @action(detail=False, methods=['get'])
    def near(self, request):
        """Получить точки поблизости"""
        lat = request.GET.get('lat')
        lng = request.GET.get('lng')
        radius = request.GET.get('radius', 1000)  # метров
        
        if not lat or not lng:
            return Response(
                {'error': 'Необходимы параметры lat и lнг'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        lat = float(lat)
        lng = float(lng)
        radius = float(radius)
        
        # Простая фильтрация по bounding box для производительности
        # 1 градус широты ≈ 111 км, 1 градус долготы ≈ 111 км * cos(широта)
        lat_delta = radius / 111320
        lng_delta = radius / (111320 * math.cos(math.radians(lat)))
        
        queryset = self.queryset.filter(
            latitude__range=(lat - lat_delta, lat + lat_delta),
            longitude__range=(lng - lng_delta, lng + lng_delta)
        )
        
        # Точный расчет расстояния для отфильтрованных точек
        nearby_pois = []
        for poi in queryset:
            distance = self.haversine_distance(lat, lng, poi.latitude, poi.longitude)
            if distance <= radius:
                poi.distance = distance
                nearby_pois.append(poi)
        
        serializer = self.get_serializer(nearby_pois, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def geojson(self, request):
        """Получить все точки в формате GeoJSON"""
        pois = self.queryset.all()
        
        features = []
        for poi in pois:
            feature = {
                "type": "Feature",
                "properties": {
                    "id": poi.id,
                    "name_ru": poi.name_ru,
                    "name_en": poi.name_en,
                    "name_sah": poi.name_sah,
                    "type": poi.poi_type,
                    "radius": poi.radius,
                    "cooldown_sec": poi.cooldown_sec,
                    "audio_id": poi.audio_track.id if poi.audio_track else None,
                    "opening_hrs": poi.opening_hours,
                    "has_parking": poi.has_parking,
                    "priority": poi.priority
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [poi.longitude, poi.latitude]
                }
            }
            features.append(feature)
        
        geojson_data = {
            "type": "FeatureCollection",
            "features": features
        }
        
        return JsonResponse(geojson_data)

class RouteViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Route.objects.filter(is_active=True)
    serializer_class = RouteSerializer
    
    @action(detail=True, methods=['get'])
    def geojson(self, request, pk=None):
        """Получить маршрут в формате GeoJSON"""
        route = self.get_object()
        
        features = [{
            "type": "Feature",
            "properties": {
                "id": route.id,
                "name_ru": route.name_ru,
                "name_en": route.name_en,
                "name_sah": route.name_sah
            },
            "geometry": {
                "type": "LineString",
                "coordinates": route.path_coordinates
            }
        }]
        
        # Добавляем точки маршрута
        for waypoint in route.routewaypoint_set.select_related('point').all():
            poi = waypoint.point
            features.append({
                "type": "Feature",
                "properties": {
                    "id": poi.id,
                    "name_ru": poi.name_ru,
                    "type": poi.poi_type,
                    "order": waypoint.order,
                    "audio_id": poi.audio_track.id if poi.audio_track else None,
                    "radius": poi.radius
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [poi.longitude, poi.latitude]
                }
            })
        
        geojson_data = {
            "type": "FeatureCollection",
            "features": features
        }
        
        return JsonResponse(geojson_data)

class OfflinePackageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = OfflinePackage.objects.filter(is_active=True)
    serializer_class = OfflinePackageSerializer
    
    @action(detail=True, methods=['get'])
    def download_all(self, request, pk=None):
        """Скачать полный офлайн пакет"""
        package = self.get_object()
        
        # В реальном приложении здесь можно создать ZIP архив
        # со всеми необходимыми файлами
        response_data = {
            'package': OfflinePackageSerializer(package, context={'request': request}).data,
            'audio_tracks': AudioTrackSerializer(
                AudioTrack.objects.all(), 
                many=True, 
                context={'request': request}
            ).data
        }
        
        return Response(response_data)

class ConfigViewSet(viewsets.ViewSet):
    """API для конфигурации приложения"""
    
    @action(detail=False, methods=['get'])
    def app_config(self, request):
        """Основная конфигурация приложения"""
        config = {
            'geofence_parameters': {
                'city_radius': 300,
                'poi_radius': 150,
                'trail_radius': 30,
                'cooldown_default': 7200,
                'hysteresis': 20
            },
            'audio_settings': {
                'default_volume': -16,
                'supported_formats': ['mp3', 'aac'],
                'auto_pause_music': True
            },
            'map_settings': {
                'initial_center': [129.73, 62.03],  # Якутск
                'initial_zoom': 10,
                'offline_tile_url': '/tiles/{z}/{x}/{y}.png'
            }
        }
        return Response(config)

def health_check(request):
    """Проверка здоровья API"""
    return JsonResponse({'status': 'healthy', 'service': 'Lenskie Stolby API'})