import { useState, useEffect } from 'react';
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
    doc,
    getDoc,
    updateDoc,
    increment,
    arrayUnion,
    arrayRemove,
    deleteDoc,
    limit,
    deleteField, // Added
    type DocumentData
} from "firebase/firestore";
import { db } from '../lib/firebase';
import type { RetroBoard, RetroCard, RetroColumn } from '../types';

// Actions (Keep as pure functions where possible)
export const createBoard = async (name: string, userId: string, initialColumns: RetroColumn[], teamId: string | null = null, templateName?: string) => {
    if (!userId) throw new Error("User ID required");

    try {
        const docRef = await addDoc(collection(db, "boards"), {
            name: name,
            createdBy: userId,
            teamId: teamId,
            createdAt: serverTimestamp(),
            isPublic: true,
            templateName: templateName || 'Custom',
            timer: {
                endTime: null,
                duration: 0,
                status: 'stopped'
            },
            columns: initialColumns || [
                { id: 'went-well', title: 'Went Well', color: 'green' },
                { id: 'to-improve', title: 'To Improve', color: 'red' },
                { id: 'action-items', title: 'Action Items', color: 'blue' }
            ]
        });
        return docRef.id;
    } catch (e) {
        console.error("Error adding board: ", e);
        throw e;
    }
};

export const addCard = async (boardId: string, columnId: string, text: string, user: any) => {
    try {
        // Get current max order to append at the end
        const q = query(collection(db, `boards/${boardId}/cards`), where("columnId", "==", columnId), orderBy("order", "desc"), limit(1));
        const snapshot = await getDocs(q);
        const maxOrder = snapshot.empty ? 0 : (snapshot.docs[0].data().order || 0);

        await addDoc(collection(db, `boards/${boardId}/cards`), {
            text: text,
            columnId: columnId,
            votes: 0,
            createdBy: user.uid,
            creatorName: user.displayName,
            createdAt: serverTimestamp(),
            votedBy: [],
            order: maxOrder + 10000 // Large increment to allow insertions
        });
    } catch (e) {
        console.error("Error adding card: ", e);
        throw e;
    }
};



export const toggleReaction = async (boardId: string, cardId: string, emoji: string, userId: string) => {
    if (!userId) return;
    const cardRef = doc(db, `boards/${boardId}/cards`, cardId);
    const cardSnap = await getDoc(cardRef);

    if (cardSnap.exists()) {
        const data = cardSnap.data();
        const reactions = data.reactions || {};
        const userIds = reactions[emoji] || [];

        if (userIds.includes(userId)) {
            // Remove reaction atomically
            await updateDoc(cardRef, {
                [`reactions.${emoji}`]: arrayRemove(userId)
            });

            // Clean up empty keys if needed (optional, harder to do atomically without transaction)
        } else {
            // Add reaction atomically
            await updateDoc(cardRef, {
                [`reactions.${emoji}`]: arrayUnion(userId)
            });
        }
    }
};



export const updateBoardTimer = async (boardId: string, status: 'running' | 'paused' | 'stopped', durationInSeconds: number = 0) => {
    const updateData: any = {
        'timer.status': status
    };

    if (status === 'running' && durationInSeconds > 0) {
        const endTime = new Date();
        endTime.setSeconds(endTime.getSeconds() + durationInSeconds);
        updateData['timer.endTime'] = endTime;
        updateData['timer.duration'] = durationInSeconds;
    } else if (status === 'stopped') {
        updateData['timer.endTime'] = null;
        if (durationInSeconds > 0) {
            updateData['timer.duration'] = durationInSeconds;
        }
    }

    await updateDoc(doc(db, "boards", boardId), updateData);
};

export const adjustTimer = async (boardId: string, seconds: number) => {
    const boardRef = doc(db, "boards", boardId);
    const boardSnap = await getDoc(boardRef);

    if (boardSnap.exists()) {
        const data = boardSnap.data();
        const timer = data.timer || {};

        if (timer.status === 'running' && timer.endTime) {
            // If running, extend endTime
            const currentEndTime = timer.endTime.toDate();
            const newEndTime = new Date(currentEndTime.getTime() + (seconds * 1000));
            await updateDoc(boardRef, {
                'timer.endTime': newEndTime,
                'timer.duration': increment(seconds)
            });
        } else {
            // If stopped, just increase duration (prevent negative)
            const currentDuration = timer.duration || 0;
            const newDuration = Math.max(0, currentDuration + seconds);
            await updateDoc(boardRef, {
                'timer.duration': newDuration
            });
        }
    }
};

// Merge two cards into one
export const mergeCards = async (boardId: string, sourceCardId: string, targetCardId: string) => {
    try {
        const sourceRef = doc(db, `boards/${boardId}/cards`, sourceCardId);
        const targetRef = doc(db, `boards/${boardId}/cards`, targetCardId);

        const [sourceSnap, targetSnap] = await Promise.all([
            getDoc(sourceRef),
            getDoc(targetRef)
        ]);

        if (!sourceSnap.exists() || !targetSnap.exists()) {
            throw new Error('One or both cards not found');
        }

        const sourceData = sourceSnap.data();
        const targetData = targetSnap.data();

        // Combine the text with a separator
        const mergedText = `${targetData.text}\n\n---\n\n${sourceData.text}`;

        // Combine votes (if needed)
        const mergedVotes = (targetData.votes || 0) + (sourceData.votes || 0);

        // Merge reactions
        const mergedReactions = { ...(targetData.reactions || {}) };
        const sourceReactions = sourceData.reactions || {};
        Object.keys(sourceReactions).forEach(emoji => {
            const targetUsers = mergedReactions[emoji] || [];
            const sourceUsers = sourceReactions[emoji] || [];
            // Combine and deduplicate user IDs
            mergedReactions[emoji] = [...new Set([...targetUsers, ...sourceUsers])];
        });

        // Track merge history
        const mergedFrom = [...(targetData.mergedFrom || []), sourceCardId, ...(sourceData.mergedFrom || [])];

        // Update target card with merged content
        await updateDoc(targetRef, {
            text: mergedText,
            votes: mergedVotes,
            reactions: mergedReactions,
            mergedFrom: mergedFrom
        });

        // Delete source card
        await deleteDoc(sourceRef);

        return targetCardId;
    } catch (error) {
        console.error('Error merging cards:', error);
        throw error;
    }
};

export const togglePrivateMode = async (boardId: string, isPrivate: boolean) => {
    const boardRef = doc(db, "boards", boardId);
    await updateDoc(boardRef, {
        isPrivate: isPrivate,
        // If turning off private mode (revealing), update revealedAt
        revealedAt: !isPrivate ? serverTimestamp() : null
    });
};

export const completeRetro = async (boardId: string) => {
    const boardRef = doc(db, "boards", boardId);
    await updateDoc(boardRef, {
        status: 'completed',
        completedAt: serverTimestamp()
    });
};

export const moveCard = async (boardId: string, cardId: string, newColumnId: string, newOrder?: number) => {
    const cardRef = doc(db, `boards/${boardId}/cards`, cardId);
    const updates: any = { columnId: newColumnId };
    if (newOrder !== undefined) {
        updates.order = newOrder;
    }
    await updateDoc(cardRef, updates);
};

export const deleteBoard = async (boardId: string) => {
    try {
        // Delete all cards in the board first
        const cardsQuery = query(collection(db, `boards/${boardId}/cards`));
        const cardsSnapshot = await getDocs(cardsQuery);

        const deletePromises = cardsSnapshot.docs.map(async (cardDoc) => {
            // Delete replies for each card
            const repliesQuery = query(collection(db, `boards/${boardId}/cards/${cardDoc.id}/replies`));
            const repliesSnapshot = await getDocs(repliesQuery);
            await Promise.all(repliesSnapshot.docs.map(replyDoc => deleteDoc(replyDoc.ref)));

            // Delete the card
            return deleteDoc(cardDoc.ref);
        });

        await Promise.all(deletePromises);

        // Finally delete the board
        await deleteDoc(doc(db, "boards", boardId));
    } catch (e) {
        console.error("Error deleting board: ", e);
        throw e;
    }
};

export const deleteCard = async (boardId: string, cardId: string) => {
    try {
        // Delete all replies first
        const repliesQuery = query(collection(db, `boards/${boardId}/cards/${cardId}/replies`));
        const repliesSnapshot = await getDocs(repliesQuery);
        await Promise.all(repliesSnapshot.docs.map(replyDoc => deleteDoc(replyDoc.ref)));

        // Delete the card
        await deleteDoc(doc(db, `boards/${boardId}/cards`, cardId));
    } catch (e) {
        console.error("Error deleting card: ", e);
        throw e;
    }
};

export const addReply = async (boardId: string, cardId: string, text: string, user: any) => {
    const replyId = crypto.randomUUID();
    const cardRef = doc(db, `boards/${boardId}/cards`, cardId);
    await updateDoc(cardRef, {
        [`replies.${replyId}`]: {
            id: replyId,
            text: text,
            createdBy: user.uid,
            creatorName: user.displayName,
            createdAt: new Date().toISOString() // Use ISO string for embedded objects
        }
    });
};

export const deleteReply = async (boardId: string, cardId: string, replyId: string) => {
    try {
        const cardRef = doc(db, `boards/${boardId}/cards`, cardId);
        // Use field deletion
        await updateDoc(cardRef, {
            [`replies.${replyId}`]: deleteField()
        });
    } catch (e) {
        console.error("Error deleting reply: ", e);
        throw e;
    }
};

export const updateCard = async (boardId: string, cardId: string, updates: string | Partial<RetroCard>) => {
    try {
        const cardRef = doc(db, `boards/${boardId}/cards`, cardId);
        // Handle both string (legacy) and object updates
        const data = typeof updates === 'string' ? { text: updates } : updates;
        await updateDoc(cardRef, data);
    } catch (e) {
        console.error("Error updating card: ", e);
        throw e;
    }
};

export const updateReply = async (boardId: string, cardId: string, replyId: string, newText: string) => {
    try {
        const cardRef = doc(db, `boards/${boardId}/cards`, cardId);
        await updateDoc(cardRef, {
            [`replies.${replyId}.text`]: newText
        });
    } catch (e) {
        console.error("Error updating reply: ", e);
        throw e;
    }
};

export const updateBoardName = async (boardId: string, newName: string) => {
    try {
        const boardRef = doc(db, "boards", boardId);
        await updateDoc(boardRef, {
            name: newName
        });
    } catch (e) {
        console.error("Error updating board name: ", e);
        throw e;
    }
};

export const updateBoardColumns = async (boardId: string, columns: RetroColumn[]) => {
    try {
        const boardRef = doc(db, "boards", boardId);
        await updateDoc(boardRef, {
            columns: columns
        });
    } catch (e) {
        console.error("Error updating board columns: ", e);
        throw e;
    }
};

export const updateBoardVisibility = async (boardId: string, isPublic: boolean) => {
    try {
        const boardRef = doc(db, "boards", boardId);
        await updateDoc(boardRef, {
            isPublic: isPublic
        });
    } catch (e) {
        console.error("Error updating board visibility: ", e);
        throw e;
    }
};

export const getBoardCards = async (boardId: string) => {
    try {
        const q = query(collection(db, `boards/${boardId}/cards`));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RetroCard));
    } catch (e) {
        console.error("Error fetching board cards: ", e);
        return [];
    }
};

// Hooks for Data Subscription
export const useUserBoards = (userId: string | undefined) => {
    const [boards, setBoards] = useState<RetroBoard[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setBoards([]);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, "boards"),
            where("createdBy", "==", userId),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setBoards(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RetroBoard)));
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    return { boards, loading };
};

export const useBoard = (boardId: string | undefined) => {
    const [board, setBoard] = useState<RetroBoard | null>(null);
    const [cards, setCards] = useState<RetroCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!boardId) return;

        const unsubscribeBoard = onSnapshot(doc(db, "boards", boardId), (doc) => {
            if (doc.exists()) {
                const data = doc.data() as RetroBoard;
                // Backfill missing column IDs for legacy boards
                if (data.columns) {
                    data.columns = data.columns.map(col => ({
                        ...col,
                        id: col.id || col.title.toLowerCase().replace(/\s+/g, '-')
                    }));
                }
                setBoard({ ...data });
            } else {
                setError("Board not found");
            }
            setLoading(false);
        }, (err) => {
            console.error("Error fetching board:", err);
            setError(err.message);
            setLoading(false);
        });

        const q = query(
            collection(db, `boards/${boardId}/cards`),
            orderBy("order", "asc"), // Order by 'order' field
            orderBy("createdAt", "asc") // Secondary sort
        );

        const unsubCards = onSnapshot(q, (snapshot) => {
            setCards(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RetroCard)));
            setLoading(false);
        });

        return () => {
            unsubscribeBoard();
            unsubCards();
        };
    }, [boardId]);

    return { board, cards, loading, error };
};


