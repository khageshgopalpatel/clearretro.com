import type { BlogPost } from '../blogPosts';

export const post3: BlogPost = {
  id: '9-retrospective-templates-every-scrum-master-should-use',
  slug: '9-retrospective-templates-every-scrum-master-should-use',
  title: '9 Retrospective Templates Every Scrum Master Should Use (2025 Guide)',
  excerpt: 'From the classic "Start, Stop, Continue" to the psychological "Mad, Sad, Glad", here are the 9 essential templates to keep your retrospectives fresh and effective.',
  keywords: 'retrospective templates, scrum master tools, agile templates, sprint retro formats, continuous improvement',
  date: 'Dec 06, 2024',
  readTime: '18 min read',
  imageAlt: 'Scrum Master facilitating a retrospective using various digital templates',
  faqs: [
    { question: "Which template is best for a team in crisis?", answer: "The 'Mad, Sad, Glad' template is best for teams in crisis as it focuses on emotional release and psychological safety, allowing the team to vent before moving to solutions." },
    { question: "How do I choose the right template?", answer: "Consider the team's current state. If they are bored, use a fun metaphor like 'Sailboat'. If they are process-heavy, use '4 Ls'. If they need quick actions, use 'Start, Stop, Continue'." },
    { question: "Can I mix and match templates?", answer: "Yes! Experienced Scrum Masters often combine elements, such as using an 'ESVP' check-in followed by a 'Starfish' main activity." }
  ],
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "9 Retrospective Templates Every Scrum Master Should Use",
    "image": ["https://placehold.co/1200x630/2dd4bf/ffffff?text=9+Essential+Templates"],
    "author": { "@type": "Organization", "name": "Clear Retro" },
    "publisher": { "@type": "Organization", "name": "Clear Retro", "logo": { "@type": "ImageObject", "url": "https://clear-retro.com/logo.png" } }
  },
  content: `
    <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-8 font-mono">9 Retrospective Templates Every Scrum Master Should Use</h1>

    <div class="my-10 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
       <img src="https://placehold.co/1200x600/18181b/2dd4bf?text=The+Scrum+Master's+Toolkit" alt="Collection of retrospective templates" class="w-full h-auto object-cover" />
    </div>

    <p class="text-xl leading-relaxed text-gray-600 dark:text-gray-300 mb-8">
      A carpenter doesn't use a hammer for every job. Similarly, a Scrum Master shouldn't use the same retrospective template for every sprint.
    </p>

    <p class="mb-8 text-lg leading-relaxed">
      The "What Went Well / What Didn't Go Well" format is a great starting point, but it can become repetitive. To truly drive continuous improvement, you need a toolkit of templates that can adapt to the team's mood, the project's phase, and the specific challenges at hand.
    </p>

    <p class="mb-8 text-lg leading-relaxed">
      Here are the <strong>9 essential retrospective templates</strong> that every Scrum Master needs in their arsenal for 2025.
    </p>

    <hr class="my-12 border-gray-200 dark:border-gray-800" />

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">1. Start, Stop, Continue</h2>
    <p class="mb-4"><strong>The "Action-Oriented" Classic</strong></p>
    <p class="mb-4">
      This is the bread and butter of retrospectives. It is simple, intuitive, and forces the team to think in terms of <em>behavior change</em> rather than just observations.
    </p>
    <div class="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 mb-6">
      <h4 class="font-bold text-gray-900 dark:text-white mb-2">The Columns:</h4>
      <ul class="list-disc pl-6 space-y-2">
        <li><strong>Start:</strong> What new activities should we begin? (e.g., "Pair programming on complex tickets")</li>
        <li><strong>Stop:</strong> What is wasting our time? (e.g., "Daily standups lasting 30 minutes")</li>
        <li><strong>Continue:</strong> What is working well? (e.g., "The new code review checklist")</li>
      </ul>
    </div>
    <p class="mb-4"><strong>When to use:</strong> When the team feels stuck and needs concrete action items to move forward.</p>

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">2. The 4 Ls (Liked, Learned, Lacked, Longed For)</h2>
    <p class="mb-4"><strong>The "Deep Dive"</strong></p>
    <p class="mb-4">
      This template adds a layer of depth by asking about <em>learning</em> and <em>desire</em>. It shifts the conversation from "process" to "people and growth".
    </p>
    <div class="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 mb-6">
      <h4 class="font-bold text-gray-900 dark:text-white mb-2">The Columns:</h4>
      <ul class="list-disc pl-6 space-y-2">
        <li><strong>Liked:</strong> What did you enjoy about the sprint?</li>
        <li><strong>Learned:</strong> What new thing did you discover? (Technical or interpersonal)</li>
        <li><strong>Lacked:</strong> What was missing that made your job hard?</li>
        <li><strong>Longed For:</strong> What do you wish we had for the future?</li>
      </ul>
    </div>
    <p class="mb-4"><strong>When to use:</strong> At the end of a major project or when you want to focus on team growth and learning.</p>

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">3. Mad, Sad, Glad</h2>
    <p class="mb-4"><strong>The "Emotional Thermometer"</strong></p>
    <p class="mb-4">
      Engineering is emotional work. Frustration with legacy code, sadness over missed deadlines, and joy from a successful release are all real. This template gives space for those feelings.
    </p>
    <div class="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 mb-6">
      <h4 class="font-bold text-gray-900 dark:text-white mb-2">The Columns:</h4>
      <ul class="list-disc pl-6 space-y-2">
        <li><strong>Mad:</strong> What made you angry or frustrated?</li>
        <li><strong>Sad:</strong> What disappointed you?</li>
        <li><strong>Glad:</strong> What made you happy or proud?</li>
      </ul>
    </div>
    <p class="mb-4"><strong>When to use:</strong> After a high-stress sprint or when you sense tension in the team.</p>

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">4. The Sailboat</h2>
    <p class="mb-4"><strong>The "Visual Metaphor"</strong></p>
    <p class="mb-4">
      Visualizing the team as a boat helps people think outside the box. It separates "internal" factors (Anchors) from "external" risks (Rocks).
    </p>
    <div class="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 mb-6">
      <h4 class="font-bold text-gray-900 dark:text-white mb-2">The Columns:</h4>
      <ul class="list-disc pl-6 space-y-2">
        <li><strong>Wind:</strong> What is pushing us forward?</li>
        <li><strong>Anchors:</strong> What is dragging us down?</li>
        <li><strong>Rocks:</strong> What risks are ahead?</li>
        <li><strong>Island:</strong> What is our destination/goal?</li>
      </ul>
    </div>
    <p class="mb-4"><strong>When to use:</strong> For big-picture planning or when the team is bored of text-based lists.</p>

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">5. Plus / Delta</h2>
    <p class="mb-4"><strong>The "Quick & Dirty"</strong></p>
    <p class="mb-4">
      Sometimes you don't have an hour. Maybe you only have 30 minutes. The Plus/Delta is the fastest way to get feedback.
    </p>
    <div class="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 mb-6">
      <h4 class="font-bold text-gray-900 dark:text-white mb-2">The Columns:</h4>
      <ul class="list-disc pl-6 space-y-2">
        <li><strong>Plus (+):</strong> What went well?</li>
        <li><strong>Delta (Δ):</strong> What should we change?</li>
      </ul>
    </div>
    <p class="mb-4"><strong>When to use:</strong> For short sprints, mid-sprint check-ins, or when time is very limited.</p>

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">6. The Five Whys</h2>
    <p class="mb-4"><strong>The "Root Cause Analyzer"</strong></p>
    <p class="mb-4">
      Technically a technique rather than a full board template, but essential. When a problem is identified (e.g., "The site went down"), ask "Why?" five times to find the root cause.
    </p>
    <p class="mb-4"><strong>Example:</strong></p>
    <ol class="list-decimal pl-6 mb-6 space-y-1">
      <li>Site went down. Why? -> Database CPU spiked.</li>
      <li>Why? -> A bad query was released.</li>
      <li>Why? -> It wasn't reviewed.</li>
      <li>Why? -> The senior dev was on vacation.</li>
      <li>Why? -> We have a single point of failure in our review process. (Root Cause)</li>
    </ol>
    <p class="mb-4"><strong>When to use:</strong> During a Post-Mortem or when a specific, recurring bug keeps happening.</p>

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">7. ESVP (Check-in Activity)</h2>
    <p class="mb-4"><strong>The "Engagement Gauge"</strong></p>
    <p class="mb-4">
      Use this at the <em>start</em> of the retro to see who is actually engaged.
    </p>
    <ul class="list-disc pl-6 mb-6 space-y-2">
      <li><strong>Explorer:</strong> Eager to discover new ideas.</li>
      <li><strong>Shopper:</strong> Looking for one good idea to take away.</li>
      <li><strong>Vacationer:</strong> Just happy to be away from their desk.</li>
      <li><strong>Prisoner:</strong> Feels forced to attend.</li>
    </ul>
    <p class="mb-4"><strong>When to use:</strong> If you suspect low morale or disengagement.</p>

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">8. The Starfish</h2>
    <p class="mb-4"><strong>The "Nuanced Review"</strong></p>
    <p class="mb-4">
      An expansion of Start/Stop/Continue that allows for scaling activities up or down.
    </p>
    <div class="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 mb-6">
      <h4 class="font-bold text-gray-900 dark:text-white mb-2">The Columns:</h4>
      <ul class="list-disc pl-6 space-y-2">
        <li><strong>Keep Doing</strong></li>
        <li><strong>Less Of</strong></li>
        <li><strong>More Of</strong></li>
        <li><strong>Stop Doing</strong></li>
        <li><strong>Start Doing</strong></li>
      </ul>
    </div>
    <p class="mb-4"><strong>When to use:</strong> When the team is mature and wants to fine-tune their velocity.</p>

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">9. ROTI (Return on Time Invested)</h2>
    <p class="mb-4"><strong>The "Meta-Retro"</strong></p>
    <p class="mb-4">
      At the end of the meeting, ask everyone to rate the meeting from 1-5.
    </p>
    <ul class="list-disc pl-6 mb-6 space-y-2">
      <li><strong>1:</strong> Waste of time.</li>
      <li><strong>3:</strong> Average.</li>
      <li><strong>5:</strong> Extremely valuable.</li>
    </ul>
    <p class="mb-4"><strong>When to use:</strong> At the end of <em>every</em> retrospective to ensure you (the Scrum Master) are improving too.</p>

    <hr class="my-12 border-gray-200 dark:border-gray-800" />

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">Conclusion</h2>
    <p class="mb-6">
      Having these 9 templates in your back pocket ensures you're never caught off guard. Whether your team is celebrating a win, recovering from a failure, or just grinding through a long project, there is a template here that fits the moment.
    </p>
    <p class="mb-6">
      <strong>Pro Tip:</strong> <a href="/#/dashboard" class="text-brand-500 underline">Clear Retro</a> has pre-built support for most of these templates. You can switch between "Sailboat" and "Mad Sad Glad" in seconds, keeping your team engaged without the setup hassle.
    </p>
  `
};
