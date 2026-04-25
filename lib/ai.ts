import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

/**
 * Shared instance of the Google Generative AI SDK.
 */
export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/**
 * Standard configuration for model generation to ensure consistency.
 */
export const DEFAULT_GENERATION_CONFIG = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 2048,
};

/**
 * Helper to get a configured generative model with a specific schema.
 */
export function getAIModel(schema: any) {
  return genAI.getGenerativeModel({
    model: 'gemini-1.5-flash-latest',
    generationConfig: {
      ...DEFAULT_GENERATION_CONFIG,
      responseMimeType: 'application/json',
      responseSchema: schema,
    },
  });
}

export { SchemaType };
