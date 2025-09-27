import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Zap, Crown, Download } from "lucide-react"

const plans = [
  {
    name: "Free Trial",
    price: "$0",
    period: "one-time",
    description: "Perfect for trying out our service",
    features: [
      "1 high-quality MP3 download",
      "320kbps audio quality",
      "Metadata preservation",
      "No registration required",
      "Safe & secure processing"
    ],
    cta: "Start Free Trial",
    popular: false,
    icon: Download
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "per month",
    description: "Unlimited downloads for serious music lovers",
    features: [
      "Unlimited MP3 downloads",
      "320kbps premium quality",
      "Batch playlist downloads",
      "Advanced metadata tags",
      "Priority processing speed",
      "Cross-platform support",
      "Smart auto-organization",
      "24/7 customer support"
    ],
    cta: "Upgrade to Pro",
    popular: true,
    icon: Crown
  }
]

export default function PricingPreview() {
  return (
    <section className="py-24 sm:py-32 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">
            Simple Pricing
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Choose the plan that fits your needs
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Start with a free trial, then upgrade for unlimited access to premium features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-8 lg:max-w-4xl lg:grid-cols-2">
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
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-2 px-4">
                      <Badge className="bg-white text-blue-600 font-semibold">
                        <Zap className="mr-1 h-3 w-3" />
                        Most Popular
                      </Badge>
                    </div>
                  </div>
                )}

                <CardHeader className={`text-center ${plan.popular ? 'pt-12' : 'pt-8'}`}>
                  <div className="flex justify-center mb-4">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-full ${
                      plan.popular
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                        : 'bg-gray-100'
                    }`}>
                      <IconComponent className={`h-8 w-8 ${
                        plan.popular ? 'text-white' : 'text-gray-600'
                      }`} />
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
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full mt-8 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                        : ''
                    }`}
                    size="lg"
                    asChild
                  >
                    <a href="/pricing">{plan.cta}</a>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Bottom Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            All plans include our 30-day money-back guarantee. Cancel anytime.
          </p>
        </div>
      </div>
    </section>
  )
}