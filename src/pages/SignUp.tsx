/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import useAuthStore from '@/store/useAuthStore';
import { authApi } from '@/api/auth';
import { COLLEGES } from '@/api/auth/constants';
import type { SignUpFormData } from '@/api/auth/types';
import { ApiError } from '@/api/lib/axios';

// Styled components
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

// 기본값 상수
const DEFAULT_FORM_DATA: SignUpFormData = {
  nickname: '',
  college: '',
  loginId: '',
  password: '',
  passwordConfirm: '',
};

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignUpFormData>(DEFAULT_FORM_DATA);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    if (!formData.college) {
      setError('단과대학을 선택해주세요.');
      return false;
    }
  
    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return false;
    }

    if (formData.password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
  
    if (!validateForm()) return;
  
    try {
      setIsLoading(true);
  
      const registerData = {
        loginId: formData.loginId,
        password: formData.password,
        nickname: formData.nickname,
        college: formData.college,
      };
  
      await authApi.register(registerData);
  
      // 개발 환경에서만 로그 출력
      if (process.env.NODE_ENV === 'development') {
        console.log('회원가입 성공:', registerData.loginId);
      }

      navigate('/login', {
        state: {
          message: '회원가입이 완료되었습니다. 로그인해주세요.',
        },
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || '회원가입에 실패했습니다. 다시 시도해주세요.');
        console.error('회원가입 에러:', err.data);
      } else {
        setError('회원가입에 실패했습니다. 다시 시도해주세요.');
        console.error('회원가입 에러:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange =
    (field: keyof SignUpFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
      setError(''); // 입력이 변경되면 에러 메시지 초기화
    };

  // Select 컴포넌트
  const CollegeSelect = () => (
    <select
      id="college"
      required
      css={inputStyle}
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
      value={formData.college}
      onChange={handleInputChange('college')}
    >
      <option value="">단과대학을 선택해주세요</option>
      {COLLEGES.map((college) => (
        <option key={college} value={college}>
          {college}
        </option>
      ))}
    </select>
  );

  // Input 컴포넌트
  const FormInput = ({
    id,
    type = 'text',
    label,
    placeholder,
    value,
    field,
  }: {
    id: string;
    type?: string;
    label: string;
    placeholder: string;
    value: string;
    field: keyof SignUpFormData;
  }) => (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        required
        css={inputStyle}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
        value={value}
        onChange={handleInputChange(field)}
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <FormContainer>
        <div css={formStyle} className="w-full p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            회원가입
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              id="nickname"
              label="닉네임"
              placeholder="사용하실 닉네임을 입력해주세요"
              value={formData.nickname}
              field="nickname"
            />

            <div>
              <label
                htmlFor="college"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                단과 대학
              </label>
              <CollegeSelect />
            </div>

            <FormInput
              id="loginId"
              label="아이디"
              placeholder="사용하실 아이디를 입력해주세요"
              value={formData.loginId}
              field="loginId"
            />

            <FormInput
              id="password"
              type="password"
              label="비밀번호"
              placeholder="비밀번호를 입력해주세요"
              value={formData.password}
              field="password"
            />

            <FormInput
              id="passwordConfirm"
              type="password"
              label="비밀번호 확인"
              placeholder="비밀번호를 다시 입력해주세요"
              value={formData.passwordConfirm}
              field="passwordConfirm"
            />

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
              }`}
            >
              {isLoading ? '처리중...' : '회원가입'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              이미 계정이 있으신가요?{' '}
            </span>
            <Link to="/login" className="text-blue-500 hover:text-blue-600">
              로그인
            </Link>
          </div>
        </div>
      </FormContainer>
    </div>
  );
}

export default SignUp;