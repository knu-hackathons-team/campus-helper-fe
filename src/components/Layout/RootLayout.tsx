// src/components/layout/RootLayout.tsx
import { useEffect } from 'react'
import { useThemeStore } from '../../store/useThemeStore'
import ThemeToggle from '../common/ThemeToggle'

interface RootLayoutProps {
  children: React.ReactNode
}

function RootLayout({ children }: RootLayoutProps) {
  const isDarkMode = useThemeStore((state) => state.isDarkMode)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      {children}
      <ThemeToggle />
    </div>
  )
}

export default RootLayout