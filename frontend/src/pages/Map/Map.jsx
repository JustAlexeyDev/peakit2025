// src/pages/Map/Map.jsx
import React, { useState, useEffect, useRef } from "react";
import { YMaps, Map as YMap } from '@pbe/react-yandex-maps';
import { useGeolocation } from "../../modules/hooks/useGeolocation.js";
import { useGeofencing } from "../../modules/hooks/useGeofencing.js";
import { GeoJsonService } from "../../modules/services/geoJson.service.js";
import RoutePolyline from "./components/RoutePolyline.jsx";
import POIMarkers from "./components/POIMarkers.jsx";
import AudioPlayer from "./components/AudioPlayer/AudioPlayer.jsx";
import MapControls from "./components/MapControls/MapControls.jsx";
import LoginForm from "../../components/auth/LoginForm.jsx";
import { useAuth } from "../../modules/hooks/useAuth.js";
import "./Map.css";

const Map = () => {
    const [center, setCenter] = useState([61.104872, 127.357230]);
    const [zoom, setZoom] = useState(5);
    const [routeData, setRouteData] = useState({ pois: [], route: [] });
    const [currentAudio, setCurrentAudio] = useState(null);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const { isAuthenticated } = useAuth();

    const { location: userLocation, error: locationError } = useGeolocation();
    const { activeGeofences } = useGeofencing(routeData.pois, userLocation);
    
    const mapRef = useRef(null);
    const YANDEX_API_KEY = "c95443f0-171f-4dfc-aec8-6ae413b5bb3e";

    useEffect(() => {
        loadRouteData();
        setupOfflineDetection();
    }, []);

    useEffect(() => {
        if (userLocation) {
            setCenter(userLocation);
            setZoom(12);
        }
    }, [userLocation]);

    const loadRouteData = async () => {
        const data = await GeoJsonService.loadRouteData();
        setRouteData(data);
    };

    const setupOfflineDetection = () => {
        window.addEventListener('online', () => setIsOffline(false));
        window.addEventListener('offline', () => setIsOffline(true));
    };

    const handlePOIClick = (poi) => {
        if (!isAuthenticated) return;
        if (poi.audioId) {
            setCurrentAudio({
                ...poi,
                audioId: poi.audioId
            });
        }
    };

    const handleAudioClose = () => {
        setCurrentAudio(null);
    };

    const handleStartRoute = () => {
        if (routeData.route && routeData.route.length > 0) {
            setCenter(routeData.route[0]);
            setZoom(10);
        }
    };

    return (
        <div className="map-container">
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
                >
                    {/* Маршрут */}
                    <RoutePolyline route={routeData.route} />
                    
                    {/* Точки интереса */}
                    <POIMarkers 
                        pois={routeData.pois} 
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

            {/* Элементы управления */}
            <MapControls 
                mapRef={mapRef}
                userLocation={userLocation}
                onStartRoute={isAuthenticated ? handleStartRoute : undefined}
                isOffline={isOffline}
            />

            {/* Аудиоплеер */}
            {isAuthenticated && (
                <AudioPlayer 
                    currentAudio={currentAudio}
                    onClose={handleAudioClose}
                />
            )}

            {/* Статус офлайн */}
            {isOffline && (
                <div className="offline-indicator">
                    ⚠️ Офлайн режим
                </div>
            )}

            {/* Оверлей авторизации */}
            {!isAuthenticated && (
                <div className="auth-overlay">
                    <div className="auth-overlay__inner">
                        <h3>Войдите, чтобы пользоваться онлайн-функциями</h3>
                        <LoginForm />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Map;