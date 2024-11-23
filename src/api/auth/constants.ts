// src/api/auth/constants.ts
export const AUTH_ENDPOINTS = {
  LOGIN: '/api/member/login',
  REGISTER: '/api/member/register',
  INFO: '/api/member/info',
} as const;

export const COLLEGES = [
  '인문대학',
  '사회과학대학',
  '자연과학대학',
  '경상대학',
  '공과대학',
  'IT대학',
  '농업생명과학대학',
  '예술대학',
  '사범대학',
  '의과대학',
  '치과대학',
  '수의과대학',
  '생활과학대학',
  '간호대학',
  '약학대학',
  '첨단기술융합대학',
  '생태환경대학',
  '과학기술대학',
  '행정학부',
  '자율전공부',
] as const;