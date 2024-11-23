// src/api/auth/index.ts
import axiosInstance from '../lib/axios';
import { AUTH_ENDPOINTS } from './constants';
import type { LoginRequest, LoginResponse, MemberRegisterRequest, MemberInfo } from './types';
import type { ApiResponse } from '../types/common';

export const authApi = {
  register: async (data: MemberRegisterRequest): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.post<ApiResponse<void>>(
      AUTH_ENDPOINTS.REGISTER,
      data
    );
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>(
      AUTH_ENDPOINTS.LOGIN,
      data
    );
    return response.data;  // axios가 자동으로 response.data를 반환
  },

  getMemberInfo: async (): Promise<MemberInfo> => {  // 반환 타입 수정
    const response = await axiosInstance.get<MemberInfo>(  // 제네릭 타입 수정
      AUTH_ENDPOINTS.INFO
    );
    return response.data;  // axios가 자동으로 data를 추출
  },
};