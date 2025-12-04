import { GoogleGenAI, Type } from "@google/genai";
import type { RetroCard, AISummaryResult } from '../types';

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateRetroSummary = async (cards: RetroCard[]): Promise<AISummaryResult | null> => {
  const ai = getAIClient();
  if (!ai) return null;

  const cardsText = cards.map(c => `- ${c.text} (Votes: ${c.votes})`).join('\n');
  const prompt = `
    Analyze the following retrospective cards and provide a summary.
    Cards:
    ${cardsText}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveSummary: { type: Type.STRING, description: "A concise 2-3 sentence summary of the retro." },
            sentimentScore: { type: Type.NUMBER, description: "A score from 1 (Negative) to 10 (Positive)." },
            actionItems: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 suggested action items based on the feedback."
            }
          },
          required: ["executiveSummary", "sentimentScore", "actionItems"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AISummaryResult;
    }
    return null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const groupCardsSemantically = async (cards: RetroCard[]): Promise<{ [key: string]: string[] } | null> => {
  const ai = getAIClient();
  if (!ai) return null;

  if (cards.length < 3) return null;

  const cardsInput = cards.map(c => JSON.stringify({ id: c.id, text: c.text })).join('\n');

  const prompt = `
    Group these retro cards into semantic themes. 
    Return a map where the key is the card ID and the value is a Group Name.
    If a card doesn't fit a strong group, use "Misc".
    
    Cards:
    ${cardsInput}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            groups: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  groupName: { type: Type.STRING },
                  cardIds: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            }
          }
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    const mapping: { [key: string]: string[] } = {};

    // Transform to simpler structure for the UI to consume if needed, 
    // or just return the raw grouping. 
    // For this app, let's return { groupName: [cardId, cardId] }
    if (result.groups) {
      result.groups.forEach((g: any) => {
        mapping[g.groupName] = g.cardIds;
      });
      return mapping;
    }

    return null;

  } catch (error) {
    console.error("Gemini Grouping Error", error);
    return null;
  }
}
