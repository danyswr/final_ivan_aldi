/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["drive.google.com", "lh3.googleusercontent.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drive.google.com",
        pathname: "/**",
      },
    ],
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: [],
  },
  output: 'standalone',
  trailingSlash: true,
}

module.exports = nextConfig
