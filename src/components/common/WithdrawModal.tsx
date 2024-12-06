// src/components/common/Modal/WithdrawModal.tsx

import { useState } from 'react';
import styled from '@emotion/styled';
import { mypageApi } from '@/api/mypage';
import useToast from '@/hooks/useToast';
import useAuthStore from '@/store/useAuthStore';

// 모달 외부 오버레이 스타일 정의
// 전체 화면을 덮으며 반투명 검정 배경을 제공합니다
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

// 실제 모달 컨테이너의 스타일 정의
// 깔끔한 흰색 배경과 그림자 효과를 가진 카드 형태를 제공합니다
const ModalContainer = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  max-width: 28rem;
  width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

// 모달 컴포넌트의 props 타입 정의
interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WithdrawModal = ({ isOpen, onClose }: WithdrawModalProps) => {
  // 상태 관리를 위한 hooks 설정
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useToast();
  const userInfo = useAuthStore((state) => state.userInfo);
  const fetchUserInfo = useAuthStore((state) => state.fetchUserInfo);

  // 금액 입력 처리 함수
  // 숫자만 입력 가능하도록 제한합니다
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setAmount(value);
    }
  };

  // 출금 처리를 담당하는 핵심 함수
  const handleWithdraw = async () => {
    const withdrawAmount = Number(amount);

    // 입력값 유효성 검사
    if (!amount || withdrawAmount <= 0) {
      error('출금 금액을 입력해주세요.');
      return;
    }

    // 보유 포인트 초과 여부 검사
    if (withdrawAmount > (userInfo?.point || 0)) {
      error('보유 포인트보다 큰 금액은 출금할 수 없습니다.');
      return;
    }

    try {
      setIsLoading(true);
      // API를 통해 출금 요청 수행
      await mypageApi.withdrawPoint(withdrawAmount);
      // 사용자 정보 갱신하여 새로운 포인트 잔액 반영
      await fetchUserInfo();
      // 성공 메시지 표시 및 모달 정리
      success('포인트가 성공적으로 출금되었습니다.');
      setAmount('');
      onClose();
    } catch (err) {
      error('포인트 출금에 실패했습니다. 다시 시도해주세요.');
      console.error('포인트 출금 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 모달이 닫혀있을 때는 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  return (
    // 모달 외부 클릭 시 닫히도록 설정
    <ModalOverlay onClick={onClose}>
      {/* 모달 내부 클릭 시 이벤트 버블링 방지 */}
      <ModalContainer onClick={e => e.stopPropagation()}>
        {/* 모달 헤더 */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">포인트 출금</h2>
        </div>

        {/* 출금 금액 입력 섹션 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            현재 보유 포인트: {userInfo?.point?.toLocaleString() || 0} P
          </label>
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="출금할 금액을 입력하세요"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>

        {/* 버튼 섹션 */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleWithdraw}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isLoading ? '처리 중...' : '출금하기'}
          </button>
        </div>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default WithdrawModal;