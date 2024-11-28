// src/components/Request/RequestInfo.tsx
import { Users } from 'lucide-react';

interface RequestInfoProps {
  reward: number;
  currentParticipants?: number;
  allowGroupFunding?: boolean;
  className?: string;
}

export const RequestInfo = ({
  reward,
  currentParticipants = 1,
  allowGroupFunding = false,
  className = '',
}: RequestInfoProps) => {
  if (!allowGroupFunding) {
    return (
      <span
        className={`text-blue-600 dark:text-blue-400 font-medium ${className}`}
      >
        {reward.toLocaleString()}원
      </span>
    );
  }

  return (
    <div className={`text-right ${className}`}>
      <div className="text-blue-600 dark:text-blue-400 font-medium">
        {(reward).toLocaleString()}원
        <span className="text-sm text-gray-500 ml-1">
          ({(reward/currentParticipants).toLocaleString()}원 × {currentParticipants})
        </span>
      </div>
      <div className="text-sm text-gray-500 flex items-center justify-end gap-1">
        <Users size={14} />
        {currentParticipants}명 참여 중
      </div>
    </div>
  );
};
