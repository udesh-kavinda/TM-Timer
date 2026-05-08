"use client"

import { useState } from "react"
import { useMeetings } from "@/hooks/use-meetings"
import { Plus, X } from "lucide-react"

interface MeetingSelectorProps {
  onMeetingSelected: (meetingId: number) => void
}

export function MeetingSelector({ onMeetingSelected }: MeetingSelectorProps) {
  const { meetings, createMeeting } = useMeetings()
  const [isCreating, setIsCreating] = useState(false)
  const [newMeetingName, setNewMeetingName] = useState("")
  const [selectedMeetingId, setSelectedMeetingId] = useState<number | null>(null)

  const handleCreateMeeting = async () => {
    if (!newMeetingName.trim()) return

    const id = await createMeeting(newMeetingName)
    if (id) {
      setSelectedMeetingId(id)
      onMeetingSelected(id)
      setNewMeetingName("")
      setIsCreating(false)
    }
  }

  return (
    <div className="w-full max-w-md mb-6 px-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Current Meeting</h2>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
        >
          <Plus size={18} />
        </button>
      </div>

      {isCreating ? (
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newMeetingName}
            onChange={(e) => setNewMeetingName(e.target.value)}
            placeholder="Meeting name"
            className="flex-1 px-3 py-2 border rounded-lg bg-background text-foreground"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreateMeeting()
            }}
          />
          <button
            onClick={handleCreateMeeting}
            className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600"
          >
            Create
          </button>
          <button
            onClick={() => setIsCreating(false)}
            className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {meetings.slice(0, 5).map((meeting) => (
          <button
            key={meeting.id}
            onClick={() => {
              setSelectedMeetingId(meeting.id!)
              onMeetingSelected(meeting.id!)
            }}
            className={`px-3 py-2 rounded-full text-sm font-medium border transition-colors ${
              selectedMeetingId === meeting.id
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-background text-foreground border-border hover:border-blue-500"
            }`}
          >
            {meeting.name}
          </button>
        ))}
      </div>
    </div>
  )
}
