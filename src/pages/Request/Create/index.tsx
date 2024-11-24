// src/pages/Request/Create/index.tsx
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { requestApi } from '@/api/request';
import type { CreateRequestDto, RequestCategory } from '@/api/request/types';
import { ApiError } from '@/api/lib/axios';  // ApiError import 추가
import useAuthStore from '@/store/useAuthStore';
import LocationSelectMapComponent from '@/components/common/Map/LocationSelectMapComponent';
import type { Location } from '@/types/Location';
import { RequestFormData, DEFAULT_FORM_DATA } from './types';

const FormField = styled.div`
  margin-bottom: 1.5rem;
`;

const RequestCreate = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<RequestFormData>(DEFAULT_FORM_DATA);

  // onLocationSelect 함수를 useCallback으로 감싸기
  const handleLocationSelect = useCallback((location: Location) => {
    setCurrentLocation(location);
    setError(null);
  }, []); // 의존성 배열이 비어있으므로 함수가 재생성되지 않음

  // index.tsx에 에러 처리 함수 추가
  const handleError = (error: unknown) => {  // error 타입을 unknown으로 지정
    if (error instanceof ApiError) {
      setError(error.message);
    } else if (error instanceof Error) {  // 일반적인 Error 객체도 처리
      setError(error.message);
    } else {
      setError('요청 생성 중 오류가 발생했습니다.');
    }
    console.error('Failed to create request:', error);
  };

  const validateForm = () => {
    if (!isAuthenticated) {
      setError('로그인이 필요합니다.');
      return false;
    }
    if (!currentLocation) {
      setError('위치를 선택해주세요.');
      return false;
    }
    if (!formData.title.trim()) {
      setError('제목을 입력해주세요.');
      return false;
    }
    if (!formData.content.trim()) {
      setError('내용을 입력해주세요.');
      return false;
    }
    if (!formData.reward || parseInt(formData.reward) < 100) {
      setError('올바른 보상금을 입력해주세요. (최소 100)');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const requestData: CreateRequestDto = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
        allowGroupFunding: formData.allowGroupFunding,
        latitude: currentLocation!.latitude,
        longitude: currentLocation!.longitude,
        ramaningTime: parseInt(formData.ramaningTime),
        reward: parseInt(formData.reward),
      };

      await requestApi.createRequest(requestData);
      navigate('/requests');
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form JSX remains mostly the same, but with improved error handling
  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          새 요청 작성
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Select */}
          <FormField>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              카테고리
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as RequestCategory,
                })
              }
              className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="HELP">도움 요청</option>
              <option value="INFO">정보 공유</option>
            </select>
          </FormField>

          {/* Title Input */}
          <FormField>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              제목
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </FormField>

          {/* Content Textarea */}
          <FormField>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              내용
            </label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="w-full p-2 border rounded-lg h-32 resize-none bg-white dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </FormField>

          {/* Map Component */}
          <LocationSelectMapComponent onLocationSelect={handleLocationSelect} />

          {/* Reward Input */}
          <FormField>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              보상금
            </label>
            <input
              type="number"
              value={formData.reward}
              onChange={(e) =>
                setFormData({ ...formData, reward: e.target.value })
              }
              className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600"
              min="100"
              required
            />
          </FormField>

          {/* Duration Input */}
          <FormField>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              지속 시간 (초)
            </label>
            <input
              type="number"
              value={formData.ramaningTime}
              onChange={(e) =>
                setFormData({ ...formData, ramaningTime: e.target.value })
              }
              className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600"
              min="600"
              required
            />
          </FormField>

          {/* Group Funding Checkbox */}
          <FormField>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.allowGroupFunding}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    allowGroupFunding: e.target.checked,
                  })
                }
                className="rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                다른 사람도 같은 금액으로 참여할 수 있게 허용
              </span>
            </label>
          </FormField>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/requests')}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              disabled={isSubmitting}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 bg-blue-600 text-white rounded-lg 
                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            >
              {isSubmitting ? '처리중...' : '작성하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestCreate;
