import { GoogleGenAI } from '@google/genai';

const SYSTEM_INSTRUCTION = `
You are the sspirial.systems Lab Assistant.
Your purpose is to help visitors understand the studio's R&D work.
The studio focuses on:
1. Autonomous Agents (distributed AI systems).
2. Future Web Architecture (WebGPU, WASM, Rust).
3. System Observability and Data Visualization.
4. Generative Art and Creative Coding.

Our current active projects are Fintech Core, Hyper-Index, Neural-Synth, and Void-Walker.
We operate as an independent micro-studio to maintain agility.

Respond in a professional, slightly futuristic, and concise manner. 
Use technical terminology where appropriate but remain accessible.
Always mention that the "Systems are Operational" if asked about status.
`;

export async function askLabAssistant(query: string) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
    return response.text || "I'm sorry, I couldn't process that signal. Please try again.";
  } catch (error) {
    console.error('Lab Assistant Error:', error);
    return 'Error connecting to the lab core. Please check your network bridge.';
  }
}
