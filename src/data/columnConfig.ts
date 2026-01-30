// Column colors with their CSS classes and display names
export const COLUMN_COLORS: Record<string, { bg: string; border: string; text: string; light: string; name: string }> = {
  green: { 
    bg: 'bg-green-500', 
    border: 'border-green-500', 
    text: 'text-green-500', 
    light: 'bg-green-500/20',
    name: 'Green'
  },
  red: { 
    bg: 'bg-red-500', 
    border: 'border-red-500', 
    text: 'text-red-500', 
    light: 'bg-red-500/20',
    name: 'Red'
  },
  blue: { 
    bg: 'bg-blue-500', 
    border: 'border-blue-500', 
    text: 'text-blue-500', 
    light: 'bg-blue-500/20',
    name: 'Blue'
  },
  yellow: { 
    bg: 'bg-yellow-500', 
    border: 'border-yellow-500', 
    text: 'text-yellow-500', 
    light: 'bg-yellow-500/20',
    name: 'Yellow'
  },
  purple: { 
    bg: 'bg-purple-500', 
    border: 'border-purple-500', 
    text: 'text-purple-500', 
    light: 'bg-purple-500/20',
    name: 'Purple'
  },
  pink: { 
    bg: 'bg-pink-500', 
    border: 'border-pink-500', 
    text: 'text-pink-500', 
    light: 'bg-pink-500/20',
    name: 'Pink'
  },
  indigo: { 
    bg: 'bg-indigo-500', 
    border: 'border-indigo-500', 
    text: 'text-indigo-500', 
    light: 'bg-indigo-500/20',
    name: 'Indigo'
  },
  orange: { 
    bg: 'bg-orange-500', 
    border: 'border-orange-500', 
    text: 'text-orange-500', 
    light: 'bg-orange-500/20',
    name: 'Orange'
  },
  teal: { 
    bg: 'bg-teal-500', 
    border: 'border-teal-500', 
    text: 'text-teal-500', 
    light: 'bg-teal-500/20',
    name: 'Teal'
  },
  gray: { 
    bg: 'bg-gray-500', 
    border: 'border-gray-500', 
    text: 'text-gray-500', 
    light: 'bg-gray-500/20',
    name: 'Gray'
  },
};

// Default color fallback
export const DEFAULT_COLUMN_COLOR = COLUMN_COLORS.gray;

// Get color classes with fallback
export const getColumnColor = (colorKey: string) => {
  return COLUMN_COLORS[colorKey] || DEFAULT_COLUMN_COLOR;
};

// All available color keys for picker
export const AVAILABLE_COLORS = Object.keys(COLUMN_COLORS);

// Column icons - common emojis for retrospectives
export const COLUMN_ICONS: { emoji: string; label: string }[] = [
  // Positive / Success
  { emoji: '✅', label: 'Check' },
  { emoji: '👍', label: 'Thumbs Up' },
  { emoji: '🎉', label: 'Celebration' },
  { emoji: '⭐', label: 'Star' },
  { emoji: '💚', label: 'Green Heart' },
  { emoji: '🚀', label: 'Rocket' },
  { emoji: '💡', label: 'Idea' },
  { emoji: '🌟', label: 'Glowing Star' },
  
  // Negative / Issues
  { emoji: '❌', label: 'Cross' },
  { emoji: '👎', label: 'Thumbs Down' },
  { emoji: '🔴', label: 'Red Circle' },
  { emoji: '⚠️', label: 'Warning' },
  { emoji: '🛑', label: 'Stop' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😡', label: 'Angry' },
  { emoji: '🔥', label: 'Fire' },
  
  // Neutral / Process
  { emoji: '🔄', label: 'Cycle' },
  { emoji: '📝', label: 'Notes' },
  { emoji: '💭', label: 'Thought' },
  { emoji: '❓', label: 'Question' },
  { emoji: '🎯', label: 'Target' },
  { emoji: '📌', label: 'Pin' },
  { emoji: '🔧', label: 'Wrench' },
  { emoji: '⚡', label: 'Lightning' },
  
  // Sailboat / Metaphors
  { emoji: '⛵', label: 'Sailboat' },
  { emoji: '⚓', label: 'Anchor' },
  { emoji: '🌊', label: 'Wave' },
  { emoji: '💨', label: 'Wind' },
  { emoji: '🪨', label: 'Rock' },
  { emoji: '🏝️', label: 'Island' },
  
  // 4Ls
  { emoji: '❤️', label: 'Heart' },
  { emoji: '📚', label: 'Books' },
  { emoji: '🤔', label: 'Thinking' },
  { emoji: '🙏', label: 'Hope' },
];

// Default icons for common column types
export const DEFAULT_COLUMN_ICONS: Record<string, string> = {
  // Start/Stop/Continue
  'start': '🚀',
  'stop': '🛑',
  'continue': '🔄',
  
  // Mad/Sad/Glad
  'mad': '😡',
  'sad': '😢',
  'glad': '🎉',
  
  // 4Ls
  'liked': '❤️',
  'learned': '📚',
  'lacked': '🤔',
  'longed for': '🙏',
  
  // Sailboat
  'wind': '💨',
  'anchors': '⚓',
  'rocks': '🪨',
  'goal': '🎯',
  
  // Lean Coffee
  'to discuss': '💭',
  'discussing': '🔄',
  'discussed': '✅',
  
  // General
  'went well': '✅',
  'to improve': '🔧',
  'action items': '⚡',
};

// Get a suggested icon based on column title
export const suggestIcon = (title: string): string => {
  const lowerTitle = title.toLowerCase();
  return DEFAULT_COLUMN_ICONS[lowerTitle] || '';
};
