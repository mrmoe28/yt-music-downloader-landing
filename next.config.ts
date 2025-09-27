import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  // Only use static export for GitHub Pages deployment
  // For Vercel deployment, we need full Next.js functionality with API routes
  ...(isGitHubPages && {
    output: "export",
    basePath: "/yt-music-downloader-landing",
    trailingSlash: true,
    images: {
      unoptimized: true
    }
  }),
  // For Vercel deployment (production), enable image optimization
  ...(!isGitHubPages && {
    images: {
      domains: [], // Add your image domains here
      formats: ['image/webp', 'image/avif'],
    }
  }),
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Enable typed routes for better type safety (disabled for now due to route conflicts)
  // typedRoutes: true,
};

export default nextConfig;
