from django.contrib import admin
from .models import AudioTrack, PointOfInterest, Route, OfflinePackage, RouteWaypoint

@admin.register(AudioTrack)
class AudioTrackAdmin(admin.ModelAdmin):
    list_display = ['id', 'title_ru', 'language', 'duration', 'created_at']
    list_filter = ['language', 'created_at']
    search_fields = ['id', 'title_ru', 'title_en']

@admin.register(PointOfInterest)
class PointOfInterestAdmin(admin.ModelAdmin):
    list_display = ['id', 'name_ru', 'poi_type', 'longitude', 'latitude', 'radius', 'is_active']
    list_filter = ['poi_type', 'is_active', 'has_parking']
    search_fields = ['id', 'name_ru', 'name_en']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    list_display = ['id', 'name_ru', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['id', 'name_ru', 'name_en']

@admin.register(RouteWaypoint)
class RouteWaypointAdmin(admin.ModelAdmin):
    list_display = ['route', 'point', 'order']
    list_filter = ['route']
    ordering = ['route', 'order']

@admin.register(OfflinePackage)
class OfflinePackageAdmin(admin.ModelAdmin):
    list_display = ['version', 'is_active', 'audio_tracks_count', 'pois_count', 'created_at']
    list_filter = ['is_active']
    readonly_fields = ['created_at']