// src/pages/Map/Map.jsx
import React, { useState, useEffect, useRef } from "react";
import { YMaps, Map as YMap, Placemark } from '@pbe/react-yandex-maps';
import { useGeolocation } from "../../modules/hooks/useGeolocation.js";
import { useGeofencing } from "../../modules/hooks/useGeofencing.js";
import { GeoJsonService } from "../../modules/services/geoJson.service.js";
import { MapService } from "../../modules/services/map.service.js";
import RoutePolyline from "./components/RoutePolyline.jsx";
import POIMarkers from "./components/POIMarkers.jsx";
import AudioPlayer from "./components/AudioPlayer/AudioPlayer.jsx";
import MapControls from "./components/MapControls/MapControls.jsx";
import MapLayers from "./components/MapLayers.jsx";
import POISearch from "./components/POISearch.jsx";
import MapInfo from "./components/MapInfo.jsx";
import RouteStatus from "./components/RouteStatus.jsx";
import "./Map.css";

const Map = () => {
    const [center, setCenter] = useState([62.03, 129.73]); // Якутск
    const [zoom, setZoom] = useState(8);
    const [routeData, setRouteData] = useState({ pois: [], route: [] });
    const [currentAudio, setCurrentAudio] = useState(null);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const [appConfig, setAppConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeLayers, setActiveLayers] = useState({
        pois: true,
        route: true,
        services: true,
        trail: true
    });
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isRouteActive, setIsRouteActive] = useState(false);

    const { location: userLocation, error: locationError, isLoading: locationLoading } = useGeolocation();
    const { activeGeofences } = useGeofencing(routeData.pois, userLocation);
    
    const mapRef = useRef(null);
    const YANDEX_API_KEY = "c95443f0-171f-4dfc-aec8-6ae413b5bb3e";

    useEffect(() => {
        initializeMap();
        setupOfflineDetection();
    }, []);

    useEffect(() => {
        if (userLocation) {
            setCenter(userLocation);
            setZoom(12);
        }
    }, [userLocation]);

    const initializeMap = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Загружаем конфигурацию и данные маршрута параллельно
            const [config, routeData] = await Promise.all([
                MapService.getAppConfig(),
                GeoJsonService.loadRouteData()
            ]);
            
            setAppConfig(config);
            setRouteData(routeData);
            
            // Устанавливаем начальные настройки карты из конфигурации
            if (config && config.map_settings) {
                setCenter(config.map_settings.initial_center);
                setZoom(config.map_settings.initial_zoom);
            } else {
                // Fallback координаты для Якутска
                setCenter([62.03, 129.73]);
                setZoom(8);
            }
            
        } catch (err) {
            console.error('Error initializing map:', err);
            setError('Ошибка загрузки данных карты');
            // Загружаем демо данные в случае ошибки
            const demoData = GeoJsonService.getDemoData();
            setRouteData(demoData);
        } finally {
            setLoading(false);
        }
    };

    const setupOfflineDetection = () => {
        window.addEventListener('online', () => setIsOffline(false));
        window.addEventListener('offline', () => setIsOffline(true));
    };

    const handlePOIClick = async (poi) => {
        if (poi.audioId) {
            try {
                // Загружаем аудиотрек с сервера
                const audioTrack = await MapService.getAudioTrack(poi.audioId);
                setCurrentAudio({
                    ...poi,
                    audioId: poi.audioId,
                    audioTrack: audioTrack
                });
            } catch (error) {
                console.error('Error loading audio track:', error);
                // Показываем POI без аудио
                setCurrentAudio({
                    ...poi,
                    audioId: poi.audioId,
                    audioTrack: null
                });
            }
        }
    };

    const handleAudioClose = () => {
        setCurrentAudio(null);
    };

    const handleStartRoute = () => {
        if (routeData.route && routeData.route.length > 0) {
            // Центрируем на первой точке маршрута
            setCenter(routeData.route[0]);
            setZoom(10);
            setIsRouteActive(true);
            
            // Показываем уведомление
            alert('Маршрут начат! Следуйте по синей линии на карте.');
        } else {
            alert('Маршрут не загружен. Попробуйте обновить страницу.');
        }
    };

    const handleStopRoute = () => {
        setIsRouteActive(false);
        alert('Маршрут остановлен.');
    };

    const handleCenterOnRoute = () => {
        if (routeData.route && routeData.route.length > 0) {
            // Центрируем на середине маршрута
            const midIndex = Math.floor(routeData.route.length / 2);
            setCenter(routeData.route[midIndex]);
            setZoom(9);
        }
    };

    const handleLayerToggle = (layerId) => {
        setActiveLayers(prev => ({
            ...prev,
            [layerId]: !prev[layerId]
        }));
    };

    const handleLayerVisibilityChange = (layerId, visible) => {
        setActiveLayers(prev => ({
            ...prev,
            [layerId]: visible
        }));
    };

    const handlePOISelect = (poi) => {
        // Центрируем карту на выбранной точке
        setCenter([poi.latitude, poi.longitude]);
        setZoom(15);
        
        // Закрываем поиск
        setIsSearchVisible(false);
        
        // Если есть аудио, запускаем его
        if (poi.audio_track) {
            handlePOIClick(poi);
        }
    };

    const handleSearchResults = (results) => {
        setSearchResults(results);
    };

    const filteredPOIs = routeData.pois.filter(poi => {
        if (!activeLayers.pois) return false;
        
        // Фильтрация по типу слоя
        if (poi.type === 'SERVICE_GAS' || poi.type === 'SERVICE_FOOD' || 
            poi.type === 'SERVICE_PARKING' || poi.type === 'SERVICE_TOILET' || 
            poi.type === 'SERVICE_MEDICAL') {
            return activeLayers.services;
        }
        
        if (poi.type === 'TRAIL_STEP') {
            return activeLayers.trail;
        }
        
        return true;
    });

    if (loading) {
        return (
            <div className="map-container">
                <div className="map-loading">
                    <div className="map-loading__spinner"></div>
                    <p>Загрузка карты...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="map-container">
            {error && (
                <div className="map-error">
                    <p>⚠️ {error}</p>
                    <button onClick={initializeMap}>Повторить</button>
                </div>
            )}
            
            <YMaps
                query={{
                    apikey: YANDEX_API_KEY,
                    lang: 'ru_RU',
                    load: 'package.full'
                }}
            >
                <YMap
                    instanceRef={mapRef}
                    state={{ center, zoom }}
                    width="100%"
                    height="100%"
                    modules={['geolocation', 'geocode']}
                    options={{
                        suppressMapOpenBlock: true,
                        yandexMapDisablePoiInteractivity: false,
                        // Отключаем стандартные элементы управления
                        controls: [],
                        // Отключаем стандартные кнопки
                        zoomMargin: 0,
                        // Отключаем стандартную геолокацию
                        suppressObsoleteBrowserNotifier: true
                    }}
                >
                    {/* Маршрут */}
                    {activeLayers.route && (
                        <RoutePolyline route={routeData.route} />
                    )}
                    
                    {/* Точки интереса */}
                    <POIMarkers 
                        pois={filteredPOIs} 
                        onPOIClick={handlePOIClick}
                    />
                    
                    {/* Пользователь */}
                    {userLocation && (
                        <Placemark 
                            geometry={userLocation}
                            options={{
                                preset: 'islands#blueCircleDotIcon',
                                iconColor: '#1e98ff'
                            }}
                            properties={{
                                hintContent: 'Ваше местоположение',
                                balloonContent: 'Вы здесь'
                            }}
                        />
                    )}
                </YMap>
            </YMaps>

            {/* Поиск POI */}
            <POISearch 
                onPOISelect={handlePOISelect}
                onSearchResults={handleSearchResults}
                userLocation={userLocation}
                isVisible={isSearchVisible}
                onToggle={setIsSearchVisible}
            />

            {/* Слои карты */}
            <MapLayers 
                activeLayers={activeLayers}
                onLayerToggle={handleLayerToggle}
                onLayerVisibilityChange={handleLayerVisibilityChange}
            />

            {/* Элементы управления */}
            <MapControls 
                mapRef={mapRef}
                userLocation={userLocation}
                isOffline={isOffline}
                onStartRoute={handleStartRoute}
                center={center}
                zoom={zoom}
            />

            {/* Аудиоплеер */}
            <AudioPlayer 
                currentAudio={currentAudio}
                onClose={handleAudioClose}
            />

            {/* Статус маршрута */}
            <RouteStatus 
                routeData={routeData}
                userLocation={userLocation}
                isRouteActive={isRouteActive}
                onStartRoute={handleStartRoute}
                onStopRoute={handleStopRoute}
            />

            {/* Информация о карте */}
            <MapInfo 
                routeData={routeData}
                userLocation={userLocation}
                isOffline={isOffline}
                onCenterOnRoute={handleCenterOnRoute}
            />

            {/* Статус геолокации */}
            {locationLoading && (
                <div className="location-indicator">
                    📍 Определение местоположения...
                </div>
            )}
            
            {locationError && (
                <div className="location-error">
                    ⚠️ {locationError}
                </div>
            )}

            {/* Статус офлайн */}
            {isOffline && (
                <div className="offline-indicator">
                    ⚠️ Офлайн режим
                </div>
            )}
        </div>
    );
};

export default Map;