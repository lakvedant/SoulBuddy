'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Heart, Users, Briefcase, Plane, Home, Activity, DollarSign, User } from 'lucide-react';
import { fetchHoroscope, formatDate, zodiacSigns, HoroscopeResponse } from '@/lib/api';

export default function HoroscopeForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [horoscopeData, setHoroscopeData] = useState<HoroscopeResponse['response'] | null>(null);
  const [selectedZodiac, setSelectedZodiac] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const params = {
        date: formatDate(new Date()),
        zodiac: parseInt(selectedZodiac),
        type: 'big' as const,
        split: true,
        lang: 'en' as const,
      };

      const data = await fetchHoroscope(params);
      setHoroscopeData(data.response);
    } catch (err) {
      setError('Failed to fetch horoscope. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const categoryIcons = {
    physique: User,
    status: AlertCircle,
    finances: DollarSign,
    relationship: Heart,
    career: Briefcase,
    travel: Plane,
    family: Home,
    friends: Users,
    health: Activity,
  } as const;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 bg-gradient-to-b from-purple-100 via-white to-purple-50 rounded-lg shadow-lg">
      {/* Input Form */}
      <Card className="bg-gradient-to-r from-purple-200 to-purple-300">
        <CardHeader>
          <CardTitle className="text-purple-900 text-xl font-semibold">✨ Get Your Daily Horoscope ✨</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              value={selectedZodiac}
              onChange={(e) => setSelectedZodiac(e.target.value)}
              className="w-full p-3 rounded-lg bg-white text-purple-800 border border-purple-300 shadow-sm focus:ring focus:ring-purple-500 focus:outline-none"
              required
            >
              <option value="" disabled>
                Select your zodiac sign
              </option>
              {zodiacSigns.map((sign) => (
                <option key={sign.id} value={sign.id}>
                  {sign.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 disabled:bg-purple-400 transition-colors shadow-md"
            >
              {loading ? 'Loading...' : '🔮 Get Horoscope'}
            </button>
          </form>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Results Display */}
      {horoscopeData && (
        <div className="space-y-6">
          {/* Summary Card */}
          <Card className="bg-gradient-to-r from-purple-100 to-purple-200 shadow-lg">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-purple-900">Zodiac Sign</h3>
                  <p className="text-2xl font-bold text-purple-700">{horoscopeData.zodiac}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-900">Lucky Numbers</h3>
                  <p className="text-2xl font-bold text-purple-600">
                    {horoscopeData.lucky_number.join(', ')}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-900">Lucky Color</h3>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-purple-400"
                      style={{ backgroundColor: horoscopeData.lucky_color_code }}
                    />
                    <p className="text-2xl font-bold text-purple-700">{horoscopeData.lucky_color}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(horoscopeData.bot_response).map(([category, info]) => {
              if (category === 'total_score') return null;
              const Icon = categoryIcons[category as keyof typeof categoryIcons] || AlertCircle;
              return (
                <Card
                  key={category}
                  className="bg-gradient-to-r from-purple-50 to-purple-100 hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center space-x-2 text-lg capitalize text-purple-800">
                      <Icon className="w-5 h-5" />
                      <span>{category}</span>
                      <span className={`ml-auto ${getScoreColor(info.score)}`}>
                        {info.score}%
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-700">{info.split_response}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Total Score Card */}
          <Card className="bg-gradient-to-r from-purple-200 to-purple-400 shadow-md">
            <CardHeader>
              <CardTitle className="text-purple-800 text-lg font-semibold">Daily Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-purple-800">Total Score:</span>
                <span
                  className={`text-2xl font-bold ${getScoreColor(
                    horoscopeData.bot_response.total_score.score
                  )}`}
                >
                  {horoscopeData.bot_response.total_score.score}%
                </span>
              </div>
              <p className="text-purple-700">{horoscopeData.bot_response.total_score.split_response}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
