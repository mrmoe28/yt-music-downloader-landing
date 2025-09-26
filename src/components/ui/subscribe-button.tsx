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
      // Create Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: planId,
          planName,
          clerkPlanId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { url } = await response.json()
      window.location.href = url
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