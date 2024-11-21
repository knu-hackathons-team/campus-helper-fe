// src/hooks/useRequest.ts
import { useState, useEffect } from 'react';
import { Request } from '@/types/request';
import { mockRequests } from '@/mocks/requests';
import { useDistance } from './useDistance';
import { Location } from '@/types/Location';

interface UseRequestResult {
  request: Request | undefined;
  isLoading: boolean;
  error: string | null;
  currentLocation: Location | null;
}

interface UseRequestListResult {
  requests: Request[];
  isLoading: boolean;
  error: string | null;
  currentLocation: Location | null;
}

// 단일 요청 조회
export const useRequest = (id: string | undefined): UseRequestResult => {
  const [request, setRequest] = useState<Request | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentLocation, isLoading: locationLoading, error: locationError } = useDistance();

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    try {
      const savedRequests = JSON.parse(localStorage.getItem('requests') || '[]');
      const allRequests = [...mockRequests, ...savedRequests];
      const found = allRequests.find(req => req.id === id);
      
      if (found) {
        setRequest(found);
      } else {
        setError('요청을 찾을 수 없습니다.');
      }
    } catch (err) {
      setError('데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  return {
    request,
    isLoading: isLoading || locationLoading,
    error: error || locationError,
    currentLocation
  };
};

// 요청 목록 조회
export const useRequestList = (): UseRequestListResult => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { 
    currentLocation, 
    isLoading: locationLoading, 
    error: locationError,
    calculateDistanceFromCurrent 
  } = useDistance();

  useEffect(() => {
    let isMounted = true;
    
    const loadRequests = async () => {
      try {
        let allRequests = [...mockRequests];
        const savedRequestsString = localStorage.getItem('requests');
        
        if (savedRequestsString) {
          const savedRequests = JSON.parse(savedRequestsString);
          allRequests = [...allRequests, ...savedRequests];
        }

        if (currentLocation) {
          allRequests.sort((a, b) => {
            const distanceA = calculateDistanceFromCurrent(a.location);
            const distanceB = calculateDistanceFromCurrent(b.location);
            return distanceA - distanceB;
          });
        } else {
          allRequests.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }

        if (isMounted) {
          setRequests(allRequests);
          setError(null);
        }
      } catch (err) {
        console.error('Error loading requests:', err);
        if (isMounted) {
          setError('요청 목록을 불러오는데 실패했습니다.');
          setRequests([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadRequests();

    return () => {
      isMounted = false;
    };
  }, [currentLocation]); // calculateDistanceFromCurrent 제거

  return {
    requests,
    isLoading: isLoading || locationLoading,
    error: error || locationError,
    currentLocation
  };
};