import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const BoardNotFound: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#050505] p-4 font-sans">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        
        {/* Illusration / Icon */}
        <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
             <div className="absolute inset-0 bg-brand-400/20 dark:bg-brand-500/10 rounded-full blur-2xl animate-pulse"></div>
            <div className="text-8xl select-none grayscale opacity-30 dark:opacity-20 transform hover:scale-110 transition-transform duration-500">
               👻
            </div>
            {/* Overlay 404 text for style */}
            <div className="absolute -bottom-2 -right-2 bg-white dark:bg-dark-800 text-xs font-bold px-2 py-1 rounded-md border border-gray-100 dark:border-gray-700 shadow-sm text-gray-500 dark:text-gray-400">
                404
            </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Board Not Found
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
            The board you are looking for might have been deleted, or the link is incorrect.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <a
            href="/"
            className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-dark-800 text-gray-700 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-all font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2 group"
          >
            <svg 
                className="w-4 h-4 transition-transform group-hover:-translate-x-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go Home
          </a>

          {user && (
            <a
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-3 bg-brand-600 dark:bg-brand-600 text-white rounded-xl hover:bg-brand-700 dark:hover:bg-brand-500 transition-all font-medium shadow-lg hover:shadow-brand-500/25 flex items-center justify-center gap-2"
            >
              Create New Board
              <svg 
                className="w-4 h-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </a>
          )}
        </div>
        
        <div className="pt-8 text-xs text-gray-400 dark:text-gray-600 font-mono">
            Error Code: BOARD_NULL
        </div>

      </div>
    </div>
  );
};

export default BoardNotFound;
