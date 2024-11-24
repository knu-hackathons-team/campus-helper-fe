// src/hooks/useRequest.ts

// import { mockRequests } from '@/mocks/requests'; // 뫀 데이터
import { useState, useEffect, useMemo } from 'react';
import { useDistance, calculateDistance } from './useDistance';
import { Location } from '@/types/Location';
import { requestApi } from '@/api/request';
import type { RequestDto } from '@/api/request/types';

interface UseRequestListResult {
  requests: RequestDto[];
  isLoading: boolean;
  error: string | null;
  currentLocation: Location | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    size: number;
  };
  setPage: (page: number) => void;
}
interface UseRequestResult {
  request: RequestDto | undefined; // Request -> RequestDto로 변경
  isLoading: boolean;
  error: string | null;
  currentLocation: Location | null;
}

// 단일 요청 조회
export const useRequest = (id: string | undefined): UseRequestResult => {
  const [request, setRequest] = useState<RequestDto | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {
    currentLocation,
    isLoading: locationLoading,
    error: locationError,
  } = useDistance();

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const fetchRequest = async () => {
      try {
        setIsLoading(true);
        const response = await requestApi.getRequestById(Number(id));
        setRequest(response);
        setError(null);
      } catch (err) {
        console.error('Error fetching request:', err);
        setError('요청을 불러오는데 실패했습니다.');
        setRequest(undefined);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequest();
  }, [id]);

  return {
    request,
    isLoading: isLoading || locationLoading,
    error: error || locationError,
    currentLocation,
  };
};

// 요청 목록 조회
export const useRequestList = (): UseRequestListResult => {
  const [allRequests, setAllRequests] = useState<RequestDto[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 5;

  const { currentLocation } = useDistance();

  // 전체 데이터 로드
  useEffect(() => {
    const loadAllRequests = async () => {
      try {
        setIsLoading(true);
        const response = await requestApi.getRequests(0, 1000); // 큰 size로 모든 데이터 요청
        setAllRequests(response.content);
      } catch (err) {
        console.error('Error loading requests:', err);
        setError('요청 목록을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadAllRequests();
  }, []); // 페이지 번호 의존성 제거

  // 거리순으로 정렬된 요청 목록
  const sortedRequests = useMemo(() => {
    if (!currentLocation) return allRequests;

    return [...allRequests].sort((a, b) => {
      const distanceA = calculateDistance(currentLocation, {
        latitude: a.latitude,
        longitude: a.longitude
      });
      const distanceB = calculateDistance(currentLocation, {
        latitude: b.latitude,
        longitude: b.longitude
      });
      return distanceA - distanceB;
    });
  }, [allRequests, currentLocation]);

  // 현재 페이지의 요청 목록
  const paginatedRequests = useMemo(() => {
    const startIndex = currentPage * pageSize;
    return sortedRequests.slice(startIndex, startIndex + pageSize);
  }, [sortedRequests, currentPage]);

  // 페이지 변경 핸들러
  const setPage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return {
    requests: paginatedRequests,
    pagination: {
      currentPage,
      totalPages: Math.ceil(sortedRequests.length / pageSize),
      totalElements: sortedRequests.length,
      size: pageSize,
    },
    isLoading,
    error,
    currentLocation,
    setPage
  };
};