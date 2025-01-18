'use client'
import { useState, useEffect } from 'react';
import Head from 'next/head';

interface ConnectionStatus {
  status: string;
  data?: any[];
  error?: string;
}

export default function Home() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    status: 'Testing connection...'
  });

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch('/api/test');
        const result = await response.json();
        
        setConnectionStatus({
          status: 'Connected to Astra DB!',
          data: result.data
        });
        
        console.log('Test result:', result);
      } catch (error) {
        setConnectionStatus({
          status: 'Connection failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    };

    testConnection();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <Head>
        <title>Astra DB Connection Test</title>
      </Head>

      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Astra DB Connection Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <p className={`text-lg ${
            connectionStatus.error ? 'text-red-600' : 
            connectionStatus.data ? 'text-green-600' : 
            'text-gray-600'
          }`}>
            {connectionStatus.status}
          </p>

          {connectionStatus.error && (
            <p className="mt-2 text-red-500">
              Error: {connectionStatus.error}
            </p>
          )}

          {connectionStatus.data && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Test Data:</h2>
              <pre className="bg-gray-50 p-4 rounded overflow-x-auto">
                {JSON.stringify(connectionStatus.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}