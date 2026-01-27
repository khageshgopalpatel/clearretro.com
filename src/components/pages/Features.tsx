
import React from 'react';

const Features: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-20">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl tracking-tight font-mono">
          Powerful Features for <br /><span className="text-brand-600">Modern Agile Teams</span>
        </h1>
        <p className="mt-6 text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          We stripped away the clutter of traditional project management tools to build a pure, high-velocity retrospective experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Real-Time Sync */}
        <div className="md:col-span-2 bg-white dark:bg-dark-900 rounded-lg p-10 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden relative group hover:border-brand-500/50 transition-colors">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
            <svg className="w-64 h-64 text-brand-500" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-brand-50 dark:bg-brand-900/20 rounded-lg flex items-center justify-center mb-6 text-brand-600 text-2xl border border-brand-100 dark:border-brand-800">⚡</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 font-mono">Real-time WebSocket Sync</h3>
            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed max-w-lg">
              Built on a high-performance websocket architecture. When a teammate moves a card, it moves on your screen instantly. No refresh required. We use optimistic UI updates to ensure the interface feels snappy even on slow VPNs. Perfect for distributed teams running remote retrospectives.
            </p>
          </div>
        </div>

        {/* Universal Gemini AI */}
        <div className="bg-gray-900 dark:bg-white rounded-lg p-8 border border-transparent shadow-xl flex flex-col text-white dark:text-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 opacity-20 dark:opacity-10"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 dark:bg-gray-900/10 rounded-lg flex items-center justify-center mb-6 text-2xl">🤖</div>
            <h3 className="text-2xl font-bold mb-3 font-mono">Universal Gemini AI</h3>
            <p className="opacity-80 leading-relaxed">
              Our hybrid AI engine (Local + Cloud) works on every browser. Use <strong>AI Smart Add</strong> to share thoughts in a single stream—they'll be categorized and grouped automatically using semantic clustering.
            </p>
          </div>
        </div>

        {/* Focus Mode */}
        <div className="bg-white dark:bg-dark-900 rounded-lg p-8 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-[0_0_15px_rgba(45,212,191,0.1)] transition-shadow">
          <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-6 text-purple-600 text-2xl border border-purple-100 dark:border-purple-900/50">🎯</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 font-mono">Focus & Privacy Mode</h3>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
            Facilitate like a pro. Blur cards to prevent groupthink bias during the writing phase. Reveal them when you are ready to discuss.
          </p>
        </div>

        {/* Anonymity */}
        <div className="bg-white dark:bg-dark-900 rounded-lg p-8 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-[0_0_15px_rgba(45,212,191,0.1)] transition-shadow">
          <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center mb-6 text-red-600 text-2xl border border-red-100 dark:border-red-900/50">🔒</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 font-mono">Anonymous by Default</h3>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
            Psychological safety is paramount in Agile. Guest access allows team members to join without login, ensuring difficult feedback is shared without fear.
          </p>
        </div>

        {/* Exports */}
        <div className="bg-white dark:bg-dark-900 rounded-lg p-8 border border-gray-200 dark:border-gray-800 shadow-sm hover:border-brand-500/50 transition-colors">
          <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-6 text-green-600 text-2xl border border-green-100 dark:border-green-900/50">📤</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 font-mono">AI-Augmented Exports</h3>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
            Export results to professional PDF & Excel reports. Includes AI-generated executive summaries and sentiment analysis to help stakeholders understand team morale at a glance.
          </p>
        </div>

        {/* Numerical Voting */}
        <div className="bg-white dark:bg-dark-900 rounded-lg p-8 border border-gray-200 dark:border-gray-800 shadow-sm hover:border-brand-500/50 transition-colors">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-6 text-blue-600 text-2xl border border-blue-100 dark:border-blue-900/50">🔢</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 font-mono">Numerical 0-5 Voting</h3>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
            Break free from simple upvotes. Our 0-5 point system allows for nuanced prioritization, letting teams weigh the impact and urgency of every issue more accurately.
          </p>
        </div>
      </div>

      <div className="mt-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 font-mono">Ready to improve your team's velocity?</h2>
        <a href="/dashboard" className="inline-block px-8 py-4 bg-brand-600 text-white font-bold rounded-lg shadow-lg hover:bg-brand-700 transition-colors font-mono">Start Your First Retro</a>
      </div>
    </div>
  );
};

export default Features;