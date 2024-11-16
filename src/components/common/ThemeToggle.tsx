// src/components/common/ThemeToggle.tsx
import { useThemeStore } from '../../store/useThemeStore'
import styled from '@emotion/styled'

const ToggleButton = styled.button`
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`

function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useThemeStore()

  return (
    <ToggleButton
      onClick={toggleDarkMode}
      className="fixed bottom-4 right-4 p-3 rounded-full 
                bg-gray-200 dark:bg-gray-700
                text-gray-800 dark:text-gray-200"
    >
      {isDarkMode ? '🌞' : '🌙'}
    </ToggleButton>
  )
}

export default ThemeToggle