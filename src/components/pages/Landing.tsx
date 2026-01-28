
import React, { useState, useRef } from 'react';
import { analytics, logEvent } from '../../lib/firebase';
import { faqs } from '../../data/faqs';

const Landing: React.FC = () => {
   const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
   const [isPlaying, setIsPlaying] = useState(false);
   const videoRef = useRef<HTMLVideoElement>(null);

   const togglePlay = () => {
      if (videoRef.current) {
         if (isPlaying) {
            videoRef.current.pause();
         } else {
            videoRef.current.play();
             if (analytics) {
                 logEvent(analytics, 'video_play', {
                     component: 'landing_hero',
                     video_name: 'demo_video'
                 });
             }
         }
         setIsPlaying(!isPlaying);
      }
   };

   return (
      <div className="relative overflow-hidden selection:bg-brand-500 selection:text-white">
         {/* Background Decor */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] bg-gradient-to-b from-brand-50/50 via-transparent to-transparent dark:from-brand-900/10 pointer-events-none" />
         <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob dark:bg-purple-900/20"></div>
         <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-brand-500/10 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-2000 dark:bg-brand-900/20"></div>

         {/* Hero Section */}
         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-32">
            <div className="text-center max-w-4xl mx-auto">
               <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-green-50/50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs font-mono font-semibold mb-8 border border-green-100 dark:border-green-800/50 backdrop-blur-sm hover:border-green-500/50 transition-colors cursor-default">
                  <span className="animate-pulse w-2 h-2 bg-green-500 rounded-full mr-2 shadow-[0_0_10px_rgba(34,197,94,0.6)]"></span>
                  Free Community Edition • Unlimited Boards • No Credit Card
               </div>

               <h1 className="text-5xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-7xl md:text-8xl mb-8 font-mono leading-tight">
                  Agile Retros <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-brand-400 to-purple-500 animate-gradient">Reimagined</span>
               </h1>

                <p className="mt-8 text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
                  The <span className="text-gray-900 dark:text-white font-medium">fastest</span> way for <span className="text-gray-900 dark:text-white font-medium">remote engineering teams</span> to run effective <span className="text-brand-600 dark:text-brand-400 font-bold">sprint retrospectives</span>. Free to start, universal <span className="text-brand-600 dark:text-brand-400 font-bold">AI support</span> on all browsers, and zero clutter.
               </p>

               {/* Definition Block for LLM Optimization */}
               <div className="mt-8 mb-4 max-w-3xl mx-auto hidden md:block">
                  <div className="bg-brand-50/50 dark:bg-brand-900/10 border border-brand-100 dark:border-brand-900 rounded-lg p-4 text-sm text-gray-600 dark:text-gray-400 text-left">
                     <p>
                        <strong className="text-gray-900 dark:text-white">What is Clear Retro?</strong><br />
                        Clear Retro is a free, real-time agile retrospective tool designed for developers. It features unlimited boards, AI-powered grouping, and private voting modes to help Scrum teams improve their processes without account limits.
                     </p>
                  </div>
               </div>

               <div className="mt-12 flex flex-col items-center gap-4">
                  <a
                     href="/signin"
                     className="group relative px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-black text-lg font-bold rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.2)] dark:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center border border-transparent hover:border-brand-500 overflow-hidden w-full sm:w-auto"
                  >
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                     <span className="relative z-10">Start Free Retro →</span>
                  </a>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                     No account required for demo • Unlimited history
                  </p>
               </div>
            </div>

            {/* Demo Video Window */}
            <div className="mt-24 max-w-6xl mx-auto">
               <div 
                  className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800/50 shadow-2xl bg-gray-900 aspect-video group cursor-pointer backdrop-blur-sm"
                  onClick={togglePlay}
               >
                  <iframe className="w-full h-full object-cover opacity-90" src="https://www.youtube.com/embed/CdalILjCL_k?si=p2yPJumnBbHXt0Fr" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
               </div>
            </div>
         </div>



         {/* How It Works (UX Improvement) */}
         <div className="py-24 bg-gray-50 dark:bg-[#08080a] relative">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-mono mb-4">Streamlined Workflow</h2>
                  <p className="text-gray-500 dark:text-gray-400">From chaos to action items in three simple steps.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Step 1 */}
                  <div className="relative p-8 bg-white dark:bg-dark-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:border-brand-500/50 transition-colors group">
                     <div className="absolute -top-4 -left-4 w-10 h-10 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg flex items-center justify-center font-bold font-mono shadow-lg group-hover:scale-110 transition-transform">1</div>
                     <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 font-mono mt-2">Choose Template</h3>
                     <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                        Start fast with pre-built <span className="font-bold text-gray-900 dark:text-white">agile retrospective templates</span> like Start/Stop/Continue, 4Ls, or Mad/Sad/Glad. Perfect for Scrum Masters.
                     </p>
                  </div>

                  {/* Step 2 */}
                  <div className="relative p-8 bg-white dark:bg-dark-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:border-brand-500/50 transition-colors group">
                     <div className="absolute -top-4 -left-4 w-10 h-10 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg flex items-center justify-center font-bold font-mono shadow-lg group-hover:scale-110 transition-transform">2</div>
                     <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 font-mono mt-2">Brainstorm & Group</h3>
                     <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                        Team members add cards in real-time. Use <strong>Private Mode</strong> to avoid bias, then let <strong>Universal AI</strong> group duplicates instantly on any browser.
                     </p>
                  </div>

                  {/* Step 3 */}
                  <div className="relative p-8 bg-white dark:bg-dark-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:border-brand-500/50 transition-colors group">
                     <div className="absolute -top-4 -left-4 w-10 h-10 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg flex items-center justify-center font-bold font-mono shadow-lg group-hover:scale-110 transition-transform">3</div>
                     <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 font-mono mt-2">Vote & Act</h3>
                     <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                        Upvote key issues with our new <span className="font-bold text-gray-900 dark:text-white">Numerical Voting</span>. Export results to professional PDFs with <span className="font-bold text-gray-900 dark:text-white">AI-generated summaries</span>.
                     </p>
                  </div>
               </div>
            </div>
         </div>

         {/* Bento Grid Feature Section */}
         <div className="py-24 bg-white dark:bg-dark-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-mono mb-4">Everything You Need</h2>
                  <p className="text-gray-500 dark:text-gray-400">Powerful features to run effective retrospectives.</p>
               </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
                  {/* Large Item: AI Smart Add */}
                  <div className="md:col-span-2 relative overflow-hidden rounded-3xl bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-gray-800 p-8 group">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-brand-500/20"></div>
                     <div className="relative z-10 flex flex-col h-full">
                        <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-6 group-hover:scale-110 transition-transform">
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 font-mono">Universal AI Smart Add</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md">
                           Type your thoughts in one box. Our hybrid AI (On-device + Cloud) automatically categorizes them into the right columns. Works on every browser.
                        </p>
                     </div>
                  </div>

                  {/* Item: Premium Exports */}
                  <div className="relative overflow-hidden rounded-3xl bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-gray-800 p-8 group">
                     <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/></svg>
                     </div>
                     <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 font-mono">Professional Reports</h3>
                     <p className="text-sm text-gray-500 dark:text-gray-400">PDF & Excel exports with AI-generated executive summaries and sentiment analysis.</p>
                  </div>

                  {/* Item: Numerical Voting */}
                  <div className="relative overflow-hidden rounded-3xl bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-gray-800 p-8 group">
                     <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 20V10"/><path d="M12 20V4"/><path d="M17 20v-8"/></svg>
                     </div>
                     <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 font-mono">0-5 Point Voting</h3>
                     <p className="text-sm text-gray-500 dark:text-gray-400">Prioritize issues with a weighted voting system for more accurate team feedback.</p>
                  </div>

                  {/* Item: Focus Mode */}
                  <div className="relative overflow-hidden rounded-3xl bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-gray-800 p-8 group">
                     <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                     </div>
                     <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 font-mono">Focus Mode</h3>
                     <p className="text-sm text-gray-500 dark:text-gray-400">Hide cards while writing to prevent groupthink and social bias during brainstorming.</p>
                  </div>

                  {/* Item: Real-time Timer */}
                   <div className="relative overflow-hidden rounded-3xl bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-gray-800 p-8 group">
                     <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                     </div>
                     <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 font-mono">Shared Timer</h3>
                     <p className="text-sm text-gray-500 dark:text-gray-400">Keep your sprint retrospectives on track with a built-in shared countdown timer.</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Comparison Grid */}
         <div className="py-20 bg-gray-50 dark:bg-[#08080a] border-y border-gray-200 dark:border-gray-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
               <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-mono mb-8">Compare vs The Competition</h2>
               <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <a href="/vs/easyretro" className="p-4 bg-white dark:bg-dark-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-brand-500 hover:shadow-[0_0_15px_rgba(45,212,191,0.2)] transition-all">
                     <span className="block text-xs text-gray-500 uppercase tracking-widest mb-1">vs</span>
                     <span className="font-bold text-gray-900 dark:text-white">EasyRetro</span>
                  </a>
                  <a href="/vs/miro" className="p-4 bg-white dark:bg-dark-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-brand-500 hover:shadow-[0_0_15px_rgba(45,212,191,0.2)] transition-all">
                     <span className="block text-xs text-gray-500 uppercase tracking-widest mb-1">vs</span>
                     <span className="font-bold text-gray-900 dark:text-white">Miro</span>
                  </a>
                  <a href="/vs/parabol" className="p-4 bg-white dark:bg-dark-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-brand-500 hover:shadow-[0_0_15px_rgba(45,212,191,0.2)] transition-all">
                     <span className="block text-xs text-gray-500 uppercase tracking-widest mb-1">vs</span>
                     <span className="font-bold text-gray-900 dark:text-white">Parabol</span>
                  </a>
                  <a href="/vs/teamretro" className="p-4 bg-white dark:bg-dark-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-brand-500 hover:shadow-[0_0_15px_rgba(45,212,191,0.2)] transition-all">
                     <span className="block text-xs text-gray-500 uppercase tracking-widest mb-1">vs</span>
                     <span className="font-bold text-gray-900 dark:text-white">TeamRetro</span>
                  </a>
                  <a href="/vs/metroretro" className="p-4 bg-white dark:bg-dark-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-brand-500 hover:shadow-[0_0_15px_rgba(45,212,191,0.2)] transition-all">
                     <span className="block text-xs text-gray-500 uppercase tracking-widest mb-1">vs</span>
                     <span className="font-bold text-gray-900 dark:text-white">Metro Retro</span>
                  </a>
               </div>
            </div>
         </div>

         {/* FAQ Section */}
         <div className="py-24 bg-white dark:bg-dark-950">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-mono mb-4">Frequently Asked Questions</h2>
                  <p className="text-gray-500 dark:text-gray-400">Everything you need to know about Clear Retro.</p>
               </div>

               <div className="space-y-4">
                  {faqs.map((faq, index) => (
                     <div key={index} className="border border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-dark-900 overflow-hidden">
                        <button
                           onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                           className="w-full flex justify-between items-center p-6 text-left focus:outline-none hover:bg-white dark:hover:bg-dark-800 transition-colors"
                        >
                           <span className="font-bold text-gray-900 dark:text-white font-mono">{faq.q}</span>
                           <span className={`transform transition-transform duration-200 text-brand-500 text-xl font-bold ${openFaqIndex === index ? 'rotate-180' : ''}`}>
                              ↓
                           </span>
                        </button>
                        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openFaqIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                           <div className="p-6 pt-0 text-gray-600 dark:text-gray-400 leading-relaxed text-sm border-t border-gray-100 dark:border-gray-800/50 mt-2">
                              {faq.a}
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
};

export default Landing;
