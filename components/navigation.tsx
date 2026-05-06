"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Clock, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navigation() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background lg:border-r lg:border-t-0">
      <div className="flex h-16 items-center gap-4 px-4 lg:h-screen lg:w-16 lg:flex-col">
        <Link href="/" className="lg:mt-4">
          <Button
            variant={pathname === "/" ? "default" : "ghost"}
            size="icon"
            className="h-10 w-10"
            title="Round Robin Timer"
          >
            <Bell className="h-5 w-5" />
            <span className="sr-only">Round Robin Timer</span>
          </Button>
        </Link>
        <Link href="/speech-timer">
          <Button
            variant={pathname === "/speech-timer" ? "default" : "ghost"}
            size="icon"
            className="h-10 w-10"
            title="Speech Timer"
          >
            <Clock className="h-5 w-5" />
            <span className="sr-only">Speech Timer</span>
          </Button>
        </Link>
        <div className="flex-1 lg:flex lg:flex-col lg:justify-end lg:gap-4 lg:pb-4">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

