/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io'
      },
      {
        protocol: 'https',
        hostname: 'uploadthing.com'
      }
    ]
  },
  experimental: {
    optimizePackageImports: ['@uploadthing/react', '@tiptap/react'],
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle pusher-js on the client to prevent issues
      config.resolve.alias = {
        ...config.resolve.alias,
        'pusher-js': false
      };
    }
    return config;
  }
}

export default nextConfig
