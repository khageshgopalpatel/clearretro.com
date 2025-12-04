
import React, { useState } from 'react';

const Pricing: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "Is it really free?",
      a: "Yes. Clear Retro is completely free for engineering teams. You get access to all features including AI insights, unlimited boards, and team members without any hidden paywalls."
    },
    {
      q: "Are there any limits?",
      a: "There are no hard limits on the number of boards you can create or members you can invite. We monitor for abuse regarding AI generation usage, but typical teams will never hit a limit."
    },
    {
      q: "How do you make money?",
      a: "We are currently focused on building the best developer-focused retrospective tool and growing our community. In the future, we may introduce specialized enterprise features (like On-premise hosting or Audit Logs), but the core features available today will remain free."
    },
    {
      q: "Is my data safe?",
      a: "Absolutely. Your data is encrypted in transit and at rest. We use Google Cloud Platform (Firebase) for secure storage. We do not sell your data or use it to train public AI models."
    },
    {
      q: "Can I export my data?",
      a: "Yes. Data portability is a core value. You can export any board to a formatted PDF report or raw CSV/Excel file at any time."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl tracking-tight font-mono">
          Premium Features. <span className="text-brand-500">Zero Cost.</span>
        </h1>
        <p className="mt-4 text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          We believe effective team improvement shouldn't be behind a paywall.
        </p>
      </div>

      {/* Single Tier Card */}
      <div className="max-w-5xl mx-auto mb-24">
        <div className="relative border border-gray-200 dark:border-gray-700 rounded-3xl p-8 md:p-12 bg-white/60 dark:bg-dark-900/60 backdrop-blur-xl shadow-2xl overflow-hidden group hover:border-brand-500/50 transition-colors duration-500">
          {/* Background Decor */}
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity duration-500">
            <svg className="w-64 h-64 text-brand-500" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-center relative z-10">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-block px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-widest mb-4 font-mono">
                Community Edition
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white font-mono mb-2">The All-Inclusive Plan</h3>
              <div className="mt-6 flex items-baseline justify-center lg:justify-start">
                <span className="text-7xl font-extrabold text-gray-900 dark:text-white tracking-tighter">$0</span>
                <span className="ml-3 text-2xl text-gray-500 font-mono">/ forever</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mt-6 leading-relaxed text-lg">
                Everything you need to run high-velocity agile retrospectives. Unlimited teams, unlimited history, fully unlocked AI.
              </p>
              <a href="/dashboard" className="inline-block mt-8 w-full text-center bg-brand-600 text-white font-bold py-4 px-8 rounded-xl hover:bg-brand-700 transition-all hover:-translate-y-1 shadow-lg shadow-brand-500/30 font-mono text-lg">
                Get Started Free
              </a>
              <p className="text-center mt-3 text-xs text-gray-400 uppercase tracking-wider font-mono">No Credit Card Required</p>
            </div>

            {/* Feature Grid */}
            <div className="flex-1 w-full bg-gray-50/50 dark:bg-black/20 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h4 className="font-bold text-gray-900 dark:text-white mb-6 font-mono text-sm uppercase tracking-wider">What's Included:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                {[
                  'Unlimited Boards',
                  'Unlimited Members',
                  'Gemini 2.0 AI Insights',
                  'Real-time Sync',
                  'Private & Focus Mode',
                  'PDF & Excel Export',
                  'Smart Semantic Grouping',
                  'Unlimited History',
                  'Guest Access (No Login)',
                  'Dark Mode Support',
                  'Jira Compatible Exports',
                  'Priority Community Support'
                ].map(feat => (
                  <div key={feat} className="flex items-start text-sm group/item">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center text-[10px] mr-3 font-bold mt-0.5 group-hover/item:bg-brand-500 group-hover/item:text-white transition-colors">✓</div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium font-mono group-hover/item:text-brand-600 dark:group-hover/item:text-brand-400 transition-colors">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto border-t border-gray-200 dark:border-gray-800 pt-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12 font-mono">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-800 rounded-2xl bg-white/50 dark:bg-dark-900 overflow-hidden transition-all hover:border-brand-500/30 hover:shadow-md">
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
              >
                <span className="font-bold text-gray-900 dark:text-white font-mono text-lg pr-4">{faq.q}</span>
                <span className={`transform transition-transform duration-300 text-brand-500 text-2xl font-bold ${openFaqIndex === index ? 'rotate-180' : ''}`}>
                  ↓
                </span>
              </button>
              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openFaqIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-6 pt-0 text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800/50 text-base">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;