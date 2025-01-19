// lib/db.ts
import { Client } from 'cassandra-driver';

const client = new Client({
  cloud: {
    secureConnectBundle: process.env.ASTRA_SECURE_CONNECT_BUNDLE!,
  },
  credentials: {
    username: process.env.ASTRA_CLIENT_ID!,
    password: process.env.ASTRA_CLIENT_SECRET!,
  },
  keyspace: process.env.ASTRA_DB_KEYSPACE
});

interface UserData {
  user_id: string;
  email: string;
  username: string;
  full_name: string;
  photo_url?: string;
  date_of_birth?: string;
  time_of_birth?: string;
  latitude?: string;
  longitude?: string;
  timezone?: number;
}

export const createUser = async (userData: UserData) => {
  const query = `
    INSERT INTO users (
      user_id, email, username, full_name, photo_url, 
      date_of_birth, time_of_birth, latitude, longitude, timezone,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, toTimestamp(now()))
  `;

  await client.execute(query, [
    userData.user_id,
    userData.email,
    userData.username,
    userData.full_name,
    userData.photo_url || null,
    userData.date_of_birth || null,
    userData.time_of_birth || null,
    userData.latitude || null,
    userData.longitude || null,
    userData.timezone || null,
  ], { prepare: true });
};

export const getUserById = async (userId: string) => {
  const query = 'SELECT * FROM users WHERE user_id = ?';
  const result = await client.execute(query, [userId], { prepare: true });
  return result.first();
};

export { client };