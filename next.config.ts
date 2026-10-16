import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep this app deployed as a Next.js server app on Vercel so API routes
  // for the private analytics dashboard can run.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
