// src/pages/Request/Join/index.tsx

import { useParams, useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import RouteMapComponent from '@/components/common/Map/RouteMapComponent';
import { useRequest } from '@/hooks/useRequest';
import { EstimatedInfo } from '@/components/common/EstimatedInfo';
import { fundingApi } from '@/api/funding';
import { useQueryClient } from '@tanstack/react-query'; // 추가

const RequestJoin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // 추가
  const { id } = useParams();
  const { request, isLoading, error, currentLocation } = useRequest(id);

  // 버튼 클릭 핸들러 함수 추가
  const handleParticipateInFunding = async () => {
    try {
      if (!id) return;
      await fundingApi.participateInFunding(Number(id));
      await queryClient.invalidateQueries({ queryKey: ['requests'] }); // 추가
      navigate('/requests');
    } catch (error) {
      console.error('Failed to participate in funding:', error);
    }
  };

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

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {/* 요청 정보 */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {request.college} · {request.writer}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {request.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {request.content}
          </p>
        </div>

        {/* 지도 섹션 */}
        <div className="mb-6">
          {currentLocation && {
              latitude: request.latitude,
              longitude: request.longitude,
            } && (
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
        {currentLocation && {
            latitude: request.latitude,
            longitude: request.longitude,
          } && (
            <EstimatedInfo
              currentLocation={currentLocation}
              targetLocation={{
                latitude: request.latitude,
                longitude: request.longitude,
              }}
              className="mb-6"
            />
          )}

        {/* 펀딩 현황 */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <h2 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
            현재 펀딩 현황
          </h2>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Users size={20} />
              <span>{request.currentParticipants}명 참여 중</span>
            </div>
            <div className="text-blue-600 dark:text-blue-400 font-medium">
              {(request.reward / request.currentParticipants).toLocaleString()}
              원
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            1인당 펀딩 금액: {request.reward.toLocaleString()}원
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {/* 결제 정보 */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h2 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              결제 금액
            </h2>
            <div className="flex justify-between items-center text-lg font-medium text-gray-900 dark:text-gray-100">
              <span>펀딩 참여 금액</span>
              <span>{request.reward.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        {/* 펀딩 참여 안내 */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h2 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
            펀딩 참여 안내
          </h2>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-2">
            <li>
              최초 요청자가 설정한 금액(
              {(request.reward / request.currentParticipants).toLocaleString()}
              원)으로 참여할 수 있습니다.
            </li>
            <li>
              요청 달성 시 공유된 정보를 모든 참여자가 확인할 수 있습니다.
            </li>
            <li>펀딩 완료 후 취소는 불가능합니다.</li>
            <li>요청이 실패할 경우 전액 환불됩니다.</li>
          </ul>
        </div>

        {/* 액션 버튼 */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition duration-200"
          >
            뒤로가기
          </button>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center gap-2"
            disabled={!currentLocation}
            onClick={handleParticipateInFunding}
          >
            <Users size={16} />
            펀딩하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestJoin;
