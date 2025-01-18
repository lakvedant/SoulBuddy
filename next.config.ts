import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com', // For Google profile images
      'avatars.githubusercontent.com', // For GitHub profile images (if you're using GitHub auth)
    ],
  },
  env: {
    ASTRA_DB_ID: process.env.ASTRA_DB_ID,
    ASTRA_DB_REGION: process.env.ASTRA_DB_REGION,
    ASTRA_DB_KEYSPACE: process.env.ASTRA_DB_KEYSPACE,
    ASTRA_DB_APPLICATION_TOKEN: process.env.ASTRA_DB_APPLICATION_TOKEN,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  postcss: true,
  reactStrictMode: true,
};

export default nextConfig;