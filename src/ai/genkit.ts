import {genkit, ModelReference} from 'genkit';
import {googleAI, GoogleAIGeminiModel} from '@genkit-ai/googleai';

const openRouterMistral = {
  name: 'openrouter/mistral',
  model: 'mistralai/mistral-7b-instruct',
  apiKey: process.env.OPENROUTER_API_KEY,
  apiHost: 'https://openrouter.ai/api/v1',
} as const;

export const ai = genkit({
  plugins: [
    googleAI({
      models: [
        {
          ...openRouterMistral,
          type: 'generate',
        },
      ],
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});

export const openRouterModel: ModelReference<GoogleAIGeminiModel> = {
  name: openRouterMistral.name,
  config: {},
  plugins: [],
  type: 'generate'
};
