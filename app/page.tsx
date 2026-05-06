"use client"

import { useState, useEffect, useRef } from "react"
import { Bell, Play, RotateCcw } from "lucide-react"

export default function RoundRobinTimer() {
  const [time, setTime] = useState(20)
  const [isRunning, setIsRunning] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bicycle-bell-155622-onnN23vCajWoJnzFKT2hZ46FN5wWHO.mp3",
    )

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1)
      }, 1000)
    } else if (time === 0) {
      ringBell()
      resetTimer()
    }

    return () => clearInterval(interval)
  }, [isRunning, time])

  const startTimer = () => {
    setIsRunning(true)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTime(20)
  }

  const ringBell = () => {
    if (audioRef.current) {
      // Create a new audio instance for overlapping sounds
      const audio = new Audio(
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bicycle-bell-155622-onnN23vCajWoJnzFKT2hZ46FN5wWHO.mp3",
      )
      audio.play()
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-2">Round Robin Timer</h1>

      <div className="my-6 text-7xl font-bold">{time}</div>

      <div className="flex gap-4 mb-8 w-full max-w-xs justify-center">
        <button
          onClick={startTimer}
          disabled={isRunning}
          className="w-full rounded-lg bg-blue-500 px-4 py-3 text-white font-medium disabled:bg-gray-400 flex items-center justify-center"
        >
          <Play className="mr-2 h-5 w-5" /> Start
        </button>

        <button
          onClick={resetTimer}
          className="w-full rounded-lg bg-gray-500 px-4 py-3 text-white font-medium flex items-center justify-center"
        >
          <RotateCcw className="mr-2 h-5 w-5" /> Reset
        </button>
      </div>

      <button
        onClick={ringBell}
        className="rounded-full bg-red-500 w-32 h-32 flex items-center justify-center text-white hover:bg-red-600"
      >
        <Bell className="h-16 w-16" />
      </button>
    </div>
  )
}
