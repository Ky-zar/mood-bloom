'use server';

/**
 * @fileOverview A mood tag suggestion AI agent.
 *
 * - suggestMoodTags - A function that suggests relevant tags for mood entries.
 */

import {z} from 'genkit';
import type {SuggestMoodTagsInput, SuggestMoodTagsOutput} from '@/types';
import {SuggestMoodTagsOutputSchema} from '@/types';
import fetch from 'node-fetch';

export async function suggestMoodTags(
  input: SuggestMoodTagsInput
): Promise<SuggestMoodTagsOutput> {
  const prompt = `You are a helpful assistant that suggests relevant tags for mood entries.

  Given the following mood entry, suggest a few relevant tags (between 2 and 5) that the user can use to categorize their mood. The tags should be single words or short two-word phrases.

  Mood entry: ${input.moodEntry}

  Your response should be a JSON object with a key "tags" containing an array of strings. For example: {"tags": ["work", "stressful"]}.`;

  try {
    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'qwen/qwen3-4b:free',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          response_format: {type: 'json_object'},
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `API request failed with status ${response.status}: ${errorBody}`
      );
    }

    const result = (await response.json()) as any;
    const content = result.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content in API response');
    }

    const parsedContent = JSON.parse(content);

    // Validate the parsed content against the Zod schema
    const validatedOutput = SuggestMoodTagsOutputSchema.parse(parsedContent);

    return validatedOutput;
  } catch (error) {
    console.error('Error fetching from OpenRouter:', error);
    // In case of an error, return an empty array of tags
    // or handle the error as appropriate for your application.
    return {tags: []};
  }
}
