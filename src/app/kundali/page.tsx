// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Kundali from '@/components/Kundali';
import DefaultLayout from '@/components/Layouts/DefaultLayout';

export default function KundaliParent() {
  const userId = 'gsvHWpSKYQXFNScOHuxP15AKj512'; // Your user ID
  const [loading, setLoading] = useState(true);

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
        <div className="container mx-auto py-8">
          {/* Title Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-purple-900">Your Astrological Chart</h1>
            <p className="text-purple-600 mt-2">Detailed birth chart analysis</p>
          </div>

          {/* Chart Section */}
          <div className="max-w-4xl mx-auto">
            <Kundali userId={userId} />
          </div>

          {/* Disclaimer Section */}
          <div className="mt-8 text-center text-sm text-purple-500/70">
            <p>For entertainment purposes only</p>
          </div>
        </div>
      </div>
      </DefaultLayout>
  );
}