import { GoogleGenAI } from '@google/genai';
import { LAB_ASSISTANT_SYSTEM_INSTRUCTION } from '@core/gemini';
import { Result, Ok, Err } from '@core/types';

/**
 * Ask the Lab Assistant a question
 * Returns Result type for better error handling
 */
export async function askLabAssistant(query: string): Promise<Result<string, string>> {
  try {
    if (!query || query.trim().length === 0) {
      return Err('Query cannot be empty');
    }

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY || '';
    if (!apiKey) {
      return Err('Gemini API key not configured');
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction: LAB_ASSISTANT_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const text = response.text?.trim();
    if (!text) {
      return Err('No response received from Lab Assistant');
    }

    return Ok(text);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Error connecting to the lab core';
    console.error('Lab Assistant Error:', error);
    return Err(message);
  }
}

/**
 * Convenience wrapper for components that want a simple string response
 * Falls back to error message if Result is an error
 */
export async function askLabAssistantSimple(query: string): Promise<string> {
  const result = await askLabAssistant(query);
  if (result.ok === true) {
    return result.value;
  }
  return `Error: ${result.error}`;
}
