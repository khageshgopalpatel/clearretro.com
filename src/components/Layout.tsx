
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();
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
    <div className="min-h-screen flex flex-col transition-colors duration-300 font-mono">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-dark-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-brand-500 opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <span className="text-white dark:text-black font-bold text-sm tracking-tighter">CR</span>
              </div>
              <span className="font-bold text-lg tracking-tight text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">Clear Retro</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.path || (link.path === '/blog' && location.pathname.startsWith('/blog'))
                      ? 'text-brand-600 dark:text-brand-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200 dark:border-gray-800">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                  aria-label="Toggle Theme"
                >
                  {isDark ? '☀️' : '🌙'}
                </button>

                <Link
                  to="/dashboard"
                  className="px-5 py-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] dark:hover:shadow-[0_0_15px_rgba(45,212,191,0.5)] transition-all duration-200"
                >
                  Dashboard
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden space-x-4">
               <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 dark:text-gray-400">
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
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center mt-4 px-4 py-3 rounded-lg bg-brand-600 text-white font-bold"
              >
                Launch Dashboard
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white/30 dark:bg-dark-900/30 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
               <div className="flex items-center space-x-2 mb-4">
                 <div className="w-5 h-5 bg-brand-600 rounded-sm flex items-center justify-center text-white text-[10px] font-bold">CR</div>
                 <span className="font-bold text-md text-gray-900 dark:text-white">Clear Retro</span>
               </div>
               <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                 The developer-first retrospective tool. Minimalist, fast, and keyboard-driven.
               </p>
               <p className="text-xs text-gray-400 font-mono">© 2024 Clear Retro Inc.</p>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4 uppercase text-xs tracking-wider">Product</h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400 font-mono">
                <li><Link to="/features" className="hover:text-brand-600 dark:hover:text-brand-400">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-brand-600 dark:hover:text-brand-400">Pricing</Link></li>
                <li><Link to="/templates" className="hover:text-brand-600 dark:hover:text-brand-400">Templates</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4 uppercase text-xs tracking-wider">Comparisons</h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400 font-mono">
                <li><Link to="/vs/funretro" className="hover:text-brand-600 dark:hover:text-brand-400">vs FunRetro</Link></li>
                <li><Link to="/vs/easyretro" className="hover:text-brand-600 dark:hover:text-brand-400">vs EasyRetro</Link></li>
                <li><Link to="/vs/metroretro" className="hover:text-brand-600 dark:hover:text-brand-400">vs Metro Retro</Link></li>
              </ul>
            </div>

            <div>
               <h4 className="font-bold text-gray-900 dark:text-white mb-4 uppercase text-xs tracking-wider">Legal</h4>
               <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400 font-mono">
                <li><a href="#" className="hover:text-brand-600 dark:hover:text-brand-400">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-brand-600 dark:hover:text-brand-400">Terms</a></li>
                <li><Link to="/contact-us" className="hover:text-brand-600 dark:hover:text-brand-400">Contact</Link></li>
               </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
