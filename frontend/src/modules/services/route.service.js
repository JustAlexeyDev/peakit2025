// src/modules/services/routeService.js
import { apiService } from './apiService.js';

export class RouteService {
  static async getAllRoutes() {
    try {
      const response = await apiService.get('/routes/');
      return response.results || response;
    } catch (error) {
      console.error('Error fetching routes:', error);
      return this.getDemoRoutes();
    }
  }

  static async getRouteGeoJSON(routeId) {
    try {
      const response = await apiService.get(`/routes/${routeId}/geojson/`);
      return response;
    } catch (error) {
      console.error('Error fetching route GeoJSON:', error);
      return this.getDemoRouteGeoJSON();
    }
  }

  static getDemoRoutes() {
    return [
      {
        id: 'main_route',
        name_ru: 'Якутск → Ленские столбы',
        path_coordinates: [
          [129.73, 62.03], // Якутск
          [129.12, 61.48], // Покровск
          [127.45, 60.72]  // Ленские столбы
        ],
        waypoints: []
      }
    ];
  }

  static getDemoRouteGeoJSON() {
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            id: "main_route",
            name_ru: "Якутск → Ленские столбы",
            name_en: "Yakutsk → Lenskiye Stolby",
            name_sah: "Дьокуускай → Ленскэй тумнулар"
          },
          geometry: {
            type: "LineString",
            coordinates: [
              [129.73, 62.03],
              [129.12, 61.48],
              [127.45, 60.72]
            ]
          }
        }
      ]
    };
  }
}