import React, { useEffect, useState } from 'react';
import { RiFootballLine, RiHistoryLine, RiTrophyLine, RiLoader4Line } from 'react-icons/ri';

interface Match {
  id: number;
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
  minute?: string;
  status: string;
  stadium?: string;
  date?: string;
}

interface TeamStanding {
  name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
}

interface GroupStanding {
  group: string;
  teams: TeamStanding[];
}

export function Matches() {
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [historyMatches, setHistoryMatches] = useState<Match[]>([]);
  const [standings, setStandings] = useState<GroupStanding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [liveRes, historyRes, standingsRes] = await Promise.all([
          fetch('/api/matches/live'),
          fetch('/api/matches/history'),
          fetch('/api/standings')
        ]);
        
        setLiveMatches(await liveRes.json());
        setHistoryMatches(await historyRes.json());
        setStandings(await standingsRes.json());
      } catch (error) {
        console.error("Failed to fetch match data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <RiLoader4Line className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center">
          <RiFootballLine className="mr-3 h-8 w-8 text-primary" />
          Live Matches & Results
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Stay updated with real-time scores, past results, and tournament standings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          {/* Live Scores */}
          <div className="bg-white dark:bg-gray-800 rounded-sm shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center space-x-2">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-sm">
                <RiFootballLine className="h-6 w-6 text-red-600 dark:text-red-400 animate-pulse" />
              </div>
              <h2 className="text-lg font-bold dark:text-white">Live Scores</h2>
            </div>
            <div className="p-5 grid gap-4">
              {liveMatches.length === 0 ? (
                <p className="text-gray-500">No live matches currently.</p>
              ) : liveMatches.map(match => (
                <div key={match.id} className="border border-gray-200 dark:border-gray-700 rounded-sm p-4 flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900/50">
                  <span className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-2">{match.minute} - Live</span>
                  <div className="flex justify-between items-center w-full max-w-sm">
                    <span className="font-bold text-gray-900 dark:text-white text-xl w-1/3 text-right">{match.home}</span>
                    <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-mono text-2xl px-4 py-2 rounded-sm mx-4">
                      {match.homeScore} - {match.awayScore}
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white text-xl w-1/3 text-left">{match.away}</span>
                  </div>
                  <span className="text-xs text-gray-400 mt-3">{match.stadium}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Previous Results */}
          <div className="bg-white dark:bg-gray-800 rounded-sm shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center space-x-2">
              <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-sm">
                <RiHistoryLine className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
              <h2 className="text-lg font-bold dark:text-white">Previous Results</h2>
            </div>
            <div className="p-0">
              <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                {historyMatches.map(match => (
                  <li key={match.id} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{match.date}</span>
                      <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-sm uppercase">{match.status}</span>
                    </div>
                    <div className="flex justify-between items-center max-w-sm mx-auto my-2">
                      <span className="font-bold text-gray-900 dark:text-white text-lg w-1/3 text-right">{match.home}</span>
                      <span className="font-bold text-gray-900 dark:text-white text-lg mx-4">{match.homeScore} - {match.awayScore}</span>
                      <span className="font-bold text-gray-900 dark:text-white text-lg w-1/3 text-left">{match.away}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Standings */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-sm shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center space-x-2">
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-sm">
                <RiTrophyLine className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h2 className="text-lg font-bold dark:text-white">Tournament Table</h2>
            </div>
            <div className="p-0">
              {standings.map(group => (
                <div key={group.group} className="mb-4">
                  <div className="bg-gray-50 dark:bg-gray-900/50 px-4 py-2 font-semibold text-sm text-gray-900 dark:text-white">
                    {group.group}
                  </div>
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">P</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Pts</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {group.teams.map(team => (
                        <tr key={team.name}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{team.name}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">{team.played}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-center text-gray-900 dark:text-white">{team.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
