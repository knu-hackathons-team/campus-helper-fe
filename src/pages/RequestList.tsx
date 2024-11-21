import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { Users, Plus, MapPin } from 'lucide-react';
import { Distance } from '@/components/common/Distance';
import { useRequestList } from '@/hooks/useRequest';
import { Request } from '@/types/request';

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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { requests, isLoading, error, currentLocation } = useRequestList();
  const navigate = useNavigate();

  const handleCardClick = (id: string) => {
    setSelectedId(selectedId === id ? null : id);
  };

  const handleAccept = (requestId: string) => {
    navigate(`/requests/${requestId}/accept`);
  };

  const handleJoin = (requestId: string) => {
    navigate(`/requests/${requestId}/join`);
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
            <span>위치 정보를 활성화하면 현재 위치에서 가까운 순서로 정렬됩니다.</span>
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
          <p className="text-gray-600 dark:text-gray-400">요청 목록을 불러오는 중...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400 mb-4">아직 등록된 요청이 없습니다.</p>
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
          {requests.map((request: Request) => (
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
                      {request.college} · {request.author}
                    </span>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {request.title}
                    </h2>
                  </div>
                  <div className="text-right">
                    {request.allowGroupFunding ? (
                      <>
                        <div className="text-blue-600 dark:text-blue-400 font-medium">
                          {request.totalFunding.toLocaleString()}원
                          <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                            ({request.baseFunding.toLocaleString()}원 ×{' '}
                            {request.participants})
                          </span>
                        </div>
                        <div className="flex items-center justify-end gap-1 text-sm text-gray-500">
                          <Users size={14} />
                          <span>{request.participants}명 참여 중</span>
                        </div>
                      </>
                    ) : (
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        {request.baseFunding.toLocaleString()}원
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                  {request.content}
                </p>

                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                  {currentLocation && (
                    <Distance
                      location={request.location}
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
                </div>
              </SlideUpActions>
            </div>
          ))}
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