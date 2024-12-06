import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '@/store/useAuthStore';
import { User, Coins } from 'lucide-react';
import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { requestApi } from '@/api/request';
import { ProcessingStatus, RequestListResponse } from '@/api/request/types';
import { workApi } from '@/api/work';
import { mypageApi } from '@/api/mypage';
import { fundingApi } from '@/api/funding';
import styled from '@emotion/styled';
import { useState } from 'react';
import WithdrawModal from '@/components/common/WithdrawModal';

// 파일 최상단 import 문 아래에 추가
interface BaseRequest {
  id: number;
  title: string;
  content: string;
  reward: number;
  createdAt: string;
  processingStatus: ProcessingStatus;
  college: string;
  writer: string;
  category: 'INFO' | 'HELP';
  allowGroupFunding: boolean;
}

// 페이지네이션 응답의 기본 구조
interface BasePageResponse<T> {
  content: T[];
  page: number;
  totalPages: number;
  totalElements: number;
}

// 각 요청 타입별 특화된 인터페이스
interface WrittenRequest extends BaseRequest {
  isWorker: boolean;
  finishContent: string;
}

interface AcceptedRequest extends BaseRequest {
  // 수락한 요청만의 특별한 필드가 있다면 여기에 추가
}

interface FundingRequest extends BaseRequest {
  isFunder: boolean;
}

// 각 API 응답 타입
type WrittenRequestResponse = BasePageResponse<WrittenRequest>;
type AcceptedRequestResponse = BasePageResponse<AcceptedRequest>;
type FundingRequestResponse = BasePageResponse<FundingRequest>;

interface TabConfigType {
  written: {
    title: string;
    data: InfiniteData<WrittenRequestResponse> | undefined;
    isLoading: boolean;
    hasNextPage: boolean | undefined;
    fetchNextPage: () => Promise<void>;
    isFetchingNextPage: boolean;
  };
  accepted: {
    title: string;
    data: InfiniteData<AcceptedRequestResponse> | undefined;
    isLoading: boolean;
    hasNextPage: boolean | undefined;
    fetchNextPage: () => Promise<void>;
    isFetchingNextPage: boolean;
  };
  funding: {
    title: string;
    data: InfiniteData<FundingRequestResponse> | undefined;
    isLoading: boolean;
    hasNextPage: boolean | undefined;
    fetchNextPage: () => Promise<void>;
    isFetchingNextPage: boolean;
  };
}

// 요청 카드에 호버 효과를 주기 위한 스타일 컴포넌트
const RequestCard = styled.div`
  transition: transform 0.2s ease;
  &:hover {
    transform: translateY(-2px);
  }
`;

/**
 * 처리 상태를 표시하는 뱃지 컴포넌트
 * 각 상태별로 다른 색상과 텍스트를 표시합니다
 */
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

/**
 * 통계 카드 컴포넌트
 * 활동 통계에서 각 항목을 표시하는데 사용됩니다
 */
const StatCard = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow hover:shadow-lg transition-shadow">
    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
      {value}
    </p>
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
  </div>
);

// 탭 타입 정의
type TabType = 'written' | 'accepted' | 'funding';

// URL의 탭 파라미터가 유효한 값인지 확인하는 함수
const isValidTab = (tab: string | null): tab is TabType => {
  return tab === 'written' || tab === 'accepted' || tab === 'funding';
};

const MyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // URL에서 탭 정보를 가져오고 유효성 검사
  const queryParams = new URLSearchParams(location.search);
  const urlTab = queryParams.get('tab');
  const initialTab: TabType = isValidTab(urlTab) ? urlTab : 'written';

  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userInfo = useAuthStore((state) => state.userInfo);

  // 출금 모달
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  /**
   * 탭 변경 처리 함수
   * 탭을 변경하고 URL도 함께 업데이트합니다
   */
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    navigate(`?tab=${tab}`, { replace: true });
  };

  /**
   * 포인트 충전 처리 함수
   * 포인트를 충전하고 사용자 정보를 업데이트합니다
   */
  const handleChargePoint = async () => {
    try {
      await mypageApi.getpoint();
      await useAuthStore.getState().fetchUserInfo();
    } catch (error) {
      console.error('포인트 조회 실패:', error);
    }
  };

  // 포인트 출금 모달을 여는 함수
  const handleOpenWithdrawModal = () => {
    setIsWithdrawModalOpen(true);
  };

  // 포인트 출금 모달을 닫는 함수
  const handleCloseWithdrawModal = () => {
    setIsWithdrawModalOpen(false);
  };

  // 내 요청 목록 조회
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery<
      WrittenRequestResponse,
      Error,
      InfiniteData<WrittenRequestResponse>,
      string[],
      number
    >({
      queryKey: ['myRequests'],
      queryFn: ({ pageParam = 0 }) => requestApi.getMyRequests(pageParam),
      getNextPageParam: (lastPage) =>
        lastPage.page < lastPage.totalPages - 1 ? lastPage.page + 1 : undefined,
      initialPageParam: 0,
      enabled: isAuthenticated,
    });

  // 내가 수락한 요청 목록 조회
  const {
    data: acceptedData,
    fetchNextPage: fetchNextAccepted,
    hasNextPage: hasNextAccepted,
    isFetchingNextPage: isFetchingNextAccepted,
    isLoading: isLoadingAccepted,
  } = useInfiniteQuery<
    AcceptedRequestResponse,
    Error,
    InfiniteData<AcceptedRequestResponse>,
    string[],
    number
  >({
    queryKey: ['acceptedRequests'],
    queryFn: ({ pageParam = 0 }) => workApi.getMyWorks(pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages - 1 ? lastPage.page + 1 : undefined,
    initialPageParam: 0,
    enabled: isAuthenticated,
  });

  // 내가 공동요청중인 요청 목록 조회
  const {
    data: fundingData,
    fetchNextPage: fetchNextFunding,
    hasNextPage: hasNextFunding,
    isFetchingNextPage: isFetchingNextFunding,
    isLoading: isLoadingFunding,
  } = useInfiniteQuery<
    FundingRequestResponse,
    Error,
    InfiniteData<FundingRequestResponse>,
    string[],
    number
  >({
    queryKey: ['myFundings'],
    queryFn: ({ pageParam = 0 }) => fundingApi.getMyFundings(pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages - 1 ? lastPage.page + 1 : undefined,
    initialPageParam: 0,
    enabled: isAuthenticated,
  });

  // 각 탭별 총 건수 계산
  const totalPosts = data?.pages[0]?.totalElements || 0;
  const totalAccepted = acceptedData?.pages[0]?.totalElements || 0;
  const totalFunding = fundingData?.pages[0]?.totalElements || 0;

  // 각 탭별 설정 정보
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
      title: '내가 함께하는 공동요청',
      data: fundingData,
      isLoading: isLoadingFunding,
      hasNextPage: hasNextFunding,
      fetchNextPage: fetchNextFunding,
      isFetchingNextPage: isFetchingNextFunding,
    },
  } as const; // 타입 안전성을 위해 const assertion 사용

  // 비로그인 상태일 때 로그인 유도 UI 표시
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

  /**
   * 요청 목록을 렌더링하는 함수
   * 현재 선택된 탭에 따라 적절한 데이터를 표시합니다
   */
  const renderRequests = () => {
    const currentTab = tabConfig[activeTab as keyof typeof tabConfig];

    if (currentTab.isLoading) {
      return <div className="text-center py-4">로딩 중...</div>;
    }

    if (!currentTab.data?.pages[0].content.length) {
      return (
        <div className="text-center py-4 text-gray-500">
          {`${currentTab.title}이 없습니다.`}
        </div>
      );
    }

    return (
      <>
        <div className="space-y-4">
          {currentTab.data.pages.map((page) =>
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

        {currentTab.hasNextPage && (
          <button
            onClick={() => currentTab.fetchNextPage()}
            disabled={currentTab.isFetchingNextPage}
            className="w-full mt-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors"
          >
            {currentTab.isFetchingNextPage ? '로딩 중...' : '더 보기'}
          </button>
        )}
      </>
    );
  };

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
            <div className="flex items-center gap-4">
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {userInfo.point.toLocaleString()} P
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleChargePoint}
                  className="px-4 py-1.5 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  충전하기
                </button>
                <button
                  onClick={handleOpenWithdrawModal}
                  className="px-4 py-1.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                >
                  출금하기
                </button>
              </div>
            </div>
          </div>

          <WithdrawModal
            isOpen={isWithdrawModalOpen}
            onClose={() => setIsWithdrawModalOpen(false)}
            />
        </div>

        {/* 활동 통계 섹션 */}
        <div className="p-6 bg-white dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            활동 통계
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                id: 'written',
                label: '작성한 요청',
                value: totalPosts,
                loading: isLoading,
              },
              {
                id: 'accepted',
                label: '수행한 요청',
                value: totalAccepted,
                loading: isLoadingAccepted,
              },
              {
                id: 'funding',
                label: '함께하는 공동요청',
                value: totalFunding,
                loading: isLoadingFunding,
              },
            ].map((item) => (
              <div
                key={item.id}
                onClick={() => handleTabChange(item.id as TabType)}
                className="cursor-pointer"
              >
                <StatCard
                  label={item.label}
                  value={item.loading ? '로딩 중...' : item.value}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 요청 목록 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {/* 탭 버튼 영역 */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
          {[
            { id: 'written', label: '내가 작성한 요청' },
            { id: 'accepted', label: '내가 수행한 요청' },
            { id: 'funding', label: '내가 함께하는 공동요청' },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`py-2 px-4 ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500'
              }`}
              onClick={() => handleTabChange(tab.id as TabType)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 요청 목록 표시 영역 */}
        {renderRequests()}
      </div>
    </div>
  );
};

export default MyPage;
