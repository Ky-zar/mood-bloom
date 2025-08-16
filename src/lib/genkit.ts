import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const qwen = googleAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  models: [{name: 'qwen/qwen3-4b:free'}],
});

export const ai = genkit({
  plugins: [qwen],
});
