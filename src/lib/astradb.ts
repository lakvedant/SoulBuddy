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

export const createUser = async (userData: {
  user_id: string;
  email: string;
  username: string;
  full_name: string;
  photo_url?: string;
}) => {
  const query = `
    INSERT INTO users (
      user_id, email, username, full_name, photo_url, created_at
    ) VALUES (?, ?, ?, ?, ?, toTimestamp(now()))
  `;

  await client.execute(query, [
    userData.user_id,
    userData.email,
    userData.username,
    userData.full_name,
    userData.photo_url || null,
  ], { prepare: true });
};

export const getUserById = async (userId: string) => {
  const query = 'SELECT * FROM users WHERE user_id = ?';
  const result = await client.execute(query, [userId], { prepare: true });
  return result.first();
};

export { client };