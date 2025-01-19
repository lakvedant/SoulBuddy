import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateOfBirth = searchParams.get('dob');
    const timeOfBirth = searchParams.get('tob') || '12:00';
    const latitude = searchParams.get('lat') || '28.7041';
    const longitude = searchParams.get('lon') || '77.1025';

    if (!dateOfBirth) {
      return NextResponse.json({ error: 'Date of birth is required' }, { status: 400 });
    }

    const params = {
      api_key: process.env.VEDIC_ASTRO_API_KEY,
      dob: dateOfBirth,
      tob: timeOfBirth,
      lat: latitude,
      lon: longitude,
      tz: 5.5,
      div: "D1",
      style: "north",
      color: "#9d00ff",
      lang: "en"
    };

    const queryString = new URLSearchParams(params as any).toString();
    const response = await fetch(
      `https://api.vedicastroapi.com/v3-json/horoscope/chart-image?${queryString}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to generate chart');
    }

    const chartData = await response.text();
    return NextResponse.json({ chartData });

  } catch (error: any) {
    console.error('Error generating chart:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate chart' },
      { status: 500 }
    );
  }
}