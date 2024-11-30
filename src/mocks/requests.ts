// src/mocks/requests.ts

import { Request } from '../types/request';

export const mockRequests: Request[] = [
  {
    id: '1',
    college: '공과대학',
    author: '김공학',
    title: '프린터 사용법 도움이 필요해요',
    content: '공대 3층 프린터 사용이 처음이라 도움이 필요합니다.',
    distance: 0.2,
    reward: 5000,
    status: 'open',
    createdAt: '2024-11-30T10:00:00Z',
    allowGroupFunding: false,
    baseFunding: 5000,
    totalFunding: 5000,
    participants: 1,
    location: {
      latitude: 37.123,
      longitude: 127.123
    },
    contentLastingTime: 30,
    isFunder: false // 추가
  },
  {
    id: '2',
    college: '인문대학',
    author: '이인문',
    title: '도서관 책 반납 부탁드려요',
    content: '인문대 도서관에 책 반납좀 해주실분 찾습니다.',
    distance: 0.5,
    reward: 3000,
    status: 'open',
    createdAt: '2024-11-30T09:30:00Z',
    allowGroupFunding: false,
    baseFunding: 3000,
    totalFunding: 3000,
    participants: 1,
    location: {
      latitude: 37.124,
      longitude: 127.124
    },
    contentLastingTime: 60,
    isFunder: false // 추가
  },
  {
    id: '3',
    college: '경영대학',
    author: '박경영',
    title: '팀프로젝트 발표자료 프린트',
    content: '경영대 프린터실에서 발표자료 프린트좀 해주실 분 구합니다.',
    distance: 1.0,
    reward: 10000,
    status: 'open',
    createdAt: '2024-11-30T09:00:00Z',
    allowGroupFunding: true,
    baseFunding: 2000,
    totalFunding: 10000,
    participants: 5,
    location: {
      latitude: 37.125,
      longitude: 127.125
    },
    contentLastingTime: 120,
    isFunder: false // 추가
  }
];