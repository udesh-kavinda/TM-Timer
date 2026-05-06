import type React from "react"
import "./globals.css"
import { LayoutClient } from "@/components/layout-client"

export const metadata = {
  title: "Toastmaster Timer",
  description: "Timer app for Toastmaster meetings",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  )
}
