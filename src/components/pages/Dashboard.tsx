
import React, { useState } from 'react';


import { useAuth } from '../../hooks/useAuth';
import { useUserBoards, createBoard, updateBoardName, deleteBoard } from '../../hooks/useBoard';

import { useSnackbar } from '../../context/SnackbarContext.jsx';
import { BOARD_TEMPLATES } from '../../data/templates';
import ConfirmDialog from '../ConfirmDialog.jsx';
import HeaderDropdown from '../HeaderDropdown';
import type { RetroBoard } from '../../types';

import { Providers } from '../Providers';
import { Logo } from '../Logo';



const COLUMN_COLORS: Record<string, string> = {
  green: 'bg-green-500',
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  yellow: 'bg-yellow-500',
  purple: 'bg-purple-500',
  pink: 'bg-pink-500',
  indigo: 'bg-indigo-500',
  gray: 'bg-gray-500',
  default: 'bg-gray-500'
};

const DashboardContent: React.FC = () => {
  const { user, logout, loading: authLoading } = useAuth();
  // Use window.location for navigation in Astro/React islands if react-router is not fully set up, 
  // but here we are inside a React island. However, Astro uses file-based routing.
  // We can use window.location.href for navigation between Astro pages.

  const { boards, loading: boardsLoading } = useUserBoards(user?.uid) as { boards: RetroBoard[], loading: boolean };

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [newBoardName, setNewBoardName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(BOARD_TEMPLATES[0]);

  const [creating, setCreating] = useState(false);
  const { showSnackbar } = useSnackbar();

  // Dialog states
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; boardId: string | null; boardName: string }>({ isOpen: false, boardId: null, boardName: '' });
  const [editDialog, setEditDialog] = useState<{ isOpen: boolean; boardId: string | null; boardName: string }>({ isOpen: false, boardId: null, boardName: '' });
  const [renaming, setRenaming] = useState(false);
  const [logoutDialog, setLogoutDialog] = useState(false);
  const [guestSignInDialog, setGuestSignInDialog] = useState(false);

  const loading = authLoading || boardsLoading;

  const handleCreateBoard = async () => {
    if (!newBoardName.trim()) return;
    if (!user) {
      // Redirect to signin instead of showing guest dialog
      window.location.href = '/signin';
      return;
    }

    if (user.isAnonymous) {
      setGuestSignInDialog(true);
      return;
    }

    setCreating(true);
    try {
      const columnsWithIds = selectedTemplate.columns.map(col => ({
        ...col,
        id: col.title.toLowerCase().replace(/\s+/g, '-'),
        cards: []
      }));

      const boardId = await createBoard(
        newBoardName,
        user.uid,
        columnsWithIds,
        null, // selectedTeam removed
        selectedTemplate.name
      );
      setShowCreateModal(false);
      window.location.href = `/board/${boardId}`;
    } catch (error) {
      console.error("Error creating board:", error);
      showSnackbar("Failed to create board", "error");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteBoard = async () => {
    if (!deleteDialog.boardId) return;
    try {
      await deleteBoard(deleteDialog.boardId);
      showSnackbar("Board deleted successfully", "success");
      setDeleteDialog({ isOpen: false, boardId: null, boardName: '' });
    } catch (error) {
      console.error("Error deleting board:", error);
      showSnackbar("Failed to delete board", "error");
    }
  };

  const handleRenameBoard = async () => {
    if (!editDialog.boardId || !editDialog.boardName.trim()) return;
    setRenaming(true);
    try {
      await updateBoardName(editDialog.boardId, editDialog.boardName);
      showSnackbar("Board renamed successfully", "success");
      setEditDialog({ isOpen: false, boardId: null, boardName: '' });
    } catch (error) {
      console.error("Error renaming board:", error);
      showSnackbar("Failed to rename board", "error");
    } finally {
      setRenaming(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/signin';
  };

const calculateStreak = (boards: RetroBoard[]) => {
    if (!boards.length) return 0;
    
    // Group dates by week string "YYYY-Www"
    const uniqueWeeks = new Set(boards.map(b => {
      const date = new Date(b.createdAt?.seconds * 1000 || Date.now());
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() + 4 - (d.getDay() || 7)); // Thursday
      const yearStart = new Date(d.getFullYear(), 0, 1);
      const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
      return `${d.getFullYear()}-W${weekNo}`;
    }));

    const sortedWeeks = Array.from(uniqueWeeks).sort().reverse();
    if (!sortedWeeks.length) return 0;

    // Check if current week is present (or last week if we want to be lenient)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    today.setDate(today.getDate() + 4 - (today.getDay() || 7));
    const yearStart = new Date(today.getFullYear(), 0, 1);
    const currentWeekNo = Math.ceil((((today.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    const currentWeekStr = `${today.getFullYear()}-W${currentWeekNo}`;

    // Simple consecutive check
    // Note: robust week math is complex, this is MVP approximation
    // We just count unique active weeks for now to encourage frequency
    return uniqueWeeks.size; 
  };

  const streak = calculateStreak(boards);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 min-h-[80vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-10 gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="p-2 bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <Logo className="w-8 h-8 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight font-mono hidden md:block">Clear Retro</h1>
              <span className="px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider">Dashboard</span>
              {streak > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-full text-orange-600 dark:text-orange-400 font-bold font-mono text-xs animate-in slide-in-from-left-4 fade-in duration-500" title="Weekly Streak">
                  <span className="animate-pulse">🔥</span> {streak} Week Streak
                </div>
              )}
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-1 hidden md:block">Manage your team's retrospectives</p>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <button
            onClick={() => setShowCreateModal(true)}
            className="flex-1 md:flex-none px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 transition-all transform hover:-translate-y-0.5 font-medium flex items-center justify-center"
            >
            <span className="text-xl mr-2 leading-none">+</span> New Retro
            </button>
            <HeaderDropdown user={user} onLogout={handleLogout} />
        </div>
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
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors pr-4 line-clamp-1 font-mono flex-1">
                  {board.name}
                </h3>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setEditDialog({ isOpen: true, boardId: board.id, boardName: board.name })}
                    className="p-1.5 text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Rename Board"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      <path d="m15 5 4 4" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeleteDialog({ isOpen: true, boardId: board.id, boardName: board.name })}
                    className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete Board"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {board.columns.slice(0, 3).map((col, idx) => (
                    <div key={idx} className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <div className={`h-full ${COLUMN_COLORS[col.color] || COLUMN_COLORS.default} w-full opacity-70`}></div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-4 text-xs text-gray-500 font-mono">
                    <span className="flex items-center gap-1">
                      📅 {new Date(board.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString()}
                    </span>
                    {board.templateName && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">
                        📋 {board.templateName}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    {/* Card count not available */}
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
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1 font-mono">{t.name}</h3>
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
                disabled={!newBoardName || creating}
              >
                {creating ? 'Creating...' : 'Create Board'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-dark-900 p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700 transform transition-all scale-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500 to-purple-600"></div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white font-mono">Rename Board</h2>

            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 font-mono">Board Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-dark-800 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all font-mono"
                placeholder="e.g. Sprint 24 Retro"
                value={editDialog.boardName}
                autoFocus
                onChange={(e) => setEditDialog({ ...editDialog, boardName: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && editDialog.boardName.trim()) {
                    handleRenameBoard();
                  }
                }}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => setEditDialog({ isOpen: false, boardId: null, boardName: '' })}
                className="px-5 py-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors font-mono"
              >
                Cancel
              </button>
              <button
                onClick={handleRenameBoard}
                className="px-6 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-lg shadow-brand-500/30 transition-all font-mono"
                disabled={!editDialog.boardName.trim() || renaming}
              >
                {renaming ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Board"
        message={`Are you sure you want to delete "${deleteDialog.boardName}"? This action cannot be undone and will delete all cards in this board.`}
        confirmText="Delete Board"
        isDestructive
        onConfirm={handleDeleteBoard}
        onCancel={() => setDeleteDialog({ isOpen: false, boardId: null, boardName: '' })}
        onClose={() => setDeleteDialog({ isOpen: false, boardId: null, boardName: '' })}
      />

      <ConfirmDialog
        isOpen={guestSignInDialog}
        title="Sign In Required"
        message="Guest users cannot create boards. Would you like to sign in with Google?"
        confirmText="Sign In"
        onConfirm={() => {
          // Redirect to login or handle login
          window.location.href = '/signin';
          setGuestSignInDialog(false);
        }}
        onCancel={() => setGuestSignInDialog(false)}
        onClose={() => setGuestSignInDialog(false)}
      />
    </div>
  );
};

const Dashboard: React.FC = () => {
  return (
    <Providers>
      <DashboardContent />
    </Providers>
  );
};

export default Dashboard;