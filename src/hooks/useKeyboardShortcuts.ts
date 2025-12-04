import { useEffect } from 'react';

interface UseKeyboardShortcutsProps {
    onShowHelp?: () => void;
    onCloseModals?: () => void;
    onFocusSearch?: () => void;
}

const useKeyboardShortcuts = ({ onShowHelp, onCloseModals, onFocusSearch }: UseKeyboardShortcutsProps) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if user is typing in an input/textarea
            const target = document.activeElement as HTMLElement;
            const isTyping = ['INPUT', 'TEXTAREA'].includes(target?.tagName);

            // ESC - Close modals (works even when typing)
            if (e.key === 'Escape' && onCloseModals) {
                onCloseModals();
                return;
            }

            // Don't trigger other shortcuts while typing
            if (isTyping) return;

            // ? - Show shortcuts help
            if (e.key === '?' && onShowHelp) {
                e.preventDefault();
                onShowHelp();
            }

            // Ctrl/Cmd + K - Focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k' && onFocusSearch) {
                e.preventDefault();
                onFocusSearch();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onShowHelp, onCloseModals, onFocusSearch]);
};

export default useKeyboardShortcuts;
