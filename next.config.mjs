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
    },
    serverComponentsExternalPackages: ['pusher']
  },
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        'supports-color': false,
      };
    }
    return config;
  },
  transpilePackages: ['pusher-js']
}

export default nextConfig
