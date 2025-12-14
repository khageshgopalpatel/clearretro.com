import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface Log {
    id: string;
    text: string;
    createdAt: any;
    createdBy: string;
    creatorName: string;
}

interface ActionItemLogsModalProps {
    isOpen: boolean;
    onClose: () => void;
    logs: Log[];
    onAddLog: (text: string) => void;
    cardText: string;
}

const ActionItemLogsModal = ({ isOpen, onClose, logs, onAddLog, cardText }: ActionItemLogsModalProps) => {
    const [newLogText, setNewLogText] = useState('');
    const [mounted, setMounted] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (isOpen && bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isOpen, logs]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newLogText.trim()) {
            onAddLog(newLogText);
            setNewLogText('');
        }
    };

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="bg-white dark:bg-dark-900 rounded-3xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700 flex flex-col max-h-[80vh] relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-black/20">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white font-mono mb-1">Action Item Logs</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate font-medium">
                        {cardText}
                    </p>
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Logs List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-white dark:bg-dark-900">
                    {logs.length === 0 ? (
                        <div className="text-center text-gray-400 dark:text-gray-600 py-8 italic text-sm">
                            No logs yet. Add one below to track progress.
                        </div>
                    ) : (
                        logs.map(log => (
                            <div key={log.id} className="relative pl-6 pb-2 border-l-2 border-gray-200 dark:border-gray-800 last:border-0 last:pb-0">
                                <div className="absolute top-0 left-[-5px] w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white dark:ring-dark-900"></div>
                                <div className="text-xs text-gray-400 font-mono mb-1">
                                    {new Date(log.createdAt).toLocaleString()} • <span className="text-gray-600 dark:text-gray-300 font-bold">{log.creatorName}</span>
                                </div>
                                <div className="bg-gray-50 dark:bg-dark-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-200 leading-relaxed shadow-sm">
                                    {log.text}
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={bottomRef}></div>
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-950">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={newLogText}
                            onChange={(e) => setNewLogText(e.target.value)}
                            placeholder="Enter a log entry (e.g. Discussed with team)..."
                            className="flex-1 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={!newLogText.trim()}
                            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/20"
                        >
                            Add
                        </button>
                    </form>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ActionItemLogsModal;
