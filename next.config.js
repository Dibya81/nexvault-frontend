/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // disabled for R3F/Three.js compatibility
  transpilePackages: ["three"],
  images: {
    domains: ["images.unsplash.com", "localhost"],
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
};

module.exports = nextConfig;
