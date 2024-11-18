# Campus Helper Frontend

캠퍼스 내 실시간 학생 매칭 서비스의 프론트엔드 리포지토리입니다.

## 기술 스택

### 주요 라이브러리
- React
- TypeScript
- Vite
- React Router DOM
- Zustand (상태 관리)
- React Query + Axios (API 통신)
- Tailwind CSS + Emotion (스타일링)

Tailwind: 빠른 레이아웃과 기본 스타일링
Emotion: 복잡한 컴포넌트와 동적 스타일링

>Tailwind CSS를 사용해 대부분의 스타일을 처리합니다. (레이아웃, 여백, 색상 등 기본 스타일 등)

>Emotion은 특정한 고유 스타일이나 컴포넌트별 커스텀 스타일에만 사용하고, Tailwind와 충돌하지 않도록 합니다. (애니메이션, 복잡한 스타일, 호버 효과 등)

>위 방법을 적용해서  스타일링을 모두 이모션으로 이관하지 않고, Tailwind CSS와 Emotion의 스타일링을 적절히 분리하여 사용하여 둘이 충돌되지 않게합니다.

## 개발 도구 설정

### VSCode 추천 익스텐션
- ESLint
- Prettier - Code formatter
- PostCSS Language Support
- Tailwind CSS IntelliSense

### 코드 컨벤션
- ESLint
- Prettier