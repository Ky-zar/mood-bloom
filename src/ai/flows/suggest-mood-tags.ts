'use server';

/**
 * @fileOverview A mood tag suggestion AI agent.
 *
 * - suggestMoodTags - A function that suggests relevant tags for mood entries.
 * - SuggestMoodTagsInput - The input type for the suggestMoodTags function.
 * - SuggestMoodTagsOutput - The return type for the suggestMoodTags function.
 */

import {ai, openRouterModel} from '@/lib/genkit';
import {z} from 'genkit';

const SuggestMoodTagsInputSchema = z.object({
  moodEntry: z.string().describe('The text content of the mood entry.'),
});
type SuggestMoodTagsInput = z.infer<typeof SuggestMoodTagsInputSchema>;

const SuggestMoodTagsOutputSchema = z.object({
  tags: z.array(z.string()).describe('An array of suggested tags for the mood entry.'),
});
export type SuggestMoodTagsOutput = z.infer<typeof SuggestMoodTagsOutputSchema>;

export async function suggestMoodTags(input: SuggestMoodTagsInput): Promise<SuggestMoodTagsOutput> {
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
  model: openRouterModel,
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
