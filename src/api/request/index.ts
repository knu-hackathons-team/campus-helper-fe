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

  getAllRequests: async (): Promise<RequestListResponse> => {
    // size를 매우 큰 값으로 설정하여 모든 게시물을 한 번에 가져옴
    const response = await axiosInstance.get(
      '/api/post?page=0&size=1000', // 또는 백엔드와 협의하여 페이지네이션 없이 모든 데이터를 반환하는 새 엔드포인트 생성
    );
    return response.data;
  },

  getRequestById: async (id: number) => {
    const response = await axiosInstance.get<RequestDto>(`/api/post/${id}`);
    return response.data;
  },

  // 요청글 삭제 API 추가
  deleteRequest: async (id: number): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete<ApiResponse<void>>(
      `${REQUEST_ENDPOINTS.BASE}/${id}`,
    );
    return response.data;
  },
};
