
export interface FAQ {
  question: string;
  answer: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML string
  keywords: string;
  date: string;
  readTime: string;
  imageAlt: string;
  image?: string;
  faqs?: FAQ[];
  jsonLd?: object;
  lastUpdated?: string;
}

import { post1 } from './posts/what-is-a-sprint-retrospective';
import { post2 } from './posts/best-sprint-retrospective-ideas-remote-teams';
import { post3 } from './posts/9-retrospective-templates';
import { post4 } from './posts/how-to-run-effective-retrospective';
import { post5 } from './posts/sprint-retro-questions';
import { post6 } from './posts/start-stop-continue-template';
import { post7 } from './posts/what-went-well-what-didnt';
import { post8 } from './posts/mad-sad-glad-retrospective';
import { post9 } from './posts/4ls-retrospective-template';
import { post10 } from './posts/sailboat-retrospective-template';
import { post11 } from './posts/agile-action-items';
import { post12 } from './posts/fun-retro-ideas';
import { post13 } from './posts/retro-icebreakers';
import { post14 } from './posts/scrum-master-facilitation-guide';
import { post15 } from './posts/retro-anti-patterns';
import { post16 } from './posts/what-is-an-agile-retrospective-definition';
import { post17 } from './posts/remote-teams-different-timezones-retrospective';
import { post18 } from './posts/15-minute-retrospective-formats';
import { post19 } from './posts/why-developer-retrospectives-fail';
import { post20 } from './posts/parabol-vs-teamretro';

export const BLOG_POSTS: BlogPost[] = [
  post20,
  post16, // Feature latest SEO definition at the top
  post19, 
  post18,
  post17,
  post1,
  post2,
  post3,
  post4,
  post5,
  post6,
  post7,
  post8,
  post9,
  post10,
  post11,
  post12,
  post13,
  post14,
  post15,
  {
    id: '4',
    slug: 'action-items-agile-guide',
    title: 'Action Items in Agile: How to Make Them Stick',
    excerpt: 'Why do action items get ignored? Learn the secrets to creating action items that actually get done in the next sprint.',
    keywords: 'agile action items, continuous improvement, scrum tips',
    date: 'Nov 05, 2024',
    readTime: '6 min read',
    imageAlt: 'Checklist of agile action items',
    content: `
      <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 font-mono">Action Items: Making Them Stick</h1>
      <p class="mb-6">The graveyard of failed retrospectives is paved with unassigned action items. If you don't do the action items, the retro was a waste of time.</p>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">The Golden Rules</h2>
      <p class="mb-4"><strong>1. One Owner:</strong> "The Team" cannot own a task. If everyone is responsible, no one is. Assign it to one person.</p>
      <p class="mb-4"><strong>2. Add to Backlog:</strong> Treat improvements like features. Put them in the Sprint Backlog for the next sprint.</p>
    `
  }
];
