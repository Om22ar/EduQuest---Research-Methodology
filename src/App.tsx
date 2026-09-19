/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import Dashboard from './components/Dashboard.tsx';
import LessonView from './components/LessonView.tsx';
import QuizView from './components/QuizView.tsx';
import Chatbot from './components/Chatbot.tsx';
import ReviewView from './components/ReviewView.tsx';
import StudyPlanner from './components/StudyPlanner.tsx';
import QuestionBank from './components/QuestionBank.tsx';
import StudySummaries from './components/StudySummaries.tsx';
import { Moon, Sun, Calendar, LayoutDashboard, RefreshCw, BookOpen, Layers, BookMarked } from 'lucide-react';

type Theme = 'light' | 'dark';
type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function Login() {
  const { user, signIn, loading } = useAuth();
  
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
             <span className="text-3xl font-bold text-white transform -rotate-3">EQ</span>
          </div>
        </div>
        <h2 className="mt-8 text-center text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Welcome to EduQuest
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Sign in to master research methodology
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100 dark:border-gray-700">
          <button
            onClick={signIn}
            aria-label="Sign in with Google"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-200 text-gray-900 dark:text-gray-100">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 transition-colors duration-200" aria-label="Main Navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-6">
              <Link to="/" className="flex items-center space-x-3 focus:outline-none" aria-label="EduQuest Home">
                <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm" aria-hidden="true">
                   <span className="text-white font-bold text-sm">EQ</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">EduQuest</span>
              </Link>
              {user && (
                <div className="hidden sm:flex items-center space-x-1 sm:space-x-2">
                  <Link
                    to="/"
                    aria-label="Dashboard"
                    className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold min-h-[36px] transition-colors ${
                      location.pathname === '/' 
                        ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <LayoutDashboard size={15} className="mr-1.5" />
                    Dashboard
                  </Link>
                  <Link
                    to="/planner"
                    aria-label="Weekly Study Planner"
                    className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold min-h-[36px] transition-colors ${
                      location.pathname === '/planner' 
                        ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Calendar size={15} className="mr-1.5" />
                    Study Planner
                  </Link>
                  <Link
                    to="/review"
                    aria-label="Review Sessions"
                    className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold min-h-[36px] transition-colors ${
                      location.pathname === '/review' 
                        ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <RefreshCw size={14} className="mr-1.5" />
                    Review Room
                  </Link>
                  <Link
                    to="/questions"
                    aria-label="Official Question Bank"
                    className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold min-h-[36px] transition-colors ${
                      location.pathname === '/questions' || location.pathname === '/bank'
                        ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <BookOpen size={14} className="mr-1.5" />
                    Question Bank (100)
                  </Link>
                  <Link
                    to="/flashcards"
                    aria-label="Flashcard Mode"
                    className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold min-h-[36px] transition-colors ${
                      location.pathname === '/flashcards'
                        ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Layers size={14} className="mr-1.5 text-indigo-500" />
                    Flashcards
                  </Link>
                  <Link
                    to="/summaries"
                    aria-label="Study Summaries Workspace"
                    className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold min-h-[36px] transition-colors ${
                      location.pathname === '/summaries' || location.pathname === '/notes'
                        ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <BookMarked size={14} className="mr-1.5 text-amber-500" />
                    ملخصات المذاكرة
                  </Link>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4 sm:space-x-6">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              {user && (
                <div className="flex items-center space-x-4 sm:space-x-6">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300 hidden md:block">{user.email}</span>
                  <button 
                    onClick={logout}
                    aria-label="Log out of EduQuest"
                    className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors min-h-[44px] px-2 flex items-center"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      {/* Mobile Sub-Navigation Bar */}
      {user && (
        <div className="sm:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-around">
          <Link
            to="/"
            className={`text-xs font-semibold px-3 py-2 rounded-md flex items-center min-h-[44px] ${
              location.pathname === '/' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            <LayoutDashboard size={16} className="mr-1" />
            Dashboard
          </Link>
          <Link
            to="/planner"
            className={`text-xs font-semibold px-3 py-2 rounded-md flex items-center min-h-[44px] ${
              location.pathname === '/planner' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            <Calendar size={16} className="mr-1" />
            Planner
          </Link>
          <Link
            to="/review"
            className={`text-xs font-semibold px-3 py-2 rounded-md flex items-center min-h-[44px] ${
              location.pathname === '/review' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            <RefreshCw size={15} className="mr-1" />
            Review
          </Link>
          <Link
            to="/questions"
            className={`text-xs font-semibold px-2 py-2 rounded-md flex items-center min-h-[44px] ${
              location.pathname === '/questions' || location.pathname === '/bank' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            <BookOpen size={15} className="mr-1" />
            Bank
          </Link>
          <Link
            to="/flashcards"
            className={`text-xs font-semibold px-2 py-2 rounded-md flex items-center min-h-[44px] ${
              location.pathname === '/flashcards' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            <Layers size={15} className="mr-1" />
            Cards
          </Link>
          <Link
            to="/summaries"
            className={`text-xs font-semibold px-2 py-2 rounded-md flex items-center min-h-[44px] ${
              location.pathname === '/summaries' || location.pathname === '/notes' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            <BookMarked size={15} className="mr-1 text-amber-500" />
            ملخصات
          </Link>
        </div>
      )}
      <main className="pb-16">
        {children}
      </main>
      <Chatbot />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/planner" element={<ProtectedRoute><StudyPlanner /></ProtectedRoute>} />
              <Route path="/questions" element={<ProtectedRoute><QuestionBank /></ProtectedRoute>} />
              <Route path="/bank" element={<ProtectedRoute><QuestionBank /></ProtectedRoute>} />
              <Route path="/flashcards" element={<ProtectedRoute><QuestionBank initialMode="flashcard" /></ProtectedRoute>} />
              <Route path="/summaries" element={<ProtectedRoute><StudySummaries /></ProtectedRoute>} />
              <Route path="/notes" element={<ProtectedRoute><StudySummaries /></ProtectedRoute>} />
              <Route path="/lesson/:id" element={<ProtectedRoute><LessonView /></ProtectedRoute>} />
              <Route path="/lesson/:id/quiz" element={<ProtectedRoute><QuizView /></ProtectedRoute>} />
              <Route path="/review" element={<ProtectedRoute><ReviewView /></ProtectedRoute>} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
