import type { BlogPost } from '../blogPosts';

export const post5: BlogPost = {
  id: 'sprint-retro-questions-40-examples',
  slug: 'sprint-retro-questions-40-examples',
  title: 'Sprint Retro Questions: 40 Examples That Improve Team Culture (2025)',
  excerpt: 'Asking the right questions can unlock deep insights. Here are 40 powerful questions categorized by goal: from "Icebreakers" to "Deep Dives" and "Future Planning".',
  keywords: 'sprint retrospective questions, agile icebreakers, team culture questions, scrum master questions, retrospective prompts',
  date: 'Dec 08, 2024',
  readTime: '22 min read',
  imageAlt: 'Team discussing retrospective questions on a digital board',
  faqs: [
    { question: "How many questions should I ask in one retro?", answer: "Don't overwhelm the team. Pick 1-2 main questions for the 'Gather Data' phase. You can use more for icebreakers or closing." },
    { question: "What if the team answers with silence?", answer: "Silence is okay. Give them time to think. If it persists, try rephrasing the question or use an anonymous poll to lower the barrier to entry." },
    { question: "Should I send questions in advance?", answer: "Yes! Sending the questions 24 hours before the meeting allows introverts to process their thoughts and leads to richer discussions." }
  ],
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Sprint Retro Questions: 40 Examples That Improve Team Culture",
    "image": ["https://placehold.co/1200x630/2dd4bf/ffffff?text=40+Retro+Questions"],
    "author": { "@type": "Organization", "name": "Clear Retro" },
    "publisher": { "@type": "Organization", "name": "Clear Retro", "logo": { "@type": "ImageObject", "url": "https://clear-retro.com/logo.png" } }
  },
  content: `
    <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-8 font-mono">Sprint Retro Questions: 40 Examples That Improve Team Culture</h1>

    <div class="my-10 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
       <img src="https://placehold.co/1200x600/18181b/2dd4bf?text=Unlock+Insights+With+Better+Questions" alt="List of retrospective questions" class="w-full h-auto object-cover" />
    </div>

    <p class="text-xl leading-relaxed text-gray-600 dark:text-gray-300 mb-8">
      The quality of your retrospective depends on the quality of your questions.
    </p>

    <p class="mb-8 text-lg leading-relaxed">
      If you ask "What went well?", you'll get generic answers. If you ask "What was the single most frustrating moment of the sprint?", you'll get a story.
    </p>

    <p class="mb-8 text-lg leading-relaxed">
      Here are <strong>40 powerful questions</strong> categorized by their purpose, designed to help you dig deeper and build a stronger engineering culture.
    </p>

    <hr class="my-12 border-gray-200 dark:border-gray-800" />

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">I. Celebrating Success (Positive Reinforcement)</h2>
    <p class="mb-4">Start on a high note. These questions build morale.</p>
    <ol class="list-decimal pl-6 mb-6 space-y-4 marker:text-brand-500 marker:font-bold">
      <li><strong>What was our biggest win this sprint?</strong> (Focus on outcomes, not just output.)</li>
      <li><strong>Who helped you the most this week?</strong> (Encourages gratitude.)</li>
      <li><strong>What did we learn that we didn't know two weeks ago?</strong> (Focus on growth.)</li>
      <li><strong>What was the most fun part of this sprint?</strong></li>
      <li><strong>Which process change from the last retro actually worked?</strong> (Validates the retro process itself.)</li>
      <li><strong>What are you proud of achieving personally?</strong></li>
      <li><strong>What feedback did we get from stakeholders that was positive?</strong></li>
      <li><strong>How did we live up to our team values this sprint?</strong></li>
      <li><strong>What was the smoothest part of our workflow?</strong></li>
      <li><strong>If we could bottle one thing from this sprint and keep it forever, what would it be?</strong></li>
    </ol>

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">II. Uncovering Challenges (The "Real" Talk)</h2>
    <p class="mb-4">These questions are designed to find the hidden problems.</p>
    <ol class="list-decimal pl-6 mb-6 space-y-4 marker:text-red-500 marker:font-bold" start="11">
      <li><strong>What was the biggest bottleneck in our pipeline?</strong></li>
      <li><strong>Where did we waste the most time?</strong> (Meetings? Waiting for reviews?)</li>
      <li><strong>What kept you up at night?</strong> (Reveals hidden risks.)</li>
      <li><strong>If you could wave a magic wand and fix one thing, what would it be?</strong></li>
      <li><strong>What conversation are we avoiding?</strong> (The "Elephant in the room" question.)</li>
      <li><strong>Did we over-commit? If so, why?</strong></li>
      <li><strong>What tools fought against us this sprint?</strong></li>
      <li><strong>Where did communication break down?</strong></li>
      <li><strong>What was the most confusing requirement?</strong></li>
      <li><strong>If we had to do this sprint over, what would we do differently?</strong></li>
    </ol>

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">III. Team Culture & Safety</h2>
    <p class="mb-4">Focus on the <em>people</em>, not just the code.</p>
    <ol class="list-decimal pl-6 mb-6 space-y-4 marker:text-blue-500 marker:font-bold" start="21">
      <li><strong>Did you feel safe to ask for help?</strong></li>
      <li><strong>How are our energy levels?</strong> (Burnout check.)</li>
      <li><strong>Did everyone feel heard in our meetings?</strong></li>
      <li><strong>Are we having fun?</strong></li>
      <li><strong>Do we trust each other to deliver?</strong></li>
      <li><strong>How can we support each other better next sprint?</strong></li>
      <li><strong>Did we respect our "Focus Time"?</strong></li>
      <li><strong>Are we learning enough?</strong></li>
      <li><strong>Do we feel connected to the product vision?</strong></li>
      <li><strong>What is one thing that would make our team environment 1% better?</strong></li>
    </ol>

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">IV. Future Planning (Action Oriented)</h2>
    <p class="mb-4">Focus on the future.</p>
    <ol class="list-decimal pl-6 mb-6 space-y-4 marker:text-green-500 marker:font-bold" start="31">
      <li><strong>What is the #1 thing we must fix before the next release?</strong></li>
      <li><strong>What experiment do we want to run next sprint?</strong></li>
      <li><strong>How can we speed up our code reviews?</strong></li>
      <li><strong>What skill do we need to acquire as a team?</strong></li>
      <li><strong>How can we improve our definition of "Done"?</strong></li>
      <li><strong>What risk is looming on the horizon?</strong></li>
      <li><strong>How can we make our daily standups more valuable?</strong></li>
      <li><strong>What can we automate?</strong></li>
      <li><strong>Who needs to be involved in our planning earlier?</strong></li>
      <li><strong>What is our goal for the next retrospective?</strong></li>
    </ol>

    <hr class="my-12 border-gray-200 dark:border-gray-800" />

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">Conclusion</h2>
    <p class="mb-6">
      Don't ask all 40 questions at once! Pick 2-3 that are relevant to your team's current situation. Rotate them to keep things fresh.
    </p>
    <p class="mb-6">
      <strong>Pro Tip:</strong> In <a href="/#/dashboard" class="text-brand-500 underline">Clear Retro</a>, you can create custom column headers. Instead of "Start/Stop", try labeling your columns with these questions (e.g., "What kept you up at night?" / "What was our biggest win?").
    </p>
  `
};
