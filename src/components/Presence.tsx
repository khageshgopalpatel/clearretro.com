import { usePresence } from '../hooks/usePresence';

interface User {
    uid: string;
    [key: string]: any;
}

interface PresenceProps {
    boardId: string;
    currentUser: User | null;
}

const Presence = ({ boardId, currentUser }: PresenceProps) => {
    const activeUsers = usePresence(boardId, currentUser);

    // Filter out current user - only show other people
    const otherUsers = activeUsers.filter(user => user.id !== currentUser?.uid);

    return (
        <div className="flex items-center -space-x-2 overflow-hidden">
            {otherUsers.map((user) => (
                <div
                    key={user.id}
                    className="relative inline-block border-2 border-white rounded-full"
                    title={user.displayName}
                >
                    {user.photoURL ? (
                        <img
                            src={user.photoURL}
                            alt={user.displayName}
                            className="h-8 w-8 rounded-full object-cover"
                        />
                    ) : (
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                            {user.displayName?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                    )}
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white" />
                </div>
            ))}
        </div>
    );
};

export default Presence;
