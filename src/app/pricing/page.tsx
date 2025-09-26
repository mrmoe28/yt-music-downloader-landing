import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Zap, Crown, Download, Star, Music, Shield, Headphones } from "lucide-react"
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs"
import Navigation from "@/components/layouts/navigation"
import Footer from "@/components/layouts/footer"
import SubscribeButton from "@/components/ui/subscribe-button"

const plans = [
  {
    name: "Free Trial",
    price: "$0",
    period: "one-time",
    description: "Perfect for trying our service",
    planId: null, // No plan ID for free tier
    features: [
      "1 high-quality MP3 download",
      "320kbps audio quality",
      "Metadata preservation",
      "No registration required",
      "Safe & secure processing",
      "Standard processing speed"
    ],
    limitations: [
      "Only 1 download allowed",
      "No batch downloads",
      "No playlist support",
      "Basic support only"
    ],
    cta: "Start Free Trial",
    popular: false,
    icon: Download,
    gradient: "from-gray-500 to-gray-600"
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "per month",
    description: "Unlimited downloads for serious music lovers",
    planId: "price_1SBcQjEUI4iqGSxZTP77EM4p", // Stripe Price ID for $9.99/month
    features: [
      "Unlimited MP3 downloads",
      "320kbps premium quality",
      "Batch playlist downloads",
      "Advanced metadata tags",
      "Priority processing speed",
      "Cross-platform support",
      "Smart auto-organization",
      "Download history tracking",
      "Multiple format options",
      "24/7 premium support",
      "Early access to features",
      "No ads or watermarks"
    ],
    limitations: [],
    cta: "Upgrade to Pro",
    popular: true,
    icon: Crown,
    gradient: "from-blue-500 to-purple-600"
  }
]

const features = [
  {
    icon: Music,
    title: "High-Quality Audio",
    description: "320kbps MP3 extraction with pristine sound quality"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Download any track in seconds with optimized processing"
  },
  {
    icon: Shield,
    title: "100% Safe",
    description: "Secure downloads with no malware or privacy concerns"
  },
  {
    icon: Headphones,
    title: "Perfect Metadata",
    description: "Keep song titles, artists, and album art intact"
  }
]

export default function PricingPage() {
  return (
    <>
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Choose Your{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Perfect Plan
                </span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Start with a free trial, then unlock unlimited downloads with our Pro plan.
                No hidden fees, cancel anytime.
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex items-center justify-center gap-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                30-Day Money Back
              </div>
              <div className="flex items-center">
                <Star className="mr-2 h-4 w-4" />
                Trusted by 50k+ Users
              </div>
              <div className="flex items-center">
                <Zap className="mr-2 h-4 w-4" />
                Instant Activation
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-24 sm:py-32 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto grid max-w-lg grid-cols-1 items-center gap-8 lg:max-w-4xl lg:grid-cols-2">
              {plans.map((plan, index) => {
                const IconComponent = plan.icon
                return (
                  <Card key={index} className={`relative overflow-hidden ${
                    plan.popular
                      ? 'border-2 border-blue-500 shadow-2xl scale-105'
                      : 'border shadow-lg'
                  }`}>
                    {plan.popular && (
                      <div className="absolute top-0 right-0 left-0">
                        <div className={`bg-gradient-to-r ${plan.gradient} text-white text-center py-3 px-4`}>
                          <Badge className="bg-white text-blue-600 font-semibold">
                            <Zap className="mr-1 h-3 w-3" />
                            Most Popular
                          </Badge>
                        </div>
                      </div>
                    )}

                    <CardHeader className={`text-center ${plan.popular ? 'pt-16' : 'pt-8'}`}>
                      <div className="flex justify-center mb-4">
                        <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${plan.gradient}`}>
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                      <CardDescription className="text-base mt-2">
                        {plan.description}
                      </CardDescription>
                      <div className="mt-6">
                        <span className="text-4xl font-bold tracking-tight text-gray-900">
                          {plan.price}
                        </span>
                        <span className="text-base font-medium text-gray-500">
                          /{plan.period}
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className="px-8 pb-8">
                      {/* Features */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">What&apos;s included:</h4>
                        <ul className="space-y-3">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start">
                              <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Limitations */}
                      {plan.limitations.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-900 mb-3">Limitations:</h4>
                          <ul className="space-y-2">
                            {plan.limitations.map((limitation, limitationIndex) => (
                              <li key={limitationIndex} className="flex items-start text-sm text-gray-500">
                                <span className="mr-3">•</span>
                                <span>{limitation}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <SignedOut>
                        <SignInButton mode="modal">
                          <Button
                            className={`w-full ${
                              plan.popular
                                ? `bg-gradient-to-r ${plan.gradient} hover:from-blue-600 hover:to-purple-700`
                                : ''
                            }`}
                            size="lg"
                          >
                            {plan.cta}
                          </Button>
                        </SignInButton>
                      </SignedOut>

                      <SignedIn>
                        <SubscribeButton
                          planId={plan.planId}
                          planName={plan.name}
                          clerkPlanId="cplan_33EvIiC4CnraLtwa36h5YsbVWy2"
                          className={`w-full ${
                            plan.popular
                              ? `bg-gradient-to-r ${plan.gradient} hover:from-blue-600 hover:to-purple-700`
                              : ''
                          }`}
                        />
                      </SignedIn>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Money Back Guarantee */}
            <div className="mt-16 text-center">
              <div className="inline-flex items-center px-6 py-3 bg-green-50 border border-green-200 rounded-lg">
                <Shield className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-800">
                  30-day money-back guarantee • Cancel anytime • No questions asked
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Comparison */}
        <section className="py-24 sm:py-32 bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Why Choose YouTube Music Downloader Pro?
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Built by music lovers, for music lovers. Experience the difference quality makes.
              </p>
            </div>

            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <div className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-2">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon
                  return (
                    <Card key={index} className="border-0 shadow-lg">
                      <CardHeader>
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-xl font-semibold">
                          {feature.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 sm:py-32 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="mx-auto mt-16 max-w-2xl">
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Is the free trial really free?
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Yes! You get 1 high-quality download with no credit card required.
                    Experience our service risk-free.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Can I cancel my subscription anytime?
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Absolutely. Cancel your subscription at any time with no questions asked.
                    You&apos;ll keep access until the end of your billing period.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    What audio quality do you provide?
                  </h3>
                  <p className="mt-2 text-gray-600">
                    All downloads are 320kbps MP3 quality - the highest available from YouTube.
                    Perfect for audiophiles and casual listeners alike.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Is this legal and safe?
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Our service is completely safe and secure. We recommend only downloading
                    content you have rights to or that&apos;s available under fair use.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-gradient-to-r from-blue-500 to-purple-600 py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to start downloading?
              </h2>
              <p className="mt-4 text-lg text-blue-100">
                Join thousands of music lovers who trust our platform.
              </p>
              <div className="mt-8">
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-50">
                      <Download className="mr-2 h-5 w-5" />
                      Start Your Free Trial
                    </Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-50" asChild>
                    <a href="/dashboard">
                      <Download className="mr-2 h-5 w-5" />
                      Go to Dashboard
                    </a>
                  </Button>
                </SignedIn>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}