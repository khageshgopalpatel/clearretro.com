import type { BlogPost } from '../blogPosts';

export const post11: BlogPost = {
  id: 'agile-action-items-guide',
  slug: 'agile-action-items-guide',
  title: 'Action Items in Agile: How to Make Them Stick (2025)',
  excerpt: 'A retrospective without action items is just a complaint session. Learn how to write SMART action items that actually get done.',
  keywords: 'agile action items, retrospective follow-up, smart goals, scrum master tips, continuous improvement',
  date: 'Dec 14, 2024',
  readTime: '13 min read',
  imageAlt: 'Team reviewing action items on a Kanban board',
  image: '/images/blog/agile-action-items-guide.png',
  faqs: [
    { question: "Who should own an action item?", answer: "A single person. If 'The Team' owns it, no one owns it. Assign it to a specific individual who is responsible for driving it forward." },
    { question: "How many action items should we have?", answer: "Less is more. Aim for 1-2 high-impact items per sprint. If you have 10, you will do none of them." },
    { question: "What if we don't complete our action items?", answer: "Discuss it in the next retro! 'Why didn't we do this?' is a valid retro topic. Maybe it wasn't important, or maybe you are too busy." }
  ],
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Action Items in Agile: How to Make Them Stick",
    "image": ["https://placehold.co/1200x630/2dd4bf/ffffff?text=Action+Items"],
    "author": { "@type": "Organization", "name": "Clear Retro" },
    "publisher": { "@type": "Organization", "name": "Clear Retro", "logo": { "@type": "ImageObject", "url": "https://clear-retro.com/logo.png" } }
  },
  content: `
    <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-8 font-mono">Action Items in Agile: How to Make Them Stick</h1>

    <div class="my-10 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
       <img src="https://placehold.co/1200x600/18181b/2dd4bf?text=From+Talk+To+Action" alt="Action items checklist" class="w-full h-auto object-cover" />
    </div>

    <p class="text-xl leading-relaxed text-gray-600 dark:text-gray-300 mb-8">
      We've all been there. The retro was great. The discussion was lively. Everyone agreed we need to "improve communication."
    </p>

    <p class="mb-8 text-lg leading-relaxed">
      Two weeks later, nothing has changed.
    </p>

    <p class="mb-8 text-lg leading-relaxed">
      Why? Because "improve communication" is not an action item. It's a wish.
    </p>

    <hr class="my-12 border-gray-200 dark:border-gray-800" />

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">The SMART Framework</h2>
    <p class="mb-4">
      To make action items stick, they must be <strong>SMART</strong>.
    </p>

    <div class="space-y-6 my-8">
      <div class="p-6 bg-gray-50 dark:bg-gray-900/20 rounded-xl border-l-4 border-brand-500">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">Specific</h3>
        <p class="text-gray-600 dark:text-gray-400">
          <strong>Bad:</strong> "Fix the tests."<br/>
          <strong>Good:</strong> "Rewrite the flaky 'UserLogin' test to use mocks instead of the real database."
        </p>
      </div>
      <div class="p-6 bg-gray-50 dark:bg-gray-900/20 rounded-xl border-l-4 border-brand-500">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">Measurable</h3>
        <p class="text-gray-600 dark:text-gray-400">
          <strong>Bad:</strong> "Make the app faster."<br/>
          <strong>Good:</strong> "Reduce the homepage load time to under 2 seconds."
        </p>
      </div>
      <div class="p-6 bg-gray-50 dark:bg-gray-900/20 rounded-xl border-l-4 border-brand-500">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">Achievable</h3>
        <p class="text-gray-600 dark:text-gray-400">
          Can we actually do this in the next sprint? If it takes 3 months, it's a project, not an action item.
        </p>
      </div>
      <div class="p-6 bg-gray-50 dark:bg-gray-900/20 rounded-xl border-l-4 border-brand-500">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">Relevant</h3>
        <p class="text-gray-600 dark:text-gray-400">
          Does this solve the problem we discussed?
        </p>
      </div>
      <div class="p-6 bg-gray-50 dark:bg-gray-900/20 rounded-xl border-l-4 border-brand-500">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">Time-bound</h3>
        <p class="text-gray-600 dark:text-gray-400">
          <strong>Bad:</strong> "Update the docs."<br/>
          <strong>Good:</strong> "Update the README by Friday."
        </p>
      </div>
    </div>

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">Where to Put Them?</h2>
    <p class="mb-4">
      Action items often die because they live in a Google Doc that no one looks at.
    </p>
    <p class="mb-4">
      <strong>Rule:</strong> Treat action items like code.
    </p>
    <ul class="list-disc pl-6 mb-6 space-y-2">
      <li>Put them in Jira/Linear/Trello.</li>
      <li>Assign them points (if you point tasks).</li>
      <li>Review them in the Daily Standup.</li>
    </ul>

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">The "100% Done" Rule</h2>
    <p class="mb-4">
      An action item is binary. It is either done or not done.
    </p>
    <p class="mb-4">
      If you find yourself saying "I kinda started it...", then the item was too vague. Break it down.
    </p>

    <hr class="my-12 border-gray-200 dark:border-gray-800" />

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">Conclusion</h2>
    <p class="mb-6">
      The health of a team is measured by how many action items they complete.
    </p>
    <p class="mb-6">
      <strong>Need help tracking?</strong> <a href="/#/dashboard" class="text-brand-500 underline">Clear Retro</a> has a built-in Action Items list that carries over from sprint to sprint, so you never forget a task.
    </p>
  `
};
