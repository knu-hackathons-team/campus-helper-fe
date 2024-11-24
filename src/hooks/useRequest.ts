// src/hooks/useRequest.ts

// import { mockRequests } from '@/mocks/requests'; // 뫀 데이터
import { useState, useEffect } from 'react';
import { useDistance } from './useDistance';
import { Location } from '@/types/Location';
import { requestApi } from '@/api/request';
import type { RequestDto, RequestListResponse } from '@/api/request/types';

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
  const [requestsData, setRequestsData] = useState<RequestListResponse>({
    content: [],
    page: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { currentLocation } = useDistance();

  useEffect(() => {
    const loadRequests = async () => {
      try {
        setIsLoading(true);
        const response = await requestApi.getRequests(requestsData.page);
        setRequestsData(response);  // 백엔드 응답을 그대로 저장
      } catch (err) {
        console.error('Error loading requests:', err);
        setError('요청 목록을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadRequests();
  }, [requestsData.page]);

  const setPage = (newPage: number) => {
    setRequestsData(prev => ({ ...prev, page: newPage }));
  };

  return {
    requests: requestsData.content,         // 게시글 목록
    pagination: { // currentPage 포함
      currentPage: requestsData.page,
      totalPages: requestsData.totalPages,
      totalElements: requestsData.totalElements,
      size: requestsData.size,
    },
    isLoading,
    error,
    currentLocation,
    setPage
  };
};
