// src/components/common/Map/BaseMapComponent.tsx

/*
BaseMapComponent: 기본적인 지도 설정과 공통 기능
RouteMapComponent: 경로 표시에 특화
LocationSelectMapComponent: 위치 선택에 특화

공통 로직은 BaseMapComponent에서 관리
각 특화된 컴포넌트는 필요한 기능만 추가

각 컴포넌트의 역할이 명확히 구분됨
기능 추가나 수정이 용이
*/
import React from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 마커 아이콘 설정
export const createIcon = (color: string) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize: [41, 41]
  });
};

// 지도 중심 변경을 위한 컴포넌트
export const ChangeView = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  map.setView(center);
  return null;
};

interface BaseMapProps {
  center: [number, number];
  zoom?: number;
  children?: React.ReactNode;
}

const BaseMapComponent: React.FC<BaseMapProps> = ({ 
  center,
  zoom = 17,
  children 
}) => {
  return (
    <div style={{ width: '100%', height: '500px', position: 'relative', zIndex: 1 }}>
      <MapContainer
        style={{ width: '100%', height: '100%' }}
        center={center}
        zoom={zoom}
      >
        <ChangeView center={center} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {children}
      </MapContainer>
    </div>
  );
};

export default BaseMapComponent;