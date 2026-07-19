import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RiRobot2Line, RiSendPlane2Line, RiCloseLine, RiMessage3Line } from 'react-icons/ri';
import type { Match } from '../types';
import { fetchWithCache } from '../lib/cache';
import stadiumsData from '../data/stadiums.json';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', text: string}[]>([
    { role: 'assistant', text: 'Hi! I am the Stadex AI Assistant. Please wait a moment while my generative AI model loads in your browser.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [modelStatus, setModelStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [progress, setProgress] = useState<number>(0);

  const workerRef = useRef<Worker | null>(null);

  // Data states for dynamic context
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [historyMatches, setHistoryMatches] = useState<Match[]>([]);

  // Fetch real-time data for context
  useEffect(() => {
    const fetchContextData = async () => {
      try {
        const [liveRes, historyRes] = await Promise.all([
          fetchWithCache('/api/matches/live'),
          fetchWithCache('/api/matches/history')
        ]);
        setLiveMatches(liveRes);
        setHistoryMatches(historyRes);
      } catch (err) {
        console.error('Failed to load context for chatbot', err);
      }
    };
    fetchContextData();
  }, []);

  // Initialize Web Worker for AI
  useEffect(() => {
    workerRef.current = new Worker(new URL('../worker.ts', import.meta.url), { type: 'module' });

    workerRef.current.onmessage = (e) => {
      const { status, type, result, progress: progInfo, error } = e.data;
      if (type === 'qa') {
        if (status === 'progress' && progInfo?.progress) {
           setProgress(Math.round(progInfo.progress));
        } else if (status === 'ready') {
           setModelStatus('ready');
           setMessages(prev => [...prev, { role: 'assistant', text: 'My generative AI model is ready! Ask me anything about the tournament, stadiums, or match results.' }]);
        } else if (status === 'complete') {
           setMessages(prev => [...prev, { role: 'assistant', text: result.answer }]);
           setIsLoading(false);
        } else if (status === 'error') {
           console.error("QA Error:", error);
           setMessages(prev => [...prev, { role: 'assistant', text: `Sorry, I encountered an error: ${error}` }]);
           setIsLoading(false);
           setModelStatus('error');
        }
      }
    };

    // Trigger AI model load
    workerRef.current.postMessage({ type: 'qa_load' });

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const handleSend = () => {
    if (!input.trim() || modelStatus !== 'ready' || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    // Build context string for the generative model
    let contextStr = "World Cup 2026 Context:\n";
    if (liveMatches.length > 0) {
      contextStr += `Live Matches: ${liveMatches.map(m => `${m.home} ${m.homeScore}-${m.awayScore} ${m.away}`).join(', ')}.\n`;
    } else {
      contextStr += `No live matches right now.\n`;
    }
    
    if (historyMatches.length > 0) {
      contextStr += `Past Results: ${historyMatches.map(m => `${m.home} ${m.homeScore}-${m.awayScore} ${m.away}`).join(', ')}.\n`;
    }
    
    if (stadiumsData.length > 0) {
      contextStr += `Stadiums include ${stadiumsData.slice(0, 3).map(s => `${s.name} in ${s.city}`).join(', ')}.\n`;
    }

    workerRef.current?.postMessage({
      type: 'qa_query',
      payload: { question: userMessage, context: contextStr }
    });
  };

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
          size="icon"
        >
          <RiMessage3Line className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 md:w-96 shadow-xl flex flex-col h-[500px] z-50">
          <CardHeader className="bg-primary text-primary-foreground flex flex-row items-center justify-between py-3 rounded-t-lg">
            <CardTitle className="text-lg flex items-center gap-2">
              <RiRobot2Line className="h-5 w-5" />
              AI Support
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground h-8 w-8">
              <RiCloseLine className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-white dark:bg-gray-800 border rounded-bl-none text-gray-800 dark:text-gray-200'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {modelStatus === 'loading' && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 border rounded-lg p-3 rounded-bl-none text-xs text-gray-500">
                  Downloading AI Model... {progress}%
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 dark:bg-gray-700">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 border rounded-lg p-3 rounded-bl-none">
                  <div className="flex space-x-1 items-center h-5">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="p-3 border-t bg-white dark:bg-gray-950">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex w-full gap-2">
              <input
                type="text"
                placeholder={modelStatus === 'ready' ? "Type your question..." : "AI Model Loading..."}
                disabled={modelStatus !== 'ready' || isLoading}
                className="flex-1 bg-transparent border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button type="submit" size="icon" disabled={!input.trim() || modelStatus !== 'ready' || isLoading}>
                <RiSendPlane2Line className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
