import type { RetroBoard, RetroCard, RetroColumn } from '../types';

// Simulates a backend delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const BOARDS_KEY = 'clear_retro_boards';

export const getBoards = async (): Promise<RetroBoard[]> => {
  await delay(300);
  const data = localStorage.getItem(BOARDS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getBoardById = async (id: string): Promise<RetroBoard | null> => {
  await delay(200);
  const boards = await getBoards();
  return boards.find(b => b.id === id) || null;
};

export const createBoard = async (board: RetroBoard): Promise<void> => {
  await delay(400);
  const boards = await getBoards();
  boards.push(board);
  localStorage.setItem(BOARDS_KEY, JSON.stringify(boards));
};

export const updateBoard = async (updatedBoard: RetroBoard): Promise<void> => {
  // In a real app with Firestore, this would be a specific doc update
  // For local, we read all, replace one, write all.
  const boards = await getBoards();
  const index = boards.findIndex(b => b.id === updatedBoard.id);
  if (index !== -1) {
    boards[index] = updatedBoard;
    localStorage.setItem(BOARDS_KEY, JSON.stringify(boards));
  }
};

export const deleteBoard = async (id: string): Promise<void> => {
  const boards = await getBoards();
  const newBoards = boards.filter(b => b.id !== id);
  localStorage.setItem(BOARDS_KEY, JSON.stringify(newBoards));
};
