import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";
const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  // Only use static export for GitHub Pages deployment
  ...(isGitHubPages && {
    output: "export",
    basePath: "/yt-music-downloader-landing",
    trailingSlash: true,
  }),
  images: {
    unoptimized: true
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
