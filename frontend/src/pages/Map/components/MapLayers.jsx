import React, { useState } from 'react';
import './MapLayers.css';

const MapLayers = ({ 
  layers, 
  activeLayers, 
  onLayerToggle, 
  onLayerVisibilityChange 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const defaultLayers = [
    {
      id: 'pois',
      name: 'Точки интереса',
      icon: '📍',
      visible: true,
      type: 'poi'
    },
    {
      id: 'route',
      name: 'Маршрут',
      icon: '🛣️',
      visible: true,
      type: 'route'
    },
    {
      id: 'services',
      name: 'Сервисы',
      icon: '🏪',
      visible: true,
      type: 'service'
    },
    {
      id: 'trail',
      name: 'Экотропа',
      icon: '🥾',
      visible: true,
      type: 'trail'
    }
  ];

  const layersToShow = layers || defaultLayers;

  const handleLayerToggle = (layerId) => {
    onLayerToggle && onLayerToggle(layerId);
  };

  const handleVisibilityChange = (layerId, visible) => {
    onLayerVisibilityChange && onLayerVisibilityChange(layerId, visible);
  };

  return (
    <div className={`map-layers ${isExpanded ? 'map-layers--expanded' : ''}`}>
      <button 
        className="map-layers__toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        title="Слои карты"
      >
        <span className="map-layers__icon">🗺️</span>
        {isExpanded && <span className="map-layers__label">Слои</span>}
      </button>

      {isExpanded && (
        <div className="map-layers__content">
          <div className="map-layers__header">
            <h3>Слои карты</h3>
            <button 
              className="map-layers__close"
              onClick={() => setIsExpanded(false)}
            >
              ✕
            </button>
          </div>

          <div className="map-layers__list">
            {layersToShow.map(layer => (
              <div key={layer.id} className="map-layers__item">
                <label className="map-layers__label">
                  <input
                    type="checkbox"
                    checked={activeLayers?.[layer.id] !== false}
                    onChange={(e) => handleLayerToggle(layer.id)}
                    className="map-layers__checkbox"
                  />
                  <span className="map-layers__icon">{layer.icon}</span>
                  <span className="map-layers__name">{layer.name}</span>
                </label>
                
                <div className="map-layers__controls">
                  <button
                    className={`map-layers__visibility ${
                      layer.visible ? 'map-layers__visibility--visible' : ''
                    }`}
                    onClick={() => handleVisibilityChange(layer.id, !layer.visible)}
                    title={layer.visible ? 'Скрыть' : 'Показать'}
                  >
                    {layer.visible ? '👁️' : '🙈'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="map-layers__actions">
            <button 
              className="map-layers__action"
              onClick={() => {
                layersToShow.forEach(layer => {
                  handleLayerToggle(layer.id);
                });
              }}
            >
              Все слои
            </button>
            <button 
              className="map-layers__action"
              onClick={() => {
                layersToShow.forEach(layer => {
                  if (activeLayers?.[layer.id] !== false) {
                    handleLayerToggle(layer.id);
                  }
                });
              }}
            >
              Очистить
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapLayers;
