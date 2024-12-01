// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from './components/Layout/RootLayout';
import UserInfoUpdater from './components/user/UserInfoUpdater';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // 새로 추가

import Home from './pages/Home';
import RequestList from './pages/Request/List';
import Navbar from './components/Layout/Navbar';
import RequestCreate from './pages/Request/Create';
import RequestDetail from './pages/Request/Detail';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import MyPage from './pages/MyPage';
import Notifications from './pages/Notifications';

// 임시 페이지 컴포넌트들 (나중에 실제 컴포넌트로 교체)
// const 임시컴포넌트이름 = () => <div>요청 상세</div>;

// QueryClient 인스턴스 생성 (컴포넌트 밖에서)
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {' '}
      {/* 최상위에 추가 */}
      <BrowserRouter>
        <UserInfoUpdater />
        <div
          style={{ height: '100vh' }}
          className="bg-gray-100 dark:bg-gray-900 transition-colors pt-16"
        >
          <Navbar />
          <RootLayout>
            <Routes>
              {/* 메인 */}
              <Route path="/" element={<Home />} />

              {/* 인증 */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />

              {/* 요청 관련 */}
              <Route path="/requests" element={<RequestList />} />
              <Route path="/requests/:id" element={<RequestDetail />} />
              <Route path="/requests/new" element={<RequestCreate />} />

              {/* 마이페이지 */}
              <Route path="/mypage" element={<MyPage />} />

              {/* 최상위에 추가 */}
              <Route path="/notifications" element={<Notifications />} />
            </Routes>
          </RootLayout>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
