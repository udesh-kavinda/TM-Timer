"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Plus, X, User, RotateCcw, Edit2, Save } from "lucide-react"

type FillerWord = {
  id: string
  name: string
}

type Speaker = {
  id: string
  name: string
  counts: Record<string, number>
}

type Action = {
  type: "increment"
  speakerId: string
  wordId: string
}

const FILLER_WORDS: FillerWord[] = [
  { id: "ah", name: "Ah" },
  { id: "um", name: "Um" },
  { id: "er", name: "Er" },
  { id: "so", name: "So" },
  { id: "like", name: "Like" },
  { id: "you-know", name: "You Know" },
]

export default function AhCounter() {
  const [speakers, setSpeakers] = useState<Speaker[]>([
    {
      id: "speaker1",
      name: "Speaker 1",
      counts: FILLER_WORDS.reduce((acc, word) => ({ ...acc, [word.id]: 0 }), {}),
    },
  ])
  const [activeSpeakerId, setActiveSpeakerId] = useState<string>("speaker1")
  const [newSpeakerName, setNewSpeakerName] = useState<string>("")
  const [isAddingSpeaker, setIsAddingSpeaker] = useState<boolean>(false)
  const [editingSpeakerId, setEditingSpeakerId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState<string>("")
  const [actionHistory, setActionHistory] = useState<Action[]>([])

  // Ref to keep track of the next speaker number
  const nextSpeakerNumberRef = useRef(2) // Start at 2 since we already have Speaker 1
  const editInputRef = useRef<HTMLInputElement>(null)

  const activeSpeaker = speakers.find((s) => s.id === activeSpeakerId) || speakers[0]

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

  // Focus the edit input when entering edit mode
  useEffect(() => {
    if (editingSpeakerId && editInputRef.current) {
      editInputRef.current.focus()
    }
  }, [editingSpeakerId])

  const incrementCount = (wordId: string) => {
    // Record this action in history
    setActionHistory([
      ...actionHistory,
      {
        type: "increment",
        speakerId: activeSpeakerId,
        wordId,
      },
    ])

    // Update the count
    setSpeakers(
      speakers.map((speaker) =>
        speaker.id === activeSpeakerId
          ? {
              ...speaker,
              counts: {
                ...speaker.counts,
                [wordId]: (speaker.counts[wordId] || 0) + 1,
              },
            }
          : speaker,
      ),
    )
  }

  const undoLastAction = () => {
    if (actionHistory.length === 0) return

    // Get the last action
    const lastAction = actionHistory[actionHistory.length - 1]

    // Remove the last action from history
    setActionHistory(actionHistory.slice(0, -1))

    // Undo the action
    if (lastAction.type === "increment") {
      setSpeakers(
        speakers.map((speaker) =>
          speaker.id === lastAction.speakerId
            ? {
                ...speaker,
                counts: {
                  ...speaker.counts,
                  [lastAction.wordId]: Math.max(0, (speaker.counts[lastAction.wordId] || 0) - 1),
                },
              }
            : speaker,
        ),
      )
    }
  }

  const resetSpeakerCounts = (speakerId: string) => {
    // Clear history for this speaker
    setActionHistory(actionHistory.filter((action) => action.speakerId !== speakerId))

    setSpeakers(
      speakers.map((speaker) =>
        speaker.id === speakerId
          ? {
              ...speaker,
              counts: FILLER_WORDS.reduce((acc, word) => ({ ...acc, [word.id]: 0 }), {}),
            }
          : speaker,
      ),
    )
  }

  const resetAllCounts = () => {
    // Clear all history
    setActionHistory([])

    setSpeakers(
      speakers.map((speaker) => ({
        ...speaker,
        counts: FILLER_WORDS.reduce((acc, word) => ({ ...acc, [word.id]: 0 }), {}),
      })),
    )
  }

  const addSpeaker = () => {
    if (newSpeakerName.trim()) {
      const newSpeaker: Speaker = {
        id: `speaker${Date.now()}`,
        name: newSpeakerName.trim(),
        counts: FILLER_WORDS.reduce((acc, word) => ({ ...acc, [word.id]: 0 }), {}),
      }
      setSpeakers([...speakers, newSpeaker])
      setActiveSpeakerId(newSpeaker.id)
      setNewSpeakerName("")
      setIsAddingSpeaker(false)
    } else {
      // Generate a name if none provided
      const speakerName = `Speaker ${nextSpeakerNumberRef.current}`

      const newSpeaker: Speaker = {
        id: `speaker${Date.now()}`,
        name: speakerName,
        counts: FILLER_WORDS.reduce((acc, word) => ({ ...acc, [word.id]: 0 }), {}),
      }

      setSpeakers([...speakers, newSpeaker])
      setActiveSpeakerId(newSpeaker.id)
      setNewSpeakerName("")
      setIsAddingSpeaker(false)

      // Increment the next speaker number
      nextSpeakerNumberRef.current++
    }
  }

  const removeSpeaker = (speakerId: string) => {
    // Cancel editing if we're removing the speaker being edited
    if (editingSpeakerId === speakerId) {
      setEditingSpeakerId(null)
    }

    // Remove history for this speaker
    setActionHistory(actionHistory.filter((action) => action.speakerId !== speakerId))

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

  const getTotalCount = (speakerId: string) => {
    const speaker = speakers.find((s) => s.id === speakerId)
    if (!speaker) return 0

    return Object.values(speaker.counts).reduce((sum, count) => sum + count, 0)
  }

  // Get the last recorded word (for undo button tooltip)
  const getLastRecordedWord = () => {
    if (actionHistory.length === 0) return null

    const lastAction = actionHistory[actionHistory.length - 1]
    if (lastAction.type !== "increment") return null

    const wordName = FILLER_WORDS.find((w) => w.id === lastAction.wordId)?.name
    const speakerName = speakers.find((s) => s.id === lastAction.speakerId)?.name

    return { wordName, speakerName }
  }

  const lastRecorded = getLastRecordedWord()
  const undoTooltip = lastRecorded
    ? `Undo "${lastRecorded.wordName}" for ${lastRecorded.speakerName}`
    : "Nothing to undo"

  return (
    <div className="flex min-h-screen flex-col items-center p-4 pb-20">
      <h1 className="text-2xl font-bold mb-4">Ah Counter</h1>

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
                    <span className="ml-2 px-2 py-0.5 bg-muted rounded-full text-xs">{getTotalCount(speaker.id)}</span>
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

      {/* Active Speaker Name and Undo Button */}
      <div className="w-full max-w-md mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">{activeSpeaker.name}</h2>
        <button
          onClick={undoLastAction}
          disabled={actionHistory.length === 0}
          className="p-2 rounded-full bg-muted text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          title={undoTooltip}
        >
          <RotateCcw size={20} />
        </button>
      </div>

      {/* Filler Word Counters */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-6">
        {FILLER_WORDS.map((word) => (
          <button
            key={word.id}
            onClick={() => incrementCount(word.id)}
            className="flex flex-col items-center justify-center p-4 border rounded-lg bg-card shadow-sm hover:bg-muted"
          >
            <span className="text-xl font-bold mb-1">{activeSpeaker.counts[word.id] || 0}</span>
            <span className="text-muted-foreground">{word.name}</span>
          </button>
        ))}
      </div>

      {/* Reset Buttons */}
      <div className="flex gap-4 w-full max-w-md">
        <button
          onClick={() => resetSpeakerCounts(activeSpeakerId)}
          className="flex-1 rounded-lg bg-yellow-500 px-4 py-3 text-white font-medium"
        >
          Reset {activeSpeaker.name}
        </button>
        <button onClick={resetAllCounts} className="flex-1 rounded-lg bg-red-500 px-4 py-3 text-white font-medium">
          Reset All
        </button>
      </div>

      {/* Last Action Indicator */}
      {lastRecorded && (
        <div className="mt-6 text-sm text-muted-foreground">
          Last recorded: "{lastRecorded.wordName}" for {lastRecorded.speakerName}
        </div>
      )}
    </div>
  )
}

