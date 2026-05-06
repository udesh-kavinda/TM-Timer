import type React from "react"
import "./globals.css"
import { LayoutClient } from "@/components/layout-client"

export const metadata = {
  title: "Toastmaster Timer",
  description: "A comprehensive timer app for Toastmaster meetings with round robin, speech timing, and Ah counter",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Toastmaster Timer",
  },
  formatDetection: {
    telephone: false,
  },
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
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Toastmaster" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  )
}
