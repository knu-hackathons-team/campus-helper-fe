// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from './components/Layout/RootLayout';
import UserInfoUpdater from './components/user/UserInfoUpdater';

import Home from './pages/Home';
import RequestList from './pages/Request/List';
import Navbar from './components/Layout/Navbar';
import RequestAccept from './pages/Request/Accept';
import RequestJoin from './pages/Request/Join';
import RequestCreate from './pages/Request/Create';
import RequestDetail from './pages/Request/Detail';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import MyPage from './pages/MyPage';

// 임시 페이지 컴포넌트들 (나중에 실제 컴포넌트로 교체)
// const 임시컴포넌트이름 = () => <div>요청 상세</div>;

function App() {
  return (
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
            <Route path="/requests/:id/accept" element={<RequestAccept />} />
            <Route path="/requests/:id/join" element={<RequestJoin />} />
            <Route path="/requests/new" element={<RequestCreate />} />

            {/* 마이페이지 */}
            <Route path="/mypage" element={<MyPage />} />
          </Routes>
        </RootLayout>
      </div>
    </BrowserRouter>
  );
}

export default App;
