import { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { addReply, toggleReaction, toggleVote, updateCard, deleteReply, deleteCard } from '../hooks/useBoard';
import { useAuth } from '../hooks/useAuth';
import { analytics, logEvent } from "../lib/firebase";
// import { usePresence } from '../hooks/usePresence';
import { useSnackbar } from '../context/SnackbarContext';
import ConfirmDialog from './ConfirmDialog';
import EditableText from './EditableText';
import ActionItemConvertModal from './ActionItemConvertModal';
import ActionItemLogsModal from './ActionItemLogsModal';
import type { RetroCard } from '../types';
import { MoreHorizontal, Merge } from 'lucide-react';

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
    onUpdate?: (cardId: string, newText: string) => Promise<void>;
    onReaction?: (cardId: string, emoji: string) => Promise<void>;
    onVote?: (cardId: string) => Promise<void>;
    onMerge?: (cardId: string) => void;
}

const Card = ({ card, boardId, isPrivate, sortableProps, isCompleted, onDelete, onUpdate, onReaction, onVote, onMerge }: CardProps) => {
    const { user } = useAuth();
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState('');
    const replyInputRef = useRef<HTMLTextAreaElement>(null);

    const replies = Object.values(card.replies || {}).sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    const { showSnackbar } = useSnackbar();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isEditingCard, setIsEditingCard] = useState(false);
    const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
    const [showReactionPicker, setShowReactionPicker] = useState(false);
    const [showConvertModal, setShowConvertModal] = useState(false);
    const [showLogsModal, setShowLogsModal] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const EMOJIS = ['👍', '+1', '❤️', '😂', '😮', '🚀', '🎉'];

    const handleReaction = async (emoji: string) => {
        setShowReactionPicker(false);
        if (onReaction) {
            await onReaction(card.id, emoji);
        } else {
            await toggleReaction(boardId, card.id, emoji, user?.uid || '');
        }
    };

    const handleVote = async () => {
        if (!user) return;
        if (onVote) {
            await onVote(card.id);
        } else {
            await toggleVote(boardId, card.id, user.uid);
        }
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




    const [isReplyPending, setIsReplyPending] = useState(false);

    const handleReplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const textToSubmit = replyText;
        if (!textToSubmit || !textToSubmit.trim()) return;
        if (!user) {
            showSnackbar('You must be logged in to reply', 'error');
            return;
        }

        setIsReplyPending(true);
        setReplyText(''); // Optimistic clear
        
        if (analytics) {
            logEvent(analytics, 'add_reply', {
                board_id: boardId,
                card_id: card.id
            });
        }

        try {
            await addReply(boardId, card.id, textToSubmit, user);
            // setShowReplyInput(false); // Removed as we want to keep input visible or uncontrolled by this
        } catch (error) {
            showSnackbar('Failed to add reply', 'error');
            setReplyText(textToSubmit); // Restore on error
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
        setIsEditingCard(false); // Optimistic close
        
        if (onUpdate) {
            await onUpdate(card.id, newText);
            return;
        }

        const { updateCard } = await import('../hooks/useBoard');
        try {
            await updateCard(boardId, card.id, { text: newText });
            showSnackbar('Card updated', 'success');
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

    // Simple fallback: Active users list is removed for performance.
    // We can only assign to self or maybe leave it unassigned.
    const activeUsers: any[] = []; 
    if (user) activeUsers.push({ id: user.uid, displayName: user.displayName + ' (You)' });

    const handleToggleActionItem = async () => {
        // Always open modal to edit details
        setShowConvertModal(true);
    };

    const handleConfirmConvert = async (newText: string, assignee: { id?: string, name: string } | null, updates: any) => {
        setShowConvertModal(false);
        confetti({
             particleCount: 100,
             spread: 70,
             origin: { y: 0.6 },
             colors: ['#3b82f6', '#1d4ed8', '#60a5fa'] // Blue theme
        });

        const cardUpdates: Partial<RetroCard> = { 
            isActionItem: true, 
            text: newText, 
            assigneeId: assignee?.id || (assignee ? 'manual-' + Date.now() : ''),
            assigneeName: assignee?.name || '',
            ...updates
        };

        await updateCard(boardId, card.id, cardUpdates);
    };


    
    const handleAddLog = async (text: string) => {
        if (!user) return;
        const newLog = {
            id: crypto.randomUUID(),
            text,
            createdBy: user.uid,
            creatorName: user.displayName || 'Unknown',
            createdAt: new Date().toISOString()
        };
        
        // Use arrayUnion if possible, but logs is complex object array, so simpler to read-modify-write via generic updateCard
        // Or better, let's assume 'logs' is an array in Firestore.
        // Since updateCard takes Partial<RetroCard>, we can retrieve current logs and append.
        // However, props 'card' has current logs.
        const currentLogs = card.logs || [];
        const updatedLogs = [...currentLogs, newLog];
        
        await updateCard(boardId, card.id, { logs: updatedLogs } as Partial<RetroCard>);
    };

    return (
        <div ref={setNodeRef} style={style} className={`mb-2 animate-fade-in ${isDragging ? 'z-50' : ''}`} {...attributes}>
            <div className={`group bg-white dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 p-2.5 shadow-sm rounded-xl relative transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:scale-[1.01] ${isOver ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900 bg-blue-50 dark:bg-blue-900/20' : card.isActionItem ? 'border-l-4 border-l-blue-500 dark:border-l-blue-400 bg-blue-50/10 dark:bg-blue-900/10' : ''}`}>
                {/* Drag Handle */}
                {/* Drag Handle */}
                <div
                    {...listeners}
                    className="absolute top-0 left-0 right-0 h-4 cursor-grab active:cursor-grabbing hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-t-xl transition-colors flex items-center justify-center group/handle"
                    title="Drag to move"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <circle cx="9" cy="12" r="1"></circle>
                        <circle cx="9" cy="5" r="1"></circle>
                        <circle cx="9" cy="19" r="1"></circle>
                        <circle cx="15" cy="12" r="1"></circle>
                        <circle cx="15" cy="5" r="1"></circle>
                        <circle cx="15" cy="19" r="1"></circle>
                    </svg>
                </div>



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
                                className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all transform active:scale-90 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
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
                
                {card.isActionItem && (
                    <div className="mt-2.5 mb-1 px-1">
                        {/* Description */}
                        {card.description && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-3">
                                {card.description}
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2 items-center">
                            {/* Priority Badge */}
                            {card.priority && (
                                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                                    card.priority === 'high' ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400' :
                                    card.priority === 'medium' ? 'bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400' :
                                    'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400'
                                }`}>
                                    {card.priority}
                                </span>
                            )}
                            
                            {/* Due Date */}
                            {card.dueDate && (
                                 <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border bg-gray-50 border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 flex items-center gap-1`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                    {new Date(card.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                 </span>
                            )}

                            {/* Status Badge */}
                            {card.status && card.status !== 'todo' && (
                                 <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                                     card.status === 'done' ? 'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' :
                                     'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-400'
                                 }`}>
                                    {card.status === 'in_progress' ? 'In Progress' : 'Done'}
                                 </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Reactions Display */}


                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800 flex flex-wrap md:flex-nowrap justify-between items-center gap-y-2 relative z-10">
                    <div className="flex items-center gap-2">


                        {/* Reaction Button */}
                        {!isCompleted && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowReactionPicker(!showReactionPicker)}
                                    className="p-1 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-md transition-all active:scale-90"
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

                        {/* Reactions Display */}
                        {card.reactions && Object.keys(card.reactions).length > 0 && (
                            <div className="flex gap-1.5 relative z-10">
                                {Object.entries(card.reactions)
                                    .filter(([_, userIds]) => userIds.length > 0)
                                    .map(([emoji, userIds]) => (
                                    <button
                                        key={emoji}
                                        onClick={() => !isCompleted && toggleReaction(boardId, card.id, emoji, user?.uid || '')}
                                        className={`text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-1 transition-all active:scale-90 ${userIds.includes(user?.uid || '') ? 'bg-blue-50 border border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300' : 'bg-gray-50 border border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105'}`}
                                        title={`${userIds.length} people reacted`}
                                        disabled={isCompleted}
                                    >
                                        <span>{emoji}</span>
                                        <span className="font-bold opacity-80">{userIds.length}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Vote Button */}
                        <button
                            onClick={handleVote}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold transition-all active:scale-95 border ${
                                card.votedBy?.includes(user?.uid || '')
                                ? 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-400'
                                : 'bg-gray-50 border-gray-200 text-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-500 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-600'
                            }`}
                            title={card.votedBy?.includes(user?.uid || '') ? "Remove vote" : "Vote for this card"}
                            disabled={isCompleted}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill={card.votedBy?.includes(user?.uid || '') ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                            <span>{card.votes || 0}</span>
                        </button>
                    </div>

                    <div className="flex gap-3 items-center">
                        {!isCompleted && card.isActionItem && (
                             <button
                                onClick={() => setShowLogsModal(true)}
                                className="text-xs font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all active:scale-95 flex items-center gap-1"
                                title="View Logs"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                                Logs {card.logs && card.logs.length > 0 && `(${card.logs.length})`}
                            </button>
                        )}

                        {!isCompleted && (
                             <button
                                onClick={() => setShowConvertModal(true)}
                                className={`text-xs font-bold transition-all active:scale-95 flex items-center gap-1 group/ai ${card.isActionItem 
                                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-lg border border-blue-200 dark:border-blue-800' 
                                    : 'text-gray-400 hover:text-blue-600 dark:text-gray-500 opacity-0 group-hover:opacity-100'}`}
                                title={card.isActionItem ? "Edit Action Item" : "Convert to Action Item ✨"}
                            >
                                <div className={`transition-transform duration-300 ${card.isActionItem ? 'scale-110' : 'group-hover/ai:rotate-12 group-hover/ai:scale-110'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={card.isActionItem ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                                    </svg>
                                </div>
                                <span className={card.isActionItem ? 'block' : 'hidden group-hover/ai:block'}>
                                    {card.isActionItem ? 'Task' : 'Task It'}
                                </span>
                            </button>
                        )}

                        {/* Reply Toggle Button */}
                        <button
                            onClick={() => setShowReplies(!showReplies)}
                            className={`text-xs font-medium transition-all active:scale-95 flex items-center gap-1 ${showReplies ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-blue-600 dark:hover:text-blue-400'}`}
                            title={showReplies ? "Hide Replies" : "Show Replies"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                            {replies.length > 0 && replies.length}
                        </button>

                        {!isCompleted && user?.uid === card.createdBy && (
                            <button
                                onClick={() => setShowDeleteDialog(true)}
                                className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all active:scale-90 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                                title="Delete card"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>
                        )}

                        {/* More Menu */}
                        {!isCompleted && onMerge && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                                    className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all active:scale-95 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                    title="More actions"
                                >
                                    <MoreHorizontal className="w-3.5 h-3.5" />
                                </button>
                                {showMoreMenu && (
                                    <div className="absolute right-0 bottom-full mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden min-w-[120px] z-50 animate-in fade-in zoom-in duration-200">
                                         <button
                                            onClick={() => {
                                                setShowMoreMenu(false);
                                                onMerge(card.id);
                                            }}
                                            className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                                         >
                                            <Merge className="w-3.5 h-3.5" />
                                            Merge With...
                                         </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Replies container + Input Form */}
                {showReplies && (
                    <div className="mt-2 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 -mx-2.5 px-2.5 pb-1 rounded-b-xl animate-in slide-in-from-top-2 duration-200">
                        {replies.length > 0 && replies.map(reply => (
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
                                                        className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all active:scale-90 p-0.5"
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
                                                        className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all active:scale-90 p-0.5"
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

                        {/* Reply Input */}
                        {!isCompleted && (
                            <form onSubmit={handleReplySubmit} className="mt-3 relative z-20">
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
                                        onClick={() => setShowReplies(false)}
                                        className="text-xs px-3 py-1.5 rounded-md font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                
                                    >
                                        Close
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
                )}
            </div>

            <ActionItemConvertModal 
                isOpen={showConvertModal} 
                onClose={() => setShowConvertModal(false)}
                onConfirm={handleConfirmConvert}
                initialText={card.text}
                initialAssigneeId={card.assigneeId}
                initialAssigneeName={card.assigneeName}
                initialIsDone={card.isDone}
                initialPriority={card.priority}
                initialDueDate={card.dueDate}
                initialStatus={card.status}
                initialDescription={card.description}
                users={activeUsers}
            />

            <ActionItemLogsModal
                isOpen={showLogsModal}
                onClose={() => setShowLogsModal(false)}
                logs={card.logs || []}
                onAddLog={handleAddLog}
                cardText={card.text}
            />
            
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
