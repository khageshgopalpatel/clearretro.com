import type { BlogPost } from '../blogPosts';

export const post15: BlogPost = {
  id: '10-retrospective-anti-patterns',
  slug: '10-retrospective-anti-patterns',
  title: '10 Retrospective Anti-Patterns (And How to Fix Them) (2025)',
  excerpt: 'Is your retro a "Groundhog Day" where the same issues come up every week? Or a "Blame Game"? Identify these 10 toxic patterns and learn how to break them.',
  keywords: 'retrospective anti-patterns, agile mistakes, scrum master tips, bad retrospectives, continuous improvement',
  date: 'Dec 18, 2024',
  readTime: '22 min read',
  imageAlt: 'Team looking frustrated during a retrospective',
  faqs: [
    { question: "What is the most common anti-pattern?", answer: "'No Action Items'. Teams talk for an hour but decide to do nothing. This kills morale faster than anything else." },
    { question: "How do I fix 'The Loudmouth'?", answer: "Use a talking stick (or a digital timer). Enforce a 'No Interruptions' rule. If they keep dominating, talk to them privately." },
    { question: "Is it okay to skip a retro if the sprint went well?", answer: "No! That is the 'Peak End Rule' trap. Even good sprints have lessons. Use the time to celebrate and reinforce what worked." }
  ],
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "10 Retrospective Anti-Patterns (And How to Fix Them)",
    "image": ["https://placehold.co/1200x630/2dd4bf/ffffff?text=Retro+Anti-Patterns"],
    "author": { "@type": "Organization", "name": "Clear Retro" },
    "publisher": { "@type": "Organization", "name": "Clear Retro", "logo": { "@type": "ImageObject", "url": "https://clear-retro.com/logo.png" } }
  },
  content: `
    <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-8 font-mono">10 Retrospective Anti-Patterns (And How to Fix Them)</h1>

    <div class="my-10 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
       <img src="https://placehold.co/1200x600/18181b/2dd4bf?text=Stop+Doing+This" alt="Anti-patterns warning sign" class="w-full h-auto object-cover" />
    </div>

    <p class="text-xl leading-relaxed text-gray-600 dark:text-gray-300 mb-8">
      A bad retrospective is worse than no retrospective. It wastes time and breeds cynicism.
    </p>

    <p class="mb-8 text-lg leading-relaxed">
      Here are the 10 most common ways teams ruin their retrospectives, and how to fix them.
    </p>

    <hr class="my-12 border-gray-200 dark:border-gray-800" />

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">1. Groundhog Day</h2>
    <p class="mb-4">
      <strong>The Pattern:</strong> The same issues come up every single sprint. "The tests are flaky." "Requirements are vague."
    </p>
    <p class="mb-4">
      <strong>The Fix:</strong> Stop talking and start doing. Pick ONE issue and swarm on it. Do not leave the room until you have a concrete plan to fix it.
    </p>

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">2. The Blame Game</h2>
    <p class="mb-4">
      <strong>The Pattern:</strong> "Who broke the build?"
    </p>
    <p class="mb-4">
      <strong>The Fix:</strong> Read the Prime Directive. Focus on the <em>process</em> that allowed the build to break, not the person who pushed the button.
    </p>

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">3. The Silent Movie</h2>
    <p class="mb-4">
      <strong>The Pattern:</strong> The facilitator asks a question. Silence.
    </p>
    <p class="mb-4">
      <strong>The Fix:</strong> Use "Silent Writing" first. People are afraid to speak up. Let them write anonymously first.
    </p>

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">4. The Wish List</h2>
    <p class="mb-4">
      <strong>The Pattern:</strong> "I wish we had more time." "I wish the client was nicer."
    </p>
    <p class="mb-4">
      <strong>The Fix:</strong> Focus on the Circle of Control. If you can't change it, acknowledge it and move on. Focus on what you <em>can</em> do.
    </p>

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">5. Management Spy</h2>
    <p class="mb-4">
      <strong>The Pattern:</strong> The VP of Engineering sits in "just to listen".
    </p>
    <p class="mb-4">
      <strong>The Fix:</strong> Kick them out. Seriously. The retro is a safe space for the team.
    </p>

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">6. The Rushed Retro</h2>
    <p class="mb-4">
      <strong>The Pattern:</strong> "We have 15 minutes, let's just do a quick round."
    </p>
    <p class="mb-4">
      <strong>The Fix:</strong> Book 60 minutes. Respect the ceremony. If you don't have time to improve, you don't have time to work.
    </p>

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">7. Action Item Graveyard</h2>
    <p class="mb-4">
      <strong>The Pattern:</strong> A long list of action items that never get done.
    </p>
    <p class="mb-4">
      <strong>The Fix:</strong> Limit to 1 action item per sprint. Put it in the sprint backlog.
    </p>

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">8. The Complaint Fest</h2>
    <p class="mb-4">
      <strong>The Pattern:</strong> Everyone vents, feels better, and changes nothing.
    </p>
    <p class="mb-4">
      <strong>The Fix:</strong> Venting is fine for 5 minutes. Then pivot to solutions. "Okay, that sucks. What are we going to do about it?"
    </p>

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">9. Peak-End Rule Trap</h2>
    <p class="mb-4">
      <strong>The Pattern:</strong> We only talk about the last 2 days of the sprint because that's what we remember.
    </p>
    <p class="mb-4">
      <strong>The Fix:</strong> Bring data. Show the burndown chart. Remind the team what happened in Week 1.
    </p>

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">10. Disconnected Retro</h2>
    <p class="mb-4">
      <strong>The Pattern:</strong> The retro happens, but the insights never leave the room.
    </p>
    <p class="mb-4">
      <strong>The Fix:</strong> Share the learnings. Post a summary in Slack. Tell other teams what you learned.
    </p>

    <hr class="my-12 border-gray-200 dark:border-gray-800" />

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">Conclusion</h2>
    <p class="mb-6">
      Recognizing these patterns is the first step to fixing them.
    </p>
    <p class="mb-6">
      <strong>Want to avoid these traps?</strong> <a href="/#/dashboard" class="text-brand-500 underline">Clear Retro</a> is designed to guide you through a healthy process, forcing you to group, vote, and assign action items properly.
    </p>
  `
};
