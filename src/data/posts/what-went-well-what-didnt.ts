import type { BlogPost } from '../blogPosts';

export const post7: BlogPost = {
  id: 'what-went-well-what-didnt-retrospective-examples',
  slug: 'what-went-well-what-didnt-retrospective-examples',
  title: 'What Went Well, What Didn’t: Explained With Examples (2025)',
  excerpt: 'The most popular retrospective format explained. We provide 50+ examples of what to write on your sticky notes to get the conversation started.',
  keywords: 'what went well what didnt, retrospective examples, agile retrospective ideas, scrum master guide, retrospective sticky notes',
  date: 'Dec 10, 2024',
  readTime: '12 min read',
  imageAlt: 'Team brainstorming what went well and what didnt on a whiteboard',
  image: '/images/blog/what-went-well-what-didnt-retrospective-examples.png',
  faqs: [
    { question: "What if people only write 'Good job'?", answer: "Challenge them to be specific. 'Good job on what?' 'The API refactor.' 'Why was it good?' 'It reduced latency by 50ms.'" },
    { question: "How do I stop the 'What Didn't Go Well' column from becoming toxic?", answer: "Enforce the 'No Blame' rule. Focus on systems, not people. Instead of 'John broke the build', write 'The build process is fragile'." },
    { question: "Should we vote on 'What Went Well' items?", answer: "Generally, no. Voting is for prioritizing problems to fix. You can simply celebrate all the wins." }
  ],
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "What Went Well, What Didn’t: Explained With Examples",
    "image": ["https://placehold.co/1200x630/2dd4bf/ffffff?text=What+Went+Well"],
    "author": { "@type": "Organization", "name": "Clear Retro" },
    "publisher": { "@type": "Organization", "name": "Clear Retro", "logo": { "@type": "ImageObject", "url": "https://clearretro.com/logo.png" } }
  },
  content: `
    <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-8 font-mono">What Went Well, What Didn’t: Explained With Examples</h1>

    <div class="my-10 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
       <img src="https://placehold.co/1200x600/18181b/2dd4bf?text=The+Classic+Retro+Format" alt="What Went Well What Didnt diagram" class="w-full h-auto object-cover" />
    </div>

    <p class="text-xl leading-relaxed text-gray-600 dark:text-gray-300 mb-8">
      It is the vanilla ice cream of retrospectives. Simple. Classic. Reliable.
    </p>

    <p class="mb-8 text-lg leading-relaxed">
      But "simple" doesn't mean "easy". Many teams struggle to get past surface-level comments like "Good sprint" or "Too many bugs".
    </p>

    <p class="mb-8 text-lg leading-relaxed">
      In this guide, we will provide you with <strong>50+ concrete examples</strong> of what to write in these columns to spark deep, meaningful debate.
    </p>

    <hr class="my-12 border-gray-200 dark:border-gray-800" />

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">Column 1: What Went Well</h2>
    <p class="mb-4">
      This is not just for patting yourselves on the back. It is for identifying <strong>repeatable success</strong>.
    </p>

    <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-8 mb-4">Examples: Process</h3>
    <ul class="list-disc pl-6 mb-6 space-y-2">
      <li>"The new code review checklist caught 3 critical bugs before QA."</li>
      <li>"Daily standups finished in 10 minutes every day."</li>
      <li>"Refinement sessions were well-prepared; stories had clear acceptance criteria."</li>
      <li>"We swarmed on the 'Checkout' ticket and finished it in 1 day."</li>
    </ul>

    <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-8 mb-4">Examples: Tools</h3>
    <ul class="list-disc pl-6 mb-6 space-y-2">
      <li>"Copilot helped me write the unit tests 2x faster."</li>
      <li>"The new CI runner reduced build time by 5 minutes."</li>
      <li>"Clear Retro's timer kept us focused during the retro."</li>
    </ul>

    <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-8 mb-4">Examples: People</h3>
    <ul class="list-disc pl-6 mb-6 space-y-2">
      <li>"Sarah jumped in to help me debug the auth issue on Friday night."</li>
      <li>"The design team gave us assets 2 days early."</li>
      <li>"We respected the 'No Meeting Wednesday' rule."</li>
    </ul>

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">Column 2: What Didn't Go Well</h2>
    <p class="mb-4">
      This is the meat of the retrospective. Be honest, but be kind.
    </p>

    <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-8 mb-4">Examples: Process</h3>
    <ul class="list-disc pl-6 mb-6 space-y-2">
      <li>"We underestimated the complexity of the 'Search' feature."</li>
      <li>"Scope creep: 3 new tickets were added mid-sprint."</li>
      <li>"QA didn't get the build until Thursday, leaving no time for fixes."</li>
      <li>"Too many context switches between projects."</li>
    </ul>

    <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-8 mb-4">Examples: Communication</h3>
    <ul class="list-disc pl-6 mb-6 space-y-2">
      <li>"I didn't know who was working on the API endpoint."</li>
      <li>"The requirements in Jira were vague."</li>
      <li>"We debated the database schema for 3 days without a decision."</li>
    </ul>

    <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-8 mb-4">Examples: Environment</h3>
    <ul class="list-disc pl-6 mb-6 space-y-2">
      <li>"The staging environment was down for 4 hours."</li>
      <li>"Too many meetings interrupted my flow state."</li>
      <li>"My laptop is slow when running the Docker containers."</li>
    </ul>

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">How to Facilitate It</h2>
    <p class="mb-4">
      <strong>Step 1:</strong> Set the timer for 10 minutes.
    </p>
    <p class="mb-4">
      <strong>Step 2:</strong> Ask everyone to write at least 2 cards for each column.
    </p>
    <p class="mb-4">
      <strong>Step 3:</strong> Group the cards. (e.g., put all "Slow CI" cards together).
    </p>
    <p class="mb-4">
      <strong>Step 4:</strong> Vote on the "What Didn't Go Well" items.
    </p>
    <p class="mb-4">
      <strong>Step 5:</strong> Create an action item for the top vote-getter.
    </p>

    <hr class="my-12 border-gray-200 dark:border-gray-800" />

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">Conclusion</h2>
    <p class="mb-6">
      The "What Went Well" retrospective is a classic for a reason. It works.
    </p>
    <p class="mb-6">
      <strong>Ready to run one?</strong> <a href="/#/dashboard" class="text-brand-500 underline">Clear Retro</a> lets you spin up this board in seconds.
    </p>
  `
};
