import { Request } from '../types/request';

export const mockRequests: Request[] = [
  {
    id: '1',
    college: 'IT대학',
    author: '슥하닉딱대',
    title: 'IT1호관 연구실에 바퀴벌레 잡아주실분',
    content: '팔뚝만해요 제발 잡아주세요 ㅠㅠ',
    distance: 10,
    reward: 3000,
    status: 'open',
    createdAt: '2024-03-18T09:00:00Z',
    allowGroupFunding: false,
    baseFunding: 5000,
    totalFunding: 5000,
    participants: 1,
    location: {
      latitude: 35.88750790419784,
      longitude: 128.6128520146832,
    },
    contentLastingTime: 300,
  },
  {
    id: '2',
    college: '약학대학',
    author: '섞고섞고돌리고섞고',
    title: '약대 건물 5층 남자화장실 휴지좀',
    content: '만원짜리 지폐로 닦으려다 그냥 휴지사오시는분한테 만원 드림 제발',
    distance: 1,
    reward: 10000,
    status: 'open',
    createdAt: '2024-03-18T10:00:00Z',
    allowGroupFunding: false,
    baseFunding: 10000,
    totalFunding: 10000,
    participants: 1,
    location: {
      latitude: 35.89254172305258,
      longitude: 128.61244470031122,
    },
    contentLastingTime: 300,
  },
  {
    id: '3',
    college: '공과대학',
    author: '뽀쨕기영',
    title: '다코야키 트럭 북문에 옴?',
    content: '다코야키 먹고싶은 사람 펀딩ㄱㄱㄱㄱㄱㄱㄱ 너만오면고',
    distance: 52,
    reward: 2100,
    status: 'open',
    createdAt: '2024-03-18T11:00:00Z',
    allowGroupFunding: true,
    baseFunding: 600,
    totalFunding: 2400,
    participants: 4,
    location: {
      latitude: 35.89241766454495,
      longitude: 128.6096015659663,
    },
    contentLastingTime: 300,
  },
];
