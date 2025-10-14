// src/pages/Map/components/MapControls.jsx
import React from 'react';
import './MapControls.css';

const MapControls = ({ 
  mapRef, 
  userLocation, 
  onStartRoute, 
  isOffline,
  onZoomIn,
  onZoomOut,
  center,
  zoom
}) => {
  
  const handleCurrentPosition = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.setCenter(userLocation, 12);
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const newLocation = [latitude, longitude];
            if (mapRef.current) {
              mapRef.current.setCenter(newLocation, 12);
            }
          },
          (error) => {
            console.error('Geolocation error:', error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          }
        );
      } else {
        console.error('Геолокация не поддерживается вашим браузером');
      }
    }
  };

  const handleZoomIn = () => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom();
      mapRef.current.setZoom(currentZoom + 1, { duration: 300 });
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom();
      mapRef.current.setZoom(currentZoom - 1, { duration: 300 });
    }
  };

  const handleResetView = () => {
    if (mapRef.current) {
      // Возвращаем к начальному виду (Якутск)
      mapRef.current.setCenter([62.03, 129.73], 8, { duration: 500 });
    }
  };

  return (
    <div className="map-controls">
      {/* Кнопка старта маршрута */}
      {/* <button 
        className="map-controls__btn map-controls__btn--primary"
        onClick={onStartRoute}
        title="Начать маршрут"
      >
        🚗 Старт
      </button> */}

      {/* Основные элементы управления */}
      <div className="map-controls__group">
        <button 
          className="map-controls__btn map-controls__btn--location"
          onClick={handleCurrentPosition}
          title="Текущее местоположение"
        >
          {userLocation ? '📍' : '🔍'}
        </button>
        
        <div className="map-controls__zoom">
          <button 
            className="map-controls__btn map-controls__btn--zoom-in"
            onClick={handleZoomIn}
            title="Увеличить"
          >
            +
          </button>
          <button 
            className="map-controls__btn map-controls__btn--zoom-out"
            onClick={handleZoomOut}
            title="Уменьшить"
          >
            -
          </button>
        </div>
        
        <button 
          className="map-controls__btn map-controls__btn--reset"
          onClick={handleResetView}
          title="Сбросить вид"
        >
          🏠
        </button>
      </div>

      {/* Индикатор офлайн режима */}
      {isOffline && (
        <div className="map-controls__offline">
          ⚡ Офлайн
        </div>
      )}
    </div>
  );
};

export default MapControls;