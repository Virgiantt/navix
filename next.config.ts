import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Add this line
  },
  // Your other configuration options here
};

export default nextConfig;