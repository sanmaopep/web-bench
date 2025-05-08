import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsHmrCache: !process.env.EVAL,
  },
  serverExternalPackages: ['sequelize'],
  images: {
    disableStaticImages: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
