import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchRoute } from '../../../api/fetchRoute';

interface MapComponentProps {
  start: {
    latitude: number;
    longitude: number;
  };
  end: {
    latitude: number;
    longitude: number;
  };
}

const MapComponent: React.FC<MapComponentProps> = ({ start, end }) => {
  const [route, setRoute] = useState<[number, number][]>([]); // 경로 데이터

  useEffect(() => {
    const getRoute = async () => {
      const routeData = await fetchRoute(start, end);
      setRoute(routeData.map(([lon, lat]: [number, number]) => [lat, lon])); // 좌표 변환 (위도, 경도 순서로 변경)
    };
    getRoute();
  }, [start, end]);

  return (
    <div
      style={{
        width: '100%',
        height: '500px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <MapContainer
        style={{ width: '100%', height: '100%' }}
        center={[start.latitude, start.longitude]}
        zoom={17}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* 출발 마커 */}
        <Marker position={[start.latitude, start.longitude]} />
        {/* 도착 마커 */}
        <Marker position={[end.latitude, end.longitude]} />
        {/* 경로 표시 */}
        {route.length > 0 && <Polyline positions={route} color="blue" />}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
