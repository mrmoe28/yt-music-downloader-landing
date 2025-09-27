'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Lock, Zap } from "lucide-react"
import { UserSubscription } from "@/lib/subscription"
import SubscribeButton from "./subscribe-button"

interface SubscriptionGuardProps {
  subscription: UserSubscription
  featureName: string
  featureDescription: string
  children: React.ReactNode
}

export default function SubscriptionGuard({
  subscription,
  featureName,
  featureDescription,
  children
}: SubscriptionGuardProps) {
  // Check if user has access to this feature
  const hasAccess = subscription.isSubscribed && subscription.subscriptionStatus === 'active'

  if (hasAccess) {
    return <>{children}</>
  }

  return (
    <Card className="relative overflow-hidden border-2 border-dashed border-muted-foreground/20">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20" />

      <CardHeader className="relative text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
          <Lock className="h-8 w-8 text-white" />
        </div>

        <Badge variant="secondary" className="mx-auto mb-2 w-fit">
          <Crown className="mr-1 h-3 w-3" />
          Pro Feature
        </Badge>

        <CardTitle className="text-xl">
          Unlock {featureName}
        </CardTitle>

        <CardDescription className="text-base">
          {featureDescription}
        </CardDescription>
      </CardHeader>

      <CardContent className="relative text-center">
        <div className="mb-6">
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Zap className="mr-1 h-4 w-4 text-blue-500" />
              Unlimited Downloads
            </div>
            <div className="flex items-center">
              <Crown className="mr-1 h-4 w-4 text-purple-500" />
              Premium Features
            </div>
          </div>
        </div>

        <SubscribeButton
          planId="price_1SBcQjEUI4iqGSxZTP77EM4p"
          planName="Pro"
          clerkPlanId="cplan_33EvIiC4CnraLtwa36h5YsbVWy2"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        />

        <p className="mt-4 text-xs text-muted-foreground">
          30-day money-back guarantee • Cancel anytime
        </p>
      </CardContent>
    </Card>
  )
}