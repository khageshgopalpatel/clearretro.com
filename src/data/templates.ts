import type { BoardTemplate } from '../types';

export const BOARD_TEMPLATES: BoardTemplate[] = [
    {
        id: 'start-stop-continue',
        name: 'Start, Stop, Continue',
        description: 'The classic retro format. Helps the team identify what to start doing, stop doing, and continue doing for continuous improvement.',
        columns: [
            { title: 'Start', color: 'green' },
            { title: 'Stop', color: 'red' },
            { title: 'Continue', color: 'blue' }
        ]
    },
    {
        id: 'mad-sad-glad',
        name: 'Mad, Sad, Glad',
        description: 'Focus on emotional health and team morale. Identify things that made you mad, sad, or glad during the sprint.',
        columns: [
            { title: 'Mad', color: 'red' },
            { title: 'Sad', color: 'blue' },
            { title: 'Glad', color: 'green' }
        ]
    },
    {
        id: 'lean-coffee',
        name: 'Lean Coffee',
        description: 'An agenda-less meeting structure providing a democratic and focused way to discuss the topics that matter most to the team.',
        columns: [
            { title: 'To Discuss', color: 'blue' },
            { title: 'Discussing', color: 'yellow' },
            { title: 'Discussed', color: 'green' }
        ]
    },
    {
        id: '4ls',
        name: '4Ls (Liked, Learned, Lacked, Longed For)',
        description: 'Reflect on what the team liked, learned, lacked, and longed for. Great for uncovering hidden issues and desires.',
        columns: [
            { title: 'Liked', color: 'green' },
            { title: 'Learned', color: 'blue' },
            { title: 'Lacked', color: 'red' },
            { title: 'Longed For', color: 'yellow' }
        ]
    },
    {
        id: 'sailboat',
        name: 'Sailboat',
        description: 'Visualize the team as a sailboat. Identify the wind (drivers), anchors (blockers), rocks (risks), and the goal.',
        columns: [
            { title: 'Wind', color: 'green' },
            { title: 'Anchors', color: 'red' },
            { title: 'Rocks', color: 'gray' },
            { title: 'Goal', color: 'blue' }
        ]
    }
];
