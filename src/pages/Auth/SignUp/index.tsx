/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { authApi } from '@/api/auth';
import { COLLEGES } from '@/api/auth/constants';
import type { SignUpFormData } from '@/api/auth/types';
import { ApiError } from '@/api/lib/axios';
import useToast from '@/hooks/useToast';

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

const DEFAULT_FORM_DATA: SignUpFormData = {
  nickname: '',
  college: '',
  loginId: '',
  password: '',
  passwordConfirm: '',
};

const FormInput = ({
  id,
  type = 'text',
  label,
  placeholder,
  value,
  field,
  onChange,
}: {
  id: string;
  type?: string;
  label: string;
  placeholder: string;
  value: string;
  field: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
      css={inputStyle}
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
      value={value}
      name={field}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);

function SignUp() {
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState<SignUpFormData>(DEFAULT_FORM_DATA);
  const [isLoading, setIsLoading] = useState(false);

// validateForm 함수 수정
const validateForm = (): boolean => {
  if (!formData.nickname.trim()) {
    toast.warning('닉네임을 입력해주세요.');
    return false;
  }
  
  if (!formData.college) {
    toast.warning('단과대학을 선택해주세요.');
    return false;
  }

  if (!formData.loginId.trim()) {
    toast.warning('아이디를 입력해주세요.');
    return false;
  }

  if (!formData.password) {
    toast.warning('비밀번호를 입력해주세요.');
    return false;
  }

  if (!formData.passwordConfirm) {
    toast.warning('비밀번호 확인을 입력해주세요.');
    return false;
  }

  if (formData.password !== formData.passwordConfirm) {
    toast.warning('비밀번호가 일치하지 않습니다.');
    return false;
  }

  return true;
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

      if (process.env.NODE_ENV === 'development') {
        console.log('회원가입 성공:', registerData.loginId);
      }

      navigate('/login');
      toast.success('회원가입이 완료되었습니다. 로그인해주세요.');
      
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message || '회원가입에 실패했습니다. 다시 시도해주세요.');
        console.error('회원가입 에러:', err.data);
      } else {
        toast.error('회원가입에 실패했습니다. 다시 시도해주세요.');
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
    };

  const CollegeSelect = () => (
    <select
      id="college"
      
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <FormContainer>
        <div css={formStyle} className="w-full p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            회원가입
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              id="nickname"
              label="닉네임"
              placeholder="사용하실 닉네임을 입력해주세요"
              value={formData.nickname}
              field="nickname"
              onChange={handleInputChange('nickname')}
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
              onChange={handleInputChange('loginId')}
            />

            <FormInput
              id="password"
              type="password"
              label="비밀번호"
              placeholder="비밀번호를 입력해주세요"
              value={formData.password}
              field="password"
              onChange={handleInputChange('password')}
            />

            <FormInput
              id="passwordConfirm"
              type="password"
              label="비밀번호 확인"
              placeholder="비밀번호를 다시 입력해주세요"
              value={formData.passwordConfirm}
              field="passwordConfirm"
              onChange={handleInputChange('passwordConfirm')}
            />

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md transition-colors ${
                isLoading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-blue-600'
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