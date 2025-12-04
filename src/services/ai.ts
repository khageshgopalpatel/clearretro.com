import { getAuth } from 'firebase/auth';

export const generateBoardSummary = async (cards: any, columns: any) => {
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

// Deprecated/Unused functions kept for reference or cleanup if needed
export const getStoredApiKey = () => localStorage.getItem('gemini_api_key');
export const setStoredApiKey = (key: string) => localStorage.setItem('gemini_api_key', key);
export const removeStoredApiKey = () => localStorage.removeItem('gemini_api_key');
