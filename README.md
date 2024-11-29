# 🎓 Campus Helper - 캠퍼스 내 실시간 정보공유 심부름 서비스

웹 주소: http://ddip.online

## 📝 프로젝트 소개

Campus Helper는 캠퍼스 내에서 실시간 정보나 즉각적인 도움이 필요한 학생과, 이를 제공할 수 있는 근처 학생을 연결하는 플랫폼입니다.


##  핵심 기능

#### 1. 📍 실시간 요청 및 응답
- 긴급한 상황에서 빠른 도움/정보 요청

#### 2. 🗺️ 위치 기반
- GPS 기반 근거리 요청 우선 표시
- 지도 API를 활용해 정확히 요청 위치 특정

#### 3. 💰 보상 및 평가 시스템
- 금전적 보상 체계
- 요청 수행 결과에 대해 별점 평가

#### 4. 🔒 안전한 거래 환경
- 학생증 기반 회원 인증

## 🌟 주요 사용 사례

- 복지관 스터디룸 빈자리 여부 확인 📚
- 카페 콘센트 자리 여부 확인 🔌
- 노트북 충전기 긴급 대여 💻
- 시험 직전 공학용 계산기 구하기 🧮
## 기술 스택

### 주요 라이브러리
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Zustand](https://img.shields.io/badge/Zustand-FFB13B?style=for-the-badge&logo=zustand&logoColor=black)](https://zustand-demo.pmnd.rs/)
[![React Query](https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)](https://react-query.tanstack.com/)
[![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Emotion](https://img.shields.io/badge/Emotion-DB7093?style=for-the-badge&logo=emotion&logoColor=white)](https://emotion.sh/)
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


# 클래스 다이어그램 상세 설명

## 1. User 클래스
### 데이터
- `id: number` - 사용자의 고유 식별자.
- `nickname: string` - 사용자의 닉네임.
- `college: string` - 사용자가 속한 대학 정보.
- `point: number` - 사용자의 포인트 잔액.
- `isVerified: boolean` - 사용자의 인증 여부.

### 메서드
- `decreasePoint(amount: number)`
  - 사용자의 포인트를 감소시킵니다.
  - 요청 작성이나 펀딩 참여 시 호출됩니다.
  - `amount`는 차감할 포인트의 양을 의미합니다.

- `increasePoint(amount: number)`
  - 사용자의 포인트를 증가시킵니다.
  - 작업 수행을 완료하고 요청자로부터 평가를 받은 후 보상이 지급될 때 호출됩니다.
  - `amount`는 추가할 포인트의 양입니다.

---

## 2. Request 클래스
### 데이터
- `id: number` - 요청의 고유 식별자.
- `title: string` - 요청 제목.
- `content: string` - 요청 상세 내용.
- `reward: number` - 요청 작성자가 설정한 보상 금액.
- `college: string` - 요청과 관련된 대학 정보.
- `writerId: number` - 요청 작성자의 ID.
- `assignedWorkerId: number | null` - 요청에 할당된 작업자의 ID.
- `processingStatus: ProcessingStatus` - 요청의 진행 상태 (`NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`).
- `allowGroupFunding: boolean` - 그룹 펀딩 허용 여부.
- `currentFundingAmount: number` - 현재 펀딩으로 모인 금액.
- `latitude: number` - 요청 위치의 위도.
- `longitude: number` - 요청 위치의 경도.
- `finishContent: string` - 요청 완료 시 작성되는 내용.

### 메서드
- `assignWorker(worker: User)`
  - 특정 작업자를 요청에 할당합니다.
  - 요청의 상태가 `IN_PROGRESS`로 변경되며, 펀딩은 종료됩니다.
  - `worker`는 요청을 수행할 사용자 객체입니다.

- `addParticipant(fundingAmount: number)`
  - 펀딩 가능한 요청에 참여자를 추가합니다.
  - `fundingAmount`는 참여자가 요청에 추가하는 금액을 의미합니다.
  - `allowGroupFunding`이 `true`인 경우에만 호출 가능합니다.
  - `currentFundingAmount`를 업데이트합니다.

- `stopFunding()`
  - 요청에 대한 펀딩을 종료합니다.
  - 작업자가 할당되거나 요청이 특정 조건을 충족하면 호출됩니다.

- `complete(rate: number)`
  - 요청의 최종 완료를 처리합니다.
  - `rate`는 작업자에 대한 평가 점수(0~5)이며, 평가가 완료되면 요청 상태가 `COMPLETED`로 변경됩니다.
  - 보상 지급과 관련된 처리를 수행합니다.

- `isFinishContentVisible(userId: number): boolean`
  - 요청 완료 내용(`finishContent`)을 특정 사용자가 볼 수 있는지 여부를 반환합니다.
  - 요청 작성자, 펀딩 참여자, 작업자만 내용을 확인할 수 있습니다.

- `calculateTotalReward(): number`
  - 요청 작성자가 받을 총 보상 금액을 계산합니다.
  - 총 금액은 요청 금액(`reward`)과 펀딩으로 추가된 금액(`currentFundingAmount`)의 합으로 계산됩니다.

---

## 3. Work 클래스
### 데이터
- `id: number` - 작업의 고유 식별자.
- `requestId: number` - 작업이 연결된 요청의 ID.
- `workerId: number` - 작업 수행자의 ID.
- `isCompleted: boolean` - 작업 완료 여부.
- `finishContent: string` - 작업 완료 시 작성되는 내용.
- `startedAt: DateTime` - 작업 시작 시간.
- `endedAt: DateTime | null` - 작업 종료 시간.

### 메서드
- `workStart()`
  - 작업자가 작업을 시작했음을 기록합니다.
  - 작업의 `startedAt` 값을 현재 시간으로 설정합니다.

- `submitCompletion()`
  - 작업자가 작업 완료 내용을 작성합니다.
  - `finishContent`에 완료 내용을 저장하고, `isCompleted`를 `true`로 설정합니다.

---

## 4. Funding 클래스
### 데이터
- `id: number` - 펀딩의 고유 식별자.
- `requestId: number` - 펀딩이 연결된 요청의 ID.
- `funderId: number` - 펀딩에 참여한 사용자의 ID.
- `amount: number` - 펀딩 금액.

### 메서드
- **Funding 클래스에는 별도의 메서드가 없습니다.**
  - 이 클래스는 단순히 요청과 사용자 간의 펀딩 데이터를 저장하는 데 사용됩니다.
  - 속성(`id`, `requestId`, `funderId`, `amount`)을 통해 펀딩 정보를 관리합니다.

---

## 5. ProcessingStatus (열거형)
### 값
- `NOT_STARTED`
  - 요청 또는 작업이 아직 시작되지 않은 상태.
- `IN_PROGRESS`
  - 요청 또는 작업이 진행 중인 상태.
  - 작업자가 요청에 할당되었거나 작업을 수행 중임을 나타냅니다.
- `COMPLETED`
  - 요청 또는 작업이 완료된 상태.
  - 요청 평가와 보상 처리가 완료되었음을 의미합니다.

---

## 메서드 간 상호작용
### 1. 요청 작성 및 펀딩
- `Request.addParticipant()` 메서드로 다른 사용자가 요청에 참여할 수 있습니다.
- `Request.stopFunding()`은 작업자가 할당되면 자동으로 호출됩니다.

### 2. 작업 완료
- 작업자는 `Work.submitCompletion()`으로 작업을 완료하고 내용을 작성합니다.
- 요청 작성자는 `Request.complete(rate)`를 호출해 작업자 평가와 요청 완료를 처리합니다.

```
classDiagram
    class Member {
        -Long id
        -String loginId
        -String password
        -String nickname
        -String college
        -int point
        -Role role
        +decreasePoint(int)
        +increasePoint(int)
    }

    class Post {
        -Long id
        -String title
        -String content
        -HelpCategory category
        -boolean allowGroupFunding
        -double latitude
        -double longitude
        -int reward
        -ProcessStatus status
        -int currentParticipants
        +addParticipant(int)
        +assignWorker(Member)
    }

    class Work {
        -Long id
        -WorkStatus status
        -LocalDateTime startedAt
        -LocalDateTime completedAt
        +workStart()
        +complete()
        +isCorrectWorker(Member)
    }

    class Funding {
        -Long id
        -int amount
        -ParticipationStatus status
    }

    class Role {
        <<enumeration>>
        USER
        ADMIN
    }

    class ProcessStatus {
        <<enumeration>>
        NOT_STARTED
        IN_PROGRESS
        COMPLETED
    }

    class WorkStatus {
        <<enumeration>>
        NOT_STARTED
        IN_PROGRESS
        COMPLETED
    }

    Member "1" --o "N" Post : writes
    Member "1" --o "N" Work : performs
    Member "1" --o "N" Funding : participates
    Post "1" --o "1" Work : has
    Post "1" --o "N" Funding : receives
```

```
classDiagram
    class User {
        +id: number
        +nickname: string
        +college: string
        +point: number
        +isVerified: boolean
        +decreasePoint(amount: number)
        +increasePoint(amount: number)
    }

    class Request {
        +id: number
        +title: string
        +content: string
        +reward: number
        +college: string
        +writerId: number
        +assignedWorkerId: number|null
        +processingStatus: ProcessingStatus
        +allowGroupFunding: boolean
        +currentFundingAmount: number
        +latitude: number
        +longitude: number
        +finishContent: string
        +assignWorker(worker: User)
        +addParticipant(fundingAmount: number)
        +stopFunding()
        +complete(rate: number)
        +isFinishContentVisible(userId: number): boolean
        +calculateTotalReward(): number
    }

    class Work {
        +id: number
        +requestId: number
        +workerId: number
        +isCompleted: boolean
        +finishContent: string
        +startedAt: DateTime
        +endedAt: DateTime|null
        +workStart()
        +submitCompletion()
    }

    class Funding {
        +id: number
        +requestId: number
        +funderId: number
        +amount: number
    }

    class ProcessingStatus {
        <<enumeration>>
        NOT_STARTED
        IN_PROGRESS
        COMPLETED
    }

    User "1" ..> "*" Request : writes as Requester
    User "1" ..> "*" Work : performs as Worker
    User "1" ..> "*" Funding : participates in
    Request "1" .. "0..1" Work : contains work
    Request "1" *-- "*" Funding : allows when allowGroupFunding
    Request --> ProcessingStatus

    note for User "사용자는 요청을 작성하거나 작업자로 참여하며\n펀딩에도 참여 가능. 포인트로 시스템 내 활동을 관리."
    note for Request "요청글은 작성자에 의해 생성되며\n그룹 펀딩 허용 시 다른 사용자도 참여 가능.\n요청 완료는 평가 후 처리됨."
    note for Work "작업은 하나의 요청에 대해 생성되며\n작업자는 작업 완료 내용을 작성하고 요청자가 평가.\n완료 여부는 요청에서 관리됨."
    note for Funding "다중 참여를 처리하며 참여 금액과 정보를 저장.\n수행자가 지정되면 더 이상 참여 불가능."
    note for ProcessingStatus "요청의 진행 상태를 나타냄.\nNOT_STARTED → IN_PROGRESS → COMPLETED"

```


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
