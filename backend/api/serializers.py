from rest_framework import serializers
from .models import AudioTrack, PointOfInterest, Route, OfflinePackage, RouteWaypoint

class AudioTrackSerializer(serializers.ModelSerializer):
    audio_url = serializers.SerializerMethodField()
    
    class Meta:
        model = AudioTrack
        fields = [
            'id', 'title_ru', 'title_en', 'title_sah', 'audio_url',
            'duration', 'language', 'volume_level', 'checksum',
            'created_at'
        ]
    
    def get_audio_url(self, obj):
        request = self.context.get('request')
        if obj.audio_file and request:
            return request.build_absolute_uri(obj.audio_file.url)
        return None

class PointOfInterestSerializer(serializers.ModelSerializer):
    audio_track_info = AudioTrackSerializer(source='audio_track', read_only=True)
    coordinates = serializers.SerializerMethodField()
    
    class Meta:
        model = PointOfInterest
        fields = [
            'id', 'name_ru', 'name_en', 'name_sah', 'poi_type',
            'coordinates', 'radius', 'cooldown_sec', 'audio_track_info',
            'description_ru', 'description_en', 'description_sah',
            'opening_hours', 'has_parking', 'is_active', 'priority',
            'created_at'
        ]
    
    def get_coordinates(self, obj):
        return {
            'longitude': obj.longitude,
            'latitude': obj.latitude
        }

class RouteWaypointSerializer(serializers.ModelSerializer):
    point = PointOfInterestSerializer(read_only=True)
    
    class Meta:
        model = RouteWaypoint
        fields = ['point', 'order']

class RouteSerializer(serializers.ModelSerializer):
    waypoints = RouteWaypointSerializer(many=True, read_only=True, source='routewaypoint_set')
    
    class Meta:
        model = Route
        fields = [
            'id', 'name_ru', 'name_en', 'name_sah', 'path_coordinates',
            'waypoints', 'is_active', 'created_at'
        ]

class OfflinePackageSerializer(serializers.ModelSerializer):
    routes_url = serializers.SerializerMethodField()
    pois_url = serializers.SerializerMethodField()
    
    class Meta:
        model = OfflinePackage
        fields = [
            'version', 'routes_url', 'pois_url',
            'total_audio_size', 'total_tiles_size',
            'audio_tracks_count', 'pois_count',
            'is_active', 'created_at'
        ]
    
    def get_routes_url(self, obj):
        request = self.context.get('request')
        if obj.routes_geojson and request:
            return request.build_absolute_uri(obj.routes_geojson.url)
        return None
    
    def get_pois_url(self, obj):
        request = self.context.get('request')
        if obj.pois_geojson and request:
            return request.build_absolute_uri(obj.pois_geojson.url)
        return None