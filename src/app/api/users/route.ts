import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const astraEndpoint = `https://${process.env.ASTRA_DB_ID}-${process.env.ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v2/keyspaces/${process.env.ASTRA_DB_KEYSPACE}/users/${userId}`;

    const response = await fetch(astraEndpoint, {
      headers: {
        'X-Cassandra-Token': process.env.ASTRA_DB_APPLICATION_TOKEN || '',
      },
    });

    if (!response.ok) {
      // Return default data if user not found
      return NextResponse.json({
        full_name: "User",
        date_of_birth: "2000-01-01",
        time_of_birth: "12:00",
        latitude: "28.7041",
        longitude: "77.1025",
        timezone: 5.5
      });
    }

    const data = await response.json();

    // Return data with defaults for missing values
    return NextResponse.json({
      ...data,
      full_name: data.full_name || "User",
      date_of_birth: data.date_of_birth || "2000-01-01",
      time_of_birth: data.time_of_birth || "12:00",
      latitude: data.latitude || "28.7041",
      longitude: data.longitude || "77.1025",
      timezone: data.timezone || 5.5
    });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    // Return default data on error
    return NextResponse.json({
      full_name: "User",
      date_of_birth: "2000-01-01",
      time_of_birth: "12:00",
      latitude: "28.7041",
      longitude: "77.1025",
      timezone: 5.5
    });
  }
}