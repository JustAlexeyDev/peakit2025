from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'audio', views.AudioTrackViewSet)
router.register(r'pois', views.PointOfInterestViewSet)
router.register(r'routes', views.RouteViewSet)
router.register(r'offline-packages', views.OfflinePackageViewSet)
router.register(r'config', views.ConfigViewSet, basename='config')

urlpatterns = [
    path('', include(router.urls)),
    path('health/', views.health_check, name='health-check'),
]