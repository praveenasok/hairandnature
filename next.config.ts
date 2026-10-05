import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    config.cache = false;
    config.infrastructureLogging = { level: 'verbose' };
    return config;
  },
  turbopack: {},
  experimental: {
    workerThreads: false,
    cpus: 1,
    optimizePackageImports: ['lucide-react'],
  }
};

export default nextConfig;
