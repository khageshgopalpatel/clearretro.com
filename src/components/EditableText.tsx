import { useState, useEffect, useRef } from 'react';

interface EditableTextProps {
    value: string;
    onSave: (val: string) => void;
    onCancel?: () => void;
    placeholder?: string;
    multiline?: boolean;
    className?: string;
}

const EditableText = ({ value, onSave, onCancel, placeholder = "Enter text...", multiline = false, className = "" }: EditableTextProps) => {
    const [editValue, setEditValue] = useState(value);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        setEditValue(value);
    }, [value]);

    useEffect(() => {
        if (multiline && textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [editValue, multiline]);

    const handleSave = () => {
        if (editValue.trim() && editValue !== value) {
            onSave(editValue.trim());
        } else if (onCancel) {
            onCancel();
        }
    };

    const handleCancel = () => {
        setEditValue(value);
        if (onCancel) {
            onCancel();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!multiline && e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        }
        if (e.key === 'Escape') {
            handleCancel();
        }
    };

    return (
        <div className={`flex flex-col gap-2 w-full ${className}`}>
            {multiline ? (
                <textarea
                    ref={textareaRef}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm resize-none overflow-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all shadow-sm"
                    rows={1}
                    autoFocus
                />
            ) : (
                <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all shadow-sm"
                    autoFocus
                />
            )}
            <div className="flex gap-2 justify-end">
                <button
                    onClick={handleCancel}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    className="px-3 py-1.5 text-xs font-bold bg-brand-700 text-white hover:bg-brand-800 rounded-lg shadow-sm shadow-brand-500/30 transition-all hover:-translate-y-0.5"
                >
                    Save
                </button>
            </div>
        </div>
    );
};

export default EditableText;
