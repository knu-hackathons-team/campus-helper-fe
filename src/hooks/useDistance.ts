// src/hooks/useDistance.ts
import { useState, useEffect } from 'react';
import { Location } from '@/types/Location';
import { useCallback } from 'react';

// 두 지점 간의 거리를 계산하는 함수 (Haversine 공식)
export const calculateDistance = (point1: Location | null, point2: Location | null): number => {
  if (!point1 || !point2) return 0;
  
  try {
    const R = 6371e3;
    const φ1 = (point1.latitude * Math.PI) / 180;
    const φ2 = (point2.latitude * Math.PI) / 180;
    const Δφ = ((point2.latitude - point1.latitude) * Math.PI) / 180;
    const Δλ = ((point2.longitude - point1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c);
  } catch {
    return 0;
  }
};

export const formatDistance = (distance: number): string => {
  return distance < 1000
    ? `${distance}m`
    : `${(distance / 1000).toFixed(1)}km`;
};

interface UseDistanceResult {
  currentLocation: Location | null;
  isLoading: boolean;
  error: string | null;
  calculateDistanceFromCurrent: (target: Location) => number;
  formatDistance: (distance: number) => string;
}

export const useDistance = (): UseDistanceResult => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 위치 가져오기 로직
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

  // useCallback을 사용하여 함수 메모이제이션
  const calculateDistanceFromCurrent = useCallback(
    (target: Location): number => {
      return calculateDistance(currentLocation, target);
    },
    [currentLocation]
  );

  return {
    currentLocation,
    isLoading,
    error,
    calculateDistanceFromCurrent,
    formatDistance
  };
};