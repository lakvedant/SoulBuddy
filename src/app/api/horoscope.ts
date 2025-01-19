// src/pages/api/horoscope.ts

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { dob, tob, lat, lon, tz, div, style, color, lang } = req.query;
  
  // Check if all required params are provided
  if (!dob || !tob || !lat || !lon || !tz || !div || !style || !color || !lang) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    // Make the API call to the Vedic Astro API
    const response = await fetch('https://api.vedicastroapi.com/v3-json/horoscope/chart-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_VEDIC_ASTRO_API_KEY}`,
      },
      body: JSON.stringify({
        api_key: process.env.NEXT_PUBLIC_VEDIC_ASTRO_API_KEY,
        dob,
        tob,
        lat,
        lon,
        tz,
        div,
        style,
        color,
        lang,
      }),
    });

    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to fetch horoscope' });
    }

    const data = await response.text(); // Return SVG as plain text
    res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}
