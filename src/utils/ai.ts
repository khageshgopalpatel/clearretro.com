
import type { RetroColumn } from "../types";

export interface LanguageModelSession {
  prompt: (input: string) => Promise<string>;
  destroy: () => void;
}

// Possible statuses based on Chrome specs
export type AIAvailability = 'readily' | 'after-download' | 'downloadable' | 'downloading' | 'no' | 'unknown';

/**
 * Checks if Chromium's built-in AI (Prompt API) is available.
 */
export const checkChromiumAIAvailability = async (): Promise<AIAvailability> => {
  const anyWindow = window as any;
  
  if (!window.isSecureContext) return 'no';

  const ai = anyWindow.ai;
  let namespaceName = "none";
  let assistantNamespace = null;

  if (ai?.languageModel) { namespaceName = "ai.languageModel"; assistantNamespace = ai.languageModel; }
  else if (ai?.assistant) { namespaceName = "ai.assistant"; assistantNamespace = ai.assistant; }
  else if (anyWindow.assistant) { namespaceName = "window.assistant"; assistantNamespace = anyWindow.assistant; }
  else if (anyWindow.LanguageModel) { namespaceName = "window.LanguageModel"; assistantNamespace = anyWindow.LanguageModel; }

  if (!assistantNamespace) return 'no';

  try {
    if (assistantNamespace.capabilities) {
      const caps = await assistantNamespace.capabilities();
      return caps.available;
    }
    
    if (assistantNamespace.availability) {
      const availability = await assistantNamespace.availability();
      
      if (availability === 'available' || availability === 'readily') return 'readily';
      if (availability === 'downloading') return 'downloading';
      
      if (availability === 'after-download' || availability === 'downloadable') {
        // FORCE TRIGGER: Attempting to create a session often kicks off the download
        try {
          assistantNamespace.create({
            systemPrompt: "Trigger download"
          }).catch(() => {}); // We expect this to fail initially
        } catch (e) {
          // Silent catch
        }
        return 'downloadable';
      }
      return 'no';
    }
    
    return 'unknown';
  } catch (error) {
    return 'no';
  }
};

/**
 * Classifies a user's thought into one of the provided retro columns.
 */
export const classifyThought = async (
  text: string,
  columns: RetroColumn[]
): Promise<string | null> => {
  const anyWindow = window as any;
  const ai = anyWindow.ai;
  const assistantNamespace = ai?.languageModel || ai?.assistant || anyWindow.assistant || anyWindow.LanguageModel;

  if (!assistantNamespace) {
    console.error("AI classifyCalled but namespace is missing.");
    return null;
  }

  try {
    const session = await assistantNamespace.create({
      expectedInputLanguages: ['en'],
      expectedOutputLanguages: ['en'],
      systemPrompt: `You are a strict data classification engine. You categorize text into these specific buckets: ${columns.map(c => `"${c.title}" (ID: ${c.id})`).join(', ')}.`,
    });

    const prompt = `
Task: Classify the user thought into exactly one valid ID.

Allowed IDs:
${columns.map(c => `- ${c.id} (for ${c.title} thoughts)`).join('\n')}

Examples:
Thought: "Great work on the delivery" -> ID: ${columns.find(c => c.title.toLowerCase().includes('well') || c.id.toLowerCase().includes('continue'))?.id || columns[0].id}
Thought: "Meetings are too long" -> ID: ${columns.find(c => c.title.toLowerCase().includes('stop') || c.title.toLowerCase().includes('improve'))?.id || columns[0].id}

Now classify this:
Thought: "${text}"
ID:`;

    const rawResponse = await session.prompt(prompt);
    session.destroy();

    const responseText = rawResponse.toLowerCase();
    
    // 1. Try exact match first
    const exactMatch = columns.find(c => responseText.includes(c.id.toLowerCase()));
    if (exactMatch) return exactMatch.id;

    // 2. Try matching title if ID fails
    const titleMatch = columns.find(c => responseText.includes(c.title.toLowerCase()));
    if (titleMatch) return titleMatch.id;

    // 3. Last resort fallback
    return columns[0]?.id || null;
  } catch (error) {
    console.error("AI classification failed:", error);
    return columns[0]?.id || null; // Return first column as fallback during error
  }
};
