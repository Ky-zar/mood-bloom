import {genkit, ModelReference} from 'genkit';
import {googleAI, GoogleAIGeminiModel} from '@genkit-ai/googleai';

// This configures a model proxy for OpenRouter, which uses an OpenAI-compatible API.
const openRouterQwen = {
  name: 'openrouter/qwen-qwen3-4b-free',
  type: 'generate' as const,
  model: 'qwen/qwen3-4b:free',
  apiKey: process.env.OPENROUTER_API_KEY,
  apiHost: 'https://openrouter.ai/api/v1',
};

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: 'none',
      models: [openRouterQwen],
    }),
  ],
});

// We export a reference to the configured OpenRouter model.
export const openRouterModel: ModelReference<GoogleAIGeminiModel> = {
  name: openRouterQwen.name,
  config: {},
  plugins: [],
  type: 'generate'
};
