import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // The front door is a self-contained static page (public/jarvis) built and
  // verified with scroll-craft. Serving it at "/" is one rewrite, and rollback
  // is deleting it: src/app/page.tsx (the previous homepage) stays in place.
  async rewrites() {
    return {
      beforeFiles: [{ source: "/", destination: "/jarvis/index.html" }],
      afterFiles: [],
      fallback: [],
    };
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
