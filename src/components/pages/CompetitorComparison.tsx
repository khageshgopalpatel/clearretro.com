
import React from 'react';
import { COMPETITORS } from '../../data/competitors';

interface CompetitorComparisonProps {
   competitorSlug: string;
}

const CompetitorComparison: React.FC<CompetitorComparisonProps> = ({ competitorSlug }) => {
   const data = competitorSlug ? COMPETITORS[competitorSlug] : null;

   // Title and meta description are now handled by the parent Astro page for better SEO

   if (!data) {
      return (
         <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Comparison Not Found</h1>
            <button onClick={() => window.location.href = '/'} className="text-brand-600 hover:underline">Return Home</button>
         </div>
      );
   }

   return (
      <div className="min-h-screen">
         {/* Hero */}
         <div className="relative bg-gray-900 dark:bg-black py-24 overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
               <span className="inline-block px-3 py-1 rounded-full bg-brand-900/30 text-brand-400 border border-brand-800 text-xs font-bold uppercase tracking-widest mb-6 font-mono">
                  Alternatives & Comparisons
               </span>
               <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight font-mono mb-8 leading-tight">
                  {data.name} <span className="text-gray-600">vs</span> <span className="text-brand-500">Clear Retro</span>
               </h1>
               <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
                  {data.metaDescription}
               </p>
               <div className="flex justify-center gap-4">
                  <a href="/dashboard" className="px-8 py-4 bg-brand-700 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:bg-brand-600 transition-all transform hover:-translate-y-1">
                     Start Free Retro
                  </a>
               </div>
            </div>
         </div>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            {/* Verdict Box */}
            <div className="bg-gradient-to-br from-brand-50 to-white dark:from-brand-900/10 dark:to-dark-900 border border-brand-200 dark:border-brand-900 rounded-2xl p-8 mb-20 shadow-lg">
               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 font-mono">
                  <span className="text-2xl">⚖️</span> The Verdict
               </h3>
               <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                  {data.verdict}
               </p>
            </div>

            {/* Comparison Table */}
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12 font-mono">Feature Showdown</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 shadow-xl mb-20">
               <table className="w-full text-left bg-white dark:bg-dark-950">
                  <thead>
                     <tr className="bg-gray-50 dark:bg-dark-900 border-b border-gray-200 dark:border-gray-800">
                        <th className="p-6 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/3">Feature</th>
                        <th className="p-6 text-lg font-bold text-brand-700 dark:text-brand-400 w-1/3 bg-brand-50/50 dark:bg-brand-900/10">Clear Retro</th>
                        <th className="p-6 text-lg font-bold text-gray-500 w-1/3">{data.name}</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                     {data.featuresComparison.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-dark-900 transition-colors">
                           <td className="p-6 font-medium text-gray-900 dark:text-white">{row.feature}</td>
                           <td className="p-6 bg-brand-50/20 dark:bg-brand-900/5">
                              {row.clearRetro === true ? <span className="text-green-500 font-bold">✓ Yes</span> :
                                 row.clearRetro === false ? <span className="text-red-500 font-bold">✕ No</span> :
                                    <span className="text-gray-900 dark:text-white font-bold">{row.clearRetro}</span>}
                           </td>
                           <td className="p-6">
                              {row.competitor === true ? <span className="text-green-500 font-bold">✓ Yes</span> :
                                 row.competitor === false ? <span className="text-red-500 font-bold">✕ No</span> :
                                    <span className="text-gray-500">{row.competitor}</span>}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>

            {/* Pros and Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 font-mono text-center">{data.name} Pros & Cons</h3>
                  <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 h-full">
                     <div className="mb-8">
                        <h4 className="font-bold text-green-600 mb-4 uppercase text-xs tracking-wider">Pros</h4>
                        <ul className="space-y-2">
                           {data.pros.map((p, i) => <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"><span className="text-green-500">✓</span> {p}</li>)}
                        </ul>
                     </div>
                     <div>
                        <h4 className="font-bold text-red-500 mb-4 uppercase text-xs tracking-wider">Cons</h4>
                        <ul className="space-y-2">
                           {data.cons.map((c, i) => <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"><span className="text-red-500">✕</span> {c}</li>)}
                        </ul>
                     </div>
                  </div>
               </div>

               <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 font-mono text-center">Why Teams Switch to Clear Retro</h3>
                  <div className="bg-brand-900/5 dark:bg-brand-900/10 border border-brand-100 dark:border-brand-900/50 rounded-xl p-8 h-full">
                     <ul className="space-y-6">
                        <li className="flex gap-4">
                           <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-900/30 text-brand-600 flex items-center justify-center text-xl">🤖</div>
                           <div>
                              <h4 className="font-bold text-gray-900 dark:text-white">AI Automation</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Stop spending 20 minutes grouping cards manually. AI does it instantly.</p>
                           </div>
                        </li>
                        <li className="flex gap-4">
                           <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-900/30 text-brand-600 flex items-center justify-center text-xl">⌨️</div>
                           <div>
                              <h4 className="font-bold text-gray-900 dark:text-white">Keyboard First</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Designed for developers who hate reaching for the mouse.</p>
                           </div>
                        </li>
                        <li className="flex gap-4">
                           <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-900/30 text-brand-600 flex items-center justify-center text-xl">💸</div>
                           <div>
                              <h4 className="font-bold text-gray-900 dark:text-white">Better Free Tier</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">We don't limit your history or team size on the free plan.</p>
                           </div>
                        </li>
                     </ul>
                     <div className="mt-8 text-center">
                        <a href="/dashboard" className="text-brand-600 font-bold hover:underline">Create your first board now →</a>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default CompetitorComparison;
