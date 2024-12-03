import { useCallback } from 'react';
import useToastStore from '@/store/useToastStore';
import type { ToastType } from '@/components/common/Toast/types';

const DEFAULT_DURATION = 5000;

const useToast = () => {
  const { addToast } = useToastStore();

  const showToast = useCallback(
    (
      message: string,
      type: ToastType = 'info',
      duration = DEFAULT_DURATION,
    ) => {
      addToast({ message, type, duration });
    },
    [addToast],
  );

  const success = useCallback(
    (message: string, duration?: number) => {
      showToast(message, 'success', duration);
    },
    [showToast],
  );

  const error = useCallback(
    (message: string, duration?: number) => {
      showToast(message, 'error', duration);
    },
    [showToast],
  );

  const info = useCallback(
    (message: string, duration?: number) => {
      showToast(message, 'info', duration);
    },
    [showToast],
  );

  const warning = useCallback(
    (message: string, duration?: number) => {
      showToast(message, 'warning', duration);
    },
    [showToast],
  );

  return { showToast, success, error, info, warning };
};

export default useToast;
