// src/api/mypage/index.ts

import axiosInstance from '../lib/axios';
import { MYPAGE_ENDPOINTS } from './constants';
import type { ApiResponse } from '../types/common';

export const mypageApi = {
  getpoint: async () => {
    const response = await axiosInstance.get(MYPAGE_ENDPOINTS.GETPOINT);
    return response.data;
  },

  withdrawPoint: async (point: number) => {
    const response = await axiosInstance.post(MYPAGE_ENDPOINTS.WITHDRAW_POINT, {
      point: point // 출금할 포인트 양을 body에 포함
    });
    return response.data;
  },
};
