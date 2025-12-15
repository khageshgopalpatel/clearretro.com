import type { BlogPost } from '../blogPosts';

export const post6: BlogPost = {
  id: 'start-stop-continue-retrospective-template',
  slug: 'start-stop-continue-retrospective-template',
  title: 'Start Stop Continue Template: The Ultimate Guide (Free Download)',
  excerpt: 'The "Start, Stop, Continue" retrospective is the gold standard for action-oriented teams. Learn how to facilitate it effectively and download our free template.',
  keywords: 'start stop continue template, retrospective templates, agile facilitation, scrum master resources, continuous improvement',
  date: 'Dec 09, 2024',
  readTime: '15 min read',
  imageAlt: 'Start Stop Continue retrospective board with sticky notes',
  image: '/images/blog/start-stop-continue-retrospective-template.png',
  faqs: [
    { question: "What is the difference between 'Stop' and 'Lacked'?", answer: "'Stop' is about active behaviors that are harmful (e.g., 'Stop interrupting'). 'Lacked' (from the 4Ls) is about missing resources (e.g., 'Lacked design specs')." },
    { question: "How many items should be in each column?", answer: "Quality over quantity. Aim for 3-5 high-impact items per column rather than a laundry list of 20 minor complaints." },
    { question: "Can I use this for personal retrospectives?", answer: "Absolutely! It's a great framework for personal growth reviews or 1:1 performance conversations." }
  ],
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Start Stop Continue Template: The Ultimate Guide",
    "image": ["https://placehold.co/1200x630/2dd4bf/ffffff?text=Start+Stop+Continue"],
    "author": { "@type": "Organization", "name": "Clear Retro" },
    "publisher": { "@type": "Organization", "name": "Clear Retro", "logo": { "@type": "ImageObject", "url": "https://clearretro.com/logo.png" } }
  },
  content: `
    <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-8 font-mono">Start Stop Continue Template: The Ultimate Guide</h1>

    <div class="my-10 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
       <img src="https://placehold.co/1200x600/18181b/2dd4bf?text=Start+Stop+Continue+Framework" alt="Start Stop Continue diagram" class="w-full h-auto object-cover" />
    </div>

    <p class="text-xl leading-relaxed text-gray-600 dark:text-gray-300 mb-8">
      Sometimes, the simplest tools are the most powerful.
    </p>

    <p class="mb-8 text-lg leading-relaxed">
      The <strong>Start, Stop, Continue</strong> retrospective is the "Swiss Army Knife" of Agile. It cuts through the noise and forces the team to focus on <strong>behavior change</strong>. Unlike "Mad Sad Glad" which focuses on emotion, this template focuses on <strong>action</strong>.
    </p>

    <hr class="my-12 border-gray-200 dark:border-gray-800" />

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">The Three Pillars</h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
       <div class="p-6 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-xl">
          <h3 class="text-2xl font-bold text-green-700 dark:text-green-400 mb-4">🟢 Start</h3>
          <p class="text-gray-700 dark:text-gray-300">
            What should we begin doing?
            <br/><br/>
            <strong>Examples:</strong>
            <ul class="list-disc pl-4 mt-2 text-sm">
              <li>Pair programming</li>
              <li>Writing unit tests before code</li>
              <li>Inviting design to standup</li>
            </ul>
          </p>
       </div>
       <div class="p-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl">
          <h3 class="text-2xl font-bold text-red-700 dark:text-red-400 mb-4">🔴 Stop</h3>
          <p class="text-gray-700 dark:text-gray-300">
            What is not adding value?
            <br/><br/>
            <strong>Examples:</strong>
            <ul class="list-disc pl-4 mt-2 text-sm">
              <li>Meetings without agendas</li>
              <li>Merging PRs without review</li>
              <li>Multitasking during calls</li>
            </ul>
          </p>
       </div>
       <div class="p-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl">
          <h3 class="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-4">🔵 Continue</h3>
          <p class="text-gray-700 dark:text-gray-300">
            What is working well?
            <br/><br/>
            <strong>Examples:</strong>
            <ul class="list-disc pl-4 mt-2 text-sm">
              <li>Friday demo sessions</li>
              <li>Using the new linter</li>
              <li>Social hour</li>
            </ul>
          </p>
       </div>
    </div>

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">How to Facilitate It (Step-by-Step)</h2>

    <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-8 mb-4">1. Brainstorm (10 Minutes)</h3>
    <p class="mb-4">
      Ask the team to silently add cards to each column.
      <br/>
      <strong>Facilitator Prompt:</strong> "Think about the last 2 weeks. What habits helped us? What habits hurt us?"
    </p>

    <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-8 mb-4">2. Group & Vote (10 Minutes)</h3>
    <p class="mb-4">
      Cluster similar ideas. If 5 people wrote "Too many meetings" in the Stop column, group them. Then, use dot voting to find the top priority.
    </p>

    <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-8 mb-4">3. Discuss (20 Minutes)</h3>
    <p class="mb-4">
      Focus on the top voted items.
      <br/>
      <strong>Crucial Question:</strong> "What is the root cause of this behavior?"
      <br/>
      If people want to "Stop" long meetings, ask <em>why</em> the meetings are long. Is it a lack of agenda? Is it the wrong attendees?
    </p>

    <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-8 mb-4">4. Action Items (10 Minutes)</h3>
    <p class="mb-4">
      Turn the "Start" and "Stop" items into concrete tasks.
      <br/>
      "Stop long meetings" -> <strong>Action:</strong> "Scrum Master will enforce a hard stop at 15 minutes for Standup."
    </p>

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">Common Pitfalls</h2>
    <ul class="list-disc pl-6 mb-6 space-y-4">
      <li><strong>The "Stop" column is empty:</strong> This usually means the team is afraid of conflict. Remind them that criticizing a <em>process</em> is not criticizing a <em>person</em>.</li>
      <li><strong>The "Start" column is a wish list:</strong> "Start using Rust" might be a great idea, but is it feasible next sprint? Keep it realistic.</li>
      <li><strong>Ignoring "Continue":</strong> Don't skip this! Celebrating wins releases dopamine and reinforces good behavior.</li>
    </ul>

    <hr class="my-12 border-gray-200 dark:border-gray-800" />

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">Free Template</h2>
    <p class="mb-6">
      You don't need to draw this on a whiteboard every time.
    </p>
    <div class="bg-brand-50 dark:bg-brand-900/20 p-8 rounded-2xl text-center border border-brand-200 dark:border-brand-800">
      <h3 class="text-2xl font-bold text-brand-700 dark:text-brand-300 mb-4">🚀 Launch this template in 1 click</h3>
      <p class="mb-6 text-gray-600 dark:text-gray-400">
        Start a new board with the "Start, Stop, Continue" preset pre-loaded. No signup required.
      </p>
      <a href="/#/dashboard" class="inline-block px-8 py-4 bg-brand-600 text-white font-bold rounded-lg shadow-lg hover:bg-brand-700 transition-all hover:-translate-y-1">
        Start Free Retro
      </a>
    </div>
  `
};
