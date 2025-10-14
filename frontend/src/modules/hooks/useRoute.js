import { useState, useEffect } from 'react';
import { RouteService } from '../services/route.service.js';

export const useRoute = () => {
  const [routeProgress, setRouteProgress] = useState({
    currentPoint: 0,
    totalPoints: 12,
    completedPoints: [],
    isActive: false
  });
  
  const [nextPoint, setNextPoint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загружаем данные при инициализации
  useEffect(() => {
    loadRouteData();
  }, []);

  const loadRouteData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [progress, nextPointData] = await Promise.all([
        RouteService.getRouteProgress(),
        RouteService.getNextPoint()
      ]);
      
      setRouteProgress(progress);
      setNextPoint(nextPointData);
    } catch (err) {
      console.error('Error loading route data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startRoute = async () => {
    try {
      const progress = await RouteService.startRoute();
      setRouteProgress(progress);
      return progress;
    } catch (err) {
      console.error('Error starting route:', err);
      throw err;
    }
  };

  const stopRoute = async () => {
    try {
      const progress = await RouteService.stopRoute();
      setRouteProgress(progress);
      return progress;
    } catch (err) {
      console.error('Error stopping route:', err);
      throw err;
    }
  };

  const markPointCompleted = async (pointId) => {
    try {
      const progress = await RouteService.markPointCompleted(pointId);
      setRouteProgress(progress);
      
      // Обновляем следующую точку
      const nextPointData = await RouteService.getNextPoint();
      setNextPoint(nextPointData);
      
      return progress;
    } catch (err) {
      console.error('Error marking point completed:', err);
      throw err;
    }
  };

  const resetRoute = async () => {
    try {
      const progress = await RouteService.resetRoute();
      setRouteProgress(progress);
      
      // Обновляем следующую точку
      const nextPointData = await RouteService.getNextPoint();
      setNextPoint(nextPointData);
      
      return progress;
    } catch (err) {
      console.error('Error resetting route:', err);
      throw err;
    }
  };

  const refreshData = () => {
    loadRouteData();
  };

  return {
    routeProgress,
    nextPoint,
    loading,
    error,
    startRoute,
    stopRoute,
    markPointCompleted,
    resetRoute,
    refreshData
  };
};
