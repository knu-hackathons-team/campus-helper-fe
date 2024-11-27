// src/api/work/index.ts
import axiosInstance from '../lib/axios';
import { WORK_ENDPOINTS } from './constants';
import type { MyWorkListResponse,RateWorkRequest  } from './types';
import type { ApiResponse } from '../types/common';

interface CompleteWorkRequest {
  finishContent: string;
}

export const workApi = {
  acceptWork: async (postId: number) => {
    const response = await axiosInstance.post(WORK_ENDPOINTS.ACCEPT(postId));
    return response.data;
  },

  completeWork: async (
    postId: number,
    data: CompleteWorkRequest,
  ): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.post<ApiResponse<void>>(
      WORK_ENDPOINTS.COMPLETE(postId),
      data,
    );
    return response.data;
  },

  rateWork: async (
    postId: number,
    data: RateWorkRequest,
  ): Promise<ApiResponse<void>> => {
    // rate 값이 0에서 5 사이인지 검증
    if (data.rate < 0 || data.rate > 5) {
      throw new Error('Rate must be between 0 and 5');
    }
    
    const response = await axiosInstance.post<ApiResponse<void>>(
      WORK_ENDPOINTS.RATE(postId),
      data,
    );
    return response.data;
  },

  getMyWorks: async (page: number): Promise<MyWorkListResponse> => {
    const response = await axiosInstance.get<MyWorkListResponse>(
      `${WORK_ENDPOINTS.MY_WORKS}?page=${page}&size=5`,
    );
    return response.data;
  },
};
