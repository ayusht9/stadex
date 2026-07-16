import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RiMapPin2Line, RiTeamLine, RiEarthLine, RiLoader4Line } from 'react-icons/ri';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Stadium {
  id: string;
  name_en: string;
  fifa_name: string;
  city_en: string;
  country_en: string;
  capacity: number;
  region: string;
}

export function Stadiums() {
  const { t } = useTranslation();
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        const response = await fetch('/api/worldcup/stadiums');
        if (!response.ok) throw new Error('Failed to load stadiums');
        const data = await response.json();
        setStadiums(data.stadiums || []);
      } catch (err: any) {
        setError(err.message || 'Unable to load stadiums data.');
      } finally {
        setLoading(false);
      }
    };

    fetchStadiums();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <RiLoader4Line className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center">
          <RiMapPin2Line className="mr-3 h-8 w-8 text-primary" />
          {t('Stadiums')}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Discover all 16 official venues for the FIFA World Cup 2026 across North America.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stadiums.map((stadium) => (
          <Card key={stadium.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="bg-gray-50 dark:bg-gray-900/50 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-bold">{stadium.name_en}</CardTitle>
                  <CardDescription className="text-sm font-medium text-primary mt-1">
                    {stadium.fifa_name}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-white dark:bg-gray-800">
                  {stadium.region}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <RiEarthLine className="h-5 w-5 mr-3 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</p>
                  <p className="font-semibold">{stadium.city_en}, {stadium.country_en}</p>
                </div>
              </div>

              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <RiTeamLine className="h-5 w-5 mr-3 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Capacity</p>
                  <p className="font-semibold">{stadium.capacity.toLocaleString()}</p>
                </div>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
