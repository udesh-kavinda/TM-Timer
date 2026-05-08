"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider 
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="toastmaster-theme"
      enableColorScheme={false}
      nonce="inline-theme"
    >
      {children}
    </NextThemesProvider>
  )
}
