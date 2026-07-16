import { useEffect, useState } from 'react';
import { RiTrophyLine, RiLoader4Line } from 'react-icons/ri';

interface Game {
  id: string;
  home_team_name_en: string;
  away_team_name_en: string;
  home_score: number;
  away_score: number;
  finished: string;
}

export function ResultsWidget() {
  const [results, setResults] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('/api/worldcup/games');
        if (!response.ok) throw new Error('Failed to fetch match results');
        const data = await response.json();
        
        const finishedGames = (data.games || [])
          .filter((game: Game) => game.finished === 'TRUE')
          .slice(0, 5); // Take top 5 recent results
          
        setResults(finishedGames);
      } catch (err) {
        setError('Unable to load recent results.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-sm shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden h-full flex flex-col">
      <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center space-x-2">
        <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-sm">
          <RiTrophyLine className="h-6 w-6 text-gray-900 dark:text-gray-100" />
        </div>
        <h2 className="text-lg font-bold dark:text-white">Recent Results</h2>
      </div>
      
      <div className="p-0 flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-8 flex justify-center items-center h-full text-gray-500">
            <RiLoader4Line className="h-6 w-6 animate-spin mr-2 text-primary" />
            Loading results...
          </div>
        ) : error ? (
          <div className="p-6 text-red-500 text-sm text-center">{error}</div>
        ) : results.length === 0 ? (
          <div className="p-6 text-gray-500 text-sm text-center">No past results available.</div>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {results.map((item) => {
              const homeWon = item.home_score > item.away_score;
              const awayWon = item.away_score > item.home_score;
              const isDraw = item.home_score === item.away_score;

              return (
                <li key={item.id} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`font-semibold ${homeWon ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                      {item.home_team_name_en}
                    </span>
                    <span className={`font-bold ${homeWon ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                      {item.home_score}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`font-semibold ${awayWon ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                      {item.away_team_name_en}
                    </span>
                    <span className={`font-bold ${awayWon ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                      {item.away_score}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {isDraw ? 'Draw' : homeWon ? `${item.home_team_name_en} Won` : `${item.away_team_name_en} Won`}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
