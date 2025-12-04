import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, serverTimestamp, collection, query, where, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface PresenceUser {
    id: string;
    displayName: string;
    photoURL: string | null;
    lastSeen: any;
    state: 'online';
}

export const usePresence = (boardId: string | undefined, user: any) => {
    const [activeUsers, setActiveUsers] = useState<PresenceUser[]>([]);

    // 1. Update my presence
    useEffect(() => {
        if (!boardId || !user) return;

        const userPresenceRef = doc(db, `boards/${boardId}/presence`, user.uid);

        const updatePresence = async () => {
            try {
                await setDoc(userPresenceRef, {
                    displayName: user.displayName || 'Anonymous',
                    photoURL: user.photoURL || null,
                    lastSeen: serverTimestamp(),
                    state: 'online'
                }, { merge: true });
            } catch (err) {
                console.error("Error updating presence:", err);
            }
        };

        // Initial update
        updatePresence();

        // Periodic heartbeat (every 30s)
        const interval = setInterval(updatePresence, 30000);

        // Cleanup on unmount (set offline or delete)
        // Note: Firestore doesn't support onDisconnect like RTDB, so we rely on timeouts
        // but we can try to delete on clean exit.
        return () => {
            clearInterval(interval);
            deleteDoc(userPresenceRef).catch(console.error);
        };
    }, [boardId, user]);

    // 2. Listen to other users
    useEffect(() => {
        if (!boardId) return;

        const q = query(collection(db, `boards/${boardId}/presence`));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const now = Date.now();
            const users: PresenceUser[] = [];

            snapshot.forEach((doc) => {
                const data = doc.data();
                // Filter out stale users (inactive for > 2 mins)
                // Firestore timestamps need to be converted
                const lastSeen = data.lastSeen?.toMillis?.() || 0;
                if (now - lastSeen < 120000) { // 2 minutes tolerance
                    users.push({ id: doc.id, ...data } as PresenceUser);
                }
            });

            setActiveUsers(users);
        });

        return () => unsubscribe();
    }, [boardId]);

    return activeUsers;
};

export const useTyping = (boardId: string | undefined) => {
    const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({});

    useEffect(() => {
        if (!boardId) return;

        const q = query(collection(db, `boards/${boardId}/typing`));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const now = Date.now();
            const typing: Record<string, string[]> = {};

            snapshot.forEach((doc) => {
                const data = doc.data();
                // Filter out stale typing (older than 5 seconds)
                if (now - data.timestamp?.toMillis?.() < 5000) {
                    if (!typing[data.columnId]) typing[data.columnId] = [];
                    typing[data.columnId].push(data.displayName);
                }
            });
            setTypingUsers(typing);
        });

        return () => unsubscribe();
    }, [boardId]);

    return typingUsers;
};

export const setTypingStatus = async (boardId: string, user: any, columnId: string, isTyping: boolean) => {
    if (!boardId || !user) return;
    const typingRef = doc(db, `boards/${boardId}/typing`, user.uid);

    if (isTyping) {
        await setDoc(typingRef, {
            displayName: user.displayName || 'Anonymous',
            columnId,
            timestamp: serverTimestamp()
        });
    } else {
        await deleteDoc(typingRef);
    }
};
