"use client"

import { useState } from "react"
import { useMeetings } from "@/hooks/use-meetings"
import { X, ChevronDown, ChevronUp, Trash2, Download } from "lucide-react"

export default function MeetingRecords() {
  const { meetings, loading, deleteMeeting, getMeetingDetails } = useMeetings()
  const [expandedMeetingId, setExpandedMeetingId] = useState<number | null>(null)
  const [meetingDetails, setMeetingDetails] = useState<any>(null)

  const handleExpandMeeting = async (meetingId: number | undefined) => {
    if (!meetingId) return

    if (expandedMeetingId === meetingId) {
      setExpandedMeetingId(null)
      setMeetingDetails(null)
    } else {
      const details = await getMeetingDetails(meetingId)
      setMeetingDetails(details)
      setExpandedMeetingId(meetingId)
    }
  }

  const exportMeetingData = (meeting: any, details: any) => {
    const data = {
      meeting: {
        name: meeting.name,
        date: meeting.date,
        startTime: meeting.startTime,
      },
      speeches: details?.speeches || [],
      ahCounters: details?.ahCounters || [],
    }

    const dataStr = JSON.stringify(data, null, 2)
    const blob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `meeting-${meeting.name}-${meeting.date}.json`
    link.click()
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading meetings...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24 p-4">
      <h1 className="text-3xl font-bold mb-6">Meeting Records</h1>

      {meetings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No meetings recorded yet.</p>
          <p className="text-sm text-muted-foreground">Start a new meeting to begin tracking speeches and Ah counts.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {meetings.map((meeting) => (
            <div key={meeting.id} className="border rounded-lg bg-card overflow-hidden">
              {/* Meeting Header */}
              <button
                onClick={() => handleExpandMeeting(meeting.id)}
                className="w-full p-4 flex justify-between items-center hover:bg-muted transition-colors"
              >
                <div className="text-left">
                  <h2 className="text-lg font-semibold">{meeting.name}</h2>
                  <p className="text-sm text-muted-foreground">{meeting.date} at {meeting.startTime}</p>
                </div>
                <div className="flex items-center gap-2">
                  {expandedMeetingId === meeting.id ? (
                    <ChevronUp className="text-muted-foreground" />
                  ) : (
                    <ChevronDown className="text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Meeting Details */}
              {expandedMeetingId === meeting.id && meetingDetails && (
                <div className="border-t p-4 bg-muted/30">
                  {/* Speeches Section */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">Speech Records ({meetingDetails.speeches?.length || 0})</h3>
                    {meetingDetails.speeches && meetingDetails.speeches.length > 0 ? (
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {meetingDetails.speeches.map((speech: any, idx: number) => (
                          <div key={idx} className="p-2 bg-background rounded text-sm">
                            <div className="font-medium">{speech.speakerName}</div>
                            <div className="text-xs text-muted-foreground">
                              Duration: {Math.floor(speech.duration / 60)}:{String(speech.duration % 60).padStart(2, "0")}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Thresholds - Green: {Math.floor(speech.greenThreshold / 60)}:{String(speech.greenThreshold % 60).padStart(2, "0")} | Yellow: {Math.floor(speech.yellowThreshold / 60)}:{String(speech.yellowThreshold % 60).padStart(2, "0")} | Red: {Math.floor(speech.redThreshold / 60)}:{String(speech.redThreshold % 60).padStart(2, "0")}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No speeches recorded</p>
                    )}
                  </div>

                  {/* Ah Counter Section */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">Ah Counter Records ({meetingDetails.ahCounters?.length || 0})</h3>
                    {meetingDetails.ahCounters && meetingDetails.ahCounters.length > 0 ? (
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {meetingDetails.ahCounters.map((record: any, idx: number) => (
                          <div key={idx} className="p-2 bg-background rounded text-sm">
                            <div className="font-medium">{record.speakerName}</div>
                            <div className="text-xs text-muted-foreground grid grid-cols-3 gap-2">
                              <span>Ah: {record.ah}</span>
                              <span>Um: {record.um}</span>
                              <span>Er: {record.er}</span>
                              <span>So: {record.so}</span>
                              <span>Like: {record.like}</span>
                              <span>You Know: {record.youKnow}</span>
                            </div>
                            <div className="text-xs font-medium text-muted-foreground mt-1">
                              Total: {record.totalCount}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No Ah counter records</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t">
                    <button
                      onClick={() => exportMeetingData(meeting, meetingDetails)}
                      className="flex-1 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1 hover:bg-blue-600"
                    >
                      <Download size={16} /> Export
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete meeting "${meeting.name}"?`)) {
                          deleteMeeting(meeting.id!)
                          setExpandedMeetingId(null)
                        }
                      }}
                      className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1 hover:bg-red-600"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
