// src/components/common/EstimatedInfo.tsx
import React from 'react';
import { Location } from '@/types/Location';
import { calculateDistance, formatDistance } from '@/hooks/useDistance';

interface EstimatedInfoProps {
  currentLocation: Location | null;
  targetLocation: Location;
  className?: string;
  showTitle?: boolean;
  walkingSpeed?: number;
  formatOptions?: {
    distanceUnit?: 'm' | 'km';
    timeFormat?: 'short' | 'long';
  };
}

const WALKING_SPEED = 1.4; // 평균 도보 속도 (m/s)

// 예상 소요 시간 계산 함수
const calculateEstimatedTime = (distanceInMeters: number): string => {
  const timeInSeconds = distanceInMeters / WALKING_SPEED;
  const timeInMinutes = Math.round(timeInSeconds / 60);
  
  if (timeInMinutes < 1) return '1분 미만';
  if (timeInMinutes < 60) return `약 ${timeInMinutes}분`;
  
  const hours = Math.floor(timeInMinutes / 60);
  const minutes = timeInMinutes % 60;
  return `약 ${hours}시간 ${minutes > 0 ? `${minutes}분` : ''}`;
};

export const EstimatedInfo: React.FC<EstimatedInfoProps> = ({
  currentLocation,
  targetLocation,
  className = ''
}) => {
  const distance = currentLocation 
    ? calculateDistance(currentLocation, targetLocation)
    : 0;

  return (
    <div className={`p-4 bg-gray-50 dark:bg-gray-700 rounded-lg ${className}`}>
      <h2 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
        예상 정보
      </h2>
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
        <div>
          <span className="block text-gray-500 dark:text-gray-400">예상 거리</span>
          <span className="font-medium">
            {currentLocation 
              ? formatDistance(distance)
              : '위치 정보 필요'}
          </span>
        </div>
        <div>
          <span className="block text-gray-500 dark:text-gray-400">예상 소요 시간</span>
          <span className="font-medium">
            {currentLocation 
              ? calculateEstimatedTime(distance)
              : '위치 정보 필요'}
          </span>
        </div>
      </div>
    </div>
  );
};