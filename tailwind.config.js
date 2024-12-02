/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // Tailwind가 스캔할 파일들
  ],
  darkMode: 'class', // 여기를 'class'로 설정
  theme: {
    extend: {}, // 테마 커스터마이징
  },
  plugins: [], // 추가 플러그인
  extend: {
    keyframes: {
      'slide-in': {
        '0%': { transform: 'translateX(100%)', opacity: '0' },
        '100%': { transform: 'translateX(0)', opacity: '1' }
      },
    },
    animation: {
      'slide-in': 'slide-in 0.3s ease-out',
    },
  },
};
