"use client"

import { ChevronRight, Bell, Clock, MessageCircle, History, Plus } from "lucide-react"
import Link from "next/link"

export default function GettingStarted() {
  return (
    <div className="min-h-screen p-4 bg-background">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Toastmaster Timer</h1>
          <p className="text-muted-foreground">Your complete toolkit for Toastmaster meetings</p>
        </div>

        {/* Quick Start */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Quick Start Guide</h2>
          
          {/* Main Features */}
          <div className="space-y-4">
            {/* Round Robin Timer */}
            <div className="border rounded-lg p-4 bg-card hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500 p-3 rounded-lg text-white flex-shrink-0">
                  <Bell size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">1. Round Robin Timer</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    A 20-second countdown timer perfect for round-robin speaking sessions. The bell automatically rings when time's up.
                  </p>
                  <div className="text-sm bg-muted p-3 rounded mb-3 space-y-1">
                    <p><span className="font-semibold">How to use:</span></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Click <span className="font-mono bg-background px-2 py-1 rounded">Start</span> to begin the countdown</li>
                      <li>Press the big red bell button to ring manually anytime</li>
                      <li>Use <span className="font-mono bg-background px-2 py-1 rounded">Mute</span> button to silence the bell</li>
                      <li>Click <span className="font-mono bg-background px-2 py-1 rounded">Reset</span> to restart the timer</li>
                    </ul>
                  </div>
                  <Link href="/" className="inline-flex items-center text-blue-500 hover:text-blue-600 text-sm font-semibold">
                    Go to Round Robin <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Speech Timer */}
            <div className="border rounded-lg p-4 bg-card hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-green-500 p-3 rounded-lg text-white flex-shrink-0">
                  <Clock size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">2. Speech Timer</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Track speech times with color-coded visual feedback. Green when starting, yellow when approaching limit, red when exceeded.
                  </p>
                  <div className="text-sm bg-muted p-3 rounded mb-3 space-y-1">
                    <p><span className="font-semibold">How to use:</span></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Select a <span className="font-mono bg-background px-2 py-1 rounded">Time Preset</span> (Table Topics, Ice Breaker, etc.)</li>
                      <li>Add speakers using the <span className="font-mono bg-background px-2 py-1 rounded">+ button</span></li>
                      <li>Click a speaker to select them and start their timer</li>
                      <li>Use <span className="font-mono bg-background px-2 py-1 rounded">Finish & Save</span> to record the speech</li>
                      <li>Click the settings icon to customize time thresholds per speaker</li>
                    </ul>
                  </div>
                  <div className="text-xs text-muted-foreground mb-3 p-2 bg-blue-50 dark:bg-blue-950 rounded">
                    💡 <span className="font-semibold">Pro tip:</span> Each speaker remembers their own time settings
                  </div>
                  <Link href="/speech-timer" className="inline-flex items-center text-blue-500 hover:text-blue-600 text-sm font-semibold">
                    Go to Speech Timer <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Ah Counter */}
            <div className="border rounded-lg p-4 bg-card hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-purple-500 p-3 rounded-lg text-white flex-shrink-0">
                  <MessageCircle size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">3. Ah Counter</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Track filler words and speech patterns: Ah, Um, Er, So, Like, and You Know.
                  </p>
                  <div className="text-sm bg-muted p-3 rounded mb-3 space-y-1">
                    <p><span className="font-semibold">How to use:</span></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Add multiple speakers for group sessions</li>
                      <li>Tap any filler word button to count occurrences</li>
                      <li>Switch between speakers to track different people</li>
                      <li>Click the undo button (circular arrow) to undo last count</li>
                      <li>Use <span className="font-mono bg-background px-2 py-1 rounded">Save & Reset Session</span> to save counts</li>
                    </ul>
                  </div>
                  <Link href="/ah-counter" className="inline-flex items-center text-blue-500 hover:text-blue-600 text-sm font-semibold">
                    Go to Ah Counter <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Meeting Records */}
            <div className="border rounded-lg p-4 bg-card hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-orange-500 p-3 rounded-lg text-white flex-shrink-0">
                  <History size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">4. Meeting Records</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Organize all your speech and Ah counter data by meeting. Perfect for tracking progress over time.
                  </p>
                  <div className="text-sm bg-muted p-3 rounded mb-3 space-y-1">
                    <p><span className="font-semibold">How to use:</span></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Create a new meeting with custom name and date</li>
                      <li>All speech and Ah counter data is automatically saved to the meeting</li>
                      <li>View all recordings grouped by meeting</li>
                      <li>Export meeting data as JSON for records</li>
                      <li>Delete meetings and associated records anytime</li>
                    </ul>
                  </div>
                  <Link href="/meeting-records" className="inline-flex items-center text-blue-500 hover:text-blue-600 text-sm font-semibold">
                    View Meeting Records <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="border rounded-lg p-3 bg-card">
              <p className="text-sm font-semibold mb-1">Offline Support</p>
              <p className="text-xs text-muted-foreground">Works perfectly offline with automatic syncing</p>
            </div>
            <div className="border rounded-lg p-3 bg-card">
              <p className="text-sm font-semibold mb-1">Data Persistence</p>
              <p className="text-xs text-muted-foreground">All data saved locally on your device</p>
            </div>
            <div className="border rounded-lg p-3 bg-card">
              <p className="text-sm font-semibold mb-1">Multiple Users</p>
              <p className="text-xs text-muted-foreground">Track unlimited speakers per session</p>
            </div>
            <div className="border rounded-lg p-3 bg-card">
              <p className="text-sm font-semibold mb-1">Install as App</p>
              <p className="text-xs text-muted-foreground">Add to home screen on iOS or Android</p>
            </div>
            <div className="border rounded-lg p-3 bg-card">
              <p className="text-sm font-semibold mb-1">Color-Coded Alerts</p>
              <p className="text-xs text-muted-foreground">Visual feedback for timing milestones</p>
            </div>
            <div className="border rounded-lg p-3 bg-card">
              <p className="text-sm font-semibold mb-1">Dark Mode</p>
              <p className="text-xs text-muted-foreground">Automatic theme based on system preference</p>
            </div>
          </div>
        </div>

        {/* Getting Started Steps */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Getting Started in 3 Steps</h2>
          <div className="space-y-3">
            <div className="flex gap-4">
              <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">1</div>
              <div>
                <p className="font-semibold">Start with Round Robin</p>
                <p className="text-sm text-muted-foreground">Get familiar with the 20-second timer and bell</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">2</div>
              <div>
                <p className="font-semibold">Use Speech Timer for Speeches</p>
                <p className="text-sm text-muted-foreground">Add your speakers and track their speaking times</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">3</div>
              <div>
                <p className="font-semibold">Track with Ah Counter</p>
                <p className="text-sm text-muted-foreground">Count filler words to help speakers improve</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-950 mb-8">
          <h3 className="font-semibold mb-2">Pro Tips</h3>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>💡 Customize time presets in Speech Timer for different speaker types</li>
            <li>💡 Use Undo button in Ah Counter if you make a counting mistake</li>
            <li>💡 Create separate meetings for each Toastmaster event</li>
            <li>💡 Review past meeting records to track progress</li>
            <li>💡 Install the app on your phone for easy access during meetings</li>
          </ul>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <Link href="/" className="border rounded-lg p-4 text-center hover:bg-muted transition-colors">
            <div className="font-semibold mb-1">Round Robin</div>
            <div className="text-xs text-muted-foreground">Start here</div>
          </Link>
          <Link href="/speech-timer" className="border rounded-lg p-4 text-center hover:bg-muted transition-colors">
            <div className="font-semibold mb-1">Speech Timer</div>
            <div className="text-xs text-muted-foreground">Time speeches</div>
          </Link>
          <Link href="/ah-counter" className="border rounded-lg p-4 text-center hover:bg-muted transition-colors">
            <div className="font-semibold mb-1">Ah Counter</div>
            <div className="text-xs text-muted-foreground">Count fillers</div>
          </Link>
          <Link href="/meeting-records" className="border rounded-lg p-4 text-center hover:bg-muted transition-colors">
            <div className="font-semibold mb-1">Records</div>
            <div className="text-xs text-muted-foreground">View history</div>
          </Link>
        </div>
      </div>
    </div>
  )
}
