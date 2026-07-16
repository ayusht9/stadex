import React from 'react';
import { Link } from 'react-router-dom';
import { RiCalendarEventLine, RiRadio2Line } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import { ResultsWidget } from '../components/ResultsWidget';

export function Dashboard() {
  const { user } = useAuth();

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
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {user ? `Welcome, ${user.name}` : 'Welcome to Stadex'}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {user?.role === 'Staff' 
              ? 'Access your operational dashboard for live venue metrics and management tools.' 
              : 'Your ultimate guide to stadiums, matches, and real-time updates.'}
          </p>
        </div>
        <Link to="/matches" className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-sm hover:bg-opacity-90">
          View All Matches
        </Link>
      </div>

      {user?.role === 'Staff' && (
        <div className="mb-8 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm p-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-primary">Staff Operations Active</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">You are viewing the dashboard with elevated privileges.</p>
          </div>
          <button className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-sm hover:bg-opacity-90">
            View Staff Roster
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
        
        {/* Results Feed */}
        <div className="lg:col-span-1 h-full">
          <ResultsWidget />
        </div>

        <div className="lg:col-span-2 space-y-8 h-full flex flex-col">
          {/* Live Updates */}
          <div className="bg-white dark:bg-gray-800 rounded-sm shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center space-x-2">
              <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-sm">
                <RiRadio2Line className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
              <h2 className="text-lg font-bold dark:text-white">Live Updates</h2>
            </div>
            <div className="p-5 space-y-4">
              {liveUpdates.map(update => (
                <div 
                  key={update.id} 
                  className={`p-4 rounded-sm border-l-4 ${
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

          {/* Match Schedule (Mini) */}
          <div className="bg-white dark:bg-gray-800 rounded-sm shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex-1 flex flex-col">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center space-x-2">
              <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-sm">
                <RiCalendarEventLine className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
              <h2 className="text-lg font-bold dark:text-white">Upcoming Matches</h2>
            </div>
            <div className="p-0 overflow-y-auto flex-1">
              <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                {matches.map(match => (
                  <li key={match.id} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{match.date}</span>
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-sm font-mono">{match.time}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-gray-900 dark:text-white text-lg">{match.home}</span>
                      <span className="text-gray-400 text-sm mx-2">vs</span>
                      <span className="font-bold text-gray-900 dark:text-white text-lg">{match.away}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
