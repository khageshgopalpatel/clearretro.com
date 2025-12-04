import { useState, useRef, useEffect } from 'react';

interface User {
    displayName: string | null;
    [key: string]: any;
}

interface HeaderDropdownProps {
    user: User | null;
    onLogout: () => void;
}

const HeaderDropdown = ({ user, onLogout }: HeaderDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const [isDarkMode, setIsDarkMode] = useState(() => {
        try {
            return localStorage.getItem('theme') === 'dark' ||
                (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        } catch (e) {
            return false;
        }
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-900 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-800 transition-all hover:shadow-md cursor-pointer"
                title={user?.displayName || 'Guest'}
            >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    {user?.displayName ? user.displayName[0].toUpperCase() : 'G'}
                </div>
                <span className="font-medium text-sm hidden sm:inline">{user?.displayName || 'Guest'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} text-gray-400`}>
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                    <div className="p-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-dark-950/50">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Signed in as</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.displayName || 'Guest User'}</p>
                    </div>
                    <ul className="py-1">
                        <li>
                            <button
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-dark-800 flex items-center gap-3 text-gray-700 dark:text-gray-300 transition-colors"
                            >
                                {isDarkMode ? (
                                    <>
                                        <div className="p-1.5 rounded-md bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="5"></circle>
                                                <line x1="12" y1="1" x2="12" y2="3"></line>
                                                <line x1="12" y1="21" x2="12" y2="23"></line>
                                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                                <line x1="1" y1="12" x2="3" y2="12"></line>
                                                <line x1="21" y1="12" x2="23" y2="12"></line>
                                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                                            </svg>
                                        </div>
                                        <span>Light Mode</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="p-1.5 rounded-md bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                            </svg>
                                        </div>
                                        <span>Dark Mode</span>
                                    </>
                                )}
                            </button>
                        </li>
                        <li className="border-t border-gray-100 dark:border-gray-800 mt-1 pt-1">
                            <button
                                onClick={() => {
                                    onLogout();
                                    setIsOpen(false);
                                }}
                                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors"
                            >
                                <div className="p-1.5 rounded-md bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                        <polyline points="16 17 21 12 16 7"></polyline>
                                        <line x1="21" y1="12" x2="9" y2="12"></line>
                                    </svg>
                                </div>
                                <span>Logout</span>
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default HeaderDropdown;
