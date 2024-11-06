/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Add this to ensure static files are handled correctly
  async headers() {
    return [
      {
        source: '/audio/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'audio/mpeg',
          },
        ],
      },
    ];
  }
};

module.exports = nextConfig;
