// src/api/funding/index.ts
import axiosInstance from '../lib/axios';
import { FUNDING_ENDPOINTS } from './constants';
import type { MyFundingListResponse } from './types';

export const fundingApi = {
  participateInFunding: async (postId: number) => {
    const response = await axiosInstance.post(FUNDING_ENDPOINTS.PARTICIPATE(postId));
    return response.data;
  },

  getMyFundings: async (page: number): Promise<MyFundingListResponse> => {
    const response = await axiosInstance.get<MyFundingListResponse>(
      `${FUNDING_ENDPOINTS.MY_FUNDINGS}?page=${page}&size=5`
    );
    return response.data;
  },
};