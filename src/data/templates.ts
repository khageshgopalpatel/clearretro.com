import type { BoardTemplate } from '../types';

export const BOARD_TEMPLATES: BoardTemplate[] = [
    {
        id: 'start-stop-continue',
        name: 'Start, Stop, Continue',
        // description: 'The classic retro format. Good for action-oriented feedback.',
        columns: [
            { title: 'Start', color: 'green' },
            { title: 'Stop', color: 'red' },
            { title: 'Continue', color: 'blue' }
        ]
    },
    {
        id: 'mad-sad-glad',
        name: 'Mad, Sad, Glad',
        // description: 'Focus on emotional health and team morale.',
        columns: [
            { title: 'Mad', color: 'red' },
            { title: 'Sad', color: 'blue' },
            { title: 'Glad', color: 'green' }
        ]
    },
    {
        id: 'lean-coffee',
        name: 'Lean Coffee',
        // description: 'Agenda-less meeting structure. Discuss what matters most.',
        columns: [
            { title: 'To Discuss', color: 'blue' },
            { title: 'Discussing', color: 'yellow' },
            { title: 'Discussed', color: 'green' }
        ]
    },
    {
        id: '4ls',
        name: '4Ls (Liked, Learned, Lacked, Longed For)',
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
        columns: [
            { title: 'Wind', color: 'green' },
            { title: 'Anchors', color: 'red' },
            { title: 'Rocks', color: 'gray' },
            { title: 'Goal', color: 'blue' }
        ]
    }
];
