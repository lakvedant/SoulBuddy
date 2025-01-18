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
        lang: 'en' as const
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
    health: Activity
  } as const;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle>Get Your Daily Horoscope</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              value={selectedZodiac}
              onChange={(e) => setSelectedZodiac(e.target.value)}
              className="w-full p-2 border rounded-lg bg-white"
              required
            >
              <option value="">Select your zodiac sign</option>
              {zodiacSigns.map(sign => (
                <option key={sign.id} value={sign.id}>
                  {sign.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
            >
              {loading ? 'Loading...' : 'Get Horoscope'}
            </button>
          </form>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="ml-3 text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Results Display */}
      {horoscopeData && (
        <div className="space-y-6">
          {/* Summary Card */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Zodiac Sign</h3>
                  <p className="text-2xl font-bold text-purple-600">{horoscopeData.zodiac}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Lucky Numbers</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {horoscopeData.lucky_number.join(', ')}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Lucky Color</h3>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: horoscopeData.lucky_color_code }}
                    />
                    <p className="text-2xl font-bold text-gray-600">
                      {horoscopeData.lucky_color}
                    </p>
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
                <Card key={category} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center space-x-2 text-lg capitalize">
                      <Icon className="w-5 h-5" />
                      <span>{category}</span>
                      <span className={`ml-auto ${getScoreColor(info.score)}`}>
                        {info.score}%
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{info.split_response}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Total Score Card */}
          <Card className="bg-gradient-to-r from-blue-50 to-green-50">
            <CardHeader>
              <CardTitle>Daily Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold">Total Score:</span>
                <span className={`text-2xl font-bold ${getScoreColor(horoscopeData.bot_response.total_score.score)}`}>
                  {horoscopeData.bot_response.total_score.score}%
                </span>
              </div>
              <p className="text-gray-600">{horoscopeData.bot_response.total_score.split_response}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}