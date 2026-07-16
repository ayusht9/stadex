import { useState, useRef, useEffect } from 'react';
import { RiTranslate2, RiArrowLeftRightLine, RiVolumeUpLine, RiFileCopyLine, RiLoader4Line, RiShieldKeyholeLine } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';

export function Translator() {
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [srcLang, setSrcLang] = useState('en');
  const [tgtLang, setTgtLang] = useState('es');
  
  const [status, setStatus] = useState<'idle' | 'loading_model' | 'ready' | 'translating'>('idle');
  const [progress, setProgress] = useState(0);
  
  const worker = useRef<Worker | null>(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'de', name: 'German' },
  ];

  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(new URL('../worker.ts', import.meta.url), {
        type: 'module'
      });

      worker.current.addEventListener('message', (e) => {
        const { status, type, result, progress: progData } = e.data;
        if (type !== 'translate') return;

        switch (status) {
          case 'progress':
            if (progData.progress) setProgress(progData.progress);
            break;
          case 'ready':
            setStatus('ready');
            break;
          case 'complete':
            if (result && result.length > 0) {
              setOutputText(result[0].translation_text);
            }
            setStatus('ready');
            break;
          case 'error':
            console.error("Worker error:", e.data.error);
            setOutputText("Error during translation.");
            setStatus('ready');
            break;
        }
      });
      
      setStatus('loading_model');
      worker.current.postMessage({ type: 'translate_load' });
    }

    return () => {
      if (worker.current) {
        worker.current.terminate();
        worker.current = null;
      }
    };
  }, []);

  const handleTranslate = () => {
    if (!inputText.trim() || status !== 'ready') return;
    
    setStatus('translating');
    worker.current?.postMessage({
      type: 'translate_query',
      payload: {
        text: inputText,
        src_lang: srcLang,
        tgt_lang: tgtLang
      }
    });
  };

  if (user?.role !== 'Staff') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="flex items-center justify-center space-x-2 text-yellow-800 dark:text-yellow-200 mb-2">
          <RiShieldKeyholeLine className="h-8 w-8 text-red-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Staff Access Required</h2>
        </div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">The multilingual translator tool is restricted to venue staff and volunteers.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center">
          <RiTranslate2 className="mr-3 h-8 w-8 text-primary" />
          Multilingual Staff Assistant
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          On-device M2M100 translation model. Provides secure, offline-capable translations for fan assistance.
        </p>
      </div>

      {status === 'loading_model' && (
        <div className="bg-primary/10 p-4 rounded-xl border border-primary/20 flex items-center justify-between mb-6">
          <div className="flex items-center text-primary font-medium">
            <RiLoader4Line className="animate-spin mr-2 h-5 w-5" />
            Loading M2M100 Translation Model...
          </div>
          <div className="w-1/3 bg-white/50 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
            <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Controls */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <select 
            value={srcLang} 
            onChange={(e) => setSrcLang(e.target.value)}
            className="block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white py-2"
          >
            {languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
          
          <button
              onClick={() => {
                const temp = srcLang;
                setSrcLang(tgtLang);
                setTgtLang(temp);
              }}
              className="p-2 rounded-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              title="Swap languages"
            >
              <RiArrowLeftRightLine className="h-5 w-5" />
            </button>
          
          <select 
            value={tgtLang} 
            onChange={(e) => setTgtLang(e.target.value)}
            className="block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white py-2"
          >
            {languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
        </div>

        {/* Translation Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-700">
          <div className="p-4 flex flex-col h-64">
            <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text to translate..."
            className="w-full h-32 p-4 bg-transparent border-none focus:ring-0 resize-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            <button className="p-2 text-gray-400 hover:text-primary transition-colors">
              <RiVolumeUpLine className="h-5 w-5" />
            </button>
            <button 
                onClick={handleTranslate}
                disabled={status !== 'ready' || !inputText.trim()}
                className="px-6 py-2 bg-primary text-white font-medium rounded-full hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {status === 'translating' ? <RiLoader4Line className="animate-spin h-5 w-5" /> : 'Translate'}
              </button>
            </div>
          </div>
          
          <div className="p-4 flex flex-col h-64 bg-gray-50 dark:bg-gray-900/30">
            <div className="flex-1 overflow-y-auto">
              {status === 'translating' ? (
                <div className="flex items-center space-x-2 text-gray-500 animate-pulse">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animation-delay-200"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animation-delay-400"></div>
                </div>
              ) : (
                <textarea
                  value={outputText}
                  readOnly
                  placeholder="Translation will appear here..."
                  className="w-full h-32 p-4 bg-transparent border-none focus:ring-0 resize-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              )}
            </div>
            
            <div className="flex justify-start space-x-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
              <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                <RiVolumeUpLine className="h-5 w-5" />
              </button>
              <button 
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                onClick={() => navigator.clipboard.writeText(outputText)}
                title="Copy to clipboard"
              >
                <RiFileCopyLine className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


