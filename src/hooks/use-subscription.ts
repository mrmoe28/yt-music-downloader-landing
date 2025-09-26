'use client'

import { useUser } from '@clerk/nextjs'
import { useMemo } from 'react'
import type { UserSubscription } from '@/lib/subscription'

export function useSubscription(): UserSubscription & {
  isLoading: boolean
} {
  const { user, isLoaded } = useUser()

  const subscription = useMemo(() => {
    if (!isLoaded || !user) {
      return {
        isSubscribed: false,
        isLoading: !isLoaded
      }
    }

    const { stripeSubscriptionId, subscriptionStatus, planId } = user.publicMetadata || {}

    return {
      isSubscribed: subscriptionStatus === 'active',
      planId: planId as string,
      subscriptionStatus: subscriptionStatus as string,
      stripeSubscriptionId: stripeSubscriptionId as string,
      isLoading: false
    }
  }, [user, isLoaded])

  return subscription
}

export function useHasAccess(feature: string): boolean {
  const subscription = useSubscription()

  return useMemo(() => {
    // Free trial features
    const freeFeatures = ['basic_download']

    // Pro features
    const proFeatures = [
      'unlimited_downloads',
      'batch_downloads',
      'playlist_downloads',
      'premium_quality',
      'priority_processing',
      'advanced_metadata',
      'download_history',
      'multiple_formats',
      'premium_support'
    ]

    // Check free trial access
    if (freeFeatures.includes(feature)) {
      return true
    }

    // Check pro subscription access
    if (proFeatures.includes(feature)) {
      return subscription.isSubscribed && subscription.subscriptionStatus === 'active'
    }

    return false
  }, [subscription, feature])
}