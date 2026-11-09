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
  // The sample-day page covers what these four pages said, so each one sends
  // its visitors to the matching section. Temporary on purpose: removing a line
  // brings its page back, because the page source is still in src/app.
  async redirects() {
    return [
      { source: "/features", destination: "/#work", permanent: false },
      { source: "/how-it-works", destination: "/#install", permanent: false },
      { source: "/pricing", destination: "/#install", permanent: false },
      { source: "/about", destination: "/#behind", permanent: false },
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
