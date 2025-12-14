import { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { voteCard, addReply, useReplies, toggleReaction, updateCard, deleteReply, deleteCard } from '../hooks/useBoard';
import { useAuth } from '../hooks/useAuth';
// import { usePresence } from '../hooks/usePresence';
import { useSnackbar } from '../context/SnackbarContext';
import ConfirmDialog from './ConfirmDialog';
import EditableText from './EditableText';
import type { RetroCard } from '../types';

interface CardProps {
    card: RetroCard;
    boardId: string;
    isPrivate: boolean;
    sortableProps?: {
        attributes: any;
        listeners: any;
        setNodeRef: (node: HTMLElement | null) => void;
        style: any;
        isDragging?: boolean;
    };
    isCompleted?: boolean;
    onDelete?: (cardId: string) => Promise<void>;
}

const Card = ({ card, boardId, isPrivate, sortableProps, isCompleted, onDelete }: CardProps) => {
    const { user } = useAuth();
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState('');
    const replyInputRef = useRef<HTMLTextAreaElement>(null);
    // const replies = useReplies(boardId, card.id); // Removed optimization
    const replies = Object.values(card.replies || {}).sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    const { showSnackbar } = useSnackbar();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isEditingCard, setIsEditingCard] = useState(false);
    const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
    const [showReactionPicker, setShowReactionPicker] = useState(false);
    const EMOJIS = ['👍', '❤️', '😂', '😮', '🚀', '🎉'];

    const handleReaction = async (emoji: string) => {
        setShowReactionPicker(false);
        await toggleReaction(boardId, card.id, emoji, user?.uid || '');
    };

    // Internal DnD logic (fallback if sortableProps not provided)
    const { attributes: dragAttrs, listeners: dragListeners, setNodeRef: setDragRef, transform } = useDraggable({
        id: card.id,
        data: { type: 'card', cardId: card.id },
        disabled: !!sortableProps
    });

    const { setNodeRef: setDropRef, isOver } = useDroppable({
        id: `drop-${card.id}`,
        data: { type: 'card-drop', cardId: card.id },
        disabled: !!sortableProps
    });

    // Use external props if available, otherwise internal
    const attributes = sortableProps?.attributes || dragAttrs;
    const listeners = sortableProps?.listeners || dragListeners;
    const setNodeRef = sortableProps?.setNodeRef || ((node: HTMLElement | null) => {
        setDragRef(node);
        setDropRef(node);
    });

    const style = sortableProps?.style || (transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined);

    const isDragging = sortableProps?.isDragging;

    const [optimisticVote, setOptimisticVote] = useState({
        votes: card.votes || 0,
        hasVoted: card.votedBy?.includes(user?.uid || '')
    });

    useEffect(() => {
        setOptimisticVote({
            votes: card.votes || 0,
            hasVoted: card.votedBy?.includes(user?.uid || '')
        });
    }, [card.votes, card.votedBy, user?.uid]);

    const handleVote = async () => {
        if (user) {
            const newHasVoted = !optimisticVote.hasVoted;
            setOptimisticVote(prev => ({
                votes: newHasVoted ? prev.votes + 1 : prev.votes - 1,
                hasVoted: newHasVoted
            }));

            try {
                await voteCard(boardId, card.id, user.uid, card.votedBy);
            } catch (error) {
                // Revert on error
                setOptimisticVote(prev => ({
                    votes: !newHasVoted ? prev.votes + 1 : prev.votes - 1,
                    hasVoted: !newHasVoted
                }));
                showSnackbar('Failed to vote', 'error');
            }
        }
    };

    const [isReplyPending, setIsReplyPending] = useState(false);

    const handleReplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText || !replyText.trim()) return;
        if (!user) {
            showSnackbar('You must be logged in to reply', 'error');
            return;
        }

        setIsReplyPending(true);
        try {
            await addReply(boardId, card.id, replyText, user);
            setReplyText('');
            setShowReplyInput(false);
        } catch (error) {
            showSnackbar('Failed to add reply', 'error');
        } finally {
            setIsReplyPending(false);
        }
    };

    useEffect(() => {
        if (showReplyInput && replyInputRef.current) {
            replyInputRef.current.style.height = 'auto';
            replyInputRef.current.style.height = replyInputRef.current.scrollHeight + 'px';
        }
    }, [replyText, showReplyInput]);

    const handleReplyKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            e.currentTarget.form?.requestSubmit();
        }
    };

    const handleSaveCard = async (newText: string) => {
        const { updateCard } = await import('../hooks/useBoard');
        try {
            await updateCard(boardId, card.id, { text: newText });
            showSnackbar('Card updated', 'success');
            setIsEditingCard(false);
        } catch (error) {
            showSnackbar('Failed to update card', 'error');
        }
    };

    const handleSaveReply = async (replyId: string, newText: string) => {
        const { updateReply } = await import('../hooks/useBoard');
        try {
            await updateReply(boardId, card.id, replyId, newText);
            showSnackbar('Reply updated', 'success');
            setEditingReplyId(null);
        } catch (error) {
            showSnackbar('Failed to update reply', 'error');
        }
    };

    // const activeUsers = usePresence(boardId, user);
    // Simple fallback: Active users list is removed for performance.
    // We can only assign to self or maybe leave it unassigned.
    const activeUsers: any[] = []; 
    if (user) activeUsers.push({ id: user.uid, displayName: user.displayName + ' (You)' });

    const handleToggleActionItem = async () => {
        const newState = !card.isActionItem;
        if (newState) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#3b82f6', '#1d4ed8', '#60a5fa'] // Blue theme
            });
        }
        await updateCard(boardId, card.id, { isActionItem: newState } as Partial<RetroCard>);
    };

    const handleToggleDone = async () => {
        const newState = !card.isDone;
        if (newState) {
             confetti({
                particleCount: 150,
                spread: 60,
                origin: { y: 0.7 },
                colors: ['#22c55e', '#16a34a', '#86efac'], // Green theme
                shapes: ['circle', 'square', 'star']
            });
        }
        await updateCard(boardId, card.id, { isDone: newState } as Partial<RetroCard>);
    };

    const handleAssign = async (userId: string) => {
        const assignedUser = activeUsers.find(u => u.id === userId) || (userId === user?.uid ? user : null);
        await updateCard(boardId, card.id, {
            assigneeId: userId,
            assigneeName: assignedUser ? assignedUser.displayName : 'Unknown'
        } as Partial<RetroCard>);
    };

    return (
        <div ref={setNodeRef} style={style} className={`mb-2 animate-fade-in ${isDragging ? 'z-50' : ''}`} {...attributes}>
            <div className={`bg-white dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 p-2.5 shadow-sm rounded-xl relative transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${isOver ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900 bg-blue-50 dark:bg-blue-900/20' : card.isActionItem ? 'border-l-4 border-l-blue-500 dark:border-l-blue-400' : ''}`}>
                {/* Drag Handle */}
                <div
                    {...listeners}
                    className="absolute top-0 left-0 right-0 h-3 cursor-grab active:cursor-grabbing hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-t-xl transition-colors"
                    title="Drag to move"
                ></div>

                {/* Action Item Header */}
                {card.isActionItem && (
                    <div className="flex items-center gap-2 mb-1.5 pb-1.5 border-b border-gray-100 dark:border-gray-700 relative z-10">
                        <input
                            type="checkbox"
                            checked={card.isDone || false}
                            onChange={handleToggleDone}
                            className="w-4 h-4 cursor-pointer accent-blue-600 rounded border-gray-300"
                        />
                        <span className={`text-xs font-bold uppercase tracking-wider ${card.isDone ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>
                            {card.isDone ? 'Done' : 'Action Item'}
                        </span>
                        <div className="ml-auto">
                            <select
                                value={card.assigneeId || ''}
                                onChange={(e) => handleAssign(e.target.value)}
                                className="text-xs py-1 px-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-1 focus:ring-blue-500 outline-none"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <option value="">Unassigned</option>
                                {activeUsers.map(u => (
                                    <option key={u.id} value={u.id}>{u.displayName}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {isEditingCard ? (
                    <EditableText
                        value={card.text}
                        onSave={handleSaveCard}
                        onCancel={() => setIsEditingCard(false)}
                        placeholder="Enter card text..."
                        multiline={true}
                        className="mt-2 min-h-[80px]"
                    />
                ) : (
                    <div className="mt-1 flex justify-between items-start gap-2 relative z-10">
                        <p className={`break-words flex-1 text-xs leading-relaxed text-gray-800 dark:text-gray-200 transition-all duration-300 font-medium ${isPrivate ? 'blur-sm select-none opacity-60' : ''} ${card.isDone ? 'line-through text-gray-400' : ''}`}>
                            {card.text}
                        </p>

                        {isPrivate && (
                            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-white/90 dark:bg-black/80 px-2 py-1 rounded-full border border-gray-200 dark:border-gray-700 backdrop-blur-sm shadow-sm">
                                    Hidden
                                </span>
                            </div>
                        )}

                        {!isCompleted && user?.uid === card.createdBy && !isPrivate && (
                            <button
                                onClick={() => setIsEditingCard(true)}
                                className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                title="Edit card"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            </button>
                        )}
                    </div>
                )}

                {/* Reactions Display */}
                {card.reactions && Object.keys(card.reactions).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5 mb-1 relative z-10">
                        {Object.entries(card.reactions).map(([emoji, userIds]) => (
                            <button
                                key={emoji}
                                onClick={() => !isCompleted && toggleReaction(boardId, card.id, emoji, user?.uid || '')}
                                className={`text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-1 transition-all ${userIds.includes(user?.uid || '') ? 'bg-blue-50 border border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300' : 'bg-gray-50 border border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                title={`${userIds.length} people reacted`}
                                disabled={isCompleted}
                            >
                                <span>{emoji}</span>
                                <span className="font-bold opacity-80">{userIds.length}</span>
                            </button>
                        ))}
                    </div>
                )}

                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleVote}
                            disabled={isCompleted}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-all text-xs font-medium ${optimisticVote.hasVoted
                                ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-900'
                                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'}`}
                            title={optimisticVote.hasVoted ? "Unlike" : "Like"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={optimisticVote.hasVoted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            <span>{optimisticVote.votes}</span>
                        </button>

                        {/* Reaction Button */}
                        {!isCompleted && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowReactionPicker(!showReactionPicker)}
                                    className="p-1 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-md transition-colors"
                                    title="Add reaction"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                                        <line x1="9" y1="9" x2="9.01" y2="9"></line>
                                        <line x1="15" y1="9" x2="15.01" y2="9"></line>
                                    </svg>
                                </button>

                                {showReactionPicker && (
                                    <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 rounded-xl shadow-xl flex gap-1 z-50 animate-in fade-in zoom-in duration-200">
                                        {EMOJIS.map(emoji => (
                                            <button
                                                key={emoji}
                                                onClick={() => handleReaction(emoji)}
                                                className="text-xl hover:scale-125 transition-transform cursor-pointer p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 items-center">
                        {!isCompleted && (
                            <button
                                onClick={() => setShowReplyInput(!showReplyInput)}
                                className="text-xs font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white hover:underline transition-colors"
                            >
                                Reply
                            </button>
                        )}

                        {!isCompleted && (
                            <button
                                onClick={handleToggleActionItem}
                                className={`text-xs font-medium transition-colors ${card.isActionItem ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                                title={card.isActionItem ? "Revert to Card" : "Convert to Action Item"}
                            >
                                {card.isActionItem ? 'Action' : 'Convert'}
                            </button>
                        )}

                        {!isCompleted && user?.uid === card.createdBy && (
                            <button
                                onClick={() => setShowDeleteDialog(true)}
                                className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                                title="Delete card"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Replies List */}
                {replies.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 -mx-2.5 px-2.5 pb-1 rounded-b-xl">
                        {replies.map(reply => (
                            <div key={reply.id} className="text-xs mb-2 pl-3 border-l-2 border-gray-300 dark:border-gray-600">
                                {editingReplyId === reply.id ? (
                                    <EditableText
                                        value={reply.text}
                                        onSave={(newText) => handleSaveReply(reply.id, newText)}
                                        onCancel={() => setEditingReplyId(null)}
                                        placeholder="Enter reply..."
                                        multiline={true}
                                        className="bg-white dark:bg-gray-900"
                                    />
                                ) : (
                                    <div className="flex justify-between items-start group gap-2">
                                        <div className="flex-1">
                                            <p className="text-gray-700 dark:text-gray-300 leading-snug">{reply.text}</p>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                            {!isCompleted && user?.uid === reply.createdBy && (
                                                <>
                                                    <button
                                                        onClick={() => setEditingReplyId(reply.id)}
                                                        className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-0.5"
                                                        title="Edit reply"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            const { deleteReply } = await import('../hooks/useBoard');
                                                            try {
                                                                await deleteReply(boardId, card.id, reply.id);
                                                                showSnackbar('Reply deleted', 'success');
                                                            } catch (error) {
                                                                showSnackbar('Failed to delete reply', 'error');
                                                            }
                                                        }}
                                                        className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-0.5"
                                                        title="Delete reply"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                        </svg>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Reply Input */}
                {showReplyInput && !isCompleted && (
                    <form onSubmit={handleReplySubmit} className="mt-3 relative z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                        <textarea
                            name="text"
                            ref={replyInputRef}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyDown={handleReplyKeyDown}
                            placeholder="Write a reply..."
                            className="w-full p-3 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white mb-2 resize-none overflow-hidden min-h-[60px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            autoFocus
                            rows={1}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setShowReplyInput(false)}
                                className="text-xs px-3 py-1.5 rounded-md font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                                disabled={isReplyPending}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="text-xs px-3 py-1.5 rounded-md font-medium bg-gray-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors disabled:opacity-50"
                                disabled={isReplyPending}
                            >
                                {isReplyPending ? 'Replying...' : 'Reply'}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={async () => {
                    if (onDelete) {
                        await onDelete(card.id);
                        showSnackbar('Card deleted', 'success');
                    } else {
                        // Fallback logic
                        const { deleteCard } = await import('../hooks/useBoard');
                        try {
                            await deleteCard(boardId, card.id);
                            showSnackbar('Card deleted successfully', 'success');
                        } catch (error) {
                            showSnackbar('Failed to delete card', 'error');
                        }
                    }
                }}
                title="Delete Card"
                message="Are you sure you want to delete this card? This action cannot be undone."
                onCancel={() => setShowDeleteDialog(false)}
            />
        </div>
    );
};

export default Card;
