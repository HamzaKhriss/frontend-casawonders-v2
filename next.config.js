/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    // ✅ remplace l’ancienne clé `domains`
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',      // toutes les images Unsplash
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',      // toutes les images Picsum
      },
    ],
  },

  // ─── Proxy API sous /api pour faire du same-site et autoriser le cookie ───
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://backend-flask-54ae.onrender.com/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
