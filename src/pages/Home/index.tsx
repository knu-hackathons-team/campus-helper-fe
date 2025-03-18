/** @jsxImportSource @emotion/react */
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import useAuthStore from '@/store/useAuthStore';
import { useState, useEffect } from 'react';

// Emotion styling - only used for dynamic or complex styles
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

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;

  @keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }

  .arrow {
    width: 24px;
    height: 24px;
    border-left: 3px solid;
    border-bottom: 3px solid;
    transform: rotate(-45deg);
    margin-bottom: 10px;
    border-color: rgba(59, 130, 246, 0.8);
    animation: bounce 2s infinite;
  }
`;

const TestimonialCard = styled.div`
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-4px);
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

const UseCaseCard = styled.div`
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);

    .overlay {
      opacity: 1;
    }
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(37, 99, 235, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
`;

function Home() {
  const navigate = useNavigate();
  const userInfo = useAuthStore((state) => state.userInfo);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const [isVisible, setIsVisible] = useState({
    concept: false,
    useCases: false,
    testimonials: false,
    impact: false,
  });

  useEffect(() => {
    const handleScroll = () => {
      const sections = {
        concept: document.getElementById('concept-section'),
        useCases: document.getElementById('usecases-section'),
        testimonials: document.getElementById('testimonials-section'),
        impact: document.getElementById('impact-section'),
      };

      Object.entries(sections).forEach(([key, section]) => {
        if (section) {
          const rect = section.getBoundingClientRect();
          const isInViewport = rect.top <= window.innerHeight * 0.75;
          setIsVisible((prev) => ({ ...prev, [key]: isInViewport }));
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center">
        <div className="absolute inset-0 bg-blue-50 dark:bg-blue-950/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pt-10">
          <div className="text-center">
            <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full mb-6 dark:bg-blue-900 dark:text-blue-200">
              혁신적인 캠퍼스 정보 마켓플레이스
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              순간의{' '}
              <span className="text-blue-600 dark:text-blue-400">정보</span>가{' '}
              <span className="text-blue-600 dark:text-blue-400">가치</span>가
              되는 곳
            </h1>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
              띱은 당신이 지금 필요한 정보와 그 정보를 가진 사람을 직접 연결하는
              수요 기반 정보 마켓플레이스입니다
            </p>

            {isAuthenticated ? (
              <div className="space-y-6">
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

      {/* Concept Section */}
      <div
        id="concept-section"
        className={`py-24 transition-opacity duration-1000 ${isVisible.concept ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full mb-4 dark:bg-blue-900 dark:text-blue-200">
              혁신적인 접근
            </span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              순간적 정보 가치의 새로운 패러다임
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              우리는 기존 정보 공유 시스템의 한계를 극복하고 일시적 정보의
              잠재적 가치를 실현합니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">⚡️</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                실시간 요청
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                급한 도움이 필요할 때 주변 학생들과 빠르게 연결되어 해결할 수
                있습니다. 정보의 시급성이 가치가 되는 첫 번째 플랫폼입니다.
              </p>
            </FeatureCard>

            <FeatureCard className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">📍</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                위치 기반 시스템
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                대학 캠퍼스의 지리적 밀집성을 활용하여 몇 분 내에 확인 가능한
                정보를 실시간으로 교환합니다. 모든 정보는 접근성이 핵심입니다.
              </p>
            </FeatureCard>

            <FeatureCard className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">💰</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                수요 기반 모델
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                정보를 필요로 하는 사람이 먼저 가격을 제시하고, 그 정보를 가진
                사람이 응답하는 방식으로 작동합니다. 실제 필요한 정보만
                거래됩니다.
              </p>
            </FeatureCard>
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div
        id="usecases-section"
        className={`py-24 bg-gray-50 dark:bg-gray-900 transition-opacity duration-1000 ${isVisible.useCases ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full mb-4 dark:bg-blue-900 dark:text-blue-200">
              실제 활용 사례
            </span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              캠퍼스 생활의 순간적 문제를 해결합니다
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              어떻게 미시적인 정보가 일상의 문제를 해결할 수 있는지 확인하세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <UseCaseCard className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
              <div className="p-8">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  자원 현황 파악
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  "중앙도서관이나 학생회관에 4-6명이 사용할 수 있는 빈
                  스터디룸이나 모임 공간 있는지 확인해주실 분? 1시간 후에 급한
                  미팅이 있습니다."
                </p>
                <p className="text-blue-600 dark:text-blue-400 font-medium">
                  - 3,000원 제안
                </p>
              </div>
              <div className="overlay">
                <div className="text-white p-6 text-center">
                  <p className="text-lg font-semibold mb-2">해결된 문제</p>
                  <p>
                    시간 낭비 없이 바로 적합한 공간을 확보하여 중요한 팀
                    프로젝트 회의를 성공적으로 진행
                  </p>
                </div>
              </div>
            </UseCaseCard>

            <UseCaseCard className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
              <div className="p-8">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-6">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  분실물 찾기
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  "공대 신관 1층 로비에서 할머니 오래된 가족사진을
                  잃어버렸습니다. 갈색 종이 봉투에 들어있었고, 복사본이 아닌
                  원본이라 정말 소중합니다."
                </p>
                <p className="text-blue-600 dark:text-blue-400 font-medium">
                  - 10,000원 제안
                </p>
              </div>
              <div className="overlay">
                <div className="text-white p-6 text-center">
                  <p className="text-lg font-semibold mb-2">해결된 문제</p>
                  <p>
                    공식 분실물 센터에서는 찾지 못한 감정적 가치가 큰 가족사진을
                    내부 건물 관리실에서 찾아냄
                  </p>
                </div>
              </div>
            </UseCaseCard>

            <UseCaseCard className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
              <div className="p-8">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mb-6">
                  <span className="text-2xl">🍽️</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  식사 관련 정보
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  "학생회관 식당 현재 대기열이 얼마나 되나요? 12시 40분에 수업이
                  끝나고 1시 10분에 다음 수업이 있어서 빨리 식사해야 합니다."
                </p>
                <p className="text-blue-600 dark:text-blue-400 font-medium">
                  - 2,000원 제안
                </p>
              </div>
              <div className="overlay">
                <div className="text-white p-6 text-center">
                  <p className="text-lg font-semibold mb-2">해결된 문제</p>
                  <p>
                    학생들에게 잘 알려지지 않은 교직원 식당으로 안내받아 시간
                    내에 여유 있게 식사를 마침
                  </p>
                </div>
              </div>
            </UseCaseCard>

            <UseCaseCard className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
              <div className="p-8">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-6">
                  <span className="text-2xl">🚗</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  교통 관련 정보
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  "지금 기숙사에서 기차역까지 가야 하는데 택시가 안 잡혀요. 15분
                  후에 출발하는 기차를 타야 합니다. 혹시 이 근처에서 역 방향으로
                  가시는 분 계신가요?"
                </p>
                <p className="text-blue-600 dark:text-blue-400 font-medium">
                  - 7,000원 제안
                </p>
              </div>
              <div className="overlay">
                <div className="text-white p-6 text-center">
                  <p className="text-lg font-semibold mb-2">해결된 문제</p>
                  <p>
                    같은 방향으로 가는 학생과 연결되어 우연적 카풀이 성사되어
                    중요한 학회 발표를 위한 기차에 무사히 탑승
                  </p>
                </div>
              </div>
            </UseCaseCard>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div
        id="testimonials-section"
        className={`py-24 transition-opacity duration-1000 ${isVisible.testimonials ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full mb-4 dark:bg-blue-900 dark:text-blue-200">
              사용자 경험
            </span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              띱이 만든 변화
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              사용자들이 들려주는 실제 경험 이야기
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4">
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    최
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    최윤서
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    컴퓨터공학과 4학년
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                "할머니가 돌아가시기 전에 주신 유일한 가족사진이었어요. 학교
                공식 분실물 센터에도 문의했지만 접수된 게 없다고 해서 정말
                포기하고 있었어요. 띱 덕분에 사진을 찾을 수 있었습니다."
              </p>
            </TestimonialCard>

            <TestimonialCard className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4">
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    김
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    김도현
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    사회학과 4학년
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                "띱을 쓰기 시작한 지 두 달 정도 됐는데, 지금까지 약 10만원 정도
                벌었어요. 대부분 제가 우연히 알게 된 정보를 공유하는 거죠.
                무엇보다 다른 학생들의 급한 문제를 해결해주는 데서 오는 보람이
                있습니다."
              </p>
            </TestimonialCard>

            <TestimonialCard className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4">
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    왕
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    왕리
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    국제대학원 교환학생
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                "한국에 와서 처음 몇 주는 정말 힘들었어요. 언어도 서툴고,
                캠퍼스가 너무 넓어서 길을 자주 잃었죠. 띱은 저에게 정말 구세주
                같은 존재였습니다. 이제는 저도 다른 유학생들을 위해 정보를
                제공하고 있어요."
              </p>
            </TestimonialCard>
          </div>
        </div>
      </div>

      {/* Impact Section */}
      <div
        id="impact-section"
        className={`py-24 bg-gray-50 dark:bg-gray-900 transition-opacity duration-1000 ${isVisible.impact ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full mb-4 dark:bg-blue-900 dark:text-blue-200">
              사회적 가치
            </span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              새로운 정보 경제의 시작
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              띱은 단순한 앱이 아닌, 정보에 대한 우리의 인식을 변화시키는 새로운
              패러다임입니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                경제적 의미
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">
                      ✓
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-semibold">
                      정보 외부효과의 내재화:
                    </span>{' '}
                    이전에는 경제 시스템 외부에 있던 일시적 정보의 가치를 시장
                    내부로 가져옵니다
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">
                      ✓
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-semibold">
                      미시적 정보 시장 창출:
                    </span>{' '}
                    너무 작거나 일시적이어서 기존 시장에서 거래되지 않던 정보에
                    대한 새로운 거래 시장을 형성합니다
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">
                      ✓
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-semibold">정보 인식의 변화:</span>{' '}
                    사용자들은 주변의 일상적 정보를 '누구에게 가치 있을까?'라는
                    새로운 관점으로 보기 시작합니다
                  </p>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                사회적 의미
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">
                      ✓
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-semibold">커뮤니티 효율성 향상:</span>{' '}
                    정보가 그것을 가장 필요로 하는 사람에게 더 빠르게
                    전달됨으로써 캠퍼스 전체의 시스템 효율성이 향상됩니다
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">
                      ✓
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-semibold">
                      상호의존적 커뮤니티 형성:
                    </span>{' '}
                    서로의 필요를 더 민감하게 인식하는 상호지원적 공동체 문화가
                    발전합니다
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">
                      ✓
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-semibold">윤리적 정보 거래:</span>{' '}
                    학문적 진실성을 최우선으로 두고 명확한 윤리적 기준을
                    제시합니다
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-600 dark:bg-blue-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-12 sm:px-12 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
              <div className="lg:self-center">
                <h2 className="text-3xl font-bold text-white sm:text-4xl">
                  <span className="block">캠퍼스 생활의 혁신</span>
                  <span className="block">지금 시작하세요</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-blue-100">
                  도움이 필요할 때, 도움을 줄 수 있을 때, 띱과 함께하세요
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  {isAuthenticated ? (
                    <ActionButton
                      to="/requests/new"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-600 bg-white hover:bg-blue-50"
                    >
                      지금 요청하기
                    </ActionButton>
                  ) : (
                    <ActionButton
                      to="/signup"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-600 bg-white hover:bg-blue-50"
                    >
                      지금 가입하기
                    </ActionButton>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
