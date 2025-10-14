// src/pages/Map/components/POIMarkers.jsx
import React from 'react';
import { Placemark } from '@pbe/react-yandex-maps';

const getPresetByType = (type) => {
  const presets = {
    'CITY': 'islands#blueCircleDotIcon',
    'POI': 'islands#darkGreenDotIcon',
    'VIEWPOINT': 'islands#redIcon',
    'SERVICE': 'islands#yellowIcon',
    'TRAIL_STEP': 'islands#hikingIcon',
    'SERVICE_GAS': 'islands#fuelIcon'
  };
  return presets[type] || 'islands#dotIcon';
};

const POIMarkers = ({ pois, onPOIClick }) => {
  return pois.map(poi => (
    <Placemark
      key={poi.id}
      geometry={poi.coordinates}
      options={{
        preset: getPresetByType(poi.type),
        iconColor: poi.type === 'TRAIL_STEP' ? '#34c759' : undefined
      }}
      properties={{
        hintContent: poi.name,
        balloonContent: `
          <div>
            <h3>${poi.name}</h3>
            <p>Тип: ${poi.type}</p>
            ${poi.audioId ? '<p>🎵 Аудиогид доступен</p>' : ''}
          </div>
        `
      }}
      onClick={() => onPOIClick && onPOIClick(poi)}
    />
  ));
};

export default POIMarkers;