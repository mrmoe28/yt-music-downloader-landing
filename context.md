# YouTube Music Downloader Pro - Project Context

## 🎯 Project Overview

This is a **YouTube Music Downloader Pro** project consisting of three main components:

1. **Tauri Desktop App** (`yt-music-downloader-app/tauri-project/`) - Cross-platform native desktop application
2. **Electron Desktop App** (`yt-music-downloader-electron/`) - Alternative Electron-based desktop application  
3. **Next.js Landing Page** (`yt-music-downloader-landing/`) - Marketing website with authentication and subscription management

## 🏗️ Architecture & Technology Stack

### Desktop Applications
- **Frontend**: React 18+ with TypeScript, Tailwind CSS, Lucide React icons
- **Tauri Backend**: Rust with Tauri v2 framework, yt-dlp integration
- **Electron Backend**: Node.js with IPC communication, yt-dlp integration
- **Build Tools**: Vite for frontend, Cargo for Tauri, electron-builder for Electron

### Landing Page
- **Framework**: Next.js 15 with App Router
- **Authentication**: Clerk with OAuth (Google, GitHub)
- **Payments**: Stripe for subscription management
- **Styling**: Tailwind CSS v4 + ShadCN/UI components
- **Deployment**: Vercel with GitHub Pages fallback

## 🔧 Core Functionality

### YouTube Music Downloading
- **URL Processing**: Validates YouTube URLs (youtube.com, youtu.be)
- **Metadata Extraction**: Gets title, duration, thumbnail, uploader info
- **Audio Quality**: 320kbps MP3, 256kbps MP3, FLAC options
- **Download Management**: Real-time progress, batch downloads, error handling

### File Management
- **Output Configuration**: Custom download folders, native file dialogs
- **USB Integration**: Automatic USB drive detection, one-click file transfer
- **Cross-platform**: macOS, Windows, Linux support

### Subscription System
- **Free Trial**: 1 download with basic features
- **Pro Plan**: Unlimited downloads, premium quality, priority support
- **Payment Processing**: Stripe integration with webhook handling

## 📁 Project Structure

```
/Users/ekodevapps/Desktop/YouTube-Music-Downloader-Pro-Installer/
├── yt-music-downloader-app/tauri-project/     # Tauri desktop app
├── yt-music-downloader-electron/              # Electron desktop app
├── yt-music-downloader-landing/               # Next.js landing page
├── YouTube Music Downloader Pro.app/          # Built macOS app
├── CLAUDE.md                                  # Development guidance
├── FEATURES_DOCUMENTATION.md                  # Comprehensive features doc
└── context.md                                 # This file
```

## 🚀 Development Commands

### Tauri App
```bash
cd yt-music-downloader-app/tauri-project
npm run dev              # Start frontend dev server (localhost:1420)
npm run tauri dev        # Start Tauri development mode
npm run build            # Build frontend
npm run tauri build      # Build desktop app bundles
```

### Electron App
```bash
cd yt-music-downloader-electron
npm run dev              # Start development with hot reload
npm run dev:renderer     # Start renderer dev server only (localhost:3000)
npm run build           # Build renderer and create distribution
npm run dist           # Create distributable packages
```

### Landing Page
```bash
cd yt-music-downloader-landing
npm run dev             # Start development server (localhost:3000)
npm run build           # Standard Next.js build
npm run build:github    # Build for GitHub Pages deployment
npm start              # Start production server
```

## 🔑 Key Files & Components

### Desktop Apps
- **Main Process**: `src/main.js` (Electron) / `src-tauri/src/main.rs` (Tauri)
- **Frontend**: `App.tsx` - Main React component with download functionality
- **Preload**: `src/preload.js` (Electron) - Secure IPC bridge
- **Backend Logic**: `src-tauri/src/lib.rs` (Tauri) - Rust implementation

### Landing Page
- **Main Page**: `src/app/page.tsx` - Homepage with hero and features
- **Dashboard**: `src/app/dashboard/page.tsx` - User dashboard
- **API Routes**: `src/app/api/` - Stripe checkout, webhooks, downloads
- **Components**: `src/components/` - Reusable UI components

## 🛠️ Development Guidelines

### Code Standards
- **Always use functional React components** (no class components)
- **TypeScript everywhere** - maintain type safety
- **Tailwind CSS for styling** - utility-first approach
- **Follow existing patterns** - maintain consistency across projects

### File Organization
- **Components**: Keep components small and focused
- **Utilities**: Common functions in `lib/` directories
- **Types**: Define interfaces in component files or separate type files
- **Styling**: Use Tailwind classes, avoid custom CSS when possible

### Cross-Platform Considerations
- **Tauri**: More secure, smaller bundle, Rust backend
- **Electron**: More mature ecosystem, Node.js backend
- **Both**: Should have similar UI/UX, different backend implementations

## 🔐 Environment Variables

### Landing Page Required
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
GITHUB_PAGES=true  # For static export builds
```

### Desktop Apps
- **No special environment variables required**
- **yt-dlp must be installed** on the system
- **Rust toolchain required** for Tauri development

## 🎨 UI/UX Patterns

### Design System
- **Color Scheme**: Blue primary (#3B82F6), purple secondary (#8B5CF6)
- **Typography**: System fonts with proper hierarchy
- **Spacing**: Consistent padding/margins using Tailwind scale
- **Icons**: Lucide React for consistency

### Component Patterns
- **Cards**: Use ShadCN Card components for content sections
- **Buttons**: Consistent button variants (primary, secondary, outline)
- **Forms**: Proper validation and error handling
- **Loading States**: Spinner animations and progress indicators

## 🚨 Common Issues & Solutions

### Desktop Development
- **Port Conflicts**: Tauri uses 1420, Electron renderer uses 3000
- **yt-dlp Missing**: Install via pip or package manager
- **Permission Issues**: Check Tauri plugin configurations
- **Build Failures**: Ensure all dependencies are installed

### Landing Page Development
- **Middleware Conflicts**: Use `build:github` script for static export
- **Clerk Authentication**: Requires proper environment setup
- **Stripe Integration**: Test with Stripe test keys first
- **GitHub Pages**: Configure repository secrets for deployment

## 📋 Current Status & Priorities

### Completed Features
- ✅ Basic YouTube music downloading functionality
- ✅ Multiple audio quality options (MP3, FLAC)
- ✅ USB drive detection and file transfer
- ✅ Subscription system with Stripe integration
- ✅ User authentication with Clerk
- ✅ Cross-platform desktop apps (Tauri & Electron)
- ✅ Responsive landing page with marketing content

### In Progress
- 🔄 Enhanced error handling and user feedback
- 🔄 Performance optimizations
- 🔄 Additional metadata extraction
- 🔄 Batch download queue management

### Future Enhancements
- 📋 Playlist download support
- 📋 Cloud storage integration
- 📋 Mobile companion apps
- 📋 Advanced audio processing options

## 🎯 Development Focus Areas

### When Working on Desktop Apps
1. **Maintain UI consistency** between Tauri and Electron versions
2. **Test cross-platform compatibility** (macOS, Windows, Linux)
3. **Ensure yt-dlp integration** works reliably
4. **Handle file system operations** safely with proper error handling

### When Working on Landing Page
1. **Follow Next.js App Router patterns** (not Pages Router)
2. **Maintain authentication flows** with Clerk
3. **Test Stripe integration** thoroughly
4. **Ensure responsive design** across all devices

### When Making Changes
1. **Update all three projects** if changes affect shared functionality
2. **Test thoroughly** before committing
3. **Document breaking changes** in commit messages
4. **Maintain backward compatibility** when possible

## 🔍 Debugging Tips

### Desktop Apps
- **Check console logs** in development mode
- **Verify yt-dlp installation** and version
- **Test with different YouTube URLs** to ensure compatibility
- **Check file permissions** for download directories

### Landing Page
- **Use browser dev tools** for client-side debugging
- **Check Vercel logs** for server-side issues
- **Verify environment variables** are properly set
- **Test authentication flows** in different browsers

## 📚 Reference Documentation

- **Tauri Docs**: https://tauri.app/
- **Electron Docs**: https://www.electronjs.org/
- **Next.js Docs**: https://nextjs.org/docs
- **Clerk Docs**: https://clerk.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **yt-dlp Docs**: https://github.com/yt-dlp/yt-dlp

---

**Remember**: This is a professional music downloading application. Always prioritize user experience, security, and cross-platform compatibility. When in doubt, refer to the existing code patterns and maintain consistency across all three project components.
