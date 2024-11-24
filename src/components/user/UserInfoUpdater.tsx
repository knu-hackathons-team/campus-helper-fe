// src/components/user/UserInfoUpdater.tsx

import { useEffect } from 'react';
import useAuthStore from '@/store/useAuthStore';

const UserInfoUpdater = () => {
  const fetchUserInfo = useAuthStore((state) => state.fetchUserInfo);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;

    // 초기 로드시 정보 가져오기
    fetchUserInfo();

    // 5분마다 정보 갱신
    const interval = setInterval(fetchUserInfo, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, fetchUserInfo]);

  return null;
};

export default UserInfoUpdater;