import { apiService } from "./api.service.js";

export class MapService {
  /**
   * Получить точки интереса поблизости
   */
  static async getNearbyPOIs(lat, lng, radius = 1000) {
    try {
      const response = await apiService.get(
        `/pois/near/?lat=${lat}&lng=${lng}&radius=${radius}`
      );
      return response;
    } catch (error) {
      console.error('Error fetching nearby POIs:', error);
      throw error;
    }
  }

  /**
   * Получить аудиотрек по ID
   */
  static async getAudioTrack(audioId) {
    try {
      const response = await apiService.get(`/audio/${audioId}/`);
      return response;
    } catch (error) {
      console.error('Error fetching audio track:', error);
      throw error;
    }
  }

  /**
   * Получить конфигурацию приложения
   */
  static async getAppConfig() {
    try {
      const response = await apiService.get('/config/app_config/');
      return response;
    } catch (error) {
      console.error('Error fetching app config:', error);
      // Возвращаем дефолтную конфигурацию
      return {
        geofence_parameters: {
          city_radius: 300,
          poi_radius: 150,
          trail_radius: 30,
          cooldown_default: 7200,
          hysteresis: 20
        },
        audio_settings: {
          default_volume: -16,
          supported_formats: ['mp3', 'aac'],
          auto_pause_music: true
        },
        map_settings: {
          initial_center: [129.73, 62.03],
          initial_zoom: 10,
          offline_tile_url: '/tiles/{z}/{x}/{y}.png'
        }
      };
    }
  }

  /**
   * Получить офлайн пакет
   */
  static async getOfflinePackage(version) {
    try {
      const response = await apiService.get(`/offline-packages/${version}/download_all/`);
      return response;
    } catch (error) {
      console.error('Error fetching offline package:', error);
      throw error;
    }
  }

  /**
   * Получить все доступные офлайн пакеты
   */
  static async getOfflinePackages() {
    try {
      const response = await apiService.get('/offline-packages/');
      return response;
    } catch (error) {
      console.error('Error fetching offline packages:', error);
      throw error;
    }
  }

  /**
   * Получить маршрут в формате GeoJSON
   */
  static async getRouteGeoJSON(routeId) {
    try {
      const response = await apiService.get(`/routes/${routeId}/geojson/`);
      return response;
    } catch (error) {
      console.error('Error fetching route GeoJSON:', error);
      throw error;
    }
  }

  /**
   * Получить все маршруты
   */
  static async getRoutes() {
    try {
      const response = await apiService.get('/routes/');
      return response;
    } catch (error) {
      console.error('Error fetching routes:', error);
      throw error;
    }
  }

  /**
   * Получить точки интереса с фильтрацией
   */
  static async getPOIs(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      });
      
      const url = queryParams.toString() 
        ? `/pois/?${queryParams.toString()}`
        : '/pois/';
        
      const response = await apiService.get(url);
      return response;
    } catch (error) {
      console.error('Error fetching POIs:', error);
      throw error;
    }
  }
}
