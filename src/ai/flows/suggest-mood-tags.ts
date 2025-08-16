'use server';

/**
 * @fileOverview A mood tag suggestion AI agent.
 *
 * - suggestMoodTags - A function that suggests relevant tags for mood entries.
 */

import {ai} from '@/lib/genkit';
import {z} from 'genkit';
import {SuggestMoodTagsOutputSchema, SuggestMoodTagsInputSchema, type SuggestMoodTagsOutput} from '@/types';


export async function suggestMoodTags(input: z.infer<typeof SuggestMoodTagsInputSchema>): Promise<SuggestMoodTagsOutput> {
  return suggestMoodTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMoodTagsPrompt',
  input: {schema: SuggestMoodTagsInputSchema},
  output: {schema: SuggestMoodTagsOutputSchema},
  prompt: `You are a helpful assistant that suggests relevant tags for mood entries.

  Given the following mood entry, suggest a few relevant tags (between 2 and 5) that the user can use to categorize their mood. The tags should be single words or short two-word phrases.

  Mood entry: {{{moodEntry}}}

  Your response should be a JSON array of strings.
  `,
  model: 'googleai/qwen/qwen3-4b:free',
});

const suggestMoodTagsFlow = ai.defineFlow(
  {
    name: 'suggestMoodTagsFlow',
    inputSchema: SuggestMoodTagsInputSchema,
    outputSchema: SuggestMoodTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
