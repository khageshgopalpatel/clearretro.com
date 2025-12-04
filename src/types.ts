
export interface User {
  id: string;
  name: string;
  avatar?: string;
  isGuest: boolean;
}

export interface RetroCard {
  id: string;
  columnId: string;
  text: string;
  votes: number;
  userId: string;
  createdAt: number;
  isRevealed: boolean; // For private mode
  mergedIds?: string[]; // IDs of cards merged into this one
}

export interface RetroColumn {
  id: string;
  title: string;
  color: string; // Tailwind color class suffix e.g., 'red-500'
}

export interface RetroBoard {
  id: string;
  title: string;
  ownerId: string;
  createdAt: number;
  columns: RetroColumn[];
  cards: RetroCard[];
  timer: {
    isActive: boolean;
    timeLeft: number; // in seconds
    endTime?: number; // Timestamp when timer ends (for robust sync)
  };
  settings: {
    isPrivate: boolean; // Blur cards
    isFocusMode: boolean;
  };
}

export interface BoardTemplate {
  id: string;
  name: string;
  columns: { title: string; color: string }[];
}

export enum AISummaryStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface AISummaryResult {
  executiveSummary: string;
  sentimentScore: number;
  actionItems: string[];
}
