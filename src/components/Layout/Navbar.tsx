import { useState } from 'react';
import styled from '@emotion/styled';
import { Menu, X, Home, Bell, User, Sun, Moon, LogOut, MapPin } from 'lucide-react';
import { useThemeStore } from '@/store/useThemeStore';
import useAuthStore from '@/store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';

const NavContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  transition: all 0.3s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const ThemeButton = styled.button`
  transition: transform 0.2s ease;
  &:hover {
    transform: rotate(15deg);
  }
`;

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const userInfo = useAuthStore(state => state.userInfo);
  const logout = useAuthStore(state => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // 인증된 사용자를 위한 메뉴 아이템들
  const AuthenticatedMenuItems = () => (
    <>
      <Link to="/notifications" className="p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
        <Bell className="w-5 h-5" />
      </Link>
      <Link to="/mypage" className="flex items-center gap-2 p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
        <User className="w-5 h-5" />
        <span className="text-sm font-medium">{userInfo?.nickname}</span>
      </Link>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
      >
        <LogOut className="w-5 h-5" />
        <span className="text-sm font-medium">로그아웃</span>
      </button>
    </>
  );

  // 비인증 사용자를 위한 메뉴 아이템
  const UnauthenticatedMenuItems = () => (
    <Link to="/login" className="flex items-center gap-2 p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
      <User className="w-5 h-5" />
      <span className="text-sm font-medium">로그인</span>
    </Link>
  );

  // 공통 메뉴 아이템 (모든 사용자가 접근 가능)
  const CommonMenuItems = () => (
    <>
      <Link to="/" className="p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
        <Home className="w-5 h-5" />
      </Link>
      <Link 
        to="/requests" 
        className="flex items-center gap-2 p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
      >
        <MapPin className="w-5 h-5" />
        <span className="text-sm font-medium">근처 요청</span>
      </Link>
    </>
  );

  return (
    <NavContainer className="bg-white dark:bg-gray-800">
      {/* PC/태블릿 네비게이션 */}
      <div className="hidden md:flex justify-between items-center max-w-7xl mx-auto px-4 h-16">
        <Link to="/" className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Campus Helper
        </Link>
        <div className="flex items-center gap-4">
          <CommonMenuItems />
          {isAuthenticated ? <AuthenticatedMenuItems /> : <UnauthenticatedMenuItems />}
          <ThemeButton
            onClick={toggleDarkMode}
            className="p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            aria-label={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </ThemeButton>
        </div>
      </div>

      {/* 모바일 네비게이션 */}
      <div className="md:hidden">
        <div className="flex justify-between items-center px-4 h-14">
          <Link to="/" className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Campus Helper
          </Link>
          <div className="flex items-center gap-2">
            <ThemeButton
              onClick={toggleDarkMode}
              className="p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              aria-label={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </ThemeButton>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              aria-label={isOpen ? "메뉴 닫기" : "메뉴 열기"}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {isOpen && (
          <div className="absolute top-14 left-0 right-0 bg-white dark:bg-gray-900 border-t dark:border-gray-800">
            <div className="flex flex-col p-4">
              <Link to="/" className="p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center gap-2">
                <Home className="w-5 h-5" />
                <span>홈</span>
              </Link>
              <Link 
                to="/requests" 
                className="p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center gap-2"
              >
                <MapPin className="w-5 h-5" />
                <span>근처 요청</span>
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/notifications" className="p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    <span>알림</span>
                  </Link>
                  <Link to="/mypage" className="p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center gap-2">
                    <User className="w-5 h-5" />
                    <span>프로필</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center gap-2"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>로그아웃</span>
                  </button>
                </>
              ) : (
                <Link to="/login" className="p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>로그인</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </NavContainer>
  );
};

export default Navbar;