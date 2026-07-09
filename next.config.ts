import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    loader: 'custom',
    loaderFile: './lib/image-loader.ts',
    deviceSizes: [384, 640, 750, 1080, 1200, 1920],
    imageSizes: [48, 64, 96, 128, 256],
  },
  experimental: {
    optimizeCss: true,
  },
}

export default nextConfig
