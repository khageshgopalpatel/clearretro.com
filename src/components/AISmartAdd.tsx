import React, { useState, useEffect, useRef } from 'react';
import { checkChromiumAIAvailability, classifyThought, type AIAvailability } from '../utils/ai';
import type { RetroColumn } from '../types';
import { Sparkles, Send, Loader2, Download } from 'lucide-react';

interface AISmartAddProps {
  columns: RetroColumn[];
  onAddCard: (columnId: string, text: string) => Promise<void>;
  disabled?: boolean;
}

const AISmartAdd: React.FC<AISmartAddProps> = ({ columns, onAddCard, disabled }) => {
  const [availability, setAvailability] = useState<AIAvailability>('unknown');
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const check = async () => {
      const status = await checkChromiumAIAvailability();
      setAvailability(status);
      
      // If it's still downloading, check again in 5 seconds
      const pending = status === 'downloadable' || status === 'after-download' || status === 'downloading';
      if (pending) {
        if (!interval) {
          interval = setInterval(check, 5000);
        }
      } else if (interval) {
        clearInterval(interval);
      }
    };

    check();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const isAvailable = availability === 'readily' || availability === 'after-download' || availability === 'downloadable' || availability === 'downloading';
  const isDownloading = availability === 'after-download' || availability === 'downloadable' || availability === 'downloading';

  if (!isAvailable && availability !== 'unknown') return null;

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmedText = text.trim();
    if (!trimmedText || isProcessing || disabled || isDownloading) return;

    setIsProcessing(true);
    try {
      const columnId = await classifyThought(trimmedText, columns);
      if (columnId) {
        await onAddCard(columnId, trimmedText);
        setText('');
        inputRef.current?.focus();
      }
    } catch (error) {
      console.error("Smart Add failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full animate-fadeIn">
      <form 
        onSubmit={handleSubmit}
        className="relative group transition-all duration-300"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-brand-400 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-focus-within:opacity-50"></div>
        
        <div className="relative bg-white dark:bg-dark-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden flex items-center p-1.5 focus-within:border-brand-400/50 transition-colors">
          <div className="pl-4 pr-2 text-brand-500">
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isDownloading ? (
                <Download className="w-5 h-5 animate-bounce text-orange-400" />
            ) : (
              <Sparkles className="w-5 h-5 animate-pulse text-brand-400" />
            )}
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isProcessing || disabled || isDownloading}
            placeholder={isDownloading ? "Downloading AI Model... Please wait" : "Share your thoughts... AI will find the right column"}
            className="flex-1 bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 py-3 px-2 text-base outline-none disabled:opacity-50"
          />
          
          <button
            type="submit"
            disabled={!text.trim() || isProcessing || disabled || isDownloading}
            className="flex items-center justify-center p-3 bg-brand-500 hover:bg-brand-600 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 text-white rounded-lg transition-all duration-300 shadow-lg shadow-brand-500/20 active:scale-95"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        
        <div className="mt-2 flex items-center justify-center gap-4 text-[10px] uppercase tracking-widest text-gray-400 font-medium">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isDownloading ? 'bg-orange-400 animate-bounce' : 'bg-brand-400 animate-pulse'}`}></span>
            {isDownloading ? 'AI Model is initializing (1.5GB) - Checking status...' : 'Chromium AI Powered Smart Entry'}
          </div>
          {isDownloading && (
            <button 
              type="button"
              onClick={async (e) => {
                e.stopPropagation();
                const status = await checkChromiumAIAvailability();
                setAvailability(status);
              }}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors border border-gray-200 dark:border-gray-700 cursor-pointer"
            >
              Check Now
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AISmartAdd;
