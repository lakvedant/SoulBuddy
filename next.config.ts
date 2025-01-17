import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  postcss: true,
  reactStrictMode: true,
};

export default nextConfig;