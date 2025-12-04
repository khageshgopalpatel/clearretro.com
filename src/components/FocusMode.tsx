import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { voteCard, toggleReaction } from '../hooks/useBoard';
import type { RetroCard } from '../types';

interface FocusModeProps {
    cards: RetroCard[];
    initialIndex?: number;
    onClose: () => void;
    boardId: string;
}

const FocusMode = ({ cards, initialIndex = 0, onClose, boardId }: FocusModeProps) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const { user } = useAuth();
    const currentCard = cards[currentIndex];
    const EMOJIS = ['👍', '❤️', '😂', '😮', '🚀', '🎉'];

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, [cards.length]);

    const handlePrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, [cards.length]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNext, handlePrev, onClose]);

    if (!currentCard) return null;

    const hasVoted = currentCard.votedBy?.includes(user?.uid || '');

    const [showReactions, setShowReactions] = useState(false);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 w-full max-w-4xl mx-4 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-200 dark:border-gray-700 relative">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Focus Mode</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Card {currentIndex + 1} of {cards.length} • {currentCard.columnId}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 sm:p-12 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-black/20">
                    <div className="w-full max-w-2xl text-center">
                        <p className="text-2xl sm:text-3xl md:text-4xl font-medium text-gray-900 dark:text-white leading-relaxed animate-in slide-in-from-bottom-4 duration-300">
                            {currentCard.text}
                        </p>

                        {currentCard.isActionItem && (
                            <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-bold uppercase tracking-wider border border-blue-100 dark:border-blue-800">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="9 11 12 14 22 4"></polyline>
                                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                                </svg>
                                Action Item
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between max-w-2xl mx-auto w-full">
                        <button
                            onClick={handlePrev}
                            className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hover:scale-110 active:scale-95 text-gray-600 dark:text-gray-300 disabled:opacity-30 disabled:hover:scale-100"
                            disabled={currentIndex === 0}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </button>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => voteCard(boardId, currentCard.id, user?.uid || 'guest')}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all hover:scale-105 active:scale-95 ${hasVoted
                                    ? 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={hasVoted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                                <span>{currentCard.votes}</span>
                            </button>

                            <div className="relative">
                                <button
                                    onClick={() => setShowReactions(!showReactions)}
                                    className="p-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-all hover:scale-105 active:scale-95"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                                        <line x1="9" y1="9" x2="9.01" y2="9"></line>
                                        <line x1="15" y1="9" x2="15.01" y2="9"></line>
                                    </svg>
                                </button>

                                {showReactions && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 rounded-2xl shadow-xl flex gap-1 animate-in fade-in zoom-in duration-200">
                                        {['👍', '👎', '🎉', '❤️', '🚀', '👀'].map(emoji => (
                                            <button
                                                key={emoji}
                                                onClick={() => {
                                                    toggleReaction(boardId, currentCard.id, emoji, user?.uid || '');
                                                    setShowReactions(false);
                                                }}
                                                className="text-2xl hover:scale-125 transition-transform p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleNext}
                            className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hover:scale-110 active:scale-95 text-gray-600 dark:text-gray-300 disabled:opacity-30 disabled:hover:scale-100"
                            disabled={currentIndex === cards.length - 1}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                    </div>

                    <div className="text-center mt-4">
                        <p className="text-xs font-mono text-gray-400 dark:text-gray-500">
                            Use arrow keys to navigate
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FocusMode;
