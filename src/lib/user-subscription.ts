import { useUser } from "@clerk/nextjs"

export interface UserSubscription {
  plan: "free" | "pro"
  downloadsUsed: number
  downloadsLimit: number | "unlimited"
  canDownload: boolean
  trialUsed: boolean
}

// Mock function to get user subscription data
// In production, this would fetch from your database or Clerk
export function useUserSubscription(): UserSubscription {
  const { user } = useUser()

  // Mock data - replace with actual subscription logic
  const mockSubscription: UserSubscription = {
    plan: "free", // This would come from Clerk metadata or your database
    downloadsUsed: 0, // Track downloads in your database
    downloadsLimit: 1, // Free users get 1 download
    canDownload: true, // Can download if limit not reached
    trialUsed: false, // Track if trial was used
  }

  // For pro users
  const proSubscription: UserSubscription = {
    plan: "pro",
    downloadsUsed: 47,
    downloadsLimit: "unlimited",
    canDownload: true,
    trialUsed: true,
  }

  // Return based on user metadata (mock logic)
  const isPro = user?.publicMetadata?.plan === "pro"
  return isPro ? proSubscription : mockSubscription
}

// Function to update download count
export async function incrementDownloadCount(userId: string) {
  // This would update your database
  // For now, we'll just log it
  console.log(`Incrementing download count for user: ${userId}`)

  // In production, you'd make an API call to update the count:
  // await fetch('/api/user/increment-downloads', {
  //   method: 'POST',
  //   body: JSON.stringify({ userId })
  // })
}

// Function to check if user can download
export function canUserDownload(subscription: UserSubscription): boolean {
  if (subscription.plan === "pro") {
    return true
  }

  return typeof subscription.downloadsLimit === 'string'
    ? true // unlimited
    : subscription.downloadsUsed < subscription.downloadsLimit
}

// Function to get subscription status message
export function getSubscriptionMessage(subscription: UserSubscription): string {
  if (subscription.plan === "pro") {
    return "You have unlimited downloads with Pro plan"
  }

  if (subscription.canDownload) {
    const remaining = typeof subscription.downloadsLimit === 'string'
      ? 'unlimited'
      : subscription.downloadsLimit - subscription.downloadsUsed
    return `You have ${remaining} download${remaining === 1 ? '' : 's'} remaining`
  }

  return "You've used your free download. Upgrade to Pro for unlimited downloads!"
}