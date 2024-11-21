/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import axios from 'axios';
import useAuthStore from '../store/useAuthStore';
import { loginMember } from '../api/auth';

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

interface LoginFormData {
  loginId: string;
  password: string;
}

function Login() {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const fetchUserInfo = useAuthStore((state) => state.fetchUserInfo);
  
  const [formData, setFormData] = useState<LoginFormData>({
    loginId: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
  
    try {
      setIsLoading(true);
      
      const response = await loginMember(formData);
      console.log('로그인 응답:', response);  // 응답 확인
  
      if (response.jwt) {  // token이 아닌 jwt로 확인
        setToken(response.jwt);
        console.log('저장된 토큰:', useAuthStore.getState().token);  // 저장된 토큰 확인
        
        // 사용자 정보 가져오기
        await fetchUserInfo();
  
        navigate('/');
      } else {
        setError('로그인 응답에 토큰이 없습니다.');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.message ||
          '로그인에 실패했습니다. 다시 시도해주세요.';
        setError(errorMessage);
        console.error('로그인 에러:', err.response?.data);
      } else {
        setError('로그인에 실패했습니다. 다시 시도해주세요.');
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

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

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
                required
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
                required
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
