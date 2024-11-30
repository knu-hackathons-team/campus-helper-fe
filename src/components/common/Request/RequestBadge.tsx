import { ProcessingStatus } from '@/types/request/types';
import { Users, Wallet, Clock, Loader2, CheckCircle, Crown, Hammer } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface StatusBadgeProps {
  status: ProcessingStatus;
  className?: string;
}

interface UserBadgeProps {
  type: 'owner' | 'worker' | 'funder';
  className?: string;
}

interface GroupFundingBadgeProps {
  className?: string;
}

interface BadgeConfig {
  color: string;
  text: string;
  icon: LucideIcon;
}

export const StatusBadge = ({ status, className = '' }: StatusBadgeProps) => {
  const statusConfig: Record<ProcessingStatus, BadgeConfig> = {
    [ProcessingStatus.NOT_STARTED]: {
      color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
      text: '대기 중',
      icon: Clock
    },
    [ProcessingStatus.IN_PROGRESS]: {
      color: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
      text: '진행 중',
      icon: Loader2
    },
    [ProcessingStatus.COMPLETED]: {
      color: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
      text: '완료',
      icon: CheckCircle
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${config.color} ${className} flex items-center gap-1`}>
      <Icon size={12} />
      {config.text}
    </span>
  );
};

export const UserBadge = ({ type, className = '' }: UserBadgeProps) => {
  const config: Record<UserBadgeProps['type'], BadgeConfig> = {
    owner: {
      color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      text: '내가 쓴 글',
      icon: Crown
    },
    worker: {
      color: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
      text: '내가 수행중인 글',
      icon: Hammer
    },
    funder: {
      color: 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200',
      text: '펀딩 참여중',
      icon: Wallet
    }
  };

  const Icon = config[type].icon;

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs ${config[type].color} ${className} flex items-center gap-1`}>
      <Icon size={12} />
      {config[type].text}
    </span>
  );
};

export const GroupFundingBadge = ({ className = '' }: GroupFundingBadgeProps) => (
  <span className={`px-2 py-0.5 bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-400 rounded-full text-xs flex items-center gap-1 ${className}`}>
    <Users size={12} />
    함께하기
  </span>
);