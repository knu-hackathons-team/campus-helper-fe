// src/api/work/types.ts
import { ProcessingStatus } from '../request/types';

export interface WorkResponse {
  id: number;
  postId: number;
  workerId: number;
  status: ProcessingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MyWorkListResponse {
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

export interface RateWorkRequest {
  rate: number;
} 