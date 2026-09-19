import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { Quiz, Question, QuizSubmissionResult } from '../types.ts';
import { ArrowLeft, CheckCircle, XCircle, ChevronRight, RefreshCw } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import confetti from 'canvas-confetti';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function QuizView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  
  const [quiz, setQuiz] = useState<(Quiz & { questions: Question[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [answers, setAnswers] = useState<Record<number, number | string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizSubmissionResult | null>(null);
  
  // Adaptive State
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; correctOptionId?: number; hint?: string } | null>(null);
  const [masteredObjectives, setMasteredObjectives] = useState<Set<string>>(new Set());
  const [currentObjective, setCurrentObjective] = useState<string>('');
  const [currentDifficulty, setCurrentDifficulty] = useState<number>(1);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  // Group questions by objective
  const questionsByObjective = useMemo(() => {
    if (!quiz) return {};
    const grouped: Record<string, Question[]> = {};
    quiz.questions.forEach(q => {
      const obj = q.objective || 'General';
      if (!grouped[obj]) grouped[obj] = [];
      grouped[obj].push(q);
    });
    return grouped;
  }, [quiz]);

  const objectives = useMemo(() => Object.keys(questionsByObjective), [questionsByObjective]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`/api/lessons/${id}/quiz`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to load quiz or quiz does not exist.');
        const data = await res.json();
        setQuiz(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id, getToken]);

  // Initialize first question
  useEffect(() => {
    if (quiz && objectives.length > 0 && !currentQuestion && !result) {
      startNextObjective();
    }
  }, [quiz, objectives, currentQuestion, result]);

  const startNextObjective = () => {
    const nextObj = objectives.find(obj => !masteredObjectives.has(obj));
    if (nextObj) {
      setCurrentObjective(nextObj);
      setCurrentDifficulty(1);
      pickQuestion(nextObj, 1);
    } else {
      // All objectives mastered or attempted, submit quiz
      handleFinalSubmit();
    }
  };

  const pickQuestion = (objective: string, difficulty: number) => {
    const pool = questionsByObjective[objective] || [];
    // Try to find a question at exact difficulty that hasn't been answered yet
    let q = pool.find(q => q.difficulty === difficulty && answers[q.id] === undefined);
    
    // If not found, try to find any unanswered question in this objective
    if (!q) {
      q = pool.find(q => answers[q.id] === undefined);
    }

    if (q) {
      setCurrentQuestion(q);
      setCurrentDifficulty(q.difficulty ?? 1);
    } else {
      // No more questions for this objective, consider it done
      setMasteredObjectives(prev => new Set(prev).add(objective));
      setTimeout(startNextObjective, 0);
    }
  };

  const handleOptionSelect = (questionId: number, optionId: number) => {
    if (feedback) return; // Prevent changing answer after evaluation
    
    // Tactile feedback for mobile users
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleTextChange = (questionId: number, text: string) => {
    if (feedback) return;
    setAnswers(prev => ({ ...prev, [questionId]: text }));
  };

  const handleCheckAnswer = async () => {
    if (!currentQuestion || answers[currentQuestion.id] === undefined || submitting) return;
    setSubmitting(true);
    
    try {
      const token = await getToken();
      const res = await fetch(`/api/questions/${currentQuestion.id}/evaluate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answer: answers[currentQuestion.id] })
      });
      
      if (!res.ok) throw new Error('Failed to evaluate');
      const data = await res.json();
      setFeedback(data);
      setQuestionsAnswered(prev => prev + 1);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (!currentQuestion || !feedback) return;
    
    const wasCorrect = feedback.isCorrect;
    setFeedback(null);

    if (wasCorrect) {
      // Try to find harder question
      const pool = questionsByObjective[currentObjective] || [];
      const harderExists = pool.some(q => (q.difficulty ?? 1) > currentDifficulty && answers[q.id] === undefined);
      
      if (harderExists) {
        pickQuestion(currentObjective, currentDifficulty + 1);
      } else {
        // Mastered this objective!
        setMasteredObjectives(prev => new Set(prev).add(currentObjective));
        startNextObjective();
      }
    } else {
      // Try to find easier question
      pickQuestion(currentObjective, Math.max(1, currentDifficulty - 1));
    }
  };

  const handleFinalSubmit = async () => {
    if (!quiz) return;
    setSubmitting(true);
    try {
      const token = await getToken();
      const res = await fetch(`/api/quizzes/${quiz.id}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answers })
      });
      if (!res.ok) throw new Error('Failed to submit quiz');
      const data = await res.json();
      setResult(data);

      if (data.score >= 90) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#4ade80', '#22c55e', '#16a34a', '#fbbf24', '#f59e0b']
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setResult(null);
    setAnswers({});
    setMasteredObjectives(new Set());
    setFeedback(null);
    setCurrentQuestion(null);
    setQuestionsAnswered(0);
    // Let the useEffect pick the first question again
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 text-center">
        <div className="text-red-500 mb-4">{error || 'Quiz not found'}</div>
        <Link 
          to={`/lesson/${id}`} 
          aria-label="Back to Lesson"
          className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center min-h-[44px]"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Lesson
        </Link>
      </div>
    );
  }

  if (result) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden text-center p-10">
          <div className="mb-6 flex justify-center">
            {result.score >= 90 ? (
              <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            ) : (
              <div className="h-24 w-24 bg-orange-100 rounded-full flex items-center justify-center">
                <RefreshCw className="h-12 w-12 text-orange-600" />
              </div>
            )}
          </div>
          <h2 id="result-heading" className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {result.score >= 90 ? 'Mastery Achieved!' : 'Keep Learning'}
          </h2>
          <p id="result-description" className="text-gray-600 dark:text-gray-400 mb-8">
            You scored <span className="font-bold text-gray-900 dark:text-white">{result.score}%</span> on the {quiz.title} assessment.
            {result.score >= 90 
              ? ' Outstanding work! You have successfully mastered these concepts.' 
              : ' Review the lesson material and try again to reach the 90% mastery threshold.'}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {result.score < 90 && (
              <button
                onClick={resetQuiz}
                aria-label={`Retry ${quiz.title} assessment`}
                aria-describedby="result-description"
                className="inline-flex justify-center items-center px-6 py-3 min-h-[44px] border border-gray-300 dark:border-gray-600 text-base font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <RefreshCw size={18} className="mr-2" /> Retry Quiz
              </button>
            )}
            <Link
              to="/"
              aria-label="Continue to Dashboard"
              aria-describedby="result-description"
              className="inline-flex justify-center items-center px-6 py-3 min-h-[44px] border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm"
            >
              Continue to Dashboard <ChevronRight size={18} className="ml-2 -mr-1" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const progressPercent = objectives.length > 0 ? Math.round((masteredObjectives.size / objectives.length) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
       <Link to={`/lesson/${id}`} aria-label="Back to Lesson" className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-white mb-6 transition-colors min-h-[44px]">
        <ArrowLeft size={16} className="mr-1" /> Back to Lesson
      </Link>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Progress header */}
        <div className="bg-gray-50 dark:bg-gray-900 px-8 py-4 border-b border-gray-200 dark:border-gray-700">
           <div className="flex justify-between items-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
             <span className="font-semibold text-gray-700 dark:text-gray-300">{quiz.title}</span>
             <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs">Difficulty Level {currentDifficulty}</span>
           </div>
           <div 
             className="w-full bg-gray-200 rounded-full h-2"
             role="progressbar"
             aria-valuenow={progressPercent}
             aria-valuemin={0}
             aria-valuemax={100}
             aria-label="Quiz progress"
           >
            <div className="bg-indigo-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <p id="quiz-progress-text" className="text-xs text-gray-400 mt-2 text-right">{masteredObjectives.size} of {objectives.length} objectives mastered</p>
        </div>

        {/* Question Area */}
        <div className="p-8 min-h-[300px]">
          <span id="current-objective-badge" className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full mb-4">
            {currentObjective}
          </span>
          <h2 id={`question-prompt-${currentQuestion.id}`} className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-8 leading-relaxed break-words">
            {currentQuestion.prompt}
          </h2>

          <div className="space-y-3" role="radiogroup" aria-labelledby={`question-prompt-${currentQuestion.id}`}>
            {currentQuestion.type === 'mcq' && currentQuestion.options.map(option => {
              const isSelected = answers[currentQuestion.id] === option.id;
              let buttonClass = "w-full text-left px-5 py-4 min-h-[60px] rounded-xl border-2 transition-all duration-200 break-words flex items-center justify-between ";
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
                  buttonClass += "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-500";
                } else {
                  buttonClass += "border-gray-200 dark:border-gray-700 hover:border-indigo-200 hover:bg-gray-50 dark:hover:bg-gray-700";
                }
              }
              return (
                <button
                  key={option.id}
                  disabled={feedback !== null || submitting}
                  onClick={() => handleOptionSelect(currentQuestion.id, option.id)}
                  className={buttonClass}
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`Option: ${option.text}`}
                  aria-describedby={`question-prompt-${currentQuestion.id}`}
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <div className={cn(
                      "flex-shrink-0 h-5 w-5 rounded-full border-2 mr-4 flex items-center justify-center",
                      isSelected && !feedback ? "border-indigo-600" : "border-gray-300 dark:border-gray-600"
                    )}>
                      {isSelected && !feedback && <div className="h-2.5 w-2.5 rounded-full bg-indigo-600" />}
                    </div>
                    <span className={cn("text-base break-words", isSelected && !feedback ? "text-indigo-900 font-medium" : "text-gray-700 dark:text-gray-300")}>
                      {option.text}
                    </span>
                  </div>
                  {icon}
                </button>
              )
            })}
            
            {currentQuestion.type !== 'mcq' && (
              <input 
                type="text"
                disabled={feedback !== null || submitting}
                placeholder="Type your answer here..."
                aria-label="Your answer to the question"
                aria-describedby={`question-prompt-${currentQuestion.id}`}
                className="w-full px-5 py-4 min-h-[60px] rounded-xl border-2 border-gray-300 dark:border-gray-600 focus:border-indigo-600 focus:ring-0 transition-colors text-lg"
                value={(answers[currentQuestion.id] as string) || ''}
                onChange={(e) => handleTextChange(currentQuestion.id, e.target.value)}
              />
            )}
          </div>
          
          {feedback && !feedback.isCorrect && feedback.hint && (
            <div id="quiz-hint" className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="text-sm font-semibold text-orange-800 mb-1">Hint</h4>
              <p className="text-sm text-orange-700">{feedback.hint}</p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="bg-gray-50 dark:bg-gray-900 px-8 py-5 border-t border-gray-200 dark:border-gray-700 flex justify-end items-center">
          {!feedback ? (
            <button
              onClick={handleCheckAnswer}
              disabled={submitting || answers[currentQuestion.id] === undefined}
              aria-label="Check Answer"
              aria-describedby={`question-prompt-${currentQuestion.id}`}
              className="inline-flex justify-center items-center px-6 py-2.5 min-h-[44px] border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Checking...' : 'Check Answer'}
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              aria-label="Continue to next question"
              aria-describedby={feedback && !feedback.isCorrect && feedback.hint ? "quiz-hint" : undefined}
              className="inline-flex justify-center items-center px-6 py-2.5 min-h-[44px] border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Continue <ChevronRight size={16} className="ml-2 -mr-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
