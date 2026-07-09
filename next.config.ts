import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'randomuser.me' },
      { protocol: 'https', hostname: 'pub-9c9ec03fb08944f5ae80942c706926e6.r2.dev' },
    ],
    deviceSizes: [384, 640, 750, 1080, 1200, 1920],
    imageSizes: [48, 64, 96, 128, 256],
  },
  experimental: {
    optimizeCss: true,
  },
}

export default nextConfig
