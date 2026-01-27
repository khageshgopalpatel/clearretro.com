import React from 'react';
import { analytics, logEvent } from '../lib/firebase';

const BuyMeCoffeeWidget: React.FC = () => {
    const handleClick = () => {
        if (analytics) {
            logEvent(analytics, 'click_buy_coffee', {
                source: 'floating_widget',
                location: window.location.pathname
            });
        }
    };

    return (
        <div className="fixed bottom-6 left-6 z-[100] print:hidden">
            <a
                href="https://buymeacoffee.com/clearretro"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
                className="group flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 rounded-full shadow-lg hover:shadow-xl ring-1 ring-yellow-500/50 transition-all duration-300 hover:scale-110"
                title="Buy us a coffee"
            >
                <span className="text-lg md:text-xl group-hover:animate-bounce">☕</span>
                <span className="hidden sm:inline absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Support us
                </span>
            </a>
        </div>
    );
};

export default BuyMeCoffeeWidget;
