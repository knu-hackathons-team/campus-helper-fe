// src/types/request/types.ts
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

export interface RequestListResponse {
  content: RequestDto[];      // 실제 게시글 배열
  page: number;              // 현재 페이지
  size: number;              // 페이지당 게시글 수
  totalElements: number;     // 전체 게시글 수
  totalPages: number;        // 전체 페이지 수
}

export interface RequestDto {
  id: number;
  college: string;
  writer: string;
  title: string;
  content: string;
  category: RequestCategory;
  allowGroupFunding: boolean;
  processingStatus: ProcessingStatus;  // 여기서 enum 사용
  latitude: number;
  longitude: number;
  reward: number;
  createdAt: string;
}