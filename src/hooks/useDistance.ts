// src/hooks/useDistance.ts
import { useCallback } from 'react';
import { Location } from '@/types/Location';
import { useLocation } from './useLocation';

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

export const useDistance = () => {
  const { currentLocation, isLoading, error } = useLocation();

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