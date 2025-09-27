'use client'

import { Button } from "@/components/ui/button"
import { Crown, Loader2 } from "lucide-react"
import { useState } from "react"

interface SubscribeButtonProps {
  planId?: string | null
  planName: string
  clerkPlanId?: string
  className?: string
}

export default function SubscribeButton({
  planId,
  planName,
  clerkPlanId,
  className
}: SubscribeButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async () => {
    if (!planId) {
      // For free trial, just redirect to dashboard
      window.location.href = '/dashboard'
      return
    }

    setIsLoading(true)

    try {
      console.log('🚀 Subscribe button clicked with:', { planId, planName, clerkPlanId })

      // Create Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          planName,
          clerkPlanId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create checkout session')
      }

      const data = await response.json()

      // Handle both sessionId (for Stripe redirect) and direct URL
      if (data.sessionId) {
        // Use Stripe.js to redirect to checkout
        const getStripe = await import('@/lib/stripe').then(m => m.default)
        const stripe = await getStripe()
        if (stripe) {
          const { error } = await stripe.redirectToCheckout({
            sessionId: data.sessionId,
          })
          if (error) {
            throw new Error(error.message)
          }
        }
      } else if (data.url) {
        // Direct URL redirect
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL or session ID received')
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      setIsLoading(false)
    }
  }

  if (!planId) {
    return (
      <Button className={className} onClick={handleSubscribe} disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Crown className="mr-2 h-4 w-4" />
        )}
        Start Free Trial
      </Button>
    )
  }

  return (
    <Button className={className} onClick={handleSubscribe} disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Crown className="mr-2 h-4 w-4" />
      )}
      Upgrade to {planName}
    </Button>
  )
}