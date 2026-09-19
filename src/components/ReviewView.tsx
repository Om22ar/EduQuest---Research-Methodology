import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowRight, RefreshCw, Trophy } from 'lucide-react';
import { Question } from '../types.ts';
import confetti from 'canvas-confetti';

export default function ReviewView() {
  const { user, getToken } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Feedback state
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; correctOptionId?: number; hint?: string } | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = await getToken();
        const res = await fetch('/api/reviews/due', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch due reviews');
        const data = await res.json();
        setQuestions(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [getToken]);

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

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">You're all caught up!</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">You've completed all your scheduled reviews for now.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  const handleSubmit = async () => {
    if (selectedOption === null || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const token = await getToken();
      const res = await fetch(`/api/reviews/${currentQuestion.id}/evaluate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answer: selectedOption })
      });

      if (!res.ok) throw new Error('Failed to evaluate review');
      const result = await res.json();
      setFeedback(result);
      
      if (result.isCorrect) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#4ade80', '#22c55e', '#16a34a']
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    setFeedback(null);
    setSelectedOption(null);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Finished
      setQuestions([]); // Will trigger the "caught up" screen
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#4f46e5', '#818cf8', '#c7d2fe']
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <RefreshCw className="mr-2 h-6 w-6 text-orange-500" />
          Review Session
        </h1>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Review {currentIndex + 1} of {questions.length}
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <div 
          className="bg-orange-500 h-2 rounded-full transition-all duration-300" 
          style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
        ></div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
        {currentQuestion.objective && (
          <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full mb-4">
            {currentQuestion.objective}
          </span>
        )}
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">{currentQuestion.prompt}</h3>
        
        <div className="space-y-3">
          {currentQuestion.options?.map((option) => {
            const isSelected = selectedOption === option.id;
            let buttonClass = "w-full text-left px-5 py-4 min-h-[60px] border rounded-xl transition-all duration-200 flex items-center justify-between ";
            let icon = null;

            if (feedback) {
              const isCorrectOption = option.id === feedback.correctOptionId;
              if (isCorrectOption) {
                buttonClass += "bg-green-50 border-green-500 text-green-900";
                icon = <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 ml-2" />;
              } else if (isSelected && !feedback.isCorrect) {
                buttonClass += "bg-red-50 border-red-500 text-red-900";
                icon = <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 ml-2" />;
              } else {
                buttonClass += "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-50";
              }
            } else {
              if (isSelected) {
                buttonClass += "bg-indigo-50 border-indigo-500 text-indigo-900 ring-1 ring-indigo-500";
              } else {
                buttonClass += "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-indigo-300 hover:bg-gray-50 dark:hover:bg-gray-700";
              }
            }

            return (
              <button
                key={option.id}
                disabled={feedback !== null || isSubmitting}
                onClick={() => setSelectedOption(option.id)}
                className={buttonClass}
                aria-label={`Select option: ${option.text}`}
                aria-pressed={isSelected}
              >
                <div className="flex items-center flex-1 min-w-0">
                  <span className="text-sm font-medium break-words">{option.text}</span>
                </div>
                {icon}
              </button>
            );
          })}
        </div>

        {feedback && !feedback.isCorrect && feedback.hint && (
          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h4 className="text-sm font-semibold text-orange-800 mb-1">Hint</h4>
            <p className="text-sm text-orange-700">{feedback.hint}</p>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          {!feedback ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null || isSubmitting}
              aria-label="Check Answer"
              className="inline-flex items-center justify-center px-6 py-3 min-h-[44px] border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              aria-label="Continue to next question"
              className="inline-flex items-center justify-center px-6 py-3 min-h-[44px] border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
