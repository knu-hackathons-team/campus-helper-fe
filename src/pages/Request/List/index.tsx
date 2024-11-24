// src/pages/Request/List/index.tsx

import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { Users, Plus, MapPin, Trash } from 'lucide-react';
import { Distance } from '@/components/common/Distance';
import { useRequestList } from '@/hooks/useRequest';
import { calculateDistance } from '@/hooks/useDistance';
import { RequestDto } from '@/api/request/types'; // RequestDto 타입 사용
import { toast } from 'react-hot-toast'; // toast 추가
import { requestApi } from '@/api/request'; // requestApi import 추가

const RequestCard = styled.div`
  transition: transform 0.2s ease;
  &:hover {
    transform: translateY(-2px);
  }
`;

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
  &:hover {
    transform: scale(1.05);
  }
`;

const SlideUpActions = styled.div<{ isOpen: boolean }>`
  max-height: ${(props) => (props.isOpen ? '200px' : '0')};
  transition: all 0.3s ease;
  overflow: hidden;
`;

const RequestList = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { requests, isLoading, error, currentLocation } = useRequestList();
  // 로컬 상태로 requests 관리
  const [localRequests, setLocalRequests] = useState<RequestDto[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 5; // 페이지당 항목 수
  const navigate = useNavigate();

  // requests가 변경될 때마다 localRequests 업데이트
  useEffect(() => {
    setLocalRequests(requests);
  }, [requests]);

  // 정렬된 전체 목록
  const sortedRequests = useMemo(() => {
    if (!currentLocation || !localRequests.length) return localRequests;

    return [...localRequests].sort((a: RequestDto, b: RequestDto) => {
      const distanceA = calculateDistance(currentLocation, {
        latitude: a.latitude,
        longitude: a.longitude,
      });
      const distanceB = calculateDistance(currentLocation, {
        latitude: b.latitude,
        longitude: b.longitude,
      });
      return distanceA - distanceB;
    });
  }, [localRequests, currentLocation]);

  // 현재 페이지에 표시할 항목들
  const currentPageItems = useMemo(() => {
    const startIndex = currentPage * pageSize;
    return sortedRequests.slice(startIndex, startIndex + pageSize);
  }, [sortedRequests, currentPage]);

  // 페이지네이션 정보 계산
  const paginationInfo = useMemo(() => {
    return {
      currentPage,
      totalPages: Math.ceil(sortedRequests.length / pageSize),
      totalElements: sortedRequests.length,
      size: pageSize,
    };
  }, [sortedRequests.length, currentPage]);

  const handleCardClick = (id: number) => {
    setSelectedId(selectedId === id ? null : id);
  };

  const handleAccept = (requestId: number) => {
    navigate(`/requests/${requestId}/accept`);
  };

  const handleJoin = (requestId: number) => {
    navigate(`/requests/${requestId}/join`);
  };

  const handleDelete = async (requestId: number) => {
    if (window.confirm('정말로 이 글을 삭제하시겠습니까?')) {
      try {
        await requestApi.deleteRequest(requestId);
        // 로컬 상태에서 삭제된 항목 제거
        setLocalRequests((prev) =>
          prev.filter((request) => request.id !== requestId),
        );
        setSelectedId(null); // 선택된 카드 상태 초기화
        toast.success('글이 삭제되었습니다.');
      } catch (error) {
        console.error('Error deleting request:', error);
        toast.error('글 삭제에 실패했습니다.');
      }
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // 페이지네이션 Helper 함수
  const getPageNumbers = (current: number, total: number) => {
    const delta = 2; // 현재 페이지 앞뒤로 보여줄 페이지 수
    const left = current - delta;
    const right = current + delta + 1;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= left && i < right)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
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

      {error && (
        <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg mb-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            요청 목록을 불러오는 중...
          </p>
        </div>
      ) : requests.length === 0 ? (
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
          {currentPageItems.map((request: RequestDto) => (
            <div key={request.id}>
              <RequestCard
                onClick={() => handleCardClick(request.id)}
                className={`bg-white dark:bg-gray-800 rounded-lg ${
                  selectedId === request.id ? '' : 'shadow-lg'
                } p-4 cursor-pointer`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {request.college} · {request.writer}{' '}
                      {/* author -> writer */}
                    </span>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {request.title}
                    </h2>
                  </div>
                  <div className="text-right">
                    {/* reward만 표시하도록 수정 */}
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      {request.reward.toLocaleString()}원
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                  {request.content}
                </p>

                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                  {currentLocation && (
                    <Distance
                      location={{
                        // location 객체 구조 맞추기
                        latitude: request.latitude,
                        longitude: request.longitude,
                      }}
                      currentLocation={currentLocation}
                      className="text-sm text-gray-500 dark:text-gray-400"
                    />
                  )}
                  <div className="flex items-center gap-2">
                    {request.allowGroupFunding && (
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-xs">
                        함께하기
                      </span>
                    )}
                    <span>{new Date(request.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </RequestCard>

              <SlideUpActions
                isOpen={selectedId === request.id}
                className="bg-white dark:bg-gray-800 shadow-lg rounded-b-lg -mt-1"
              >
                <div className="p-4 space-x-3 flex justify-end">
                  {request.removable ? (
                    <ActionButton
                      onClick={() => handleDelete(request.id)} // handleDelete 함수 구현 필요
                      className="px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-full hover:bg-red-600 dark:hover:bg-red-700 flex items-center gap-2 transition-colors"
                    >
                      <Trash size={16} /> {/* Lucide 아이콘 */}글 삭제하기
                    </ActionButton>
                  ) : (
                    <>
                      <ActionButton
                        onClick={() => handleAccept(request.id)}
                        className="px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-full hover:bg-gray-700 dark:hover:bg-gray-600 flex items-center gap-2"
                      >
                        수행하기
                      </ActionButton>
                      {request.allowGroupFunding && (
                        <ActionButton
                          onClick={() => handleJoin(request.id)}
                          className="px-4 py-2 bg-blue-600 dark:bg-blue-600 text-white rounded-full hover:bg-gray-500 dark:hover:bg-gray-400 flex items-center gap-2"
                        >
                          <Users size={16} />
                          함께하기
                        </ActionButton>
                      )}
                    </>
                  )}
                </div>
              </SlideUpActions>
            </div>
          ))}
        </div>
      )}

      {/* 페이지네이션 UI */}
      {!isLoading && sortedRequests.length > 0 && (
        <div className="mt-6 flex flex-col items-center gap-2">
          <div className="text-sm text-gray-500">
            전체 {paginationInfo.totalElements}개 중{' '}
            {paginationInfo.currentPage * paginationInfo.size + 1}-
            {Math.min(
              (paginationInfo.currentPage + 1) * paginationInfo.size,
              paginationInfo.totalElements,
            )}
          </div>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className={`px-3 py-1 rounded ${
                currentPage === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              이전
            </button>

            {getPageNumbers(
              paginationInfo.currentPage + 1,
              paginationInfo.totalPages,
            ).map((pageNum, index) =>
              pageNum === '...' ? (
                <span key={`dot-${index}`} className="px-3 py-1 text-gray-500">
                  {pageNum}
                </span>
              ) : (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(Number(pageNum) - 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === Number(pageNum) - 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {pageNum}
                </button>
              ),
            )}

            <button
              onClick={() =>
                handlePageChange(
                  Math.min(paginationInfo.totalPages - 1, currentPage + 1),
                )
              }
              disabled={currentPage === paginationInfo.totalPages - 1}
              className={`px-3 py-1 rounded ${
                currentPage === paginationInfo.totalPages - 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              다음
            </button>
          </div>
        </div>
      )}

      <FloatingButton
        onClick={() => navigate('/requests/new')}
        className="bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-white px-6 py-3 rounded-full shadow-lg inline-flex items-center gap-2"
      >
        <span>글쓰기</span>
        <Plus size={20} />
      </FloatingButton>
    </div>
  );
};

export default RequestList;
