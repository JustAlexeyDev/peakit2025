import { PointOfInterest } from "../models/PointOfInterest.model.js";

export class GeoJsonService {
  static async loadRouteData() {
    try {
      const response = await fetch('./route.json');
      const geoJson = await response.json();
      return this.parseGeoJson(geoJson);
    } catch (error) {
      console.error('Error loading route data:', error);
      return this.getDemoData();
    }
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
            coordinates: [129.73, 62.03]
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
            coordinates: [129.12, 61.48]
          }
        }),
      ],
      route: [
        [129.73, 62.03], // Якутск
        [129.12, 61.48], // Покровск
        [127.45, 60.72]  // Ленские столбы
      ]
    };
  }
}