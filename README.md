# 🎓 Campus Buddy - 실시간 학생 매칭 서비스

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 📝 프로젝트 소개

Campus Buddy는 캠퍼스 내에서 실시간 정보나 즉각적인 도움이 필요한 학생과, 이를 제공할 수 있는 근처 학생을 연결하는 플랫폼입니다.

### 🌟 주요 사용 사례

- 📚 복지관 스터디룸 빈자리 여부 확인
- 🔌 카페 콘센트 자리 여부 확인
- 💻 노트북 충전기 긴급 대여
- 🧮 시험 직전 공학용 계산기 구하기

## ⚡ 핵심 기능

### 1. 📍 실시간 요청 및 응답
- 긴급한 상황에서 빠른 도움/정보 요청
- 즉각적인 응답 및 물품 전달 시스템
- 실시간 채팅 기능

### 2. 🗺️ 위치 기반 맞춤형 알림
- GPS 기반 근거리 요청 우선 표시
- 건물별 필터링 시스템
- 실시간 위치 업데이트

### 3. 💰 보상 및 평가 시스템
- 금전적 보상 체계
- 신뢰도 점수 시스템
- 사용자 평판 관리
- 활동 이력 관리

### 4. 🔒 안전한 거래 환경
- 학생증 기반 회원 인증
- 안전한 인앱 결제 시스템
- 24시간 고객지원
- 즉각적인 신고 처리 시스템

## 기술 스택

### 주요 라이브러리

- React
- TypeScript
- Vite
- React Router DOM
- Zustand (상태 관리)
- React Query + Axios (API 통신)
- Tailwind CSS + Emotion (스타일링)

  - Tailwind: 빠른 레이아웃과 기본 스타일링
  - Emotion: 복잡한 컴포넌트와 동적 스타일링

> Tailwind CSS를 사용해 대부분의 스타일을 처리합니다. (레이아웃, 여백, 색상 등 기본 스타일 등)

> Emotion은 특정한 고유 스타일이나 컴포넌트별 커스텀 스타일에만 사용하고, Tailwind와 충돌하지 않도록 합니다. (애니메이션, 복잡한 스타일, 호버 효과 등)

> 위 방법을 적용해서 스타일링을 모두 이모션으로 이관하지 않고, Tailwind CSS와 Emotion의 스타일링을 적절히 분리하여 사용하여 둘이 충돌되지 않게합니다.

## 지도 API

본 프로젝트는 **React-Leaflet**과 **Tmap REST API** 두 가지 지도 API를 사용하여 지도 기반 기능을 구현하고 있습니다. 각각의 API는 서로 다른 역할을 수행합니다.

### 1. React-Leaflet

- **역할**:
  - 지도 렌더링을 담당합니다.
  - OpenStreetMap 타일을 기반으로 지도를 화면에 표시합니다.
  - React 컴포넌트 방식으로 작성되어, React 환경에서의 사용이 간편합니다.
  - 중심 좌표 표시, 마커, 경로 표시 등 UI 관련 작업을 수행합니다.
- **특징**:
  - OpenStreetMap 기반으로 작동하며, 무료로 사용할 수 있습니다.
  - 사용자 인터페이스(UI)와의 결합이 간단하며, 상태 관리와의 연동도 용이합니다.
  - 지도 데이터를 직접적으로 제공하지 않고, 타일 렌더링만 수행합니다.

### 2. Tmap REST API

- **역할**:
  - 경로 검색과 같은 데이터 기반의 지도 기능을 제공합니다.
  - 특정 좌표 간의 보행자 경로, 차량 경로, 대중교통 경로 데이터를 제공합니다.
  - React-Leaflet에서 경로 데이터를 표시할 수 있도록 좌표 데이터를 반환합니다.
- **특징**:
  - SKT에서 제공하는 한국에 특화된 지도 및 경로 데이터 API입니다.
  - REST API 방식으로 호출되며, 데이터를 시각화할 때 React-Leaflet과 결합하여 사용됩니다.
  - 상세한 경로 데이터(좌표 배열)를 제공하며, React-Leaflet의 `Polyline` 컴포넌트를 사용해 지도에 표시합니다.

### 지도 API 통합 구조

- **React-Leaflet**:
  - 지도 타일과 UI 렌더링에 사용됩니다.
  - 경로 데이터를 받아 화면에 시각적으로 표시합니다.
- **Tmap REST API**:
  - 경로 데이터 제공에 사용됩니다.
  - React-Leaflet이 사용할 좌표 데이터를 반환합니다.

## 개발 도구 설정

### VSCode 추천 익스텐션

- ESLint
- Prettier - Code formatter
- PostCSS Language Support
- Tailwind CSS IntelliSense

### 코드 컨벤션

- ESLint
- Prettier

참고: .env 파일 만든 후 티맵키 자기꺼 등록 후 사용


```
campus-helper-fe
├─ .eslintrc.cjs
├─ .gitignore
├─ .prettierrc
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ public
│  └─ vite.svg
├─ README.md
├─ src
│  ├─ api
│  │  ├─ auth
│  │  │  ├─ constants.ts
│  │  │  ├─ index.ts
│  │  │  └─ types.ts
│  │  ├─ fetchRoute.tsx
│  │  ├─ funding
│  │  │  ├─ constants.ts
│  │  │  ├─ index.ts
│  │  │  └─ types.ts
│  │  ├─ lib
│  │  │  └─ axios.ts
│  │  ├─ mypage
│  │  │  ├─ constants.ts
│  │  │  └─ index.ts
│  │  ├─ request
│  │  │  ├─ constants.ts
│  │  │  ├─ index.ts
│  │  │  └─ types.ts
│  │  ├─ types
│  │  │  └─ common.ts
│  │  └─ work
│  │     ├─ constants.ts
│  │     ├─ index.ts
│  │     └─ types.ts
│  ├─ App.css
│  ├─ App.tsx
│  ├─ assets
│  │  └─ react.svg
│  ├─ components
│  │  ├─ common
│  │  │  ├─ Distance.tsx
│  │  │  ├─ EstimatedInfo.tsx
│  │  │  ├─ Map
│  │  │  │  ├─ BaseMapComponent.tsx
│  │  │  │  ├─ LocationSelectMapComponent.tsx
│  │  │  │  └─ RouteMapComponent.tsx
│  │  │  └─ Request
│  │  │     ├─ index.ts
│  │  │     ├─ RequestBadge.tsx
│  │  │     ├─ RequestCard.tsx
│  │  │     └─ RequestInfo.tsx
│  │  ├─ Layout
│  │  │  ├─ Navbar.tsx
│  │  │  └─ RootLayout.tsx
│  │  └─ user
│  │     ├─ UserInfo.tsx
│  │     └─ UserInfoUpdater.tsx
│  ├─ hooks
│  │  ├─ useDistance.ts
│  │  └─ useRequest.ts
│  ├─ index.css
│  ├─ main.tsx
│  ├─ mocks
│  │  └─ requests.ts
│  ├─ pages
│  │  ├─ Auth
│  │  │  ├─ Login
│  │  │  │  └─ index.tsx
│  │  │  └─ SignUp
│  │  │     └─ index.tsx
│  │  ├─ Home
│  │  │  └─ index.tsx
│  │  ├─ MyPage
│  │  │  └─ index.tsx
│  │  └─ Request
│  │     ├─ Accept
│  │     │  └─ index.tsx
│  │     ├─ Create
│  │     │  ├─ index.tsx
│  │     │  └─ types.ts
│  │     ├─ Detail
│  │     │  └─ index.tsx
│  │     ├─ Join
│  │     │  └─ index.tsx
│  │     └─ List
│  │        ├─ CustomPullToRefresh.tsx
│  │        └─ index.tsx
│  ├─ store
│  │  ├─ useAuthStore.ts
│  │  └─ useThemeStore.ts
│  ├─ types
│  │  ├─ common
│  │  │  └─ index.ts
│  │  ├─ Location.ts
│  │  ├─ request
│  │  │  ├─ index.ts
│  │  │  └─ types.ts
│  │  └─ request.ts
│  ├─ utils
│  └─ vite-env.d.ts
├─ tailwind.config.js
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts

```
