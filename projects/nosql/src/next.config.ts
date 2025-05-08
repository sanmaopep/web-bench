import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsHmrCache: !process.env.EVAL,
  },
  images: {
    disableStaticImages: true,
  },
}

export default nextConfig
