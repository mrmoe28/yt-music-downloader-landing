import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Music, Zap, Shield } from "lucide-react"
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.05)_25%,rgba(68,68,68,.05)_75%,transparent_75%,transparent),linear-gradient(-45deg,transparent_25%,rgba(68,68,68,.05)_25%,rgba(68,68,68,.05)_75%,transparent_75%,transparent)] bg-[length:20px_20px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {/* Badge */}
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-semibold">
            <Zap className="mr-2 h-4 w-4" />
            Lightning Fast Downloads
          </Badge>

          {/* Main Headline */}
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Download Any{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              YouTube Music
            </span>{" "}
            Track in Seconds
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Professional-grade MP3 downloader with one-click conversion. High-quality audio,
            lightning-fast processing, and unlimited downloads for music lovers.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <SignedOut>
              <SignInButton mode="modal">
                <Button size="lg" className="px-8 py-3 text-lg font-semibold">
                  <Download className="mr-2 h-5 w-5" />
                  Try Free Download
                </Button>
              </SignInButton>
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg" asChild>
                <a href="/pricing">View Pricing</a>
              </Button>
            </SignedOut>
            <SignedIn>
              <Button size="lg" className="px-8 py-3 text-lg font-semibold" asChild>
                <a href="/dashboard">
                  <Download className="mr-2 h-5 w-5" />
                  Go to Dashboard
                </a>
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg" asChild>
                <a href="/pricing">View Pricing</a>
              </Button>
            </SignedIn>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex items-center justify-center gap-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              100% Safe & Secure
            </div>
            <div className="flex items-center">
              <Music className="mr-2 h-4 w-4" />
              320kbps Quality
            </div>
            <div className="flex items-center">
              <Download className="mr-2 h-4 w-4" />
              No Registration Required
            </div>
          </div>
        </div>

        {/* Hero Image/Demo */}
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="relative rounded-2xl bg-white p-8 shadow-2xl ring-1 ring-gray-200">
            <div className="aspect-video rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <div className="text-center">
                <Music className="mx-auto h-16 w-16 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  App Demo Preview
                </h3>
                <p className="text-gray-600">
                  Screenshot or demo video will be placed here
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}