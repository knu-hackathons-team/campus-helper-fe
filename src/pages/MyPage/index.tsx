import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/useAuthStore';
import { User, Coins } from 'lucide-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { requestApi } from '@/api/request';
import { ProcessingStatus, RequestListResponse } from '@/api/request/types';
import { workApi } from '@/api/work';
import { fundingApi } from '@/api/funding';
import styled from '@emotion/styled';
import { useState } from 'react';

const RequestCard = styled.div`
  transition: transform 0.2s ease;
  &:hover {
    transform: translateY(-2px);
  }
`;

const StatusBadge = ({ status }: { status: ProcessingStatus }) => {
  const statusConfig = {
    [ProcessingStatus.NOT_STARTED]: {
      color: 'bg-yellow-100 text-yellow-800',
      text: '대기 중',
    },
    [ProcessingStatus.IN_PROGRESS]: {
      color: 'bg-blue-100 text-blue-800',
      text: '진행 중',
    },
    [ProcessingStatus.COMPLETED]: {
      color: 'bg-green-100 text-green-800',
      text: '완료',
    },
  };

  const config = statusConfig[status];

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${config.color}`}>
      {config.text}
    </span>
  );
};

const StatCard = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
      {value}
    </p>
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
  </div>
);

type TabType = 'written' | 'accepted' | 'funding';

const MyPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userInfo = useAuthStore((state) => state.userInfo);
  const [activeTab, setActiveTab] = useState<TabType>('written');

  // 내 요청 목록 가져오기
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ['myRequests'],
      queryFn: ({ pageParam }) => requestApi.getMyRequests(pageParam as number),
      getNextPageParam: (lastPage: RequestListResponse) => {
        if (lastPage.page < lastPage.totalPages - 1) {
          return lastPage.page + 1;
        }
        return undefined;
      },
      initialPageParam: 0,
      enabled: isAuthenticated,
    });

  // 내가 수락한 요청 목록 가져오기
  const {
    data: acceptedData,
    fetchNextPage: fetchNextAccepted,
    hasNextPage: hasNextAccepted,
    isFetchingNextPage: isFetchingNextAccepted,
    isLoading: isLoadingAccepted,
  } = useInfiniteQuery({
    queryKey: ['acceptedRequests'],
    queryFn: ({ pageParam }) => workApi.getMyWorks(pageParam as number),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages - 1) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 0,
    enabled: isAuthenticated,
  });

  // 내가 펀딩중인 요청 목록 가져오기
  const {
    data: fundingData,
    fetchNextPage: fetchNextFunding,
    hasNextPage: hasNextFunding,
    isFetchingNextPage: isFetchingNextFunding,
    isLoading: isLoadingFunding,
  } = useInfiniteQuery({
    queryKey: ['myFundings'],
    queryFn: ({ pageParam }) => fundingApi.getMyFundings(pageParam as number),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages - 1) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 0,
    enabled: isAuthenticated,
  });

  const totalPosts = data?.pages[0]?.totalElements || 0;
  const totalAccepted = acceptedData?.pages[0]?.totalElements || 0;
  const totalFunding = fundingData?.pages[0]?.totalElements || 0;

  const tabConfig = {
    written: {
      title: '내가 작성한 요청',
      data,
      isLoading,
      hasNextPage,
      fetchNextPage,
      isFetchingNextPage,
    },
    accepted: {
      title: '내가 수행한 요청',
      data: acceptedData,
      isLoading: isLoadingAccepted,
      hasNextPage: hasNextAccepted,
      fetchNextPage: fetchNextAccepted,
      isFetchingNextPage: isFetchingNextAccepted,
    },
    funding: {
      title: '내가 펀딩중인 요청',
      data: fundingData,
      isLoading: isLoadingFunding,
      hasNextPage: hasNextFunding,
      fetchNextPage: fetchNextFunding,
      isFetchingNextPage: isFetchingNextFunding,
    },
  };

  // 인증되지 않은 경우 로그인 유도 UI 표시
  if (!isAuthenticated || !userInfo) {
    return (
      <div className="max-w-2xl mx-auto py-6 px-4">
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            로그인이 필요합니다
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            마이페이지를 확인하려면 먼저 로그인해주세요
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            로그인하기
          </button>
        </div>
      </div>
    );
  }

  const renderRequests = () => {
    const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
      tabConfig[activeTab];

    if (isLoading) {
      return <div className="text-center py-4">로딩 중...</div>;
    }

    if (data?.pages[0].content.length === 0) {
      return (
        <div className="text-center py-4 text-gray-500">
          {activeTab === 'written'
            ? '작성한 요청이 없습니다.'
            : '수행한 요청이 없습니다.'}
        </div>
      );
    }

    return (
      <>
        <div className="space-y-4">
          {data?.pages.map((page) =>
            page.content.map((request) => (
              <RequestCard
                key={request.id}
                className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 cursor-pointer"
                onClick={() => navigate(`/requests/${request.id}`)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      {request.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {request.content}
                    </p>
                  </div>
                  <StatusBadge status={request.processingStatus} />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    {new Date(request.createdAt).toLocaleString()}
                  </span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {request.reward.toLocaleString()}원
                  </span>
                </div>
              </RequestCard>
            )),
          )}
        </div>

        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="w-full mt-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors"
          >
            {isFetchingNextPage ? '로딩 중...' : '더 보기'}
          </button>
        )}
      </>
    );
  };

  // 인증된 경우 마이페이지 컨텐츠 표시
  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        마이페이지
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6">
        {/* 프로필 섹션 */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {userInfo.nickname}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                {userInfo.college}
              </p>
            </div>
          </div>
        </div>

        {/* 포인트 섹션 */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-600 dark:text-gray-300">
                보유 포인트
              </span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {userInfo.point.toLocaleString()} P
            </span>
          </div>
        </div>

        {/* 활동 통계 섹션 */}
        <div className="p-6 bg-gray-50 dark:bg-gray-900">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            활동 통계
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => setActiveTab('written')}
              className="cursor-pointer"
            >
              <StatCard
                label="작성한 요청"
                value={isLoading ? '로딩 중...' : totalPosts}
              />
            </div>
            <div
              onClick={() => setActiveTab('accepted')}
              className="cursor-pointer"
            >
              <StatCard
                label="수행한 요청"
                value={isLoadingAccepted ? '로딩 중...' : totalAccepted}
              />
            </div>
            <div
              onClick={() => setActiveTab('funding')}
              className="cursor-pointer"
            >
              <StatCard
                label="펀딩중인 요청"
                value={isLoadingAccepted ? '로딩 중...' : totalAccepted}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 요청 목록 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
          <button
            className={`py-2 px-4 ${
              activeTab === 'written'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('written')}
          >
            내가 작성한 요청
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === 'accepted'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('accepted')}
          >
            내가 수행한 요청
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === 'funding'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('funding')}
          >
            내가 펀딩중인 요청
          </button>
        </div>

        {renderRequests()}
      </div>
    </div>
  );
};

export default MyPage;
