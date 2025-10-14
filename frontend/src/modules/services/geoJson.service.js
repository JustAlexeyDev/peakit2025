import { PointOfInterest } from "../models/PointOfInterest.model.js";
import { apiService } from "./api.service.js";

export class GeoJsonService {
  static async loadRouteData() {
    try {
      // Сначала пробуем загрузить с бэкенда
      const [poisResponse, routesResponse] = await Promise.all([
        apiService.get('/pois/geojson/'),
        apiService.get('/routes/')
      ]);
      
      return this.parseApiData(poisResponse, routesResponse);
    } catch (error) {
      console.error('Error loading route data from API:', error);
      // Fallback на статический файл
      try {
        const response = await fetch('/route.json');
        const geoJson = await response.json();
        return this.parseGeoJson(geoJson);
      } catch (fallbackError) {
        console.error('Error loading fallback route data:', fallbackError);
        return this.getDemoData();
      }
    }
  }

  static parseApiData(poisGeoJson, routesData) {
    const pois = [];
    let route = null;

    // Проверяем, что данные существуют
    if (poisGeoJson && poisGeoJson.features) {
      // Парсим точки интереса из GeoJSON
      poisGeoJson.features.forEach(feature => {
        pois.push(new PointOfInterest(feature));
      });
    }

    // Берем первый активный маршрут
    if (routesData && routesData.length > 0) {
      const activeRoute = routesData.find(r => r.is_active);
      if (activeRoute && activeRoute.path_coordinates) {
        route = activeRoute.path_coordinates;
      }
    }

    return { pois, route };
  }

  static parseGeoJson(geoJson) {
    const pois = [];
    let route = null;

    geoJson.features.forEach(feature => {
      if (feature.geometry.type === 'Point') {
        pois.push(new PointOfInterest(feature));
      } else if (feature.geometry.type === 'LineString') {
        route = feature.geometry.coordinates;
      }
    });

    return { pois, route };
  }

  static getDemoData() {
    return {
      pois: [
        new PointOfInterest({
          type: 'Feature',
          properties: {
            id: 'city_yakutsk',
            name_ru: 'Якутск',
            type: 'CITY',
            audio_id: 'a_yakutsk_intro',
            radius: 400,
            cooldown_sec: 7200
          },
          geometry: {
            type: 'Point',
            coordinates: [62.03, 129.73]
          }
        }),
        new PointOfInterest({
          type: 'Feature',
          properties: {
            id: 'city_pokrovsk',
            name_ru: 'Покровск',
            type: 'CITY',
            audio_id: 'a_pokrovsk_intro',
            radius: 350,
            cooldown_sec: 7200
          },
          geometry: {
            type: 'Point',
            coordinates: [61.48, 129.12]
          }
        }),
      ],
      route: [
        [62.03, 129.73], // Якутск
        [61.48, 129.12], // Покровск
        [60.72, 127.45]  // Ленские столбы
      ]
    };
  }
}