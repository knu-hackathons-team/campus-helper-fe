import React, { useState } from 'react';
import { Menu, X, Home, Bell, User } from 'lucide-react';
import styled from '@emotion/styled';

const NavContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  transition: all 0.3s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const ContentWrapper = styled.div`
  padding-top: 4rem; /* nav 높이만큼 여백 추가 */
`;

// 나머지 styled components는 동일...
const MenuButton = styled.button`
  transition: transform 0.2s ease;
  &:hover {
    transform: scale(1.05);
  }
`;

const NavLink = styled.a`
  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-1px);
  }
`;

const MobileMenu = styled.div`
  transform-origin: top;
  animation: slideDown 0.2s ease-out;

  @keyframes slideDown {
    from {
      transform: scaleY(0);
      opacity: 0;
    }
    to {
      transform: scaleY(1);
      opacity: 1;
    }
  }
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <NavContainer className="bg-white dark:bg-gray-800">
        {/* PC/태블릿 네비게이션 */}
        <div className="hidden md:flex justify-between items-center max-w-7xl mx-auto px-4 h-16">
          <NavLink href="/" className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Campus Help
          </NavLink>
          <div className="flex gap-4">
            <NavLink href="/" className="p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              <Home className="w-5 h-5" />
            </NavLink>
            <NavLink href="/notifications" className="p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              <Bell className="w-5 h-5" />
            </NavLink>
            <NavLink href="/profile" className="p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              <User className="w-5 h-5" />
            </NavLink>
          </div>
        </div>

        {/* 모바일 네비게이션 */}
        <div className="md:hidden">
          <div className="flex justify-between items-center px-4 h-14">
            <NavLink href="/" className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Campus Help
            </NavLink>
            <MenuButton
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </MenuButton>
          </div>

          {/* 모바일 메뉴 */}
          {isOpen && (
            <MobileMenu className="absolute top-14 left-0 right-0 bg-white dark:bg-gray-900 border-t dark:border-gray-800">
              <div className="flex flex-col p-4 dark:bg-gray-800">
                <NavLink href="/" className="p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  <span>홈</span>
                </NavLink>
                <NavLink href="/notifications" className="p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  <span>알림</span>
                </NavLink>
                <NavLink href="/profile" className="p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>프로필</span>
                </NavLink>
              </div>
            </MobileMenu>
          )}
        </div>
      </NavContainer>
      <ContentWrapper />
    </>
  );
};

export default Navbar;