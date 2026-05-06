"use client"

import Link from "next/link"

export function Nav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center gap-4 bg-white p-4 shadow-lg">
      <Link href="/" className="rounded bg-blue-500 px-4 py-2 text-white">
        Bell Timer
      </Link>
      <Link href="/speech-timer" className="rounded bg-green-500 px-4 py-2 text-white">
        Speech Timer
      </Link>
    </div>
  )
}

