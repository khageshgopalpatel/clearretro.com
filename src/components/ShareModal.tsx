import { useState } from 'react';
import { useSnackbar } from '../context/SnackbarContext';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    boardId: string;
    boardName: string;
    isPublic: boolean;
    onTogglePublic: () => void;
}

const ShareModal = ({ isOpen, onClose, boardId, boardName, isPublic, onTogglePublic }: ShareModalProps) => {
    const { showSnackbar } = useSnackbar();
    const shareUrl = `${window.location.origin}/board/${boardId}`;

    const handleCopyLink = async () => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(shareUrl);
            } else {
                // Fallback for non-secure contexts
                const textArea = document.createElement("textarea");
                textArea.value = shareUrl;
                textArea.style.position = "fixed";
                textArea.style.left = "-9999px";
                textArea.style.top = "0";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    document.execCommand('copy');
                } catch (err) {
                    console.error('Fallback: Oops, unable to copy', err);
                    throw new Error('Failed to copy');
                }
                document.body.removeChild(textArea);
            }
            showSnackbar('Link copied to clipboard!', 'success');
        } catch (error) {
            console.error('Copy failed', error);
            showSnackbar('Failed to copy link', 'error');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in" onClick={onClose}>
            <div
                className="bg-white dark:bg-gray-800 p-6 border-4 border-black dark:border-gray-500 shadow-[8px_8px_0px_black] dark:shadow-[8px_8px_0px_gray] w-11/12 max-w-md animate-slide-in"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-xl font-black mb-4 uppercase text-black dark:text-white">Share Board</h3>
                <p className="text-sm mb-4 text-gray-700 dark:text-gray-300">Share "{boardName}" with your team</p>

                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2 text-black dark:text-white">Shareable Link</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={shareUrl}
                            readOnly
                            className="flex-1 p-2 font-mono border-2 border-black dark:border-gray-500 text-sm bg-gray-50 dark:bg-gray-700 text-black dark:text-white"
                        />
                        <button
                            onClick={handleCopyLink}
                            className="btn-primary text-sm px-4"
                        >
                            Copy
                        </button>
                    </div>
                </div>

                <div className="mb-6 flex items-center justify-between p-3 border-2 border-black dark:border-gray-500 bg-gray-50 dark:bg-gray-700">
                    <div>
                        <p className="font-bold text-sm text-black dark:text-white">Public Access</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Anyone with the link can view</p>
                    </div>
                    <button
                        onClick={onTogglePublic}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isPublic ? 'bg-green-600' : 'bg-gray-300'
                            } border-2 border-black dark:border-gray-500`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white border border-black dark:border-gray-500 transition-transform ${isPublic ? 'translate-x-6' : 'translate-x-1'
                                }`}
                        />
                    </button>
                </div>

                <div className="flex justify-end">
                    <button onClick={onClose} className="btn-secondary">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
