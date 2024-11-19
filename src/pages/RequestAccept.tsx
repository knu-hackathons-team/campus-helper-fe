import React from 'react';
import { useParams } from 'react-router-dom';
import { mockRequests } from '@/mocks/requests';

const RequestAccept = () => {
  const { id } = useParams();
  const request = mockRequests.find(req => req.id === id);

  if (!request) {
    return <div>요청을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {/* 기존 요청 정보 */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {request.college} · {request.author}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {request.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {request.content}
          </p>
          <div className="mt-4 text-blue-600 dark:text-blue-400 font-medium">
            보상: {request.baseFunding.toLocaleString()}원
          </div>
        </div>

        {/* 수행 동의 사항 */}
        <div className="space-y-4 mb-6">
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

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h2 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              요청자 연락처
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              수행 수락 후 요청자의 연락처가 공개됩니다.
            </p>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            뒤로가기
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            수락하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestAccept;