// src/api/work/constants.ts
export const WORK_ENDPOINTS = {
  BASE: '/api/work',
  ACCEPT: (postId: number) => `/api/work/${postId}`,
  COMPLETE: (postId: number) => `/api/work/${postId}/done`,
  MY_WORKS: '/api/post/my/work',
} as const;