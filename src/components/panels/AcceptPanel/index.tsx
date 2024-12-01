// src/components/panels/AcceptPanel/index.tsx
import { Check, User } from 'lucide-react';
import { StatusBadge } from '@/components/common/Request';
import { RequestDto } from '@/api/request/types';

interface AcceptPanelProps {
  request: RequestDto;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

const AcceptPanel = ({ request, onConfirm, onCancel }: AcceptPanelProps) => {
  return (
    <div className="space-y-6">
      {/* 상단 헤더 섹션 */}
      <div className="mb-6">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-2 mb-2">
          {request.college} ·
          <div className="flex items-center">
            <User className="w-4 h-4" />
            {request.writer}
          </div>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {request.title}
          </h1>
          <StatusBadge status={request.processingStatus} />
        </div>
      </div>

      {/* 안내사항 섹션 */}
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h2 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
            요청자 연락처
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            수행 수락 후 요청자의 연락처가 공개됩니다.
          </p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h2 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
            수행 전 확인사항
          </h2>
          <ul className="space-y-2">
            {['요청한 내용에 대해 정확히 이해하였습니다.',
              '요청 수행에 필요한 시간을 확인하였습니다.',
              '보상 금액에 동의합니다.',
              '부적절한 수행 시 제재를 받을 수 있습니다.'].map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300 text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 하단 액션 버튼 */}
      <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 mt-6 p-6 -mx-6 -mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600 dark:text-gray-300">수행 보상</span>
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {request.reward.toLocaleString()}원
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
            onClick={onConfirm}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            수행하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcceptPanel;