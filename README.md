# YouTube Music Downloader Pro - Landing Page

A professional marketing landing page for YouTube Music Downloader Pro with authentication, subscription management, and GitHub Pages deployment.

## 🚀 Features

- **Modern Landing Page**: Hero section, features showcase, pricing plans
- **Authentication System**: Clerk integration with OAuth (Google, GitHub)
- **Subscription Management**: Free trial + Pro plan with Clerk Billing
- **Download Functionality**: Mock YouTube music download system
- **Responsive Design**: Mobile-first with ShadCN/UI components
- **GitHub Pages Ready**: Static export for easy deployment

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + ShadCN/UI
- **Authentication**: Clerk
- **Icons**: Lucide React
- **Deployment**: GitHub Pages

## 📦 Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd yt-music-downloader-landing
npm install
```

2. **Set up environment variables:**
```bash
cp .env.local.example .env.local
```

Add your Clerk API keys to `.env.local`:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-key-here
CLERK_SECRET_KEY=sk_test_your-key-here
```

3. **Start development server:**
```bash
npm run dev
```

Visit http://localhost:3000

## 🔑 Clerk Setup

1. **Create Clerk Account**: Go to [clerk.com](https://clerk.com)
2. **Create Application**: "YouTube Music Downloader Pro"
3. **Get API Keys**: Dashboard → API Keys
4. **Enable OAuth**: Dashboard → SSO Connections
   - Enable Google OAuth
   - Enable GitHub OAuth

## 🌐 GitHub Pages Deployment

### Automatic Deployment

1. **Push to GitHub:**
```bash
git add .
git commit -m "Initial deployment"
git push origin main
```

2. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: "GitHub Actions"

3. **Add Secrets:**
   - Go to repository Settings → Secrets and Variables → Actions
   - Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Add `CLERK_SECRET_KEY`

### Manual Build

```bash
npm run build:github
```

This creates a static export in the `out/` directory.

## 📁 Project Structure

```
yt-music-downloader-landing/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Landing page
│   │   ├── pricing/           # Pricing page
│   │   ├── dashboard/         # User dashboard
│   │   ├── sign-in/           # Authentication pages
│   │   └── api/               # API routes
│   ├── components/            # Reusable components
│   │   ├── ui/               # ShadCN components
│   │   ├── hero/             # Hero section
│   │   ├── features/         # Features showcase
│   │   ├── pricing/          # Pricing components
│   │   ├── download/         # Download functionality
│   │   └── layouts/          # Navigation & footer
│   ├── lib/                  # Utilities & hooks
│   └── middleware.ts         # Clerk middleware
├── .github/workflows/        # GitHub Actions
├── public/                   # Static assets
└── CONTEXT.md               # Project documentation
```

## 🎯 Pages Overview

### Landing Page (`/`)
- Hero section with value proposition
- Features showcase (9 key features)
- Pricing preview
- Trust indicators and social proof

### Pricing Page (`/pricing`)
- Detailed plan comparison
- FAQ section
- Feature benefits
- Money-back guarantee

### Dashboard (`/dashboard`)
- User stats and download history
- Download functionality
- Subscription management
- Upgrade prompts for free users

## 🔧 Configuration

### Development vs Production

The app automatically detects the environment:

- **Development**: Full Clerk middleware and authentication
- **GitHub Pages**: Static export without middleware

### Environment Variables

```bash
# Required for authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk URLs (optional, has defaults)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# GitHub Pages build flag
GITHUB_PAGES=true
```

## 🧪 Testing

```bash
# Lint code
npm run lint

# Type check
npx tsc --noEmit

# Test GitHub Pages build
npm run build:github
```

## 📈 Business Model

- **Free Trial**: 1 high-quality MP3 download
- **Pro Plan**: $9.99/month for unlimited downloads
- **Conversion Strategy**: Trial → value demonstration → upgrade

## 🔮 Future Enhancements

- [ ] Clerk Billing integration for subscription payments
- [ ] Real YouTube download API integration
- [ ] Analytics and conversion tracking
- [ ] Email marketing integration
- [ ] Customer support chat

## 📄 License

Private project for YouTube Music Downloader Pro.

---

**Live Demo**: Will be available at GitHub Pages URL after deployment
**Development Server**: http://localhost:3000

<!-- Test deployment trigger - Updated: 2025-09-27T05:09:00Z -->
