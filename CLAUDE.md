# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a YouTube Music Downloader Pro project with three main components:
1. **Tauri Desktop App** (`yt-music-downloader-app/tauri-project/`) - Cross-platform desktop application
2. **Electron Desktop App** (`yt-music-downloader-electron/`) - Alternative Electron-based desktop application
3. **Next.js Landing Page** (`yt-music-downloader-landing/`) - Marketing website with authentication and subscription management

## Development Commands

### Tauri App (`yt-music-downloader-app/tauri-project/`)
```bash
# Development
cd yt-music-downloader-app/tauri-project
npm run dev              # Start frontend dev server
npm run tauri dev        # Start Tauri development mode

# Build
npm run build            # Build frontend
npm run tauri build      # Build desktop app bundles

# Dependencies
npm install              # Install frontend dependencies
cargo install tauri-cli  # Install Tauri CLI (if not installed)
```

### Electron App (`yt-music-downloader-electron/`)
```bash
# Development
cd yt-music-downloader-electron
npm run dev              # Start development with hot reload
npm run dev:renderer     # Start renderer dev server only
npm start               # Start Electron in production mode

# Build & Distribution
npm run build           # Build renderer and create distribution
npm run build:renderer  # Build renderer only
npm run dist           # Create distributable packages
npm run pack           # Pack without creating installer
```

### Next.js Landing Page (`yt-music-downloader-landing/`)
```bash
# Development
cd yt-music-downloader-landing
npm run dev             # Start development server (localhost:3000)

# Build & Deploy
npm run build           # Standard Next.js build
npm run build:github    # Build for GitHub Pages deployment
npm start              # Start production server

# Linting
npm run lint           # Run ESLint
npx tsc --noEmit       # Type checking
```

## Architecture Overview

### Tauri App Architecture
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Rust with Tauri v2 framework
- **Plugins**: File system, dialog, HTTP, opener
- **Build**: Uses Vite for frontend, Cargo for backend
- **Security**: CSP disabled, scoped plugin permissions

### Electron App Architecture
- **Main Process**: `src/main.js` - Window management, app lifecycle
- **Preload**: `src/preload.js` - Secure context bridge
- **Renderer**: React + TypeScript + Vite in `renderer/` directory
- **Build**: electron-builder for packaging
- **Storage**: electron-store for app settings

### Landing Page Architecture
- **Framework**: Next.js 15 with App Router
- **Authentication**: Clerk with OAuth (Google, GitHub)
- **Styling**: Tailwind CSS v4 + ShadCN/UI components
- **Deployment**: GitHub Pages with static export
- **Environment Handling**: Development vs production middleware switching

## Project Structure Patterns

### Common Frontend Patterns
All three projects use:
- React 18+ with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Modern build tools (Vite/Next.js)

### Desktop App Similarities
Both desktop apps:
- Use React frontends with similar component structures
- Implement YouTube music downloading functionality
- Have main app components in `App.tsx`
- Use similar UI patterns and styling

### Key Differences
- **Tauri**: Uses Rust backend, more secure, smaller bundle size
- **Electron**: Uses Node.js backend, more mature ecosystem
- **Landing**: Web-only, focuses on marketing and user acquisition

## Environment Configuration

### Tauri App
- Frontend dev server: `http://localhost:1420`
- No special environment variables required
- Rust dependencies managed by Cargo

### Electron App
- Renderer dev server: `http://localhost:3000`
- Main process watches for renderer server
- Uses concurrently for parallel development

### Landing Page
Required environment variables:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
GITHUB_PAGES=true  # For static export builds
```

## Development Workflow

### Working with Desktop Apps
1. Both apps have similar React frontends - changes in one can often be adapted to the other
2. Main functionality is in `App.tsx` for both projects
3. Use appropriate dev commands based on which app you're working on
4. Test cross-platform compatibility for Tauri, focus on Node.js compatibility for Electron

### Working with Landing Page
1. Uses Next.js App Router structure (`src/app/`)
2. Authentication flows require Clerk setup
3. GitHub Pages deployment requires middleware disabling
4. Static export optimizations are already configured

### Cross-Component Development
- UI components and styling patterns can be shared between projects
- Business logic for YouTube downloading is implemented differently in each app
- Landing page user flows should align with desktop app capabilities

## Build and Deployment

### Desktop App Distribution
- Tauri: Creates native bundles for macOS (.app, .dmg), Windows (.exe, .msi), Linux (.deb, .appimage)
- Electron: Uses electron-builder for similar cross-platform distribution

### Landing Page Deployment
- Automatic GitHub Actions deployment configured
- Manual build: `npm run build:github` creates static export
- Requires Clerk environment variables in GitHub secrets

## Testing Strategy

### Desktop Apps
- No test frameworks currently configured
- Manual testing required for download functionality
- Cross-platform testing needed for distributions

### Landing Page
- ESLint configured for code quality
- TypeScript for type safety
- Manual testing for authentication flows

## Common Issues and Solutions

### Desktop Development
- Ensure native dependencies are installed (Rust for Tauri, Node.js for Electron)
- Port conflicts: Tauri uses 1420, Electron renderer uses 3000
- Permission issues: Check Tauri plugin configurations

### Landing Page Development
- Middleware conflicts with static export - use build:github script
- Clerk authentication requires proper environment setup
- GitHub Pages deployment needs repository secrets configuration