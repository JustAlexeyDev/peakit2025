import { apiService } from './apiService.js';

export class POIService {
  static async getAllPOIs() {
    try {
      const response = await apiService.get('/pois/');
      return response.results || response;
    } catch (error) {
      console.error('Error fetching POIs:', error);
      return this.getDemoPOIs();
    }
  }

  static async getPOIsByType(poiType) {
    try {
      const response = await apiService.get(`/pois/?poi_type=${poiType}`);
      return response.results || response;
    } catch (error) {
      console.error('Error fetching POIs by type:', error);
      return this.getDemoPOIs().filter(poi => poi.poi_type === poiType);
    }
  }

  static async getNearbyPOIs(lat, lng, radius = 1000) {
    try {
      const response = await apiService.get(`/pois/near/?lat=${lat}&lng=${lng}&radius=${radius}`);
      return response;
    } catch (error) {
      console.error('Error fetching nearby POIs:', error);
      return this.getDemoPOIs();
    }
  }

  static async getPOIsGeoJSON() {
    try {
      const response = await apiService.get('/pois/geojson/');
      return response;
    } catch (error) {
      console.error('Error fetching POIs GeoJSON:', error);
      return this.getDemoGeoJSON();
    }
  }

  static getDemoPOIs() {
    // Демо-данные согласно ТЗ
    return [
      {
        id: 'city_yakutsk',
        name_ru: 'Якутск',
        poi_type: 'CITY',
        coordinates: { longitude: 129.73, latitude: 62.03 },
        radius: 400,
        cooldown_sec: 7200,
        audio_track_info: { id: 'a_yakutsk_intro', title_ru: 'Введение в Якутск' }
      },
      {
        id: 'city_pokrovsk',
        name_ru: 'Покровск',
        poi_type: 'CITY',
        coordinates: { longitude: 129.12, latitude: 61.48 },
        radius: 350,
        cooldown_sec: 7200,
        audio_track_info: { id: 'a_pokrovsk_intro', title_ru: 'История Покровска' }
      },
      {
        id: 'gas_1',
        name_ru: 'АЗС №1',
        poi_type: 'SERVICE_GAS',
        coordinates: { longitude: 129.30, latitude: 61.55 },
        radius: 100,
        cooldown_sec: 7200,
        opening_hours: '08:00-22:00',
        has_parking: true
      }
    ];
  }

  static getDemoGeoJSON() {
    return {
      type: "FeatureCollection",
      features: this.getDemoPOIs().map(poi => ({
        type: "Feature",
        properties: {
          id: poi.id,
          name_ru: poi.name_ru,
          type: poi.poi_type,
          radius: poi.radius,
          cooldown_sec: poi.cooldown_sec,
          audio_id: poi.audio_track_info?.id,
          opening_hrs: poi.opening_hours,
          has_parking: poi.has_parking
        },
        geometry: {
          type: "Point",
          coordinates: [poi.coordinates.longitude, poi.coordinates.latitude]
        }
      }))
    };
  }
}