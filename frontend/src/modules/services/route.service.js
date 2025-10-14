import { apiService } from "./api.service.js";

export class RouteService {
  /**
   * Получить текущий прогресс маршрута
   */
  static async getRouteProgress() {
    try {
      // В реальном приложении это будет API запрос
      // Пока используем localStorage для хранения прогресса
      const progress = localStorage.getItem('routeProgress');
      if (progress) {
        return JSON.parse(progress);
      }
      
      // Возвращаем дефолтный прогресс
      return {
        currentPoint: 0,
        totalPoints: 12,
        completedPoints: [],
        currentRoute: null,
        isActive: false
      };
    } catch (error) {
      console.error('Error fetching route progress:', error);
      return {
        currentPoint: 0,
        totalPoints: 12,
        completedPoints: [],
        currentRoute: null,
        isActive: false
      };
    }
  }

  /**
   * Обновить прогресс маршрута
   */
  static async updateRouteProgress(progress) {
    try {
      localStorage.setItem('routeProgress', JSON.stringify(progress));
      return progress;
    } catch (error) {
      console.error('Error updating route progress:', error);
      throw error;
    }
  }

  /**
   * Получить следующую точку маршрута
   */
  static async getNextPoint() {
    try {
      const progress = await this.getRouteProgress();
      
      // Получаем все POI с сервера
      const pois = await apiService.get('/pois/');
      
      if (progress.currentPoint < pois.length) {
        const nextPOI = pois[progress.currentPoint];
        return {
          id: nextPOI.id,
          name: nextPOI.name_ru,
          distance: this.calculateDistance(nextPOI),
          time: this.calculateTime(nextPOI),
          coordinates: [nextPOI.latitude, nextPOI.longitude],
          hasAudio: !!nextPOI.audio_track
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting next point:', error);
      // Возвращаем дефолтную точку
      return {
        id: 'pokrovsk',
        name: 'Покровск',
        distance: '15 км',
        time: '20 мин',
        coordinates: [61.48, 129.12],
        hasAudio: true
      };
    }
  }

  /**
   * Отметить точку как пройденную
   */
  static async markPointCompleted(pointId) {
    try {
      const progress = await this.getRouteProgress();
      
      if (!progress.completedPoints.includes(pointId)) {
        progress.completedPoints.push(pointId);
        progress.currentPoint = Math.min(progress.currentPoint + 1, progress.totalPoints - 1);
        
        await this.updateRouteProgress(progress);
      }
      
      return progress;
    } catch (error) {
      console.error('Error marking point completed:', error);
      throw error;
    }
  }

  /**
   * Начать маршрут
   */
  static async startRoute() {
    try {
      const progress = await this.getRouteProgress();
      progress.isActive = true;
      progress.startTime = new Date().toISOString();
      
      await this.updateRouteProgress(progress);
      return progress;
    } catch (error) {
      console.error('Error starting route:', error);
      throw error;
    }
  }

  /**
   * Остановить маршрут
   */
  static async stopRoute() {
    try {
      const progress = await this.getRouteProgress();
      progress.isActive = false;
      progress.endTime = new Date().toISOString();
      
      await this.updateRouteProgress(progress);
      return progress;
    } catch (error) {
      console.error('Error stopping route:', error);
      throw error;
    }
  }

  /**
   * Сбросить прогресс маршрута
   */
  static async resetRoute() {
    try {
      const progress = {
        currentPoint: 0,
        totalPoints: 12,
        completedPoints: [],
        currentRoute: null,
        isActive: false
      };
      
      await this.updateRouteProgress(progress);
      return progress;
    } catch (error) {
      console.error('Error resetting route:', error);
      throw error;
    }
  }

  /**
   * Вычислить расстояние до точки (упрощенный расчет)
   */
  static calculateDistance(poi) {
    // В реальном приложении здесь будет расчет расстояния от текущего местоположения
    const distances = {
      'city_yakutsk': '0 км',
      'city_pokrovsk': '15 км',
      'lenskie_stolby_main': '45 км',
      'gas_station_1': '8 км',
      'cafe_1': '12 км'
    };
    
    return distances[poi.id] || '10 км';
  }

  /**
   * Вычислить время до точки
   */
  static calculateTime(poi) {
    // В реальном приложении здесь будет расчет времени с учетом дорог
    const times = {
      'city_yakutsk': '0 мин',
      'city_pokrovsk': '20 мин',
      'lenskie_stolby_main': '1 ч 30 мин',
      'gas_station_1': '10 мин',
      'cafe_1': '15 мин'
    };
    
    return times[poi.id] || '15 мин';
  }

  /**
   * Получить статистику маршрута
   */
  static async getRouteStats() {
    try {
      const progress = await this.getRouteProgress();
      const totalDistance = 120; // км
      const totalTime = 180; // минут
      
      return {
        completed: progress.completedPoints.length,
        total: progress.totalPoints,
        progress: (progress.completedPoints.length / progress.totalPoints) * 100,
        totalDistance,
        totalTime,
        isActive: progress.isActive
      };
    } catch (error) {
      console.error('Error getting route stats:', error);
      return {
        completed: 0,
        total: 12,
        progress: 0,
        totalDistance: 120,
        totalTime: 180,
        isActive: false
      };
    }
  }
}