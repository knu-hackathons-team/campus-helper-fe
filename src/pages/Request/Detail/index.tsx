import { useParams, useNavigate } from 'react-router-dom';
import {
  Users,
  User,
  Clock,
  MapPin,
  Edit2,
  Trash2,
  Share2,
  Bookmark,
  Check,
  Star,
  Wallet,
} from 'lucide-react';
import RouteMapComponent from '@/components/common/Map/RouteMapComponent';
import { useRequest } from '@/hooks/useRequest';
import { EstimatedInfo } from '@/components/common/EstimatedInfo';
import useAuthStore from '@/store/useAuthStore';
import React, { useState, useCallback, memo, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { requestApi } from '@/api/request';
import { fundingApi } from '@/api/funding';
import { ProcessingStatus } from '@/types/request/types';
import { workApi } from '@/api/work';
import { useQueryClient } from '@tanstack/react-query';
import {
  StatusBadge,
  UserBadge,
  GroupFundingBadge,
  RequestInfo,
} from '@/components/common/Request';
import SlidePanel from '@/components/panels/SlidePanel';
import AcceptPanel from '@/components/panels/AcceptPanel';
import JoinPanel from '@/components/panels/JoinPanel';
interface StarRatingProps {
  onRate: (rating: number) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  onRate,
  onSubmit,
  disabled,
}) => {
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [selectedRating, setSelectedRating] = useState<number>(0);

  const handleRating = (rating: number) => {
    setSelectedRating(rating);
    onRate(rating);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
      <h2 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
        수행자 평가
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
        수행자의 서비스에 대해 평가해주세요. 평가 제출 전까지 별점을 변경할 수
        있습니다.
      </p>
      <div className="flex items-center gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            onMouseEnter={() => setHoveredRating(rating)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => handleRating(rating)}
            className="p-1 transition-colors duration-200"
            disabled={disabled}
          >
            <Star
              size={24}
              className={`${
                rating <= (hoveredRating || selectedRating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-none text-gray-300 dark:text-gray-500'
              } transition-colors duration-200`}
            />
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {selectedRating > 0
            ? '평가를 제출하려면 아래 버튼을 클릭해주세요.'
            : hoveredRating > 0
              ? `${hoveredRating}점을 선택하시겠습니까?`
              : '별을 클릭하여 평가해주세요.'}
        </p>
        {selectedRating > 0 && (
          <button
            onClick={onSubmit}
            className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={disabled}
          >
            <Check size={16} />
            {disabled ? '평가 제출 중...' : '평가 제출하기'}
          </button>
        )}
      </div>
    </div>
  );
};

// 새로운 지도 컴포넌트 (최상위에 정의)
const MapSection = memo(
  ({
    currentLocation,
    targetLocation,
  }: {
    currentLocation: { latitude: number; longitude: number };
    targetLocation: { latitude: number; longitude: number };
  }) => (
    <div className="mb-6">
      <div className="rounded-lg overflow-hidden shadow-lg">
        <RouteMapComponent start={currentLocation} end={targetLocation} />
      </div>
      <EstimatedInfo
        currentLocation={currentLocation}
        targetLocation={targetLocation}
        className="mt-4"
      />
    </div>
  ),
  (prevProps, nextProps) =>
    prevProps.currentLocation.latitude === nextProps.currentLocation.latitude &&
    prevProps.currentLocation.longitude ===
      nextProps.currentLocation.longitude &&
    prevProps.targetLocation.latitude === nextProps.targetLocation.latitude &&
    prevProps.targetLocation.longitude === nextProps.targetLocation.longitude,
);

const RequestDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { request, isLoading, error, currentLocation } = useRequest(id);
  const { userInfo } = useAuthStore();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [finishContent, setFinishContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [isRatingSubmitting, setIsRatingSubmitting] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showAcceptPanel, setShowAcceptPanel] = useState(false);
  const [showJoinPanel, setShowJoinPanel] = useState(false);

  const memoizedCurrentLocation = useMemo(
    () => currentLocation,
    [currentLocation?.latitude, currentLocation?.longitude],
  );

  const memoizedTargetLocation = useMemo(
    () =>
      request
        ? {
            latitude: request.latitude,
            longitude: request.longitude,
          }
        : null,
    [request?.latitude, request?.longitude],
  );

  const handleRateComplete = useCallback(
    (rating: number) => {
      if (!id) return;
      queryClient.invalidateQueries({ queryKey: ['request', id] });
    },
    [queryClient, id],
  );

  const handleDelete = async () => {
    if (!request || !window.confirm('정말로 이 글을 삭제하시겠습니까?')) return;

    try {
      await requestApi.deleteRequest(request.id);
      await queryClient.invalidateQueries({ queryKey: ['requests'] });
      toast.success('글이 삭제되었습니다.');
      navigate('/requests');
    } catch (error) {
      toast.error('글 삭제에 실패했습니다.');
    }
  };

  const handleWithdrawFunding = async () => {
    if (!request || !window.confirm('공동요청 참여를 취소하시겠습니까?')) return;

    try {
      await fundingApi.withdrawFunding(request.id);
      toast.success('공동요청 참여가 취소되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['request', id] });
      window.location.reload();
    } catch (error) {
      toast.error('공동요청 취소에 실패했습니다.');
    }
  };

  const handleEdit = () => {
    if (!request) return;
    navigate(`/requests/${request.id}/edit`);
  };

  const handleShare = async () => {
    if (!request) return;
    try {
      await navigator.share({
        title: request.title,
        text: request.content,
        url: window.location.href,
      });
    } catch (error) {
      toast.error('공유하기를 지원하지 않는 환경입니다.');
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(
      isBookmarked ? '북마크가 해제되었습니다.' : '북마크에 추가되었습니다.',
    );
  };

  const handleComplete = async () => {
    if (!request || !finishContent.trim()) {
      toast.error('완료 내용을 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      await workApi.completeWork(request.id, { finishContent });
      toast.success('수행이 완료되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['request', id ?? ''] });
      window.location.reload();
    } catch (error) {
      toast.error('수행 완료 처리에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRateSubmit = async () => {
    if (!request || !selectedRating) return;

    try {
      setIsRatingSubmitting(true);
      await workApi.rateWork(request.id, { rate: selectedRating });
      toast.success('평가가 완료되었습니다.');
      window.location.reload();
    } catch (error) {
      toast.error('평가 제출에 실패했습니다.');
    } finally {
      setIsRatingSubmitting(false);
    }
  };

  const handleAcceptWork = async () => {
    try {
      if (!id) return;
      await workApi.acceptWork(Number(id));
      await queryClient.invalidateQueries({ queryKey: ['requests'] });
      navigate('/requests');
    } catch (error) {
      console.error('Failed to accept work:', error);
    }
  };

  const handleParticipateInFunding = async () => {
    try {
      if (!id) return;
      await fundingApi.participateInFunding(Number(id));
      await queryClient.invalidateQueries({ queryKey: ['requests'] });
      navigate('/requests');
    } catch (error) {
      console.error('Failed to participate in funding:', error);
    }
  };

  const handleOpenAcceptPanel = () => {
    setShowJoinPanel(false); // 다른 패널이 열려있으면 닫기
    setShowAcceptPanel(true);
  };

  const handleOpenJoinPanel = () => {
    setShowAcceptPanel(false); // 다른 패널이 열려있으면 닫기
    setShowJoinPanel(true);
  };

  // 3. 로딩 상태 처리
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto py-6 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="text-center text-gray-600 dark:text-gray-300">
            로딩 중...
          </div>
        </div>
      </div>
    );
  }

  // 4. 에러 상태 처리
  if (error || !request) {
    return (
      <div className="max-w-2xl mx-auto py-6 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="text-center text-gray-600 dark:text-gray-300">
            {error || '요청을 찾을 수 없습니다.'}
          </div>
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => navigate('/requests')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              목록으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 5. request가 존재할 때의 메인 UI 렌더링
  return (
    <div className=" bg-gray-100 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-6 md:max-w-6xl">
        <div
          className={`flex justify-center gap-6 ${showAcceptPanel || showJoinPanel ? 'md:justify-start' : ''}`}
        >
          {/* Details 컨텐츠 */}
          <div className="w-full max-w-2xl">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              {/* 헤더 섹션 */}
              <div className="mb-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-2">
                    {request.college} ·
                    <div className="flex items-center">
                      <User className="w-4 h-4" />
                      {request.writer}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleShare}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <Share2 size={20} />
                    </button>
                    <button
                      onClick={handleBookmark}
                      className={`p-2 ${
                        isBookmarked ? 'text-yellow-500' : 'text-gray-500'
                      } hover:text-yellow-600`}
                    >
                      <Bookmark size={20} />
                    </button>
                  </div>
                </div>

                {/* 제목 섹션 */}
                <div className="flex items-center gap-2 mb-4">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {request.title}
                  </h1>
                  <StatusBadge status={request.processingStatus} />
                  {request.removable && <UserBadge type="owner" />}
                  {request.isWorker && <UserBadge type="worker" />}
                  {request.isFunder && <UserBadge type="funder" />}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{new Date(request.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span>
                      위도: {request.latitude}, 경도: {request.longitude}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {request.content}
                </p>
              </div>

              {/* 지도 섹션 */}
              {memoizedTargetLocation && memoizedCurrentLocation ? (
                <MapSection
                  currentLocation={memoizedCurrentLocation}
                  targetLocation={memoizedTargetLocation}
                />
              ) : (
                <div className="mb-6">
                  <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
                    <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                      경로를 확인하려면 위치 정보 접근을 허용해주세요.
                    </p>
                  </div>
                </div>
              )}

              {/* 완료 보고 내용 표시 */}
              {request.finishContent && (
                <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4 mb-6">
                  <h2 className="font-medium text-green-900 dark:text-green-100 mb-3">
                    완료 보고 내용
                  </h2>
                  <div className="bg-white dark:bg-green-800 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-green-100 whitespace-pre-wrap">
                      {request.finishContent}
                    </p>
                  </div>
                </div>
              )}

              {/* 금액 정보 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                    {request.allowGroupFunding ? '참여 현황' : '요청 금액'}
                  </h2>
                  {request.allowGroupFunding && (
                    <GroupFundingBadge className="ml-2" />
                  )}
                </div>

                <div className="space-y-3">
                  {/* 개별 참여 금액 */}
                  <div>
                    <div className="flex items-baseline">
                      <span className="text-base font-bold text-gray-900 dark:text-gray-100">
                        {(
                          request.reward / request.currentParticipants
                        ).toLocaleString()}
                      </span>
                      <span className="ml-1 text-gray-600 dark:text-gray-400">
                        원
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {request.allowGroupFunding
                        ? '1인당 참여 금액'
                        : '요청 금액'}
                    </div>
                  </div>

                  {/* 그룹 참여 정보 */}
                  {request.allowGroupFunding && (
                    <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
                            {request.reward.toLocaleString()}원
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            총 참여 금액
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {request.currentParticipants}명
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            현재 참여자
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 요청 상태 */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <h2 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  요청 상태
                </h2>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">
                    진행 상태
                  </span>
                  <StatusBadge status={request.processingStatus} />
                </div>
              </div>

              {/* 완료 보고 섹션 */}
              {request.processingStatus === ProcessingStatus.IN_PROGRESS &&
                request.isWorker && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                    <h2 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                      완료 보고
                    </h2>
                    <textarea
                      value={finishContent}
                      onChange={(e) => setFinishContent(e.target.value)}
                      placeholder="완료 내용을 입력해주세요..."
                      className="w-full h-24 p-3 border rounded-lg mb-3 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300"
                    />
                    <button
                      className="w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleComplete}
                      disabled={isSubmitting || !finishContent.trim()}
                    >
                      <Check size={16} />
                      수행완료
                    </button>
                  </div>
                )}

              {/* 평가 섹션 */}
              {request.removable &&
                request.processingStatus === ProcessingStatus.IN_PROGRESS &&
                request.finishContent && ( // finishContent가 존재할 때만 평가 섹션을 표시
                  <StarRating
                    onRate={setSelectedRating}
                    onSubmit={handleRateSubmit}
                    disabled={isRatingSubmitting}
                  />
                )}

              {/* 액션 버튼 */}
              {request.isFunder && !request.removable ? (
                <div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Wallet
                        size={20}
                        className="text-lime-600 dark:text-lime-400"
                      />
                      <h2 className="font-medium text-gray-900 dark:text-gray-100">
                      공동요청 참여 상태
                      </h2>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-600 dark:text-gray-300">
                        이미 이 요청의 공동요청에 참여하셨습니다.
                      </p>
                      {request.processingStatus ===
                        ProcessingStatus.NOT_STARTED && (
                        <button
                          onClick={handleWithdrawFunding}
                          className="px-4 py-1.5 text-sm bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 rounded-lg transition-colors duration-200"
                        >
                          공동요청 취소
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => navigate(-1)}
                      className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition duration-200"
                    >
                      뒤로가기
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition duration-200"
                  >
                    뒤로가기
                  </button>

                  {request.removable ? (
                    <>
                      <button
                        onClick={handleEdit}
                        disabled={
                          request.processingStatus !==
                          ProcessingStatus.NOT_STARTED
                        }
                        className={`px-6 py-2 bg-gray-600 text-white rounded-lg flex items-center gap-2 transition duration-200 ${
                          request.processingStatus !==
                          ProcessingStatus.NOT_STARTED
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-gray-700'
                        }`}
                        title={
                          request.processingStatus !==
                          ProcessingStatus.NOT_STARTED
                            ? '진행 중인 요청은 수정할 수 없습니다'
                            : ''
                        }
                      >
                        <Edit2 size={16} />
                        수정하기
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={
                          request.processingStatus !==
                          ProcessingStatus.NOT_STARTED
                        }
                        className={`px-6 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 transition duration-200 ${
                          request.processingStatus !==
                          ProcessingStatus.NOT_STARTED
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-red-700'
                        }`}
                        title={
                          request.processingStatus !==
                          ProcessingStatus.NOT_STARTED
                            ? '진행 중인 요청은 삭제할 수 없습니다'
                            : ''
                        }
                      >
                        <Trash2 size={16} />
                        삭제하기
                      </button>
                    </>
                  ) : (
                    <>
                      {request.processingStatus ===
                        ProcessingStatus.NOT_STARTED && (
                        <>
                          <button
                            onClick={handleOpenAcceptPanel}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
                          >
                            수행하기
                          </button>
                          {request.allowGroupFunding && (
                            <button
                              onClick={handleOpenJoinPanel}
                              className="px-6 py-2 bg-green-600 text-white rounded-lg"
                            >
                              공동요청하기
                            </button>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 패널 영역 */}
          {(showAcceptPanel || showJoinPanel) && (
            <>
              {/* 데스크톱 패널 */}
              <div className="hidden md:block md:sticky md:top-[5.5rem] w-full md:max-w-lg h-fit">
                {' '}
                {/* 네비게이션 바 높이만큼 top 값 조정 */}
                <SlidePanel
                  isOpen={showAcceptPanel || showJoinPanel}
                  onClose={() => {
                    setShowAcceptPanel(false);
                    setShowJoinPanel(false);
                  }}
                >
                  {showAcceptPanel ? (
                    <AcceptPanel
                      request={request}
                      onConfirm={async () => {
                        await handleAcceptWork();
                        setShowAcceptPanel(false);
                      }}
                      onCancel={() => setShowAcceptPanel(false)}
                    />
                  ) : (
                    <JoinPanel
                      request={request}
                      onConfirm={async () => {
                        await handleParticipateInFunding();
                        setShowJoinPanel(false);
                      }}
                      onCancel={() => setShowJoinPanel(false)}
                    />
                  )}
                </SlidePanel>
              </div>

              {/* 모바일 패널 */}
              <div className="md:hidden fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4">
                <div className="w-full max-w-lg">
                  <SlidePanel
                    isOpen={showAcceptPanel || showJoinPanel}
                    onClose={() => {
                      setShowAcceptPanel(false);
                      setShowJoinPanel(false);
                    }}
                  >
                    {showAcceptPanel ? (
                      <AcceptPanel
                        request={request}
                        onConfirm={async () => {
                          await handleAcceptWork();
                          setShowAcceptPanel(false);
                        }}
                        onCancel={() => setShowAcceptPanel(false)}
                      />
                    ) : (
                      <JoinPanel
                        request={request}
                        onConfirm={async () => {
                          await handleParticipateInFunding();
                          setShowJoinPanel(false);
                        }}
                        onCancel={() => setShowJoinPanel(false)}
                      />
                    )}
                  </SlidePanel>
                </div>{' '}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 배경 오버레이 - z-index 수정 */}
      {(showAcceptPanel || showJoinPanel) && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => {
            setShowAcceptPanel(false);
            setShowJoinPanel(false);
          }}
        />
      )}
    </div>
  );
};

export default RequestDetail;
