import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { QuestionBankItem } from '../data/questionBankData.ts';
import {
  RotateCw,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Star,
  Sparkles,
  HelpCircle,
  Lightbulb,
  Languages,
  LayoutGrid,
  Maximize2,
  RotateCcw,
  BookOpen,
  Keyboard,
  ArrowRight,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FlashcardDeckProps {
  questions: QuestionBankItem[];
  bookmarkedIds: Set<number>;
  onToggleBookmark: (id: number) => void;
  explanationLang: 'both' | 'ar' | 'en';
  onExplanationLangChange: (lang: 'both' | 'ar' | 'en') => void;
}

export default function FlashcardDeck({
  questions,
  bookmarkedIds,
  onToggleBookmark,
  explanationLang,
  onExplanationLangChange,
}: FlashcardDeckProps) {
  // View sub-mode: single-card focus carousel vs multi-card grid
  const [viewLayout, setViewLayout] = useState<'focus' | 'grid'>('focus');

  // Deck ordering: default or shuffled
  const [deckList, setDeckList] = useState<QuestionBankItem[]>([]);
  const [isShuffled, setIsShuffled] = useState(false);

  // Active recall filter (within current filtered questions)
  const [recallFilter, setRecallFilter] = useState<'all' | 'needsReview' | 'mastered' | 'unreviewed'>('all');

  // Mastery tracking (persisted in session / local storage for study continuity)
  const [masteredIds, setMasteredIds] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem('eduquest_flashcards_mastered');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [reviewIds, setReviewIds] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem('eduquest_flashcards_review');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Current card index in Focus Mode
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  // Grid view individual flip state
  const [gridFlippedMap, setGridFlippedMap] = useState<Record<number, boolean>>({});

  // Sync questions with deck
  useEffect(() => {
    setDeckList(questions);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
  }, [questions]);

  // Save active recall states
  const updateMastery = (qId: number, status: 'mastered' | 'review') => {
    if (status === 'mastered') {
      setMasteredIds(prev => {
        const next = new Set(prev);
        next.add(qId);
        try { localStorage.setItem('eduquest_flashcards_mastered', JSON.stringify(Array.from(next))); } catch (e) { console.error(e); }
        return next;
      });
      setReviewIds(prev => {
        const next = new Set(prev);
        next.delete(qId);
        try { localStorage.setItem('eduquest_flashcards_review', JSON.stringify(Array.from(next))); } catch (e) { console.error(e); }
        return next;
      });
    } else {
      setReviewIds(prev => {
        const next = new Set(prev);
        next.add(qId);
        try { localStorage.setItem('eduquest_flashcards_review', JSON.stringify(Array.from(next))); } catch (e) { console.error(e); }
        return next;
      });
      setMasteredIds(prev => {
        const next = new Set(prev);
        next.delete(qId);
        try { localStorage.setItem('eduquest_flashcards_mastered', JSON.stringify(Array.from(next))); } catch (e) { console.error(e); }
        return next;
      });
    }
  };

  const resetRecallSession = () => {
    setMasteredIds(new Set());
    setReviewIds(new Set());
    try {
      localStorage.removeItem('eduquest_flashcards_mastered');
      localStorage.removeItem('eduquest_flashcards_review');
    } catch (e) {
      console.error(e);
    }
  };

  // Filtered deck for active recall sub-filters
  const activeDeck = useMemo(() => {
    return deckList.filter(q => {
      if (recallFilter === 'needsReview') return reviewIds.has(q.id);
      if (recallFilter === 'mastered') return masteredIds.has(q.id);
      if (recallFilter === 'unreviewed') return !masteredIds.has(q.id) && !reviewIds.has(q.id);
      return true;
    });
  }, [deckList, recallFilter, reviewIds, masteredIds]);

  // Bound currentIndex within activeDeck
  useEffect(() => {
    if (currentIndex >= activeDeck.length && activeDeck.length > 0) {
      setCurrentIndex(0);
    }
  }, [activeDeck.length, currentIndex]);

  // Current Card
  const currentCard = activeDeck[currentIndex] || null;

  // Shuffle handler
  const handleShuffle = () => {
    const shuffled = [...deckList].sort(() => Math.random() - 0.5);
    setDeckList(shuffled);
    setIsShuffled(true);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
  };

  const handleResetOrder = () => {
    setDeckList(questions);
    setIsShuffled(false);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
  };

  // Flip toggle
  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  // Next / Prev navigation
  const handleNext = useCallback(() => {
    if (activeDeck.length === 0) return;
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex(prev => (prev + 1) % activeDeck.length);
  }, [activeDeck.length]);

  const handlePrev = useCallback(() => {
    if (activeDeck.length === 0) return;
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex(prev => (prev - 1 + activeDeck.length) % activeDeck.length);
  }, [activeDeck.length]);

  // Quick rating & advance
  const handleRateAndAdvance = (status: 'mastered' | 'review') => {
    if (!currentCard) return;
    updateMastery(currentCard.id, status);

    if (status === 'mastered' && masteredIds.size + 1 === activeDeck.length) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }

    // Advance to next card smoothly
    setTimeout(() => {
      handleNext();
    }, 200);
  };

  // Keyboard navigation
  useEffect(() => {
    if (viewLayout !== 'focus') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        handleFlip();
      } else if (e.key === 'ArrowRight' || e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === '1') {
        e.preventDefault();
        handleRateAndAdvance('review');
      } else if (e.key === '2') {
        e.preventDefault();
        handleRateAndAdvance('mastered');
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        handleShuffle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewLayout, handleFlip, handleNext, handlePrev, currentCard]);

  // Grid view bulk flip
  const handleFlipAllGrid = (flip: boolean) => {
    const map: Record<number, boolean> = {};
    activeDeck.forEach(q => {
      map[q.id] = flip;
    });
    setGridFlippedMap(map);
  };

  // Progress metrics
  const totalCards = activeDeck.length;
  const masteredCount = deckList.filter(q => masteredIds.has(q.id)).length;
  const reviewCount = deckList.filter(q => reviewIds.has(q.id)).length;
  const progressPercent = deckList.length > 0 ? Math.round((masteredCount / deckList.length) * 100) : 0;

  if (activeDeck.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700 shadow-sm">
        <Layers className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          No cards available in this filter
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {recallFilter !== 'all'
            ? `There are no cards currently marked as "${recallFilter}".`
            : "No questions match your current search and module filters."}
        </p>
        <button
          onClick={() => setRecallFilter('all')}
          className="mt-4 px-4 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg hover:bg-indigo-100"
        >
          Show All Available Flashcards
        </button>
      </div>
    );
  }

  const correctOption = currentCard?.options.find(o => o.isCorrect);
  const correctOptionIndex = currentCard ? currentCard.options.findIndex(o => o.isCorrect) : -1;
  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div className="space-y-5">
      {/* Top Deck Control Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 shadow-sm space-y-4">
        {/* Active Recall Progress Bar */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-2">
            <div className="flex items-center space-x-3">
              <span className="font-bold text-gray-900 dark:text-white flex items-center">
                <Sparkles size={14} className="mr-1.5 text-indigo-600 dark:text-indigo-400" />
                Active Recall Deck
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {deckList.length} Questions Total
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center">
                <CheckCircle2 size={13} className="mr-1" /> {masteredCount} Mastered
              </span>
              <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center">
                <RotateCcw size={13} className="mr-1" /> {reviewCount} Review
              </span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                {progressPercent}% Mastery
              </span>
            </div>
          </div>

          <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${(masteredCount / (deckList.length || 1)) * 100}%` }}
              className="bg-emerald-500 h-full transition-all duration-300"
              title={`${masteredCount} Mastered`}
            />
            <div
              style={{ width: `${(reviewCount / (deckList.length || 1)) * 100}%` }}
              className="bg-amber-500 h-full transition-all duration-300"
              title={`${reviewCount} Needs Review`}
            />
          </div>
        </div>

        {/* Filters & Mode Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-gray-100 dark:border-gray-700/60">
          {/* Deck Filters */}
          <div className="inline-flex rounded-lg p-0.5 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs">
            <button
              onClick={() => setRecallFilter('all')}
              className={cn(
                "px-2.5 py-1 rounded-md font-medium transition",
                recallFilter === 'all'
                  ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 shadow-sm"
                  : "text-gray-600 dark:text-gray-400"
              )}
            >
              All ({deckList.length})
            </button>
            <button
              onClick={() => setRecallFilter('needsReview')}
              className={cn(
                "px-2.5 py-1 rounded-md font-medium transition",
                recallFilter === 'needsReview'
                  ? "bg-white dark:bg-gray-700 text-amber-600 dark:text-amber-300 shadow-sm"
                  : "text-gray-600 dark:text-gray-400"
              )}
            >
              Review ({reviewCount})
            </button>
            <button
              onClick={() => setRecallFilter('mastered')}
              className={cn(
                "px-2.5 py-1 rounded-md font-medium transition",
                recallFilter === 'mastered'
                  ? "bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-300 shadow-sm"
                  : "text-gray-600 dark:text-gray-400"
              )}
            >
              Mastered ({masteredCount})
            </button>
            <button
              onClick={() => setRecallFilter('unreviewed')}
              className={cn(
                "px-2.5 py-1 rounded-md font-medium transition",
                recallFilter === 'unreviewed'
                  ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 shadow-sm"
                  : "text-gray-600 dark:text-gray-400"
              )}
            >
              Unreviewed ({Math.max(0, deckList.length - masteredCount - reviewCount)})
            </button>
          </div>

          {/* Controls: Shuffle, Layout, Language */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Shuffle Button */}
            <button
              onClick={isShuffled ? handleResetOrder : handleShuffle}
              className={cn(
                "inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg border transition",
                isShuffled
                  ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50"
              )}
              title={isShuffled ? "Reset to original sequential order" : "Shuffle cards for random active recall"}
            >
              <Shuffle size={13} className="mr-1.5" />
              {isShuffled ? "Shuffled (Order Q1-99)" : "Shuffle Deck"}
            </button>

            {/* Explanation Language */}
            <div className="inline-flex items-center text-xs bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-0.5">
              <span className="px-2 text-gray-500 text-[11px] font-medium hidden md:inline">
                <Languages size={12} className="inline mr-1" />
              </span>
              <button
                onClick={() => onExplanationLangChange('both')}
                className={cn(
                  "px-2 py-1 text-xs font-semibold rounded-md transition",
                  explanationLang === 'both' ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 shadow-sm" : "text-gray-600 dark:text-gray-400"
                )}
              >
                Both
              </button>
              <button
                onClick={() => onExplanationLangChange('ar')}
                className={cn(
                  "px-2 py-1 text-xs font-semibold rounded-md transition font-sans",
                  explanationLang === 'ar' ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 shadow-sm" : "text-gray-600 dark:text-gray-400"
                )}
              >
                العربية
              </button>
              <button
                onClick={() => onExplanationLangChange('en')}
                className={cn(
                  "px-2 py-1 text-xs font-semibold rounded-md transition",
                  explanationLang === 'en' ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 shadow-sm" : "text-gray-600 dark:text-gray-400"
                )}
              >
                EN
              </button>
            </div>

            {/* View Layout Toggle: Focus vs Grid */}
            <div className="inline-flex rounded-lg p-0.5 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setViewLayout('focus')}
                className={cn(
                  "px-2.5 py-1 text-xs font-semibold rounded-md transition flex items-center",
                  viewLayout === 'focus' ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 shadow-sm" : "text-gray-600 dark:text-gray-400"
                )}
                title="Single-card Focus Carousel"
              >
                <Maximize2 size={13} className="mr-1" /> Focus
              </button>
              <button
                onClick={() => setViewLayout('grid')}
                className={cn(
                  "px-2.5 py-1 text-xs font-semibold rounded-md transition flex items-center",
                  viewLayout === 'grid' ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 shadow-sm" : "text-gray-600 dark:text-gray-400"
                )}
                title="Multi-card Flashcard Grid"
              >
                <LayoutGrid size={13} className="mr-1" /> Grid
              </button>
            </div>

            {/* Reset Session */}
            {(masteredCount > 0 || reviewCount > 0) && (
              <button
                onClick={resetRecallSession}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Reset session ratings"
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. FOCUS CAROUSEL DECK VIEW (Primary Active Recall Experience)           */}
      {/* ========================================================================= */}
      {viewLayout === 'focus' && currentCard && (
        <div className="space-y-4 max-w-4xl mx-auto">
          {/* Top Card Meta & Jump Bar */}
          <div className="flex items-center justify-between px-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-gray-900 dark:text-white text-sm">
                Card {currentIndex + 1} of {totalCards}
              </span>
              <span className="text-gray-400">•</span>
              <span className="font-medium text-indigo-600 dark:text-indigo-400">
                Q{currentCard.originalNumber}
              </span>
              {masteredIds.has(currentCard.id) && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Mastered ✓
                </span>
              )}
              {reviewIds.has(currentCard.id) && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                  Needs Review ↺
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowShortcutsHelp(!showShortcutsHelp)}
                className="hover:text-gray-700 dark:hover:text-gray-200 flex items-center font-medium"
                title="View keyboard shortcuts"
              >
                <Keyboard size={14} className="mr-1" /> Shortcuts
              </button>
            </div>
          </div>

          {/* Keyboard Shortcuts Helper Drawer */}
          {showShortcutsHelp && (
            <div className="p-3 bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 rounded-xl text-xs text-indigo-900 dark:text-indigo-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <span><kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 border rounded font-mono text-[11px]">Space</kbd> / <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 border rounded font-mono text-[11px]">Enter</kbd>: Flip Card</span>
                <span><kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 border rounded font-mono text-[11px]">←</kbd> / <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 border rounded font-mono text-[11px]">→</kbd>: Prev / Next</span>
                <span><kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 border rounded font-mono text-[11px]">1</kbd>: Need Review</span>
                <span><kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 border rounded font-mono text-[11px]">2</kbd>: Mastered</span>
                <span><kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 border rounded font-mono text-[11px]">S</kbd>: Shuffle</span>
              </div>
              <button
                onClick={() => setShowShortcutsHelp(false)}
                className="text-[11px] underline font-semibold"
              >
                Close
              </button>
            </div>
          )}

          {/* 3D Flipping Flashcard Container */}
          <div className="w-full relative select-none card-perspective group">
            <div
              style={{
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
              className={cn(
                "card-flip-container relative w-full min-h-[480px] sm:min-h-[440px] rounded-2xl cursor-pointer",
                isFlipped
                  ? "shadow-2xl shadow-indigo-500/10 dark:shadow-indigo-950/40"
                  : "shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all"
              )}
            >
              {/* ------------------------------------------------------------- */}
              {/* FRONT OF FLASHCARD (QUESTION & PROMPT)                        */}
              {/* ------------------------------------------------------------- */}
              <div
                onClick={handleFlip}
                className={cn(
                  "card-face-front absolute inset-0 w-full h-full rounded-2xl p-6 sm:p-8 flex flex-col justify-between border transition-all",
                  "bg-gradient-to-b from-white via-white to-gray-50/90 dark:from-gray-800 dark:via-gray-800 dark:to-gray-850",
                  "border-gray-200/90 dark:border-gray-700 group-hover:border-indigo-400/80 dark:group-hover:border-indigo-500/80"
                )}
              >
                <div>
                  {/* Card Front Top Metadata */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200">
                        Q{currentCard.originalNumber}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300">
                        {currentCard.lessonModule}
                      </span>
                      <span className={cn(
                        "px-2 py-0.5 text-[10px] font-bold uppercase rounded",
                        currentCard.difficulty === 1
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                          : currentCard.difficulty === 2
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                      )}>
                        Level {currentCard.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={handleFlip}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 transition flex items-center shadow-xs"
                        title="Click to flip card and reveal answer (Space)"
                      >
                        <RotateCw size={12} className="mr-1.5 text-indigo-600 dark:text-indigo-400 group-hover:rotate-180 transition-transform duration-500" />
                        <span>Flip Card</span>
                      </button>
                      <button
                        onClick={() => onToggleBookmark(currentCard.id)}
                        className="p-1.5 text-gray-400 hover:text-amber-500 transition rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        title={bookmarkedIds.has(currentCard.id) ? "Remove Star" : "Star Question"}
                      >
                        <Star
                          size={20}
                          className={cn(bookmarkedIds.has(currentCard.id) && "fill-amber-400 text-amber-500")}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Objective & Question Prompt */}
                  <div className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-1.5">
                    Objective: {currentCard.objective}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-relaxed mb-6">
                    {currentCard.prompt}
                  </h3>

                  {/* Options List to Stimulate Active Retrieval */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentCard.options.map((opt, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-gray-200 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/40 text-xs sm:text-sm text-gray-700 dark:text-gray-300 flex items-start"
                      >
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold mr-2.5 shrink-0 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                          {letters[idx]}
                        </span>
                        <span className="leading-snug">{opt.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Front Footer Hints & Flip Prompt */}
                <div className="pt-6 mt-4 border-t border-gray-100 dark:border-gray-700/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  {/* Hint Toggle */}
                  <div onClick={(e) => e.stopPropagation()}>
                    {currentCard.hint && (
                      <div>
                        {!showHint ? (
                          <button
                            onClick={() => setShowHint(true)}
                            className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium"
                          >
                            <Lightbulb size={14} className="mr-1 text-amber-500" />
                            Need a clue? Show hint
                          </button>
                        ) : (
                          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-lg text-amber-900 dark:text-amber-200 flex items-center">
                            <Lightbulb size={14} className="mr-1.5 text-amber-600 shrink-0" />
                            <span><strong>Hint: </strong>{currentCard.hint}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Visual Flip Trigger Indicator */}
                  <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={handleFlip}
                      className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-sm transition"
                    >
                      <RotateCw size={13} className="mr-1.5 animate-spin-slow" />
                      <span>Flip to Reveal Solution</span>
                      <kbd className="ml-2 px-1.5 py-0.5 bg-indigo-700/70 rounded font-mono text-[10px]">Space</kbd>
                    </button>
                  </div>
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* BACK OF FLASHCARD (CORRECT ANSWER & SCIENTIFIC EXPLANATIONS)   */}
              {/* ------------------------------------------------------------- */}
              <div
                onClick={handleFlip}
                className={cn(
                  "card-face-back absolute inset-0 w-full h-full rounded-2xl p-6 sm:p-8 flex flex-col justify-between border overflow-y-auto transition-all",
                  "bg-gradient-to-b from-white via-white to-emerald-50/30 dark:from-gray-800 dark:via-gray-800 dark:to-emerald-950/20",
                  "border-emerald-300 dark:border-emerald-800 shadow-xl"
                )}
              >
                <div className="space-y-4">
                  {/* Card Back Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 flex items-center">
                        <CheckCircle2 size={14} className="mr-1" />
                        Correct Answer
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Q{currentCard.originalNumber} Solution
                      </span>
                    </div>

                    <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={handleFlip}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center shadow-xs"
                      >
                        <RotateCw size={13} className="mr-1.5 text-gray-500" />
                        <span>Flip to Question</span>
                        <kbd className="ml-2 px-1.5 py-0.5 bg-white dark:bg-gray-800 border rounded font-mono text-[10px]">Space</kbd>
                      </button>
                    </div>
                  </div>

                  {/* Correct Option Highlight Box */}
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80">
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block mb-1">
                      Target Answer: Option ({letters[correctOptionIndex]})
                    </span>
                    <div className="text-base sm:text-lg font-bold text-emerald-950 dark:text-emerald-100">
                      {correctOption?.text}
                    </div>
                  </div>

                  {/* Arabic Explanation & Academic Rationale */}
                  {currentCard.explanationAr && (explanationLang === 'ar' || explanationLang === 'both') && (
                    <div
                      className="p-4 rounded-xl bg-amber-50/90 dark:bg-amber-950/30 border-r-4 border-amber-500 text-right font-sans"
                      dir="rtl"
                    >
                      <div className="font-bold text-amber-900 dark:text-amber-200 text-xs mb-1.5 flex items-center justify-between">
                        <span className="flex items-center">
                          <Sparkles size={13} className="ml-1 text-amber-600" />
                          الشرح العلمي والمنهجي (المرجع الأكاديمي):
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 rounded">
                          ({letters[correctOptionIndex]})
                        </span>
                      </div>
                      <p className="text-gray-800 dark:text-gray-200 text-xs sm:text-sm leading-relaxed">
                        {currentCard.explanationAr}
                      </p>
                    </div>
                  )}

                  {/* English Explanation & Mnemonic Clue */}
                  {(explanationLang === 'en' || explanationLang === 'both') && (
                    <div className="p-3.5 bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 rounded-xl text-xs space-y-1.5">
                      {currentCard.explanation && (
                        <p className="text-indigo-950 dark:text-indigo-200">
                          <strong className="font-semibold text-indigo-700 dark:text-indigo-300">English Conceptual Rationale: </strong>
                          {currentCard.explanation}
                        </p>
                      )}
                      {currentCard.hint && (
                        <p className="text-indigo-900/80 dark:text-indigo-300/80">
                          <strong className="font-semibold text-indigo-600 dark:text-indigo-400">Memory Anchor / Rule: </strong>
                          {currentCard.hint}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Back Footer: Active Recall Assessment Buttons */}
                <div
                  className="pt-5 mt-4 border-t border-gray-100 dark:border-gray-700/60"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    How was your active recall?
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleRateAndAdvance('review')}
                      className="py-2.5 px-4 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 text-amber-900 dark:text-amber-200 font-semibold text-xs sm:text-sm transition flex items-center justify-center shadow-sm"
                    >
                      <RotateCcw size={15} className="mr-2 text-amber-600" />
                      Needs Review <span className="hidden sm:inline text-xs opacity-75 ml-1">[Key 1]</span>
                    </button>
                    <button
                      onClick={() => handleRateAndAdvance('mastered')}
                      className="py-2.5 px-4 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-900 dark:text-emerald-200 font-semibold text-xs sm:text-sm transition flex items-center justify-center shadow-sm"
                    >
                      <CheckCircle2 size={15} className="mr-2 text-emerald-600" />
                      I Knew It! Mastered <span className="hidden sm:inline text-xs opacity-75 ml-1">[Key 2]</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Navigation Toolbar */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4 shadow-sm flex items-center justify-between gap-2">
            <button
              onClick={handlePrev}
              disabled={activeDeck.length <= 1}
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40 transition flex items-center"
            >
              <ChevronLeft size={16} className="mr-1" /> Previous
            </button>

            {/* Quick Card Stepper / Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Card</span>
              <select
                value={currentIndex}
                onChange={(e) => {
                  setCurrentIndex(Number(e.target.value));
                  setIsFlipped(false);
                  setShowHint(false);
                }}
                className="px-2.5 py-1 text-xs font-semibold bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {activeDeck.map((q, idx) => (
                  <option key={q.id} value={idx}>
                    {idx + 1}. Q{q.originalNumber} - {q.prompt.slice(0, 30)}...
                  </option>
                ))}
              </select>
              <span className="text-xs text-gray-500 dark:text-gray-400">of {totalCards}</span>
            </div>

            <button
              onClick={handleNext}
              disabled={activeDeck.length <= 1}
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 transition flex items-center"
            >
              Next <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MULTI-CARD GRID VIEW (Scan & Flip All)                                */}
      {/* ========================================================================= */}
      {viewLayout === 'grid' && (
        <div className="space-y-4">
          {/* Grid View Controls */}
          <div className="flex items-center justify-between px-1 text-xs text-gray-500 dark:text-gray-400">
            <span>Showing {activeDeck.length} flashcards in grid. Click any card to flip.</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleFlipAllGrid(false)}
                className="px-2.5 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 text-gray-700 dark:text-gray-300 font-medium"
              >
                Reset All to Front
              </button>
              <button
                onClick={() => handleFlipAllGrid(true)}
                className="px-2.5 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 text-indigo-600 dark:text-indigo-400 font-medium"
              >
                Reveal All Answers
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeDeck.map((q) => {
              const isCardFlipped = !!gridFlippedMap[q.id];
              const qCorrectOption = q.options.find(o => o.isCorrect);
              const qCorrectIndex = q.options.findIndex(o => o.isCorrect);

              const toggleCardFlip = () => {
                setGridFlippedMap(prev => ({ ...prev, [q.id]: !prev[q.id] }));
              };

              return (
                <div
                  key={q.id}
                  className="w-full select-none card-perspective group"
                >
                  <div
                    onClick={toggleCardFlip}
                    style={{
                      transform: isCardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}
                    className={cn(
                      "card-flip-container relative w-full h-[370px] rounded-xl cursor-pointer",
                      isCardFlipped ? "shadow-lg shadow-emerald-500/10" : "shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
                    )}
                  >
                    {/* Front */}
                    <div
                      className={cn(
                        "card-face-front absolute inset-0 w-full h-full rounded-xl p-5 flex flex-col justify-between border transition-all",
                        "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 group-hover:border-indigo-400"
                      )}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                            Q{q.originalNumber}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            Level {q.difficulty}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-relaxed line-clamp-4 mb-3">
                          {q.prompt}
                        </h4>
                        <div className="space-y-1">
                          {q.options.slice(0, 4).map((opt, oIdx) => (
                            <div key={oIdx} className="text-xs text-gray-600 dark:text-gray-300 truncate">
                              <span className="font-semibold mr-1">{letters[oIdx]}.</span> {opt.text}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-[11px] text-gray-400">
                        <span className="font-medium text-indigo-600 dark:text-indigo-400">Click to reveal answer</span>
                        <RotateCw size={13} className="text-indigo-500 group-hover:rotate-180 transition-transform duration-500" />
                      </div>
                    </div>

                    {/* Back */}
                    <div
                      className={cn(
                        "card-face-back absolute inset-0 w-full h-full rounded-xl p-5 flex flex-col justify-between border overflow-y-auto transition-all",
                        "bg-gradient-to-b from-white to-emerald-50/20 dark:from-gray-800 dark:to-emerald-950/20",
                        "border-emerald-300 dark:border-emerald-800"
                      )}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                            <CheckCircle2 size={13} className="mr-1" /> Solution
                          </span>
                          <span className="text-[11px] font-mono text-gray-400">Q{q.originalNumber}</span>
                        </div>

                        <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-xs">
                          <span className="font-bold text-emerald-800 dark:text-emerald-200">
                            ({letters[qCorrectIndex]}) {qCorrectOption?.text}
                          </span>
                        </div>

                        {q.explanationAr && (
                          <p className="text-[11px] text-gray-700 dark:text-gray-300 text-right leading-relaxed font-sans" dir="rtl">
                            {q.explanationAr}
                          </p>
                        )}

                        {q.explanation && (
                          <p className="text-[11px] text-indigo-900 dark:text-indigo-300 leading-relaxed">
                            {q.explanation}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-[11px] text-gray-400">
                        <span>Click to flip back</span>
                        <RotateCw size={13} className="text-emerald-500" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
