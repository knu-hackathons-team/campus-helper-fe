// src/api/request/types.ts
export type RequestCategory = 'INFO' | 'HELP';

export enum ProcessingStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface CreateRequestDto {
  title: string;
  content: string;
  category: RequestCategory;
  allowGroupFunding: boolean;
  latitude: number;
  longitude: number;
  ramaningTime: number;
  reward: number;
}

export interface RequestDto {
  id: number;
  college: string;
  writer: string;
  title: string;
  content: string;
  category: RequestCategory;
  allowGroupFunding: boolean;
  processingStatus: ProcessingStatus;
  latitude: number;
  longitude: number;
  reward: number;
  createdAt: string;
}