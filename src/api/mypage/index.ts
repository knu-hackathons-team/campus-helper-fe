// src/api/mypage/index.ts

import axiosInstance from '../lib/axios';
import { MYPAGE_ENDPOINTS } from './constants';
import type { ApiResponse } from '../types/common';

export const mypageApi = {
  getpoint: async () => {
    const response = await axiosInstance.get(MYPAGE_ENDPOINTS.GETPOINT);
    return response.data;
  },

};
