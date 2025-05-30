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
  }
}

export default nextConfig
