import { currentUser } from '@clerk/nextjs/server'

export interface UserSubscription {
  isSubscribed: boolean
  planId?: string
  subscriptionStatus?: string
  stripeSubscriptionId?: string
}

export async function getUserSubscription(): Promise<UserSubscription> {
  const user = await currentUser()

  if (!user) {
    return { isSubscribed: false }
  }

  const { stripeSubscriptionId, subscriptionStatus, planId } = user.publicMetadata || {}

  return {
    isSubscribed: subscriptionStatus === 'active',
    planId: planId as string,
    subscriptionStatus: subscriptionStatus as string,
    stripeSubscriptionId: stripeSubscriptionId as string,
  }
}

export function hasAccess(subscription: UserSubscription, feature: string): boolean {
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
}

export function getUsageLimit(subscription: UserSubscription): {
  downloadsPerDay: number
  downloadsPerMonth: number
  maxFileSize: number // in MB
  hasUnlimitedAccess: boolean
} {
  if (subscription.isSubscribed && subscription.subscriptionStatus === 'active') {
    return {
      downloadsPerDay: -1, // unlimited
      downloadsPerMonth: -1, // unlimited
      maxFileSize: 100, // 100MB
      hasUnlimitedAccess: true
    }
  }

  // Free trial limits
  return {
    downloadsPerDay: 1,
    downloadsPerMonth: 1,
    maxFileSize: 25, // 25MB
    hasUnlimitedAccess: false
  }
}