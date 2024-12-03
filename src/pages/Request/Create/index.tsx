import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { requestApi } from '@/api/request';
import type { CreateRequestDto, RequestCategory } from '@/api/request/types';
import { ApiError } from '@/api/lib/axios';
import useAuthStore from '@/store/useAuthStore';
import useToast from '@/hooks/useToast';
import LocationSelectMapComponent from '@/components/common/Map/LocationSelectMapComponent';
import type { Location } from '@/types/Location';
import { RequestFormData, DEFAULT_FORM_DATA } from './types';
import { useQueryClient } from '@tanstack/react-query';

const FormField = styled.div`
  margin-bottom: 1.5rem;
`;

const RequestCreate = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated } = useAuthStore();
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<RequestFormData>(DEFAULT_FORM_DATA);
  const queryClient = useQueryClient();

  const handleLocationSelect = useCallback((location: Location) => {
    setCurrentLocation(location);
  }, []);

  const handleError = (error: unknown) => {
    if (error instanceof ApiError) {
      toast.error(error.message);
    } else if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error('요청 생성 중 오류가 발생했습니다.');
    }
    console.error('Failed to create request:', error);
  };

  const validateForm = () => {
    if (!isAuthenticated) {
      toast.warning('로그인이 필요합니다.');
      return false;
    }
    if (!currentLocation) {
      toast.warning('위치를 선택해주세요.');
      return false;
    }
    if (!formData.title.trim()) {
      toast.warning('제목을 입력해주세요.');
      (
        document.querySelector('input[name="title"]') as HTMLInputElement
      )?.focus();
      return false;
    }
    if (!formData.content.trim()) {
      toast.warning('내용을 입력해주세요.');
      (
        document.querySelector(
          'textarea[name="content"]',
        ) as HTMLTextAreaElement
      )?.focus();
      return false;
    }
    if (!formData.reward || parseInt(formData.reward) < 100) {
      toast.warning('올바른 보상금을 입력해주세요. (최소 100)');
      (
        document.querySelector('input[name="reward"]') as HTMLInputElement
      )?.focus();
      return false;
    }
    if (!formData.ramaningTime || parseInt(formData.ramaningTime) < 600) {
      toast.warning('지속 시간은 최소 600초 이상이어야 합니다.');
      (
        document.querySelector('input[name="ramaningTime"]') as HTMLInputElement
      )?.focus();
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
      await queryClient.invalidateQueries({ queryKey: ['requests'] });
      toast.success('요청이 성공적으로 생성되었습니다.');
      navigate('/requests');
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          새 요청 작성
        </h1>

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
              className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            >
              <option value="HELP">도움 요청</option>
              <option value="INFO">정보 요청</option>
            </select>
          </FormField>

          {/* Title Input */}
          <FormField>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              제목
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            />
          </FormField>

          {/* Content Textarea */}
          <FormField>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              내용
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="w-full p-2 border rounded-lg h-32 resize-none bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              // required 속성 제거
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
              name="reward"
              value={formData.reward}
              onChange={(e) =>
                setFormData({ ...formData, reward: e.target.value })
              }
              className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              // min과 required 제거
            />
          </FormField>

          {/* Duration Input */}
          <FormField>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              지속 시간 (초)
            </label>
            <input
              type="number"
              name="ramaningTime"
              value={formData.ramaningTime}
              onChange={(e) =>
                setFormData({ ...formData, ramaningTime: e.target.value })
              }
              className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              // min과 required 제거
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
              onClick={() => {
                toast.info('작성을 취소하고 목록으로 돌아갑니다.');
                navigate('/requests');
              }}
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
