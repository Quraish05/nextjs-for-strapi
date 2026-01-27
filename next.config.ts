import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['@apollo/client'],
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
    ],
    // Disable image optimization to avoid "url parameter is not allowed" error
    // This is a workaround for Next.js 16 security validation
    // Images will still load, just without Next.js optimization
    unoptimized: true,
  },
};

export default nextConfig;
