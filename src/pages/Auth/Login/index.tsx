/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import useAuthStore from '../../../store/useAuthStore';
import { authApi } from '@/api/auth';
import type { LoginFormData } from '@/api/auth/types';
import { ApiError } from '@/api/lib/axios';
import useToast from '@/hooks/useToast';

const FormContainer = styled.div`
  max-width: 400px;
  width: 100%;
`;

const formStyle = css`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
`;

const inputStyle = css`
  transition: border-color 0.2s ease;
  &:focus {
    border-color: #3b82f6;
  }
`;

function Login() {
  const navigate = useNavigate();
  const toast = useToast();
  const setToken = useAuthStore((state) => state.setToken);
  const fetchUserInfo = useAuthStore((state) => state.fetchUserInfo);

  const [formData, setFormData] = useState<LoginFormData>({
    loginId: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    if (!formData.loginId.trim()) {
      toast.warning('아이디를 입력해주세요.');
      return false;
    }

    if (!formData.password) {
      toast.warning('비밀번호를 입력해주세요.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const response = await authApi.login(formData);

      if (process.env.NODE_ENV === 'development') {
        console.log('로그인 응답:', response);
      }

      if (response.jwt) {
        setToken(response.jwt);

        if (process.env.NODE_ENV === 'development') {
          console.log('저장된 토큰:', useAuthStore.getState().token);
        }

        await fetchUserInfo();
        navigate('/');
        toast.success('로그인되었습니다.');
      } else {
        toast.error('로그인에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message || '로그인에 실패했습니다. 다시 시도해주세요.');
        console.error('로그인 에러:', err.data);
      } else {
        toast.error('로그인에 실패했습니다. 다시 시도해주세요.');
        console.error('로그인 에러:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange =
    (field: keyof LoginFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        [field]: e.target.value,
      });
    };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <FormContainer>
        <div css={formStyle} className="w-full p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            로그인
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="loginId"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                아이디
              </label>
              <input
                id="loginId"
                type="text"
                css={inputStyle}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                value={formData.loginId}
                onChange={handleInputChange('loginId')}
                placeholder="아이디를 입력해주세요"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                css={inputStyle}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                value={formData.password}
                onChange={handleInputChange('password')}
                placeholder="비밀번호를 입력해주세요"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md transition-colors ${
                isLoading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-blue-600'
              }`}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              계정이 없으신가요?{' '}
            </span>
            <Link to="/signup" className="text-blue-500 hover:text-blue-600">
              회원가입
            </Link>
          </div>
        </div>
      </FormContainer>
    </div>
  );
}

export default Login;