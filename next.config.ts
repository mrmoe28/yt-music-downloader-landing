import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const isStaticExport = process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  // Limit Next.js to this project directory only
  outputFileTracingRoot: __dirname,
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Static export configuration for GitHub Pages and other static hosts
  ...(isGitHubPages || isStaticExport ? {
    output: "export",
    basePath: isGitHubPages ? "/yt-music-downloader-landing" : "",
    trailingSlash: true,
    images: {
      unoptimized: true
    }
  } : {
    // For Vercel deployment (production), enable full Next.js functionality
    images: {
      remotePatterns: [], // Use remotePatterns instead of domains for Next.js 15
      formats: ['image/webp', 'image/avif'],
    }
  })
};

export default nextConfig;
