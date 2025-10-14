import React from 'react';
import './RouteStatus.css';

const RouteStatus = ({ 
  routeData, 
  userLocation, 
  isRouteActive = false,
  onStartRoute,
  onStopRoute 
}) => {
  if (!routeData || !routeData.route || routeData.route.length === 0) {
    return (
      <div className="route-status route-status--no-route">
        <div className="route-status__icon">🚫</div>
        <div className="route-status__text">
          <div className="route-status__title">Маршрут не загружен</div>
          <div className="route-status__subtitle">Обновите страницу</div>
        </div>
      </div>
    );
  }

  const routeLength = routeData.route.length;
  const hasUserLocation = !!userLocation;

  return (
    <div className={`route-status ${isRouteActive ? 'route-status--active' : ''}`}>
      <div className="route-status__icon">
        {isRouteActive ? '🚗' : '🛣️'}
      </div>
      
      <div className="route-status__content">
        <div className="route-status__title">
          {isRouteActive ? 'Маршрут активен' : 'Готов к старту'}
        </div>
        
        <div className="route-status__info">
          <div className="route-status__detail">
            📍 Точек: {routeData.pois?.length || 0}
          </div>
          <div className="route-status__detail">
            🛣️ Маршрут: {routeLength} точек
          </div>
          {hasUserLocation && (
            <div className="route-status__detail">
              📍 Ваше местоположение определено
            </div>
          )}
        </div>
        
        <div className="route-status__actions">
          {!isRouteActive ? (
            <button 
              className="route-status__btn route-status__btn--start"
              onClick={onStartRoute}
              disabled={!hasUserLocation}
            >
              🚗 Начать маршрут
            </button>
          ) : (
            <button 
              className="route-status__btn route-status__btn--stop"
              onClick={onStopRoute}
            >
              ⏹️ Остановить
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RouteStatus;
