import { useState, useEffect } from 'react';
import { POIService } from '../services/poiService.js';
import { RouteService } from '../services/routeService.js';

export const useApiData = () => {
  const [pois, setPois] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [poisData, routesData] = await Promise.all([
        POIService.getAllPOIs(),
        RouteService.getAllRoutes()
      ]);

      setPois(poisData);
      setRoutes(routesData);
    } catch (err) {
      setError(err.message);
      console.error('Error loading API data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = () => {
    loadData();
  };

  return {
    pois,
    routes,
    isLoading,
    error,
    refreshData
  };
};