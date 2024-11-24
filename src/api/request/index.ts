// src/api/request/index.ts
import axiosInstance from '../lib/axios';
import { REQUEST_ENDPOINTS } from './constants';
import type {
  CreateRequestDto,
  RequestDto,
  RequestListResponse,
} from './types';
import type { ApiResponse } from '../types/common';

export const requestApi = {
  createRequest: async (
    data: CreateRequestDto,
  ): Promise<ApiResponse<RequestDto>> => {
    const response = await axiosInstance.post<ApiResponse<RequestDto>>(
      REQUEST_ENDPOINTS.BASE,
      data,
    );
    return response.data;
  },

  // 백엔드에서 페이지당 size 넘겨주긴 한데 여기서 또 설정하고 있음.
  getRequests: async (
    page: number = 0,
    size: number = 5,
  ): Promise<RequestListResponse> => {
    const response = await axiosInstance.get(
      `/api/post?page=${page}&size=${size}`,
    );
    return response.data;
  },

  getRequestById: async (id: number) => {
    const response = await axiosInstance.get<RequestDto>(`/api/post/${id}`);
    return response.data;
  },
};
