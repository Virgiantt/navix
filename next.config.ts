import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(
  // This is the default (also the `src` folder is supported out of the box)
  './src/i18n/request.ts'
);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors
  },

  // MOBILE TESTING FIX: (allowedDevOrigins is not a valid Next.js config option and has been removed)
  experimental: {
  },

  // Add rewrites to ensure API routes bypass internationalization
  async rewrites() {
    return [
      {
        source: '/:locale/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

export default withNextIntl(nextConfig);