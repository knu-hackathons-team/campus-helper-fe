import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'

// React Query 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 데이터가 '신선'하다고 간주되는 시간
      retry: 1,             // 요청 실패시 재시도 횟수
    },
  },
})

/*
주요 변경점:
QueryClientProvider 추가
React Query 기능을 앱 전체에서 사용 가능하게 함
QueryClient 설정

staleTime: 데이터를 얼마나 오래 캐시할지
retry: API 호출 실패시 재시도 횟수
이외에도 다양한 옵션 설정 가능

이렇게 설정하면 앱의 어느 컴포넌트에서든:
const { data, isLoading } = useQuery({
  queryKey: ['todos'],
  queryFn: () => axios.get('/todos')
})
이런 식으로 React Query를 사용할 수 있게 됩니다.
*/

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)