import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // Disable strict mode
  images: {
    domains: ["images.unsplash.com"],
  },
};

export default nextConfig;
