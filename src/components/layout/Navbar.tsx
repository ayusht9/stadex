import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Moon, Sun, Globe, LogIn, LogOut, Shield, Navigation as NavIcon, Home, MessageSquare, Languages } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function Navbar() {
  const { user, login, logout } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const supportedLanguages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'pt', label: 'Português' },
    { code: 'ar', label: 'العربية' },
    { code: 'ru', label: 'Русский' },
    { code: 'zh', label: '中文' },
    { code: 'ja', label: '日本語' },
    { code: 'it', label: 'Italiano' }
  ];

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-primary" aria-hidden="true" />
              <span className="font-bold text-xl tracking-tight dark:text-white">
                FIFA '26 Assist
              </span>
            </div>
            
            <div className="hidden md:flex space-x-4">
              <Link to="/" className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/' ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                <Home className="h-4 w-4" />
                <span>{t('Dashboard')}</span>
              </Link>
              <Link to="/stadiums" className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/stadiums' ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                <NavIcon className="h-4 w-4" />
                <span>{t('Stadiums')}</span>
              </Link>
              <Link to="/chat" className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/chat' ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                <MessageSquare className="h-4 w-4" />
                <span>{t('Chatbot')}</span>
              </Link>
              {user?.role === 'Staff' && (
                <Link to="/translate" className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/translate' ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                  <Languages className="h-4 w-4" />
                  <span>{t('Translator')}</span>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 mr-2 relative group">
              <Globe className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <select 
                value={i18n.language} 
                onChange={changeLanguage}
                className="bg-transparent text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-0 border-none cursor-pointer p-0 w-24"
              >
                {supportedLanguages.map(l => (
                  <option key={l.code} value={l.code} className="text-black dark:text-black">
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            <div className="border-l border-gray-300 dark:border-gray-600 h-6 mx-2"></div>

            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex flex-col text-right">
                  <span className="text-sm font-medium dark:text-white leading-none">{user.name}</span>
                  <span className="text-xs text-primary font-semibold">{user.role}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md p-1"
                  aria-label="Log out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => login('Fan')}
                  className="flex items-center space-x-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <LogIn className="h-4 w-4" />
                  <span>{t('Fan')}</span>
                </button>
                <button
                  onClick={() => login('Staff')}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-primary text-white rounded-md text-sm font-medium hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  <Shield className="h-4 w-4" />
                  <span>{t('Staff')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
