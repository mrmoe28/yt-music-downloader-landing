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
  const [error, setError] = useState<string | null>(null)

  const handleSubscribe = async () => {
    if (!planId) {
      // Free trial - redirect to dashboard
      window.location.href = '/dashboard'
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await createCheckoutSession(planId, clerkPlanId)
    } catch (error) {
      console.error('Error creating checkout session:', error)
      setError('Unable to start checkout. Please try again or contact support.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-2">
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
      {error && (
        <p className="text-sm text-red-600 text-center">{error}</p>
      )}
    </div>
  )
}