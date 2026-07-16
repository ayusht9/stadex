import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I am your AI Stadium Assistant. Ask me questions about stadium locations, capacity, or general tournament info.",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading_model' | 'ready' | 'thinking'>('idle');
  const [progress, setProgress] = useState(0);
  
  const worker = useRef<Worker | null>(null);

  // Define the context we pass to the QA model
  const stadiumContext = "The FIFA World Cup 2026 will be hosted across 16 cities in North America. MetLife Stadium in New York/New Jersey has a capacity of 82,500 and will host the final match. Estadio Azteca in Mexico City has a capacity of 83,264 and is a historic venue hosting the opening match. BMO Field in Toronto is Canada's national soccer stadium with 30,000 capacity. AT&T Stadium in Dallas has 80,000 capacity and features one of the largest high definition video screens. SoFi Stadium is in Los Angeles.";

  useEffect(() => {
    // Initialize Web Worker
    if (!worker.current) {
      worker.current = new Worker(new URL('../worker.ts', import.meta.url), {
        type: 'module'
      });

      worker.current.addEventListener('message', (e) => {
        const { status, type, result, progress: progData } = e.data;
        if (type !== 'qa') return;

        switch (status) {
          case 'progress':
            if (progData.progress) {
              setProgress(progData.progress);
            }
            break;
          case 'ready':
            setStatus('ready');
            break;
          case 'complete':
            setMessages(prev => [...prev, {
              id: Date.now(),
              text: result.answer,
              sender: 'bot',
              timestamp: new Date()
            }]);
            setStatus('ready');
            break;
          case 'error':
            console.error("Worker error:", e.data.error);
            setMessages(prev => [...prev, {
              id: Date.now(),
              text: "Sorry, I encountered an error while processing your request.",
              sender: 'bot',
              timestamp: new Date()
            }]);
            setStatus('ready');
            break;
        }
      });
      
      setStatus('loading_model');
      worker.current.postMessage({ type: 'qa_load' });
    }

    return () => {
      if (worker.current) {
        worker.current.terminate();
        worker.current = null;
      }
    };
  }, []);

  const handleSend = () => {
    if (!input.trim() || status !== 'ready') return;
    
    const userMsg: Message = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setStatus('thinking');
    
    worker.current?.postMessage({
      type: 'qa_query',
      payload: {
        question: userMsg.text,
        context: stadiumContext
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Fan Chat & Q&A
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Powered by on-device Generative AI. No data leaves your browser.
        </p>
      </div>

      <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`p-2 rounded-full flex-shrink-0 ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'}`}>
                {msg.sender === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
              </div>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                msg.sender === 'user' 
                  ? 'bg-primary text-white rounded-tr-none' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-none'
              }`}>
                <p>{msg.text}</p>
                <span className={`text-[10px] mt-1 block ${msg.sender === 'user' ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          {status === 'thinking' && (
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
                <Bot className="h-5 w-5" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-tl-none px-4 py-3 flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Loading Indicator */}
        {status === 'loading_model' && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 border-t border-blue-100 dark:border-blue-800 flex items-center justify-between">
            <div className="flex items-center text-blue-700 dark:text-blue-300 text-sm font-medium">
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Loading AI Model into browser memory...
            </div>
            <div className="w-1/3 bg-blue-200 dark:bg-blue-800 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center space-x-2 relative"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={status === 'ready' ? "Ask about stadiums..." : "Please wait..."}
              disabled={status !== 'ready'}
              className="flex-1 rounded-full border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:text-sm py-3 pl-4 pr-12 border disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || status !== 'ready'}
              className="absolute right-2 p-2 rounded-full bg-primary text-white hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
