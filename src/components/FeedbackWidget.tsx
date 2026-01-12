import React, { useState } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const FeedbackWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [sent, setSent] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
        if (!isOpen) { 
            // Reset state when opening
            setSent(false); 
            setFeedback(''); 
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!feedback.trim()) return;

        setIsSending(true);
        try {
            const user = auth.currentUser;
            await addDoc(collection(db, 'feedback'), {
                message: feedback,
                url: window.location.href,
                userAgent: navigator.userAgent,
                userId: user ? user.uid : 'anonymous',
                userEmail: user ? user.email : 'anonymous',
                createdAt: serverTimestamp(),
            });
            setSent(true);
            setFeedback('');
            setTimeout(() => {
                setIsOpen(false);
                setSent(false);
            }, 2000);
        } catch (error) {
            console.error("Error sending feedback: ", error);
            alert("Failed to send feedback. Please try again.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] print:hidden">
            {isOpen ? (
                <div className="bg-white dark:bg-dark-800 rounded-lg shadow-2xl w-80 sm:w-96 ring-1 ring-gray-200 dark:ring-gray-700 overflow-hidden transform transition-all duration-200 ease-out animate-in slide-in-from-bottom-5">
                    <div className="p-4 bg-gray-50 dark:bg-dark-900 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">Send Feedback</h3>
                        <button 
                            onClick={toggleOpen}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    <div className="p-4">
                        {sent ? (
                            <div className="text-center py-8">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-3">
                                    <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Thanks for your feedback!</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">We appreciate your input.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="feedback" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                                        How can we improve?
                                    </label>
                                    <textarea
                                        id="feedback"
                                        rows={4}
                                        className="w-full px-3 py-2 text-sm text-gray-900 dark:text-white bg-white dark:bg-dark-900 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all resize-none placeholder-gray-400 dark:placeholder-gray-600"
                                        placeholder="Tell us what you love or what needs fixing..."
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={toggleOpen}
                                        className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-transparent border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSending || !feedback.trim()}
                                        className={`px-3 py-2 text-sm font-medium text-white bg-brand-600 rounded-md hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center ${isSending ? 'pl-2' : ''}`}
                                    >
                                        {isSending && (
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        )}
                                        {isSending ? 'Sending...' : 'Send Feedback'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            ) : (
                <button
                    onClick={toggleOpen}
                    className="group flex items-center space-x-2 bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-200 hover:text-brand-600 dark:hover:text-brand-400 px-4 py-3 rounded-full shadow-lg hover:shadow-xl ring-1 ring-gray-200 dark:ring-gray-700 transition-all duration-300 relative"
                >
                     <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-500"></span>
                    </span>
                    <span className="bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 p-1.5 rounded-full group-hover:scale-110 transition-transform duration-300 group-hover:rotate-12">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                    </span>
                    <span className="font-semibold text-sm pr-1">Feedback</span>
                </button>
            )}
        </div>
    );
};

export default FeedbackWidget;
