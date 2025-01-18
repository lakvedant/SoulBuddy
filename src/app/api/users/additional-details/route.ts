// src/app/api/users/additional-details/route.ts

import { NextResponse } from 'next/server';

const ASTRA_DB_ENDPOINT = `https://${process.env.ASTRA_DB_ID}-${process.env.ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v2/keyspaces/${process.env.ASTRA_DB_KEYSPACE}/users`;

export async function POST(request: Request) {
  try {
    console.log('API route hit: /api/users/additional-details');
    
    const data = await request.json();
    console.log('Received data:', data);

    if (!data.user_id) {
      return NextResponse.json({ 
        success: false, 
        message: 'User ID is required' 
      }, { 
        status: 400 
      });
    }

    // Include date_of_birth in updateData
    const updateData = {
      date_of_birth: data.dateOfBirth,
      time_of_birth: data.timeOfBirth || null,
      time_unknown: data.timeUnknown || false,
      place_of_birth: data.placeOfBirth || null,
      longitude: data.longitude || null,
      latitude: data.latitude || null,
      gender: data.gender || null
    };

    console.log('Updating user with data:', updateData);

    try {
      const response = await fetch(`${ASTRA_DB_ENDPOINT}/${data.user_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Cassandra-Token': process.env.ASTRA_DB_APPLICATION_TOKEN || '',
        },
        body: JSON.stringify(updateData)
      });

      const responseData = await response.text();
      console.log('Astra DB response:', responseData);

      if (!response.ok) {
        const parsedError = responseData ? JSON.parse(responseData) : {};
        return NextResponse.json({ 
          success: false,
          message: 'Failed to update user details',
          details: parsedError.description || responseData
        }, { 
          status: response.status 
        });
      }

      return NextResponse.json({ 
        success: true,
        message: 'Details updated successfully'
      });

    } catch (error) {
      console.error('Astra DB error:', error);
      return NextResponse.json({ 
        success: false,
        message: 'Database error',
        error: error instanceof Error ? error.message : 'Unknown error'
      }, { 
        status: 500 
      });
    }

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 500 
    });
  }
}