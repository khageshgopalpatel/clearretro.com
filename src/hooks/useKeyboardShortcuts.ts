import { useEffect } from 'react';

interface UseKeyboardShortcutsProps {
    onShowHelp?: () => void;
    onCloseModals?: () => void;
    onNewCard?: () => void;
    onTogglePrivateMode?: () => void;
    onFocusMode?: () => void;
    onToggleTaskSidebar?: () => void;
    onToggleSort?: () => void;
    disabled?: boolean;
}

const useKeyboardShortcuts = ({ 
    onShowHelp, 
    onCloseModals, 
    onNewCard,
    onTogglePrivateMode,
    onFocusMode,
    onToggleTaskSidebar,
    onToggleSort,
    disabled = false
}: UseKeyboardShortcutsProps) => {
    useEffect(() => {
        if (disabled) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if user is typing in an input/textarea
            const target = document.activeElement as HTMLElement;
            const isTyping = ['INPUT', 'TEXTAREA'].includes(target?.tagName);
            const isContentEditable = target?.isContentEditable;

            // ESC - Close modals (works even when typing)
            if (e.key === 'Escape' && onCloseModals) {
                onCloseModals();
                return;
            }

            // Don't trigger other shortcuts while typing
            if (isTyping || isContentEditable) return;

            // ? - Show shortcuts help
            if (e.key === '?' && onShowHelp) {
                e.preventDefault();
                onShowHelp();
                return;
            }

            // N - New card (AI Smart Add)
            if (e.key === 'n' && onNewCard) {
                e.preventDefault();
                onNewCard();
                return;
            }

            // P - Toggle Private Mode
            if (e.key === 'p' && onTogglePrivateMode) {
                e.preventDefault();
                onTogglePrivateMode();
                return;
            }

            // F - Focus Mode
            if (e.key === 'f' && onFocusMode) {
                e.preventDefault();
                onFocusMode();
                return;
            }

            // T - Toggle Task Sidebar
            if (e.key === 't' && onToggleTaskSidebar) {
                e.preventDefault();
                onToggleTaskSidebar();
                return;
            }

            // / - Toggle Sort
            if (e.key === '/' && onToggleSort) {
                e.preventDefault();
                onToggleSort();
                return;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onShowHelp, onCloseModals, onNewCard, onTogglePrivateMode, onFocusMode, onToggleTaskSidebar, onToggleSort, disabled]);
};

export default useKeyboardShortcuts;
