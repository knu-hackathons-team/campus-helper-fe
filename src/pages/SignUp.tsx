/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import axios from 'axios';
import useAuthStore from '../store/useAuthStore';
import { registerMember, MemberRegisterRequest } from '../api/auth';

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

// 단과대학 목록 상수
const COLLEGES = [
  '인문대학',
  '사회과학대학',
  '자연과학대학',
  '경상대학',
  '공과대학',
  'IT대학',
  '농업생명과학대학',
  '예술대학',
  '사범대학',
  '의과대학',
  '치과대학',
  '수의과대학',
  '생활과학대학',
  '간호대학',
  '약학대학',
  '첨단기술융합대학',
  '생태환경대학',
  '과학기술대학',
  '행정학부',
  '자율전공부',
] as const;

type College = (typeof COLLEGES)[number];

interface SignUpFormData {
  nickname: string;
  college: College | '';
  loginId: string;
  password: string;
  passwordConfirm: string;
}

function SignUp() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [formData, setFormData] = useState<SignUpFormData>({
    nickname: '',
    college: '',
    loginId: '',
    password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.college) {
      setError('단과대학을 선택해주세요.');
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      setIsLoading(true);

      // API 호출을 통한 회원가입
      await registerMember({
        loginId: formData.loginId,
        password: formData.password,
        nickname: formData.nickname,
        college: formData.college,
      });

      // 회원가입 성공 후 로그인 페이지로 이동
      navigate('/login', {
        state: {
          message: '회원가입이 완료되었습니다. 로그인해주세요.',
        },
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.message ||
          '회원가입에 실패했습니다. 다시 시도해주세요.';
        setError(errorMessage);
        console.error('회원가입 에러:', err.response?.data);
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
            회원가입
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="nickname"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                닉네임
              </label>
              <input
                id="nickname"
                type="text"
                required
                css={inputStyle}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                value={formData.nickname}
                onChange={handleInputChange('nickname')}
                placeholder="사용하실 닉네임을 입력해주세요"
              />
            </div>

            <div>
              <label
                htmlFor="college"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                단과 대학
              </label>
              <select
                id="college"
                required
                css={inputStyle}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white bg-white dark:bg-gray-700"
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
            </div>

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
                placeholder="사용하실 아이디를 입력해주세요"
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

            <div>
              <label
                htmlFor="passwordConfirm"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                비밀번호 확인
              </label>
              <input
                id="passwordConfirm"
                type="password"
                required
                css={inputStyle}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                value={formData.passwordConfirm}
                onChange={handleInputChange('passwordConfirm')}
                placeholder="비밀번호를 다시 입력해주세요"
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
