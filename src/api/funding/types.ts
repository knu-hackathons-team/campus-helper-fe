// src/api/funding/types.ts
import type { ApiResponse } from '../types/common';

export interface FundingResponse {
  // 백엔드 응답 타입에 맞게 수정 필요
  fundingId: number;
  postId: number;
  status: string;
  amount: number;
}