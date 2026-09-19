import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, User as UserIcon, Bot, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function Chatbot() {
  const { getToken, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: 'Hello! I am your AI Tutor for Research Methodology. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || !user) return;

    const userMsg = input.trim();
    setInput('');
    const newHistory = [...messages, { role: 'user', content: userMsg } as Message];
    setMessages(newHistory);
    setLoading(true);

    try {
      const token = await getToken();
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          history: messages.map(m => ({ role: m.role, content: m.content })),
          message: userMsg 
        })
      });

      if (!res.ok) throw new Error('Failed to send message');
      
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'model', content: data.text }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 p-4 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-all duration-300 z-40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
          isOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"
        )}
        aria-label="Open AI Tutor"
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-6 right-6 w-full max-w-sm sm:max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden transition-all duration-300 z-50 origin-bottom-right",
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        )}
        style={{ height: '600px', maxHeight: 'calc(100vh - 48px)' }}
      >
        {/* Header */}
        <div className="bg-indigo-600 p-4 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center space-x-2">
            <Bot size={20} />
            <h3 className="font-semibold text-lg">AI Tutor</h3>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-full hover:bg-indigo-700 transition-colors focus:outline-none"
            aria-label="Close chat"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={cn(
                "flex max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div 
                className={cn(
                  "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
                  msg.role === 'user' ? "bg-indigo-100 text-indigo-600 ml-3" : "bg-gray-200 text-gray-700 dark:text-gray-300 mr-3"
                )}
              >
                {msg.role === 'user' ? <UserIcon size={16} /> : <Bot size={16} />}
              </div>
              {msg.role === 'user' ? (
                <div 
                  className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed bg-indigo-600 text-white rounded-tr-none"
                >
                  {msg.content}
                </div>
              ) : (
                <div 
                  className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none shadow-sm prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>') }}
                />
              )}
            </div>
          ))}
          {loading && (
            <div className="flex mr-auto max-w-[85%]">
               <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 text-gray-700 dark:text-gray-300 mr-3 flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-tl-none shadow-sm flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shrink-0">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about research methodology..."
              className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-shadow"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-1.5 p-2 rounded-full text-indigo-600 hover:bg-indigo-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors focus:outline-none"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
