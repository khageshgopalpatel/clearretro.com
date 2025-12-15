import { useRef, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { addCard } from '../hooks/useBoard';

import { useAuth } from '../hooks/useAuth';
import { useSnackbar } from '../context/SnackbarContext';
import Card from './Card';
import type { RetroCard } from '../types';

interface ColumnProps {
    title: string;
    color: string;
    cards: RetroCard[];
    boardId: string;
    columnId: string;
    isTimerExpired: boolean;
    totalCards: number;
    isPrivate: boolean;
    isCompleted?: boolean;
}

const Column = ({ title, color, cards, boardId, columnId, isTimerExpired, totalCards, isPrivate, isCompleted }: ColumnProps) => {
    const { user } = useAuth();
    const { showSnackbar } = useSnackbar();
    const formRef = useRef<HTMLFormElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [text, setText] = useState('');
    // const typingUsers = useTyping(boardId);
    const typingUsers: Record<string, string[]> = {}; // Dummy fallback

    const { setNodeRef, isOver } = useDroppable({
        id: columnId,
        data: { type: 'column', columnId }
    });

    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) {
            showSnackbar('Text is required', 'error');
            return;
        }

        setIsPending(true);
        try {
            await addCard(boardId, columnId, text, user);
            setText('');
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
            showSnackbar('Card added successfully', 'success');
        } catch (error) {
            console.error("Error adding card:", error);
            showSnackbar('Failed to add card', 'error');
        } finally {
            setIsPending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };


    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    };

    const usersTypingInThisColumn = typingUsers[columnId] || [];

    return (
        <div
            ref={setNodeRef}
            className={`flex-1 w-full md:w-80 md:min-w-[20rem] bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border-2 border-black dark:border-gray-500 flex flex-col h-full transition-all duration-300 hover:shadow-lg ${isOver ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-500 border-dashed' : ''
                }`}
        >
            <div className={`flex justify-between items-center mb-4 pb-2 border-b-4 ${color}`}>
                <h3 className="font-black uppercase text-lg text-black dark:text-white">{title}</h3>
                <span className="bg-black dark:bg-white text-white dark:text-black text-xs font-bold px-2 py-1 rounded-full">
                    {cards.length}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto min-h-[100px] pr-1 custom-scrollbar">
                {cards.map((card) => (
                    <Card key={card.id} card={card} boardId={boardId} isPrivate={isPrivate} />
                ))}
                {cards.length === 0 && (
                    <div className="text-center text-gray-400 dark:text-gray-500 italic mt-10 text-sm">
                        No cards yet
                    </div>
                )}
            </div>

            {/* Typing Indicator */}
            {usersTypingInThisColumn.length > 0 && (
                <div className="text-xs text-gray-500 dark:text-gray-400 italic mb-2 h-4 animate-pulse">
                    {usersTypingInThisColumn.join(', ')} {usersTypingInThisColumn.length === 1 ? 'is' : 'are'} typing...
                </div>
            )}

            {!isTimerExpired && !isCompleted && (
                <form onSubmit={handleSubmit} className="mt-4 relative z-20">
                    <div className="relative">
                        <textarea
                            ref={textareaRef}
                            name="text"
                            value={text}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Add a card..."
                            className="w-full p-3 pr-10 border-2 border-black dark:border-gray-500 rounded shadow-neo focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white resize-none overflow-hidden min-h-[50px] text-sm"
                            rows={1}
                            disabled={isPending}
                        />
                        <button
                            type="submit"
                            disabled={isPending || !text.trim()}
                            className="absolute right-2 bottom-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 disabled:opacity-50 transition-transform active:scale-95"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Column;
