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
  removable: boolean;
  currentParticipants: number;
}

export interface RequestListResponse {
  content: RequestDto[];      // 백엔드 응답 구조와 동일하게 타입 정의
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}