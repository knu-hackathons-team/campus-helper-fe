import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Menu, X, Home, Bell, User, Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@/store/useThemeStore';

const NavContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
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
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  return (
    <NavContainer className="bg-white dark:bg-gray-800">
      {/* PC/태블릿 네비게이션 */}
      <div className="hidden md:flex justify-between items-center max-w-7xl mx-auto px-4 h-16">
        <a href="/" className="text-xl font-bold text-gray-00 dark:text-gray-100">
          Campus Help
        </a>
        <div className="flex items-center gap-4">
          <a href="/" className="p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <Home className="w-5 h-5" />
          </a>
          <a href="/notifications" className="p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <Bell className="w-5 h-5" />
          </a>
          <a href="/profile" className="p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <User className="w-5 h-5" />
          </a>
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
          <a href="/" className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Campus Help
          </a>
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
              <a href="/" className="p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center gap-2">
                <Home className="w-5 h-5" />
                <span>홈</span>
              </a>
              <a href="/notifications" className="p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center gap-2">
                <Bell className="w-5 h-5" />
                <span>알림</span>
              </a>
              <a href="/profile" className="p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>프로필</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </NavContainer>
  );
};

export default Navbar;