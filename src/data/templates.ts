import type { BoardTemplate } from "../types";

export const BOARD_TEMPLATES: BoardTemplate[] = [
  {
    id: "start-stop-continue",
    name: "Start, Stop, Continue",
    description:
      "The classic retro format. Helps the team identify what to start doing, stop doing, and continue doing for continuous improvement.",
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
    columns: [
      { title: "Wind", color: "green", icon: "💨" },
      { title: "Anchors", color: "red", icon: "⚓" },
      { title: "Rocks", color: "gray", icon: "🪨" },
      { title: "Goal", color: "blue", icon: "🎯" },
    ],
  },
];
