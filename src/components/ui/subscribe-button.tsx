'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { createCheckoutSession } from '@/lib/stripe'
import { useUser } from '@clerk/nextjs'

interface SubscribeButtonProps {
  planId: string | null // Stripe Price ID
  planName: string
  clerkPlanId?: string // Clerk Plan ID
  className?: string
}

export default function SubscribeButton({ planId, planName, clerkPlanId, className }: SubscribeButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isSignedIn, isLoaded } = useUser()

  const handleSubscribe = async () => {
    if (!isLoaded) {
      setError('Loading user data...')
      return
    }

    if (!isSignedIn) {
      setError('Please sign in to continue')
      return
    }

    if (!planId) {
      // Free trial - redirect to dashboard
      window.location.href = '/dashboard'
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log('Button clicked - starting checkout...')
      await createCheckoutSession(planId, clerkPlanId)
    } catch (error) {
      console.error('Error in subscribe button:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unable to start checkout'
      setError(errorMessage)
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