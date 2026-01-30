import { useEffect } from 'react';
import { createPortal } from 'react-dom';

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

    return createPortal(
        <div className="fixed inset-0 z-[110] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-md p-0 md:p-4 animate-fadeIn" onClick={handleCancel}>
            <div
                className="bg-white dark:bg-dark-900 p-6 md:p-8 rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-md border border-gray-200 dark:border-gray-700 transform transition-all relative overflow-hidden bottom-sheet md:animate-bounceIn safe-bottom"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Mobile Handle */}
                <div className="md:hidden bottom-sheet-handle"></div>
                
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500 to-purple-600"></div>

                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white font-mono">{title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed text-mobile-base md:text-base">{message}</p>

                <div className="flex flex-col-reverse md:flex-row justify-end gap-3">
                    <button
                        onClick={handleCancel}
                        className="flex-1 md:flex-initial px-5 py-3 md:py-2.5 min-h-[44px] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors font-mono click-scale tap-feedback"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            if (handleCancel) handleCancel();
                        }}
                        className={`flex-1 md:flex-initial min-h-[44px] py-3 md:py-2.5 ${confirmButtonClass} btn-animated tap-feedback`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmDialog;
