// src/store/useAuthStore.ts
import { create } from 'zustand';
import { ApiError } from '@/api/lib/axios';
import { authApi } from '@/api/auth';
import type { MemberInfo } from '@/api/auth/types';

interface AuthState {
  token: string | null;
  userInfo: MemberInfo | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  setUserInfo: (userInfo: MemberInfo) => void;
  logout: () => void;
  fetchUserInfo: () => Promise<void>;
}

// localStorage에서 안전하게 데이터를 가져오는 유틸리티 함수
const getStorageItem = (key: string) => {
  try {
    const item = localStorage.getItem(key);
    // null 체크를 먼저하고, 문자열인 경우에만 JSON.parse 실행
    if (item === null || item === 'undefined') {
      return null;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    localStorage.removeItem(key); // 잘못된 데이터는 삭제
    return null;
  }
};

const useAuthStore = create<AuthState>((set) => ({
  // 초기 상태 설정
  token: localStorage.getItem('token'),
  userInfo: getStorageItem('userInfo'), // 안전한 함수 사용
  isAuthenticated: !!localStorage.getItem('token'),

  // 토큰 설정
  setToken: (token: string) => {
    localStorage.setItem('token', token);
    set({ token, isAuthenticated: true });
  },

  // 사용자 정보 설정
  setUserInfo: (userInfo: MemberInfo) => {
    try {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      set({ userInfo });
    } catch (error) {
      console.error('Error saving userInfo to localStorage:', error);
    }
  },

  // 로그아웃
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    set({ token: null, userInfo: null, isAuthenticated: false });
  },

  // 사용자 정보 가져오기
  fetchUserInfo: async () => {
    try {
      console.log('Fetching user info...');
      const userInfo = await authApi.getMemberInfo();  // 바로 userInfo로 받기
      console.log('Received userInfo:', userInfo);
      
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      console.log('Saved to localStorage:', JSON.parse(localStorage.getItem('userInfo') || 'null'));
  
      set({ userInfo });
      console.log('Updated store state:', useAuthStore.getState().userInfo);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      if (error instanceof ApiError && error.status === 401) {
        useAuthStore.getState().logout();
      }
      throw error;
    }
  },

}));

export default useAuthStore;
