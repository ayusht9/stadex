import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { RiMoonLine, RiSunLine, RiGlobalLine, RiLoginBoxLine, RiLogoutBoxLine, RiShieldKeyholeLine, RiNavigationLine, RiHome4Line, RiTranslate2, RiFootballLine, RiQuestionAnswerLine } from 'react-icons/ri';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'pt', name: 'Português' },
  { code: 'it', name: 'Italiano' },
  { code: 'ar', name: 'العربية' },
  { code: 'ru', name: 'Русский' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' }
];

export function Navbar() {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { t, i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  };

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <img src="/icon.png" alt="Stadex Logo" className="h-8 w-8 object-contain" />
              <span className="font-bold text-xl tracking-tight dark:text-white">
                Stadex
              </span>
            </div>
            
            <div className="hidden md:flex space-x-4">
              <Link to="/" className={`flex items-center space-x-1 px-3 py-2 rounded-sm text-sm font-medium ${location.pathname === '/' ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                <RiHome4Line className="h-4 w-4" />
                <span>{t('Dashboard')}</span>
              </Link>
              <Link to="/matches" className={`flex items-center space-x-1 px-3 py-2 rounded-sm text-sm font-medium ${location.pathname === '/matches' ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                <RiFootballLine className="h-4 w-4" />
                <span>Matches</span>
              </Link>
              <Link to="/stadiums" className={`flex items-center space-x-1 px-3 py-2 rounded-sm text-sm font-medium ${location.pathname === '/stadiums' ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                <RiNavigationLine className="h-4 w-4" />
                <span>{t('Stadiums')}</span>
              </Link>
              <Link to="/help" className={`flex items-center space-x-1 px-3 py-2 rounded-sm text-sm font-medium ${location.pathname === '/help' ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                <RiQuestionAnswerLine className="h-4 w-4" />
                <span>Help & FAQ</span>
              </Link>
              <Link to="/translate" className={`flex items-center space-x-1 px-3 py-2 rounded-sm text-sm font-medium ${location.pathname === '/translate' ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                <RiTranslate2 className="h-4 w-4" />
                <span>Translator</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-2 rounded-sm text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors flex items-center"
                  title="Change Language"
                >
                  <RiGlobalLine className="h-5 w-5" />
                  <span className="ml-1 text-xs font-medium uppercase">{i18n.language}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {LANGUAGES.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={i18n.language === lang.code ? "bg-gray-100 dark:bg-gray-800 font-bold" : ""}
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-sm text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'light' ? <RiMoonLine className="h-5 w-5" /> : <RiSunLine className="h-5 w-5" />}
            </button>
            
            <div className="border-l border-gray-200 dark:border-gray-700 h-6 mx-2"></div>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex flex-col text-right hidden sm:block">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</span>
                  <span className="text-xs text-primary font-semibold flex items-center justify-end">
                    {user.role === 'Staff' && <RiShieldKeyholeLine className="mr-1 h-3 w-3" />}
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 px-3 py-2 rounded-sm text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                >
                  <RiLogoutBoxLine className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1 px-4 py-2 rounded-sm text-sm font-medium bg-primary text-white hover:bg-opacity-90 transition-colors shadow-sm"
              >
                <RiLoginBoxLine className="h-4 w-4" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
