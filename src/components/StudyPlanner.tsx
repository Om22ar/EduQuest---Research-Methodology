import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  CheckCircle, 
  Circle, 
  Plus, 
  Trash2, 
  Clock, 
  BookOpen, 
  RefreshCw, 
  Award, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  Flame,
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface StudyGoal {
  id: string;
  dayDate: string; // YYYY-MM-DD
  title: string;
  category: 'lesson' | 'review' | 'quiz' | 'reading' | 'writing';
  durationMinutes: number;
  completed: boolean;
  createdAt: string;
}

interface UpcomingReview {
  id: number;
  questionId: number;
  interval: number;
  easeFactor: number;
  nextReviewDate: string;
  objective?: string;
  prompt?: string;
}

const SYLLABUS_PRESETS = [
  { title: "Review due spaced repetition cards", category: 'review' as const, duration: 15 },
  { title: "Lesson 1: Foundations of Scientific Research", category: 'lesson' as const, duration: 30 },
  { title: "Lesson 2: Defining & Evaluating Research Problems", category: 'lesson' as const, duration: 30 },
  { title: "Lesson 3: Drafting the Research Proposal", category: 'writing' as const, duration: 45 },
  { title: "Lesson 4: Literature Review & Hypothesis Synthesis", category: 'reading' as const, duration: 40 },
  { title: "Lesson 5: Historical Method & Internal/External Criticism", category: 'lesson' as const, duration: 35 },
  { title: "Complete Lesson Quiz with >=90% Mastery", category: 'quiz' as const, duration: 20 },
];

function getCategoryBadge(category: StudyGoal['category']) {
  switch (category) {
    case 'review':
      return { bg: 'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800', label: 'Review' };
    case 'lesson':
      return { bg: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800', label: 'Lesson' };
    case 'quiz':
      return { bg: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800', label: 'Quiz' };
    case 'reading':
      return { bg: 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800', label: 'Reading' };
    case 'writing':
      return { bg: 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800', label: 'Writing' };
    default:
      return { bg: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700', label: 'Study' };
  }
}

// Helpers for dates
function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getMondayOfCurrentWeek(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

export default function StudyPlanner() {
  const { user, getToken } = useAuth();
  const navigate = useNavigate();

  // Current viewed week starting Monday
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => getMondayOfCurrentWeek(new Date()));
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [upcomingReviews, setUpcomingReviews] = useState<UpcomingReview[]>([]);
  const [dueReviewsCount, setDueReviewsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);

  // New goal modal / form state
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [selectedDayForNewGoal, setSelectedDayForNewGoal] = useState<string>('');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<StudyGoal['category']>('lesson');
  const [newDuration, setNewDuration] = useState<number>(30);

  const storageKey = user ? `eduquest_goals_${user.uid || user.email}` : 'eduquest_goals_guest';

  // Load goals from storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setGoals(JSON.parse(saved));
      } else {
        // Seed default template goals for current week
        const monday = getMondayOfCurrentWeek(new Date());
        const sampleGoals: StudyGoal[] = [];
        
        for (let i = 0; i < 5; i++) {
          const d = new Date(monday);
          d.setDate(monday.getDate() + i);
          const dateStr = formatDateKey(d);
          
          if (i === 0) {
            sampleGoals.push({
              id: 'sample-1',
              dayDate: dateStr,
              title: 'Study Lesson 1: Scientific Research Concepts',
              category: 'lesson',
              durationMinutes: 30,
              completed: true,
              createdAt: new Date().toISOString()
            });
          } else if (i === 1) {
            sampleGoals.push({
              id: 'sample-2',
              dayDate: dateStr,
              title: 'Complete Research Basics Quiz (Aim for 90%)',
              category: 'quiz',
              durationMinutes: 20,
              completed: false,
              createdAt: new Date().toISOString()
            });
          } else if (i === 2) {
            sampleGoals.push({
              id: 'sample-3',
              dayDate: dateStr,
              title: 'Spaced Repetition Review Session',
              category: 'review',
              durationMinutes: 15,
              completed: false,
              createdAt: new Date().toISOString()
            });
          } else if (i === 3) {
            sampleGoals.push({
              id: 'sample-4',
              dayDate: dateStr,
              title: 'Read Literature Review Synthesis Guidelines',
              category: 'reading',
              durationMinutes: 35,
              completed: false,
              createdAt: new Date().toISOString()
            });
          } else if (i === 4) {
            sampleGoals.push({
              id: 'sample-5',
              dayDate: dateStr,
              title: 'Draft Research Problem Statement & Hypotheses',
              category: 'writing',
              durationMinutes: 45,
              completed: false,
              createdAt: new Date().toISOString()
            });
          }
        }
        setGoals(sampleGoals);
        localStorage.setItem(storageKey, JSON.stringify(sampleGoals));
      }
    } catch (e) {
      console.error("Failed to load study goals:", e);
    }
  }, [storageKey]);

  // Save goals on update
  const saveGoals = (updatedGoals: StudyGoal[]) => {
    setGoals(updatedGoals);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedGoals));
    } catch (e) {
      console.error("Failed to persist goals:", e);
    }
  };

  // Fetch upcoming reviews and streak from backend
  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        const token = await getToken();
        
        // Fetch upcoming reviews
        const resUpcoming = await fetch('/api/reviews/upcoming', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resUpcoming.ok) {
          const data = await resUpcoming.json();
          setUpcomingReviews(data);
        }

        // Fetch due reviews count
        const resDue = await fetch('/api/reviews/due', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resDue.ok) {
          const dataDue = await resDue.json();
          setDueReviewsCount(dataDue.length);
        }

        // Fetch streak
        const resStreak = await fetch('/api/stats/streak', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resStreak.ok) {
          const dataStreak = await resStreak.json();
          setStreak(dataStreak.streak || 0);
        }
      } catch (err) {
        console.error("Error fetching planner data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewData();
  }, [getToken]);

  // 7 days of current viewed week
  const weekDays = useMemo(() => {
    const days: { date: Date; dateKey: string; dayName: string; formattedDate: string; isToday: boolean }[] = [];
    const todayStr = formatDateKey(new Date());

    for (let i = 0; i < 7; i++) {
      const d = new Date(currentWeekStart);
      d.setDate(currentWeekStart.getDate() + i);
      const dateKey = formatDateKey(d);
      const dayName = d.toLocaleDateString(undefined, { weekday: 'short' });
      const formattedDate = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      
      days.push({
        date: d,
        dateKey,
        dayName,
        formattedDate,
        isToday: dateKey === todayStr
      });
    }
    return days;
  }, [currentWeekStart]);

  // Map reviews due by dateKey
  const reviewsByDate = useMemo(() => {
    const map: Record<string, UpcomingReview[]> = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    upcomingReviews.forEach(rev => {
      const revDate = new Date(rev.nextReviewDate);
      revDate.setHours(0, 0, 0, 0);
      
      // If review is in the past, map it to today so user sees it as due
      const targetDate = revDate < today ? today : revDate;
      const key = formatDateKey(targetDate);
      
      if (!map[key]) map[key] = [];
      map[key].push(rev);
    });
    return map;
  }, [upcomingReviews]);

  // Navigation handlers
  const handlePrevWeek = () => {
    const prev = new Date(currentWeekStart);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeekStart(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(currentWeekStart);
    next.setDate(next.getDate() + 7);
    setCurrentWeekStart(next);
  };

  const handleCurrentWeek = () => {
    setCurrentWeekStart(getMondayOfCurrentWeek(new Date()));
  };

  // Goal operations
  const handleToggleGoal = (id: string) => {
    const updated = goals.map(g => {
      if (g.id === id) {
        const nextCompleted = !g.completed;
        if (nextCompleted) {
          confetti({
            particleCount: 40,
            spread: 50,
            origin: { y: 0.8 },
            colors: ['#6366f1', '#a855f7', '#ec4899', '#22c55e']
          });
        }
        return { ...g, completed: nextCompleted };
      }
      return g;
    });
    saveGoals(updated);
  };

  const handleDeleteGoal = (id: string) => {
    const updated = goals.filter(g => g.id !== id);
    saveGoals(updated);
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const targetDate = selectedDayForNewGoal || formatDateKey(new Date());
    const newGoal: StudyGoal = {
      id: `goal-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      dayDate: targetDate,
      title: newTitle.trim(),
      category: newCategory,
      durationMinutes: newDuration,
      completed: false,
      createdAt: new Date().toISOString()
    };

    saveGoals([...goals, newGoal]);
    setNewTitle('');
    setIsAddingGoal(false);
  };

  const openAddGoalModal = (dayDate?: string) => {
    setSelectedDayForNewGoal(dayDate || formatDateKey(new Date()));
    setIsAddingGoal(true);
  };

  // Week statistics
  const currentWeekDateKeys = useMemo(() => new Set(weekDays.map(d => d.dateKey)), [weekDays]);
  const weekGoals = useMemo(() => goals.filter(g => currentWeekDateKeys.has(g.dayDate)), [goals, currentWeekDateKeys]);
  const completedWeekGoals = useMemo(() => weekGoals.filter(g => g.completed), [weekGoals]);
  const weekProgressPercent = weekGoals.length > 0 ? Math.round((completedWeekGoals.length / weekGoals.length) * 100) : 0;
  const totalWeekMinutes = useMemo(() => weekGoals.reduce((acc, g) => acc + (g.durationMinutes || 0), 0), [weekGoals]);

  const weekTitle = useMemo(() => {
    const start = weekDays[0]?.formattedDate;
    const end = weekDays[6]?.formattedDate;
    const year = weekDays[0]?.date.getFullYear();
    return `Week of ${start} – ${end}, ${year}`;
  }, [weekDays]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header & Overview */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 mb-1">
              <CalendarIcon className="h-6 w-6" />
              <span className="text-sm font-semibold uppercase tracking-wider">Academic Routine</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Weekly Study Planner
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Set realistic daily goals and stay on track with spaced repetition review sessions.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {streak > 0 && (
              <div 
                className="inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-bold bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 border border-orange-200 dark:border-orange-800"
                aria-label={`Current study streak: ${streak} days`}
              >
                <Flame className="h-4 w-4 mr-1 text-orange-600 fill-current" />
                {streak} Day Streak
              </div>
            )}
            <button
              onClick={() => openAddGoalModal()}
              aria-label="Add a new study goal"
              className="inline-flex items-center justify-center px-4 py-2 min-h-[44px] border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <Plus size={18} className="mr-1.5" /> Add Goal
            </button>
          </div>
        </div>

        {/* Weekly Stats Bar */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Weekly Goals</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {completedWeekGoals.length} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/ {weekGoals.length} completed</span>
              </p>
            </div>
            <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Target size={24} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Goal Completion</p>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                {weekProgressPercent}%
              </p>
            </div>
            <div className="h-12 w-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle size={24} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Planned Study Time</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {Math.round(totalWeekMinutes / 60 * 10) / 10} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">hrs</span>
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Clock size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Review Reminders Banner */}
      {dueReviewsCount > 0 ? (
        <div 
          className="mb-8 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          role="region"
          aria-label="Active Review Session Alert"
        >
          <div className="flex items-start space-x-4">
            <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
              <RefreshCw className="h-6 w-6 text-white animate-spin-slow" />
            </div>
            <div>
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/30 text-white mb-1">
                SRS Spaced Repetition Due
              </div>
              <h2 className="text-xl font-bold">
                You have {dueReviewsCount} concept review{dueReviewsCount > 1 ? 's' : ''} scheduled for today!
              </h2>
              <p className="text-orange-100 text-sm mt-1 max-w-xl">
                Reviewing cards right when they are due strengthens neural connections and saves study time later.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/review')}
            aria-label="Start your scheduled spaced repetition review session"
            className="w-full md:w-auto inline-flex items-center justify-center px-6 py-3 min-h-[44px] bg-white text-orange-700 hover:bg-orange-50 font-semibold text-sm rounded-xl shadow-sm transition-transform active:scale-95"
          >
            Start Review Session <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="mb-8 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">
                Spaced Repetition Schedule is Up to Date
              </p>
              <p className="text-xs text-indigo-700 dark:text-indigo-400">
                All scheduled reviews for today are completed. Check upcoming days below to plan your week ahead.
              </p>
            </div>
          </div>
          <Link
            to="/review"
            aria-label="View current review status"
            className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center ml-4 shrink-0"
          >
            Review Room <ChevronRight size={14} className="ml-0.5" />
          </Link>
        </div>
      )}

      {/* Week Navigator & Controller */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrevWeek}
              aria-label="Go to previous week"
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {weekTitle}
            </h2>
            <button
              onClick={handleNextWeek}
              aria-label="Go to next week"
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCurrentWeek}
              aria-label="Navigate to current week"
              className="px-3.5 py-1.5 min-h-[44px] border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              This Week
            </button>
          </div>
        </div>

        {/* 7-Day Grid */}
        <div className="grid grid-cols-1 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-700">
          {weekDays.map(day => {
            const dayGoals = goals.filter(g => g.dayDate === day.dateKey);
            const scheduledReviews = reviewsByDate[day.dateKey] || [];
            const dayCompletedGoals = dayGoals.filter(g => g.completed);
            const isAllCompleted = dayGoals.length > 0 && dayGoals.length === dayCompletedGoals.length;

            return (
              <div 
                key={day.dateKey} 
                className={`p-4 flex flex-col justify-between min-h-[360px] ${day.isToday ? 'bg-indigo-50/50 dark:bg-indigo-950/20' : 'bg-white dark:bg-gray-800'}`}
              >
                {/* Day Header */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs uppercase font-bold tracking-wider ${day.isToday ? 'text-indigo-600 dark:text-indigo-400 font-extrabold' : 'text-gray-500 dark:text-gray-400'}`}>
                      {day.dayName}
                    </span>
                    {day.isToday && (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-indigo-600 text-white">
                        Today
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-base font-bold text-gray-900 dark:text-white">
                      {day.formattedDate}
                    </span>
                    {dayGoals.length > 0 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {dayCompletedGoals.length}/{dayGoals.length}
                      </span>
                    )}
                  </div>

                  {/* Scheduled Review Session Indicator */}
                  {scheduledReviews.length > 0 && (
                    <div 
                      className="mb-3 p-2 rounded-lg bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800 text-xs"
                      aria-label={`${scheduledReviews.length} spaced repetition reviews scheduled for ${day.dayName}`}
                    >
                      <div className="flex items-center text-orange-800 dark:text-orange-300 font-semibold mb-1">
                        <RefreshCw size={12} className="mr-1 shrink-0 text-orange-600" />
                        <span>{scheduledReviews.length} SRS Review{scheduledReviews.length > 1 ? 's' : ''}</span>
                      </div>
                      <p className="text-[11px] text-orange-700 dark:text-orange-400 truncate">
                        {scheduledReviews[0].objective || 'Core Concepts'}
                        {scheduledReviews.length > 1 && ` +${scheduledReviews.length - 1} more`}
                      </p>
                    </div>
                  )}

                  {/* Goals List */}
                  <div className="space-y-2 mt-2">
                    {dayGoals.map(goal => {
                      const badge = getCategoryBadge(goal.category);
                      return (
                        <div 
                          key={goal.id} 
                          className={`group p-2.5 rounded-xl border transition-all ${
                            goal.completed 
                              ? 'bg-gray-50 dark:bg-gray-900/60 border-gray-200 dark:border-gray-700/60 opacity-75' 
                              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-700'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleToggleGoal(goal.id)}
                              role="checkbox"
                              aria-checked={goal.completed}
                              aria-label={`Mark "${goal.title}" as ${goal.completed ? 'incomplete' : 'completed'}`}
                              className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 shrink-0 mt-0.5 min-w-[24px] min-h-[24px] flex items-center justify-center focus:outline-none"
                            >
                              {goal.completed ? (
                                <CheckCircle className="h-4 w-4 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                              ) : (
                                <Circle className="h-4 w-4 text-gray-400 hover:text-indigo-600" />
                              )}
                            </button>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-medium leading-snug break-words ${goal.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
                                {goal.title}
                              </p>
                              <div className="flex items-center space-x-1.5 mt-1.5 flex-wrap gap-y-1">
                                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${badge.bg}`}>
                                  {badge.label}
                                </span>
                                <span className="text-[10px] text-gray-400 flex items-center">
                                  <Clock size={10} className="mr-0.5" /> {goal.durationMinutes}m
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteGoal(goal.id)}
                              aria-label={`Delete goal: ${goal.title}`}
                              className="text-gray-300 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 min-h-[24px] min-w-[24px] flex items-center justify-center"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {dayGoals.length === 0 && (
                      <div className="py-6 text-center text-xs text-gray-400 dark:text-gray-500 italic">
                        No goals planned
                      </div>
                    )}
                  </div>
                </div>

                {/* Day Footer Action */}
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/50 flex flex-col gap-2">
                  {isAllCompleted && dayGoals.length > 0 && (
                    <div className="flex items-center justify-center space-x-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 py-1 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg">
                      <Sparkles size={12} />
                      <span>All Set!</span>
                    </div>
                  )}
                  <button
                    onClick={() => openAddGoalModal(day.dateKey)}
                    aria-label={`Add study goal for ${day.dayName}, ${day.formattedDate}`}
                    className="w-full py-2 min-h-[44px] px-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center transition-colors"
                  >
                    <Plus size={14} className="mr-1" /> Add Goal
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Curriculum Presets & Study Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Recommended Goals for Research Methodology
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Quickly append structured curriculum milestones from your syllabus into this week's plan:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SYLLABUS_PRESETS.map((preset, idx) => (
            <div 
              key={idx}
              className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 bg-gray-50/50 dark:bg-gray-900/40 flex flex-col justify-between"
            >
              <div>
                <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${getCategoryBadge(preset.category).bg}`}>
                  {preset.category}
                </span>
                <p className="text-xs font-semibold text-gray-900 dark:text-white mt-2">
                  {preset.title}
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-200/60 dark:border-gray-700/60">
                <span className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center">
                  <Clock size={11} className="mr-1" /> {preset.duration} min
                </span>
                <button
                  onClick={() => {
                    const todayStr = formatDateKey(new Date());
                    const newGoal: StudyGoal = {
                      id: `preset-${Date.now()}-${idx}`,
                      dayDate: todayStr,
                      title: preset.title,
                      category: preset.category,
                      durationMinutes: preset.duration,
                      completed: false,
                      createdAt: new Date().toISOString()
                    };
                    saveGoals([...goals, newGoal]);
                    confetti({ particleCount: 25, spread: 40, origin: { y: 0.8 } });
                  }}
                  aria-label={`Add "${preset.title}" to today's goals`}
                  className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center min-h-[36px] px-2"
                >
                  <Plus size={12} className="mr-1" /> Add to Today
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Goal Creator Modal */}
      {isAddingGoal && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-goal-title"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
              <h3 id="modal-goal-title" className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                <Target className="h-5 w-5 mr-2 text-indigo-600" /> Set Daily Goal
              </h3>
              <button
                onClick={() => setIsAddingGoal(false)}
                aria-label="Close add goal dialog"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 min-h-[36px] min-w-[36px] flex items-center justify-center text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="mt-4 space-y-4">
              <div>
                <label htmlFor="goal-title" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Goal Title or Milestone
                </label>
                <input
                  id="goal-title"
                  type="text"
                  required
                  placeholder="e.g., Read Lesson 3: Research Proposal & Plan"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="goal-day" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Day
                  </label>
                  <select
                    id="goal-day"
                    value={selectedDayForNewGoal}
                    onChange={(e) => setSelectedDayForNewGoal(e.target.value)}
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {weekDays.map(d => (
                      <option key={d.dateKey} value={d.dateKey}>
                        {d.dayName} ({d.formattedDate})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="goal-category" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    id="goal-category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="lesson">Lesson Study</option>
                    <option value="review">SRS Review Session</option>
                    <option value="quiz">Adaptive Quiz</option>
                    <option value="reading">Literature Reading</option>
                    <option value="writing">Proposal Writing</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="goal-duration" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Estimated Time: {newDuration} minutes
                </label>
                <div className="flex items-center space-x-2">
                  {[15, 30, 45, 60].map(mins => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setNewDuration(mins)}
                      aria-label={`Set duration to ${mins} minutes`}
                      className={`flex-1 py-2 min-h-[44px] text-xs font-medium rounded-lg border transition-colors ${
                        newDuration === mins 
                          ? 'bg-indigo-600 text-white border-indigo-600' 
                          : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsAddingGoal(false)}
                  className="px-4 py-2.5 min-h-[44px] text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  aria-label="Save study goal"
                  className="px-5 py-2.5 min-h-[44px] text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
