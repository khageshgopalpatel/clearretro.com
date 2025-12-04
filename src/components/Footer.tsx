import React from 'react';

const Footer: React.FC = () => {
    return (
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
                            <li><a href="/features" className="hover:text-brand-600 dark:hover:text-brand-400">Features</a></li>
                            <li><a href="/pricing" className="hover:text-brand-600 dark:hover:text-brand-400">Pricing</a></li>
                            <li><a href="/templates" className="hover:text-brand-600 dark:hover:text-brand-400">Templates</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4 uppercase text-xs tracking-wider">Comparisons</h4>
                        <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400 font-mono">
                            <li><a href="/vs/funretro" className="hover:text-brand-600 dark:hover:text-brand-400">vs FunRetro</a></li>
                            <li><a href="/vs/easyretro" className="hover:text-brand-600 dark:hover:text-brand-400">vs EasyRetro</a></li>
                            <li><a href="/vs/metroretro" className="hover:text-brand-600 dark:hover:text-brand-400">vs Metro Retro</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4 uppercase text-xs tracking-wider">Legal</h4>
                        <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400 font-mono">
                            <li><a href="/privacy" className="hover:text-brand-600 dark:hover:text-brand-400">Privacy Policy</a></li>
                            <li><a href="/terms" className="hover:text-brand-600 dark:hover:text-brand-400">Terms</a></li>
                            <li><a href="/contact-us" className="hover:text-brand-600 dark:hover:text-brand-400">Contact</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
