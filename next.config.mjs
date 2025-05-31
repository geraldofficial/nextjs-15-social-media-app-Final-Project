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
    // Force Pusher to be bundled on the server side
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        'pusher-js': false
      };
    }
    return config;
  }
}

export default nextConfig
