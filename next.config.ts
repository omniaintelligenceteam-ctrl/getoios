import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // The front door is a self-contained static page (public/jarvis/index.html,
  // the sample day). Serving it at "/" is one rewrite.
  async rewrites() {
    return {
      beforeFiles: [{ source: "/", destination: "/jarvis/index.html" }],
      afterFiles: [],
      fallback: [],
    };
  },
  // The sample-day page replaced the old site. Each old address sends its
  // visitors to the matching section of the page.
  async redirects() {
    return [
      { source: "/features", destination: "/#work", permanent: false },
      { source: "/how-it-works", destination: "/#install", permanent: false },
      { source: "/pricing", destination: "/#install", permanent: false },
      { source: "/about", destination: "/#behind", permanent: false },
      { source: "/solutions", destination: "/#work", permanent: false },
      { source: "/form", destination: "/#start", permanent: false },
      { source: "/audit", destination: "/#start", permanent: false },
      { source: "/demo", destination: "/#start", permanent: false },
    ];
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
