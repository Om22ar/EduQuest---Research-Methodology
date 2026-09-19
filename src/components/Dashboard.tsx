import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { Lesson } from '../types.ts';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, RefreshCw, Trophy, Activity, Flame, Calendar, ArrowRight, Target } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type HeatmapStat = {
  objective: string;
  proficiency: number;
};

type LeaderboardEntry = {
  userId: number;
  name: string | null;
  email: string;
  totalPoints: number;
};

export default function Dashboard() {
  const { user, getToken } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [heatmapData, setHeatmapData] = useState<HeatmapStat[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        
        // Fetch lessons
        const resLessons = await fetch('/api/lessons', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!resLessons.ok) throw new Error('Failed to fetch lessons');
        const dataLessons = await resLessons.json();
        setLessons(dataLessons);

        // Fetch due reviews
        const resReviews = await fetch('/api/reviews/due', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resReviews.ok) {
          const dataReviews = await resReviews.json();
          setReviewCount(dataReviews.length);
        }

        // Fetch heatmap
        const resHeatmap = await fetch('/api/stats/heatmap', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resHeatmap.ok) {
          const dataHeatmap = await resHeatmap.json();
          setHeatmapData(dataHeatmap);
        }

        // Fetch leaderboard
        const resLeaderboard = await fetch('/api/leaderboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resLeaderboard.ok) {
          const dataLeaderboard = await resLeaderboard.json();
          setLeaderboard(dataLeaderboard);
        }

        // Fetch streak
        const resStreak = await fetch('/api/stats/streak', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resStreak.ok) {
          const dataStreak = await resStreak.json();
          setStreak(dataStreak.streak);
        }

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, getToken]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  const completedCount = lessons.filter(l => l.progress?.status === 'complete').length;
  const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  // Helper to determine color based on proficiency (easeFactor between ~1.3 and 2.5)
  const getProficiencyColor = (proficiency: number) => {
    if (!proficiency) return "bg-gray-200";
    if (proficiency >= 2.4) return "bg-emerald-500";
    if (proficiency >= 2.0) return "bg-emerald-400";
    if (proficiency >= 1.7) return "bg-yellow-400";
    return "bg-orange-500";
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Your Learning Path</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Master research methodology through interactive micro-lessons.</p>
          </div>
          {streak > 0 && (
            <div className="flex items-center space-x-2 bg-orange-100 px-4 py-2 rounded-full border border-orange-200">
              <Flame className="h-5 w-5 text-orange-600" fill="currentColor" />
              <span className="font-bold text-orange-800">{streak} Day Streak</span>
            </div>
          )}
        </div>
        
        {reviewCount > 0 && (
          <div className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between shadow-sm">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="h-10 w-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mr-4">
                <RefreshCw size={20} />
              </div>
              <div>
                <h3 id="review-due-heading" className="text-sm font-bold text-orange-900">Spaced Repetition Review Due</h3>
                <p id="review-due-desc" className="text-sm text-orange-700">You have {reviewCount} {reviewCount === 1 ? 'concept' : 'concepts'} waiting for review.</p>
              </div>
            </div>
            <Link
              to="/review"
              aria-label="Start Spaced Repetition Review Session"
              aria-describedby="review-due-desc"
              className="inline-flex items-center justify-center px-4 py-2 min-h-[44px] border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
            >
              Start Review Session
            </Link>
          </div>
        )}

        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Course Progress</span>
            <span className="text-lg font-bold text-indigo-600">{progressPercent}%</span>
          </div>
          <div 
            className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3"
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Course completion progress"
          >
            <div className="bg-indigo-600 h-3 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-right font-medium">{completedCount} of {lessons.length} lessons completed</p>
        </div>

        {/* Quick Action Cards: Planner & Question Bank */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/30 border border-indigo-100 dark:border-indigo-900 rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex items-start space-x-3.5 mb-4">
              <div className="h-10 w-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                <Calendar size={20} />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Study Planner</h3>
                  <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">New</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                  Set daily goals, plan weekly curriculum milestones, and view upcoming reviews.
                </p>
              </div>
            </div>
            <Link
              to="/planner"
              aria-label="Open Weekly Study Planner"
              className="inline-flex items-center justify-center px-4 py-2 min-h-[40px] border border-transparent rounded-lg shadow-sm text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors w-full"
            >
              Open Planner <ArrowRight size={14} className="ml-1.5" />
            </Link>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-100 dark:border-emerald-900 rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex items-start space-x-3.5 mb-4">
              <div className="h-10 w-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                <BookOpen size={20} />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Official Question Bank</h3>
                  <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">100 Questions</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                  Full syllabus question bank with self-test recall mode, hints, and explanations.
                </p>
              </div>
            </div>
            <Link
              to="/questions"
              aria-label="Explore 100 Official Questions in Question Bank"
              className="inline-flex items-center justify-center px-4 py-2 min-h-[40px] border border-transparent rounded-lg shadow-sm text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors w-full"
            >
              Browse 100 Questions <ArrowRight size={14} className="ml-1.5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Heatmap Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <Activity className="h-5 w-5 text-indigo-500 mr-2" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Skill Heatmap</h2>
          </div>
          <div className="space-y-4">
            {heatmapData.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">Complete reviews to see your proficiency.</p>
            ) : (
              heatmapData.map((stat, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate mr-4">{stat.objective || 'General'}</span>
                  <div className="flex space-x-1 flex-shrink-0">
                    {[1.3, 1.6, 1.9, 2.2, 2.4].map((threshold, dotIdx) => (
                      <div 
                        key={dotIdx} 
                        className={cn(
                          "h-3 w-3 rounded-full", 
                          stat.proficiency >= threshold ? getProficiencyColor(stat.proficiency) : "bg-gray-100 dark:bg-gray-800"
                        )}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Leaderboard</h2>
          </div>
          <div className="space-y-3">
            {leaderboard.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No leaderboard data available.</p>
            ) : (
              leaderboard.map((entry, idx) => (
                <div key={entry.userId} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-100">
                  <div className="flex items-center">
                    <span className={cn(
                      "flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold mr-3",
                      idx === 0 ? "bg-yellow-100 text-yellow-700" :
                      idx === 1 ? "bg-gray-200 text-gray-700 dark:text-gray-300" :
                      idx === 2 ? "bg-orange-100 text-orange-800" :
                      "bg-indigo-50 text-indigo-600"
                    )}>
                      {idx + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[150px]">
                      {entry.name || (entry.email ? entry.email.split('@')[0] : 'Student')}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-indigo-600">
                    {entry.totalPoints || 0} pts
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {lessons.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No lessons available yet. Check back soon!</p>
          </div>
        ) : (
          lessons.map((lesson, idx) => {
            const isCompleted = lesson.progress?.status === 'complete';
            
            return (
              <Link 
                key={lesson.id} 
                to={`/lesson/${lesson.id}`}
                aria-label={`Go to lesson: ${lesson.title}. Status: ${isCompleted ? 'Completed' : 'Start Lesson'}`}
                aria-describedby={`lesson-objectives-${lesson.id}`}
                className="block bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-6 sm:flex sm:items-center sm:justify-between">
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 mt-1 flex items-center justify-center h-10 w-10 rounded-full ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600'}`}>
                      {isCompleted ? <CheckCircle size={20} /> : <span className="font-bold">{idx + 1}</span>}
                    </div>
                    <div className="ml-4">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{lesson.title}</h2>
                      <p id={`lesson-objectives-${lesson.id}`} className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{lesson.objectives}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isCompleted ? 'bg-green-100 text-green-800' : 'bg-indigo-50 text-indigo-700'}`}>
                      {isCompleted ? 'Completed' : 'Start Lesson'}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  );
}
