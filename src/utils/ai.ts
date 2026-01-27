import type { RetroColumn } from "../types";
import { auth } from "../lib/firebase";

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

export interface ClassificationResult {
  columnId: string | null;
  source: 'local' | 'cloud' | 'none';
}

/**
 * Classifies a user's thought into one of the provided retro columns.
 * Tries Chromium's built-in AI first, then falls back to Cloud Gemini via Firebase Functions.
 */
export const classifyThought = async (
  text: string,
  columns: RetroColumn[]
): Promise<ClassificationResult> => {
  const anyWindow = window as any;
  const ai = anyWindow.ai;
  const assistantNamespace = ai?.languageModel || ai?.assistant || anyWindow.assistant || anyWindow.LanguageModel;

  // 1. Try Built-in Chrome AI first
  if (assistantNamespace) {
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
      if (exactMatch) return { columnId: exactMatch.id, source: 'local' };

      // 2. Try matching title if ID fails
      const titleMatch = columns.find(c => responseText.includes(c.title.toLowerCase()));
      if (titleMatch) return { columnId: titleMatch.id, source: 'local' };
    } catch (error) {
      console.warn("Local AI classification failed, falling back to Cloud AI:", error);
    }
  }

  // 2. Fallback to Cloud AI (Firebase Function)
  try {
    const user = auth.currentUser;
    if (!user) {
        console.error("User must be logged in to use Cloud AI Fallback");
        return { columnId: null, source: 'none' };
    }

    const idToken = await user.getIdToken();
    const response = await fetch('https://us-central1-clear-retro-app.cloudfunctions.net/classifyThought', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ text, columns: columns.map(c => ({ id: c.id, title: c.title })) })
    });

    if (!response.ok) {
        throw new Error(`Cloud AI failed with status: ${response.status}`);
    }

    const result = await response.json();
    return { columnId: result.columnId || null, source: 'cloud' };

  } catch (error) {
    console.error("Universal AI classification failed:", error);
    return { columnId: null, source: 'none' };
  }
};
