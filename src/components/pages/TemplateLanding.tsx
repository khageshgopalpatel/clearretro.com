
import React from 'react';
import type { BoardTemplate } from '../../types';

interface TemplateLandingProps {
    template: BoardTemplate;
}

const TemplateLanding: React.FC<TemplateLandingProps> = ({ template }) => {
    const createBoardUrl = `/board?template=${template.id}`;

    return (
        <div className="relative overflow-hidden selection:bg-brand-500 selection:text-white pb-24">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] bg-gradient-to-b from-brand-50/50 via-transparent to-transparent dark:from-brand-900/10 pointer-events-none" />
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob dark:bg-purple-900/20"></div>
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-brand-500/10 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-2000 dark:bg-brand-900/20"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-32">
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-mono font-semibold mb-8 border border-blue-100 dark:border-blue-800/50 backdrop-blur-sm">
                        Free Retrospective Template
                    </div>
                    
                    <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-6xl md:text-7xl mb-8 font-mono leading-tight">
                        {template.name} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-brand-400 to-purple-500">Retrospective</span>
                    </h1>

                    <p className="mt-8 text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        {template.description || `Run an effective ${template.name} retrospective with your team using our free, real-time board.`}
                    </p>

                    <div className="mt-12 flex flex-col items-center gap-4">
                        <a
                            href={createBoardUrl}
                            className="group relative px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-black text-lg font-bold rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.2)] dark:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center border border-transparent hover:border-brand-500 overflow-hidden"
                        >
                            <span className="relative z-10 font-mono">Start {template.name} Retro →</span>
                        </a>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                            No account required • Instant setup
                        </p>
                    </div>
                </div>

                {/* Template Preview */}
                <div className="max-w-5xl mx-auto">
                    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl overflow-hidden p-2">
                         <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800 p-6">
                            {/* Fake Toolbar */}
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
                                <div className="flex gap-4">
                                    <div className="w-32 h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                                    <div className="w-24 h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800"></div>
                            </div>
                            
                            {/* Columns */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {template.columns.map((col, idx) => (
                                    <div key={idx} className="flex flex-col gap-4">
                                        <div className={`p-4 rounded-lg border-t-4 bg-white dark:bg-gray-800 shadow-sm ${
                                            col.color === 'red' ? 'border-red-500' :
                                            col.color === 'green' ? 'border-green-500' :
                                            col.color === 'blue' ? 'border-blue-500' :
                                            col.color === 'yellow' ? 'border-yellow-500' : 'border-gray-500'
                                        }`}>
                                            <h3 className="font-bold uppercase text-sm text-gray-900 dark:text-white mb-4">{col.title}</h3>
                                            
                                            {/* Fake Cards */}
                                            <div className="space-y-3">
                                                <div className="h-24 bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3">
                                                    <div className="w-3/4 h-2 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                                                    <div className="w-1/2 h-2 bg-gray-200 dark:bg-gray-600 rounded"></div>
                                                </div>
                                                <div className="h-24 bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 opacity-50">
                                                     <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateLanding;
