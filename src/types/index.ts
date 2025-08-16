import { z } from 'zod';

export type Mood = 'radiant' | 'good' | 'meh' | 'bad' | 'awful';

export const moodOptions: Mood[] = ['radiant', 'good', 'meh', 'bad', 'awful'];

export interface MoodEntry {
  id: string;
  mood: Mood;
  notes?: string;
  tags: string[];
  date: string; // ISO string
}


export const SuggestMoodTagsInputSchema = z.object({
  moodEntry: z.string().describe('The text content of the mood entry.'),
});
export type SuggestMoodTagsInput = z.infer<typeof SuggestMoodTagsInputSchema>;

export const SuggestMoodTagsOutputSchema = z.object({
  tags: z.array(z.string()).describe('An array of suggested tags for the mood entry.'),
});
export type SuggestMoodTagsOutput = z.infer<typeof SuggestMoodTagsOutputSchema>;
