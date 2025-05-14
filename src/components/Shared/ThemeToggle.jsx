//BANNED COMPONENT

import { useContext } from 'react'
import { ThemeContext } from '../../contexts/ThemeContext'
import { FiMoon, FiSun } from 'react-icons/fi'

export default function ThemeToggle(){
  const { theme, toggleTheme } = useContext(ThemeContext)

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
      aria-label="Toggle dark mode"
    >
      <span
        className={`${
          theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition items-center justify-center`}
      >
        {theme === 'dark' ? (
          <FiMoon className="h-3 w-3 text-gray-600" />
        ) : (
          <FiSun className="h-3 w-3 text-yellow-500" />
        )}
      </span>
    </button>
  )
}