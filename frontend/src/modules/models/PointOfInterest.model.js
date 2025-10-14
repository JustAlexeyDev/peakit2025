export class PointOfInterest {
  constructor(feature) {
    this.id = feature.properties.id;
    this.name = feature.properties.name_ru;
    this.type = feature.properties.type;
    this.coordinates = feature.geometry.coordinates;
    this.radius = feature.properties.radius || 100;
    this.audioId = feature.properties.audio_id;
    this.cooldown = feature.properties.cooldown_sec || 7200;
  }

  isNearby(userCoords, threshold = 500) {
    const distance = this.calculateDistance(userCoords, this.coordinates);
    return distance <= threshold;
  }

  calculateDistance(coord1, coord2) {
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;
    
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}