import { X } from 'lucide-react';

interface SlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const SlidePanel = ({ isOpen, onClose, children }: SlidePanelProps) => {
  if (!isOpen) return null;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg w-[480px] max-w-[calc(100vw-32px)] mx-auto md:w-full md:max-w-lg">
      {/* 헤더 */}

      {/* 컨텐츠 */}
      <div className="p-6">{children}</div>
    </div>
  );
};

export default SlidePanel;
