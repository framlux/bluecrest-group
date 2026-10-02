import type { NextConfig } from "next";
import { redirects as siteRedirects } from "./src/data/redirects";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  experimental: {
    taint: true,
  },
  output: 'standalone',
  serverExternalPackages: ['postgres'],
  async redirects() {
    return siteRedirects;
  },
};

export default nextConfig;
