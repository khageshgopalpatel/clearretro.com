
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
  createdBy: string;
  creatorName?: string;
  createdAt: any; // Firestore Timestamp
  isRevealed?: boolean;
  votedBy?: string[];
  reactions?: Record<string, string[]>;
  mergedFrom?: string[];
  isActionItem?: boolean;
  isDone?: boolean;
  assigneeId?: string;
  assigneeName?: string;
  order?: number;
}

export interface RetroColumn {
  id: string;
  title: string;
  color: string;
}

export interface RetroBoard {
  id: string;
  name: string; // Was title
  createdBy: string; // Was ownerId
  createdAt: any; // Firestore Timestamp
  columns: RetroColumn[];
  templateName?: string;
  // cards: RetroCard[]; // Cards are subcollection now
  timer?: {
    status: 'running' | 'stopped';
    duration: number;
    endTime?: any; // Firestore Timestamp
  };
  isPrivate?: boolean;
  isPublic?: boolean;
  teamId?: string | null;
  status?: 'active' | 'completed';
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

export interface Team {
  id: string;
  name: string;
  members: { uid: string; displayName: string }[];
  admins: string[];
  createdBy: string;
  createdAt: any;
  isAdmin?: boolean; // Computed property
}
