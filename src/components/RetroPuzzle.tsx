import React, { useEffect, useState } from 'react';

interface RetroPuzzleProps {
    cardsCount: number;
    votesCount: number;
    actionItemsCount: number;
    isCompleted: boolean;
}

const IMAGES = [
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop", // Laptop/Coffee
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop", // Meeting people
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop", // Team high five
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932&auto=format&fit=crop", // Meeting room
    "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2070&auto=format&fit=crop"  // Blueprint
];

export const RetroPuzzle: React.FC<RetroPuzzleProps> = ({ cardsCount, votesCount, actionItemsCount, isCompleted }) => {
    const [bgImage, setBgImage] = useState('');
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        // Pick a stable random image based on the day (so it doesn't flicker on refresh if possible, or just random per session)
        // For now, random per mount is fine, or random based on something stable?
        // Let's just pick random for now.
        const randomIndex = Math.floor(Math.random() * IMAGES.length);
        setBgImage(IMAGES[randomIndex]);
    }, []);

    // Calculate Progress (0 - 100)
    // Goal: 20 Cards, 20 Votes, 3 Action Items => 100%?
    // Let's calibrate:
    // Card = 3 points
    // Vote = 1 point
    // Action Item = 10 points
    // Target Score = 100
    const score = (cardsCount * 3) + (votesCount * 1) + (actionItemsCount * 10);
    const progress = Math.min(100, isCompleted ? 100 : score);
    
    // Blur calculation: Starts at 20px, goes to 0px
    // 0% progress = 20px blur
    // 100% progress = 0px blur
    const blurAmount = Math.max(0, 20 - (progress / 100) * 20);
    
    // Saturation: Starts at 0% (grayscale), goes to 100%
    const grayscaleAmount = Math.max(0, 100 - progress);

    useEffect(() => {
        if (progress >= 100 && !revealed) {
            setRevealed(true);
        }
    }, [progress]);

    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none transition-all duration-1000">
            {/* Background Image Layer */}
            <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out opacity-20 dark:opacity-10"
                style={{ 
                    backgroundImage: `url(${bgImage})`,
                    filter: `blur(${blurAmount}px) grayscale(${grayscaleAmount}%)`,
                    transform: `scale(${1 + (blurAmount/40)})` // Slight zoom out effect as it focuses
                }}
            />
            
            {/* Progress Notification (Micro-interaction) */}
            {revealed && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 animate-in fade-in zoom-in duration-1000">
                    <div className="bg-white/90 dark:bg-black/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-brand-500 text-center">
                        <div className="text-4xl mb-2">🎉</div>
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-500 to-purple-600 font-mono">
                            Puzzle Solved!
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 font-mono text-sm mt-2">
                            Great collaboration, team!
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
