import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import type { RetroCard, AISummaryResult } from '../types';

const getAIClient = () => {
  const apiKey = import.meta.env.PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    console.error("PUBLIC_GEMINI_API_KEY is missing");
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

export const generateRetroSummary = async (cards: RetroCard[]): Promise<AISummaryResult | null> => {
  const genAI = getAIClient();
  if (!genAI) return null;

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          executiveSummary: { type: SchemaType.STRING, description: "A concise 2-3 sentence summary of the retro." },
          sentimentScore: { type: SchemaType.NUMBER, description: "A score from 1 (Negative) to 10 (Positive)." },
          actionItems: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "3 suggested action items based on the feedback."
          }
        },
        required: ["executiveSummary", "sentimentScore", "actionItems"]
      }
    }
  });

  const cardsText = cards.map(c => `- ${c.text} (Votes: ${c.votes})`).join('\n');
  const prompt = `
    Analyze the following retrospective cards and provide a summary.
    Cards:
    ${cardsText}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    if (text) {
      return JSON.parse(text) as AISummaryResult;
    }
    return null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const groupCardsSemantically = async (cards: RetroCard[]): Promise<{ [key: string]: string[] } | null> => {
  const genAI = getAIClient();
  if (!genAI) return null;

  if (cards.length < 3) return null;

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          groups: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                groupName: { type: SchemaType.STRING },
                cardIds: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
              }
            }
          }
        }
      }
    }
  });

  const cardsInput = cards.map(c => JSON.stringify({ id: c.id, text: c.text })).join('\n');

  const prompt = `
    Group these retro cards into semantic themes. 
    Return a map where the key is the card ID and the value is a Group Name.
    If a card doesn't fit a strong group, use "Misc".
    
    Cards:
    ${cardsInput}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const parsedResult = JSON.parse(text || '{}');
    const mapping: { [key: string]: string[] } = {};

    if (parsedResult.groups) {
      parsedResult.groups.forEach((g: any) => {
        mapping[g.groupName] = g.cardIds;
      });
      return mapping;
    }

    return null;

  } catch (error) {
    console.error("Gemini Grouping Error", error);
    return null;
  }
};

export const generateDiscussionQuestions = async (cards: RetroCard[]): Promise<string[] | null> => {
  const genAI = getAIClient();
  if (!genAI) return null;

  if (cards.length < 3) return null;

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          questions: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "3-5 open-ended discussion questions."
          }
        }
      }
    }
  });

  const cardsText = cards.map(c => `- ${c.text} (Votes: ${c.votes})`).join('\n');
  const prompt = `
    You are an expert Agile Coach. Analyze these retrospective cards and generate 3-5 deep, open-ended discussion questions.
    Focus on:
    1. Identifying underlying patterns or conflicts.
    2. Encouraging the team to find root causes.
    3. Moving from complaints to constructive action.
    
    Avoid generic questions like "What went well?". Be specific to the content.

    Cards:
    ${cardsText}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    if (text) {
      const parsed = JSON.parse(text);
      return parsed.questions || [];
    }
    return null;
  } catch (error) {
    console.error("Gemini Questions Error:", error);
    throw error;
  }
};
