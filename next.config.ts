import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // Disable strict mode
  images: {
    domains: ["images.unsplash.com"],
  },
  webpack: (config) => {
    config.resolve.alias['markdown-it'] = require.resolve('markdown-it');
    return config;
  },
};

export default nextConfig;
