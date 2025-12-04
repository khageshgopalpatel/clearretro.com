
export interface CompetitorData {
  slug: string;
  name: string;
  keyword: string;
  heroTitle: string;
  metaDescription: string;
  cons: string[];
  pros: string[];
  featuresComparison: {
    feature: string;
    clearRetro: boolean | string;
    competitor: boolean | string;
  }[];
  verdict: string;
}

export const COMPETITORS: Record<string, CompetitorData> = {
  'funretro': {
    slug: 'funretro',
    name: 'FunRetro (EasyRetro)',
    keyword: 'funretro alternative',
    heroTitle: 'Clear Retro vs FunRetro: The Developer-First Alternative',
    metaDescription: 'Looking for a FunRetro alternative? See why engineering teams are switching to Clear Retro for better AI insights and a cleaner UI.',
    pros: ['Established brand', 'Simple interface', 'Voting features'],
    cons: ['Limited free plan', 'UI feels dated/cluttered', 'No AI-powered grouping', 'Expensive for small teams'],
    featuresComparison: [
      { feature: 'Real-time Sync', clearRetro: true, competitor: true },
      { feature: 'AI Grouping & Summary', clearRetro: true, competitor: false },
      { feature: 'Developer-First UI', clearRetro: true, competitor: false },
      { feature: 'Markdown Support', clearRetro: true, competitor: 'Limited' },
      { feature: 'Guest Access (No Login)', clearRetro: true, competitor: true },
      { feature: 'Free Tier Limits', clearRetro: 'Unlimited Boards', competitor: '3 Boards' },
    ],
    verdict: "FunRetro is a solid classic tool, but Clear Retro offers a superior experience for engineering teams who value keyboard shortcuts, dark mode, and AI automation without the hefty price tag."
  },
  'easyretro': {
    slug: 'easyretro',
    name: 'EasyRetro',
    keyword: 'easyretro alternative',
    heroTitle: 'Better Retrospectives: Clear Retro vs EasyRetro',
    metaDescription: 'Compare Clear Retro vs EasyRetro. Discover the best online retrospective tool for Agile developers in 2025.',
    pros: ['Good column customization', 'Slack integration', 'Export options'],
    cons: ['Paywall for essential features', 'Generic design', 'Lack of deep analytics'],
    featuresComparison: [
      { feature: 'Unlimited Members (Free)', clearRetro: true, competitor: false },
      { feature: 'Dark Mode', clearRetro: true, competitor: false },
      { feature: 'AI Sentiment Analysis', clearRetro: true, competitor: false },
      { feature: 'Jira Integration', clearRetro: 'Pro Only', competitor: 'Pro Only' },
      { feature: 'Focus/Private Mode', clearRetro: true, competitor: true },
    ],
    verdict: "EasyRetro lives up to its name, but Clear Retro takes it a step further by making retrospectives 'Smart' with AI and 'Fast' with a high-performance React architecture."
  },
  'metroretro': {
    slug: 'metroretro',
    name: 'Metro Retro',
    keyword: 'metro retro alternative',
    heroTitle: 'Clear Retro vs Metro Retro: Structure vs Chaos',
    metaDescription: 'Metro Retro is great for games, but Clear Retro is built for getting work done. See the comparison.',
    pros: ['Gamified interface', 'Fun visual avatars', 'Infinite canvas'],
    cons: ['Distracting for focused teams', 'Slow on older laptops', 'Hard to export structured data', 'Steep learning curve'],
    featuresComparison: [
      { feature: 'Structured Output', clearRetro: true, competitor: 'Hard' },
      { feature: 'Performance', clearRetro: 'Lightning Fast', competitor: 'Heavy' },
      { feature: 'Distraction Free', clearRetro: true, competitor: false },
      { feature: 'AI Insights', clearRetro: true, competitor: false },
      { feature: 'Mobile Friendly', clearRetro: true, competitor: 'Poor' },
    ],
    verdict: "Metro Retro is a digital playground. Clear Retro is a digital workspace. If you want to play games, choose Metro. If you want to improve your sprint velocity, choose Clear Retro."
  },
  'retrospected': {
    slug: 'retrospected',
    name: 'Retrospected',
    keyword: 'retrospected alternative',
    heroTitle: 'Switching from Retrospected to Clear Retro',
    metaDescription: 'A detailed look at why agile teams prefer Clear Retro over Retrospected for their sprint ceremonies.',
    pros: ['Simple', 'Planning Poker included', 'Basic interface'],
    cons: ['Very basic features', 'No AI integration', 'Small user base', 'Limited updates'],
    featuresComparison: [
      { feature: 'Modern UX', clearRetro: true, competitor: false },
      { feature: 'Active Development', clearRetro: true, competitor: 'Unknown' },
      { feature: 'AI Grouping', clearRetro: true, competitor: false },
      { feature: 'Security/Privacy', clearRetro: 'Enterprise Grade', competitor: 'Basic' },
    ],
    verdict: "Retrospected is a decent basic tool, but Clear Retro provides the modern polish, AI capabilities, and active support that professional teams demand."
  }
};
