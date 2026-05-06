import { useState, useEffect } from 'react';
import { db, type SpeechRecord } from '@/lib/db';

export function useSpeechRecords() {
  const [records, setRecords] = useState<SpeechRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadRecords = async () => {
    setIsLoading(true);
    const allRecords = await db.speeches.orderBy('timestamp').reverse().toArray();
    setRecords(allRecords);
    setIsLoading(false);
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const saveSpeech = async (
    speakerName: string,
    duration: number,
    greenThreshold: number,
    yellowThreshold: number,
    redThreshold: number
  ) => {
    const now = new Date();
    const record: SpeechRecord = {
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
