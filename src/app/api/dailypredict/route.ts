// lib/api.ts

export interface HoroscopeParams {
    date: string;
    zodiac: number;
    type: 'big' | 'small';
    split: boolean;
    lang: string;
  }
  
  export const fetchHoroscope = async (params: HoroscopeParams) => {
    const API_KEY = process.env.NEXT_PUBLIC_VEDIC_ASTRO_API_KEY;
    const BASE_URL = 'https://api.vedicastroapi.com/v3-json/prediction/daily-sun';
  
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          api_key: API_KEY,
          ...params
        })
      });
  
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
  
      return await response.json();
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