'use client'

import { useEffect } from 'react'

export function PWARegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/api/sw')
        .then((registration) => {
          console.log('[v0] Service Worker registered:', registration)
        })
        .catch((error) => {
          console.log('[v0] Service Worker registration failed:', error)
        })
    }
  }, [])

  return null
}
