interface KeyboardShortcutsHelpProps {
    isOpen: boolean;
    onClose: () => void;
}

const KeyboardShortcutsHelp = ({ isOpen, onClose }: KeyboardShortcutsHelpProps) => {
    if (!isOpen) return null;

    const shortcuts = [
        { key: '?', description: 'Show this shortcuts help' },
        { key: 'ESC', description: 'Close any open modal or dialog' },
        { key: 'N', description: 'Open AI Smart Add to create new card' },
        { key: 'P', description: 'Toggle Private Mode' },
        { key: 'F', description: 'Enter Focus Mode' },
        { key: 'T', description: 'Open/Close Task Sidebar' },
        { key: '/', description: 'Toggle sort by votes/date' },
    ];

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50 animate-in fade-in duration-200" 
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-dark-900 rounded-2xl shadow-2xl w-11/12 max-w-md border border-gray-200 dark:border-gray-700 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-900/20 dark:to-purple-900/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-600 dark:text-brand-400">
                                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                                    <path d="M6 8h.001"/>
                                    <path d="M10 8h.001"/>
                                    <path d="M14 8h.001"/>
                                    <path d="M18 8h.001"/>
                                    <path d="M8 12h.001"/>
                                    <path d="M12 12h.001"/>
                                    <path d="M16 12h.001"/>
                                    <path d="M7 16h10"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white font-mono">Keyboard Shortcuts</h3>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-500 hover:text-gray-900 dark:hover:text-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Shortcuts List */}
                <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
                    {shortcuts.map((shortcut, index) => (
                        <div 
                            key={index} 
                            className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 hover:border-brand-200 dark:hover:border-brand-800 transition-colors"
                        >
                            <span className="font-mono text-sm font-bold bg-white dark:bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 shadow-sm">
                                {shortcut.key}
                            </span>
                            <span className="text-sm flex-1 ml-4 text-gray-600 dark:text-gray-400">{shortcut.description}</span>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                    <p className="text-xs text-center text-gray-400 dark:text-gray-500 font-mono">
                        Press <span className="font-bold">?</span> anytime to open this help
                    </p>
                </div>
            </div>
        </div>
    );
};

export default KeyboardShortcutsHelp;
