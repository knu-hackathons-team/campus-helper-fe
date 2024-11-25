// src/api/funding/index.ts
import axiosInstance from '../lib/axios';
import { FUNDING_ENDPOINTS } from './constants';
import type { FundingResponse } from './types';
import type { ApiResponse } from '../types/common';

export const fundingApi = {
  participateInFunding: async (postId: number): Promise<ApiResponse<FundingResponse>> => {
    const response = await axiosInstance.post<ApiResponse<FundingResponse>>(
      FUNDING_ENDPOINTS.PARTICIPATE(postId)
    );
    return response.data;
  },
};