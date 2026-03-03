import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Security: Hide X-Powered-By header
  poweredByHeader: false,

  // Redirect /login and /signup to the app
  redirects: async () => [
    {
      source: '/login',
      destination: 'https://app.autocrew-ai.com/login',
      permanent: true,
    },
    {
      source: '/signup',
      destination: 'https://app.autocrew-ai.com/signup',
      permanent: true,
    },
  ],

  // Security headers for production hardening
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin',
        },
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on',
        },
      ],
    },
  ],

  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
