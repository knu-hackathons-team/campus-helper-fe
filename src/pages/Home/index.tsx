/** @jsxImportSource @emotion/react */
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import useAuthStore from '@/store/useAuthStore';

// Emotion 스타일링 - 동적이거나 복잡한 스타일에만 사용
const FeatureCard = styled.div`
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-4px);
  }
`;

const ActionButton = styled(Link)`
  transition: all 0.2s ease;
  &:hover {
    transform: scale(1.02);
  }
`;

const LogoutButton = styled.button`
  transition: all 0.2s ease;
  &:hover {
    transform: scale(1.02);
  }
`;

function Home() {
  const navigate = useNavigate();
  const userInfo = useAuthStore((state) => state.userInfo);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-blue-50 dark:bg-blue-950/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              캠퍼스 생활을{' '}
              <span className="text-blue-600 dark:text-blue-400">더 쉽게</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
              도움이 필요할 때, 도움을 줄 수 있을 때
              <br />
              캠퍼스 헬퍼와 함께하세요
            </p>

            {isAuthenticated ? (
              <div className="space-y-6">
                <p className="text-lg text-gray-700 dark:text-gray-200">
                  환영합니다, <span className="font-semibold">{userInfo?.nickname}</span>님!
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <ActionButton
                    to="/requests/new"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
                  >
                    도움 요청하기
                  </ActionButton>
                  <ActionButton
                    to="/requests"
                    className="inline-flex items-center px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg shadow-md hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    요청 목록 보기
                  </ActionButton>
                  <LogoutButton
                    onClick={handleLogout}
                    className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    로그아웃
                  </LogoutButton>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  지금 바로 시작하세요
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <ActionButton
                    to="/login"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
                  >
                    로그인
                  </ActionButton>
                  <ActionButton
                    to="/signup"
                    className="inline-flex items-center px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg shadow-md hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    회원가입
                  </ActionButton>
                  <ActionButton
                    to="/requests"
                    className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    둘러보기
                  </ActionButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6">
              <span className="text-2xl">⚡️</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              실시간 요청
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              급한 도움이 필요할 때 주변 학생들과 빠르게 연결되어 해결할 수 있습니다
            </p>
          </FeatureCard>

          <FeatureCard className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6">
              <span className="text-2xl">📍</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              위치 기반 서비스
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              현재 위치를 기반으로 가까운 곳의 도움 요청을 쉽게 찾을 수 있습니다
            </p>
          </FeatureCard>

          <FeatureCard className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6">
              <span className="text-2xl">🔒</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              안전한 거래
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              교내 학생증 인증으로 신뢰할 수 있는 안전한 거래 환경을 제공합니다
            </p>
          </FeatureCard>
        </div>
      </div>
    </div>
  );
}

export default Home;