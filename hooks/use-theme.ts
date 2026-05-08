'use client'

import { useEffect, useState } from 'react'

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    // Only run on client side
    if (typeof window === 'undefined') return false
    
    const stored = localStorage.getItem('toastmaster-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return stored === 'dark' || (stored === null && prefersDark)
  })

  useEffect(() => {
    // Apply theme immediately
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [isDark])

  const updateTheme = (dark: boolean) => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
      localStorage.setItem('toastmaster-theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('toastmaster-theme', 'light')
    }
    setIsDark(dark)
  }

  const toggleTheme = () => {
    updateTheme(!isDark)
  }

  return { isDark, toggleTheme }
}
