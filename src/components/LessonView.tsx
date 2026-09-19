import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { Lesson } from '../types.ts';
import { ArrowLeft, BookOpen, ChevronRight } from 'lucide-react';

export default function LessonView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`/api/lessons/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch lesson details');
        const data = await res.json();
        setLesson(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [id, getToken]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 text-center">
        <div className="text-red-500 mb-4">{error || 'Lesson not found'}</div>
        <Link 
          to="/" 
          aria-label="Back to Dashboard" 
          className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center min-h-[44px]"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Link to="/" aria-label="Back to Dashboard" className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-white mb-6 transition-colors min-h-[44px]">
        <ArrowLeft size={16} className="mr-1" /> Dashboard
      </Link>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center space-x-2 text-indigo-600 mb-4">
            <BookOpen size={20} />
            <span className="text-sm font-semibold tracking-wider uppercase">Lesson {lesson.orderIndex}</span>
          </div>
          
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">{lesson.title}</h1>
          
          <div className="bg-indigo-50 rounded-xl p-5 mb-8 border border-indigo-100">
            <h3 className="text-sm font-semibold text-indigo-900 uppercase tracking-wider mb-2">Learning Objectives</h3>
            <p id="lesson-objectives" className="text-indigo-800 text-sm leading-relaxed">{lesson.objectives}</p>
          </div>
          
          <div 
            className="prose prose-indigo max-w-none text-gray-700 dark:text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: lesson.contentHtml }}
          />
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-900 px-8 py-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between">
          <p id="quiz-ready-prompt" className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
            Ready to test your knowledge?
          </p>
          <button 
            onClick={() => navigate(`/lesson/${lesson.id}/quiz`)}
            aria-label={`Take quiz for ${lesson.title}`}
            aria-describedby="quiz-ready-prompt lesson-objectives"
            className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 min-h-[44px] border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-colors"
          >
            Take the Quiz <ChevronRight size={18} className="ml-2 -mr-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
