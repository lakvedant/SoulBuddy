// app/components/Kundali.tsx
'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface UserData {
  dob: string;
  name: string;
}

const Kundali = () => {
  const [chartSvg, setChartSvg] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateChart = async (date: string = '21/01/2022') => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        api_key: 'f739c0ce-cbd1-54e4-82cb-f41a5c8db4ea',
        dob: date,
        tob: "02:09",
        lat: "34.67",
        lon: "45.86",
        tz: "5.5",
        div: "D1",
        style: "north",
        color: "#9d00ff",
        lang: "en"
      };

      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(
        `https://api.vedicastroapi.com/v3-json/horoscope/chart-image?${queryString}`
      );

      if (!response.ok) {
        throw new Error('Failed to generate chart');
      }

      const chartData = await response.text();
      
      // Enhance SVG with styles
      const enhancedSvg = enhanceSvgWithStyles(chartData);
      setChartSvg(enhancedSvg);

    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateChart();
  }, []);

  const enhanceSvgWithStyles = (originalSvg: string) => {
    const baseStyles = `
      .chart-container {
        background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(147,51,234,0.05) 100%);
      }

      .chart-triangle {
        transition: all 0.2s ease-out;
        fill: url(#triangleGradient);
        stroke: url(#strokeGradient);
        stroke-width: 1.5;
        transform-origin: center;
        cursor: pointer;
      }
      
      .chart-triangle:hover {
        fill: url(#triangleGradientHover);
        stroke: url(#strokeGradientHover);
        stroke-width: 2;
        transform: translateY(-3px);
        filter: drop-shadow(2px 2px 1px rgba(139, 92, 246, 0.25));
      }

      .chart-square {
        transition: all 0.2s ease-out;
        fill: url(#squareGradient);
        stroke: url(#strokeGradient);
        stroke-width: 1.5;
        transform-origin: center;
        cursor: pointer;
      }

      .chart-square:hover {
        fill: url(#squareGradientHover);
        stroke: url(#strokeGradientHover);
        stroke-width: 2;
        transform: translateY(-3px);
        filter: drop-shadow(2px 2px 1px rgba(139, 92, 246, 0.25));
      }

      .planet-text {
        font-family: 'Inter', sans-serif;
        font-size: 16px;
        font-weight: 700;
        fill: #4c1d95;
        transition: all 0.2s ease-out;
        filter: drop-shadow(0px 1px 1px rgba(76, 29, 149, 0.1));
        pointer-events: none;
      }

      .house-number {
        font-family: 'Inter', sans-serif;
        fill: #9333ea;
        font-size: 14px;
        font-weight: 500;
        opacity: 0.7;
        pointer-events: none;
      }
    `;

    const triangles = [
      'M 0,0 L 250,0 L 125,125 Z',      // Top left triangle
      'M 250,0 L 500,0 L 375,125 Z',     // Top right triangle
      'M 0,500 L 0,250 L 125,375 Z',     // Left bottom triangle
      'M 500,500 L 500,250 L 375,375 Z', // Right bottom triangle
      'M 0,0 L 0,250 L 125,125 Z',       // Left top triangle
      'M 500,0 L 500,250 L 375,125 Z',   // Right top triangle
      'M 0,500 L 250,500 L 125,375 Z',   // Bottom left triangle
      'M 250,500 L 500,500 L 375,375 Z'  // Bottom right triangle
    ];

    const squares = [
      'M 125,125 L 250,0 L 375,125 L 250,250 Z',   // Top square
      'M 375,125 L 500,250 L 375,375 L 250,250 Z', // Right square
      'M 125,375 L 250,500 L 375,375 L 250,250 Z', // Bottom square
      'M 125,125 L 0,250 L 125,375 L 250,250 Z'    // Left square
    ];

    const textMatches = originalSvg.match(/<text.*?<\/text>/g) || [];

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" class="w-full h-full chart-container">
        <defs>
          <linearGradient id="triangleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f3e8ff;stop-opacity:0.5" />
            <stop offset="100%" style="stop-color:#e9d5ff;stop-opacity:0.3" />
          </linearGradient>
          <linearGradient id="triangleGradientHover" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#d8b4fe;stop-opacity:0.6" />
            <stop offset="100%" style="stop-color:#c084fc;stop-opacity:0.4" />
          </linearGradient>
          <linearGradient id="squareGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f5f3ff;stop-opacity:0.4" />
            <stop offset="100%" style="stop-color:#ede9fe;stop-opacity:0.2" />
          </linearGradient>
          <linearGradient id="squareGradientHover" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ddd6fe;stop-opacity:0.5" />
            <stop offset="100%" style="stop-color:#c4b5fd;stop-opacity:0.3" />
          </linearGradient>
          <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#8b5cf6" />
            <stop offset="100%" style="stop-color:#7c3aed" />
          </linearGradient>
          <linearGradient id="strokeGradientHover" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#7c3aed" />
            <stop offset="100%" style="stop-color:#6d28d9" />
          </linearGradient>
        </defs>
        <style>${baseStyles}</style>
        <g class="chart-sections">
          ${triangles.map((d, i) => `
            <path d="${d}" class="chart-triangle" />
          `).join('')}
          ${squares.map((d, i) => `
            <path d="${d}" class="chart-square" />
          `).join('')}
        </g>
        ${textMatches.map(text => 
          text
            .replace(/font-family:[^;"]+/, 'font-family: "Inter", sans-serif')
            .replace(/class="[^"]*"/, 'class="planet-text"')
        ).join('')}
      </svg>
    `;
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl shadow-purple-200/50 p-8 max-w-3xl w-full">
        <h1 className="text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-900">
          Kundali Chart
        </h1>
        
        {error && (
          <div className="text-red-500 text-center mb-4 p-4 bg-red-50 rounded-lg">
            <p className="font-medium">Error loading chart</p>
            <p className="text-sm opacity-75">{error}</p>
          </div>
        )}

        <div className="relative">
          {loading ? (
            <div className="flex flex-col justify-center items-center aspect-square bg-purple-50/50 rounded-xl">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
              <p className="text-purple-700 font-medium">Loading your chart...</p>
            </div>
          ) : chartSvg ? (
            <div
              className="w-full aspect-square p-4 rounded-xl bg-white/40 shadow-inner transition-transform duration-500 hover:scale-[1.02]"
              dangerouslySetInnerHTML={{
                __html: chartSvg.replace(/[\n\r]/g, '').trim()
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Kundali;