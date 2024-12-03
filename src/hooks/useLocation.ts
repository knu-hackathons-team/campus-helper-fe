// src/hooks/useLocation.ts
import { useState, useEffect } from 'react';
import { Location } from '@/types/Location';

interface UseLocationResult {
  currentLocation: Location | null;
  isLoading: boolean;
  error: string | null;
}

export const useLocation = (): UseLocationResult => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (isMounted) {
            setCurrentLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
            setIsLoading(false);
          }
        },
        (error) => {
          if (isMounted) {
            setError('위치를 가져올 수 없습니다: ' + error.message);
            setIsLoading(false);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setError('브라우저가 위치 정보를 지원하지 않습니다.');
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  return { currentLocation, isLoading, error };
};