/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // Tailwind가 스캔할 파일들
  ],
  darkMode: 'class', // 여기를 'class'로 설정
  theme: {
    extend: {},  // 테마 커스터마이징
  },
  plugins: [],  // 추가 플러그인
}