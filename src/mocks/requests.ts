import { Request } from '../types/request';

export const mockRequests: Request[] = [
  {
    id: "1",
    college: "IT대학",
    author: "슥하닉대가리딱대",
    title: "오도 콘센트 자리 알아주실분",
    content: "자리 찾니 너무힘듭니다나... 제발 찾아주세요..",
    distance: 120,
    reward: 3000,
    status: "open",
    createdAt: "2024-03-18T09:00:00Z",
    allowGroupFunding: false,
    baseFunding: 1500,
    totalFunding: 1500,
    participants: 1
  },
  {
    id: "2",
    college: "약학대학",
    author: "이약사",
    title: "약대 건물 5층 남자화장실 휴지좀",
    content: "만원짜리 지폐로 닦으려다 그냥 휴지사오시는분한테 만원 드림 제발",
    distance: 120,
    reward: 10000,
    status: "open",
    createdAt: "2024-03-18T10:00:00Z",
    allowGroupFunding: false,
    baseFunding: 10000,
    totalFunding: 10000,
    participants: 1
  },
  {
    id: "3",
    college: "공과대학",
    author: "뽀쨕기영",
    title: "다코야키 트럭 텍문에 옴?",
    content: "다코야키 먹고싶은 사람 펀딩ㄱㄱㄱㄱㄱㄱㄱ",
    distance: 120,
    reward: 2100,
    status: "open",
    createdAt: "2024-03-18T11:00:00Z",
    allowGroupFunding: true,
    baseFunding: 600,
    totalFunding: 2400,
    participants: 4
  }
]