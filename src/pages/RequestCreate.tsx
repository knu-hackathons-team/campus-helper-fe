// 현재는 로컬 스토리지에 저장하지만, 실제로는 API를 이용해 백엔드와 통신해야 함

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import LocationSelectMapComponent from '@/components/common/Map/LocationSelectMapComponent';
import { Location } from '@/types/Location';

const FormField = styled.div`
  margin-bottom: 1.5rem;
`;

const RequestCreate = () => {
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    baseFunding: '',
    allowGroupFunding: false,
    college: 'IT대학', // 기본값
    location: null as Location | null

  });

  const handleLocationSelect = (location: Location) => {
    setCurrentLocation(location);
    setFormData(prev => ({
      ...prev,
      location
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentLocation) {
      alert('위치 정보가 필요합니다.');
      return;
    }

    const newRequest = {
      id: (Date.now().toString()),        // 현재 시간을 ID로 사용
      author: "현재사용자",                // 임시 사용자명
      title: formData.title,              // 입력한 제목
      content: formData.content,          // 입력한 내용
      location: currentLocation,          // 지도에서 선택한 위치
      distance: 0,                        // 거리 (추후 계산 필요)
      status: "open",                     // 초기 상태는 '열림'
      createdAt: new Date().toISOString(),// 현재 시간
      allowGroupFunding: formData.allowGroupFunding,  // 그룹 펀딩 허용 여부
      baseFunding: parseInt(formData.baseFunding),    // 기본 금액
      totalFunding: parseInt(formData.baseFunding),   // 초기 총액은 기본 금액과 동일
      participants: 1,                    // 초기 참여자 수 1명
      college: formData.college           // 선택한 단과대학
  };

    // 로컬 스토리지에 저장된 기존 요청 목록 가져오기
    const existingRequests = JSON.parse(localStorage.getItem('requests') || '[]');
    
    // 새 요청 추가
    const updatedRequests = [...existingRequests, newRequest];
    
    // 로컬 스토리지에 저장
    localStorage.setItem('requests', JSON.stringify(updatedRequests));

    // 목록 페이지로 이동
    navigate('/requests');
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          새 요청 작성
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              단과대학
            </label>
            <select
              value={formData.college}
              onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="IT대학">IT대학</option>
              <option value="공과대학">공과대학</option>
              <option value="약학대학">약학대학</option>
            </select>
          </FormField>

          <FormField>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              제목
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </FormField>

          <FormField>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              내용
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full p-2 border rounded-lg h-32 resize-none bg-white dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </FormField>

          <LocationSelectMapComponent onLocationSelect={handleLocationSelect} />


          <FormField>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              기본 금액
            </label>
            <input
              type="number"
              value={formData.baseFunding}
              onChange={(e) => setFormData({ ...formData, baseFunding: e.target.value })}
              className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600"
              min="100"
              required
            />
          </FormField>

          <FormField>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.allowGroupFunding}
                onChange={(e) => setFormData({ ...formData, allowGroupFunding: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                다른 사람도 같은 금액으로 참여할 수 있게 허용
              </span>
            </label>
          </FormField>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/requests')}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              작성하기
            </button>
          </div>



        </form>
      </div>
    </div>
  );
};

export default RequestCreate;