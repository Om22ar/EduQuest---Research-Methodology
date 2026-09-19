import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { QUESTION_BANK, STATISTICAL_REVISION_SUMMARY, QuestionBankItem, StatisticalSummarySection } from '../data/questionBankData.ts';
import FlashcardDeck from './FlashcardDeck.tsx';
import { Search, BookOpen, CheckCircle, XCircle, HelpCircle, Star, Filter, RotateCcw, ArrowRight, Languages, BookMarked, Sparkles, ChevronRight, Layers } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface QuestionBankProps {
  initialMode?: 'study' | 'practice' | 'flashcard';
}

export default function QuestionBank({ initialMode }: QuestionBankProps) {
  const [activeTab, setActiveTab] = useState<'bank' | 'summary'>('bank');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [mode, setMode] = useState<'study' | 'practice' | 'flashcard'>(() => initialMode || 'practice');
  const [explanationLang, setExplanationLang] = useState<'both' | 'ar' | 'en'>('both');
  const [revealedExplanations, setRevealedExplanations] = useState<Record<number, boolean>>({});
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({}); // qId -> optionIndex
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem('eduquest_bookmarked_questions');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [filterBookmarkedOnly, setFilterBookmarkedOnly] = useState(false);
  const [summarySearch, setSummarySearch] = useState('');

  // Toggle bookmark
  const toggleBookmark = (id: number) => {
    setBookmarkedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem('eduquest_bookmarked_questions', JSON.stringify(Array.from(next)));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Modules list
  const modulesList = useMemo(() => {
    const list = Array.from(new Set(QUESTION_BANK.map(q => q.lessonModule)));
    return ['All', ...list];
  }, []);

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return QUESTION_BANK.filter(q => {
      if (selectedModule !== 'All' && q.lessonModule !== selectedModule) return false;
      if (selectedDifficulty !== 'All' && q.difficulty.toString() !== selectedDifficulty) return false;
      if (filterBookmarkedOnly && !bookmarkedIds.has(q.id)) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesPrompt = q.prompt.toLowerCase().includes(query);
        const matchesOptions = q.options.some(opt => opt.text.toLowerCase().includes(query));
        const matchesObjective = q.objective.toLowerCase().includes(query);
        const matchesNumber = String(q.originalNumber).includes(query);
        const matchesArabic = q.explanationAr?.toLowerCase().includes(query);
        if (!matchesPrompt && !matchesOptions && !matchesObjective && !matchesNumber && !matchesArabic) return false;
      }

      return true;
    });
  }, [searchQuery, selectedModule, selectedDifficulty, filterBookmarkedOnly, bookmarkedIds]);

  // Filter statistical summary sections
  const filteredSummary = useMemo(() => {
    if (!summarySearch.trim()) return STATISTICAL_REVISION_SUMMARY;
    const q = summarySearch.toLowerCase();
    return STATISTICAL_REVISION_SUMMARY.filter(sec => 
      sec.titleEn.toLowerCase().includes(q) ||
      sec.titleAr.includes(q) ||
      sec.summaryEn.toLowerCase().includes(q) ||
      sec.summaryAr.includes(q) ||
      sec.items.some(item => 
        item.labelEn.toLowerCase().includes(q) ||
        item.labelAr.includes(q) ||
        item.detailEn.toLowerCase().includes(q) ||
        item.detailAr.includes(q)
      )
    );
  }, [summarySearch]);

  // Practice score statistics
  const practiceStats = useMemo(() => {
    let answered = 0;
    let correct = 0;
    Object.entries(userAnswers).forEach(([qIdStr, optIdx]) => {
      const q = QUESTION_BANK.find(item => item.id === Number(qIdStr));
      if (q && q.options[optIdx]) {
        answered++;
        if (q.options[optIdx].isCorrect) {
          correct++;
        }
      }
    });
    return { answered, correct, accuracy: answered > 0 ? Math.round((correct / answered) * 100) : 0 };
  }, [userAnswers]);

  const handleSelectAnswer = (qId: number, optionIdx: number) => {
    setUserAnswers(prev => ({ ...prev, [qId]: optionIdx }));
    // automatically reveal explanation on answering in practice mode
    setRevealedExplanations(prev => ({ ...prev, [qId]: true }));
  };

  const toggleExplanation = (qId: number) => {
    setRevealedExplanations(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const resetPractice = () => {
    setUserAnswers({});
    setRevealedExplanations({});
  };

  const jumpToTopicQuestions = (moduleName: string) => {
    setSelectedModule(moduleName);
    setActiveTab('bank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="px-2.5 py-1 text-xs font-bold uppercase rounded-md bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300">
                Official Exam Master Bank
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                100 Questions • Bilingual Explanations
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1.5">
              Research Methodology Master Center
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-3xl">
              Complete exam questions with comprehensive scientific explanations in Arabic and English, paired with a quick-revision summary of all key statistical concepts.
            </p>
          </div>

          {/* Tab Navigation: Bank vs Flashcards vs Summary */}
          <div className="inline-flex rounded-xl p-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shrink-0">
            <button
              onClick={() => {
                setActiveTab('bank');
                if (mode === 'flashcard') setMode('practice');
              }}
              className={cn(
                "px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center",
                activeTab === 'bank' && mode !== 'flashcard'
                  ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <BookOpen size={16} className="mr-1.5" />
              Question Bank
            </button>
            <button
              onClick={() => {
                setActiveTab('bank');
                setMode('flashcard');
              }}
              className={cn(
                "px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center",
                activeTab === 'bank' && mode === 'flashcard'
                  ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <Layers size={16} className="mr-1.5 text-indigo-500" />
              Flashcard Mode
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={cn(
                "px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center",
                activeTab === 'summary'
                  ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <BookMarked size={16} className="mr-1.5 text-amber-500" />
              ملخص القواعد الإحصائية
            </button>
          </div>
        </div>

        {/* Top Metric Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Questions</span>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">100</div>
            <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 block">Q1 to Q99 with keys</span>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {activeTab === 'bank' ? 'Currently Filtered' : 'Key Statistical Rules'}
            </span>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
              {activeTab === 'bank' ? filteredQuestions.length : STATISTICAL_REVISION_SUMMARY.length}
            </div>
            <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 block">
              {activeTab === 'bank' ? `${Math.round((filteredQuestions.length / QUESTION_BANK.length) * 100)}% of bank` : '7 Core Exam Concepts'}
            </span>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Practice Accuracy</span>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {practiceStats.answered > 0 ? `${practiceStats.accuracy}%` : '—'}
            </div>
            <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 block">
              {practiceStats.correct} of {practiceStats.answered} correct
            </span>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Starred / Bookmarked</span>
            <div className="text-2xl font-bold text-amber-500 mt-1">
              {bookmarkedIds.size}
            </div>
            <button
              onClick={() => {
                setActiveTab('bank');
                setFilterBookmarkedOnly(!filterBookmarkedOnly);
              }}
              className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline mt-0.5 block font-medium"
            >
              {filterBookmarkedOnly ? 'Show all questions' : 'View bookmarked only'}
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: QUESTION BANK VIEW */}
      {activeTab === 'bank' && (
        <div>
          {/* Controls bar */}
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-6 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions by keyword, topic, question number, or Arabic explanation..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sub-controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center mr-1">
                  <Filter size={13} className="mr-1" /> Module:
                </span>
                <select
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value)}
                  className="px-3 py-1.5 text-xs font-medium bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {modulesList.map(mod => (
                    <option key={mod} value={mod}>{mod}</option>
                  ))}
                </select>

                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 ml-2 mr-1">
                  Difficulty:
                </span>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-3 py-1.5 text-xs font-medium bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="All">All Levels</option>
                  <option value="1">Level 1 (Fundamental)</option>
                  <option value="2">Level 2 (Intermediate)</option>
                  <option value="3">Level 3 (Advanced)</option>
                </select>
              </div>

              {/* Mode & Language switchers */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Explanation Language */}
                <div className="inline-flex items-center text-xs bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-0.5">
                  <span className="px-2 text-gray-500 text-[11px] font-medium hidden sm:inline">
                    <Languages size={12} className="inline mr-1" /> Explanations:
                  </span>
                  <button
                    onClick={() => setExplanationLang('both')}
                    className={cn(
                      "px-2.5 py-1 text-xs font-semibold rounded-md transition",
                      explanationLang === 'both' ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 shadow-sm" : "text-gray-600 dark:text-gray-400"
                    )}
                  >
                    Both (Dual)
                  </button>
                  <button
                    onClick={() => setExplanationLang('ar')}
                    className={cn(
                      "px-2.5 py-1 text-xs font-semibold rounded-md transition font-sans",
                      explanationLang === 'ar' ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 shadow-sm" : "text-gray-600 dark:text-gray-400"
                    )}
                  >
                    العربية
                  </button>
                  <button
                    onClick={() => setExplanationLang('en')}
                    className={cn(
                      "px-2.5 py-1 text-xs font-semibold rounded-md transition",
                      explanationLang === 'en' ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 shadow-sm" : "text-gray-600 dark:text-gray-400"
                    )}
                  >
                    English
                  </button>
                </div>

                {/* Mode Switcher */}
                <div className="inline-flex rounded-lg p-0.5 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setMode('practice')}
                    className={cn(
                      "px-2.5 py-1 text-xs font-semibold rounded-md transition",
                      mode === 'practice' ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 shadow-sm" : "text-gray-600 dark:text-gray-400"
                    )}
                  >
                    Self-Test
                  </button>
                  <button
                    onClick={() => setMode('study')}
                    className={cn(
                      "px-2.5 py-1 text-xs font-semibold rounded-md transition",
                      mode === 'study' ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 shadow-sm" : "text-gray-600 dark:text-gray-400"
                    )}
                  >
                    Study Mode
                  </button>
                  <button
                    onClick={() => setMode('flashcard')}
                    className={cn(
                      "px-2.5 py-1 text-xs font-semibold rounded-md transition flex items-center",
                      mode === 'flashcard' ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 shadow-sm" : "text-gray-600 dark:text-gray-400"
                    )}
                  >
                    <Layers size={13} className="mr-1 text-indigo-500" />
                    Flashcards
                  </button>
                </div>

                {practiceStats.answered > 0 && (
                  <button
                    onClick={resetPractice}
                    title="Reset practice responses"
                    className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <RotateCcw size={15} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Question Display: Flashcard Mode vs Standard List */}
          {mode === 'flashcard' ? (
            <FlashcardDeck
              questions={filteredQuestions}
              bookmarkedIds={bookmarkedIds}
              onToggleBookmark={toggleBookmark}
              explanationLang={explanationLang}
              onExplanationLangChange={setExplanationLang}
            />
          ) : filteredQuestions.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700 shadow-sm">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">No questions match your criteria</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Try clearing your search query or adjusting your filters.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedModule('All');
                  setSelectedDifficulty('All');
                  setFilterBookmarkedOnly(false);
                }}
                className="mt-4 px-4 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map((q) => {
                const hasAnswered = userAnswers[q.id] !== undefined;
                const selectedOptIdx = userAnswers[q.id];
                const isBookmarked = bookmarkedIds.has(q.id);
                const isRevealed = mode === 'study' || revealedExplanations[q.id];
                const correctOptIdx = q.options.findIndex(o => o.isCorrect);

                return (
                  <div
                    key={q.id}
                    className={cn(
                      "bg-white dark:bg-gray-800 rounded-xl border p-5 transition shadow-sm",
                      hasAnswered
                        ? q.options[selectedOptIdx]?.isCorrect
                          ? "border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/10"
                          : "border-rose-200 dark:border-rose-900/60 bg-rose-50/10"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    )}
                  >
                    {/* Meta header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                          Q{q.originalNumber}
                        </span>
                        <span className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900">
                          {q.lessonModule}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          • {q.objective}
                        </span>
                        <span className={cn(
                          "px-2 py-0.5 text-[10px] font-bold uppercase rounded",
                          q.difficulty === 1
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                            : q.difficulty === 2
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                        )}>
                          Level {q.difficulty}
                        </span>
                      </div>

                      <button
                        onClick={() => toggleBookmark(q.id)}
                        title={isBookmarked ? "Remove bookmark" : "Bookmark question"}
                        className="text-gray-400 hover:text-amber-500 transition p-1"
                      >
                        <Star
                          size={18}
                          className={cn(isBookmarked && "fill-amber-400 text-amber-500")}
                        />
                      </button>
                    </div>

                    {/* Question Prompt */}
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white leading-relaxed mb-4">
                      {q.prompt}
                    </h3>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = selectedOptIdx === optIdx;
                        const isCorrect = opt.isCorrect;

                        let optionStyle = "border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-900/40 hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-800 dark:text-gray-200";

                        if (mode === 'study') {
                          if (isCorrect) {
                            optionStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold";
                          }
                        } else if (hasAnswered) {
                          if (isCorrect) {
                            optionStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold";
                          } else if (isSelected && !isCorrect) {
                            optionStyle = "border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200";
                          } else {
                            optionStyle = "opacity-60 border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20";
                          }
                        }

                        const letters = ['A', 'B', 'C', 'D'];

                        return (
                          <button
                            key={optIdx}
                            disabled={mode === 'study' || hasAnswered}
                            onClick={() => handleSelectAnswer(q.id, optIdx)}
                            className={cn(
                              "flex items-start text-left p-3 rounded-lg border text-sm transition-all relative",
                              optionStyle
                            )}
                          >
                            <span className={cn(
                              "inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold mr-2.5 shrink-0",
                              mode === 'study' && isCorrect
                                ? "bg-emerald-600 text-white"
                                : hasAnswered && isCorrect
                                ? "bg-emerald-600 text-white"
                                : hasAnswered && isSelected && !isCorrect
                                ? "bg-rose-600 text-white"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                            )}>
                              {letters[optIdx]}
                            </span>
                            <span className="flex-1 leading-snug">{opt.text}</span>
                            {((mode === 'study' && isCorrect) || (hasAnswered && isCorrect)) && (
                              <CheckCircle size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 ml-1.5 mt-0.5" />
                            )}
                            {hasAnswered && isSelected && !isCorrect && (
                              <XCircle size={16} className="text-rose-600 dark:text-rose-400 shrink-0 ml-1.5 mt-0.5" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Footer Controls & Status */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700/60 text-xs">
                      <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                        {mode === 'practice' && !hasAnswered && (
                          <span className="italic">Click an option to test your recall</span>
                        )}
                        {mode === 'practice' && hasAnswered && (
                          <span className={cn(
                            "font-semibold flex items-center",
                            q.options[selectedOptIdx]?.isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                          )}>
                            {q.options[selectedOptIdx]?.isCorrect ? (
                              <>
                                <CheckCircle size={14} className="mr-1" /> Correct Answer!
                              </>
                            ) : (
                              <>
                                <XCircle size={14} className="mr-1" /> Incorrect. Correct is: ({['A','B','C','D'][correctOptIdx]}) {q.options[correctOptIdx]?.text}
                              </>
                            )}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => toggleExplanation(q.id)}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 inline-flex items-center"
                      >
                        <HelpCircle size={14} className="mr-1" />
                        {isRevealed ? "Hide Explanation" : "Explanation & Shurūḥ (الشرح)"}
                      </button>
                    </div>

                    {/* Detailed Bilingual Explanation Box */}
                    {isRevealed && (
                      <div className="mt-3.5 space-y-3">
                        {/* Arabic Explanation from curriculum sources */}
                        {q.explanationAr && (explanationLang === 'ar' || explanationLang === 'both') && (
                          <div className="p-3.5 bg-amber-50/80 dark:bg-amber-950/25 border-r-4 border-amber-500 rounded-lg text-right font-sans" dir="rtl">
                            <div className="font-bold text-amber-900 dark:text-amber-200 text-xs mb-1.5 flex items-center justify-between">
                              <span className="flex items-center">
                                <Sparkles size={13} className="ml-1 text-amber-600" />
                                الشرح العلمي والمنهجي (مصادر المادة):
                              </span>
                              <span className="text-[11px] font-mono px-2 py-0.5 bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 rounded">
                                الإجابة الصحيحة: ({['A','B','C','D'][correctOptIdx]})
                              </span>
                            </div>
                            <p className="text-gray-800 dark:text-gray-200 text-xs sm:text-sm leading-relaxed">
                              {q.explanationAr}
                            </p>
                          </div>
                        )}

                        {/* English Explanation & Conceptual Hint */}
                        {(explanationLang === 'en' || explanationLang === 'both') && (
                          <div className="p-3.5 bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 rounded-lg text-xs space-y-1.5">
                            {q.explanation && (
                              <p className="text-indigo-950 dark:text-indigo-200">
                                <strong className="font-semibold text-indigo-700 dark:text-indigo-300">English Rationale: </strong>
                                {q.explanation}
                              </p>
                            )}
                            {q.hint && (
                              <p className="text-indigo-900/80 dark:text-indigo-300/80">
                                <strong className="font-semibold text-indigo-600 dark:text-indigo-400">Memory Anchor / Hint: </strong>
                                {q.hint}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: STATISTICAL REVISION SUMMARY (ملخص القواعد الإحصائية) */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          {/* Summary Intro & Search */}
          <div className="bg-gradient-to-r from-amber-50 to-indigo-50 dark:from-amber-950/30 dark:to-indigo-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-md bg-amber-200 text-amber-900 dark:bg-amber-900/80 dark:text-amber-200">
                    High-Yield Exam Cheat Sheet
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">7 Core Statistical Modules</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                  ملخص مقتضب ومكثف لأهم المفاهيم والقواعد الإحصائية
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1" dir="rtl">
                  مراجعة سريعة ومركزة لأهم القواعد، مستويات المقاييس، النزعة المركزية، الأخطاء الإحصائية، وعلاقات الانحدار والارتباط التي تكررت في أسئلة الامتحان.
                </p>
              </div>

              {/* Quick Search */}
              <div className="relative min-w-[260px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={summarySearch}
                  onChange={(e) => setSummarySearch(e.target.value)}
                  placeholder="ابحث في القواعد / Search concepts..."
                  className="w-full pl-9 pr-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Render 7 Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredSummary.map((section) => (
              <div
                key={section.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm flex flex-col justify-between"
              >
                <div>
                  {/* Section Title */}
                  <div className="flex items-start justify-between gap-2 border-b border-gray-100 dark:border-gray-700/60 pb-3 mb-4">
                    <div>
                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 block mb-0.5">
                        Section {section.id}
                      </span>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">
                        {section.titleEn}
                      </h3>
                      <h4 className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 font-sans mt-0.5" dir="rtl">
                        {section.titleAr}
                      </h4>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3.5">
                    {section.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-gray-50/80 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800 space-y-1"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-gray-900 dark:text-white">
                            {item.labelEn}
                          </span>
                          {item.badge && (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 font-sans block text-right" dir="rtl">
                          {item.labelAr}
                        </span>
                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed pt-0.5">
                          {item.detailEn}
                        </p>
                        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-sans text-right pt-0.5" dir="rtl">
                          {item.detailAr}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card footer with direct jump */}
                <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400 italic">
                    Referenced across official questions
                  </span>
                  <button
                    onClick={() => {
                      if (section.id === 1) jumpToTopicQuestions("Sampling & Measurement Scales");
                      else if (section.id === 2 || section.id === 5) jumpToTopicQuestions("Statistical Analysis, Inference & Reporting");
                      else if (section.id === 3 || section.id === 4 || section.id === 7) jumpToTopicQuestions("Variables & Hypothesis Testing");
                      else jumpToTopicQuestions("Sampling & Measurement Scales");
                    }}
                    className="inline-flex items-center font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                  >
                    View Related Questions <ArrowRight size={13} className="ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Exam Tips Banner */}
          <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 rounded-xl p-5 text-xs sm:text-sm text-indigo-900 dark:text-indigo-200 space-y-2">
            <h4 className="font-bold text-sm flex items-center">
              <Sparkles size={16} className="mr-1.5 text-indigo-600 dark:text-indigo-400" />
              قواعد ذهبية للاختبار (Key Exam Memory Anchors)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-2.5 bg-white/70 dark:bg-gray-800/60 rounded-lg border border-indigo-100 dark:border-indigo-800" dir="rtl">
                <strong>حجم العينة والخطأ:</strong> كلما صغر حجم العينة (Smaller sample size) ➔ زاد خطأ المعاينة (Greater sampling error).
              </div>
              <div className="p-2.5 bg-white/70 dark:bg-gray-800/60 rounded-lg border border-indigo-100 dark:border-indigo-800" dir="rtl">
                <strong>النزعة المركزية للمقاييس:</strong> الاسمي = المنوال (Mode) • الترتيبي = الوسيط (Median) • الفئوي = المتوسط (Mean) • النسبي = المتوسط الهندسي (Geometric Mean).
              </div>
              <div className="p-2.5 bg-white/70 dark:bg-gray-800/60 rounded-lg border border-indigo-100 dark:border-indigo-800" dir="rtl">
                <strong>خطأ النوع الأول:</strong> رفض فرضية العدم (Null Hypothesis) وهي صحيحة وحقيقية في الواقع.
              </div>
              <div className="p-2.5 bg-white/70 dark:bg-gray-800/60 rounded-lg border border-indigo-100 dark:border-indigo-800" dir="rtl">
                <strong>التلاعب بالمتغيرات:</strong> البحث التجريبي (Experimental) هو الوحيد الذي يتضمن التلاعب المباشر بالمتغير المستقل (Manipulation).
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
