"use client"

import type React from "react"
import { useEffect } from "react"
import { Home, Clock, MessageCircle, History } from "lucide-react"
import { PWARegister } from "@/components/pwa-register"
import { useTheme } from "@/hooks/use-theme"

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const { isMounted } = useTheme()

  if (!isMounted) return <>{children}</>

  return (
    <>
      <PWARegister />
      <div className="min-h-screen pb-14">{children}</div>
      <nav className="fixed bottom-0 left-0 right-0 flex justify-around bg-background dark:bg-slate-900 border-t border-border dark:border-slate-700 py-1 px-2 shadow-lg">
        <a href="/" className="flex flex-col items-center py-1 px-1 text-foreground dark:text-slate-100 hover:opacity-80 transition-opacity">
          <Home size={20} />
          <span className="text-xs mt-0.5">Round Robin</span>
        </a>
        <a href="/speech-timer" className="flex flex-col items-center py-1 px-1 text-foreground dark:text-slate-100 hover:opacity-80 transition-opacity">
          <Clock size={20} />
          <span className="text-xs mt-0.5">Speech Timer</span>
        </a>
        <a href="/ah-counter" className="flex flex-col items-center py-1 px-1 text-foreground dark:text-slate-100 hover:opacity-80 transition-opacity">
          <MessageCircle size={20} />
          <span className="text-xs mt-0.5">Ah Counter</span>
        </a>
        <a href="/meeting-records" className="flex flex-col items-center py-1 px-1 text-foreground dark:text-slate-100 hover:opacity-80 transition-opacity">
          <History size={20} />
          <span className="text-xs mt-0.5">Records</span>
        </a>
      </nav>
    </>
  )
}
