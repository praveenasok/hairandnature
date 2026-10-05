import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  webpack: (config) => {
    config.cache = false;
    return config;
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  }
};

export default nextConfig;
