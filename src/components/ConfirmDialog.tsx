import { useEffect } from 'react';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose?: () => void;
    onCancel?: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
}

const ConfirmDialog = ({ isOpen, onClose, onCancel, onConfirm, title, message, confirmText = 'OK', cancelText = 'Cancel', isDestructive: explicitDestructive }: ConfirmDialogProps) => {
    // Support both onClose and onCancel for backwards compatibility
    const handleCancel = onCancel || onClose;

    // Determine if this is a destructive action based on confirmText or title, or explicit prop
    const isDestructive = explicitDestructive ?? (confirmText.toLowerCase().includes('delete') || title.toLowerCase().includes('delete'));

    const confirmButtonClass = isDestructive
        ? 'px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold shadow-lg shadow-red-500/30 transition-all font-mono'
        : 'px-6 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-bold shadow-lg shadow-brand-500/30 transition-all font-mono';

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen && handleCancel) {
                handleCancel();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, handleCancel]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200" onClick={handleCancel}>
            <div
                className="bg-white dark:bg-dark-900 p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700 transform transition-all scale-100 relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500 to-purple-600"></div>

                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white font-mono">{title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">{message}</p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={handleCancel}
                        className="px-5 py-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors font-mono"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            if (handleCancel) handleCancel();
                        }}
                        className={confirmButtonClass}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
