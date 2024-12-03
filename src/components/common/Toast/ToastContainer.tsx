import React from 'react';
import { createPortal } from 'react-dom';
import useToastStore from '@/store/useToastStore';
import ToastMessage from './ToastMessage';

// 토스트 메시지들의 위치와 레이아웃을 관리
const ToastContainer: React.FC = () => {
  const toasts = useToastStore((state) => state.toasts);

  return createPortal(
    <div className="fixed top-20 right-4 z-50 flex flex-col items-end gap-2 pointer-events-none">
      <div className="flex flex-col items-end gap-2 pointer-events-auto">
        {toasts.map((toast) => (
          <ToastMessage key={toast.id} {...toast} />
        ))}
      </div>
    </div>,
    document.body
  );
};

export default ToastContainer;