// src/components/layout/RootLayout.tsx
import { useEffect } from 'react'
import { useThemeStore } from '@/store/useThemeStore'
interface RootLayoutProps {
  children: React.ReactNode
}

function RootLayout({ children }: RootLayoutProps) {
  const isDarkMode = useThemeStore((state) => state.isDarkMode)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  return (
  <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {children}
    </div>
  )
}

export default RootLayout