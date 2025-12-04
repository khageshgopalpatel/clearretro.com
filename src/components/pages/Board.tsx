
import React, { useEffect, useState, useRef } from 'react';

import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { type RetroBoard, type RetroCard, type RetroColumn, type AISummaryResult, AISummaryStatus } from '../../types';
import { getBoardById, updateBoard } from '../../services/storageService';
import { generateRetroSummary, groupCardsSemantically } from '../../services/geminiService';
import { MOCK_USER } from '../../constants';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

// --- Sub Components ---

interface SortableCardProps {
  card: RetroCard;
  onDelete: (id: string) => void;
  onVote: (id: string) => void;
  isPrivate: boolean;
}

const SortableCard: React.FC<SortableCardProps> = ({ card, onDelete, onVote, isPrivate }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition
  };

  const shouldBlur = isPrivate;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white dark:bg-[#18181b] p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 mb-3 group relative hover:shadow-[0_0_15px_rgba(45,212,191,0.1)] hover:border-brand-500/30 transition-all duration-200 cursor-grab active:cursor-grabbing animate-in fade-in slide-in-from-bottom-2 duration-300 ${shouldBlur ? 'select-none' : ''}`}
    >
      <div className={`text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed font-mono ${shouldBlur ? 'blur-[5px] opacity-60' : ''}`}>
        {card.text}
      </div>

      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-800/50">
        <button
          onPointerDown={(e) => { e.stopPropagation(); onVote(card.id); }}
          className={`text-xs flex items-center gap-1.5 px-2 py-1 rounded transition-colors border ${card.votes > 0 ? 'bg-brand-50 border-brand-200 text-brand-700 dark:bg-brand-900/20 dark:border-brand-800 dark:text-brand-400' : 'border-transparent text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        >
          <span>👍</span> <span className="font-bold font-mono">{card.votes}</span>
        </button>
        <button
          onPointerDown={(e) => { e.stopPropagation(); onDelete(card.id); }}
          className="text-xs text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all px-2 py-1"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

// --- Main Board Component ---

interface BoardProps {
  id: string;
}

const Board: React.FC<BoardProps> = ({ id }) => {
  const [board, setBoard] = useState<RetroBoard | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [newCardText, setNewCardText] = useState<{ [key: string]: string }>({});

  // UI States
  const [isPrivateMode, setIsPrivateMode] = useState(false);

  // AI States
  const [summaryStatus, setSummaryStatus] = useState<AISummaryStatus>(AISummaryStatus.IDLE);
  const [summaryResult, setSummaryResult] = useState<AISummaryResult | null>(null);
  const [isGrouping, setIsGrouping] = useState(false);

  // Timer
  const [timerInterval, setTimerInterval] = useState<ReturnType<typeof setInterval> | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (id) {
      loadBoard(id);
      const interval = setInterval(() => loadBoard(id), 5000);
      return () => clearInterval(interval);
    }
  }, [id]);

  useEffect(() => {
    // If timer is active, update the local display based on endTime every second
    if (board?.timer.isActive && board.timer.endTime) {
      const int = setInterval(() => {
        setBoard(prev => {
          if (!prev || !prev.timer.isActive || !prev.timer.endTime) return prev;

          const now = Date.now();
          const remaining = Math.max(0, Math.ceil((prev.timer.endTime - now) / 1000));

          if (remaining !== prev.timer.timeLeft) {
            return { ...prev, timer: { ...prev.timer, timeLeft: remaining } };
          }
          return prev;
        });
      }, 1000);
      setTimerInterval(int);
    } else if (timerInterval) {
      clearInterval(timerInterval);
    }
    return () => { if (timerInterval) clearInterval(timerInterval); };
  }, [board?.timer.isActive, board?.timer.endTime]);

  const loadBoard = async (boardId: string) => {
    const data = await getBoardById(boardId);
    if (data) {
      // Correctly calculate current timeLeft if timer is running based on server endTime
      if (data.timer.isActive && data.timer.endTime) {
        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((data.timer.endTime - now) / 1000));
        data.timer.timeLeft = remaining;

        // Auto-pause if time is up locally to prevent negative drift
        if (remaining <= 0) {
          data.timer.isActive = false;
        }
      }
      setBoard(data);
    }
    setLoading(false);
  };

  const saveBoard = async (newBoard: RetroBoard) => {
    setBoard(newBoard);
    await updateBoard(newBoard);
  };

  const toggleTimer = async () => {
    if (!board) return;

    let newTimer = { ...board.timer };

    if (newTimer.isActive) {
      // Pause
      newTimer.isActive = false;
      // Keep current timeLeft as the snapshot
      newTimer.endTime = undefined;
    } else {
      // Start
      newTimer.isActive = true;
      // Set end time based on current timeLeft
      newTimer.endTime = Date.now() + (newTimer.timeLeft * 1000);
    }

    saveBoard({ ...board, timer: newTimer });
  };

  // --- Actions ---

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || !board) return;

    const activeCard = board.cards.find(c => c.id === active.id);
    if (!activeCard) return;

    const overColumn = board.columns.find(c => c.id === over.id);
    const overCard = board.cards.find(c => c.id === over.id);
    const overColumnId = overColumn ? overColumn.id : (overCard ? overCard.columnId : null);

    if (overColumnId && activeCard.columnId !== overColumnId) {
      const newCards = board.cards.map(c =>
        c.id === activeCard.id ? { ...c, columnId: overColumnId } : c
      );
      saveBoard({ ...board, cards: newCards });
    }
  };

  const addCard = (columnId: string) => {
    if (!board || !newCardText[columnId]?.trim()) return;

    const newCard: RetroCard = {
      id: Math.random().toString(36).substr(2, 9),
      columnId,
      text: newCardText[columnId],
      votes: 0,
      userId: MOCK_USER.id,
      createdAt: Date.now(),
      isRevealed: true
    };

    saveBoard({ ...board, cards: [...board.cards, newCard] });
    setNewCardText({ ...newCardText, [columnId]: '' });
  };

  const deleteCard = (cardId: string) => {
    if (!board) return;
    saveBoard({ ...board, cards: board.cards.filter(c => c.id !== cardId) });
  };

  const voteCard = (cardId: string) => {
    if (!board) return;
    saveBoard({
      ...board,
      cards: board.cards.map(c => c.id === cardId ? { ...c, votes: c.votes + 1 } : c)
    });
  };

  // --- AI Features ---

  const handleGenerateSummary = async () => {
    if (!board || board.cards.length === 0) return;
    setSummaryStatus(AISummaryStatus.LOADING);
    try {
      const result = await generateRetroSummary(board.cards);
      if (result) {
        setSummaryResult(result);
        setSummaryStatus(AISummaryStatus.SUCCESS);
      } else {
        setSummaryStatus(AISummaryStatus.ERROR);
      }
    } catch (e) {
      setSummaryStatus(AISummaryStatus.ERROR);
    }
  };

  const handleSmartGrouping = async () => {
    if (!board) return;
    setIsGrouping(true);
    const groups = await groupCardsSemantically(board.cards);

    if (groups) {
      const newCards = board.cards.map(card => {
        let groupName = "Misc";
        for (const [name, ids] of Object.entries(groups)) {
          if (ids.includes(card.id)) groupName = name;
        }
        return { ...card, text: `[${groupName}] ${card.text}` };
      });
      saveBoard({ ...board, cards: newCards });
    }
    setIsGrouping(false);
  };

  // --- Exports ---

  const exportPDF = () => {
    if (!board) return;
    const doc = new jsPDF();
    doc.setFont('monospace');
    doc.text(`Retro: ${board.title}`, 10, 10);
    let y = 20;
    board.columns.forEach(col => {
      doc.text(`Column: ${col.title}`, 10, y);
      y += 10;
      board.cards.filter(c => c.columnId === col.id).forEach(c => {
        const splitText = doc.splitTextToSize(`- ${c.text} (${c.votes})`, 180);
        doc.text(splitText, 15, y);
        y += (splitText.length * 7);
      });
      y += 10;
    });
    doc.save(`${board.title}.pdf`);
  };

  const exportExcel = () => {
    if (!board) return;
    const data = board.cards.map(c => ({
      Column: board.columns.find(col => col.id === c.columnId)?.title,
      Text: c.text,
      Votes: c.votes,
      User: c.userId
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Retro Data");
    XLSX.writeFile(wb, `${board.title}.xlsx`);
  };

  if (loading || !board) return <div className="min-h-screen flex items-center justify-center dark:bg-[#050505] dark:text-brand-400 font-mono text-xl animate-pulse">System Initializing...</div>;

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-[#f8fafc] dark:bg-[#050505] overflow-hidden bg-grid-pattern transition-colors duration-500">
      {/* Board Header */}
      <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-dark-950/70 backdrop-blur-xl flex justify-between items-center shrink-0 z-20 sticky top-0">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight font-mono">{board.title}</h1>
            <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">{new Date().toDateString()}</span>
          </div>

          <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 mx-2"></div>

          <div className={`flex items-center gap-3 px-4 py-1.5 rounded-lg border transition-all ${board.timer.isActive ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-900/10 shadow-[0_0_10px_rgba(45,212,191,0.2)]' : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-dark-900'}`}>
            <span className={`font-mono text-2xl font-bold ${board.timer.timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-gray-800 dark:text-gray-200'}`}>
              {formatTime(board.timer.timeLeft)}
            </span>
            <button
              onClick={toggleTimer}
              className="ml-2 w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              {board.timer.isActive ? '⏸' : '▶️'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Private Mode Toggle */}
          <button
            onClick={() => setIsPrivateMode(!isPrivateMode)}
            className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all ${isPrivateMode ? 'bg-purple-100 dark:bg-purple-900/20 border-purple-500 text-purple-600 shadow-[0_0_15px_rgba(216,180,254,0.3)]' : 'bg-white dark:bg-dark-900 border-gray-200 dark:border-gray-800 text-gray-500'}`}
            title={isPrivateMode ? "Private Mode: ON (Text Blurred)" : "Private Mode: OFF"}
          >
            {isPrivateMode ? '🙈' : '👁️'}
          </button>

          <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 mx-2"></div>

          <button
            onClick={handleSmartGrouping}
            disabled={isGrouping}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-900 border border-brand-200 dark:border-brand-900/50 text-brand-700 dark:text-brand-400 rounded-lg hover:shadow-[0_0_10px_rgba(45,212,191,0.2)] hover:border-brand-400 transition-all text-sm font-bold font-mono group"
          >
            {isGrouping ? <span className="animate-spin">⚡</span> : <span className="group-hover:animate-pulse">⚡</span>}
            {isGrouping ? 'Grouping...' : 'AI Group'}
          </button>

          <button
            onClick={handleGenerateSummary}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800 transition-all text-sm font-bold font-mono"
          >
            📝 Summary
          </button>

          <div className="relative group">
            <button className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:opacity-90 transition-all text-sm font-bold shadow-lg shadow-gray-500/20">
              Export
            </button>
            {/* Invisible bridge with padding-top (pt-2) ensures hover state is maintained when moving cursor to dropdown */}
            <div className="absolute right-0 top-full pt-2 w-40 hidden group-hover:block z-50">
              <div className="bg-white dark:bg-dark-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <button onClick={exportPDF} className="block w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-dark-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-800 transition-colors">📄 PDF Report</button>
                <button onClick={exportExcel} className="block w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-dark-800 dark:text-gray-200 transition-colors">📊 Excel / CSV</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Summary Modal Overlay */}
      {summaryResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-dark-900 rounded-xl shadow-2xl max-w-3xl w-full p-8 max-h-[85vh] overflow-y-auto border border-gray-100 dark:border-gray-700 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-purple-600 rounded-xl blur opacity-20 -z-10"></div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold dark:text-white mb-1 font-mono">Retro Summary</h2>
                <p className="text-brand-600 dark:text-brand-400 text-xs font-mono uppercase tracking-widest">Powered by Gemini 2.0</p>
              </div>
              <button onClick={() => setSummaryResult(null)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white text-2xl">×</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-5 rounded-lg bg-gray-50 dark:bg-dark-950 border border-gray-200 dark:border-gray-800 text-center">
                <p className="text-xs font-bold text-gray-500 uppercase font-mono">Sentiment Score</p>
                <div className={`text-6xl font-extrabold mt-3 ${summaryResult.sentimentScore > 7 ? 'text-green-500' : summaryResult.sentimentScore < 5 ? 'text-red-500' : 'text-yellow-500'}`}>
                  {summaryResult.sentimentScore}
                </div>
              </div>
              <div className="col-span-2 p-5 rounded-lg bg-blue-50/50 dark:bg-dark-950 border border-blue-100 dark:border-blue-900/30">
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase mb-2 font-mono">Executive Summary</p>
                <p className="text-gray-800 dark:text-gray-300 leading-relaxed text-sm md:text-base font-medium">{summaryResult.executiveSummary}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase mb-4 tracking-wider font-mono">Suggested Action Items</h3>
              <ul className="space-y-3">
                {summaryResult.actionItems.map((item, i) => (
                  <li key={i} className="flex items-start bg-white dark:bg-dark-950 p-4 rounded border border-gray-200 dark:border-gray-800 shadow-sm">
                    <span className="flex-shrink-0 w-6 h-6 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded flex items-center justify-center text-xs font-bold mr-4 font-mono">{i + 1}</span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex justify-end">
              <button onClick={() => setSummaryResult(null)} className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-lg hover:opacity-90">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Columns Area */}
      <div className="flex-grow overflow-x-auto overflow-y-hidden custom-scrollbar">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex h-full p-8 gap-6 min-w-full">
            {board.columns.map((column) => (
              <div key={column.id} className="flex-1 min-w-[20rem] flex flex-col h-full bg-white/30 dark:bg-dark-900/40 backdrop-blur-md rounded-lg border border-gray-200/60 dark:border-gray-700/60 shadow-sm transition-all duration-300 group hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg">
                {/* Column Header */}
                <div className={`p-4 border-b border-gray-100 dark:border-gray-800 bg-white/40 dark:bg-dark-900/60 rounded-t-lg backdrop-blur-sm relative overflow-hidden`}>
                  <div className={`absolute top-0 left-0 w-full h-1 bg-${column.color}`}></div>
                  <h3 className="font-bold text-gray-900 dark:text-white flex justify-between items-center text-md font-mono relative z-10">
                    {column.title}
                    <span className="bg-white/50 dark:bg-white/10 px-2 py-0.5 rounded text-xs text-gray-600 dark:text-gray-300 font-mono">
                      {board.cards.filter(c => c.columnId === column.id).length}
                    </span>
                  </h3>
                </div>

                {/* Cards Container */}
                <div className="flex-grow overflow-y-auto p-3 custom-scrollbar space-y-3">
                  <SortableContext
                    items={board.cards.filter(c => c.columnId === column.id).map(c => c.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {board.cards
                      .filter(c => c.columnId === column.id)
                      .map(card => (
                        <SortableCard
                          key={card.id}
                          card={card}
                          onDelete={deleteCard}
                          onVote={voteCard}
                          isPrivate={isPrivateMode}
                        />
                      ))}
                  </SortableContext>
                </div>

                {/* Add Card Input */}
                <div className="p-3 bg-white/40 dark:bg-dark-900/40 rounded-b-lg border-t border-gray-100 dark:border-gray-800/50 backdrop-blur-sm">
                  <div className="relative group/input">
                    <textarea
                      placeholder="> Type input..."
                      className="w-full text-sm p-3 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#18181b] dark:text-white focus:ring-1 focus:ring-brand-500 focus:border-brand-500 focus:shadow-[0_0_10px_rgba(45,212,191,0.2)] outline-none resize-none shadow-inner transition-all font-mono"
                      rows={2}
                      value={newCardText[column.id] || ''}
                      onChange={(e) => setNewCardText({ ...newCardText, [column.id]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          addCard(column.id);
                        }
                      }}
                    />
                    <button
                      onClick={() => addCard(column.id)}
                      className="absolute bottom-2 right-2 p-1.5 text-gray-400 hover:text-brand-500 transition-colors opacity-50 group-hover/input:opacity-100"
                      title="Add Card"
                    >
                      ↵
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <DragOverlay>
            {activeId ? (
              <div className="bg-white dark:bg-dark-800 p-4 rounded-lg shadow-2xl border border-brand-500 w-80 rotate-2 cursor-grabbing opacity-90 backdrop-blur-sm">
                <p className="text-sm text-gray-800 dark:text-gray-200 font-medium font-mono">
                  {board.cards.find(c => c.id === activeId)?.text}
                </p>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default Board;
