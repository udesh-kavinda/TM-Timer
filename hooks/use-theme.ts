'use client'

import { useEffect, useState } from 'react'

export function useTheme() {
  const [isDark, setIsDark] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Check localStorage and system preference
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    const shouldBeDark = stored === 'dark' || (stored === null && prefersDark)
    setIsDark(shouldBeDark)
    updateTheme(shouldBeDark)
  }, [])

  const updateTheme = (dark: boolean) => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const toggleTheme = () => {
    const newValue = !isDark
    setIsDark(newValue)
    updateTheme(newValue)
  }

  return { isDark, toggleTheme, isMounted }
}
