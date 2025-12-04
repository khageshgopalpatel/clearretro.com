import type { BlogPost } from '../blogPosts';

export const post8: BlogPost = {
  id: 'mad-sad-glad-retrospective-template',
  slug: 'mad-sad-glad-retrospective-template',
  title: 'Mad Sad Glad Template + Facilitation Guide (2025)',
  excerpt: 'Engineering is emotional work. Use the "Mad Sad Glad" retrospective to uncover hidden frustrations and build psychological safety.',
  keywords: 'mad sad glad retrospective, emotional retrospective, team morale, agile facilitation, psychological safety',
  date: 'Dec 11, 2024',
  readTime: '14 min read',
  imageAlt: 'Mad Sad Glad retrospective board with emojis',
  faqs: [
    { question: "Is this template too 'soft' for engineering teams?", answer: "Not at all. Frustration (Mad) is often a sign of technical debt or broken processes. Addressing emotions leads to technical solutions." },
    { question: "What if everyone is just 'Glad'?", answer: "Dig deeper. Ask 'What almost made you Mad?' or 'What are you worried might make you Sad next sprint?' Toxic positivity can hide real issues." },
    { question: "How do I handle intense anger in the 'Mad' column?", answer: "Validate the feeling, but pivot to the system. 'I hear you are angry about the bug. What part of our testing process failed us?'" }
  ],
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Mad Sad Glad Template + Facilitation Guide",
    "image": ["https://placehold.co/1200x630/2dd4bf/ffffff?text=Mad+Sad+Glad"],
    "author": { "@type": "Organization", "name": "Clear Retro" },
    "publisher": { "@type": "Organization", "name": "Clear Retro", "logo": { "@type": "ImageObject", "url": "https://clear-retro.com/logo.png" } }
  },
  content: `
    <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-8 font-mono">Mad Sad Glad Template + Facilitation Guide</h1>

    <div class="my-10 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
       <img src="https://placehold.co/1200x600/18181b/2dd4bf?text=Emotional+Intelligence+in+Agile" alt="Mad Sad Glad diagram" class="w-full h-auto object-cover" />
    </div>

    <p class="text-xl leading-relaxed text-gray-600 dark:text-gray-300 mb-8">
      "Leave your emotions at the door."
    </p>

    <p class="mb-8 text-lg leading-relaxed">
      This is terrible advice for agile teams. Software development is creative, collaborative, and stressful. Ignoring emotions leads to burnout.
    </p>

    <p class="mb-8 text-lg leading-relaxed">
      The <strong>Mad Sad Glad</strong> retrospective is designed to bring these feelings into the open so they can be addressed constructively.
    </p>

    <hr class="my-12 border-gray-200 dark:border-gray-800" />

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">The Categories Explained</h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
       <div class="p-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl">
          <h3 class="text-2xl font-bold text-red-700 dark:text-red-400 mb-4">😡 Mad</h3>
          <p class="text-gray-700 dark:text-gray-300">
            What drove you crazy? What stopped you from doing your best work?
            <br/><br/>
            <strong>Examples:</strong>
            <ul class="list-disc pl-4 mt-2 text-sm">
              <li>"The VPN kept dropping."</li>
              <li>"I was interrupted 10 times on Tuesday."</li>
              <li>"The requirements changed 3 times."</li>
            </ul>
          </p>
       </div>
       <div class="p-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl">
          <h3 class="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-4">😢 Sad</h3>
          <p class="text-gray-700 dark:text-gray-300">
            What disappointed you? What did you wish happened but didn't?
            <br/><br/>
            <strong>Examples:</strong>
            <ul class="list-disc pl-4 mt-2 text-sm">
              <li>"We missed the deadline."</li>
              <li>"The client didn't like the design."</li>
              <li>"I didn't get to pair program."</li>
            </ul>
          </p>
       </div>
       <div class="p-6 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-xl">
          <h3 class="text-2xl font-bold text-green-700 dark:text-green-400 mb-4">😁 Glad</h3>
          <p class="text-gray-700 dark:text-gray-300">
            What made you happy? What are you proud of?
            <br/><br/>
            <strong>Examples:</strong>
            <ul class="list-disc pl-4 mt-2 text-sm">
              <li>"We fixed that nasty memory leak."</li>
              <li>"The team lunch was fun."</li>
              <li>"New laptop arrived!"</li>
            </ul>
          </p>
       </div>
    </div>

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">Facilitation Guide: Handling Emotions</h2>
    <p class="mb-4">
      Facilitating this retro requires a delicate touch.
    </p>

    <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-8 mb-4">1. Create Safety First</h3>
    <p class="mb-4">
      Remind everyone that "Mad" is not about attacking people. It is about attacking problems.
    </p>

    <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-8 mb-4">2. Validate, Then Solve</h3>
    <p class="mb-4">
      When someone shares a "Mad" card, don't jump to solutions immediately.
      <br/>
      <strong>Bad:</strong> "Oh, the VPN is slow? Just use the other server."
      <br/>
      <strong>Good:</strong> "That sounds incredibly frustrating. Losing connection mid-commit is the worst. How many others faced this?"
    </p>

    <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-8 mb-4">3. Turn Sadness into Action</h3>
    <p class="mb-4">
      "Sad" often points to missed opportunities.
      <br/>
      If someone is sad they didn't learn a new technology, create an action item: "Schedule a React learning session next sprint."
    </p>

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">When to Use It</h2>
    <ul class="list-disc pl-6 mb-6 space-y-4">
      <li><strong>After a "Death March":</strong> If the team worked overtime to hit a deadline, they need to vent.</li>
      <li><strong>When Morale is Low:</strong> If the team seems quiet or disengaged.</li>
      <li><strong>After a Failure:</strong> If a release broke production, there will be a lot of "Sad" and "Mad". Get it out in the open.</li>
    </ul>

    <hr class="my-12 border-gray-200 dark:border-gray-800" />

    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 font-mono">Conclusion</h2>
    <p class="mb-6">
      The "Mad Sad Glad" retro is a pressure valve. By letting the steam out in a controlled environment, you prevent explosions later.
    </p>
    <p class="mb-6">
      <strong>Try it now:</strong> <a href="/#/dashboard" class="text-brand-500 underline">Clear Retro</a> includes this template for free.
    </p>
  `
};
