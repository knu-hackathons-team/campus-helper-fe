// src/pages/Home.tsx
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 섹션 */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            캠퍼스 도움 요청
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            다른 학생들과 함께 캠퍼스 생활을 더 쉽게 만들어보세요
          </p>
          <div className="space-x-4">
            <Link
              to="/requests/new"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              도움 요청하기
            </Link>
            <Link
              to="/requests"
              className="bg-white text-blue-500 px-6 py-2 rounded-lg border border-blue-500 hover:bg-blue-50"
            >
              요청 목록 보기
            </Link>
          </div>
        </div>

        {/* 기능 소개 섹션 */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">실시간 요청</h2>
            <p className="text-gray-600">
              급한 도움이 필요할 때 주변 학생들과 빠르게 연결됩니다
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">위치 기반</h2>
            <p className="text-gray-600">
              현재 위치 주변의 요청들을 쉽게 확인할 수 있습니다
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">안전한 거래</h2>
            <p className="text-gray-600">
              교내 학생증 인증으로 신뢰할 수 있는 거래가 가능합니다
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home