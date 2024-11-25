import React, { useState, useCallback, useRef, useEffect } from 'react';
import styled from '@emotion/styled';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

const Wrapper = styled.div`
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
`;

const Container = styled.div<{ translateY: number }>`
  transition: transform 0.2s ease;
  transform: translateY(${props => Math.max(0, props.translateY)}px);
  position: relative;
  z-index: 1;
  min-height: 100%;
`;

const RefreshIndicator = styled.div<{
  isVisible: boolean;
  isRefreshing: boolean;
}>`
  position: fixed; // absolute -> fixed로 변경
  left: 0;
  right: 0;
  top: 0; // -60px -> 0으로 변경
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  padding: 10px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 2; // z-index 추가

  .content {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.2s ease;
    opacity: ${(props) => (props.isVisible ? 1 : 0)};
  }

  .spinner {
    width: 24px;
    height: 24px;
    border: 2px solid #f3f3f3;
    border-top: 2px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 8px;
    display: ${(props) =>
      props.isRefreshing ? 'block' : 'block'}; // 항상 보이도록 수정
  }

  .arrow {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    transform: ${(props) => (props.isRefreshing ? 'rotate(180deg)' : 'none')};
    transition: transform 0.2s ease;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const THRESHOLD = 80;

const CustomPullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
}) => {
  const [translateY, setTranslateY] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef<number | null>(null);
  const currentY = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0); // 마지막 스크롤 위치 저장
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = (e: TouchEvent) => {
    const container = containerRef.current;
    if (!container) return;

    // 이전 스크롤 타임아웃 클리어
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    // 현재 스크롤 위치 저장
    lastScrollTop.current = container.scrollTop;
    
    // 스크롤이 완전히 최상단이고 스크롤 중이 아닐 때만 시작
    if (container.scrollTop <= 0 && !isScrolling) {
      console.log('Touch start allowed - at top');
      startY.current = e.touches[0].clientY;
    } else {
      console.log('Touch start ignored - not at top or scrolling', {
        scrollTop: container.scrollTop,
        isScrolling
      });
      startY.current = null;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    const container = containerRef.current;
    if (!container || startY.current === null || isRefreshing || isScrolling) {
      return;
    }

    // 스크롤 위치가 정확히 0이 아니면 pull-to-refresh 취소
    if (container.scrollTop > 0) {
      console.log('Touch move cancelled - not at top');
      startY.current = null;
      return;
    }

    currentY.current = e.touches[0].clientY;
    const diff = currentY.current - startY.current;
    
    // 아래로 당기는 경우에만 pull-to-refresh 처리
    if (diff > 0) {
      console.log('Pulling down:', { diff, scrollTop: container.scrollTop });
      e.preventDefault();
      const resistance = 0.4;
      setTranslateY(Math.min(diff * resistance, THRESHOLD));
    } else {
      // 위로 스크롤하는 경우 pull-to-refresh 취소
      startY.current = null;
      setTranslateY(0);
    }
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    // 스크롤 중임을 표시
    setIsScrolling(true);
    
    // 이전 타임아웃 클리어
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    // 스크롤이 멈춘 후 100ms 후에 스크롤 상태 해제
    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false);
    }, 100);

    lastScrollTop.current = container.scrollTop;
  };

  const handleTouchEnd = async () => {
    console.log('Touch End:', {
      translateY,
      threshold: THRESHOLD,
      isRefreshing,
      willRefresh: translateY >= THRESHOLD && !isRefreshing,
    });

    if (translateY >= THRESHOLD && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setTranslateY(0);
      }
    } else {
      setTranslateY(0);
    }
    startY.current = null;
    currentY.current = null;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart);
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
      container.addEventListener('touchend', handleTouchEnd);
      container.addEventListener('scroll', handleScroll);

      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
        container.removeEventListener('scroll', handleScroll);
        if (scrollTimeout.current) {
          clearTimeout(scrollTimeout.current);
        }
      };
    }
  }, [isRefreshing, translateY, isScrolling]);

  return (
    <Wrapper ref={containerRef}>
      <RefreshIndicator
        isVisible={translateY > 0 || isRefreshing}
        isRefreshing={isRefreshing}
      >
        <div className="content">
          {isRefreshing ? (
            <>
              <div className="spinner" />
              <span>새로고침 중...</span>
            </>
          ) : translateY > 0 ? ( // translateY가 0보다 클 때만 표시
            <>
              <div
                className="spinner"
                style={{
                  opacity: translateY / THRESHOLD,
                  transform: `rotate(${(translateY / THRESHOLD) * 360}deg)`,
                }}
              />
              <span>
                {translateY >= THRESHOLD
                  ? '놓아서 새로고침'
                  : '당겨서 새로고침'}
                ({Math.round(translateY)}px)
              </span>
            </>
          ) : null}
        </div>
      </RefreshIndicator>
      <Container translateY={translateY}>{children}</Container>
    </Wrapper>
  );
};

export default CustomPullToRefresh;
