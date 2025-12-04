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
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {snackbars.map(snackbar => (
                    <div
                        key={snackbar.id}
                        className={`px-4 py-3 border-2 border-black shadow-neo font-mono text-sm animate-slide-in ${snackbar.type === 'success' ? 'bg-green-300' :
                            snackbar.type === 'error' ? 'bg-red-300' :
                                snackbar.type === 'warning' ? 'bg-yellow-300' :
                                    'bg-blue-300'
                            }`}
                    >
                        <div className="flex items-center justify-between gap-4">
                            <span>{snackbar.message}</span>
                            <button
                                onClick={() => removeSnackbar(snackbar.id)}
                                className="text-black hover:text-gray-700 font-bold"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </SnackbarContext.Provider>
    );
};
