import { getAuth } from 'firebase/auth';
import type { RetroCard, RetroColumn } from '../types';

export const generateBoardSummary = async (cards: RetroCard[], columns: RetroColumn[]) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        throw new Error("User must be logged in to generate summary");
    }

    const token = await user.getIdToken();

    const response = await fetch('https://us-central1-clear-retro-app.cloudfunctions.net/generateBoardSummary', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cards, columns })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    return await response.json();
};
