import { useState, useEffect, useRef } from 'react';
import { Languages, ArrowRightLeft, Volume2, Copy, Loader2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Translator() {
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [srcLang, setSrcLang] = useState('eng_Latn');
  const [tgtLang, setTgtLang] = useState('spa_Latn');
  
  const [status, setStatus] = useState<'idle' | 'loading_model' | 'ready' | 'translating'>('idle');
  const [progress, setProgress] = useState(0);
  
  const worker = useRef<Worker | null>(null);

  const languages = [
    { code: 'eng_Latn', name: 'English' },
    { code: 'spa_Latn', name: 'Spanish' },
    { code: 'fra_Latn', name: 'French' },
    { code: 'por_Latn', name: 'Portuguese' },
    { code: 'deu_Latn', name: 'German' },
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

  const swapLanguages = () => {
    const temp = srcLang;
    setSrcLang(tgtLang);
    setTgtLang(temp);
    
    if (outputText) {
      setInputText(outputText);
      setOutputText('');
    }
  };

  if (user?.role !== 'Staff') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <ShieldAlert className="h-16 w-16 mx-auto text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Staff Access Required</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">The multilingual translator tool is restricted to venue staff and volunteers.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center">
          <Languages className="mr-3 h-8 w-8 text-primary" />
          Multilingual Staff Assistant
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          On-device NLLB-200 translation model. Provides secure, offline-capable translations for fan assistance.
        </p>
      </div>

      {status === 'loading_model' && (
        <div className="bg-primary/10 p-4 rounded-xl border border-primary/20 flex items-center justify-between mb-6">
          <div className="flex items-center text-primary font-medium">
            <Loader2 className="animate-spin mr-2 h-5 w-5" />
            Loading NLLB Translation Model...
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
            onClick={swapLanguages}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
            title="Swap languages"
          >
            <ArrowRightLeft className="h-5 w-5" />
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
              className="flex-1 w-full resize-none border-none focus:ring-0 bg-transparent text-lg text-gray-900 dark:text-white placeholder-gray-400"
            ></textarea>
            <div className="flex justify-between items-center mt-4">
              <span className="text-xs text-gray-400">{inputText.length} characters</span>
              <button 
                onClick={handleTranslate}
                disabled={status !== 'ready' || !inputText.trim()}
                className="px-6 py-2 bg-primary text-white font-medium rounded-full hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {status === 'translating' ? <Loader2 className="animate-spin h-5 w-5" /> : 'Translate'}
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
                <p className="text-lg text-gray-900 dark:text-white whitespace-pre-wrap">{outputText}</p>
              )}
            </div>
            
            {outputText && (
              <div className="flex justify-end space-x-2 mt-4 text-gray-400">
                <button className="p-2 hover:text-primary transition-colors rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" title="Listen">
                  <Volume2 className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => navigator.clipboard.writeText(outputText)}
                  className="p-2 hover:text-primary transition-colors rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" 
                  title="Copy"
                >
                  <Copy className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


