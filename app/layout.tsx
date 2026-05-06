import type React from "react"
import "./globals.css"
import { Home, Clock, MessageCircle } from "lucide-react"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Toastmaster Timer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen pb-16">{children}</div>
          <nav className="fixed bottom-0 left-0 right-0 flex justify-around bg-background border-t p-3 shadow-lg">
            <a href="/" className="flex flex-col items-center p-2 text-foreground">
              <Home size={24} />
              <span className="text-xs mt-1">Round Robin</span>
            </a>
            <a href="/speech-timer" className="flex flex-col items-center p-2 text-foreground">
              <Clock size={24} />
              <span className="text-xs mt-1">Speech Timer</span>
            </a>
            <a href="/ah-counter" className="flex flex-col items-center p-2 text-foreground">
              <MessageCircle size={24} />
              <span className="text-xs mt-1">Ah Counter</span>
            </a>
            <ThemeToggle />
          </nav>
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.app'
    };
