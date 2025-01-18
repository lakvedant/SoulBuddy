// src/lib/api.ts

export type HoroscopeType = 'big' | 'small';
export type HoroscopeLang = 'en' | 'hi';

export interface HoroscopeParams {
  date: string;
  zodiac: number;
  type: HoroscopeType;
  split: boolean;
  lang: HoroscopeLang;
}

export interface BotResponse {
  score: number;
  split_response: string;
}

export interface HoroscopeResponse {
  status: number;
  response: {
    lucky_color: string;
    lucky_color_code: string;
    lucky_number: number[];
    bot_response: {
      physique: BotResponse;
      status: BotResponse;
      finances: BotResponse;
      relationship: BotResponse;
      career: BotResponse;
      travel: BotResponse;
      family: BotResponse;
      friends: BotResponse;
      health: BotResponse;
      total_score: BotResponse;
    };
    zodiac: string;
  };
}

export const fetchHoroscope = async (params: HoroscopeParams): Promise<HoroscopeResponse> => {
  const API_KEY = process.env.NEXT_PUBLIC_VEDIC_ASTRO_API_KEY;
  const BASE_URL = 'https://api.vedicastroapi.com/v3-json/prediction/daily-sun';

  try {
    // Construct the URL with query parameters
    const queryParams = new URLSearchParams({
      api_key: API_KEY || '',
      date: params.date,
      zodiac: params.zodiac.toString(),
      type: params.type,
      split: params.split.toString(),
      lang: params.lang
    });

    const url = `${BASE_URL}?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: 'GET', // Changed to GET as most astrological APIs prefer GET
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      cache: 'no-store' // Prevents caching in Next.js
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching horoscope:', error);
    throw error;
  }
}

export const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export const zodiacSigns = [
  { id: 1, name: 'Aries' },
  { id: 2, name: 'Taurus' },
  { id: 3, name: 'Gemini' },
  { id: 4, name: 'Cancer' },
  { id: 5, name: 'Leo' },
  { id: 6, name: 'Virgo' },
  { id: 7, name: 'Libra' },
  { id: 8, name: 'Scorpio' },
  { id: 9, name: 'Sagittarius' },
  { id: 10, name: 'Capricorn' },
  { id: 11, name: 'Aquarius' },
  { id: 12, name: 'Pisces' }
];