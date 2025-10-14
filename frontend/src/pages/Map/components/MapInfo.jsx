import React, { useState } from 'react';
import './MapInfo.css';

const MapInfo = ({ 
  routeData, 
  userLocation, 
  isOffline,
  onCenterOnRoute 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const poiCount = routeData?.pois?.length || 0;
  const hasRoute = routeData?.route?.length > 0;

  return (
    <div className={`map-info ${isExpanded ? 'map-info--expanded' : ''}`}>
      <button 
        className="map-info__toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        title="Информация о карте"
      >
        <span className="map-info__icon">ℹ️</span>
        {isExpanded && <span className="map-info__label">Инфо</span>}
      </button>

      {isExpanded && (
        <div className="map-info__content">
          <div className="map-info__header">
            <h3>Информация о карте</h3>
            <button 
              className="map-info__close"
              onClick={() => setIsExpanded(false)}
            >
              ✕
            </button>
          </div>

          <div className="map-info__stats">
            <div className="map-info__stat">
              <span className="map-info__stat-icon">📍</span>
              <span className="map-info__stat-label">Точек интереса:</span>
              <span className="map-info__stat-value">{poiCount}</span>
            </div>

            <div className="map-info__stat">
              <span className="map-info__stat-icon">🛣️</span>
              <span className="map-info__stat-label">Маршрутов:</span>
              <span className="map-info__stat-value">{hasRoute ? '1' : '0'}</span>
            </div>

            <div className="map-info__stat">
              <span className="map-info__stat-icon">📍</span>
              <span className="map-info__stat-label">Ваше местоположение:</span>
              <span className="map-info__stat-value">
                {userLocation ? 'Определено' : 'Не определено'}
              </span>
            </div>

            <div className="map-info__stat">
              <span className="map-info__stat-icon">🌐</span>
              <span className="map-info__stat-label">Режим:</span>
              <span className="map-info__stat-value">
                {isOffline ? 'Офлайн' : 'Онлайн'}
              </span>
            </div>
          </div>

          {hasRoute && (
            <div className="map-info__actions">
              <button 
                className="map-info__action"
                onClick={onCenterOnRoute}
              >
                🎯 Центрировать на маршруте
              </button>
            </div>
          )}

          <div className="map-info__help">
            <h4>Как пользоваться:</h4>
            <ul>
              <li>🔍 Используйте поиск для нахождения точек</li>
              <li>🗺️ Управляйте слоями карты</li>
              <li>📍 Кликайте по точкам для аудиогидов</li>
              <li>🚗 Нажмите "Старт" для начала маршрута</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapInfo;
