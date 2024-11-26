import { useParams, useNavigate } from 'react-router-dom';
import {
  Users,
  Clock,
  MapPin,
  Edit2,
  Trash2,
  Share2,
  Bookmark,
  Check,
} from 'lucide-react';

import RouteMapComponent from '@/components/common/Map/RouteMapComponent';
import { useRequest } from '@/hooks/useRequest';
import { EstimatedInfo } from '@/components/common/EstimatedInfo';
import useAuthStore from '@/store/useAuthStore';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { requestApi } from '@/api/request';
import { ProcessingStatus } from '@/types/request/types';
import { workApi } from '@/api/work';
import { useQueryClient } from '@tanstack/react-query';
import {
  StatusBadge,
  UserBadge,
  GroupFundingBadge,
  RequestInfo,
} from '@/components/common/Request';

const RequestDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { request, isLoading, error, currentLocation } = useRequest(id);
  const { userInfo } = useAuthStore();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [finishContent, setFinishContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const isOwner = request.removable;

  // RequestDetail의 handleDelete 함수
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (window.confirm('정말로 이 글을 삭제하시겠습니까?')) {
      try {
        await requestApi.deleteRequest(request.id);
        await queryClient.invalidateQueries({ queryKey: ['requests'] });
        toast.success('글이 삭제되었습니다.');
        navigate('/requests');
      } catch (error) {
        toast.error('글 삭제에 실패했습니다.');
      }
    }
  };

  const handleEdit = () => {
    navigate(`/requests/${request.id}/edit`);
  };

  const handleShare = async () => {
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
    if (!finishContent.trim()) {
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

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {/* 헤더 섹션 */}
        <div className="mb-6">
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {request.college} · {request.writer}
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
        <div className="mb-6">
          {currentLocation && (
            <div className="rounded-lg overflow-hidden shadow-lg">
              <RouteMapComponent
                start={currentLocation}
                end={{
                  latitude: request.latitude,
                  longitude: request.longitude,
                }}
              />
            </div>
          )}
          {!currentLocation && (
            <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                경로를 확인하려면 위치 정보 접근을 허용해주세요.
              </p>
            </div>
          )}
        </div>

        {/* 예상 정보 */}
        {currentLocation && (
          <EstimatedInfo
            currentLocation={currentLocation}
            targetLocation={{
              latitude: request.latitude,
              longitude: request.longitude,
            }}
            className="mb-6"
          />
        )}

        {/* 금액 정보 */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <h2 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
            {request.allowGroupFunding ? '현재 참여 현황' : '요청 금액'}
          </h2>
          <RequestInfo
            reward={request.reward}
            currentParticipants={request.currentParticipants}
            allowGroupFunding={request.allowGroupFunding}
          />
          {request.allowGroupFunding && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              1인당 펀딩 금액: {request.reward.toLocaleString()}원
            </div>
          )}
        </div>

        {/* 요청 상태 */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <h2 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
            요청 상태
          </h2>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">진행 상태</span>
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

        {/* 액션 버튼 */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition duration-200"
          >
            뒤로가기
          </button>

          {isOwner ? (
            <>
              <button
                onClick={handleEdit}
                disabled={
                  request.processingStatus !== ProcessingStatus.NOT_STARTED
                }
                className={`px-6 py-2 bg-gray-600 text-white rounded-lg flex items-center gap-2 transition duration-200 ${
                  request.processingStatus !== ProcessingStatus.NOT_STARTED
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gray-700'
                }`}
                title={
                  request.processingStatus !== ProcessingStatus.NOT_STARTED
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
                  request.processingStatus !== ProcessingStatus.NOT_STARTED
                }
                className={`px-6 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 transition duration-200 ${
                  request.processingStatus !== ProcessingStatus.NOT_STARTED
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-red-700'
                }`}
                title={
                  request.processingStatus !== ProcessingStatus.NOT_STARTED
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
              {request.processingStatus === ProcessingStatus.NOT_STARTED && (
                <>
                  <button
                    className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-200"
                    onClick={() => navigate(`/requests/${request.id}/accept`)}
                  >
                    수행하기
                  </button>
                  {request.allowGroupFunding && (
                    <button
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center gap-2"
                      onClick={() => navigate(`/requests/${request.id}/join`)}
                    >
                      <GroupFundingBadge />
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestDetail;