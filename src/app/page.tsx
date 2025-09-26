'use client'

import HeroSection from "@/components/hero/hero-section"
import FeaturesSection from "@/components/features/features-section"
import PricingPreview from "@/components/pricing/pricing-preview"
import Navigation from "@/components/layouts/navigation"
import Footer from "@/components/layouts/footer"

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingPreview />
      </main>
      <Footer />
    </>
  )
}
