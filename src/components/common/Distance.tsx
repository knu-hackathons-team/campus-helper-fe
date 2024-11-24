// src/components/common/Distance.tsx
import React from 'react';
import { Location } from '@/types/Location';
import { formatDistance, calculateDistance } from '@/hooks/useDistance';

interface DistanceProps {
  location: Location;
  currentLocation: Location | null;
  className?: string;
}

export const Distance: React.FC<DistanceProps> = ({
  location,
  currentLocation,
  className = ''
}) => {
  if (!currentLocation) return null;

  const distance = calculateDistance(currentLocation, location);
  
  return (
    <span className={className}>
      {formatDistance(distance)}
    </span>
  );
};