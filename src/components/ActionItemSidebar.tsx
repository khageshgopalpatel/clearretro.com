import React, { useState } from 'react';
import type { RetroCard } from '../types';
import { CheckCircle2, Circle, Clock, ChevronRight, X, ListTodo, AlertCircle } from 'lucide-react';

interface ActionItemSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    items: RetroCard[];
}

const ActionItemSidebar: React.FC<ActionItemSidebarProps> = ({ isOpen, onClose, items }) => {
    const actionItems = items.filter(item => item.isActionItem);
    const [filter, setFilter] = useState<'all' | 'todo' | 'in_progress' | 'done'>('all');

    const filteredItems = actionItems.filter(item => {
        if (filter === 'all') return true;
        if (filter === 'todo') return item.status === 'todo' || (!item.status && !item.isDone);
        if (filter === 'in_progress') return item.status === 'in_progress';
        if (filter === 'done') return item.status === 'done' || item.isDone;
        return true;
    });

    const getPriorityColor = (priority?: string) => {
        switch (priority) {
            case 'high': return 'text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
            case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
            default: return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
        }
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[110] transition-opacity animate-in fade-in duration-300"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-dark-900 shadow-2xl z-[120] transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col border-l border-gray-200 dark:border-gray-800 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-black/20">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <ListTodo className="w-5 h-5 text-brand-500" />
                            Action Items
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-bold">
                            {actionItems.length} Tasks Identified
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Filters */}
                <div className="px-6 py-4 flex gap-2 overflow-x-auto no-scrollbar border-b border-gray-50 dark:border-gray-800/50">
                    {(['all', 'todo', 'in_progress', 'done'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wider transition-all whitespace-nowrap border ${filter === f 
                                ? 'bg-brand-500 text-white border-brand-500 shadow-lg shadow-brand-500/20' 
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 border-transparent hover:border-gray-300'}`}
                        >
                            {f.replace('_', ' ')}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {filteredItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-50 grayscale py-20 px-10">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                <AlertCircle className="w-8 h-8 text-gray-400" />
                            </div>
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">No tasks found</h4>
                            <p className="text-xs text-gray-500">
                                {filter === 'all' 
                                    ? "Transform thoughts into action items to see them here." 
                                    : `No tasks currently in "${filter.replace('_', ' ')}" status.`}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredItems.map(item => (
                                <div 
                                    key={item.id}
                                    className="group bg-white dark:bg-dark-950 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-brand-400/50 transition-all hover:shadow-lg relative overflow-hidden"
                                >
                                    {/* Priority Indicator */}
                                    <div className={`absolute top-0 left-0 bottom-0 w-1 ${item.priority === 'high' ? 'bg-red-500' : item.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                                    
                                    <h4 className={`text-sm font-bold text-gray-900 dark:text-white leading-snug mb-2 pr-6 ${item.status === 'done' || item.isDone ? 'line-through opacity-50' : ''}`}>
                                        {item.text}
                                    </h4>

                                    <div className="flex flex-wrap items-center gap-2">
                                        {/* Status Badge */}
                                        <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                                            (item.status === 'done' || item.isDone) 
                                                ? 'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                                                : item.status === 'in_progress'
                                                    ? 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800'
                                                    : 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                                        }`}>
                                            {(item.status === 'done' || item.isDone) ? <CheckCircle2 className="w-3 h-3" /> : (item.status === 'in_progress' ? <Clock className="w-3 h-3" /> : <Circle className="w-3 h-3" />)}
                                            {item.status === 'in_progress' ? 'In Progress' : (item.status === 'done' || item.isDone ? 'Done' : 'To Do')}
                                        </div>

                                        {/* Assignee */}
                                        {item.assigneeName && (
                                            <div className="text-[10px] font-medium text-gray-500 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-700">
                                                👤 {item.assigneeName}
                                            </div>
                                        )}

                                        {/* Due Date */}
                                        {item.dueDate && (
                                            <div className="text-[10px] font-medium text-gray-500 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-700">
                                                📅 {new Date(item.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 dark:bg-black/20 border-t border-gray-100 dark:border-gray-800">
                    <button 
                        onClick={onClose}
                        className="w-full py-3 bg-white dark:bg-dark-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-dark-800 transition-all active:scale-[0.98] shadow-sm font-mono"
                    >
                        Back to Board
                    </button>
                </div>
            </div>
        </>
    );
};

export default ActionItemSidebar;
