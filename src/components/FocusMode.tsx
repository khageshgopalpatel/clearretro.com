import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { toggleReaction, toggleVote } from '../hooks/useBoard';
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
                            {/* Existing Reactions */}
                            {currentCard.reactions && (
                                <div className="flex gap-1.5 flex-wrap justify-center">
                                    {Object.entries(currentCard.reactions)
                                        .filter(([_, userIds]) => userIds.length > 0)
                                        .map(([emoji, userIds]) => (
                                        <button
                                            key={emoji}
                                            onClick={() => toggleReaction(boardId, currentCard.id, emoji, user?.uid || '')}
                                            className={`px-2 py-1 rounded-full flex items-center gap-1.5 text-xs font-bold border transition-all active:scale-95 hover:brightness-95 ${
                                                userIds.includes(user?.uid || '')
                                                ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300'
                                                : 'bg-white border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
                                            }`}
                                        >
                                            <span>{emoji}</span>
                                            <span>{userIds.length}</span>
                                        </button>
                                    ))}
                                </div>
                            )}



                            {/* Vote Button */}
                            <button
                                onClick={() => toggleVote(boardId, currentCard.id, user?.uid || '')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all active:scale-95 border ${
                                    currentCard.votedBy?.includes(user?.uid || '')
                                    ? 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-400'
                                    : 'bg-white border-gray-200 text-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-500 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-600'
                                }`}
                                title={currentCard.votedBy?.includes(user?.uid || '') ? "Remove vote" : "Vote for this card"}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={currentCard.votedBy?.includes(user?.uid || '') ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                </svg>
                                <span className="text-sm">{currentCard.votes || 0}</span>
                            </button>
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
