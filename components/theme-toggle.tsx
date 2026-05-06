"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex flex-col items-center p-2 text-foreground"
    >
      <div className="relative">
        <Sun size={24} className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon size={24} className="absolute top-0 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </div>
      <span className="text-xs mt-1">Theme</span>
    </button>
  )
}

