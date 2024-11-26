// src/components/request/RequestBadge.tsx
import { ProcessingStatus } from '@/types/request/types';
import { Users } from 'lucide-react';

interface StatusBadgeProps {
  status: ProcessingStatus;
  className?: string;
}

interface UserBadgeProps {
  type: 'owner' | 'worker';
  className?: string;
}

interface GroupFundingBadgeProps {
  className?: string;
}

export const StatusBadge = ({ status, className = '' }: StatusBadgeProps) => {
  const statusConfig = {
    [ProcessingStatus.NOT_STARTED]: {
      color:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      text: '대기 중',
    },
    [ProcessingStatus.IN_PROGRESS]: {
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      text: '진행 중',
    },
    [ProcessingStatus.COMPLETED]: {
      color:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      text: '완료',
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs ${config.color} ${className}`}
    >
      {config.text}
    </span>
  );
};

export const UserBadge = ({ type, className = '' }: UserBadgeProps) => {
  const config = {
    owner:
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    worker: 'bg-orange-100 text-red-800 dark:bg-red-900 dark:text-orange-200',
  };

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs ${config[type]} ${className}`}
    >
      {type === 'owner' ? '내가 쓴 글' : '내가 수행중인 글'}
    </span>
  );
};

export const GroupFundingBadge = ({
  className = '',
}: GroupFundingBadgeProps) => (
  <span
    className={`px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-xs flex items-center gap-1 ${className}`}
  >
    <Users size={12} />
    함께하기
  </span>
);
