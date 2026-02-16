import type { RetroColumn } from "../types";
import { auth } from "../lib/firebase";

export interface ClassificationResult {
  columnId: string | null;
  source: 'local' | 'cloud' | 'none';
}

/**
 * Checks if Chromium's built-in AI (Prompt API) is readily available.
 * Returns true only if the model is already downloaded and ready — never triggers a download.
 */
export const isLocalAIReady = async (): Promise<boolean> => {
  const anyWindow = window as any;

  if (!window.isSecureContext) return false;

  const ai = anyWindow.ai;
  const assistantNamespace = ai?.languageModel || ai?.assistant || anyWindow.assistant || anyWindow.LanguageModel;

  if (!assistantNamespace) return false;

  try {
    if (assistantNamespace.capabilities) {
      const caps = await assistantNamespace.capabilities();
      return caps.available === 'readily';
    }

    if (assistantNamespace.availability) {
      const availability = await assistantNamespace.availability();
      return availability === 'available' || availability === 'readily';
    }

    return false;
  } catch {
    return false;
  }
};

/**
 * Classifies a user's thought into one of the provided retro columns.
 * Uses local Chrome AI if readily available, otherwise falls back to Gemini Cloud.
 */
export const classifyThought = async (
  text: string,
  columns: RetroColumn[]
): Promise<ClassificationResult> => {
  const anyWindow = window as any;
  const ai = anyWindow.ai;
  const assistantNamespace = ai?.languageModel || ai?.assistant || anyWindow.assistant || anyWindow.LanguageModel;

  // 1. Try Built-in Chrome AI if readily available (no downloads)
  if (assistantNamespace) {
    try {
      const ready = await isLocalAIReady();
      if (ready) {
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
      }
    } catch (error) {
      console.warn("Local AI classification failed, falling back to Cloud AI:", error);
    }
  }

  // 2. Fallback to Cloud AI (Firebase Function)
  try {
    const user = auth.currentUser;
    if (!user) {
        console.error("User must be logged in to use Cloud AI");
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
