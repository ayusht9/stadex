import React, { useState, useEffect } from 'react';
import stadiumsData from '../data/stadiums.json';
import { Map, CloudRain, Users, MapPin, Navigation } from 'lucide-react';

interface WeatherData {
  temperature: number;
  condition: string;
}

export function Stadiums() {
  const [selectedStadium, setSelectedStadium] = useState(stadiumsData[0]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoadingWeather(true);
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${selectedStadium.lat}&longitude=${selectedStadium.lon}&current_weather=true`
        );
        const data = await response.json();
        
        // Map WMO weather codes to simple strings
        const code = data.current_weather.weathercode;
        let condition = 'Clear';
        if (code >= 1 && code <= 3) condition = 'Partly Cloudy';
        if (code >= 45 && code <= 48) condition = 'Fog';
        if (code >= 51 && code <= 67) condition = 'Rain';
        if (code >= 71 && code <= 82) condition = 'Snow';
        if (code >= 95) condition = 'Thunderstorm';

        setWeather({
          temperature: data.current_weather.temperature,
          condition
        });
      } catch (error) {
        console.error("Failed to fetch weather", error);
        setWeather({ temperature: 22, condition: 'Clear (Mock)' });
      }
      setLoadingWeather(false);
    };

    fetchWeather();
  }, [selectedStadium]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Stadium Guide & Navigation
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Explore venues, check live weather, and find transportation.
          </p>
        </div>
        
        <div className="w-full md:w-64">
          <label htmlFor="stadium-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Select Venue
          </label>
          <select
            id="stadium-select"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:text-sm py-2 px-3 border"
            value={selectedStadium.id}
            onChange={(e) => {
              const stadium = stadiumsData.find(s => s.id === e.target.value);
              if (stadium) setSelectedStadium(stadium);
            }}
          >
            {stadiumsData.map(stadium => (
              <option key={stadium.id} value={stadium.id}>
                {stadium.name} ({stadium.city})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Stadium Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden lg:col-span-2">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center relative">
            <Map className="h-16 w-16 text-gray-400 dark:text-gray-500" />
            <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-900 px-3 py-1 rounded text-xs font-semibold shadow">
              Interactive Map UI Placeholder
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedStadium.name}</h2>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <MapPin className="mr-1.5 h-4 w-4" />
                {selectedStadium.city}, {selectedStadium.country}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">{selectedStadium.description}</p>
            
            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-700 pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Capacity</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedStadium.capacity.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Navigation className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Transit Routes</p>
                  <button className="text-primary hover:underline font-semibold text-sm">View Guide</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Environment Sidebar */}
        <div className="space-y-8">
          
          {/* Weather Widget */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                <CloudRain className="mr-2 h-5 w-5 text-blue-500" />
                Live Weather
              </h3>
              <span className="text-xs text-gray-500">Open-Meteo</span>
            </div>
            
            {loadingWeather ? (
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ) : (
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-4xl font-bold text-gray-900 dark:text-white">{weather?.temperature}°C</p>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">{weather?.condition}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Lat: {selectedStadium.lat}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Lon: {selectedStadium.lon}</p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Transportation */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Transportation Options</h3>
            <ul className="space-y-3">
              <li className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Metro / Subway</span>
                <span className="font-semibold text-green-600 dark:text-green-400">Operating</span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Bus Routes</span>
                <span className="font-semibold text-green-600 dark:text-green-400">Operating</span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Parking</span>
                <span className="font-semibold text-orange-600 dark:text-orange-400">Limited Space</span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
