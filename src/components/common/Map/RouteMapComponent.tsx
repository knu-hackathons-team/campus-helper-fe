// src/components/common/Map/RouteMapComponent.tsx
import React, { useEffect, useState } from 'react';
import { Marker, Polyline } from 'react-leaflet';
import { fetchRoute } from '@/api/fetchRoute';
import BaseMapComponent, { createIcon } from './BaseMapComponent';

interface RouteMapProps {
  start: {
    latitude: number;
    longitude: number;
  };
  end: {
    latitude: number;
    longitude: number;
  };
}

const RouteMapComponent: React.FC<RouteMapProps> = ({ start, end }) => {
  const [route, setRoute] = useState<[number, number][]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const getRoute = async () => {
      try {
        const routeData = await fetchRoute(start, end);
        setRoute(routeData.map(([lon, lat]: [number, number]) => [lat, lon]));
      } catch (error) {
        setError('경로를 가져오는데 실패했습니다.');
      }
    };
    getRoute();
  }, [start, end]);

  return (
    <BaseMapComponent center={[start.latitude, start.longitude]}>
      {error && (
        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-2 text-center z-10">
          {error}
        </div>
      )}
      <Marker position={[start.latitude, start.longitude]} icon={createIcon('blue')} />
      <Marker position={[end.latitude, end.longitude]} icon={createIcon('red')} />
      {route.length > 0 && <Polyline positions={route} color="blue" />}
    </BaseMapComponent>
  );
};

export default RouteMapComponent;