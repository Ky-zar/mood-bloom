import {genkit, ModelReference} from 'genkit';
import {googleAI, GoogleAIGeminiModel} from '@genkit-ai/googleai';

// This configures a model proxy for OpenRouter, which uses an OpenAI-compatible API.
const openRouterMistral = {
  name: 'openrouter/mistral-7b-instruct', // Using a more specific name
  type: 'generate' as const,
  model: 'mistralai/mistral-7b-instruct',
  apiKey: process.env.OPENROUTER_API_KEY,
  apiHost: 'https://openrouter.ai/api/v1',
};

export const ai = genkit({
  plugins: [
    googleAI({
      // The googleAI plugin can be used for OpenAI-compatible endpoints.
      models: [openRouterMistral],
    }),
  ],
  model: 'googleai/gemini-2.0-flash', // Default model remains Gemini
});

// We export a reference to the configured OpenRouter model.
export const openRouterModel: ModelReference<GoogleAIGeminiModel> = {
  name: openRouterMistral.name,
  config: {},
  plugins: [],
  type: 'generate'
};
