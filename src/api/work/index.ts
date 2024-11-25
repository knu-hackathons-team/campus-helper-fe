// src/api/work/index.ts
import axiosInstance from '../lib/axios';
import { WORK_ENDPOINTS } from './constants';
import type { WorkResponse } from './types';
import type { ApiResponse } from '../types/common';

export const workApi = {
  acceptWork: async (postId: number): Promise<ApiResponse<WorkResponse>> => {
    const response = await axiosInstance.post<ApiResponse<WorkResponse>>(
      WORK_ENDPOINTS.ACCEPT(postId)
    );
    return response.data;
  },
};