// app/api/birth-details/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const astraEndpoint = `https://${process.env.ASTRA_DB_ID}-${process.env.ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v2/keyspaces/${process.env.ASTRA_DB_KEYSPACE}/users/${userId}`;

    console.log('Fetching from:', astraEndpoint);

    const response = await fetch(astraEndpoint, {
      headers: {
        'X-Cassandra-Token': process.env.ASTRA_DB_APPLICATION_TOKEN || '',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'User not found' }, 
        { status: 404 }
      );
    }

    const userData = await response.json();
    
    // Format the response to match what we need for the chart
    return NextResponse.json({
      name: userData.full_name,
      date_of_birth: userData.date_of_birth,
      time_of_birth: userData.time_of_birth || "12:00", // Default time if not set
      latitude: userData.latitude || "28.7041",  // Default to New Delhi if not set
      longitude: userData.longitude || "77.1025",
      timezone: userData.timezone || 5.5
    });

  } catch (error: any) {
    console.error('Error fetching birth details:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch birth details' },
      { status: 500 }
    );
  }
}