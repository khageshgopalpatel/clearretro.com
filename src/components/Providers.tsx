import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { SnackbarProvider } from '../context/SnackbarContext';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <AuthProvider>
            <SnackbarProvider>
                {children}
            </SnackbarProvider>
        </AuthProvider>
    );
};
