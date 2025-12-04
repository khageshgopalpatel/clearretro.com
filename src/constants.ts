import { BoardTemplate } from './types';

export const BOARD_TEMPLATES: BoardTemplate[] = [
  {
    id: 'start-stop-continue',
    name: 'Start / Stop / Continue',
    columns: [
      { title: 'Start', color: 'green-500' },
      { title: 'Stop', color: 'red-500' },
      { title: 'Continue', color: 'blue-500' },
    ],
  },
  {
    id: 'mad-sad-glad',
    name: 'Mad / Sad / Glad',
    columns: [
      { title: 'Mad', color: 'red-500' },
      { title: 'Sad', color: 'yellow-500' },
      { title: 'Glad', color: 'green-500' },
    ],
  },
  {
    id: 'went-well-improve',
    name: 'Went Well / To Improve',
    columns: [
      { title: 'Went Well', color: 'green-500' },
      { title: 'To Improve', color: 'orange-500' },
      { title: 'Action Items', color: 'purple-500' },
    ],
  },
];

export const MOCK_USER = {
  id: 'user-' + Math.random().toString(36).substr(2, 9),
  name: 'Developer',
  isGuest: false,
};
