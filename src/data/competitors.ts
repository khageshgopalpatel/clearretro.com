
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
  'easyretro': {
    slug: 'easyretro',
    name: 'EasyRetro',
    keyword: 'easyretro alternative',
    heroTitle: 'Clear Retro vs EasyRetro: Why Pay Per Board?',
    metaDescription: 'EasyRetro limits your public boards on the free plan. Clear Retro gives you unlimited boards for free. Switch today.',
    pros: ['Established brand', 'High customization', 'Sorting features'],
    cons: ['Limited public boards (Free)', 'Team plan costs $25/mo', 'UI is dense/cluttered', 'Paywall for essential features'],
    featuresComparison: [
      { feature: 'Unlimited Boards (Free)', clearRetro: '✓ Yes', competitor: '3 Boards/mo' },
      { feature: 'Unlimited Members', clearRetro: '✓ Yes', competitor: '✓ Yes' },
      { feature: 'Private/Focus Mode', clearRetro: '✓ Yes', competitor: '✓ Yes' },
      { feature: 'AI Grouping', clearRetro: '✓ Yes', competitor: 'Limited' },
      { feature: 'Pricing (Team)', clearRetro: 'FREE', competitor: '$25/mo' },
    ],
    verdict: "EasyRetro is a solid tool, but its pricing model punishes you for having more retrospectives. Clear Retro removes the limits so you can run as many sessions as you need without a credit card."
  },
  'miro': {
    slug: 'miro',
    name: 'Miro',
    keyword: 'miro retrospective alternative',
    heroTitle: 'Clear Retro vs Miro: Focus vs Infinite Canvas',
    metaDescription: 'Miro is great for brainstorming, but Clear Retro is built for effective Action Items. Stop getting lost in the infinite canvas.',
    pros: ['Infinite interactive canvas', 'Great for general brainstorming', 'Huge template library'],
    cons: ['3 Editable Board Limit (Free)', 'Overwhelming for simple retros', 'No built-in retro analytics', 'Manual grouping takes time'],
    featuresComparison: [
      { feature: 'Board Limit (Free)', clearRetro: 'Unlimited', competitor: '3 Boards' },
      { feature: 'Dedicated Action Items', clearRetro: '✓ Yes', competitor: 'Manual Sticky Notes' },
      { feature: 'Private Voting', clearRetro: '✓ Yes', competitor: 'Paid Plan Only' },
      { feature: 'Timer', clearRetro: '✓ Yes', competitor: '✓ Yes' },
      { feature: 'AI Summary', clearRetro: '✓ Yes', competitor: 'Credits System' },
    ],
    verdict: "Miro is a fantastic whiteboard, but it's not a retrospective tool. It lacks the structure, privacy controls, and dedicated action item tracking that engineering teams need to actually improve."
  },
  'parabol': {
    slug: 'parabol',
    name: 'Parabol',
    keyword: 'parabol alternative',
    heroTitle: 'Clear Retro vs Parabol: Flexibility vs Rigid Process',
    metaDescription: 'Parabol forces you into their specific process. Clear Retro gives you the freedom to run retrospectives your way, for free.',
    pros: ['Strong integration with GitHub', 'Good for rigid Scrum teams', 'Meeting history'],
    cons: ['Free tier limits (10 meetings/mo)', 'Rigid "Check-in" flow', 'Can feel slow/heavy', '2 Team Limit (Free)'],
    featuresComparison: [
      { feature: 'Monthly Meeting Limit', clearRetro: 'Unlimited', competitor: '10 Meetings' },
      { feature: 'Team Limit (Free)', clearRetro: 'Unlimited', competitor: '2 Teams' },
      { feature: 'Custom Templates', clearRetro: '✓ Flexible', competitor: 'Rigid' },
      { feature: 'Guest Access', clearRetro: '✓ Instant', competitor: 'Requires Invite' },
      { feature: 'Cost', clearRetro: 'FREE', competitor: 'Free or $6/user' },
    ],
    verdict: "Parabol is great if you want to follow *their* specific process. If you want a fast, flexible tool that doesn't cap your monthly meetings, Clear Retro is the better choice."
  },
  'teamretro': {
    slug: 'teamretro',
    name: 'TeamRetro',
    keyword: 'teamretro alternative',
    heroTitle: 'Clear Retro vs TeamRetro: The Free Alternative',
    metaDescription: 'TeamRetro costs $25/month for a single team. Clear Retro is 100% free. Why pay for sticky notes?',
    pros: ['Enterprise features', 'Health checks included', 'Polished UI'],
    cons: ['No Free Plan (Trial only)', 'Expensive ($25/mo start)', 'Seat-based pricing tiers', 'Complex setup'],
    featuresComparison: [
      { feature: 'Free Forever Plan', clearRetro: '✓ Yes', competitor: '✕ No (Trial)' },
      { feature: 'Cost for 1 Team', clearRetro: '$0', competitor: '$300/year' },
      { feature: 'Unlimited Users', clearRetro: '✓ Yes', competitor: 'Plan Dependent' },
      { feature: 'Health Checks', clearRetro: 'Coming Soon', competitor: '✓ Yes' },
      { feature: 'AI Automation', clearRetro: '✓ Yes', competitor: '✓ Yes' },
    ],
    verdict: "TeamRetro is a premium enterprise tool with a premium price tag. Clear Retro covers 90% of the same features—including AI and SSO—for exactly $0. It's the smartest choice for lean engineering teams."
  },
  'metroretro': {
    slug: 'metroretro',
    name: 'Metro Retro',
    keyword: 'metro retro alternative',
    heroTitle: 'Clear Retro vs Metro Retro: Work vs Play',
    metaDescription: 'Metro Retro is fun, but can be distracting. Clear Retro focuses on efficiency, speed, and clear action items.',
    pros: ['Gamified & Fun', 'Visual whimsy', 'Great for icebreakers'],
    cons: ['Distracting UI', 'Object limits on free plan', 'Hard to export data', 'Performance issues on large boards'],
    featuresComparison: [
      { feature: 'UI Style', clearRetro: 'Clean & Professional', competitor: 'Gamified/Chaotic' },
      { feature: 'Object Limits', clearRetro: 'None', competitor: 'Yes (Free Plan)' },
      { feature: 'Export Formatting', clearRetro: 'Structured CSV/PDF', competitor: 'Visual Image' },
      { feature: 'Mobile Support', clearRetro: '✓ Good', competitor: '✕ Poor' },
      { feature: 'AI Grouping', clearRetro: '✓ Yes', competitor: 'No' },
    ],
    verdict: "Metro Retro is like a video game for retrospectives. It's fun once, but becomes distracting. Clear Retro is a professional tool designed to help you finish your retro on time with clear action items."
  },
  // Legacy support for URL redirection or SEO
   'funretro': {
    slug: 'funretro',
    name: 'FunRetro (EasyRetro)',
    keyword: 'funretro alternative',
    heroTitle: 'Clear Retro vs FunRetro: The modern alternative',
    metaDescription: 'FunRetro is now EasyRetro. See how Clear Retro compares to the classic tool with modern AI features.',
    pros: ['Established brand', 'Simple', 'Voting'],
    cons: ['See EasyRetro'],
    featuresComparison: [
      { feature: 'Modern Interface', clearRetro: '✓ Yes', competitor: 'Dated' },
      { feature: 'AI Features', clearRetro: '✓ Yes', competitor: 'Limited' },
      { feature: 'Dark Mode', clearRetro: '✓ Yes', competitor: 'No' },
    ],
    verdict: "FunRetro is now EasyRetro. Check out our comparison for EasyRetro to see why Clear Retro is the modern successor."
  },
};
