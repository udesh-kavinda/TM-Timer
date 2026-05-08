import { useState, useEffect } from 'react';
import { db, type SpeechRecord } from '@/lib/db';

export function useSpeechRecords(meetingId?: number) {
  const [records, setRecords] = useState<SpeechRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadRecords = async () => {
    setIsLoading(true);
    let query = db.speeches.orderBy('timestamp').reverse();
    
    if (meetingId) {
      const allRecords = await db.speeches.where('meetingId').equals(meetingId).toArray();
      setRecords(allRecords.sort((a, b) => b.timestamp - a.timestamp));
    } else {
      const allRecords = await query.toArray();
      setRecords(allRecords);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadRecords();
  }, [meetingId]);

  const saveSpeech = async (
    speakerName: string,
    duration: number,
    greenThreshold: number,
    yellowThreshold: number,
    redThreshold: number,
    meetingId?: number
  ) => {
    const now = new Date();
    const record: SpeechRecord = {
      ...(meetingId && { meetingId }),
      speakerName,
      duration,
      greenThreshold,
      yellowThreshold,
      redThreshold,
      timestamp: now.getTime(),
      date: now.toLocaleDateString(),
    };

    await db.speeches.add(record);
    await loadRecords();
  };

  const deleteRecord = async (id: number) => {
    await db.speeches.delete(id);
    await loadRecords();
  };

  const clearAllRecords = async () => {
    await db.speeches.clear();
    setRecords([]);
  };

  return {
    records,
    isLoading,
    saveSpeech,
    deleteRecord,
    clearAllRecords,
  };
}
