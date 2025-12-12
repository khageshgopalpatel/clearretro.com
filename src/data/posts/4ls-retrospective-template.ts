import type { BlogPost } from '../blogPosts';

export const post9: BlogPost = {
  id: '4ls-retrospective-template-liked-learned-lacked-longed-for',
  slug: '4ls-retrospective-template-liked-learned-lacked-longed-for',
  title: '4Ls Retrospective Template: Liked, Learned, Lacked, Longed For (2025)',
  excerpt: 'Move beyond "Good/Bad" with the 4Ls framework. This template encourages deep reflection on learning and desires, making it perfect for long-term projects.',
  keywords: '4Ls retrospective, liked learned lacked longed for, agile retrospective templates, scrum master guide, project post-mortem',
  date: 'Dec 12, 2024',
  readTime: '16 min read',
  imageAlt: '4Ls retrospective board with sticky notes',
  image: '/images/blog/4ls-retrospective-template-liked-learned-lacked-longed-for.png',
  faqs: [
    { question: "What is the difference between 'Lacked' and 'Longed For'?", answer: "'Lacked' is looking backward at what was missing (e.g., 'We lacked clear specs'). 'Longed For' is looking forward at what you desire (e.g., 'I long for a dedicated QA engineer')." },
    { question: "Is this template good for every sprint?", answer: "It can be, but it shines best after longer periods (like a quarter or a big release) because 'Learning' and 'Longing' often take time to develop." },
    { question: "How do I facilitate the 'Learned' column?", answer: "Encourage both technical and interpersonal learnings. 'I learned how to use GraphQL' is just as valid as 'I learned that John hates early meetings'." }
  ],
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "4Ls Retrospective Template: Liked, Learned, Lacked, Longed For",
    "image": ["https://placehold.co/1200x630/2dd4bf/ffffff?text=4Ls+Retrospective"],
    "author": { "@type": "Organization", "name": "Clear Retro" },
    "publisher": { "@type": "Organization", "name": "Clear Retro", "logo": { "@type": "ImageObject", "url": "https://clear-retro.com/logo.png" } }
  },
  content: `
    <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-8 font-mono">4Ls Retrospective Template: Liked, Learned, Lacked, Longed For</h1>

    <div class="my-10 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
       <img src="https://placehold.co/1200x600/18181b/2dd4bf?text=The+4Ls+Framework" alt="4Ls retrospective diagram" class="w-full h-auto object-cover" />
    </div>

    <p class="text-xl leading-relaxed text-gray-600 dark:text-gray-300 mb-8">
      Most retrospectives focus on <strong>execution</strong>: What did we do? How fast did we do it?
    </p>

    <p class="mb-8 text-lg leading-relaxed">
      The <strong>4Ls</strong> framework (created by Mary Gorman and Ellen Gottesdiener) focuses on <strong>learning and desire</strong>. It asks the team to step back from the daily grind and think about their professional growth and emotional needs.
    </p>

    <hr class="my-12 border-gray-200 dark:border-gray-800" />

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">The 4 Ls Explained</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
       <div class="p-6 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-xl">
          <h3 class="text-2xl font-bold text-green-700 dark:text-green-400 mb-4">👍 Liked</h3>
          <p class="text-gray-700 dark:text-gray-300">
            What did you appreciate? What brought you joy?
            <br/><br/>
            <strong>Examples:</strong>
            <ul class="list-disc pl-4 mt-2 text-sm">
              <li>"The collaboration on the new API."</li>
              <li>"Having flexible hours this week."</li>
              <li>"The new coffee machine!"</li>
            </ul>
          </p>
       </div>
       <div class="p-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl">
          <h3 class="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-4">🧠 Learned</h3>
          <p class="text-gray-700 dark:text-gray-300">
            What new knowledge did you gain?
            <br/><br/>
            <strong>Examples:</strong>
            <ul class="list-disc pl-4 mt-2 text-sm">
              <li>"I learned how Docker networking works."</li>
              <li>"I learned that our customers use the app mostly on mobile."</li>
              <li>"I learned that deploying on Fridays is a bad idea."</li>
            </ul>
          </p>
       </div>
       <div class="p-6 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-xl">
          <h3 class="text-2xl font-bold text-orange-700 dark:text-orange-400 mb-4">📉 Lacked</h3>
          <p class="text-gray-700 dark:text-gray-300">
            What was missing? What slowed you down?
            <br/><br/>
            <strong>Examples:</strong>
            <ul class="list-disc pl-4 mt-2 text-sm">
              <li>"Lacked clear acceptance criteria."</li>
              <li>"Lacked access to the production logs."</li>
              <li>"Lacked sleep due to the pager duty."</li>
            </ul>
          </p>
       </div>
       <div class="p-6 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 rounded-xl">
          <h3 class="text-2xl font-bold text-purple-700 dark:text-purple-400 mb-4">🧞 Longed For</h3>
          <p class="text-gray-700 dark:text-gray-300">
            What do you wish for? (Dream big!)
            <br/><br/>
            <strong>Examples:</strong>
            <ul class="list-disc pl-4 mt-2 text-sm">
              <li>"I long for automated E2E tests."</li>
              <li>"I long for a dedicated designer."</li>
              <li>"I long for a 4-day work week."</li>
            </ul>
          </p>
       </div>
    </div>

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">Why "Learned" Matters</h2>
    <p class="mb-4">
      The "Learned" quadrant is the secret weapon of high-performing teams.
    </p>
    <p class="mb-4">
      If a team isn't learning, they are stagnating. By explicitly asking "What did you learn?", you force team members to reflect on their growth. If this column is empty week after week, it's a huge red flag that the work has become repetitive.
    </p>

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">Why "Longed For" Matters</h2>
    <p class="mb-4">
      "Longed For" allows the team to dream. It breaks them out of the "fix the bug" mindset and into the "architect the future" mindset.
    </p>
    <p class="mb-4">
      Even if you can't give them a 4-day work week immediately, knowing that they <em>want</em> it helps you understand their motivations.
    </p>

    <hr class="my-12 border-gray-200 dark:border-gray-800" />

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">Conclusion</h2>
    <p class="mb-6">
      The 4Ls is a refreshing break from the standard retro. It humanizes the team and focuses on growth.
    </p>
    <p class="mb-6">
      <strong>Try it now:</strong> <a href="/#/dashboard" class="text-brand-500 underline">Clear Retro</a> has a beautiful 4Ls template ready to go.
    </p>
  `
};
