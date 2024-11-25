// src/api/funding/constants.ts
export const FUNDING_ENDPOINTS = {
  BASE: '/api/funding',
  PARTICIPATE: (postId: number) => `/api/funding/post/${postId}/participate`,
} as const;