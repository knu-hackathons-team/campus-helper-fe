// src/pages/MyPage/index.tsx
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/useAuthStore';
import { User, Coins } from 'lucide-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { requestApi } from '@/api/request';
import { ProcessingStatus, RequestListResponse } from '@/api/request/types';
import styled from '@emotion/styled';

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

const MyPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userInfo = useAuthStore((state) => state.userInfo);

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
      initialPageParam: 0, // 이 부분 추가
      enabled: isAuthenticated,
    });
    
    const totalPosts = data?.pages[0]?.totalElements || 0;

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
            <StatCard
              label="작성한 요청"
              value={isLoading ? '로딩 중...' : totalPosts}
            />
            <StatCard label="수행한 요청 (하드코딩됨)" value="5" />
          </div>
        </div>
      </div>

      {/* 내 요청 목록 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          내가 작성한 요청
        </h2>

        {isLoading ? (
          <div className="text-center py-4">로딩 중...</div>
        ) : data?.pages[0].content.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            작성한 요청이 없습니다.
          </div>
        ) : (
          <div className="space-y-4">
            {data?.pages.map((page: RequestListResponse) =>
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
        )}

        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="w-full mt-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors"
          >
            {isFetchingNextPage ? '로딩 중...' : '더 보기'}
          </button>
        )}
      </div>
    </div>
  );
};

export default MyPage;
