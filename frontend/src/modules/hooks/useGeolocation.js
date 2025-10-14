import { useState, useEffect, useRef } from 'react';

export const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const watchId = useRef(null);

  const defaultOptions = {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 60000,
    ...options
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      setIsLoading(false);
      return;
    }

    const handleSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      const newLocation = [latitude, longitude];
      
      setLocation(newLocation);
      setError(null);
      setIsLoading(false);
    };

    const handleError = (error) => {
      setError(error.message);
      setIsLoading(false);
    };

    // Получаем текущую позицию
    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      defaultOptions
    );

    // Запускаем отслеживание
    watchId.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      defaultOptions
    );

    return () => {
      if (watchId.current) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  return { location, error, isLoading };
};