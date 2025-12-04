
import React from 'react';
import { BOARD_TEMPLATES } from '../../constants';

const Templates: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl tracking-tight font-mono">
          Retrospective Templates
        </h1>
        <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
          Proven formats to uncover insights and drive improvement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {BOARD_TEMPLATES.map((template) => (
          <div key={template.id} className="group bg-white dark:bg-dark-800 rounded-2xl shadow-sm hover:shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 flex flex-col h-full">
            {/* Template Visual Preview */}
            <div className="h-40 bg-gray-50 dark:bg-dark-900 border-b border-gray-100 dark:border-gray-700 p-4 flex gap-2 overflow-hidden relative">
              {/* Mock Columns */}
              {template.columns.map((col, i) => (
                <div key={i} className="flex-1 bg-white dark:bg-dark-800 border border-gray-200 dark:border-gray-700 rounded-t-lg shadow-sm flex flex-col opacity-80 group-hover:opacity-100 transition-opacity">
                  <div className={`h-1.5 w-full bg-${col.color} rounded-t-lg`}></div>
                  <div className="p-2">
                    <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-10 bg-gray-100 dark:bg-gray-700/50 rounded-md border border-dashed border-gray-200 dark:border-gray-700"></div>
                  </div>
                </div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none"></div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 font-mono">{template.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex-grow">
                Perfect for teams looking to focus on {template.columns.map(c => c.title).join(', ')}.
              </p>

              <div className="space-y-2 mb-6">
                {template.columns.map((col, idx) => (
                  <div key={idx} className="flex items-center text-xs">
                    <div className={`w-2.5 h-2.5 rounded-full bg-${col.color} mr-2 shadow-sm`}></div>
                    <span className="text-gray-600 dark:text-gray-300 font-mono">{col.title}</span>
                  </div>
                ))}
              </div>

              <a
                href="/dashboard"
                className="block text-center w-full bg-white dark:bg-dark-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold py-2.5 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-brand-500 dark:hover:border-brand-500 transition-all shadow-sm font-mono"
              >
                Use Template
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Templates;