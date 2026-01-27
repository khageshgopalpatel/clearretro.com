import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { onAuthStateChanged, signOut, getRedirectResult, signInWithPopup, signInAnonymously, type User as FirebaseUser } from 'firebase/auth';
import { auth, provider } from '../lib/firebase';

interface User {
    uid: string;
    displayName: string | null;
    email: string | null;
    isAnonymous: boolean;
    photoURL?: string | null;
}

const EXCLUDED_EMAILS = ['clearretroo@gmail.com'];

interface AuthContextType {
    user: User | null;
    loading: boolean;
    loginAsGuest: () => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);


    useEffect(() => {
        // Handle redirect result explicitly to ensure state clears
        getRedirectResult(auth).then((result) => {
            if (result?.user) {
                console.log("Redirect login successful:", result.user);
                // User state will be updated by onAuthStateChanged, but we can log it here
            }
        }).catch((error) => {
            console.error("Redirect result error:", error);
            setAuthError(error.message);
        });

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log("Auth state changed:", currentUser ? "User logged in" : "No user");
            setAuthError(null); // Clear any previous error on successful state change
            if (currentUser) {
                const userObj = {
                    uid: currentUser.uid,
                    displayName: currentUser.displayName,
                    email: currentUser.email,
                    isAnonymous: currentUser.isAnonymous,
                    photoURL: currentUser.photoURL
                };
                setUser(userObj);

                // Handle analytics exclusion
                if (userObj.email && EXCLUDED_EMAILS.includes(userObj.email)) {
                    localStorage.setItem('exclude_analytics', 'true');
                } else {
                    localStorage.removeItem('exclude_analytics');
                }
            } else {
                setUser(null);
                localStorage.removeItem('exclude_analytics');
            }
            setLoading(false);
        }, (error) => {
            console.error("Auth state change error:", error);
            setAuthError(error.message);
            setLoading(false); // Ensure loading is false even on error
        });

        // Safety timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
            setLoading((currentLoading) => {
                if (currentLoading) {
                    console.warn("Auth loading timed out, forcing completion");
                    setAuthError("Connection to authentication server timed out. Please check your internet connection or try reloading.");
                    return false;
                }
                return currentLoading;
            });
        }, 5000); // 5 seconds timeout

        return () => {
            unsubscribe();
            clearTimeout(timeoutId);
        };
    }, []);

    const loginAsGuest = async () => {
        try {
            await signInAnonymously(auth);
        } catch (error) {
            console.error("Error signing in anonymously:", error);
            throw error;
        }
    };

    const loginWithGoogle = async () => {
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error logging in with Google:", error);
            throw error;
        }
    };

    const logout = async () => {
        await signOut(auth);
        localStorage.removeItem('guest_uid');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginAsGuest, loginWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
