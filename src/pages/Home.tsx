// src/pages/Home.tsx
/** @jsxImportSource @emotion/react */
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

// Emotion으로 커스텀 스타일링이 필요한 부분만 정의합니다.
const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const linkStyles = css`
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
`;

// Home 컴포넌트 정의
function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 섹션 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            캠퍼스 도움 요청
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            다른 학생들과 함께 캠퍼스 생활을 더 쉽게 만들어보세요
          </p>
          <ButtonGroup>
            <Link
              to="/requests/new"
              css={linkStyles}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              도움 요청하기
            </Link>
            <Link
              to="/requests"
              css={linkStyles}
              className="bg-white text-blue-500 px-6 py-2 rounded-lg border border-blue-500 hover:bg-blue-50 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
            >
              요청 목록 보기
            </Link>
          </ButtonGroup>
        </div>

        {/* 기능 소개 섹션 */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              실시간 요청
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              급한 도움이 필요할 때 주변 학생들과 빠르게 연결됩니다
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              위치 기반
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              현재 위치 주변의 요청들을 쉽게 확인할 수 있습니다
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              안전한 거래
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              교내 학생증 인증으로 신뢰할 수 있는 거래가 가능합니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
