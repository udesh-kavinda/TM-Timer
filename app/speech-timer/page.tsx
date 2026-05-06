"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Plus, X, User, Play, Pause, RotateCcw, Settings, Check, Edit2, Save, Trash2, Download } from "lucide-react"
import { useSpeechRecords } from "@/hooks/use-speech-records"

type TimeThresholds = {
  green: number
  yellow: number
  red: number
}

type Speaker = {
  id: string
  name: string
  time: number
  colorState: "default" | "green" | "yellow" | "red"
  thresholds: TimeThresholds
}

type SpeechRecord = {
  id: string
  speakerId: string
  speakerName: string
  duration: number
  timestamp: Date
}

// Default time presets (in seconds)
const timePresets = [
  { name: "Table Topics", green: 60, yellow: 90, red: 120 },
  { name: "Ice Breaker", green: 240, yellow: 300, red: 360 },
  { name: "Evaluation", green: 120, yellow: 150, red: 180 },
  { name: "Speech 5-7", green: 300, yellow: 360, red: 420 },
]

// Default thresholds (Table Topics)
const DEFAULT_THRESHOLDS: TimeThresholds = {
  green: 60,
  yellow: 90,
  red: 120,
}

export default function SpeechTimer() {
  const { records, saveSpeech, deleteRecord, clearAllRecords } = useSpeechRecords()
  const [speakers, setSpeakers] = useState<Speaker[]>([
    {
      id: "speaker1",
      name: "Speaker 1",
      time: 0,
      colorState: "default",
      thresholds: { ...DEFAULT_THRESHOLDS },
    },
  ])
  const [activeSpeakerId, setActiveSpeakerId] = useState<string>("speaker1")
  const [newSpeakerName, setNewSpeakerName] = useState<string>("")
  const [isAddingSpeaker, setIsAddingSpeaker] = useState<boolean>(false)
  const [editingSpeakerId, setEditingSpeakerId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState<string>("")
  const [isRunning, setIsRunning] = useState(false)
  const [isEditingThresholds, setIsEditingThresholds] = useState(false)
  const [editingThresholds, setEditingThresholds] = useState<TimeThresholds>({ ...DEFAULT_THRESHOLDS })
  const [selectedPreset, setSelectedPreset] = useState<string>("Table Topics")
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false)
  const [customThresholds, setCustomThresholds] = useState<TimeThresholds>({ ...DEFAULT_THRESHOLDS })

  // Ref to keep track of the next speaker number
  const nextSpeakerNumberRef = useRef(2) // Start at 2 since we already have Speaker 1
  const editInputRef = useRef<HTMLInputElement>(null)

  const activeSpeaker = speakers.find((s) => s.id === activeSpeakerId) || speakers[0]

  // Focus the edit input when entering edit mode
  useEffect(() => {
    if (editingSpeakerId && editInputRef.current) {
      editInputRef.current.focus()
    }
  }, [editingSpeakerId])

  // Update next speaker number when speakers change
  useEffect(() => {
    // Extract numbers from speaker names that match the pattern "Speaker X"
    const speakerNumbers = speakers
      .map((s) => {
        const match = s.name.match(/^Speaker (\d+)$/)
        return match ? Number.parseInt(match[1], 10) : 0
      })
      .filter((num) => num > 0)

    // Set the next number to be one more than the highest existing number
    if (speakerNumbers.length > 0) {
      nextSpeakerNumberRef.current = Math.max(...speakerNumbers) + 1
    } else {
      nextSpeakerNumberRef.current = 1
    }
  }, [speakers])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning) {
      interval = setInterval(() => {
        setSpeakers((currentSpeakers) =>
          currentSpeakers.map((speaker) => {
            if (speaker.id === activeSpeakerId) {
              const newTime = speaker.time + 1
              let newColorState = speaker.colorState

              // Update color state based on speaker's thresholds
              if (newTime >= speaker.thresholds.red) {
                newColorState = "red"
              } else if (newTime >= speaker.thresholds.yellow) {
                newColorState = "yellow"
              } else if (newTime >= speaker.thresholds.green) {
                newColorState = "green"
              }

              return { ...speaker, time: newTime, colorState: newColorState }
            }
            return speaker
          }),
        )
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isRunning, activeSpeakerId])

  // Initialize editing thresholds when opening the settings
  useEffect(() => {
    if (isEditingThresholds) {
      setEditingThresholds({ ...activeSpeaker.thresholds })

      // Find if current thresholds match a preset
      const matchingPreset = timePresets.find(
        (preset) =>
          preset.green === activeSpeaker.thresholds.green &&
          preset.yellow === activeSpeaker.thresholds.yellow &&
          preset.red === activeSpeaker.thresholds.red,
      )

      setSelectedPreset(matchingPreset ? matchingPreset.name : "custom")
    }
  }, [isEditingThresholds, activeSpeaker])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const startTimer = () => {
    setIsRunning(true)
  }

  const pauseTimer = () => {
    setIsRunning(false)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setSpeakers(
      speakers.map((speaker) =>
        speaker.id === activeSpeakerId ? { ...speaker, time: 0, colorState: "default" } : speaker,
      ),
    )
  }

  const finishSpeech = () => {
    if (activeSpeaker.time > 0) {
      // Save to database
      saveSpeech(
        activeSpeaker.name,
        activeSpeaker.time,
        activeSpeaker.thresholds.green,
        activeSpeaker.thresholds.yellow,
        activeSpeaker.thresholds.red
      )

      // Reset the timer
      resetTimer()
    }
  }

  const getBackgroundColor = () => {
    switch (activeSpeaker.colorState) {
      case "green":
        return "bg-green-500"
      case "yellow":
        return "bg-yellow-500"
      case "red":
        return "bg-red-500"
      default:
        return "bg-muted"
    }
  }

  const addSpeaker = () => {
    // Generate a name if none provided
    const speakerName = newSpeakerName.trim() || `Speaker ${nextSpeakerNumberRef.current}`

    const newSpeaker: Speaker = {
      id: `speaker${Date.now()}`,
      name: speakerName,
      time: 0,
      colorState: "default",
      thresholds: { ...DEFAULT_THRESHOLDS }, // Always default to Table Topics
    }

    setSpeakers([...speakers, newSpeaker])
    setActiveSpeakerId(newSpeaker.id)
    setNewSpeakerName("")
    setIsAddingSpeaker(false)

    // Increment the next speaker number if we used an auto-generated name
    if (!newSpeakerName.trim()) {
      nextSpeakerNumberRef.current++
    }
  }

  const removeSpeaker = (speakerId: string) => {
    // Cancel editing if we're removing the speaker being edited
    if (editingSpeakerId === speakerId) {
      setEditingSpeakerId(null)
    }

    const filteredSpeakers = speakers.filter((s) => s.id !== speakerId)
    setSpeakers(filteredSpeakers)

    // If we removed the active speaker, select the first available speaker
    if (speakerId === activeSpeakerId && filteredSpeakers.length > 0) {
      setActiveSpeakerId(filteredSpeakers[0].id)
    }
  }

  const startEditingSpeaker = (speakerId: string, currentName: string) => {
    setEditingSpeakerId(speakerId)
    setEditingName(currentName)
  }

  const saveEditedSpeakerName = () => {
    if (!editingSpeakerId) return

    const trimmedName = editingName.trim()
    if (!trimmedName) {
      // If empty, generate a name like "Speaker X"
      const speakerToEdit = speakers.find((s) => s.id === editingSpeakerId)
      const currentName = speakerToEdit?.name || ""

      // Check if current name is in the format "Speaker X"
      const match = currentName.match(/^Speaker (\d+)$/)
      const newName = match
        ? currentName // Keep the current name if it's already in the format "Speaker X"
        : `Speaker ${nextSpeakerNumberRef.current++}` // Otherwise generate a new one

      setSpeakers(
        speakers.map((speaker) => (speaker.id === editingSpeakerId ? { ...speaker, name: newName } : speaker)),
      )
    } else {
      // Use the provided name
      setSpeakers(
        speakers.map((speaker) => (speaker.id === editingSpeakerId ? { ...speaker, name: trimmedName } : speaker)),
      )
    }

    setEditingSpeakerId(null)
    setEditingName("")
  }

  const cancelEditingSpeaker = () => {
    setEditingSpeakerId(null)
    setEditingName("")
  }

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEditedSpeakerName()
    } else if (e.key === "Escape") {
      cancelEditingSpeaker()
    }
  }

  const saveThresholds = () => {
    // Validate thresholds (green < yellow < red)
    if (editingThresholds.green >= editingThresholds.yellow || editingThresholds.yellow >= editingThresholds.red) {
      alert("Times must be in order: Green < Yellow < Red")
      return
    }

    setSpeakers(
      speakers.map((speaker) =>
        speaker.id === activeSpeakerId ? { ...speaker, thresholds: editingThresholds } : speaker,
      ),
    )
    setIsEditingThresholds(false)
  }

  const handlePresetChange = (presetName: string) => {
    setSelectedPreset(presetName)

    if (presetName !== "custom") {
      const preset = timePresets.find((p) => p.name === presetName)
      if (preset) {
        setEditingThresholds({
          green: preset.green,
          yellow: preset.yellow,
          red: preset.red,
        })
      }
    }
  }

  const minutesToSeconds = (minutes: string): number => {
    const value = Number.parseFloat(minutes)
    return isNaN(value) ? 0 : Math.floor(value * 60)
  }

  const secondsToMinutes = (seconds: number): string => {
    return (seconds / 60).toFixed(1)
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-4 pb-20">
      <h1 className="text-2xl font-bold mb-6">Speech Timer</h1>

      {/* Time Presets Section - Above Speakers */}
      <div className="w-full max-w-md mb-6">
        <div className="flex flex-wrap gap-2">
          {timePresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                setSpeakers(
                  speakers.map((speaker) =>
                    speaker.id === activeSpeakerId
                      ? {
                          ...speaker,
                          thresholds: {
                            green: preset.green,
                            yellow: preset.yellow,
                            red: preset.red,
                          },
                        }
                      : speaker,
                  ),
                )
              }}
              className={`px-3 py-2 rounded-full text-sm font-medium border transition-colors ${
                activeSpeaker.thresholds.green === preset.green &&
                activeSpeaker.thresholds.yellow === preset.yellow &&
                activeSpeaker.thresholds.red === preset.red
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-background text-foreground border-border hover:border-blue-500"
              }`}
            >
              {preset.name}
            </button>
          ))}
          <button
            onClick={() => {
              setCustomThresholds({ ...activeSpeaker.thresholds })
              setIsCustomModalOpen(true)
            }}
            className="px-3 py-2 rounded-full text-sm font-medium border bg-background text-foreground border-border hover:border-blue-500 transition-colors"
          >
            Custom
          </button>
        </div>
      </div>

      {/* Speaker Selection */}
      <div className="w-full max-w-md mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-medium">Speakers</h2>
          <button
            onClick={() => setIsAddingSpeaker(true)}
            className="flex items-center justify-center p-3 rounded-full bg-blue-500 text-white"
          >
            <Plus size={20} />
          </button>
        </div>

        {isAddingSpeaker ? (
          <div className="flex mb-2">
            <input
              type="text"
              value={newSpeakerName}
              onChange={(e) => setNewSpeakerName(e.target.value)}
              placeholder={`Speaker ${nextSpeakerNumberRef.current}`}
              className="flex-1 p-3 border rounded-l-lg text-base bg-background text-foreground"
              autoFocus
            />
            <button onClick={addSpeaker} className="px-4 bg-green-500 text-white rounded-r-lg">
              Add
            </button>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2 mb-4">
          {speakers.map((speaker) => (
            <div
              key={speaker.id}
              className={`flex items-center p-3 rounded-lg border ${
                speaker.id === activeSpeakerId ? "bg-blue-100 border-blue-500 dark:bg-blue-900" : "bg-card"
              }`}
            >
              {editingSpeakerId === speaker.id ? (
                // Edit mode
                <div className="flex items-center">
                  <input
                    ref={editInputRef}
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={handleEditKeyDown}
                    className="p-1 border rounded w-24 bg-background text-foreground"
                    placeholder={speaker.name}
                  />
                  <button onClick={saveEditedSpeakerName} className="text-green-500 p-1 ml-1" title="Save">
                    <Save size={16} />
                  </button>
                  <button onClick={cancelEditingSpeaker} className="text-red-500 p-1" title="Cancel">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                // View mode
                <>
                  <button onClick={() => setActiveSpeakerId(speaker.id)} className="flex items-center mr-2">
                    <User size={18} className="mr-2" />
                    <span className="text-base">{speaker.name}</span>
                  </button>
                  <div className="flex items-center">
                    <button
                      onClick={() => startEditingSpeaker(speaker.id, speaker.name)}
                      className="text-blue-500 p-1"
                      title="Edit name"
                    >
                      <Edit2 size={16} />
                    </button>
                    {speakers.length > 1 && (
                      <button
                        onClick={() => removeSpeaker(speaker.id)}
                        className="text-red-500 p-1"
                        title="Remove speaker"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Active Speaker Name and Settings */}
      <div className="w-full max-w-md mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">{activeSpeaker.name}</h2>
        <button onClick={() => setIsEditingThresholds(true)} className="p-2 rounded-full bg-muted text-foreground">
          <Settings size={20} />
        </button>
      </div>

      {/* Timer Display */}
      <div
        className={`my-6 flex h-40 w-40 items-center justify-center rounded-full ${getBackgroundColor()} transition-colors`}
      >
        <span className="text-4xl font-bold text-white">{formatTime(activeSpeaker.time)}</span>
      </div>

      {/* Timer Controls */}
      <div className="flex gap-4 mb-4 w-full max-w-md justify-center">
        {!isRunning ? (
          <button
            onClick={startTimer}
            className="w-full rounded-lg bg-green-500 px-4 py-3 text-white font-medium flex items-center justify-center"
          >
            <Play size={20} className="mr-2" /> Start
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="w-full rounded-lg bg-yellow-500 px-4 py-3 text-white font-medium flex items-center justify-center"
          >
            <Pause size={20} className="mr-2" /> Pause
          </button>
        )}

        <button
          onClick={resetTimer}
          className="w-full rounded-lg bg-gray-500 px-4 py-3 text-white font-medium flex items-center justify-center"
        >
          <RotateCcw size={20} className="mr-2" /> Reset
        </button>
      </div>

      <button
        onClick={finishSpeech}
        disabled={activeSpeaker.time === 0}
        className="w-full max-w-md rounded-lg bg-blue-500 px-4 py-3 text-white font-medium mb-6 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Finish & Save
      </button>

      {/* Time Thresholds Display */}
      <div className="grid grid-cols-3 gap-4 text-center w-full max-w-md mb-6 px-4">
        <div className="p-3 border rounded-lg bg-muted">
          <div className="mx-auto h-4 w-4 rounded-full bg-green-500 mb-2"></div>
          <span className="text-sm font-medium">{formatTime(activeSpeaker.thresholds.green)}</span>
        </div>
        <div className="p-3 border rounded-lg bg-muted">
          <div className="mx-auto h-4 w-4 rounded-full bg-yellow-500 mb-2"></div>
          <span className="text-sm font-medium">{formatTime(activeSpeaker.thresholds.yellow)}</span>
        </div>
        <div className="p-3 border rounded-lg bg-muted">
          <div className="mx-auto h-4 w-4 rounded-full bg-red-500 mb-2"></div>
          <span className="text-sm font-medium">{formatTime(activeSpeaker.thresholds.red)}</span>
        </div>
      </div>

      {/* Threshold Settings Modal */}
      {isEditingThresholds && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Time Settings for {activeSpeaker.name}</h3>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Quick Presets</label>
              <div className="flex flex-wrap gap-2">
                {timePresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      setEditingThresholds({
                        green: preset.green,
                        yellow: preset.yellow,
                        red: preset.red,
                      })
                      setSelectedPreset(preset.name)
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      editingThresholds.green === preset.green &&
                      editingThresholds.yellow === preset.yellow &&
                      editingThresholds.red === preset.red
                        ? "bg-blue-500 text-white"
                        : "bg-muted text-foreground hover:bg-blue-400 hover:text-white"
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Green (minutes)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={secondsToMinutes(editingThresholds.green)}
                  onChange={(e) =>
                    setEditingThresholds({
                      ...editingThresholds,
                      green: minutesToSeconds(e.target.value),
                    })
                  }
                  className="w-full p-2 border rounded-lg bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Yellow (minutes)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={secondsToMinutes(editingThresholds.yellow)}
                  onChange={(e) =>
                    setEditingThresholds({
                      ...editingThresholds,
                      yellow: minutesToSeconds(e.target.value),
                    })
                  }
                  className="w-full p-2 border rounded-lg bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Red (minutes)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={secondsToMinutes(editingThresholds.red)}
                  onChange={(e) =>
                    setEditingThresholds({
                      ...editingThresholds,
                      red: minutesToSeconds(e.target.value),
                    })
                  }
                  className="w-full p-2 border rounded-lg bg-background text-foreground"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setIsEditingThresholds(false)} className="flex-1 py-2 border rounded-lg">
                Cancel
              </button>
              <button
                onClick={saveThresholds}
                className="flex-1 py-2 bg-blue-500 text-white rounded-lg flex items-center justify-center"
              >
                <Check size={18} className="mr-2" /> Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Thresholds Modal */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Custom Time Settings</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Green (minutes)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={secondsToMinutes(customThresholds.green)}
                  onChange={(e) =>
                    setCustomThresholds({
                      ...customThresholds,
                      green: minutesToSeconds(e.target.value),
                    })
                  }
                  className="w-full p-2 border rounded-lg bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Yellow (minutes)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={secondsToMinutes(customThresholds.yellow)}
                  onChange={(e) =>
                    setCustomThresholds({
                      ...customThresholds,
                      yellow: minutesToSeconds(e.target.value),
                    })
                  }
                  className="w-full p-2 border rounded-lg bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Red (minutes)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={secondsToMinutes(customThresholds.red)}
                  onChange={(e) =>
                    setCustomThresholds({
                      ...customThresholds,
                      red: minutesToSeconds(e.target.value),
                    })
                  }
                  className="w-full p-2 border rounded-lg bg-background text-foreground"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setIsCustomModalOpen(false)}
                className="flex-1 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (customThresholds.green >= customThresholds.yellow || customThresholds.yellow >= customThresholds.red) {
                    alert("Times must be in order: Green < Yellow < Red")
                    return
                  }
                  setSpeakers(
                    speakers.map((speaker) =>
                      speaker.id === activeSpeakerId ? { ...speaker, thresholds: customThresholds } : speaker,
                    ),
                  )
                  setIsCustomModalOpen(false)
                }}
                className="flex-1 py-2 bg-blue-500 text-white rounded-lg flex items-center justify-center"
              >
                <Check size={18} className="mr-2" /> Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Speech Records */}
      {records.length > 0 && (
        <div className="w-full max-w-md px-4 mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">Recent Speeches</h3>
            <button
              onClick={() => clearAllRecords()}
              className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
            >
              <Trash2 size={14} /> Clear
            </button>
          </div>
          <div className="border rounded-lg divide-y max-h-64 overflow-y-auto">
            {records.map((record) => (
              <div key={record.id} className="p-3 flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium text-sm">{record.speakerName}</div>
                  <div className="text-xs text-muted-foreground">
                    {record.date} • Duration: {formatTime(record.duration)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Green: {formatTime(record.greenThreshold)} | Yellow: {formatTime(record.yellowThreshold)} | Red: {formatTime(record.redThreshold)}
                  </div>
                </div>
                <button
                  onClick={() => record.id && deleteRecord(record.id)}
                  className="text-red-500 hover:text-red-700 p-1 ml-2"
                  title="Delete record"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
