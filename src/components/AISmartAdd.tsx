import React, { useState, useEffect, useRef } from 'react';
import { checkChromiumAIAvailability, classifyThought, type AIAvailability, type ClassificationResult } from '../utils/ai';
import type { RetroColumn } from '../types';
import { Sparkles, Send, Loader2, Download, AlertCircle, Mic, MicOff } from 'lucide-react';
import { useSnackbar } from '../context/SnackbarContext';
import { analytics, logEvent } from '../lib/firebase';

interface AISmartAddProps {
  boardId: string;
  columns: RetroColumn[];
  onAddCard: (columnId: string, text: string, isActionItem?: boolean) => Promise<void>;
  disabled?: boolean;
  autoFocus?: boolean;
}

const AISmartAdd: React.FC<AISmartAddProps> = ({ boardId, columns, onAddCard, disabled, autoFocus }) => {
  const [availability, setAvailability] = useState<AIAvailability>('unknown');
  const [text, setText] = useState('');
  const [isActionItem, setIsActionItem] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { showSnackbar } = useSnackbar();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check for browser support
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setHasSpeechSupport(true);
    }
  }, []);

  /* Ref refs to keep track of speech state across renders without causing re-renders themselves 
     until we are ready to update the UI */
  const finalTranscriptRef = useRef('');
  const interimTranscriptRef = useRef('');
  const initialTextRef = useRef('');

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        // Capture what was already in the input box so we can append to it
        initialTextRef.current = text;
        finalTranscriptRef.current = '';
        interimTranscriptRef.current = '';
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscriptChunk = '';

        // Iterate through the results starting from resultIndex
        // This is crucial for Android which sometimes returns the whole history again
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscriptChunk += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        // Update our accumulated final transcript
        finalTranscriptRef.current += finalTranscriptChunk;
        interimTranscriptRef.current = interimTranscript;

        // Construct the full text: Initial + Final (accumulated) + Interim (current)
        // Add a space before the new speech if the initial text didn't end with one and wasn't empty
        let prefix = initialTextRef.current;
        if (prefix && !prefix.endsWith(' ') && (finalTranscriptRef.current || interimTranscript)) {
             prefix += ' ';
        }

        const newText = prefix + finalTranscriptRef.current + interimTranscript;
        setText(newText);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        
        // If it's a 'no-speech' error, we might just want to stay listening or stop quietly
        // But for other errors, we should stop.
        if (event.error !== 'no-speech') {
             setIsListening(false);
        }

        if (event.error === 'network') {
            showSnackbar("Network error: Voice input requires an active internet connection.", "error");
        } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            showSnackbar("Microphone access denied. Please check your browser settings.", "error");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        // When it ends, perform one final update to ensure everything is "committed"
        // (Though usually onresult accounts for the last bit)
        
        // We could also re-start here if we wanted "always on" listening, 
        // but for a button press, stopping is correct.
      };

      recognition.start();
    } catch (error) {
      console.error("Speech recognition failed", error);
      setIsListening(false);
    }
  };

  // Simple keyword detection to suggest action item
  useEffect(() => {
    if (!text.trim() || isActionItem) return;
    const taskKeywords = ['fix', 'do', 'improve', 'must', 'should', 'action', 'task', 'implement', 'update', 'investigate'];
    const words = text.toLowerCase().split(/\s+/);
    const hasKeyword = words.some(word => taskKeywords.includes(word));
    
    if (hasKeyword) {
        // ...
    }
  }, [text, isActionItem]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
        // Small delay to ensure the animation/mount is complete
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    }
  }, [autoFocus]);

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
  const isCloudFallback = availability === 'no' || availability === 'unknown';

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmedText = text.trim();
    if (!trimmedText || isProcessing || disabled || isDownloading) return;

    setIsProcessing(true);
    setError(null);
    const startTime = Date.now();
    
    // Log submission
    logEvent(analytics, 'ai_smart_add_submit', { 
        board_id: boardId, 
        char_count: trimmedText.length 
    });

    try {
      const result: ClassificationResult = await classifyThought(trimmedText, columns);
      const { columnId, source } = result;

      if (columnId) {
        await onAddCard(columnId, trimmedText, isActionItem);
        
        // Show success notification
        const targetColumn = columns.find(c => c.id === columnId);
        if (targetColumn) {
            showSnackbar(`Card added to "${targetColumn.title}"`, "success");
        }
        
        // Log success
        logEvent(analytics, 'ai_smart_add_success', {
            board_id: boardId,
            source: source,
            is_action_item: isActionItem,
            latency_ms: Date.now() - startTime
        });

        setText('');
        setIsActionItem(false); // Reset after add
        inputRef.current?.focus();
      } else {
        const errorMsg = "AI couldn't figure out where to put this. Try adding it normally!";
        setError(errorMsg);
        showSnackbar("AI Classification failed. Please add the card manually.", "error");
        
        // Log error
        logEvent(analytics, 'ai_smart_add_error', {
            board_id: boardId,
            source: source,
            error: 'no_column_id'
        });
      }
    } catch (error: any) {
      console.error("Smart Add failed:", error);
      showSnackbar("An unexpected error occurred with AI Smart Add.", "error");

      // Log error
      logEvent(analytics, 'ai_smart_add_error', {
          board_id: boardId,
          source: 'unknown',
          error: error.message || 'unexpected_error'
      });
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
            placeholder={
                isDownloading 
                    ? "Downloading local AI model..." 
                    : isCloudFallback 
                        ? "Share your thoughts... Cloud AI will sort them!"
                        : "Share your thoughts... Local AI will sort them!"
            }
            className="flex-1 bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 py-3 px-2 text-base outline-none disabled:opacity-50 min-w-0"
          />

          
          {hasSpeechSupport && (
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2 transition-all duration-300 rounded-full flex-shrink-0 mr-1 ${
                isListening 
                  ? 'bg-red-100 text-red-600 animate-pulse ring-2 ring-red-400/50' 
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800'
              }`}
              title={isListening ? "Stop listening" : "Voice input"}
            >
              {isListening ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>
          )}

          <button
            type="submit"
            disabled={!text.trim() || isProcessing || disabled || isDownloading}
            className="flex items-center justify-center p-3 bg-brand-500 hover:bg-brand-600 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 text-white rounded-lg transition-all duration-300 shadow-lg shadow-brand-500/20 active:scale-95 flex-shrink-0"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        {error && (
            <div className="mt-3 flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-100 dark:border-red-900/30 animate-in slide-in-from-top-1 duration-200">
                <AlertCircle className="w-4 h-4" />
                <span className="text-[11px] font-medium">{error}</span>
            </div>
        )}
        
        <div className="mt-2 flex items-center justify-center gap-4 text-[10px] uppercase tracking-widest text-gray-400 font-medium">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isDownloading ? 'bg-orange-400 animate-bounce' : 'bg-brand-400 animate-pulse'}`}></span>
            {isDownloading 
                ? 'Local AI model is initializing (1.5GB) - Checking status...' 
                : isCloudFallback 
                    ? 'Gemini Cloud AI Powered Smart Entry' 
                    : 'Chromium Local AI Powered Smart Entry'}
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
