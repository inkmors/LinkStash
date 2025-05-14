//BANNED COMPONENT

import { createContext, useState, useEffect } from 'react'

export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light')
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('linkstash-theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light')
    setTheme(initialTheme)
    document.documentElement.classList.add(initialTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('linkstash-theme', newTheme)
    
    document.documentElement.classList.remove(theme)
    document.documentElement.classList.add(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}