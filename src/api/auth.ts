import axios from 'axios';
import axiosInstance from './axios';

const BASE_URL = import.meta.env.VITE_API_URL;

export interface MemberRegisterRequest {
  loginId: string;
  password: string;
  nickname: string;
  college: string;
}

export interface LoginRequest {
  loginId: string;
  password: string;
}

export interface LoginResponse {
  jwt: string;  // token이 아닌 jwt로 응답이 오네요
}

export interface MemberInfo {
  nickname: string;
  college: string;
  point: number;
}

export const registerMember = async (data: MemberRegisterRequest) => {
  const response = await axios.post(`${BASE_URL}/api/member/register`, data);
  return response.data;
};

export const loginMember = async (data: LoginRequest) => {
  const response = await axios.post<LoginResponse>(`${BASE_URL}/api/member/login`, data);
  return response.data;
};

export const getMemberInfo = async (): Promise<MemberInfo> => {
  try {
    const response = await axiosInstance.get<MemberInfo>('/api/member/info');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch member info:', error);
    throw error;
  }
};