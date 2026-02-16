import React, { useEffect, useState, useRef } from "react";

import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDndContext, // Add this
  pointerWithin,
  rectIntersection,
  getFirstCollision,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  type RetroBoard,
  type RetroCard,
  type RetroColumn,
  type AISummaryResult,
  AISummaryStatus,
} from "../../types";
import {
  useBoard,
  addCard,
  deleteCard,
  moveCard,
  updateBoardTimer,
  updateCard,
  togglePrivateMode,
  toggleReaction,
  toggleVote,
  completeRetro,
  adjustTimer,
} from "../../hooks/useBoard";
import { useAuth } from "../../hooks/useAuth";
import { useSnackbar } from "../../context/SnackbarContext";
import { generateBoardSummary } from "../../services/ai";
import { analytics, logEvent } from "../../lib/firebase";

import {
  Settings,
  ArrowUpDown,
  Merge,
  LayoutGrid,
  Clock,
  Play,
  Pause,
  Square,
  Share2,
} from "lucide-react";
import { updateBoardSettings, mergeCards } from "../../hooks/useBoard";

import { exportToPDF, exportToExcel } from "../../utils/export";

// Components
import Card from "../Card";
import HeaderDropdown from "../HeaderDropdown";
import FocusMode from "../FocusMode";
import ConfirmDialog from "../ConfirmDialog";
import { Providers } from "../Providers";
import { Logo } from "../Logo";
import AISmartAdd from "../AISmartAdd";
import ActionItemSidebar from "../ActionItemSidebar";
import BoardNotFound from "./BoardNotFound";
import KeyboardShortcutsHelp from "../KeyboardShortcutsHelp";
import useKeyboardShortcuts from "../../hooks/useKeyboardShortcuts";

// --- Sub Components ---

interface SortableCardWrapperProps {
  card: RetroCard;
  boardId: string;
  isPrivate: boolean;

  isCompleted?: boolean;
  onDelete?: (cardId: string) => Promise<void>;
  onUpdate?: (cardId: string, newText: string) => Promise<void>;
  onReaction?: (cardId: string, emoji: string) => Promise<void>;
  onVote?: (cardId: string) => Promise<void>;
  onMerge?: (cardId: string) => void;
}

import { getColumnColor } from "../../data/columnConfig";


const SortableCardWrapper: React.FC<SortableCardWrapperProps> = ({
  card,
  boardId,
  isPrivate,
  isCompleted,
  onDelete,
  onUpdate,
  onReaction,
  onVote,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const { active } = useDndContext();
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `merge-${card.id}`,
    data: { type: "merge-target", cardId: card.id },
  });

  const isDraggingSomething = !!active;
  const isTargetForMerge = isDraggingSomething && active.id !== card.id && !isCompleted;

  return (
    <div className="relative group">
      {/* Merge Target Overlay - High Z-index to capture drop and prevent sort */}
      {isTargetForMerge && (
        <div
          ref={setDroppableRef}
          className={`absolute inset-0 z-20 rounded-xl transition-all duration-200 ${isOver ? "bg-brand-500/10 border-2 border-brand-500 backdrop-blur-[1px]" : ""}`}
        >
          {isOver && (
            <div className="absolute inset-0 flex items-center justify-center animate-in fade-in zoom-in duration-200">
              <div className="bg-brand-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                <Merge className="w-3.5 h-3.5" />
                <span>Drop to Merge</span>
              </div>
            </div>
          )}
        </div>
      )}

      <Card
        card={card}
        boardId={boardId}
        isPrivate={isPrivate}
        isCompleted={isCompleted}
        onDelete={onDelete}
        onUpdate={onUpdate}
        onReaction={onReaction}
        onVote={onVote}
        sortableProps={{
          attributes,
          listeners,
          setNodeRef,
          style,
          isDragging,
        }}
      />
    </div>
  );
};

interface DroppableColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  column: RetroColumn;
  children: React.ReactNode;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({
  column,
  children,
  ...props
}) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: { type: "column", columnId: column.id },
  });

  return (
    <div
      ref={setNodeRef}
      className="flex-shrink-0 w-[85vw] md:w-80 md:min-w-[20rem] md:flex-1 scroll-snap-item snap-center flex flex-col min-h-full bg-white/30 dark:bg-dark-900/40 backdrop-blur-md rounded-lg border border-gray-200/60 dark:border-gray-700/60 shadow-sm transition-all duration-300 group hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg tap-feedback"
      {...props}
    >
      {children}
    </div>
  );
};

// --- Main Board Component ---

interface BoardProps {
  id: string;
}

const BoardContent: React.FC<BoardProps> = ({ id: propId }) => {
  // Custom collision strategy to prioritize merge targets and empty columns
  const customCollisionStrategy = (args: any) => {
    // First, look for specific collisions under the pointer (Merge targets, Columns, Cards)
    const pointerCollisions = pointerWithin(args);

    // 1. Check for Merge Target (Priority)
    const mergeTarget = pointerCollisions.find((c: any) =>
      c.id.toString().startsWith("merge-"),
    );
    if (mergeTarget) {
      return [mergeTarget];
    }

    // 2. Return pointer collisions if found (Fixes empty column sorting)
    if (pointerCollisions.length > 0) {
      return pointerCollisions;
    }

    // 3. Fallback to closest corners for sorting if no direct pointer collision
    return closestCorners(args);
  };

  const [id, setId] = useState(propId);

  useEffect(() => {
    if (!propId) {
      // Extract ID from URL for SPA mode: /board/BOARD_ID
      const pathParts = window.location.pathname.split("/");
      const urlId =
        pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
      if (urlId && urlId !== "board") {
        setId(urlId);
      }
    }
  }, [propId]);

  const { board, cards, loading, error } = useBoard(id) as {
    board: RetroBoard | null;
    cards: RetroCard[];
    loading: boolean;
    error: any;
  };
  const { user, logout, loginAsGuest, loginWithGoogle } = useAuth();
  const isCompleted = board?.status === "completed";
  const { showSnackbar } = useSnackbar();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [newCardText, setNewCardText] = useState<{ [key: string]: string }>({});

  // UI States
  const [isPrivateMode, setIsPrivateMode] = useState(false);
  const [focusModeIndex, setFocusModeIndex] = useState<number | null>(null);
  const [showEndRetroDialog, setShowEndRetroDialog] = useState(false);

  // AI States
  const [summaryStatus, setSummaryStatus] = useState<AISummaryStatus>(
    AISummaryStatus.IDLE,
  );
  const [summaryResult, setSummaryResult] = useState<AISummaryResult | null>(
    null,
  );
  const [isAISmartAddOpen, setIsAISmartAddOpen] = useState(false);
  const [isAISmartAddActive, setIsAISmartAddActive] = useState(false);
  const [isTaskSidebarOpen, setIsTaskSidebarOpen] = useState(false);
  const [aiStatus, setAIStatus] = useState<string>("unknown");
  const [isChrome, setIsChrome] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);

  // New Features State
  const [sortBy, setSortBy] = useState<"date" | "votes">("date");
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [newVoteLimit, setNewVoteLimit] = useState<number>(0);
  const [newDefaultSort, setNewDefaultSort] = useState<"date" | "votes">(
    "date",
  );

  // Keyboard Shortcuts State
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  
  // Mobile Column Navigation State
  const [activeColumnIndex, setActiveColumnIndex] = useState(0);

  // Keyboard Shortcuts Integration
  useKeyboardShortcuts({
    onShowHelp: () => setShowKeyboardHelp(true),
    onCloseModals: () => {
      setShowKeyboardHelp(false);
      setShowSettingsDialog(false);
      setShowEndRetroDialog(false);
      setFocusModeIndex(null);
      closeAISmartAdd();
    },
    onNewCard: () => {
      if (board?.status !== "completed") {
        openAISmartAdd();
      }
    },
    onTogglePrivateMode: () => {
      if (board && user?.uid === board.createdBy && board.status !== "completed") {
        const newMode = !isPrivateMode;
        setIsPrivateMode(newMode);
        togglePrivateMode(id, newMode);
        showSnackbar(newMode ? "Private Mode enabled" : "Cards revealed", "info");
      }
    },
    onFocusMode: () => {
      if (items.length > 0 && board?.status !== "completed") {
        setFocusModeIndex(0);
      }
    },
    onToggleTaskSidebar: () => {
      setIsTaskSidebarOpen((prev) => !prev);
    },
    onToggleSort: () => {
      setSortBy((prev) => (prev === "date" ? "votes" : "date"));
      showSnackbar(`Sorted by ${sortBy === "date" ? "votes" : "date"}`, "info");
    },
    disabled: focusModeIndex !== null || isAISmartAddOpen,
  });


  const openAISmartAdd = () => {
    setIsAISmartAddOpen(true);
    // Log event when AI Smart Add is opened
    logEvent(analytics, "ai_smart_add_open", { board_id: id });
    // Tiny delay to ensure the component is in DOM before starting transition
    setTimeout(() => setIsAISmartAddActive(true), 10);
  };

  const closeAISmartAdd = () => {
    setIsAISmartAddActive(false);
    // Wait for transition duration before unmounting
    setTimeout(() => {
      setIsAISmartAddOpen(false);
    }, 700);
  };

  useEffect(() => {
    // Basic Chrome/Chromium detection
    const isChromium =
      !!(window as any).chrome || navigator.userAgent.indexOf("Chrome") !== -1;
    setIsChrome(isChromium);
  }, []);

  // Rollover States

  // Slack Integration State
  const [slackConnection, setSlackConnection] = useState<{
    teamId: string;
    teamName: string;
    channel?: string;
  } | null>(null);
  const [sharingToSlack, setSharingToSlack] = useState(false);

  // Fetch Slack Connection
  // useEffect(() => {
  //   if (user?.uid) {
  //     console.log("Checking Slack connection for user:", user.uid);
  //     import("../../lib/firebase").then(({ db }) => {
  //       import("firebase/firestore").then(
  //         ({ collection, query, where, getDocs, limit }) => {
  //           const q = query(
  //             collection(db, "slack_installations"),
  //             where("installedBy", "==", user.uid),
  //             limit(1)
  //           );
  //           getDocs(q)
  //             .then((snapshot) => {
  //               console.log("Slack Query Result:", snapshot.size, "docs");
  //               if (!snapshot.empty) {
  //                 const data = snapshot.docs[0].data();
  //                 console.log("Slack Connection Found:", data);
  //                 setSlackConnection({
  //                   teamId: snapshot.docs[0].id,
  //                   teamName: data.teamName,
  //                   channel: data.incomingWebhook?.channel,
  //                 });
  //               } else {
  //                 console.log("No Slack connection found for this user.");
  //               }
  //             })
  //             .catch((err) => console.error("Slack Query Error:", err));
  //         }
  //       );
  //     });
  //   }
  // }, [user?.uid]);

  const handleShareToSlack = async () => {
    if (!summaryResult || !slackConnection) return;
    setSharingToSlack(true);

    if (analytics) {
      logEvent(analytics, "share_to_slack", {
        board_id: board?.id,
        board_name: board?.name,
        team_id: slackConnection.teamId,
      });
    }

    // Construct message
    const lines = [
      `*Retro Summary: ${board?.name}*`,
      `Score: ${summaryResult.sentimentScore}/10`,
      `> ${(summaryResult.summary || summaryResult.executiveSummary || "").replace(/\n/g, "\n> ")}`,
      ``,
      `*Action Items:*`,
      ...summaryResult.actionItems.map((item) => `• ${item}`),
      ``,
      `<${window.location.href}|View Board>`,
    ];

    try {
      const res = await fetch(
        "https://us-central1-clear-retro-app.cloudfunctions.net/postSummaryToSlack",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            teamId: slackConnection.teamId,
            message: lines.join("\n"),
          }),
        },
      );

      const data = await res.json();
      if (data.success) {
        showSnackbar(
          `Posted to Slack (${slackConnection.teamName})`,
          "success",
        );
      } else {
        throw new Error(data.error);
      }
    } catch (e: any) {
      console.error(e);
      showSnackbar(`Slack Share Failed: ${e.message}`, "error");
    } finally {
      setSharingToSlack(false);
    }
  };

  // Timer
  const [timerInterval, setTimerInterval] = useState<ReturnType<
    typeof setInterval
  > | null>(null);
  const [tick, setTick] = useState(0);

  // Mobile Column Scroll Detection
  useEffect(() => {
    // Only run on mobile (screen width < 768px) and when board exists
    if (typeof window === 'undefined' || window.innerWidth >= 768 || !board) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const columnId = entry.target.getAttribute('data-testid')?.replace('column-', '');
            const index = board.columns.findIndex(c => c.id === columnId);
            if (index !== -1) {
              setActiveColumnIndex(index);
            }
          }
        });
      },
      { threshold: 0.5, root: null }
    );

    // Observe all column elements
    board.columns.forEach((column) => {
      const el = document.querySelector(`[data-testid="column-${column.id}"]`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [board?.columns?.length]);

  const sensors = useSensors(
    useSensor(PointerSensor, { 
      activationConstraint: { distance: 5 },
      disabled: isCompleted 
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
      disabled: isCompleted
    }),
  );

  useEffect(() => {
    if (board) {
      setIsPrivateMode(board.isPrivate || false);
    }
  }, [board?.isPrivate]);

  useEffect(() => {
    if (board?.defaultSort) {
      setSortBy(board.defaultSort);
    }
  }, [board?.defaultSort]);

  useEffect(() => {
    // If timer is active, update the local display based on endTime every second
    if (board?.timer?.status === "running" && board.timer.endTime) {
      const int = setInterval(() => {
        // Force re-render to update timer display
        setTick((t) => t + 1);
      }, 1000);
      setTimerInterval(int);
    } else if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [board?.timer?.status, board?.timer?.endTime]);

  // Track the last notified end time to prevent duplicate alerts
  const lastNotifiedTimeRef = useRef<string | null>(null);

  useEffect(() => {
    if (board?.timer?.status === "running" && board.timer.endTime) {
      const timeLeft = getTimeLeft();
      // Use a unique identifier for the current timer session (e.g. end time)
      // Firestore Timestamp to string or Date string
      const endTimeStr =
        typeof board.timer.endTime.toString === "function"
          ? board.timer.endTime.toString()
          : String(board.timer.endTime);

      if (timeLeft === 0 && lastNotifiedTimeRef.current !== endTimeStr) {
        showSnackbar("Time's up!", "info");
        lastNotifiedTimeRef.current = endTimeStr;

        // Owner automatically stops the timer to sync state
        if (user?.uid === board.createdBy) {
          updateBoardTimer(id, "stopped");
        }
      }
    }
  }, [tick, board?.timer, user?.uid, board?.createdBy, id, showSnackbar]);

  const toggleTimer = async () => {
    if (!board || board.status === "completed") return;

    const newStatus = board.timer?.status === "running" ? "stopped" : "running";
    if (analytics) {
      logEvent(analytics, "toggle_timer", {
        board_id: board.id,
        board_name: board.name,
        status: newStatus,
      });
    }

    if (board.timer?.status === "running") {
      // Pause: Save remaining time
      const remaining = getTimeLeft();
      await updateBoardTimer(id, "stopped", remaining);
    } else {
      // Start/Resume: Use existing duration if adjusted or paused, else default 5 mins
      const currentDuration = board.timer?.duration || 0;
      const durationToStart = currentDuration > 0 ? currentDuration : 300;
      await updateBoardTimer(id, "running", durationToStart);
    }
  };

  // Helper to get remaining time
  const getTimeLeft = () => {
    if (!board?.timer) return 300; // Default to 5 minutes if no timer state
    if (board.timer.status === "stopped") {
      return board.timer.duration || 0;
    }
    if (board.timer.endTime) {
      const end = board.timer.endTime.toDate
        ? board.timer.endTime.toDate()
        : new Date(board.timer.endTime);
      const now = new Date();
      return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / 1000));
    }
    return 300;
  };

  const timeLeft = getTimeLeft();

  const handleStartTimer = async (minutes: number) => {
    if (!user || user.uid !== board?.createdBy) return;
    try {
      const cappedMinutes = Math.min(minutes, 30);
      await updateBoardTimer(id, "running", cappedMinutes * 60);
    } catch (e) {
      console.error("Failed to start timer", e);
      showSnackbar("Failed to start timer", "error");
    }
  };

  const handlePauseTimer = async () => {
    if (!user || user.uid !== board?.createdBy) return;
    try {
      const remaining = getTimeLeft();
      await updateBoardTimer(id, "stopped", remaining);
      setTimerInterval(null); // Clear local interval
    } catch (e) {
      console.error("Failed to pause timer", e);
    }
  };

  const handleResumeTimer = async () => {
    if (!user || user.uid !== board?.createdBy) return;
    try {
      const currentDuration = board?.timer?.duration || 300;
      await updateBoardTimer(id, "running", currentDuration);
    } catch (e) {
      console.error("Failed to resume timer", e);
    }
  };

  const handleStopTimer = async () => {
    if (!user || user.uid !== board?.createdBy) return;
    try {
      await updateBoardTimer(id, "stopped", 0);
    } catch (e) {
      console.error("Failed to stop timer", e);
    }
  };

  const [showTimerDialog, setShowTimerDialog] = useState(false);

  // --- Actions ---

  // Local state for optimistic updates
  const [items, setItems] = useState<RetroCard[]>([]);

  // Track pending merge operations to prevent Firestore sync from overwriting optimistic updates
  const [pendingMerge, setPendingMerge] = useState(false);

  useEffect(() => {
    // Skip sync if there's a pending merge operation to prevent flicker
    if (pendingMerge) {
      return;
    }
    // Sort items based on configuration
    const sorted = [...cards].sort((a, b) => {
      if (sortBy === "votes") {
        const diff = (b.votes || 0) - (a.votes || 0);
        if (diff !== 0) return diff;
      }
      // Default to date/order (using order if valid, else createdAt)
      // Note: order is float, so simpler comparison
      return (a.order || 0) - (b.order || 0);
    });
    setItems(sorted);
  }, [cards, sortBy, pendingMerge]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the containers
    const activeCard = items.find((c) => c.id === activeId);
    const overCard = items.find((c) => c.id === overId);
    const overColumn = board?.columns.find((c) => c.id === overId);

    if (!activeCard) return;

    const activeColumnId = activeCard.columnId;
    const overColumnId = overColumn ? overColumn.id : overCard?.columnId;

    if (!activeColumnId || !overColumnId || activeColumnId === overColumnId)
      return;

    // Optimistic update for moving between columns
    setItems((prev) => {
      const activeUsers: any[] = []; // Empty fallback or just show self
      const activeItems = prev.filter((c) => c.columnId === activeColumnId);
      const overItems = prev.filter((c) => c.columnId === overColumnId);
      const activeIndex = activeItems.findIndex((c) => c.id === activeId);
      const overIndex = overCard
        ? overItems.findIndex((c) => c.id === overId)
        : overItems.length + 1;

      let newIndex;
      if (overCard) {
        // If over a card, place relative to it
        // We can't easily calculate exact index in the flat array without more logic,
        // but for visual feedback, just changing the columnId is often enough for SortableContext
        // to re-sort it if we use the right strategy.
        // However, dnd-kit examples usually mutate the array order here.
        // For simplicity in this flat structure, we just update the columnId.
        // The SortableContext in the new column will pick it up.
        // To make it appear in the right spot, we might need to adjust 'order' too, but
        // 'order' is a float.
        // Let's just update columnId for now.
        return prev.map((c) =>
          c.id === activeId ? { ...c, columnId: overColumnId } : c,
        );
      } else {
        // Dropped on column
        return prev.map((c) =>
          c.id === activeId ? { ...c, columnId: overColumnId } : c,
        );
      }
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || !board || board.status === "completed") return;

    // Check for Merge Drop
    if (over.id.toString().startsWith("merge-")) {
      const targetCardId = over.id.toString().replace("merge-", "");
      const sourceCardId = active.id.toString();

      if (targetCardId === sourceCardId) return;

      // Perform Merge
      const sourceCard = items.find((c) => c.id === sourceCardId);
      const targetCard = items.find((c) => c.id === targetCardId);

      if (!sourceCard || !targetCard) return;

      // Set pending merge flag to prevent Firestore sync from overwriting optimistic updates
      setPendingMerge(true);

      // Optimistic UI Update
      const mergedText = `${targetCard.text}\n\n---\n\n${sourceCard.text}`;
      const mergedVotes = (targetCard.votes || 0) + (sourceCard.votes || 0);

      // Log analytics
      if (analytics) {
        logEvent(analytics, "merge_cards_drag_drop", {
          board_id: id,
          source_id: sourceCardId,
          target_id: targetCardId,
        });
      }

      // Remove source, update target
      setItems((prev) =>
        prev
          .filter((c) => c.id !== sourceCardId)
          .map((c) => {
            if (c.id === targetCardId) {
              return {
                ...c,
                text: mergedText,
                votes: mergedVotes,
                mergedCards: [
                  ...(c.mergedCards || []),
                  { id: sourceCard.id, text: sourceCard.text },
                  ...(sourceCard.mergedCards || []),
                ],
              };
            }
            return c;
          }),
      );

      try {
        await mergeCards(id, sourceCardId, targetCardId);
        showSnackbar("Cards merged successfully", "success");
      } catch (e) {
        console.error("Merge failed", e);
        showSnackbar("Failed to merge cards", "error");
        // Revert would be complex here, assuming success for now or need reload
      } finally {
        // Wait a short time for Firestore to propagate the merge,
        // then clear the flag so useEffect can sync with fresh data
        setTimeout(() => {
          setPendingMerge(false);
        }, 500);
      }
      return;
    }

    const activeCard = items.find((c) => c.id === active.id);
    if (!activeCard) return;

    const overColumn = board.columns.find((c) => c.id === over.id);
    const overCard = items.find((c) => c.id === over.id);

    let overColumnId: string | null = null;
    let newOrder: number | undefined = undefined;

    if (overColumn) {
      overColumnId = overColumn.id;
      const columnCards = items
        .filter((c) => c.columnId === overColumnId)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      const maxOrder =
        columnCards.length > 0
          ? columnCards[columnCards.length - 1].order || 0
          : 0;
      newOrder = maxOrder + 10000;
    } else if (overCard) {
      overColumnId = overCard.columnId;
      const columnCards = items
        .filter((c) => c.columnId === overColumnId)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      const overCardIndex = columnCards.findIndex((c) => c.id === overCard.id);
      const activeCardIndex = columnCards.findIndex(
        (c) => c.id === activeCard.id,
      );

      const isSameColumn = activeCard.columnId === overColumnId;

      let prevOrder = 0;
      let nextOrder = 0;

      if (isSameColumn) {
        if (activeCardIndex < overCardIndex) {
          prevOrder = overCard.order || 0;
          const nextCard = columnCards[overCardIndex + 1];
          nextOrder = nextCard
            ? nextCard.order || prevOrder + 20000
            : prevOrder + 10000;
        } else {
          nextOrder = overCard.order || 0;
          const prevCard = columnCards[overCardIndex - 1];
          prevOrder = prevCard ? prevCard.order || 0 : nextOrder - 10000;
        }
      } else {
        // When moving to a different column and dropping on a card
        // We need to be careful because 'activeCard' might already have the new columnId from onDragOver
        // So 'isSameColumn' might be true even if it wasn't originally.
        // But for calculating order, we just need the surrounding cards in the target column.

        // If we treat it as "insert before overCard"
        nextOrder = overCard.order || 0;
        const prevCard = columnCards[overCardIndex - 1];
        // If prevCard is the active card itself (because of optimistic update), skip it
        const realPrevCard =
          prevCard?.id === activeCard.id
            ? columnCards[overCardIndex - 2]
            : prevCard;

        prevOrder = realPrevCard ? realPrevCard.order || 0 : nextOrder - 10000;
      }

      newOrder = (prevOrder + nextOrder) / 2;
    }

    if (overColumnId) {
      // Optimistic update final commit
      setItems((prev) =>
        prev.map((c) =>
          c.id === activeCard.id
            ? { ...c, columnId: overColumnId!, order: newOrder }
            : c,
        ),
      );

      await moveCard(id, activeCard.id, overColumnId, newOrder);
    } else {
      // Revert if invalid drop
      setItems(cards);
    }
  };

  const handleAddCard = async (columnId: string) => {
    const text = newCardText[columnId]?.trim();
    if (!board || !text || !user || board.status === "completed") return;

    if (analytics) {
      logEvent(analytics, "add_card", {
        board_id: board.id,
        board_name: board.name,
        column_id: columnId,
      });
    }

    // Optimistic Update: Clear input immediately
    setNewCardText((prev) => ({ ...prev, [columnId]: "" }));

    // Optimistic Update: Add card to UI immediately
    const tempId = `temp-${Date.now()}`;
    const newCard: RetroCard = {
      id: tempId,
      text: text,
      columnId: columnId,
      votes: 0,
      createdBy: user.uid,
      creatorName: user.displayName || "Anonymous",
      createdAt: { toDate: () => new Date() } as any, // Mock Timestamp
      votedBy: [],
      // Default other fields
    };

    setItems((prev) => [...prev, newCard]);

    try {
      await addCard(id, columnId, text, user);
    } catch (e) {
      console.error("Failed to add card", e);
      // Restore text on failure
      setNewCardText((prev) => ({ ...prev, [columnId]: text }));
      // Remove optimistic card
      setItems((prev) => prev.filter((c) => c.id !== tempId));
      showSnackbar("Failed to add card", "error");
    }
  };

  const handleUpdateCardOptimistic = async (
    cardId: string,
    newText: string,
  ) => {
    // Optimistic update
    setItems((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, text: newText } : c)),
    );

    try {
      await updateCard(id, cardId, { text: newText });
    } catch (e) {
      console.error("Failed to update card", e);
      showSnackbar("Failed to update card", "error");
    }
  };

  const handleReactionOptimistic = async (cardId: string, emoji: string) => {
    if (!user) return;

    // Optimistic update
    setItems((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          const reactions = { ...(c.reactions || {}) };
          const userIds = reactions[emoji] || [];
          if (userIds.includes(user.uid)) {
            reactions[emoji] = userIds.filter((uid) => uid !== user.uid);
          } else {
            reactions[emoji] = [...userIds, user.uid];
          }
          return { ...c, reactions };
        }
        return c;
      }),
    );

    try {
      await toggleReaction(id, cardId, emoji, user.uid);
    } catch (e) {
      console.error("Failed to toggle reaction", e);
      showSnackbar("Failed to toggle reaction", "error");
    }
  };
  const handleVoteOptimistic = async (cardId: string) => {
    if (!user) return;

    // Vote Limit Check
    if (board?.voteLimit && board.voteLimit > 0) {
      const userVotes = cards.reduce(
        (acc, c) => acc + (c.votedBy?.includes(user.uid) ? 1 : 0),
        0,
      );
      const isAddingVote = !cards
        .find((c) => c.id === cardId)
        ?.votedBy?.includes(user.uid);

      if (isAddingVote && userVotes >= board.voteLimit) {
        showSnackbar(
          `Vote limit reached (${board.voteLimit} votes max)`,
          "error",
        );
        return;
      }
    }

    try {
      // Optimistic update
      setItems((prev) =>
        prev.map((c) => {
          if (c.id === cardId) {
            const votedBy = [...(c.votedBy || [])];
            const hasVoted = votedBy.includes(user.uid);
            return {
              ...c,
              votes: Math.max(0, (c.votes || 0) + (hasVoted ? -1 : 1)),
              votedBy: hasVoted
                ? votedBy.filter((uid) => uid !== user.uid)
                : [...votedBy, user.uid],
            };
          }
          return c;
        }),
      );

      await toggleVote(id, cardId, user.uid);
    } catch (e) {
      console.error("Failed to toggle vote", e);
      showSnackbar("Failed to vote", "error");
    }
  };

  const handleDeleteCardOptimistic = async (cardId: string) => {
    // Optimistically remove from UI immediately
    if (analytics) {
      logEvent(analytics, "delete_card", {
        board_id: id,
        card_id: cardId,
      });
    }
    setItems((prev) => prev.filter((c) => c.id !== cardId));
    try {
      await deleteCard(id, cardId);
    } catch (e) {
      console.error("Failed to delete card", e);
      showSnackbar("Failed to delete card", "error");
    }
  };

  // --- AI Features ---

  const handleGenerateSummary = async () => {
    if (!board || cards.length === 0) return;
    setSummaryStatus(AISummaryStatus.LOADING);

    if (analytics) {
      logEvent(analytics, "generate_ai_summary", {
        board_id: board.id,
        board_name: board.name,
      });
    }

    try {
      const result = await generateBoardSummary(cards, board.columns);
      if (result) {
        setSummaryResult(result);
        setSummaryStatus(AISummaryStatus.SUCCESS);
      } else {
        setSummaryStatus(AISummaryStatus.ERROR);
      }
    } catch (e: any) {
      console.error(e);
      showSnackbar("AI Analysis Failed", "error");
      setSummaryStatus(AISummaryStatus.ERROR);
    }
  };

  const handleAISmartAdd = async (
    columnId: string,
    text: string,
    isActionItem?: boolean,
  ) => {
    if (!board) return;
    if (analytics) {
      logEvent(analytics, "add_card_ai", {
        board_id: board.id,
        column_id: columnId,
      });
    }

    // Optimistic Update: Add card to UI immediately
    const tempId = `temp-ai-${Date.now()}`;
    const newCard: RetroCard = {
      id: tempId,
      text: text,
      columnId: columnId,
      votes: 0,
      createdBy: user?.uid || "anonymous",
      creatorName: user?.displayName || "Anonymous",
      createdAt: { toDate: () => new Date() } as any, // Mock Timestamp
      votedBy: [],
      isActionItem: !!isActionItem,
    };
    setItems((prev) => [...prev, newCard]);

    try {
      await addCard(id, columnId, text, user, isActionItem);
    } catch (e) {
      console.error("Failed to add AI card", e);
      setItems((prev) => prev.filter((c) => c.id !== tempId));
      showSnackbar("Failed to add card via AI", "error");
    }
  };

  // --- Exports ---

  const handleSaveSettings = async () => {
    if (newVoteLimit < 0) return;
    try {
      await updateBoardSettings(id, {
        voteLimit: newVoteLimit,
        defaultSort: newDefaultSort,
      });
      setShowSettingsDialog(false);
      showSnackbar("Board settings updated", "success");
    } catch (e) {
      showSnackbar("Failed to update settings", "error");
    }
  };

  // --- New Features ---

  const handleShare = (source: string) => {
    navigator.clipboard.writeText(window.location.href);
    showSnackbar("Board link copied to clipboard!", "success");
    if (analytics) {
      logEvent(analytics, "share_board", {
        board_id: id,
        board_name: board?.name,
        source: source,
      });
    }
  };

  const handleEndRetro = async () => {
    if (!board) return;

    if (analytics) {
      logEvent(analytics, "end_retro", {
        board_id: board.id,
        board_name: board.name,
      });
    }

    await completeRetro(id);
    await updateBoardTimer(id, "stopped");
    setShowEndRetroDialog(false);
    showSnackbar("Retrospective ended. Board is now read-only.", "success");
  };

  const handleLogout = async () => {
    if (analytics) {
      logEvent(analytics, "logout", {
        user_id: user?.uid,
      });
    }
    await logout();
    window.location.href = "/signin";
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-[#050505] dark:text-brand-400 font-mono text-xl animate-pulse">
        System Initializing...
      </div>
    );

  if (!board) return <BoardNotFound />;

  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
        <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-gray-100 dark:border-gray-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 to-purple-500"></div>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand-50 dark:bg-brand-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">
              🚀
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-mono">
              Join Retrospective
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              You've been invited to join <strong>{board.name}</strong>. Please
              sign in or continue as a guest to participate.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                if (analytics) logEvent(analytics, "click_login_google");
                loginWithGoogle();
              }}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-dark-800 text-gray-700 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-all font-medium shadow-sm hover:shadow-md group"
            >
              <svg
                className="w-5 h-5 transition-transform group-hover:scale-110"
                viewBox="0 0 24 24"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-100 dark:border-gray-800"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase tracking-widest font-mono">
                Or
              </span>
              <div className="flex-grow border-t border-gray-100 dark:border-gray-800"></div>
            </div>

            <button
              onClick={async () => {
                if (isGuestLoading) return;
                setIsGuestLoading(true);
                if (analytics) logEvent(analytics, "click_login_guest");
                try {
                  await loginAsGuest();
                } catch (e: any) {
                  console.error(e);
                  if (e.message.includes("ADMIN_ONLY_OPERATION")) {
                    showSnackbar(
                      "Guest login disabled in Firebase Console",
                      "error",
                    );
                  } else {
                    showSnackbar("Failed to sign in as guest", "error");
                  }
                  setIsGuestLoading(false);
                }
              }}
              disabled={isGuestLoading}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:opacity-90 transition-all font-bold shadow-lg shadow-gray-500/20 tap-feedback btn-animated ${isGuestLoading ? 'opacity-70 cursor-wait' : ''}`}
            >
              {isGuestLoading ? (
                <svg className="animate-spin h-5 w-5 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              )}
              {isGuestLoading ? 'Signing in...' : 'Continue as Guest'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Gamification Stats
  const cardsCount = cards.length;
  const votesCount = cards.reduce((acc, card) => acc + (card.votes || 0), 0);
  const actionItemsCount = cards.filter((c) => c.isActionItem).length;

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-[#f8fafc] dark:bg-[#050505] overflow-hidden bg-grid-pattern transition-colors duration-500 relative">
      {/* Board Header */}
      <div className="px-4 md:px-6 py-3 border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-dark-950/70 backdrop-blur-xl flex flex-wrap md:flex-nowrap justify-between items-center shrink-0 z-50 sticky top-0 gap-y-3">
        {/* --- ROW 1 (MOBILE/DESKTOP) --- */}
        <div className="flex items-center justify-between w-full md:w-auto order-1">
          <div className="flex items-center gap-2 md:gap-4 min-w-0 pr-2">
            <div className="flex items-center gap-3">
              <a href="/dashboard" className="flex items-center gap-3 group">
                <div className="p-1 md:p-1.5 bg-white dark:bg-dark-800 rounded-lg md:rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group-hover:border-brand-500/50 transition-colors">
                  <Logo className="w-7 h-7 md:w-10 md:h-10 text-brand-600 dark:text-brand-400" />
                </div>
              </a>
            </div>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-1"></div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm md:text-lg font-bold text-gray-700 dark:text-gray-200 font-mono truncate max-w-[120px] md:max-w-[300px]">
                  {board.name}
                </h2>
                {isCompleted && (
                  <span className="text-[8px] md:text-[10px] bg-red-100 text-red-600 px-1 py-0.5 rounded border border-red-200 uppercase font-bold tracking-wider">
                    Done
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* User Profile (Mobile Only - Row 1) */}
          <div className="md:hidden">
            <HeaderDropdown
              user={user}
              onLogout={handleLogout}
              onExportPDF={
                user?.uid === board.createdBy
                  ? () => exportToPDF(board.name, board.columns, cards)
                  : undefined
              }
              onExportExcel={
                user?.uid === board.createdBy
                  ? () => exportToExcel(board.name, board.columns, cards)
                  : undefined
              }
            />
          </div>
        </div>

        {/* --- ROW 2 (MOBILE) / EXTENSION (DESKTOP) --- */}
        <div className="flex items-center justify-between md:justify-end w-full md:w-auto order-2 gap-2">
          {/* Tasks Sidebar Toggle - Restored to Main Header */}

          {/* --- COMPACT HEADER CONTROLS --- */}
          <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-1 md:gap-2">
            {/* Left side: Timer (grouped with desktop icons on larger screens) */}
            <div className="flex items-center gap-1 md:gap-2">
              {board.timer?.status && (
                <div
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border ${
                    board.timer?.status === "running"
                      ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
                      : "bg-gray-50 dark:bg-dark-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {user?.uid === board.createdBy && !isCompleted ? (
                    <button
                      onClick={() => setShowTimerDialog(true)}
                      className="hover:text-brand-500 transition-colors"
                      title="Set Timer Presets"
                    >
                      <Clock className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                  <span
                    className={`font-mono font-bold text-sm ${board.timer?.status === "running" && timeLeft < 60 ? "animate-pulse" : ""}`}
                  >
                    {formatTime(timeLeft)}
                  </span>
                  {user?.uid === board.createdBy && !isCompleted && (
                    <div className="flex items-center gap-1 ml-1 border-l border-gray-300 dark:border-gray-600 pl-1">
                      <button
                        onClick={() => adjustTimer(id, -60)}
                        className="p-0.5 hover:text-gray-900 dark:hover:text-white text-[10px] font-bold w-4 text-center"
                      >
                        -
                      </button>
                      <button
                        onClick={() => adjustTimer(id, 60)}
                        className="p-0.5 hover:text-gray-900 dark:hover:text-white text-[10px] font-bold w-4 text-center"
                      >
                        +
                      </button>
                      {board.timer?.status === "running" ? (
                        <button
                          onClick={handlePauseTimer}
                          className="p-0.5 hover:text-gray-900 dark:hover:text-white"
                        >
                          <Pause className="w-3 h-3" />
                        </button>
                      ) : (
                        <button
                          onClick={handleResumeTimer}
                          className="p-0.5 hover:text-gray-900 dark:hover:text-white"
                        >
                          <Play className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        onClick={handleStopTimer}
                        className="p-0.5 hover:text-red-500"
                      >
                        <Square className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Desktop Toggles (Private/Focus) - Hidden on Mobile */}
              <div className="hidden md:flex items-center gap-1.5 ml-1">
                {user?.uid === board.createdBy && (
                  <button
                    onClick={() => {
                      const newMode = !isPrivateMode;
                      togglePrivateMode(id, newMode);
                    }}
                    className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-all ${isPrivateMode ? "bg-purple-100 dark:bg-purple-900/20 border-purple-500 text-purple-600 shadow-[0_0_15px_rgba(216,180,254,0.3)]" : "bg-white dark:bg-dark-900 border-gray-200 dark:border-gray-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-dark-800"}`}
                    title="Private Mode"
                  >
                    {isPrivateMode ? "🙈" : "👁️"}
                  </button>
                )}
                <button
                  onClick={() => setFocusModeIndex(0)}
                  className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-900 text-gray-500 hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
                  title="Focus Mode"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 3h6v6"></path>
                    <path d="M9 21H3v-6"></path>
                    <path d="M21 3l-7 7"></path>
                    <path d="M3 21l7-7"></path>
                  </svg>
                </button>
              </div>

              <div className="hidden md:block h-4 w-px bg-gray-200 dark:bg-gray-800 mx-1"></div>

              {/* Desktop Controls (Hidden on Mobile) */}
              <div className="hidden md:flex items-center gap-1 md:gap-2">
                <button
                  onClick={() =>
                    setSortBy((prev) => (prev === "date" ? "votes" : "date"))
                  }
                  className={`p-2 rounded-lg transition-all ${sortBy === "votes" ? "bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-800"}`}
                  title="Sort Cards"
                >
                  <ArrowUpDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsTaskSidebarOpen(true)}
                  className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg relative"
                  title="View Tasks"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                  </svg>
                  {items.filter((i) => i.isActionItem).length > 0 && (
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-500 border border-white dark:border-dark-900"></span>
                  )}
                </button>
                {user?.uid === board.createdBy && (
                  <>
                    <button
                      onClick={handleGenerateSummary}
                      disabled={summaryStatus === AISummaryStatus.LOADING}
                      className={`p-2 rounded-lg transition-all ${summaryStatus === AISummaryStatus.LOADING ? "opacity-50 cursor-not-allowed" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-800"}`}
                      title={summaryStatus === AISummaryStatus.LOADING ? "Generating..." : "AI Summary"}
                    >
                      {summaryStatus === AISummaryStatus.LOADING ? (
                        <svg
                          className="animate-spin w-4 h-4 text-brand-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                          <path d="M5 3v4" />
                          <path d="M19 17v4" />
                          <path d="M3 5h4" />
                          <path d="M17 19h4" />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setNewVoteLimit(board.voteLimit || 0);
                        setNewDefaultSort(board.defaultSort || "date");
                        setShowSettingsDialog(true);
                      }}
                      className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg"
                      title="Settings"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    {!isCompleted && (
                      <button
                        onClick={() => setShowEndRetroDialog(true)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        title="End Retro"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <rect width="6" height="6" x="9" y="9" />
                        </svg>
                      </button>
                    )}
                  </>
                )}
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(window.location.href);
                    showSnackbar("Copied!", "success");
                  }}
                  className="bg-brand-600 hover:bg-brand-700 text-white px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-2 shadow-sm"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
              </div>
            </div>

            {/* Right side: Mobile toolbox (far right) */}
            <div className="md:hidden relative">
              <button
                onClick={() =>
                  setActiveId(activeId === "header-more" ? null : "header-more")
                }
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              {activeId === "header-more" && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl z-50 py-2 animate-in fade-in zoom-in-95">
                  <button
                    onClick={() => {
                      setSortBy((prev) => (prev === "date" ? "votes" : "date"));
                      setActiveId(null);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-dark-800 text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    <ArrowUpDown className="w-4 h-4 text-gray-500" />
                    <span>Sort: {sortBy === "date" ? "Votes" : "Date"}</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsTaskSidebarOpen(true);
                      setActiveId(null);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-dark-800 text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    <div className="relative">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-500"
                      >
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                      </svg>
                      {items.filter((i) => i.isActionItem).length > 0 && (
                        <span className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                      )}
                    </div>
                    <span>View Tasks</span>
                  </button>

                  {user?.uid === board.createdBy && (
                    <button
                      onClick={() => {
                        if (summaryStatus !== AISummaryStatus.LOADING) {
                          handleGenerateSummary();
                          setActiveId(null);
                        }
                      }}
                      disabled={summaryStatus === AISummaryStatus.LOADING}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors ${summaryStatus === AISummaryStatus.LOADING ? "opacity-50 cursor-not-allowed bg-gray-50 dark:bg-dark-800" : "hover:bg-gray-50 dark:hover:bg-dark-800 text-gray-700 dark:text-gray-300"}`}
                    >
                      {summaryStatus === AISummaryStatus.LOADING ? (
                        <svg
                          className="animate-spin w-4 h-4 text-brand-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-gray-500"
                        >
                          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                          <path d="M5 3v4" />
                          <path d="M19 17v4" />
                          <path d="M3 5h4" />
                          <path d="M17 19h4" />
                        </svg>
                      )}
                      <span>{summaryStatus === AISummaryStatus.LOADING ? "Generating..." : "AI Summary"}</span>
                    </button>
                  )}

                  {user?.uid === board.createdBy && (
                    <button
                      onClick={() => {
                        setNewVoteLimit(board.voteLimit || 0);
                        setNewDefaultSort(board.defaultSort || "date");
                        setShowSettingsDialog(true);
                        setActiveId(null);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-dark-800 text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-gray-500" />
                      <span>Board Settings</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setFocusModeIndex(0);
                      setActiveId(null);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-dark-800 text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-500"
                    >
                      <path d="M15 3h6v6"></path>
                      <path d="M9 21H3v-6"></path>
                      <path d="M21 3l-7 7"></path>
                      <path d="M3 21l7-7"></path>
                    </svg>
                    <span>Focus Mode</span>
                  </button>

                  {user?.uid === board.createdBy && (
                    <button
                      onClick={() => {
                        togglePrivateMode(id, !isPrivateMode);
                        setActiveId(null);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-dark-800 text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      <span className="w-4 text-center text-base">
                        {isPrivateMode ? "🙈" : "👁️"}
                      </span>
                      <span>
                        {isPrivateMode
                          ? "Disable Private Mode"
                          : "Enable Private Mode"}
                      </span>
                    </button>
                  )}

                  <div className="border-t border-gray-100 dark:border-gray-800 my-1"></div>

                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(window.location.href);
                      showSnackbar("Copied!", "success");
                      setActiveId(null);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-dark-800 text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    <Share2 className="w-4 h-4 text-gray-500" />
                    <span>Share Board</span>
                  </button>

                  {!isCompleted && user?.uid === board.createdBy && (
                    <div className="border-t border-gray-100 dark:border-gray-800 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setShowEndRetroDialog(true);
                          setActiveId(null);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <rect width="6" height="6" x="9" y="9" />
                        </svg>
                        <span>End Retro</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Desktop User Dropdown */}
          <div className="hidden md:flex items-center gap-2 ml-2">
            {/* Keyboard Shortcuts Help Button */}
            <button
              onClick={() => setShowKeyboardHelp(true)}
              className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
              title="Keyboard shortcuts (?)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="M6 8h.001"/>
                <path d="M10 8h.001"/>
                <path d="M14 8h.001"/>
                <path d="M18 8h.001"/>
                <path d="M8 12h.001"/>
                <path d="M12 12h.001"/>
                <path d="M16 12h.001"/>
                <path d="M7 16h10"/>
              </svg>
            </button>
            <HeaderDropdown
              user={user}
              onLogout={handleLogout}
              onExportPDF={
                user?.uid === board.createdBy
                  ? () => exportToPDF(board.name, board.columns, cards)
                  : undefined
              }
              onExportExcel={
                user?.uid === board.createdBy
                  ? () => exportToExcel(board.name, board.columns, cards)
                  : undefined
              }
            />
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
                <h2 className="text-2xl font-bold dark:text-white mb-1 font-mono">
                  Retro Summary
                </h2>
                <p className="text-brand-600 dark:text-brand-400 text-xs font-mono uppercase tracking-widest">
                  Powered by Gemini 1.5
                </p>
              </div>
              <button
                onClick={() => setSummaryResult(null)}
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-5 rounded-lg bg-gray-50 dark:bg-dark-950 border border-gray-200 dark:border-gray-800 text-center">
                <p className="text-xs font-bold text-gray-500 uppercase font-mono">
                  Sentiment Score
                </p>
                <div
                  className={`text-6xl font-extrabold mt-3 ${summaryResult.sentimentScore > 7 ? "text-green-500" : summaryResult.sentimentScore < 5 ? "text-red-500" : "text-yellow-500"}`}
                >
                  {summaryResult.sentimentScore}
                </div>
              </div>
              <div className="col-span-2 p-5 rounded-lg bg-blue-50/50 dark:bg-dark-950 border border-blue-100 dark:border-blue-900/30">
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase mb-2 font-mono">
                  Executive Summary
                </p>
                <p className="text-gray-800 dark:text-gray-300 leading-relaxed text-sm md:text-base font-medium">
                  {summaryResult.summary || summaryResult.executiveSummary}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase mb-4 tracking-wider font-mono">
                Suggested Action Items
              </h3>
              <ul className="space-y-3">
                {summaryResult.actionItems.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start bg-white dark:bg-dark-950 p-4 rounded border border-gray-200 dark:border-gray-800 shadow-sm"
                  >
                    <span className="flex-shrink-0 w-6 h-6 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded flex items-center justify-center text-xs font-bold mr-4 font-mono">
                      {i + 1}
                    </span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              {slackConnection && (
                <button
                  onClick={handleShareToSlack}
                  disabled={sharingToSlack}
                  className="px-6 py-2 bg-[#4A154B] text-white font-bold rounded-lg hover:bg-[#611f69] transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {sharingToSlack
                    ? "Sending..."
                    : `Share to Slack #${slackConnection.channel || ""}`}
                </button>
              )}
              <button
                onClick={() => setSummaryResult(null)}
                className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-lg hover:opacity-90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timer Selection Dialog */}
      {showTimerDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-dark-900 rounded-xl shadow-2xl max-w-sm w-full p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-600" />
              Set Timer
            </h2>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {[5, 10, 15, 30].map((mins) => (
                <button
                  key={mins}
                  onClick={() => {
                    handleStartTimer(mins);
                    setShowTimerDialog(false);
                  }}
                  className="py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 text-gray-700 dark:text-gray-300 font-bold transition-all"
                >
                  {mins} Min
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 font-mono">
                  Custom (1-30 min)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black font-mono"
                    placeholder="Mins"
                    id="custom-timer-input"
                  />
                  <button
                    onClick={() => {
                      const input = document.getElementById(
                        "custom-timer-input",
                      ) as HTMLInputElement;
                      const val = parseInt(input.value);
                      if (val > 0) {
                        handleStartTimer(Math.min(val, 30));
                        setShowTimerDialog(false);
                      }
                    }}
                    className="px-6 py-2 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700 transition-colors"
                  >
                    Start
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowTimerDialog(false)}
              className="w-full mt-6 py-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Settings Dialog */}
      {showSettingsDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-dark-900 rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Board Settings
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 font-mono">
                  Max Votes Per User
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={newVoteLimit}
                    onChange={(e) =>
                      setNewVoteLimit(parseInt(e.target.value) || 0)
                    }
                    className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-black"
                  />
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    (0 = Unlimited)
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 font-mono">
                  Default Card Sorting
                </label>
                <select
                  value={newDefaultSort}
                  onChange={(e) =>
                    setNewDefaultSort(e.target.value as "date" | "votes")
                  }
                  className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black font-mono text-sm focus:ring-1 focus:ring-brand-500 outline-none appearance-none"
                >
                  <option value="date">Date Created</option>
                  <option value="votes">Most Votes</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowSettingsDialog(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 font-medium"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Merge Cards Dialog */}

      {focusModeIndex !== null && (
        <FocusMode
          cards={cards}
          initialIndex={focusModeIndex}
          onClose={() => setFocusModeIndex(null)}
          boardId={id}
        />
      )}

      {/* End Retro Confirmation */}
      <ConfirmDialog
        isOpen={showEndRetroDialog}
        onClose={() => setShowEndRetroDialog(false)}
        onConfirm={handleEndRetro}
        title="End Retrospective?"
        message="This will stop the timer and make the board read-only. You can still export results, but no new cards can be added."
        confirmText="End Retro"
        cancelText="Cancel"
      />

      {/* Keyboard Shortcuts Help Modal */}
      <KeyboardShortcutsHelp
        isOpen={showKeyboardHelp}
        onClose={() => setShowKeyboardHelp(false)}
      />


      {/* Private Mode Banner (Compact) */}
      {isPrivateMode && (
        <div className="bg-indigo-600 dark:bg-indigo-900/90 backdrop-blur-sm text-white px-4 py-1 text-center text-xs font-medium animate-in slide-in-from-top-0 flex items-center justify-center gap-2 shadow-md relative z-30 border-b border-white/10">
          <span className="text-base">🙈</span>
          <span>
            Private Mode is Active. You cannot see other users' cards until it
            is disabled.
          </span>
        </div>
      )}
      {/* AI Status Banner */}
      {!isCompleted && !isAISmartAddOpen && (
        <div
          onClick={openAISmartAdd}
          className="bg-gradient-to-r from-brand-600 to-purple-600 text-white px-4 py-2 text-center text-xs font-medium animate-slideDownIn flex items-center justify-center gap-3 cursor-pointer hover:brightness-110 transition-all shadow-md relative z-30 group mb-1 sm:mb-0"
        >
          <span className="flex items-center gap-2">
            <span className="text-sm animate-pulse">✨</span>
            {isChrome && aiStatus === "downloading" ? (
              <span>
                AI Model is downloading in the background (0-100%)... Please
                wait.
              </span>
            ) : (
              <>
                <span className="hidden sm:inline">
                  New: Use AI Smart Add to automatically sort your thoughts into
                  columns!
                </span>
                <span className="sm:hidden">Try AI Smart Add!</span>
              </>
            )}
          </span>
          <span className="bg-white/20 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider group-hover:bg-white/30 transition-colors">
            {isChrome && aiStatus === "downloading" ? "Status" : "Try Now"}
          </span>
        </div>
      )}

      {/* Columns Area */}
      <div className="flex-1 overflow-x-hidden md:overflow-x-auto overflow-y-auto scroll-momentum">
        <DndContext
          sensors={sensors}
          collisionDetection={customCollisionStrategy}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="min-h-full flex flex-row md:flex-row p-4 md:p-6 pt-2 sm:pt-6 gap-4 md:gap-6 min-w-full mx-auto scroll-snap-x scroll-hide-bar md:overflow-visible safe-bottom">
            <SortableContext
              items={board.columns.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              {board.columns.map((column) => (
                <DroppableColumn
                  key={column.id}
                  column={column}
                  data-testid={`column-${column.id}`}
                >
                  {/* Column Header */}
                  <div
                    className={`p-4 border-b border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-dark-900/95 rounded-t-lg backdrop-blur-sm sticky top-0 z-20 overflow-hidden shadow-sm`}
                  >
                    <div
                      className={`absolute top-0 left-0 w-full h-1 ${getColumnColor(column.color).bg}`}
                    ></div>
                    <h3 className="font-bold text-gray-900 dark:text-white flex justify-between items-center text-md font-mono relative z-10 mb-3">
                      <span className="flex items-center gap-2">
                        {column.icon && <span className="text-lg">{column.icon}</span>}
                        {column.title}
                      </span>
                      <span className="bg-white/50 dark:bg-white/10 px-2 py-0.5 rounded text-xs text-gray-600 dark:text-gray-300 font-mono">
                        {items.filter((c) => c.columnId === column.id).length}
                      </span>
                    </h3>

                    {/* Add Card Input (Sticky) */}
                    {!isCompleted && (
                      <div className="relative group/input mb-1 z-20">
                        <textarea
                          placeholder="> Add card..."
                          className="w-full text-sm p-3 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#18181b] dark:text-white focus:ring-1 focus:ring-brand-500 focus:border-brand-500 focus:shadow-[0_0_10px_rgba(45,212,191,0.2)] outline-none resize-none shadow-sm transition-all font-mono"
                          rows={2}
                          value={newCardText[column.id] || ""}
                          onChange={(e) =>
                            setNewCardText({
                              ...newCardText,
                              [column.id]: e.target.value,
                            })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleAddCard(column.id);
                            }
                          }}
                        />
                        <button
                          onClick={() => handleAddCard(column.id)}
                          className="absolute bottom-2 right-2 p-2 text-gray-400 hover:text-brand-500 transition-colors opacity-50 group-hover/input:opacity-100"
                          title="Add Card"
                        >
                          ↵
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Cards Container */}
                  <div className="flex-grow p-3 space-y-3">
                    <SortableContext
                      items={items
                        .filter((c) => c.columnId === column.id)
                        .map((c) => c.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {items
                        .filter((c) => c.columnId === column.id)
                        .map((card) => (
                          <SortableCardWrapper
                            key={card.id}
                            card={card}
                            boardId={id}
                            isPrivate={
                              isPrivateMode && user?.uid !== card.createdBy
                            }
                            isCompleted={isCompleted}
                            onDelete={handleDeleteCardOptimistic}
                            onUpdate={handleUpdateCardOptimistic}
                            onReaction={handleReactionOptimistic}
                            onVote={handleVoteOptimistic}
                          />
                        ))}
                    </SortableContext>
                  </div>
                </DroppableColumn>
              ))}
            </SortableContext>

            <DragOverlay>
              {activeId ? (
                <div className="bg-white dark:bg-dark-800 p-4 rounded-lg shadow-2xl border border-brand-500 w-80 rotate-2 cursor-grabbing opacity-90 backdrop-blur-sm">
                  <p className="text-sm text-gray-800 dark:text-gray-200 font-medium font-mono">
                    {cards.find((c) => c.id === activeId)?.text}
                  </p>
                </div>
              ) : null}
            </DragOverlay>
          </div>
        </DndContext>
        
        {/* Mobile Column Indicator */}
        <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 safe-bottom">
          <div className="flex items-center gap-2 px-3 py-2 bg-white/90 dark:bg-dark-900/90 backdrop-blur-md rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
            {board.columns.map((column, index) => (
              <button
                key={column.id}
                onClick={() => {
                  setActiveColumnIndex(index);
                  // Scroll to column
                  const columnEl = document.querySelector(`[data-testid="column-${column.id}"]`)?.parentElement;
                  columnEl?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
                }}
                className={`transition-all duration-300 tap-feedback ${
                  activeColumnIndex === index 
                    ? 'w-6 h-2 bg-brand-500 rounded-full' 
                    : 'w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full hover:bg-gray-400'
                }`}
                title={column.title}
              />
            ))}
          </div>
        </div>
      </div>

      {/* AI Smart Add Bottom Sheet Overlay */}
      {isAISmartAddOpen && !isCompleted && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end pointer-events-none sticky-ai-sheet">
          {/* Backdrop with stronger blur */}
          <div
            className={`absolute inset-0 bg-black/60 backdrop-blur-[2px] pointer-events-auto transition-opacity duration-500 ease-in-out ${isAISmartAddActive ? "opacity-100" : "opacity-0"}`}
            onClick={closeAISmartAdd}
          ></div>

          {/* Sheet with clearer separation */}
          <div
            className={`relative w-full max-w-2xl mx-auto bg-white dark:bg-dark-900 rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.3)] pointer-events-auto transform transition-all duration-700 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] p-6 pt-10 pb-12 border-t border-brand-500/30 ring-1 ring-white/10 ${isAISmartAddActive ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
          >
            {/* Handle */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full"></div>

            <button
              onClick={closeAISmartAdd}
              className="absolute top-6 right-8 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors text-xl"
            >
              ✕
            </button>

            <div className="mb-8 text-center text-ai-header">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-brand-500 to-purple-600 bg-clip-text text-transparent flex justify-center items-center gap-2 mb-2">
                <span>✨</span>
                AI Smart Add
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Type your thoughts and let Gemini AI sort them for you.
                If it's not quite right, you can always drag and drop cards to
                adjust them!
              </p>
            </div>

            <AISmartAdd
              boardId={id}
              columns={board.columns}
              onAddCard={handleAISmartAdd}
              disabled={loading}
              autoFocus={isAISmartAddOpen}
            />

            <div className="mt-4 text-center">
              <button
                onClick={closeAISmartAdd}
                className="text-gray-400 hover:text-brand-500 text-xs font-medium transition-colors"
              >
                Close and go back to board
              </button>
            </div>
          </div>
        </div>
      )}
      {/* AI Smart Add Floating Toggle (Compact & High Visibility) */}
      {!isCompleted && !isAISmartAddOpen && (
        <div className="fixed bottom-6 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 mb-2 sm:mb-0">
          <div className="animate-slideUp">
            <button
              onClick={openAISmartAdd}
              className="flex items-center gap-2 bg-brand-500 dark:bg-brand-600 text-white px-4 py-2 rounded-full shadow-[0_4px_20px_rgb(20,184,166,0.4)] hover:shadow-[0_4px_25px_rgb(20,184,166,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 font-bold group border border-white/20 relative"
            >
              <span className="text-sm group-hover:animate-bounce">✨</span>
              <span className="text-xs uppercase tracking-tighter">
                AI Smart Add
              </span>
              <div className="absolute -inset-0.5 rounded-full bg-brand-400 opacity-20 animate-ping pointer-events-none"></div>
            </button>
          </div>
        </div>
      )}

      <ActionItemSidebar
        isOpen={isTaskSidebarOpen}
        onClose={() => setIsTaskSidebarOpen(false)}
        items={items}
      />
    </div>
  );
};

const Board: React.FC<BoardProps> = (props) => {
  return (
    <Providers>
      <BoardContent {...props} />
    </Providers>
  );
};

export default Board;
