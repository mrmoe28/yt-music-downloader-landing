import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getUserSubscription, hasAccess } from '@/lib/subscription'

interface SubscriptionGuardProps {
  children: ReactNode
  feature: string
  fallback?: ReactNode
  redirectTo?: string
}

export default async function SubscriptionGuard({
  children,
  feature,
  fallback,
  redirectTo
}: SubscriptionGuardProps) {
  const subscription = await getUserSubscription()
  const userHasAccess = hasAccess(subscription, feature)

  if (!userHasAccess) {
    if (redirectTo) {
      redirect(redirectTo)
    }

    if (fallback) {
      return <>{fallback}</>
    }

    // Default fallback
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          Premium Feature
        </h3>
        <p className="text-yellow-700 mb-4">
          This feature requires a Pro subscription to access.
        </p>
        <a
          href="/pricing"
          className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
        >
          Upgrade to Pro
        </a>
      </div>
    )
  }

  return <>{children}</>
}