// /pages/api/getChart.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Extract userId from query parameters
    const { userId } = req.query;

    // Validate userId
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'User ID is required and must be a string.' });
    }

    // Simulated kundali (astrology chart) data
    const chartData = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
      <rect width="300" height="300" fill="#f4f4f4" />
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="16" fill="#333">
        Kundali Chart for User: ${userId}
      </text>
    </svg>`;

    // Return the SVG as a response
    res.status(200).json({ chartData });
  } catch (err) {
    console.error('Error generating chart:', err);
    res.status(500).json({ error: 'Failed to generate kundali chart.' });
  }
}
