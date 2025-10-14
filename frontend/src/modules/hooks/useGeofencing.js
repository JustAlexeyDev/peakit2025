// src/modules/hooks/useGeofencing.js
import { useState, useEffect } from 'react';
import { Geofence } from '../models/Geofence.model.js';
import { AudioService } from '../services/audio.service.js';

export const useGeofencing = (pois, currentLocation) => {
  const [activeGeofences, setActiveGeofences] = useState([]);
  const [triggeredPOIs, setTriggeredPOIs] = useState(new Set());

  useEffect(() => {
    if (!currentLocation || !pois.length) return;

    const nearbyPOIs = pois.filter(poi => 
      poi.isNearby(currentLocation, poi.radius + 100) // Добавляем буфер
    );

    // Сортируем по приоритету согласно ТЗ
    const priorityOrder = {
      'TRAIL_STEP': 3,
      'POI': 2, 
      'CITY': 1,
      'SERVICE': 0,
      'VIEWPOINT': 0
    };

    nearbyPOIs.sort((a, b) => 
      (priorityOrder[b.type] || 0) - (priorityOrder[a.type] || 0)
    );

    // Проверяем и триггерим геозоны
    nearbyPOIs.forEach(poi => {
      const distance = poi.calculateDistance(currentLocation, poi.coordinates);
      
      if (distance <= poi.radius && !triggeredPOIs.has(poi.id)) {
        if (poi.audioId) {
          AudioService.playAudio(poi.audioId);
          setTriggeredPOIs(prev => new Set(prev).add(poi.id));
          
          // Сбрасываем триггер через cooldown
          setTimeout(() => {
            setTriggeredPOIs(prev => {
              const newSet = new Set(prev);
              newSet.delete(poi.id);
              return newSet;
            });
          }, poi.cooldown * 1000);
        }
      }
    });

    setActiveGeofences(nearbyPOIs);
  }, [currentLocation, pois]);

  return { activeGeofences, triggeredPOIs };
};