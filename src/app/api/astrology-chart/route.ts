import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Fetch user data from Astra DB
    const astraEndpoint = `https://${process.env.ASTRA_DB_ID}-${process.env.ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v2/keyspaces/${process.env.ASTRA_DB_KEYSPACE}/users/${userId}`;

    const userResponse = await fetch(astraEndpoint, {
      headers: {
        'X-Cassandra-Token': process.env.ASTRA_DB_APPLICATION_TOKEN || '',
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = await userResponse.json();

    // Prepare parameters for Vedic Astro API
    const vedicAstroParams = {
      lang: 'en',
      api_key: process.env.VEDIC_ASTRO_API_KEY,
      lat: userData.data.latitude?.toString() || '22.755',
      lon: userData.data.longitude?.toString() || '88.34167',
      tz: 5.5,
      div: 'D1',
      style: 'north',
      color: '#9d00ff',
      dob: formatDateForAPI(userData.data.date_of_birth),
      tob: userData.data.time_of_birth || '12:00',
    };

    // Call Vedic Astro API
    const vedicAstroResponse = await axios.post('https://api.vedicastroapi.com/v3-json/horoscope/chart-image', vedicAstroParams, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Return combined user and chart data
    return NextResponse.json({
      user: userData.data,
      chart: {
        svg: vedicAstroResponse.data.chart_url,
        planets: parsePlanetPositions(vedicAstroResponse.data),
      },
    });
  } catch (error: any) {
    console.error('Astrology Chart Generation Error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

// Utility function to format date for Vedic Astro API
function formatDateForAPI(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

// Utility function to parse planet positions
function parsePlanetPositions(chartData: any): any[] {
  // This is a placeholder. You should implement the actual parsing logic based on the API response
  return [
    { name: 'Sun', abbreviation: 'Su', position: 'Leo', house: 5 },
    { name: 'Moon', abbreviation: 'Mo', position: 'Gemini', house: 3 },
    { name: 'Mercury', abbreviation: 'Me', position: 'Cancer', house: 4 },
    { name: 'Venus', abbreviation: 'Ve', position: 'Leo', house: 5 },
    { name: 'Mars', abbreviation: 'Ma', position: 'Virgo', house: 6 },
    { name: 'Jupiter', abbreviation: 'Ju', position: 'Libra', house: 7 },
    { name: 'Saturn', abbreviation: 'Sa', position: 'Scorpio', house: 8 },
    { name: 'Rahu', abbreviation: 'Ra', position: 'Sagittarius', house: 9 },
    { name: 'Ketu', abbreviation: 'Ke', position: 'Gemini', house: 3 },
  ];
}

