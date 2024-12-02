import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import type { Toast } from './types';
import useToastStore from '@/store/useToastStore';

interface ToastMessageProps extends Toast {}

const ToastMessage: React.FC<ToastMessageProps> = ({
  id,
  message,
  type,
  duration = 5000,
}) => {
  const removeToast = useToastStore((state) => state.removeToast);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(id);
    }, duration);

    // 60fps에 가까운 부드러운 업데이트를 위해 16ms 간격 사용
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) return 0;
        return prev - (16 / duration) * 100; // 16ms마다 감소량 계산
      });
    }, 16);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [duration, id, removeToast]);

  const icons = {
    success: <CheckCircle className="w-6 h-6" />,
    error: <XCircle className="w-6 h-6" />,
    info: <Info className="w-6 h-6" />,
    warning: <AlertTriangle className="w-6 h-6" />,
  };

  const styles = {
    success: 'bg-white text-gray-800',
    error: 'bg-white text-gray-800',
    info: 'bg-white text-gray-800',
    warning: 'bg-white text-gray-800',
  };

  const progressStyles = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  };

  const iconContainerStyles = {
    success: 'text-green-500',
    error: 'text-red-500',
    info: 'text-blue-500',
    warning: 'text-yellow-500',
  };

  return (
    <div
      className={`relative w-96 rounded-lg shadow-lg ${styles[type]} animate-slide-in`}
      role="alert"
    >
      <div className="flex items-center px-5 py-4">
        <div className={`flex-shrink-0 ${iconContainerStyles[type]}`}>
          {icons[type]}
        </div>
        <div className="flex-1 ml-4">
          <p className="text-base font-medium">{message}</p>
        </div>
        <button
          onClick={() => removeToast(id)}
          className="ml-4 -mr-1 text-gray-400 hover:text-gray-900 transition-colors"
          aria-label="닫기"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      <div
        className={`h-1 ${progressStyles[type]} transition-all duration-75 ease-linear`}
        style={{
          width: `${progress}%`,
          transition: 'width 100ms linear',
        }}
      />
    </div>
  );
};

export default ToastMessage;
