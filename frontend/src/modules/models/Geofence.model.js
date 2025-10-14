export class Geofence {
  constructor(poi) {
    this.poi = poi;
    this.triggered = false;
    this.lastTriggered = null;
  }

  shouldTrigger() {
    if (this.triggered) return false;
    
    if (this.lastTriggered) {
      const timeSinceLastTrigger = Date.now() - this.lastTriggered;
      return timeSinceLastTrigger > (this.poi.cooldown * 1000);
    }
    
    return true;
  }

  trigger() {
    this.triggered = true;
    this.lastTriggered = Date.now();
  }

  reset() {
    this.triggered = false;
  }
}