// src/api/auth/types.ts
import { COLLEGES } from "./constants";

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
  jwt: string;
}

export interface MemberInfo {
  nickname: string;
  college: string;
  point: number;
}

export interface SignUpFormData {
  nickname: string;
  college: College | '';
  loginId: string;
  password: string;
  passwordConfirm: string;
}

// College 타입도 같이 이동
export type College = typeof COLLEGES[number];

export interface LoginFormData {
  loginId: string;
  password: string;
}

export interface LoginResponse {
  jwt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}