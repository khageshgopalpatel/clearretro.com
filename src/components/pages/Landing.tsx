
import React, { useState, useRef } from 'react';
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
                  100% Free • Unlimited Boards • No Credit Card
               </div>

               <h1 className="text-5xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-7xl md:text-8xl mb-8 font-mono leading-tight">
                  Agile Retros <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-brand-400 to-purple-500 animate-gradient">Reimagined</span>
               </h1>

               <p className="mt-8 text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
                  The <span className="text-gray-900 dark:text-white font-medium">fastest</span> way for engineering teams to improve. <span className="text-brand-600 dark:text-brand-400 font-bold">Free forever</span>, zero clutter, and supercharged with AI.
               </p>

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
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 ${isPlaying ? 'opacity-0 hover:opacity-100 transition-opacity duration-300' : ''}`}></div>

                  {/* Fake UI Header */}
                  <div className={`absolute top-0 left-0 right-0 h-10 bg-black/40 border-b border-white/10 flex items-center px-4 gap-2 z-20 backdrop-blur-md ${isPlaying ? 'opacity-0 hover:opacity-100 transition-opacity duration-300' : ''}`}>
                     <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                     <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                     <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                     <div className="ml-4 px-3 py-1 bg-white/10 rounded-md text-[10px] text-gray-400 font-mono w-64">clear-retro.com/board/demo</div>
                  </div>

                  {!isPlaying && (
                     <div className="absolute inset-0 flex items-center justify-center z-30 group-hover:scale-105 transition-transform duration-500">
                        <div className="w-24 h-24 bg-brand-500/20 backdrop-blur-md rounded-full flex items-center justify-center border border-brand-400/50 shadow-[0_0_30px_rgba(45,212,191,0.3)] group-hover:bg-brand-500/30 transition-all">
                           <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[22px] border-l-brand-50 border-b-[12px] border-b-transparent ml-2"></div>
                        </div>
                     </div>
                  )}

                  <video 
                     ref={videoRef}
                     className="w-full h-full object-cover opacity-90"
                     loop 
                     playsInline
                     src="/demo.mp4"
                     poster="https://placehold.co/1200x675/09090b/2dd4bf?text=Clear+Retro+Demo"
                     onPlay={() => setIsPlaying(true)}
                     onPause={() => setIsPlaying(false)}
                     controls={isPlaying}
                  />
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
                        Start fast with pre-built templates like Start/Stop/Continue, 4Ls, or Mad/Sad/Glad. No setup required.
                     </p>
                  </div>

                  {/* Step 2 */}
                  <div className="relative p-8 bg-white dark:bg-dark-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:border-brand-500/50 transition-colors group">
                     <div className="absolute -top-4 -left-4 w-10 h-10 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg flex items-center justify-center font-bold font-mono shadow-lg group-hover:scale-110 transition-transform">2</div>
                     <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 font-mono mt-2">Brainstorm & Group</h3>
                     <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                        Team members add cards in real-time. Use <strong>Private Mode</strong> to avoid bias, then let <strong>AI</strong> group duplicates instantly.
                     </p>
                  </div>

                  {/* Step 3 */}
                  <div className="relative p-8 bg-white dark:bg-dark-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:border-brand-500/50 transition-colors group">
                     <div className="absolute -top-4 -left-4 w-10 h-10 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg flex items-center justify-center font-bold font-mono shadow-lg group-hover:scale-110 transition-transform">3</div>
                     <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 font-mono mt-2">Vote & Act</h3>
                     <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                        Upvote the most critical issues. Assign action items and export the results to PDF or CSV for your next sprint planning.
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

               <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-6 h-auto md:h-[600px]">
                  {/* Large Item: Templates */}
                  <div className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-3xl bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-gray-800 p-8 group">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-brand-500/20"></div>
                     <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 font-mono relative z-10">Ready-to-use Templates</h3>
                     <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md relative z-10">
                        Don't reinvent the wheel. Choose from industry-standard retrospective formats or create your own custom columns.
                     </p>
                     <div className="relative z-10 grid grid-cols-2 gap-4">
                        {['Start, Stop, Continue', 'Mad, Sad, Glad', '4Ls (Liked, Learned...)', 'Lean Coffee'].map(t => (
                           <div key={t} className="bg-white dark:bg-dark-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>
                              </div>
                              <span className="font-medium text-sm text-gray-900 dark:text-white">{t}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Small Item: Timer */}
                  <div className="relative overflow-hidden rounded-3xl bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-gray-800 p-8 group">
                     <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                        </div>
                        <span className="text-2xl font-mono font-bold text-gray-900 dark:text-white">05:00</span>
                     </div>
                     <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 font-mono">Built-in Timer</h3>
                     <p className="text-sm text-gray-500 dark:text-gray-400">Keep your meetings on track with a shared countdown timer.</p>
                  </div>

                  {/* Small Item: Focus Mode */}
                  <div className="relative overflow-hidden rounded-3xl bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-gray-800 p-8 group">
                     <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                     </div>
                     <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 font-mono">Focus Mode</h3>
                     <p className="text-sm text-gray-500 dark:text-gray-400">Hide cards while writing to prevent groupthink and bias.</p>
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
