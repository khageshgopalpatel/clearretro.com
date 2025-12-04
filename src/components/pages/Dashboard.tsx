
import React, { useEffect, useState } from 'react';

import { type RetroBoard, type BoardTemplate } from '../../types';
import { getBoards, createBoard } from '../../services/storageService';
import { BOARD_TEMPLATES, MOCK_USER } from '../../constants';

const Dashboard: React.FC = () => {
  const [boards, setBoards] = useState<RetroBoard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<BoardTemplate>(BOARD_TEMPLATES[0]);


  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    setLoading(true);
    const data = await getBoards();
    setBoards(data.sort((a, b) => b.createdAt - a.createdAt));
    setLoading(false);
  };

  const handleCreateBoard = async () => {
    if (!newBoardName.trim()) return;

    const newBoard: RetroBoard = {
      id: Math.random().toString(36).substr(2, 9),
      title: newBoardName,
      ownerId: MOCK_USER.id,
      createdAt: Date.now(),
      columns: selectedTemplate.columns.map(c => ({
        id: Math.random().toString(36).substr(2, 9),
        title: c.title,
        color: c.color
      })),
      cards: [],
      timer: { isActive: false, timeLeft: 300, endTime: undefined },
      settings: { isPrivate: false, isFocusMode: false }
    };

    await createBoard(newBoard);
    setShowCreateModal(false);
    window.location.href = `/board/${newBoard.id}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[80vh]">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight font-mono">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your team's retrospectives</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 transition-all transform hover:-translate-y-0.5 font-medium flex items-center"
        >
          <span className="text-xl mr-2 leading-none">+</span> New Retro
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-gray-200/50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800"></div>
          ))}
        </div>
      ) : boards.length === 0 ? (
        <div className="text-center py-24 bg-white/50 dark:bg-dark-800/50 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-700 backdrop-blur-sm">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-3xl mb-4">✨</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No retrospectives found</h3>
          <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto">Get started by creating your first board. It only takes a few seconds.</p>
          <button onClick={() => setShowCreateModal(true)} className="mt-6 text-brand-600 font-bold hover:text-brand-700 underline underline-offset-4">Create New Board</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map(board => (
            <div
              key={board.id}
              onClick={() => window.location.href = `/board/${board.id}`}
              className="group cursor-pointer bg-white/80 dark:bg-dark-800/80 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-brand-500 dark:hover:border-brand-500 transition-all shadow-sm hover:shadow-brand-500/20 backdrop-blur-sm relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gray-200 dark:bg-gray-700 group-hover:bg-brand-500 transition-colors"></div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors pr-4 line-clamp-1 font-mono">
                  {board.title}
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {board.columns.slice(0, 3).map((col, idx) => (
                    <div key={idx} className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <div className={`h-full bg-${col.color} w-full opacity-70`}></div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-gray-400 font-mono mb-1">CREATED</p>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {new Date(board.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 font-mono mb-1">CARDS</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{board.cards.length}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-dark-900 p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700 transform transition-all scale-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500 to-purple-600"></div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white font-mono">Create New Board</h2>

            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 font-mono">Board Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-dark-800 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all font-mono"
                placeholder="e.g. Sprint 24 Retro"
                value={newBoardName}
                autoFocus
                onChange={(e) => setNewBoardName(e.target.value)}
              />
            </div>

            <div className="mb-8">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 font-mono">Select Template</label>
              <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                {BOARD_TEMPLATES.map(t => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTemplate(t)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${selectedTemplate.id === t.id
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 ring-1 ring-brand-500'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                  >
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white text-sm font-mono">{t.name}</div>
                      <div className="text-xs text-gray-500 mt-1 flex gap-2">
                        {t.columns.map(c => <span key={c.title} className="bg-white dark:bg-dark-900 px-1.5 py-0.5 rounded border border-gray-100 dark:border-gray-700">{c.title}</span>)}
                      </div>
                    </div>
                    {selectedTemplate.id === t.id && <span className="text-brand-600">●</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-5 py-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors font-mono"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBoard}
                className="px-6 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-lg shadow-brand-500/30 transition-all font-mono"
                disabled={!newBoardName}
              >
                Create Board
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;