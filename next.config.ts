import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // The Jarvis redesign removed these five routes. Outreach and old indexes
  // still point at /audit and /demo, so they redirect rather than 404.
  async redirects() {
    return [
      { source: '/audit', destination: '/form', permanent: true },
      { source: '/demo', destination: '/form', permanent: true },
      { source: '/demo-saas', destination: '/form', permanent: true },
      { source: '/ops', destination: '/', permanent: true },
      { source: '/video-test', destination: '/', permanent: true },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "videos.getoios.com",
      },
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
      },
    ],
  },
};

export default nextConfig;
