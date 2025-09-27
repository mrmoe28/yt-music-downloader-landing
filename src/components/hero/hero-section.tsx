import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Music, Zap, Shield } from "lucide-react"
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.03)_25%,rgba(68,68,68,.03)_75%,transparent_75%,transparent),linear-gradient(-45deg,transparent_25%,rgba(68,68,68,.03)_25%,rgba(68,68,68,.03)_75%,transparent_75%,transparent)] bg-[length:20px_20px] dark:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.02)_25%,rgba(255,255,255,.02)_75%,transparent_75%,transparent),linear-gradient(-45deg,transparent_25%,rgba(255,255,255,.02)_25%,rgba(255,255,255,.02)_75%,transparent_75%,transparent)]" />

      {/* Gradient Orbs */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" />

      <div className="relative mx-auto max-w-7xl px-6 py-28 sm:py-36 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Enhanced Badge */}
          <Badge
            variant="secondary"
            className="mb-8 px-6 py-3 text-sm font-semibold bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 text-blue-700 dark:from-blue-950/50 dark:to-purple-950/50 dark:border-blue-800/50 dark:text-blue-300 hover:shadow-lg transition-all duration-300"
          >
            <Zap className="mr-2 h-4 w-4" />
            Lightning Fast Downloads
          </Badge>

          {/* Enhanced Main Headline */}
          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-7xl lg:text-8xl leading-[1.1]">
            Download Any{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent animate-gradient-x">
              YouTube Music
            </span>{" "}
            Track in Seconds
          </h1>

          {/* Enhanced Subheading */}
          <p className="mt-8 text-xl leading-relaxed text-muted-foreground max-w-2xl mx-auto">
            Professional-grade MP3 downloader with one-click conversion. High-quality audio,
            lightning-fast processing, and unlimited downloads for music lovers.
          </p>

          {/* Enhanced CTAs */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  size="lg"
                  className="px-10 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Try Free Download
                </Button>
              </SignInButton>
              <Button
                variant="outline"
                size="lg"
                className="px-10 py-4 text-lg border-2 hover:bg-accent/50 transition-all duration-300"
                asChild
              >
                <a href="/pricing">View Pricing</a>
              </Button>
            </SignedOut>
            <SignedIn>
              <Button
                size="lg"
                className="px-10 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                asChild
              >
                <a href="/dashboard">
                  <Download className="mr-2 h-5 w-5" />
                  Go to Dashboard
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-10 py-4 text-lg border-2 hover:bg-accent/50 transition-all duration-300"
                asChild
              >
                <a href="/pricing">View Pricing</a>
              </Button>
            </SignedIn>
          </div>

          {/* Enhanced Trust Indicators */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
            <div className="flex items-center hover:text-foreground transition-colors duration-300">
              <Shield className="mr-2 h-4 w-4 text-green-500" />
              100% Safe & Secure
            </div>
            <div className="flex items-center hover:text-foreground transition-colors duration-300">
              <Music className="mr-2 h-4 w-4 text-blue-500" />
              320kbps Quality
            </div>
            <div className="flex items-center hover:text-foreground transition-colors duration-300">
              <Download className="mr-2 h-4 w-4 text-purple-500" />
              No Registration Required
            </div>
          </div>
        </div>

        {/* Enhanced Hero Image/Demo */}
        <div className="mx-auto mt-20 max-w-5xl">
          <div className="relative rounded-3xl bg-card/80 backdrop-blur-sm p-8 shadow-2xl ring-1 ring-border/50 hover:shadow-3xl transition-all duration-500">
            <div className="aspect-video rounded-2xl bg-gradient-to-br from-blue-100 via-purple-100 to-blue-200 dark:from-blue-950/50 dark:via-purple-950/50 dark:to-blue-900/50 flex items-center justify-center relative overflow-hidden">
              {/* Animated background elements */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />

              <div className="text-center z-10">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse" />
                  <Music className="relative mx-auto h-20 w-20 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-3">
                  App Demo Preview
                </h3>
                <p className="text-muted-foreground text-lg">
                  Interactive demo and screenshots will be showcased here
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}