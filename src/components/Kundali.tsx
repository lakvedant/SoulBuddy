'use client';

import { useEffect, useState } from 'react';

export default function Kundali() {
  const [chartData, setChartData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Simulated user ID for demo purposes
  const userId = 'XbLNaC5O4WfnuCjmtv1GxkMlaoj2'; // Replace this with dynamic user authentication logic if needed.

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await fetch(`/api/getChart?userId=${userId}`);

        // Check if the response is JSON before parsing
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Unexpected response format');
        }

        const data = await res.json();

        if (res.ok) {
          setChartData(data.chartData);
        } else {
          setError(data.error || 'Failed to fetch kundali chart');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('An error occurred while fetching the kundali chart.');
      }
    };

    fetchChartData();
  }, [userId]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Vedic Astrology Chart</h1>
      {chartData ? (
        <div
          dangerouslySetInnerHTML={{ __html: chartData }} // Safely render the SVG
          className="border border-gray-300 p-4 rounded bg-white shadow-md"
        />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
