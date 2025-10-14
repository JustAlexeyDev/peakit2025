from django.core.management.base import BaseCommand
from api.models import AudioTrack, PointOfInterest, Route, RouteWaypoint, POIType, Language

class Command(BaseCommand):
    help = 'Create demo data for routes, POIs, and audio tracks'

    def handle(self, *args, **options):
        # Create audio tracks
        audio_tracks = [
            {
                'id': 'a_yakutsk_intro',
                'title_ru': 'Введение в Якутск',
                'title_en': 'Yakutsk Introduction',
                'duration': 120,
                'language': Language.RU
            },
            {
                'id': 'a_pokrovsk_intro',
                'title_ru': 'Добро пожаловать в Покровск',
                'title_en': 'Welcome to Pokrovsk',
                'duration': 90,
                'language': Language.RU
            },
            {
                'id': 'a_lenskie_stolby',
                'title_ru': 'Ленские столбы - природное чудо',
                'title_en': 'Lena Pillars - Natural Wonder',
                'duration': 180,
                'language': Language.RU
            }
        ]

        for audio_data in audio_tracks:
            audio, created = AudioTrack.objects.get_or_create(
                id=audio_data['id'],
                defaults=audio_data
            )
            if created:
                self.stdout.write(f'Created audio track: {audio.title_ru}')

        # Create POIs
        pois_data = [
            {
                'id': 'city_yakutsk',
                'name_ru': 'Якутск',
                'name_en': 'Yakutsk',
                'poi_type': POIType.CITY,
                'longitude': 129.73,
                'latitude': 62.03,
                'radius': 400,
                'cooldown_sec': 7200,
                'audio_track_id': 'a_yakutsk_intro',
                'description_ru': 'Столица Республики Саха (Якутия)',
                'priority': 10
            },
            {
                'id': 'city_pokrovsk',
                'name_ru': 'Покровск',
                'name_en': 'Pokrovsk',
                'poi_type': POIType.CITY,
                'longitude': 129.12,
                'latitude': 61.48,
                'radius': 350,
                'cooldown_sec': 7200,
                'audio_track_id': 'a_pokrovsk_intro',
                'description_ru': 'Город на берегу Лены',
                'priority': 8
            },
            {
                'id': 'lenskie_stolby_main',
                'name_ru': 'Ленские столбы',
                'name_en': 'Lena Pillars',
                'poi_type': POIType.VIEWPOINT,
                'longitude': 127.45,
                'latitude': 60.72,
                'radius': 500,
                'cooldown_sec': 3600,
                'audio_track_id': 'a_lenskie_stolby',
                'description_ru': 'Уникальные скальные образования на берегу Лены',
                'priority': 10
            },
            {
                'id': 'gas_station_1',
                'name_ru': 'АЗС "Лукойл"',
                'name_en': 'Lukoil Gas Station',
                'poi_type': POIType.SERVICE_GAS,
                'longitude': 129.5,
                'latitude': 61.8,
                'radius': 200,
                'cooldown_sec': 1800,
                'description_ru': 'Заправка топливом',
                'priority': 5
            },
            {
                'id': 'cafe_1',
                'name_ru': 'Кафе "Лена"',
                'name_en': 'Lena Cafe',
                'poi_type': POIType.SERVICE_FOOD,
                'longitude': 129.2,
                'latitude': 61.6,
                'radius': 150,
                'cooldown_sec': 1800,
                'description_ru': 'Местная кухня и напитки',
                'priority': 3
            }
        ]

        for poi_data in pois_data:
            audio_track_id = poi_data.pop('audio_track_id', None)
            poi, created = PointOfInterest.objects.get_or_create(
                id=poi_data['id'],
                defaults=poi_data
            )
            if audio_track_id:
                try:
                    audio_track = AudioTrack.objects.get(id=audio_track_id)
                    poi.audio_track = audio_track
                    poi.save()
                except AudioTrack.DoesNotExist:
                    pass
            if created:
                self.stdout.write(f'Created POI: {poi.name_ru}')

        # Create route
        route_data = {
            'id': 'main_route',
            'name_ru': 'Якутск - Ленские столбы',
            'name_en': 'Yakutsk - Lena Pillars',
            'path_coordinates': [
                [62.03, 129.73],  # Якутск
                [61.8, 129.5],    # АЗС
                [61.6, 129.2],    # Кафе
                [61.48, 129.12],  # Покровск
                [60.72, 127.45]   # Ленские столбы
            ]
        }

        route, created = Route.objects.get_or_create(
            id=route_data['id'],
            defaults=route_data
        )
        if created:
            self.stdout.write(f'Created route: {route.name_ru}')

        # Create route waypoints
        waypoints_data = [
            {'poi_id': 'city_yakutsk', 'order': 1},
            {'poi_id': 'gas_station_1', 'order': 2},
            {'poi_id': 'cafe_1', 'order': 3},
            {'poi_id': 'city_pokrovsk', 'order': 4},
            {'poi_id': 'lenskie_stolby_main', 'order': 5}
        ]

        for wp_data in waypoints_data:
            try:
                poi = PointOfInterest.objects.get(id=wp_data['poi_id'])
                waypoint, created = RouteWaypoint.objects.get_or_create(
                    route=route,
                    point=poi,
                    order=wp_data['order']
                )
                if created:
                    self.stdout.write(f'Added waypoint: {poi.name_ru} to route')
            except PointOfInterest.DoesNotExist:
                self.stdout.write(f'POI not found: {wp_data["poi_id"]}')

        self.stdout.write(
            self.style.SUCCESS('Successfully created demo data!')
        )
