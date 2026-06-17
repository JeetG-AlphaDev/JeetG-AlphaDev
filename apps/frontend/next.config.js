/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost', 'api.noteshub.com'],
    dangerouslyAllowSVG: true,
  },
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3001',
    GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID,
    PLAUSIBLE_DOMAIN: process.env.PLAUSIBLE_DOMAIN,
    ADSENSE_CLIENT_ID: process.env.ADSENSE_CLIENT_ID,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL || 'http://localhost:3001'}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;