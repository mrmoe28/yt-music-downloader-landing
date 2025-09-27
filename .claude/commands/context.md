---
slug: context
description: Display project context and development guidelines for YouTube Music Downloader Pro
tags: [context, development, guidelines]
---

# Project Context

Display the comprehensive project context and development guidelines for the YouTube Music Downloader Pro application.

## Usage

Use this command to:
- Get an overview of the project structure and components
- Reference development commands and setup instructions
- Understand the technology stack and architecture
- Access troubleshooting guides and common solutions
- Review coding standards and best practices

## Project Components

This project consists of three main components:

1. **Tauri Desktop App** (`yt-music-downloader-app/tauri-project/`)
   - Cross-platform native desktop application
   - Rust backend with React frontend
   - High performance and security

2. **Electron Desktop App** (`yt-music-downloader-electron/`)
   - Alternative desktop application
   - Node.js backend with React frontend
   - Mature ecosystem and tooling

3. **Next.js Landing Page** (`yt-music-downloader-landing/`)
   - Marketing website with authentication
   - Subscription management with Stripe
   - User dashboard and download interface

## Quick Reference

### Development Commands
```bash
# Tauri App
cd yt-music-downloader-app/tauri-project
npm run dev              # Frontend dev server (localhost:1420)
npm run tauri dev        # Tauri development mode

# Electron App  
cd yt-music-downloader-electron
npm run dev              # Development with hot reload
npm run dev:renderer     # Renderer dev server (localhost:3000)

# Landing Page
cd yt-music-downloader-landing
npm run dev             # Development server (localhost:3000)
npm run build:github    # Build for GitHub Pages
```

### Key Technologies
- **Frontend**: React 18+, TypeScript, Tailwind CSS
- **Backend**: Rust (Tauri) / Node.js (Electron)
- **Authentication**: Clerk with OAuth
- **Payments**: Stripe integration
- **YouTube Processing**: yt-dlp integration

### Core Features
- YouTube music downloading (MP3, FLAC)
- USB drive integration
- Subscription management
- Cross-platform support
- Real-time progress tracking

## Development Guidelines

### Code Standards
- Always use functional React components
- Maintain TypeScript type safety
- Use Tailwind CSS for styling
- Follow existing patterns for consistency

### File Organization
- Keep components small and focused
- Use `lib/` directories for utilities
- Define interfaces in component files
- Prefer Tailwind classes over custom CSS

### Cross-Platform Considerations
- Test on macOS, Windows, and Linux
- Ensure yt-dlp is installed on target systems
- Handle file system operations safely
- Maintain UI consistency between Tauri and Electron

## Environment Setup

### Landing Page Required Variables
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Desktop Apps
- yt-dlp must be installed on the system
- Rust toolchain required for Tauri development
- No special environment variables needed

## Common Issues & Solutions

### Desktop Development
- **Port Conflicts**: Tauri (1420), Electron renderer (3000)
- **yt-dlp Missing**: Install via pip or package manager
- **Permission Issues**: Check Tauri plugin configurations
- **Build Failures**: Ensure all dependencies installed

### Landing Page Development
- **Middleware Conflicts**: Use `build:github` for static export
- **Clerk Authentication**: Requires proper environment setup
- **Stripe Integration**: Test with Stripe test keys first
- **GitHub Pages**: Configure repository secrets

## Current Status

### Completed Features ✅
- Basic YouTube music downloading
- Multiple audio quality options
- USB drive detection and transfer
- Subscription system with Stripe
- User authentication with Clerk
- Cross-platform desktop apps
- Responsive landing page

### In Progress 🔄
- Enhanced error handling
- Performance optimizations
- Additional metadata extraction
- Batch download queue management

### Future Enhancements 📋
- Playlist download support
- Cloud storage integration
- Mobile companion apps
- Advanced audio processing

## Focus Areas

### When Working on Desktop Apps
1. Maintain UI consistency between versions
2. Test cross-platform compatibility
3. Ensure reliable yt-dlp integration
4. Handle file operations safely

### When Working on Landing Page
1. Follow Next.js App Router patterns
2. Maintain authentication flows
3. Test Stripe integration thoroughly
4. Ensure responsive design

### When Making Changes
1. Update all three projects if needed
2. Test thoroughly before committing
3. Document breaking changes
4. Maintain backward compatibility

## Reference Links

- [Tauri Documentation](https://tauri.app/)
- [Electron Documentation](https://www.electronjs.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [yt-dlp Documentation](https://github.com/yt-dlp/yt-dlp)

---

**Remember**: This is a professional music downloading application. Always prioritize user experience, security, and cross-platform compatibility. When in doubt, refer to existing code patterns and maintain consistency across all components.
