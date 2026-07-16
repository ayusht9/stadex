import React from 'react';
import { Calendar, Radio, Newspaper } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Dashboard() {
  const { user } = useAuth();

  const newsItems = [
    { id: 1, title: 'Final preparations underway at MetLife Stadium', time: '2 hours ago', category: 'Operations' },
    { id: 2, title: 'Record fan attendance expected for opening match', time: '4 hours ago', category: 'General' },
    { id: 3, title: 'New public transit routes announced for match days', time: '1 day ago', category: 'Transport' },
  ];

  const liveUpdates = [
    { id: 1, msg: 'Gates opening in 45 minutes for Group A Match.', type: 'info' },
    { id: 2, msg: 'Heavy traffic reported on Route 3 near Stadium.', type: 'warning' },
  ];

  const matches = [
    { id: 1, home: 'USA', away: 'Wales', time: '14:00', stadium: 'MetLife Stadium', date: 'Jun 11, 2026' },
    { id: 2, home: 'Mexico', away: 'Poland', time: '18:00', stadium: 'Estadio Azteca', date: 'Jun 11, 2026' },
    { id: 3, home: 'Canada', away: 'Morocco', time: '21:00', stadium: 'BMO Field', date: 'Jun 12, 2026' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          {user ? `Welcome, ${user.name}` : 'Welcome to FIFA World Cup 2026'}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {user?.role === 'Staff' 
            ? 'Access your operational dashboard for live venue metrics and management tools.' 
            : 'Your ultimate guide to stadiums, matches, and real-time updates.'}
        </p>
      </div>

      {user?.role === 'Staff' && (
        <div className="mb-8 bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-primary">Staff Operations Active</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">You are viewing the dashboard with elevated privileges.</p>
          </div>
          <button className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-opacity-90">
            View Staff Roster
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* News Feed */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center space-x-2">
            <Newspaper className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold dark:text-white">News Feed</h2>
          </div>
          <div className="p-0">
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {newsItems.map(news => (
                <li key={news.id} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{news.title}</p>
                    <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-700/10">
                      {news.category}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{news.time}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Live Updates */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center space-x-2">
            <Radio className="h-5 w-5 text-red-500 animate-pulse" />
            <h2 className="text-lg font-semibold dark:text-white">Live Updates</h2>
          </div>
          <div className="p-5 space-y-4">
            {liveUpdates.map(update => (
              <div 
                key={update.id} 
                className={`p-4 rounded-lg border-l-4 ${
                  update.type === 'warning' 
                    ? 'bg-orange-50 border-orange-500 dark:bg-orange-900/20' 
                    : 'bg-blue-50 border-blue-500 dark:bg-blue-900/20'
                }`}
              >
                <p className={`text-sm ${
                  update.type === 'warning' ? 'text-orange-800 dark:text-orange-200' : 'text-blue-800 dark:text-blue-200'
                }`}>
                  {update.msg}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Match Schedule */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden lg:col-span-1 md:col-span-2">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-green-500" />
            <h2 className="text-lg font-semibold dark:text-white">Match Schedule</h2>
          </div>
          <div className="p-0">
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {matches.map(match => (
                <li key={match.id} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{match.date}</span>
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded font-mono">{match.time}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-900 dark:text-white text-lg">{match.home}</span>
                    <span className="text-gray-400 text-sm mx-2">vs</span>
                    <span className="font-bold text-gray-900 dark:text-white text-lg">{match.away}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    {match.stadium}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
