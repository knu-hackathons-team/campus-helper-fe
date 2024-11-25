// src/api/work/types.ts
import type { ApiResponse } from '../types/common';

export interface WorkResponse {
  // 백엔드 응답 타입에 맞게 수정 필요
  workId: number;
  postId: number;
  status: string;
}