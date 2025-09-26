import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Download,
  Music,
  Zap,
  Shield,
  Headphones,
  FolderOpen,
  Smartphone,
  Clock,
  List,
  Settings
} from "lucide-react"

const features = [
  {
    icon: Music,
    title: "High-Quality Audio",
    description: "Extract MP3s in pristine 320kbps quality. Preserve every detail of your favorite tracks.",
    badge: "Premium Quality"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Download any YouTube music track in seconds. Our optimized engine processes files instantly.",
    badge: "Ultra Fast"
  },
  {
    icon: List,
    title: "Batch Downloads",
    description: "Download entire playlists or multiple tracks simultaneously. Save time with bulk processing.",
    badge: "Pro Feature"
  },
  {
    icon: Headphones,
    title: "Metadata Preservation",
    description: "Keep song titles, artist names, and album art intact. Perfect organization every time.",
    badge: "Smart Tags"
  },
  {
    icon: Shield,
    title: "100% Safe & Secure",
    description: "No malware, no viruses, no tracking. Your privacy and security are our top priority.",
    badge: "Verified Safe"
  },
  {
    icon: Smartphone,
    title: "Cross-Platform",
    description: "Works seamlessly on Windows, macOS, and mobile devices. Download anywhere, anytime.",
    badge: "Universal"
  },
  {
    icon: FolderOpen,
    title: "Smart Organization",
    description: "Automatically organize downloads by artist, album, or playlist. Keep your library tidy.",
    badge: "Auto-Organize"
  },
  {
    icon: Clock,
    title: "No Time Limits",
    description: "Download tracks of any length. From 30-second clips to full concerts and live sessions.",
    badge: "Unlimited"
  },
  {
    icon: Settings,
    title: "Customizable Settings",
    description: "Choose output format, quality, and destination folder. Tailor the app to your preferences.",
    badge: "Flexible"
  }
]

export default function FeaturesSection() {
  return (
    <section className="py-24 sm:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary mb-4">
            Powerful Features
          </h2>
          <p className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-tight">
            Everything you need for{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              perfect downloads
            </span>
          </p>
          <p className="mt-8 text-xl leading-relaxed text-muted-foreground max-w-2xl mx-auto">
            Professional-grade tools designed for music enthusiasts who demand quality,
            speed, and reliability in their downloading experience.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mx-auto mt-20 max-w-2xl sm:mt-24 lg:mt-28 lg:max-w-none">
          <div className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card key={index} className="group relative overflow-hidden border-0 bg-card/50 backdrop-blur-sm shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:scale-105">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-xs bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 text-blue-700 dark:from-blue-950/50 dark:to-purple-950/50 dark:border-blue-800/50 dark:text-blue-300"
                      >
                        {feature.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-semibold leading-7 text-foreground group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-base text-muted-foreground leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>

                  {/* Enhanced hover effect gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <div className="absolute inset-0 ring-1 ring-border/50 rounded-lg group-hover:ring-primary/20 transition-all duration-300" />
                </Card>
              )
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-600 mb-6">
            Ready to experience the difference?
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="outline" className="px-4 py-2">
              <Download className="mr-2 h-4 w-4" />
              1 Free Trial Download
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Shield className="mr-2 h-4 w-4" />
              No Credit Card Required
            </Badge>
          </div>
        </div>
      </div>
    </section>
  )
}