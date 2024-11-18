export interface Request {
  id: string;
  college: string;      // 단과대학
  author: string;       // 작성자
  title: string;        // 제목
  content: string;      // 내용
  distance: number;     // 거리(미터)
  reward: number;       // 보상금
  status: 'open' | 'closed';  // 요청 상태
  createdAt: string;    // 작성 시간
  allowGroupFunding: boolean;  // 공동 펀딩 허용 여부
  baseFunding: number;     // 기본 펀딩 금액
  totalFunding: number;    // 누적된 총 금액
  participants: number;        // 참여자 수
}