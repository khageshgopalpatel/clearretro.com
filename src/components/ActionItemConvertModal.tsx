import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ActionItemConvertModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (
        newText: string, 
        assignee: { id?: string, name: string } | null, 
        updates: { priority?: 'high' | 'medium' | 'low'; dueDate?: string; status?: 'todo' | 'in_progress' | 'done'; description?: string; isDone: boolean }
    ) => void;
    initialText: string;
    initialAssigneeId?: string;
    initialAssigneeName?: string;
    initialIsDone?: boolean;
    initialPriority?: 'high' | 'medium' | 'low';
    initialDueDate?: string;
    initialStatus?: 'todo' | 'in_progress' | 'done';
    initialDescription?: string;
    users?: { id: string; displayName: string }[];
}

const ActionItemConvertModal = ({ 
    isOpen, onClose, onConfirm, 
    initialText, initialAssigneeId = '', initialAssigneeName = '', initialIsDone = false,
    initialPriority = 'medium', initialDueDate = '', initialStatus = 'todo', initialDescription = '',
    users = [] 
}: ActionItemConvertModalProps) => {
    const [text, setText] = useState(initialText);
    const [assigneeId, setAssigneeId] = useState<string>(initialAssigneeId);
    const [customAssigneeName, setCustomAssigneeName] = useState('');
    
    // New Fields
    const [priority, setPriority] = useState<'high' | 'medium' | 'low'>(initialPriority);
    const [dueDate, setDueDate] = useState(initialDueDate);
    const [status, setStatus] = useState<'todo' | 'in_progress' | 'done'>(initialStatus || (initialIsDone ? 'done' : 'todo'));
    const [description, setDescription] = useState(initialDescription);

    const titleRef = useRef<HTMLInputElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setText(initialText);
            
            // Assignee Logic: Check if ID is manual or if we have a name but ID isn't in users
            const isManualId = initialAssigneeId && (initialAssigneeId.startsWith('manual-') || !users.find(u => u.id === initialAssigneeId));
            
            if (isManualId) {
                setAssigneeId('manual');
                setCustomAssigneeName(initialAssigneeName || '');
            } else {
                setAssigneeId(initialAssigneeId || '');
                setCustomAssigneeName('');
            }

            setPriority(initialPriority || 'medium');
            setDueDate(initialDueDate || '');
            setStatus(initialStatus || (initialIsDone ? 'done' : 'todo'));
            setDescription(initialDescription || '');
            
            setTimeout(() => {
                if (titleRef.current) {
                    titleRef.current.focus();
                }
            }, 100);
        }
    }, [isOpen, initialText, initialAssigneeId, initialAssigneeName, initialIsDone, initialPriority, initialDueDate, initialStatus, initialDescription, users]);

    const handleConfirm = () => {
        if (text.trim()) {
            let assignee = null;
            if (assigneeId === 'manual') {
                if (customAssigneeName.trim()) {
                    assignee = { name: customAssigneeName.trim() };
                }
            } else if (assigneeId) {
                const user = users.find(u => u.id === assigneeId);
                if (user) {
                    assignee = { id: user.id, name: user.displayName };
                }
            }
            onConfirm(text, assignee, { 
                priority, 
                dueDate, 
                status, 
                description,
                isDone: status === 'done' // Sync legacy boolean
            });
        }
    };

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="bg-white dark:bg-dark-900 p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700 transform transition-all scale-100 relative overflow-hidden flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

                <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-mono">Action Item</h3>
                    <p className="text-gray-500 text-sm">Define ownership and success criteria.</p>
                </div>

                <div className="space-y-5 overflow-y-auto custom-scrollbar pr-2 -mr-2">
                    {/* Title */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 font-mono">Title</label>
                        <input
                            ref={titleRef}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-base font-medium"
                            placeholder="To do..."
                        />
                    </div>

                    {/* Meta Row: Priority & Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 font-mono">Priority</label>
                            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                                {(['low', 'medium', 'high'] as const).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPriority(p)}
                                        className={`flex-1 capitalize text-xs font-bold py-1.5 rounded-md transition-all ${
                                            priority === p 
                                            ? p === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 shadow-sm' 
                                              : p === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300 shadow-sm'
                                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                        }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 font-mono">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as any)}
                                className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none"
                            >
                                <option value="todo">To Do</option>
                                <option value="in_progress">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                        </div>
                    </div>

                    {/* Meta Row: Due Date & Assignee */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 font-mono">Due Date</label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 font-mono">Assignee</label>
                            <select
                                value={assigneeId}
                                onChange={(e) => setAssigneeId(e.target.value)}
                                className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none"
                            >
                                <option value="">Unassigned</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>{user.displayName}</option>
                                ))}
                                <option value="manual">+ Enter Manually...</option>
                            </select>
                        </div>
                    </div>

                    {assigneeId === 'manual' && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                             <input
                                type="text"
                                value={customAssigneeName}
                                onChange={(e) => setCustomAssigneeName(e.target.value)}
                                placeholder="Enter assignee name..."
                                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                        </div>
                    )}

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 font-mono">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-y shadow-inner text-sm min-h-[80px]"
                            rows={3}
                            placeholder="Add details, acceptance criteria, or notes..."
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 mt-auto">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors font-mono uppercase text-xs tracking-wider"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-lg shadow-blue-500/30 transition-all font-mono text-sm"
                    >
                        Save Action Item
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ActionItemConvertModal;
