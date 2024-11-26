// src/api/funding/types.ts
import { ProcessingStatus } from '../request/types';

export interface MyFundingListResponse {
  content: Array<{
    id: number;
    college: string;
    writer: string;
    title: string;
    content: string;
    category: 'INFO' | 'HELP';
    allowGroupFunding: boolean;
    processingStatus: ProcessingStatus;
    latitude: number;
    longitude: number;
    reward: number;
    createdAt: string;
    removable: boolean;
    currentParticipants: number;
  }>;
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}