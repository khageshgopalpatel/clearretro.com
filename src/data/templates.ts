import type { BoardTemplate } from '../types';

export const BOARD_TEMPLATES: BoardTemplate[] = [
    {
        id: 'start-stop-continue',
        name: 'Start, Stop, Continue',
        description: 'The classic retro format. Helps the team identify what to start doing, stop doing, and continue doing for continuous improvement.',
        columns: [
            { title: 'Start', color: 'green', icon: '🚀' },
            { title: 'Stop', color: 'red', icon: '🛑' },
            { title: 'Continue', color: 'blue', icon: '🔄' }
        ]
    },
    {
        id: 'mad-sad-glad',
        name: 'Mad, Sad, Glad',
        description: 'Focus on emotional health and team morale. Identify things that made you mad, sad, or glad during the sprint.',
        columns: [
            { title: 'Mad', color: 'red', icon: '😡' },
            { title: 'Sad', color: 'blue', icon: '😢' },
            { title: 'Glad', color: 'green', icon: '🎉' }
        ]
    },
    {
        id: 'lean-coffee',
        name: 'Lean Coffee',
        description: 'An agenda-less meeting structure providing a democratic and focused way to discuss the topics that matter most to the team.',
        columns: [
            { title: 'To Discuss', color: 'blue', icon: '💭' },
            { title: 'Discussing', color: 'yellow', icon: '🔄' },
            { title: 'Discussed', color: 'green', icon: '✅' }
        ]
    },
    {
        id: '4ls',
        name: '4Ls (Liked, Learned, Lacked, Longed For)',
        description: 'Reflect on what the team liked, learned, lacked, and longed for. Great for uncovering hidden issues and desires.',
        columns: [
            { title: 'Liked', color: 'green', icon: '❤️' },
            { title: 'Learned', color: 'blue', icon: '📚' },
            { title: 'Lacked', color: 'red', icon: '🤔' },
            { title: 'Longed For', color: 'yellow', icon: '🙏' }
        ]
    },
    {
        id: 'sailboat',
        name: 'Sailboat',
        description: 'Visualize the team as a sailboat. Identify the wind (drivers), anchors (blockers), rocks (risks), and the goal.',
        columns: [
            { title: 'Wind', color: 'green', icon: '💨' },
            { title: 'Anchors', color: 'red', icon: '⚓' },
            { title: 'Rocks', color: 'gray', icon: '🪨' },
            { title: 'Goal', color: 'blue', icon: '🎯' }
        ]
    }
];
