import React, { useState, useEffect } from 'react';

interface HeaderProps {
    currentPath: string;
}

const Header: React.FC<HeaderProps> = ({ currentPath }) => {
    const [isDark, setIsDark] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            setIsDark(true);
        } else {
            document.documentElement.classList.remove('dark');
            setIsDark(false);
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
            setIsDark(true);
        }
    };

    const navLinks = [
        { path: '/features', label: 'Features' },
        { path: '/templates', label: 'Templates' },
        { path: '/pricing', label: 'Pricing' },
        { path: '/blog', label: 'Blog' },
        { path: '/about', label: 'About' },
    ];

    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-dark-900/80 border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <a href="/" className="flex items-center space-x-3 group">
                        <div className="relative w-8 h-8 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-brand-500 opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            <img src="/logo.svg" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-gray-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors">Clear Retro</span>
                    </a>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.path}
                                href={link.path}
                                className={`text-sm font-medium transition-all duration-200 ${currentPath === link.path || (link.path === '/blog' && currentPath.startsWith('/blog'))
                                    ? 'text-brand-700 dark:text-brand-400'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                {link.label}
                            </a>
                        ))}

                        <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200 dark:border-gray-800">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                                aria-label="Toggle Theme"
                            >
                                {isDark ? '☀️' : '🌙'}
                            </button>

                            <a
                                href="/dashboard"
                                className="px-5 py-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] dark:hover:shadow-[0_0_15px_rgba(45,212,191,0.5)] transition-all duration-200"
                            >
                                Dashboard
                            </a>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                            aria-label="Toggle Theme"
                        >
                            {isDark ? '☀️' : '🌙'}
                        </button>
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)} 
                            className="text-gray-600 dark:text-gray-400"
                            aria-label="Toggle Menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-900 absolute w-full shadow-xl z-50">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <a
                                key={link.path}
                                href={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                {link.label}
                            </a>
                        ))}
                        <a
                            href="/dashboard"
                            onClick={() => setIsMenuOpen(false)}
                            className="block w-full text-center mt-4 px-4 py-3 rounded-lg bg-brand-700 text-white font-bold"
                        >
                            Launch Dashboard
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
