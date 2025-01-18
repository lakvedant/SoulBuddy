'use client';

import React, { useEffect, useState } from 'react';
import { fetchHoroscope, formatDate } from '@/lib/api';
import { Activity } from 'lucide-react';

interface DayData {
  date: string;
  score: number;
  details: string;
}

interface CalendarDay {
  date: string;
  dayOfMonth: number;
  isCurrentMonth: boolean;
}

const EnergyCalendar = () => {
  const [energyData, setEnergyData] = useState<Map<string, DayData>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedZodiac, setSelectedZodiac] = useState('3'); // Default to Gemini for demo

  useEffect(() => {
    const fetchLastSevenDays = async () => {
      setLoading(true);
      setError(null);
      const data = new Map<string, DayData>();

      // Fetch last 7 days data
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const formattedDate = formatDate(date);

        try {
          const response = await fetchHoroscope({
            date: formattedDate,
            zodiac: parseInt(selectedZodiac),
            type: 'big',
            split: true,
            lang: 'en',
          });

          // Safely check the response structure
          if (
            response?.status === 200 &&
            response?.response?.bot_response?.total_score?.score !== undefined &&
            response?.response?.bot_response?.total_score?.split_response
          ) {
            data.set(formattedDate, {
              date: formattedDate,
              score: response.response.bot_response.total_score.score,
              details: response.response.bot_response.total_score.split_response,
            });
          } else {
            console.warn(`Invalid response format for ${formattedDate}:`, response);
          }
        } catch (error) {
          console.error(`Error fetching data for ${formattedDate}:`, error);
          // Only set error if we haven't already set one
          if (!error) {
            setError('Failed to fetch energy data. Please try again later.');
          }
        }
      }

      setEnergyData(data);
      setLoading(false);
    };

    fetchLastSevenDays();
  }, [selectedZodiac]);

  // Debug log to check the data
  useEffect(() => {
    console.log('Energy Data:', Array.from(energyData.entries()));
  }, [energyData]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-purple-100'; // Purple theme
    if (score >= 60) return 'bg-purple-50';
    if (score >= 40) return 'bg-pink-50';
    if (score >= 20) return 'bg-red-50';
    return 'bg-gray-50';
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return 'text-purple-600';
    if (score >= 60) return 'text-purple-500';
    if (score >= 40) return 'text-pink-600';
    if (score >= 20) return 'text-red-500';
    return 'text-gray-500';
  };

  const getCurrentMonthDays = (): CalendarDay[] => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const days: CalendarDay[] = [];

    // Add previous month days to complete first week
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth, -i);
      days.push({
        date: formatDate(date),
        dayOfMonth: date.getDate(),
        isCurrentMonth: false,
      });
    }

    // Add current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(currentYear, currentMonth, i);
      days.push({
        date: formatDate(date),
        dayOfMonth: i,
        isCurrentMonth: true,
      });
    }

    return days;
  };

  const renderDayContent = (day: CalendarDay) => {
    const dayData = energyData.get(day.date);

    return (
      <td
        key={day.date}
        className={`relative h-24 cursor-pointer border p-2 transition-colors
          ${dayData ? getScoreColor(dayData.score) : 'hover:bg-gray-50'}
          ${!day.isCurrentMonth ? 'text-gray-400' : ''}`}
      >
        <span className="font-medium">{day.dayOfMonth}</span>

        {dayData && (
          <div className="group relative">
            <div className="mt-1 flex items-center">
              <Activity className={`h-4 w-4 ${getScoreTextColor(dayData.score)}`} />
              <span className={`ml-1 text-sm ${getScoreTextColor(dayData.score)}`}>
                {dayData.score}%
              </span>
            </div>

            <div className="invisible absolute left-0 z-50 mt-2 w-48 rounded-md bg-white p-2 text-sm shadow-lg opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
              <p className="font-medium text-gray-900">Energy Level</p>
              <p className="text-gray-600">{dayData.details}</p>
            </div>
          </div>
        )}
      </td>
    );
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-purple-700">
          Energy Calendar
        </h1>
        {loading && (
          <span className="text-gray-500">Loading energy data...</span>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="w-full max-w-full rounded-sm border border-purple-200 bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <table className="w-full">
          <thead>
            <tr className="grid grid-cols-7 bg-purple-600 text-white">
              <th className="p-2 text-center">Sun</th>
              <th className="p-2 text-center">Mon</th>
              <th className="p-2 text-center">Tue</th>
              <th className="p-2 text-center">Wed</th>
              <th className="p-2 text-center">Thu</th>
              <th className="p-2 text-center">Fri</th>
              <th className="p-2 text-center">Sat</th>
            </tr>
          </thead>
          <tbody>
            {chunk(getCurrentMonthDays(), 7).map((week, weekIndex) => (
              <tr key={weekIndex} className="grid grid-cols-7">
                {week.map(day => renderDayContent(day))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Debug section - remove in production */}
      <div className="mt-4 text-sm text-gray-500">
        <p>Zodiac Sign: Gemini (ID: {selectedZodiac})</p>
        <p>Data Points: {energyData.size}</p>
      </div>
    </div>
  );
};

// Helper function to chunk array into weeks
const chunk = <T,>(arr: T[], size: number): T[][] => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
};

export default EnergyCalendar;