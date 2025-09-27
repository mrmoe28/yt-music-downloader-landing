import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const isStaticExport = process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  // Static export configuration for GitHub Pages and other static hosts
  ...((isGitHubPages || isStaticExport) && {
    output: "export",
    basePath: isGitHubPages ? "/yt-music-downloader-landing" : "",
    trailingSlash: true,
    images: {
      unoptimized: true
    },
    // Disable features incompatible with static export
    experimental: {
      // Disable middleware for static export
      middlewareSourceMaps: false,
    }
  }),
  // For Vercel deployment (production), enable full Next.js functionality
  ...(!isGitHubPages && !isStaticExport && {
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
