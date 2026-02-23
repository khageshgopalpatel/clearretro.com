import type { BlogPost } from '../blogPosts';

export const post10: BlogPost = {
  id: 'sailboat-retrospective-template-guide',
  slug: 'sailboat-retrospective-template-guide',
  title: 'The Sailboat Retrospective Template: How to Use It (2026)',
  excerpt: 'The Sailboat is one of the most popular visual retrospective formats. Learn how to use this metaphor to identify risks (Rocks), delays (Anchors), and enablers (Wind).',
  keywords: 'sailboat retrospective, agile retrospective ideas, visual retrospective, scrum master facilitation, team building',
  date: 'Dec 13, 2024',
  readTime: '18 min read',
  imageAlt: 'Sailboat retrospective diagram with wind, anchors, rocks, and island',
  image: '/images/blog/sailboat-retrospective-template-guide.png',
  faqs: [
    { question: "Do I need to be an artist to draw this?", answer: "No! A simple stick figure boat is fine. Or use a digital tool like Clear Retro that has the image pre-loaded." },
    { question: "What is the difference between 'Anchors' and 'Rocks'?", answer: "'Anchors' are things currently slowing you down (e.g., technical debt). 'Rocks' are future risks (e.g., a key team member going on leave)." },
    { question: "Can I add more elements?", answer: "Yes! Some teams add 'The Sun' (what makes us happy) or 'Sharks' (competitors)." }
  ],
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "The Sailboat Retrospective Template: How to Use It",
    "image": ["https://placehold.co/1200x630/2dd4bf/ffffff?text=Sailboat+Retro"],
    "author": { "@type": "Organization", "name": "Clear Retro" },
    "publisher": { "@type": "Organization", "name": "Clear Retro", "logo": { "@type": "ImageObject", "url": "https://clearretro.com/logo.png" } }
  },
  content: `
    <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-8 font-mono">The Sailboat Retrospective Template: How to Use It</h1>

    <div class="my-10 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
       <img src="https://placehold.co/1200x600/18181b/2dd4bf?text=Visualizing+The+Journey" alt="Sailboat retrospective illustration" class="w-full h-auto object-cover" />
    </div>

    <p class="text-xl leading-relaxed text-gray-600 dark:text-gray-300 mb-8">
      Humans are visual creatures. We process images 60,000 times faster than text.
    </p>

    <p class="mb-8 text-lg leading-relaxed">
      That is why the <strong>Sailboat Retrospective</strong> is so effective. It moves the team away from lists of bullet points and into a shared visual metaphor. It helps the team see the "big picture" of their journey.
    </p>

    <hr class="my-12 border-gray-200 dark:border-gray-800" />

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">The Metaphor Explained</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
       <div class="p-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl">
          <h3 class="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-4">🌬️ Wind (Sails)</h3>
          <p class="text-gray-700 dark:text-gray-300">
            What is pushing us forward? What gives us speed?
            <br/><br/>
            <strong>Examples:</strong>
            <ul class="list-disc pl-4 mt-2 text-sm">
              <li>"Clear requirements"</li>
              <li>"Automated deployments"</li>
              <li>"Team morale"</li>
            </ul>
          </p>
       </div>
       <div class="p-6 bg-gray-50 dark:bg-gray-900/10 border border-gray-200 dark:border-gray-800 rounded-xl">
          <h3 class="text-2xl font-bold text-gray-700 dark:text-gray-400 mb-4">⚓ Anchors</h3>
          <p class="text-gray-700 dark:text-gray-300">
            What is holding us back? What creates drag?
            <br/><br/>
            <strong>Examples:</strong>
            <ul class="list-disc pl-4 mt-2 text-sm">
              <li>"Legacy code"</li>
              <li>"Manual testing"</li>
              <li>"Too many meetings"</li>
            </ul>
          </p>
       </div>
       <div class="p-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl">
          <h3 class="text-2xl font-bold text-red-700 dark:text-red-400 mb-4">🪨 Rocks</h3>
          <p class="text-gray-700 dark:text-gray-300">
            What risks are ahead? What could sink us?
            <br/><br/>
            <strong>Examples:</strong>
            <ul class="list-disc pl-4 mt-2 text-sm">
              <li>"API rate limits"</li>
              <li>"Competitor launching a similar feature"</li>
              <li>"Key developer going on leave"</li>
            </ul>
          </p>
       </div>
       <div class="p-6 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-xl">
          <h3 class="text-2xl font-bold text-green-700 dark:text-green-400 mb-4">🏝️ Island</h3>
          <p class="text-gray-700 dark:text-gray-300">
            What is our destination? What is the goal?
            <br/><br/>
            <strong>Examples:</strong>
            <ul class="list-disc pl-4 mt-2 text-sm">
              <li>"Release v2.0"</li>
              <li>"10,000 active users"</li>
              <li>"Zero bugs in backlog"</li>
            </ul>
          </p>
       </div>
    </div>

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">Why Use It?</h2>
    <p class="mb-4">
      The Sailboat is particularly good for <strong>Risk Management</strong>.
    </p>
    <p class="mb-4">
      Most retrospectives focus on the past (what happened). The Sailboat asks you to look at the future (Rocks). This allows the team to be proactive rather than reactive.
    </p>

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">Facilitation Tips</h2>
    <ul class="list-disc pl-6 mb-6 space-y-4">
      <li><strong>Draw it out:</strong> If you are in person, draw a boat on the whiteboard. It makes it fun.</li>
      <li><strong>Focus on the Anchors:</strong> "Cut the anchor" is a powerful metaphor. Ask the team: "If we could cut one anchor today, which one would make the boat go fastest?"</li>
      <li><strong>Navigate the Rocks:</strong> For every Rock identified, ask: "How do we steer around this?"</li>
    </ul>

    <hr class="my-12 border-gray-200 dark:border-gray-800" />

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">Conclusion</h2>
    <p class="mb-6">
      If your team is feeling stuck or bored, hoist the sails. The Sailboat retrospective is a fun, engaging way to get everyone aligned on the vision and the risks.
    </p>
    <p class="mb-6">
      <strong>Ready to set sail?</strong> <a href="/#/dashboard" class="text-brand-500 underline">Clear Retro</a> has a digital Sailboat template ready for your next meeting.
    </p>
  `
};
