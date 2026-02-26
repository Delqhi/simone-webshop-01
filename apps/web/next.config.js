/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  async headers() {
    const allowlist = process.env.CORS_ALLOWLIST || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000')
    const allowedOrigins = allowlist
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean)

    const origin = allowedOrigins[0] || ''
    const headers = [
      { key: 'Access-Control-Allow-Credentials', value: 'true' },
      { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
      { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
    ]
    if (origin) {
      headers.push({ key: 'Access-Control-Allow-Origin', value: origin })
    }

    return [
      {
        source: '/api/:path*',
        headers,
      },
    ]
  },
}

module.exports = nextConfig
