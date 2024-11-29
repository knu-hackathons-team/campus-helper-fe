// src/pages/Request/List/index.tsx
import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { Plus, MapPin, User } from 'lucide-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Distance } from '@/components/common/Distance';
import { useRequestList } from '@/hooks/useRequest';
import { calculateDistance } from '@/hooks/useDistance';
import { RequestDto } from '@/api/request/types';
import { toast } from 'react-hot-toast';
import { requestApi } from '@/api/request';
import useAuthStore from '@/store/useAuthStore';
import {
  StatusBadge,
  UserBadge,
  GroupFundingBadge,
  RequestInfo,
  RequestCard,
} from '@/components/common/Request';

const ActionButton = styled.button`
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-2px);
  }
`;

const FloatingButton = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  transition: all 0.2s ease;
  z-index: 999;
  &:hover {
    transform: scale(1.05);
  }
`;

const SlideUpActions = styled.div<{ isOpen: boolean }>`
  max-height: ${(props) => (props.isOpen ? '200px' : '0')};
  transition: all 0.3s ease;
  overflow: hidden;
`;

interface RequestResponse {
  content: RequestDto[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const RequestList = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { currentLocation } = useRequestList();
  const [displayCount, setDisplayCount] = useState(5);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery<RequestResponse>({
    queryKey: ['requests'],
    queryFn: async ({ pageParam }) => {
      const response = await requestApi.getRequests(pageParam as number);
      return response;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage: RequestResponse) => {
      if (lastPage.page < lastPage.totalPages - 1) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });

  const sortedRequests = useMemo(() => {
    if (!data || !currentLocation) {
      return [];
    }

    return data.pages
      .flatMap((page) => page.content)
      .map((request) => ({
        ...request,
        distance: calculateDistance(currentLocation, {
          latitude: request.latitude,
          longitude: request.longitude,
        }),
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [data, currentLocation]);

  const displayedRequests = useMemo(() => {
    return sortedRequests.slice(0, displayCount);
  }, [sortedRequests, displayCount]);

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayCount < sortedRequests.length) {
          setDisplayCount((prev) => prev + 5);
        }
      },
      { threshold: 0.5 },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [sortedRequests.length, displayCount]);

  const handleCardClick = (id: number) => {
    setSelectedId(selectedId === id ? null : id);
  };

  const handleDelete = async (requestId: number) => {
    if (window.confirm('정말로 이 글을 삭제하시겠습니까?')) {
      try {
        await requestApi.deleteRequest(requestId);
        await refetch();
        setSelectedId(null);
        toast.success('글이 삭제되었습니다.');
      } catch (error) {
        console.error('Error deleting request:', error);
        toast.error('글 삭제에 실패했습니다.');
      }
    }
  };

  const handleWriteClick = () => {
    if (isAuthenticated) {
      navigate('/requests/new');
    } else {
      toast.error('로그인이 필요한 서비스입니다.');
      navigate('/login');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 mb-20">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        요청 목록
      </h1>

      {!currentLocation && !error && (
        <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg mb-4">
          <p className="text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
            <MapPin size={20} />
            <span>
              위치 정보를 활성화하면 현재 위치에서 가까운 순서로 정렬됩니다.
            </span>
          </p>
        </div>
      )}

      {isError && (
        <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg mb-4">
          <p className="text-red-800 dark:text-red-200">
            {error instanceof Error ? error.message : '오류가 발생했습니다'}
          </p>
        </div>
      )}

      {isLoading ? (
        <LoadingIndicator>
          <div className="spinner" />
        </LoadingIndicator>
      ) : displayedRequests.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            아직 등록된 요청이 없습니다.
          </p>
          <button
            onClick={() => navigate('/requests/new')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
          >
            <Plus size={16} />
            <span>새 요청 작성하기</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedRequests.map((request) => (
            <div key={request.id}>
              <RequestCard
                onClick={() => handleCardClick(request.id)}
                className={`bg-white dark:bg-gray-800 rounded-lg ${
                  selectedId === request.id ? '' : 'shadow-lg'
                } p-4 cursor-pointer`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    {request.college} ·
                    <div className="flex items-center">
                      <User className="w-4 h-4" />
                      {request.writer}
                    </div>
                  </span>
                  <RequestInfo
                    reward={request.reward}
                    currentParticipants={request.currentParticipants}
                    allowGroupFunding={request.allowGroupFunding}
                  />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {request.title}
                  </h2>
                  <StatusBadge status={request.processingStatus} />
                  {request.removable && <UserBadge type="owner" />}
                  {request.isWorker && <UserBadge type="worker" />}
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                  {request.content}
                </p>

                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                  {currentLocation && (
                    <Distance
                      location={{
                        latitude: request.latitude,
                        longitude: request.longitude,
                      }}
                      currentLocation={currentLocation}
                      className="text-sm text-gray-500 dark:text-gray-400"
                    />
                  )}
                  <div className="flex items-center gap-2">
                    {request.allowGroupFunding && <GroupFundingBadge />}
                    <span>
                      {new Date(request.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </RequestCard>

              <SlideUpActions
                isOpen={selectedId === request.id}
                className="bg-white dark:bg-gray-800 shadow-lg rounded-b-lg -mt-1"
              >
                <div className="p-4 space-x-3 flex justify-end">
                  <ActionButton
                    onClick={() => navigate(`/requests/${request.id}`)}
                    className="px-6 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2 transition-colors shadow-sm"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                    상세페이지 보기
                  </ActionButton>
                </div>
              </SlideUpActions>
            </div>
          ))}
        </div>
      )}

      {displayCount < sortedRequests.length && (
        <div ref={loadMoreRef} className="py-4">
          <LoadingIndicator>
            <div className="spinner" />
          </LoadingIndicator>
        </div>
      )}

      <FloatingButton
        onClick={handleWriteClick}
        className="bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-white px-6 py-3 rounded-full shadow-lg inline-flex items-center gap-2"
      >
        <span>글쓰기</span>
        <Plus size={20} />
      </FloatingButton>
    </div>
  );
};

export default RequestList;