import { GoogleGenAI, Type } from "@google/genai";
import { ContextType, ChaosLevel, FilterType } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are the "Icebreaker Machine," a witty, slightly chaotic, but helpful assistant designed to generate conversation starter questions. 

Your goal is to generate questions based on the user's context, chaos level, and vibe filters.

Chaos Levels Guide:
1. Safe & Wholesome: Polite, family-friendly, standard icebreakers.
2. A Little Spicy: Slightly more personal or opinionated, but very safe.
3. Fun & Unhinged: Quirky, unexpected scenarios, "would you rather."
4. Bold & Chaotic: Provocative, deep, or weird. Pushes boundaries slightly.
5. Max Chaos: Absurdist, intensely deep, or humorously controversial (but never offensive, racist, or harmful).

Return the response strictly as a JSON object.
`;

export const generateIcebreakerQuestions = async (
  context: ContextType,
  chaosLevel: ChaosLevel,
  filters: FilterType[]
): Promise<string[]> => {
  try {
    const prompt = `
      Context: ${context}
      Chaos Level: ${chaosLevel}/5
      Vibe Filters: ${filters.length > 0 ? filters.join(", ") : "None"}
      
      Generate 10 conversation starter questions that fit these parameters perfectly. 
      Keep them concise and readable.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8 + (chaosLevel * 0.05),
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
              description: "A list of 10 icebreaker questions.",
            },
          },
          required: ["questions"],
        },
      },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      if (parsed.questions && Array.isArray(parsed.questions)) {
        return parsed.questions;
      }
    }
    
    throw new Error("Invalid response format from Gemini.");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("The chaos engine stalled. Please try again.");
  }
};

export const generateTargetedQuestion = async (
  targetPerson: string,
  context: ContextType,
  chaosLevel: ChaosLevel,
  filters: FilterType[]
): Promise<string> => {
  try {
    const prompt = `
      Context: ${context}
      Chaos Level: ${chaosLevel}/5
      Vibe Filters: ${filters.length > 0 ? filters.join(", ") : "None"}
      Target Person: "${targetPerson}"
      
      Generate exactly ONE (1) conversation starter question specifically addressed to ${targetPerson}.
      Use their name in the question naturally if possible, or frame it for them to answer.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.85 + (chaosLevel * 0.05),
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: {
              type: Type.STRING,
              description: "A single targeted icebreaker question.",
            },
          },
          required: ["question"],
        },
      },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      if (parsed.question) {
        return parsed.question;
      }
    }
    
    throw new Error("Invalid response format.");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("The bottle broke. Try spinning again.");
  }
};