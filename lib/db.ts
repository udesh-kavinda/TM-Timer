import Dexie, { type Table } from 'dexie';

export interface SpeechRecord {
  id?: number;
  speakerName: string;
  duration: number; // in seconds
  greenThreshold: number;
  yellowThreshold: number;
  redThreshold: number;
  timestamp: number; // when the speech was completed
  date: string; // formatted date
}

export interface AhCounterRecord {
  id?: number;
  speakerName: string;
  ah: number;
  um: number;
  er: number;
  so: number;
  like: number;
  youKnow: number;
  totalCount: number;
  timestamp: number;
  date: string;
}

export class ToastmasterDB extends Dexie {
  speeches!: Table<SpeechRecord>;
  ahCounters!: Table<AhCounterRecord>;

  constructor() {
    super('ToastmasterDB');
    this.version(1).stores({
      speeches: '++id, timestamp, date',
      ahCounters: '++id, timestamp, date',
    });
  }
}

export const db = new ToastmasterDB();
