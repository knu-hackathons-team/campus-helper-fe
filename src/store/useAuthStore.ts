import { create } from 'zustand';
import axios, { AxiosError } from 'axios';
import { getMemberInfo, MemberInfo } from '../api/auth';

interface AuthState {
  token: string | null;
  userInfo: MemberInfo | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  setUserInfo: (userInfo: MemberInfo) => void;
  logout: () => void;
  fetchUserInfo: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  userInfo: JSON.parse(localStorage.getItem('userInfo') || 'null'),
  isAuthenticated: !!localStorage.getItem('token'),

  setToken: (token: string) => {
    localStorage.setItem('token', token);
    set({ token, isAuthenticated: true });
  },

  setUserInfo: (userInfo: MemberInfo) => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    set({ userInfo });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    set({ token: null, userInfo: null, isAuthenticated: false });
  },

  fetchUserInfo: async () => {
    try {
      const userInfo = await getMemberInfo();
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      set({ userInfo });
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      // 토큰이 유효하지 않은 경우 로그아웃
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        useAuthStore.getState().logout();
      }
    }
  },
}));

export default useAuthStore;