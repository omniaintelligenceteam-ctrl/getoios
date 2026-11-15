import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // The front door is a self-contained static page (public/jarvis/index.html,
  // Jarvis as three hires in one). Serving it at "/" is one rewrite.
  async rewrites() {
    return {
      beforeFiles: [{ source: "/", destination: "/jarvis/index.html" }],
      afterFiles: [],
      fallback: [],
    };
  },
  // The one page replaced the old site. Each old address sends its
  // visitors to the matching section of the page.
  async redirects() {
    return [
      { source: "/features", destination: "/#assistant", permanent: false },
      { source: "/how-it-works", destination: "/#setup", permanent: false },
      { source: "/pricing", destination: "/#setup", permanent: false },
      { source: "/about", destination: "/#behind", permanent: false },
      { source: "/solutions", destination: "/#assistant", permanent: false },
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
