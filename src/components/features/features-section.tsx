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
    <section className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">
            Powerful Features
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need for perfect downloads
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Professional-grade tools designed for music enthusiasts who demand quality,
            speed, and reliability in their downloading experience.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card key={index} className="group relative overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {feature.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-semibold leading-7 text-gray-900">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-base text-gray-600 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>

                  {/* Hover effect gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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