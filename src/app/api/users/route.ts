// app/api/users/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const userData = await request.json();

    const astraEndpoint = `https://${process.env.ASTRA_DB_ID}-${process.env.ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v2/keyspaces/${process.env.ASTRA_DB_KEYSPACE}/users`;

    console.log('Astra DB Endpoint:', astraEndpoint);

    const requestBody = {
      user_id: userData.user_id,
      email: userData.email,
      username: userData.username,
      full_name: userData.full_name,
      photo_url: userData.photo_url || null,
      date_of_birth: userData.date_of_birth || null,
      time_of_birth: userData.time_of_birth || null,
      latitude: userData.latitude || null,
      longitude: userData.longitude || null,
      timezone: userData.timezone || null,
      created_at: new Date().toISOString()
    };

    console.log('Request Body:', requestBody);

    const response = await fetch(astraEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Cassandra-Token': process.env.ASTRA_DB_APPLICATION_TOKEN || '',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Astra DB Error:', errorData);
      throw new Error(errorData.description || 'Failed to create user in database');
    }

    const responseData = await response.json();
    console.log('Success Response:', responseData);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}

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
      return NextResponse.json({
        user_id: userId,
        email: null,
        username: null,
        full_name: null,
        photo_url: null,
        date_of_birth: null,
        time_of_birth: null,
        latitude: null,
        longitude: null,
        timezone: null
      });
    }

    const data = await response.json();
    console.log('Data from Astra DB:', data);

    // Return all fields with defaults if not present
    return NextResponse.json({
      ...data,
      date_of_birth: data.date_of_birth || null,
      time_of_birth: data.time_of_birth || '12:00',
      latitude: data.latitude || '28.7041',
      longitude: data.longitude || '77.1025',
      timezone: data.timezone || 5.5
    });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// Also add this PATCH method for updating birth details
export async function PATCH(request: Request) {
  try {
    const userData = await request.json();
    const { user_id } = userData;

    if (!user_id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const astraEndpoint = `https://${process.env.ASTRA_DB_ID}-${process.env.ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v2/keyspaces/${process.env.ASTRA_DB_KEYSPACE}/users/${user_id}`;

    const updateBody = {
      date_of_birth: userData.date_of_birth,
      time_of_birth: userData.time_of_birth,
      latitude: userData.latitude,
      longitude: userData.longitude,
      timezone: userData.timezone
    };

    const response = await fetch(astraEndpoint, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Cassandra-Token': process.env.ASTRA_DB_APPLICATION_TOKEN || '',
      },
      body: JSON.stringify(updateBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.description || 'Failed to update user');
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update user' },
      { status: 500 }
    );
  }
}