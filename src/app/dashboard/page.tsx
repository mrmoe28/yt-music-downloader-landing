import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Music, Clock, Crown, User, Settings } from "lucide-react"
import DownloadForm from "@/components/download/download-form"
import { getUserSubscription, getUsageLimit } from "@/lib/subscription"
import SubscribeButton from "@/components/ui/subscribe-button"

export default async function DashboardPage() {
  const { userId } = await auth()
  const user = await currentUser()

  if (!userId) {
    redirect("/sign-in")
  }

  // Get actual subscription data
  const subscription = await getUserSubscription()
  const usageLimit = getUsageLimit(subscription)

  // TODO: Get actual usage from database
  const downloadsUsed = subscription.isSubscribed ? 47 : 0
  const downloadsLimit = usageLimit.hasUnlimitedAccess ? "unlimited" : usageLimit.downloadsPerMonth

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.firstName || "User"}!
              </h1>
              <p className="text-gray-600">
                Your YouTube Music Downloader dashboard
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge
                variant={subscription.isSubscribed ? "default" : "secondary"}
                className={subscription.isSubscribed ? "bg-gradient-to-r from-blue-500 to-purple-600" : ""}
              >
                {subscription.isSubscribed ? (
                  <>
                    <Crown className="mr-1 h-3 w-3" />
                    Pro Plan
                  </>
                ) : (
                  <>
                    <User className="mr-1 h-3 w-3" />
                    Free Trial
                  </>
                )}
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Download Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Download className="mr-2 h-5 w-5" />
                Downloads
              </CardTitle>
              <CardDescription>Your download usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {downloadsUsed} / {downloadsLimit}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {subscription.isSubscribed ? "This month" : "Free trial downloads"}
              </p>
            </CardContent>
          </Card>

          {/* Quality Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Music className="mr-2 h-5 w-5" />
                Audio Quality
              </CardTitle>
              <CardDescription>Current settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">320kbps</div>
              <p className="text-xs text-gray-500 mt-1">Premium quality</p>
            </CardContent>
          </Card>

          {/* Last Download */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Last Download
              </CardTitle>
              <CardDescription>Recent activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {downloadsUsed > 0 ? "2 hours ago" : "Never"}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {downloadsUsed > 0 ? "Song Title - Artist" : "No downloads yet"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Download Section */}
        <div className="mt-8">
          <DownloadForm />
        </div>

        {/* Feature Comparison */}
        {!subscription.isSubscribed && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Unlock Premium Features</CardTitle>
                <CardDescription>
                  See what you&apos;re missing with the Pro plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Free Trial</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>✓ 1 high-quality download</li>
                      <li>✓ 320kbps audio quality</li>
                      <li>✓ Basic metadata</li>
                      <li>✗ No batch downloads</li>
                      <li>✗ No playlist support</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-600 mb-3">Pro Plan</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="text-blue-600">✓ Unlimited downloads</li>
                      <li className="text-blue-600">✓ 320kbps premium quality</li>
                      <li className="text-blue-600">✓ Advanced metadata</li>
                      <li className="text-blue-600">✓ Batch playlist downloads</li>
                      <li className="text-blue-600">✓ Priority processing</li>
                      <li className="text-blue-600">✓ 24/7 support</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <SubscribeButton
                    planId="price_1QnGd2EUI4iqGSxZ0KQzgx5l"
                    planName="Pro"
                    clerkPlanId="cplan_33EvIiC4CnraLtwa36h5YsbVWy2"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}