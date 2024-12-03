import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import type { Toast } from './types';
import useToastStore from '@/store/useToastStore';

interface ToastMessageProps extends Toast {}

// 개별 토스트 메시지의 스타일과 기능을 담당
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

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) return 0;
        return prev - (16 / duration) * 100;
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
    success: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
    error: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
    info: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
    warning: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
  };

  const progressStyles = {
    success: 'bg-green-500 dark:bg-green-600',
    error: 'bg-red-500 dark:bg-red-600',
    info: 'bg-blue-500 dark:bg-blue-600',
    warning: 'bg-yellow-500 dark:bg-yellow-600',
  };

  const iconContainerStyles = {
    success: 'text-green-500 dark:text-green-400',
    error: 'text-red-500 dark:text-red-400',
    info: 'text-blue-500 dark:text-blue-400',
    warning: 'text-yellow-500 dark:text-yellow-400',
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
          className="ml-4 -mr-1 text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-100 transition-colors"
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