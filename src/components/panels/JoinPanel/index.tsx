// src/components/panels/JoinPanel/index.tsx
import { Users, User, Check } from 'lucide-react';
import { StatusBadge } from '@/components/common/Request';
import { RequestDto } from '@/api/request/types';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/useAuthStore';

interface JoinPanelProps {
  request: RequestDto;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

const JoinPanel = ({ request, onConfirm, onCancel }: JoinPanelProps) => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleJoinClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    onConfirm();
  };

  return (
    <div className="space-y-6">
      {/* 상단 헤더 섹션 */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-2">
            {request.college} ·
            <div className="flex items-center">
              <User className="w-4 h-4" />
              {request.writer}
            </div>
          </div>
          <StatusBadge status={request.processingStatus} />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {request.title}
        </h1>
      </div>

      {/* 공동요청 현황 섹션 */}
      <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          공동요청하기 현황
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">총 참여 금액</span>
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {request.reward.toLocaleString()}원
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-300">
              현재 {request.currentParticipants}명이 함께하고 있습니다
            </span>
          </div>
          <div className="flex -space-x-2 overflow-hidden">
            {[...Array(request.currentParticipants)].map((_, i) => (
              <div
                key={i}
                className="inline-block h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800"
              />
            ))}
          </div>
        </div>
      </div>

      {/* 참여 안내 섹션 */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
          참여 시 혜택
        </h3>
        <ul className="space-y-3">
          {[
            `동일한 금액(${(request.reward / request.currentParticipants).toLocaleString()}원)으로 같은 도움을 받을 수 있습니다`,
            '요청이 완료되면 수행자의 도움을 함께 받을 수 있습니다',
            '수행 완료 시 모든 요청자에게 결과가 공유됩니다',
          ].map((benefit, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="mt-1">
                <Check className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-gray-600 dark:text-gray-300">{benefit}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* 하단 액션 버튼 */}
      <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 mt-6 p-6 -mx-6 -mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600 dark:text-gray-300"> 1인당 참여 금액</span>
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {(request.reward / request.currentParticipants).toLocaleString()}원
          </span>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition duration-200"
          >
            취소
          </button>
          <button
            onClick={handleJoinClick}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            {isAuthenticated ? '공동요청하기' : '로그인하고 공동요청하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinPanel;
