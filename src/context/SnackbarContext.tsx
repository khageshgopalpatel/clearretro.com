import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface SnackbarItem {
    id: number;
    message: string;
    type: 'info' | 'success' | 'error' | 'warning';
}

interface SnackbarContextType {
    showSnackbar: (message: string, type?: 'info' | 'success' | 'error' | 'warning') => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = (): SnackbarContextType => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error('useSnackbar must be used within SnackbarProvider');
    }
    return context;
};

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
    const [snackbars, setSnackbars] = useState<SnackbarItem[]>([]);

    const showSnackbar = useCallback((message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
        const id = Date.now();
        setSnackbars(prev => [...prev, { id, message, type }]);

        setTimeout(() => {
            setSnackbars(prev => prev.filter(s => s.id !== id));
        }, 4000);
    }, []);

    const removeSnackbar = useCallback((id: number) => {
        setSnackbars(prev => prev.filter(s => s.id !== id));
    }, []);

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <div className="fixed top-24 right-4 z-[110] flex flex-col gap-2">
                {snackbars.map((snackbar, index) => (
                    <div
                        key={snackbar.id}
                        className={`px-4 py-3 rounded-lg shadow-xl font-medium text-sm animate-slideInRight flex items-center justify-between gap-4 min-w-[300px] border-l-4 backdrop-blur-sm hover-scale-sm transition-transform ${
                            snackbar.type === 'success' ? 'bg-white/95 dark:bg-gray-800/95 text-gray-800 dark:text-gray-100 border-green-500' :
                            snackbar.type === 'error' ? 'bg-white/95 dark:bg-gray-800/95 text-gray-800 dark:text-gray-100 border-red-500' :
                            snackbar.type === 'warning' ? 'bg-white/95 dark:bg-gray-800/95 text-gray-800 dark:text-gray-100 border-yellow-500' :
                            'bg-white/95 dark:bg-gray-800/95 text-gray-800 dark:text-gray-100 border-blue-500'
                        }`}
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-xl animate-popIn">
                                {snackbar.type === 'success' && '✅'}
                                {snackbar.type === 'error' && '🚨'}
                                {snackbar.type === 'warning' && '⚠️'}
                                {snackbar.type === 'info' && 'ℹ️'}
                            </span>
                            <span>{snackbar.message}</span>
                        </div>
                        <button
                            onClick={() => removeSnackbar(snackbar.id)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-bold px-2 hover:scale-110 transition-transform"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </SnackbarContext.Provider>
    );
};
