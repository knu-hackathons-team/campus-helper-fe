// src/api/funding/constants.ts
export const FUNDING_ENDPOINTS = {
  BASE: '/api/funding',
  PARTICIPATE: (postId: number) => `/api/funding/post/${postId}/participate`,
  MY_FUNDINGS: '/api/post/my/fund',
  WITHDRAW: (postId: number) => `/api/funding/post/${postId}`
} as const;