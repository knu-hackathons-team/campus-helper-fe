// src/api/request/index.ts
import axiosInstance from '../lib/axios';
import { REQUEST_ENDPOINTS } from './constants';
import type { CreateRequestDto, RequestDto } from './types';
import type { ApiResponse, PaginationResponse } from '../types/common';

export const requestApi = {
  createRequest: async (data: CreateRequestDto): Promise<ApiResponse<RequestDto>> => {
    const response = await axiosInstance.post<ApiResponse<RequestDto>>(
      REQUEST_ENDPOINTS.BASE,
      data
    );
    return response.data;
  },

  getRequests: async (page: number = 0, size: number = 10): Promise<ApiResponse<PaginationResponse<RequestDto>>> => {
    const response = await axiosInstance.get<ApiResponse<PaginationResponse<RequestDto>>>(
      REQUEST_ENDPOINTS.BASE,
      {
        params: { page, size }
      }
    );
    return response.data;
  },

  getRequestById: async (id: number): Promise<ApiResponse<RequestDto>> => {
    const response = await axiosInstance.get<ApiResponse<RequestDto>>(
      REQUEST_ENDPOINTS.BY_ID(id)
    );
    return response.data;
  },
};