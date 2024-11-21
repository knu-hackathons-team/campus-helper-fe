import { useEffect, useState } from 'react';
import useAuthStore from '@/store/useAuthStore';

const UserInfo = () => {
  const userInfo = useAuthStore((state) => state.userInfo);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  // localStorage 변경 감지
  useEffect(() => {
    const handleStorageChange = () => {
      setLastUpdate(Date.now());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (!userInfo) return null;

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">내 정보</h3>
      <div className="space-y-2">
        <p>닉네임: {userInfo.nickname}</p>
        <p>소속: {userInfo.college}</p>
        <p className="text-sm text-gray-500">
          마지막 업데이트: {new Date(lastUpdate).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default UserInfo;