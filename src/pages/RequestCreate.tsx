import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

const FormField = styled.div`
  margin-bottom: 1.5rem;
`;

const RequestCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    baseFunding: '',
    allowGroupFunding: false,
    college: 'IT대학' // 기본값
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRequest = {
      id: (Date.now().toString()), // 임시 ID 생성
      author: "현재사용자", // 실제로는 로그인된 사용자 정보 사용
      title: formData.title,
      content: formData.content,
      distance: 0, // 현재 위치 기반으로 계산 필요
      status: "open" as const,
      createdAt: new Date().toISOString(),
      allowGroupFunding: formData.allowGroupFunding,
      baseFunding: parseInt(formData.baseFunding),
      totalFunding: parseInt(formData.baseFunding),
      participants: 1,
      college: formData.college
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