// src/pages/MyPage/index.tsx
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import useAuthStore from '@/store/useAuthStore';
import { User, Coins } from 'lucide-react';

const MyPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userInfo = useAuthStore((state) => state.userInfo);

  // 인증되지 않은 경우 로그인 유도 UI 표시
  if (!isAuthenticated || !userInfo) {
    return (
      <div className="max-w-2xl mx-auto py-6 px-4">
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            로그인이 필요합니다
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            마이페이지를 확인하려면 먼저 로그인해주세요
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            로그인하기
          </button>
        </div>
      </div>
    );
  }

  // 인증된 경우 마이페이지 컨텐츠 표시
  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        마이페이지
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* 프로필 섹션 */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {userInfo.nickname}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                {userInfo.college}
              </p>
            </div>
          </div>
        </div>

        {/* 포인트 섹션 */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-600 dark:text-gray-300">
                보유 포인트
              </span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {userInfo.point.toLocaleString()} P
            </span>
          </div>
        </div>

        {/* 활동 통계 섹션 */}
        <div className="p-6 bg-gray-50 dark:bg-gray-900">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            활동 통계
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="작성한 요청 (하드코딩됨)" value="3" />
            <StatCard label="수행한 요청 (하드코딩됨)" value="5" />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
      {value}
    </p>
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
  </div>
);

export default MyPage;
