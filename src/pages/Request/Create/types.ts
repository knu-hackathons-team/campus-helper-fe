// src/pages/Request/Create/types.ts
import { RequestCategory } from '@/api/request/types';

export interface RequestFormData {
  title: string;
  content: string;
  category: RequestCategory;
  allowGroupFunding: boolean;
  reward: string;
  ramaningTime: string;
}

const DEFAULT_REMAINING_TIME = 3600; // 1시간

export const DEFAULT_FORM_DATA: RequestFormData = {
  title: '',
  content: '',
  category: 'HELP',
  allowGroupFunding: false,
  reward: '',
  ramaningTime: DEFAULT_REMAINING_TIME.toString(),
};

// types.ts에 에러 타입 추가
export type RequestError = {
  message: string;
};
