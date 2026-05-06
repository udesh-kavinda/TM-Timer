import { useState, useEffect } from 'react';
import { db, type AhCounterRecord } from '@/lib/db';

export function useAhCounterRecords() {
  const [records, setRecords] = useState<AhCounterRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadRecords = async () => {
    setIsLoading(true);
    const allRecords = await db.ahCounters.orderBy('timestamp').reverse().toArray();
    setRecords(allRecords);
    setIsLoading(false);
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const saveAhCounterSession = async (
    speakerName: string,
    ah: number,
    um: number,
    er: number,
    so: number,
    like: number,
    youKnow: number
  ) => {
    const now = new Date();
    const totalCount = ah + um + er + so + like + youKnow;
    const record: AhCounterRecord = {
      speakerName,
      ah,
      um,
      er,
      so,
      like,
      youKnow,
      totalCount,
      timestamp: now.getTime(),
      date: now.toLocaleDateString(),
    };

    await db.ahCounters.add(record);
    await loadRecords();
  };

  const deleteRecord = async (id: number) => {
    await db.ahCounters.delete(id);
    await loadRecords();
  };

  const clearAllRecords = async () => {
    await db.ahCounters.clear();
    setRecords([]);
  };

  return {
    records,
    isLoading,
    saveAhCounterSession,
    deleteRecord,
    clearAllRecords,
  };
}
