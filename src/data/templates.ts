import type { BoardTemplate } from "../types";

export const BOARD_TEMPLATES: BoardTemplate[] = [
  {
    id: "start-stop-continue",
    name: "Start, Stop, Continue",
    description:
      "The classic retro format. Helps the team identify what to start doing, stop doing, and continue doing for continuous improvement.",
    seoTitle: "Start Stop Continue Retrospective Template | Free Online Tool | Clear Retro",
    seoDescription: "Run the classic start stop continue retrospective with your team using our free online template. Identify improvements quickly and easily.",
    keywords: ["start stop continue retrospective template", "start stop continue retro", "retrospective templates"],
    columns: [
      { title: "Start", color: "green", icon: "🚀" },
      { title: "Stop", color: "red", icon: "🛑" },
      { title: "Continue", color: "blue", icon: "🔄" },
    ],
  },
  {
    id: "what-went-well",
    name: "What Went Well",
    description:
      "A simple and effective format to reflect on wins, pain points, and actionable improvements. Perfect for teams new to retrospectives.",
    seoTitle: "What Went Well Retrospective Template & Examples | Clear Retro",
    seoDescription: "Use the What Went Well retrospective template to capture wins and pain points. Includes examples of what went well and what didn't.",
    keywords: ["what went well", "what went well examples", "what went well what didn't retrospective examples", "retro what went well"],
    columns: [
      { title: "What Went Well", color: "green", icon: "🎉" },
      { title: "What Didn't Go Well", color: "red", icon: "😕" },
      { title: "What Can We Improve", color: "yellow", icon: "💡" },
    ],
  },
  {
    id: "mad-sad-glad",
    name: "Mad, Sad, Glad",
    description:
      "Focus on emotional health and team morale. Identify things that made you mad, sad, or glad during the sprint.",
    seoTitle: "Glad Mad Sad Retrospective Template | Free Team Retro | Clear Retro",
    seoDescription: "Run a mad sad glad retrospective online. A free template to focus on team morale and emotional health during your sprint retro.",
    keywords: ["glad mad sad retrospective template", "mad sad glad retrospective", "mad sad glad", "glad sad"],
    columns: [
      { title: "Mad", color: "red", icon: "😡" },
      { title: "Sad", color: "blue", icon: "😢" },
      { title: "Glad", color: "green", icon: "🎉" },
    ],
  },
  {
    id: "lean-coffee",
    name: "Lean Coffee",
    description:
      "An agenda-less meeting structure providing a democratic and focused way to discuss the topics that matter most to the team.",
    seoTitle: "Lean Coffee Meeting Template & Retrospective | Clear Retro",
    seoDescription: "Use our free lean coffee meeting template online. Run democratic and focused lean coffee retrospectives with your agile team.",
    keywords: ["lean coffee meeting template", "lean coffee retrospective", "lean coffee template", "lean coffee vorlage"],
    columns: [
      { title: "To Discuss", color: "blue", icon: "💭" },
      { title: "Discussing", color: "yellow", icon: "🔄" },
      { title: "Discussed", color: "green", icon: "✅" },
    ],
  },
  {
    id: "4ls",
    name: "4Ls (Liked, Learned, Lacked, Longed For)",
    description:
      "The Liked, Learned, Lacked, Longed For retrospective template. Often searched as the 4 l's retrospective template, this format is great for uncovering hidden issues and desires.",
    seoTitle: "Liked Learned Lacked Longed For (4Ls) Retrospective Template | Clear Retro",
    seoDescription: "Run the popular 4Ls (Liked, Learned, Lacked, Longed For) retrospective template for free online. Uncover hidden issues and team desires.",
    keywords: ["liked learned lacked longed for retrospective template", "4ls retrospective template", "4ls retrospective", "4 l retrospective", "4 ls retrospective", "liked learned lacked and longer for", "4 l's retrospective"],
    columns: [
      { title: "Liked", color: "green", icon: "❤️" },
      { title: "Learned", color: "blue", icon: "📚" },
      { title: "Lacked", color: "red", icon: "🤔" },
      { title: "Longed For", color: "yellow", icon: "🙏" },
    ],
  },
  {
    id: "worked-well-kinda-didnt",
    name: "Worked Well, Kinda Didn't",
    description:
      'The "Worked well, kinda didn\'t" retrospective template is a simple, casual format for agile teams to honestly discuss what succeeded and what fell short during the sprint.',
    seoTitle: "Worked Well, Kinda Didn't Retrospective Template | Clear Retro",
    seoDescription: "Try the casual 'Worked well, kinda didn't' retrospective template online. A simple format for honest team discussions.",
    keywords: ["worked well kinda didn't retrospective template"],
    columns: [
      { title: "Worked Well", color: "green", icon: "🌟" },
      { title: "Kinda Didn't", color: "red", icon: "📉" },
      { title: "Action Items", color: "blue", icon: "✅" },
    ],
  },
  {
    id: "sailboat",
    name: "Sailboat",
    description:
      "Visualize the team as a sailboat. Identify the wind (drivers), anchors (blockers), rocks (risks), and the goal.",
    seoTitle: "Sailboat Retrospective Template | Free Online Retro Boat | Clear Retro",
    seoDescription: "Use the free sailboat retrospective template online. Visualize your team as a boat, identify wind, anchors, and rocks to chart your next sprint.",
    keywords: ["sailboat retrospective", "sailboat retrospective template", "retrospective boat", "sailing boat retrospective", "sailboat retrospective online", "retrospective sailboat", "sail boat retro", "segelboot retro", "sailboat retrospective example"],
    columns: [
      { title: "Wind", color: "green", icon: "💨" },
      { title: "Anchors", color: "red", icon: "⚓" },
      { title: "Rocks", color: "gray", icon: "🪨" },
      { title: "Goal", color: "blue", icon: "🎯" },
    ],
  },
];
