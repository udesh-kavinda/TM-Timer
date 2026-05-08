import Dexie, { type Table } from 'dexie';

export interface Meeting {
  id?: number;
  name: string;
  date: string;
  startTime: string;
  endTime?: string;
  createdAt: number;
}

export interface SpeechRecord {
  id?: number;
  meetingId: number;
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
  meetingId: number;
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
  meetings!: Table<Meeting>;
  speeches!: Table<SpeechRecord>;
  ahCounters!: Table<AhCounterRecord>;

  constructor() {
    super('ToastmasterDB');
    this.version(2).stores({
      meetings: '++id, createdAt',
      speeches: '++id, meetingId, timestamp, date',
      ahCounters: '++id, meetingId, timestamp, date',
    });
  }
}

export const db = new ToastmasterDB();
