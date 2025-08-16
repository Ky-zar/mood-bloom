export type Mood = 'radiant' | 'good' | 'meh' | 'bad' | 'awful';

export const moodOptions: Mood[] = ['radiant', 'good', 'meh', 'bad', 'awful'];

export interface MoodEntry {
  id: string;
  mood: Mood;
  notes?: string;
  tags: string[];
  date: string; // ISO string
}
