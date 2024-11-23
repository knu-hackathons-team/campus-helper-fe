// src/components/common/Map/LocationSelectMapComponent.tsx
import React, { useEffect, useState } from 'react';
import { Marker, useMapEvents } from 'react-leaflet';
import BaseMapComponent, { createIcon } from './BaseMapComponent';

interface LocationSelectProps {
  onLocationSelect: (location: { latitude: number; longitude: number }) => void;
}

const LocationSelectMapComponent: React.FC<LocationSelectProps> = React.memo(({ onLocationSelect }) => {  // React.memo 추가
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([35.8892, 128.6109]); // 초기 중심점
  const [error, setError] = useState<string>('');

  // 현재 위치 가져오기
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation([latitude, longitude]);
          // 처음에만 현재 위치로 중심 이동
          if (!selectedLocation) {
            setMapCenter([latitude, longitude]);
          }
        },
        (error) => {
          setError('위치를 가져올 수 없습니다: ' + error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    }
  }, [selectedLocation]);

  // 지도 클릭 이벤트 처리
  const MapEvents = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setSelectedLocation([lat, lng]);
        setMapCenter([lat, lng]); // 클릭한 위치로 중심 이동
        onLocationSelect({ latitude: lat, longitude: lng });
      },
    });
    return null;
  };

  return (
    <div className="relative w-full h-[500px]">
      {error && (
        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-2 text-center z-10">
          {error}
        </div>
      )}
      <BaseMapComponent center={mapCenter}>
        <MapEvents />
        {currentLocation && (
          <Marker 
            position={currentLocation} 
            icon={createIcon('blue')}
            title="현재 위치"
          />
        )}
        {selectedLocation && (
          <Marker 
            position={selectedLocation} 
            icon={createIcon('red')}
            title="선택한 위치"
          />
        )}
      </BaseMapComponent>
      <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-lg shadow text-sm z-[400]">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span>현재 위치</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span>선택한 위치</span>
        </div>
      </div>
    </div>
  );
});

export default LocationSelectMapComponent;