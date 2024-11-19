// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from './components/Layout/RootLayout';

import Home from './pages/Home';
import RequestList from './pages/RequestList';
import Navbar from './components/Layout/Navbar';
import RequestAccept from './pages/RequestAccept';
import RequestJoin from './pages/RequestJoin';
import RequestCreate from './pages/RequestCreate';

// 임시 페이지 컴포넌트들 (나중에 실제 컴포넌트로 교체)
const Login = () => <div>로그인</div>;
const SignUp = () => <div>회원가입</div>;
const RequestDetail = () => <div>요청 상세</div>;
const MyPage = () => <div>마이페이지</div>;

function App() {
  return (
    <BrowserRouter>
      <div style={{ height: '100vh' }} className="bg-gray-100 dark:bg-gray-900 transition-colors pt-16">
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
