import React, { useState, useRef, useEffect } from 'react';
import { COLUMN_COLORS, AVAILABLE_COLORS, COLUMN_ICONS, getColumnColor } from '../data/columnConfig';

interface ColorIconPickerProps {
  color: string;
  icon?: string;
  onColorChange: (color: string) => void;
  onIconChange: (icon: string) => void;
}

const ColorIconPicker: React.FC<ColorIconPickerProps> = ({
  color,
  icon,
  onColorChange,
  onIconChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'color' | 'icon'>('color');
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const colorConfig = getColumnColor(color);

  return (
    <div className="relative" ref={pickerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 transition-all hover:scale-105 ${colorConfig.border} ${colorConfig.light}`}
        title="Customize color & icon"
      >
        {icon && <span className="text-base">{icon}</span>}
        <div className={`w-4 h-4 rounded-full ${colorConfig.bg}`}></div>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="text-gray-400"
        >
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>

      {/* Dropdown Picker */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-white dark:bg-dark-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200 w-64">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setActiveTab('color')}
              className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === 'color'
                  ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 border-b-2 border-brand-500'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              🎨 Colors
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('icon')}
              className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === 'icon'
                  ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 border-b-2 border-brand-500'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              ✨ Icons
            </button>
          </div>

          {/* Content */}
          <div className="p-3">
            {activeTab === 'color' ? (
              <div className="grid grid-cols-5 gap-2">
                {AVAILABLE_COLORS.map((colorKey) => {
                  const colorData = COLUMN_COLORS[colorKey];
                  const isSelected = colorKey === color;
                  return (
                    <button
                      key={colorKey}
                      type="button"
                      onClick={() => {
                        onColorChange(colorKey);
                      }}
                      className={`w-10 h-10 rounded-lg transition-all hover:scale-110 ${colorData.bg} ${
                        isSelected ? 'ring-2 ring-offset-2 ring-gray-900 dark:ring-white' : ''
                      }`}
                      title={colorData.name}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="max-h-48 overflow-y-auto">
                <div className="grid grid-cols-6 gap-1">
                  {/* No icon option */}
                  <button
                    type="button"
                    onClick={() => {
                      onIconChange('');
                    }}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 ${
                      !icon ? 'ring-2 ring-brand-500 bg-brand-50 dark:bg-brand-900/20' : ''
                    }`}
                    title="No icon"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                    </svg>
                  </button>
                  {COLUMN_ICONS.map((iconItem) => {
                    const isSelected = icon === iconItem.emoji;
                    return (
                      <button
                        key={iconItem.emoji}
                        type="button"
                        onClick={() => {
                          onIconChange(iconItem.emoji);
                        }}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-700 text-lg ${
                          isSelected ? 'ring-2 ring-brand-500 bg-brand-50 dark:bg-brand-900/20' : ''
                        }`}
                        title={iconItem.label}
                      >
                        {iconItem.emoji}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Current Selection Display */}
          <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-900/50 flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">Current:</span>
            <div className="flex items-center gap-2">
              {icon && <span className="text-lg">{icon}</span>}
              <div className={`w-5 h-5 rounded-full ${colorConfig.bg}`}></div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{colorConfig.name}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorIconPicker;
