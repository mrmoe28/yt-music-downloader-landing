'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { createCheckoutSession } from '@/lib/stripe'

interface SubscribeButtonProps {
  planId: string | null // Stripe Price ID
  planName: string
  clerkPlanId?: string // Clerk Plan ID
  className?: string
}

export default function SubscribeButton({ planId, planName, clerkPlanId, className }: SubscribeButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async () => {
    if (!planId) {
      // Free trial - redirect to dashboard
      window.location.href = '/dashboard'
      return
    }

    setIsLoading(true)

    try {
      await createCheckoutSession(planId, clerkPlanId)
    } catch (error) {
      console.error('Error creating checkout session:', error)
      // Don't show alert on page load - only show error if user actually clicks
      // alert('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleSubscribe}
      disabled={isLoading}
      className={className}
      size="lg"
    >
      {isLoading
        ? 'Loading...'
        : planName === 'Free Trial'
        ? 'Go to Dashboard'
        : 'Subscribe Now'
      }
    </Button>
  )
}