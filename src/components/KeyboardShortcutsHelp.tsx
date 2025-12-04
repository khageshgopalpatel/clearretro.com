interface KeyboardShortcutsHelpProps {
    isOpen: boolean;
    onClose: () => void;
}

const KeyboardShortcutsHelp = ({ isOpen, onClose }: KeyboardShortcutsHelpProps) => {
    if (!isOpen) return null;

    const shortcuts = [
        { key: 'ESC', description: 'Close any open modal or dialog' },
        { key: '?', description: 'Show this shortcuts help' },
        { key: 'Ctrl/Cmd + K', description: 'Focus search input' },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in" onClick={onClose}>
            <div
                className="bg-white p-6 border-4 border-black shadow-[8px_8px_0px_black] w-11/12 max-w-md animate-slide-in"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-xl font-black mb-4 uppercase">Keyboard Shortcuts</h3>

                <div className="space-y-3">
                    {shortcuts.map((shortcut, index) => (
                        <div key={index} className="flex justify-between items-center p-2 border-2 border-black">
                            <span className="font-mono text-sm font-bold bg-gray-100 px-2 py-1 border border-black">
                                {shortcut.key}
                            </span>
                            <span className="text-sm flex-1 ml-4">{shortcut.description}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex justify-end">
                    <button onClick={onClose} className="btn-secondary">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default KeyboardShortcutsHelp;
