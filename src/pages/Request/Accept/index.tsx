// src/pages/Request/Accept/index.tsx

import { useParams, useNavigate } from 'react-router-dom';
import RouteMapComponent from '@/components/common/Map/RouteMapComponent';
import { useRequest } from '@/hooks/useRequest';
import { EstimatedInfo } from '@/components/common/EstimatedInfo';
import { workApi } from '@/api/work';
import { Users } from 'lucide-react';


const RequestAccept = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { request, isLoading, error, currentLocation } = useRequest(id);

  // 버튼 클릭 핸들러 함수 추가
  const handleAcceptWork = async () => {
    try {
      if (!id) return;
      await workApi.acceptWork(Number(id));
      // 성공 시 처리 (예: 알림 표시, 페이지 이동 등)
      navigate('/requests');
    } catch (error) {
      // 에러 처리
      console.error('Failed to accept work:', error);
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
        {/* 요청 정보 헤더 */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {request.college} · {request.writer}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {request.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">{request.content}</p>
          <div className="mt-4 text-blue-600 dark:text-blue-400 font-medium">
            보상: {request.reward.toLocaleString()}원
          </div>
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

        {/* 예상 소요 시간 및 거리 */}
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

        <div className="space-y-4 mb-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h2 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              요청자 연락처
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              수행 수락 후 요청자의 연락처가 공개됩니다.
            </p>
          </div>

          {/* 수행 동의 사항 */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h2 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              수행 전 확인사항
            </h2>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-2">
              <li>요청한 내용에 대해 정확히 이해하였습니다.</li>
              <li>요청 수행에 필요한 시간을 확인하였습니다.</li>
              <li>보상 금액에 동의합니다.</li>
              <li>부적절한 수행 시 제재를 받을 수 있습니다.</li>
            </ul>
          </div>
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
            onClick={handleAcceptWork}
          >
            수락하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestAccept;
