import type { NextConfig } from 'next'
 
const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  images: {
    remotePatterns: [
        new URL('https://cdn.jsdelivr.net/gh/faker-js/**'),
        new URL('https://avatars.githubusercontent.com/**')
    ]
  }
}
 
export default nextConfig