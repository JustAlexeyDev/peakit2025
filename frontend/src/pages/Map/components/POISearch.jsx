import React, { useState, useEffect } from 'react';
import { MapService } from '../../../modules/services/map.service.js';
import './POISearch.css';

const POISearch = ({ 
  onPOISelect, 
  onSearchResults, 
  userLocation,
  isVisible = false,
  onToggle 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [radius, setRadius] = useState(1000);

  const poiTypes = [
    { value: '', label: 'Все типы' },
    { value: 'CITY', label: 'Города' },
    { value: 'POI', label: 'Точки интереса' },
    { value: 'VIEWPOINT', label: 'Смотровые площадки' },
    { value: 'SERVICE_GAS', label: 'АЗС' },
    { value: 'SERVICE_FOOD', label: 'Кафе/Столовые' },
    { value: 'SERVICE_PARKING', label: 'Парковки' },
    { value: 'SERVICE_TOILET', label: 'Туалеты' },
    { value: 'SERVICE_MEDICAL', label: 'Медпункты' },
    { value: 'TRAIL_STEP', label: 'Экотропа' }
  ];

  useEffect(() => {
    if (searchQuery.length >= 2) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, selectedType, radius]);

  const performSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      let results = [];
      
      if (userLocation && searchQuery.length >= 2) {
        // Поиск поблизости
        const nearbyPOIs = await MapService.getNearbyPOIs(
          userLocation[0], 
          userLocation[1], 
          radius
        );
        
        // Фильтруем по типу и тексту
        results = nearbyPOIs.filter(poi => {
          const matchesType = !selectedType || poi.poi_type === selectedType;
          const matchesText = poi.name_ru.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            poi.name_en.toLowerCase().includes(searchQuery.toLowerCase());
          return matchesType && matchesText;
        });
      } else {
        // Общий поиск
        const filters = {};
        if (selectedType) filters.poi_type = selectedType;
        
        const allPOIs = await MapService.getPOIs(filters);
        results = allPOIs.filter(poi => 
          poi.name_ru.toLowerCase().includes(searchQuery.toLowerCase()) ||
          poi.name_en.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      setSearchResults(results);
      onSearchResults && onSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePOISelect = (poi) => {
    onPOISelect && onPOISelect(poi);
    setSearchQuery('');
    setSearchResults([]);
  };

  const getTypeIcon = (type) => {
    const icons = {
      'CITY': '🏙️',
      'POI': '📍',
      'VIEWPOINT': '👁️',
      'SERVICE_GAS': '⛽',
      'SERVICE_FOOD': '🍽️',
      'SERVICE_PARKING': '🅿️',
      'SERVICE_TOILET': '🚻',
      'SERVICE_MEDICAL': '🏥',
      'TRAIL_STEP': '🥾'
    };
    return icons[type] || '📍';
  };

  if (!isVisible) {
    return (
      <button 
        className="poi-search__toggle"
        onClick={() => onToggle && onToggle(true)}
        title="Поиск точек интереса"
      >
        🔍
      </button>
    );
  }

  return (
    <div className="poi-search">
      <div className="poi-search__header">
        <h3>Поиск точек интереса</h3>
        <button 
          className="poi-search__close"
          onClick={() => onToggle && onToggle(false)}
        >
          ✕
        </button>
      </div>

      <div className="poi-search__form">
        <div className="poi-search__input-group">
          <input
            type="text"
            placeholder="Введите название..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="poi-search__input"
          />
          {isSearching && <div className="poi-search__spinner"></div>}
        </div>

        <div className="poi-search__filters">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="poi-search__select"
          >
            {poiTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          {userLocation && (
            <div className="poi-search__radius">
              <label>Радиус: {radius}м</label>
              <input
                type="range"
                min="100"
                max="5000"
                step="100"
                value={radius}
                onChange={(e) => setRadius(parseInt(e.target.value))}
                className="poi-search__range"
              />
            </div>
          )}
        </div>
      </div>

      <div className="poi-search__results">
        {searchResults.length > 0 ? (
          <div className="poi-search__list">
            {searchResults.map(poi => (
              <div 
                key={poi.id} 
                className="poi-search__item"
                onClick={() => handlePOISelect(poi)}
              >
                <div className="poi-search__item-icon">
                  {getTypeIcon(poi.poi_type)}
                </div>
                <div className="poi-search__item-content">
                  <div className="poi-search__item-name">
                    {poi.name_ru}
                  </div>
                  <div className="poi-search__item-type">
                    {poiTypes.find(t => t.value === poi.poi_type)?.label || poi.poi_type}
                  </div>
                  {poi.audio_track && (
                    <div className="poi-search__item-audio">
                      🎵 Аудиогид
                    </div>
                  )}
                </div>
                <div className="poi-search__item-action">
                  →
                </div>
              </div>
            ))}
          </div>
        ) : searchQuery.length >= 2 && !isSearching ? (
          <div className="poi-search__empty">
            <p>Ничего не найдено</p>
            <small>Попробуйте изменить запрос или фильтры</small>
          </div>
        ) : (
          <div className="poi-search__placeholder">
            <p>Введите название точки интереса</p>
            <small>Начните вводить для поиска</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default POISearch;
