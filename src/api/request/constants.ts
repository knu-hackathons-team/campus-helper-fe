// src/api/request/constants.ts
export const REQUEST_ENDPOINTS = {
  BASE: '/api/post',  // 이전: '/api/requests'를 '/api/post'로 수정
  BY_ID: (id: number) => `/api/post/${id}`,  // 이것도 같이 수정
  MY_REQUESTS: '/api/post/my'
} as const;