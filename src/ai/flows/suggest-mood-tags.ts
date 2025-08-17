
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
  const prompt = `You are a caring and insightful journaling assistant. Your goal is to help users understand their feelings by suggesting relevant and specific tags for their mood log entries.

Analyze the following mood entry and suggest 2 to 5 tags that capture the key themes, activities, people, or feelings mentioned. The tags should be concise, using one or two words. Replace any underscores with spaces. Avoid generic tags like "thoughts" or "feelings".

For example, if the entry is "Felt overwhelmed with the project deadline at work, but a quick call with my best friend really lifted my spirits.", you might suggest tags like "work stress", "project deadline", "friend support", and "feeling overwhelmed".

Mood entry: "${input.moodEntry}"

Your response must be a JSON object with a key "tags" containing an array of strings. For example: {"tags": ["work stress", "friend support"]}.`;

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

    // Replace underscores with spaces in tags
    if (parsedContent.tags && Array.isArray(parsedContent.tags)) {
        parsedContent.tags = parsedContent.tags.map((tag: string) => tag.replace(/_/g, ' '));
    }

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
