"use client"

import { useState, useEffect } from "react"
import { db, type Meeting } from "@/lib/db"

export function useMeetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)

  // Load all meetings on mount
  useEffect(() => {
    loadMeetings()
  }, [])

  const loadMeetings = async () => {
    try {
      setLoading(true)
      const allMeetings = await db.meetings.orderBy("createdAt").reverse().toArray()
      setMeetings(allMeetings)
    } catch (error) {
      console.error("[v0] Error loading meetings:", error)
    } finally {
      setLoading(false)
    }
  }

  const createMeeting = async (name: string) => {
    try {
      const now = new Date()
      const dateStr = now.toLocaleDateString()
      const timeStr = now.toLocaleTimeString()

      const id = await db.meetings.add({
        name,
        date: dateStr,
        startTime: timeStr,
        createdAt: Date.now(),
      })

      await loadMeetings()
      return id
    } catch (error) {
      console.error("[v0] Error creating meeting:", error)
      return null
    }
  }

  const deleteMeeting = async (meetingId: number) => {
    try {
      // Delete all associated records
      await db.speeches.where("meetingId").equals(meetingId).delete()
      await db.ahCounters.where("meetingId").equals(meetingId).delete()
      
      // Delete the meeting
      await db.meetings.delete(meetingId)
      
      await loadMeetings()
    } catch (error) {
      console.error("[v0] Error deleting meeting:", error)
    }
  }

  const getMeetingDetails = async (meetingId: number) => {
    try {
      const meeting = await db.meetings.get(meetingId)
      const speeches = await db.speeches.where("meetingId").equals(meetingId).toArray()
      const ahCounters = await db.ahCounters.where("meetingId").equals(meetingId).toArray()

      return {
        meeting,
        speeches,
        ahCounters,
      }
    } catch (error) {
      console.error("[v0] Error getting meeting details:", error)
      return null
    }
  }

  return {
    meetings,
    loading,
    createMeeting,
    deleteMeeting,
    getMeetingDetails,
    loadMeetings,
  }
}
