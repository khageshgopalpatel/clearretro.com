
import React, { useEffect } from 'react';

const About: React.FC = () => {
  useEffect(() => {
    document.title = "About Us | Clear Retro";
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 font-mono tracking-tight">About Us</h1>
        <p className="text-gray-500 dark:text-gray-400 font-mono text-sm uppercase tracking-widest">Built by Developers, For Developers</p>
      </div>

      <div className="bg-white dark:bg-dark-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 md:p-16 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none">
          <svg className="w-64 h-64 text-brand-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none 
          prose-headings:font-mono prose-headings:font-bold prose-headings:tracking-tight
          prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-6 prose-h3:text-gray-900 dark:prose-h3:text-white
          prose-h3:border-l-4 prose-h3:border-brand-500 prose-h3:pl-4
          prose-p:leading-8 prose-p:text-gray-600 dark:prose-p:text-gray-400 
          prose-li:text-gray-600 dark:prose-li:text-gray-400 prose-li:my-2
          prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-bold">

          <p className="lead text-xl text-gray-700 dark:text-gray-300 mb-10">
            <strong>Clear Retro</strong> was born out of frustration. As senior engineers, we found most retrospective tools to be cluttered, slow, or trying to do too much. We wanted a tool that felt like an IDE: fast, keyboard-centric, and distraction-free.
          </p>

          <div className="my-8 h-px bg-gray-100 dark:bg-gray-800 w-full"></div>

          <h3>Our Mission</h3>
          <p>
            Our mission is to make Agile ceremonies efficient and actionable. We believe that a good retrospective isn't just about venting—it's about identifying concrete steps to improve velocity and team health.
          </p>

          <h3>Why JetBrains Mono?</h3>
          <p>
            Because code is our craft. We use a monospaced font not just for aesthetics, but to treat feedback with the same precision, readability, and structure that we treat our codebase.
          </p>

          <h3>The Team</h3>
          <p>
            We are a small, distributed team of senior engineers and product designers passionate about developer productivity. We build tools that we use ourselves every single sprint.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
