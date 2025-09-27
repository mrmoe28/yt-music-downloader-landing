'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Crown, Loader2, CheckCircle, AlertCircle, Music, Monitor } from "lucide-react"
import { detectDesktopApp, launchWithAuth } from "@/lib/protocol"
import { useUser } from "@clerk/nextjs"

interface DownloadResult {
  id: string
  title: string
  duration: string
  quality: string
  size: string
  downloadUrl: string
  status: string
}

export default function DownloadForm() {
  const { user } = useUser()
  const [url, setUrl] = useState("")
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadResult, setDownloadResult] = useState<DownloadResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [hasDesktopApp, setHasDesktopApp] = useState(false)
  const [checkingApp, setCheckingApp] = useState(true)

  // Mock user subscription data - replace with actual subscription logic
  const userPlan = "free" as const // This would come from Clerk metadata
  const downloadsUsed = 0 // This would come from your database
  const downloadsLimit = userPlan === "free" ? 1 : "unlimited"
  const canDownload = userPlan !== "free" || downloadsUsed < 1

  // Check for desktop app on mount
  useEffect(() => {
    const checkForDesktopApp = async () => {
      setCheckingApp(true)
      try {
        const detected = await detectDesktopApp()
        setHasDesktopApp(detected)
      } catch (err) {
        console.error('Failed to detect desktop app:', err)
        setHasDesktopApp(false)
      } finally {
        setCheckingApp(false)
      }
    }

    checkForDesktopApp()
  }, [])

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setDownloadResult(null)

    if (!url.trim()) {
      setError("Please enter a YouTube URL")
      return
    }

    if (!canDownload) {
      setError("You've reached your download limit. Upgrade to Pro for unlimited downloads!")
      return
    }

    // If desktop app is installed and user is authenticated, launch it
    if (hasDesktopApp && user) {
      try {
        const launched = await launchWithAuth(user.id, url.trim())
        if (launched) {
          setUrl("") // Clear the input
          setDownloadResult({
            id: 'desktop-launch',
            title: 'Launched in Desktop App',
            duration: '',
            quality: '320kbps',
            size: '',
            downloadUrl: '',
            status: 'The download is being processed in your desktop app'
          })
          return
        }
      } catch (err) {
        console.error('Failed to launch desktop app:', err)
        // Fall back to web download
      }
    }

    // Web-based download fallback
    setIsDownloading(true)

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Download failed')
      }

      setDownloadResult(data.download)
      setUrl("") // Clear the input

      // Simulate updating download count for free users
      if (userPlan === "free") {
        // In production, you'd update the user's download count in your database
        console.log("Free download used")
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Download Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Music className="mr-2 h-5 w-5" />
            Download YouTube Music
          </CardTitle>
          <CardDescription>
            Paste a YouTube music URL to start downloading in high quality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleDownload} className="space-y-4">
            <div className="flex space-x-4">
              <Input
                type="url"
                placeholder="https://youtube.com/watch?v=... or https://youtu.be/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isDownloading || !canDownload}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={isDownloading || !canDownload}
                className={canDownload ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" : ""}
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {hasDesktopApp ? (
                      <>
                        <Monitor className="mr-2 h-4 w-4" />
                        Open in App
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Download MP3
                      </>
                    )}
                  </>
                )}
              </Button>
            </div>

            {/* Usage Status */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Badge variant={userPlan !== "free" ? "default" : "secondary"}>
                  {userPlan !== "free" ? (
                    <>
                      <Crown className="mr-1 h-3 w-3" />
                      Pro Plan
                    </>
                  ) : (
                    "Free Trial"
                  )}
                </Badge>
                <span className="text-gray-600">
                  Downloads: {downloadsUsed} / {downloadsLimit}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                320kbps MP3 Quality
              </span>
            </div>
          </form>

          {/* Error Display */}
          {error && (
            <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {/* Success Display */}
          {downloadResult && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="font-medium text-green-800">
                  {downloadResult.id === 'desktop-launch' ? 'Launched Desktop App!' : 'Download Ready!'}
                </span>
              </div>
              {downloadResult.id === 'desktop-launch' ? (
                <div className="text-sm text-green-700">
                  {downloadResult.status}
                </div>
              ) : (
                <>
                  <div className="space-y-2 text-sm">
                    <div><strong>Title:</strong> {downloadResult.title}</div>
                    <div><strong>Duration:</strong> {downloadResult.duration}</div>
                    <div><strong>Quality:</strong> {downloadResult.quality}</div>
                    <div><strong>Size:</strong> {downloadResult.size}</div>
                  </div>
                  <Button
                    className="mt-3 bg-green-600 hover:bg-green-700"
                    size="sm"
                    asChild
                  >
                    <a href={downloadResult.downloadUrl} download>
                      <Download className="mr-2 h-4 w-4" />
                      Download File
                    </a>
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Upgrade Prompt for Free Users */}
          {!canDownload && userPlan === "free" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Free trial used
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      You&apos;ve used your free download. Upgrade to Pro for unlimited downloads!
                    </p>
                  </div>
                  <div className="mt-4">
                    <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" asChild>
                      <a href="/pricing">
                        <Crown className="mr-2 h-4 w-4" />
                        Upgrade to Pro - $9.99/month
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Desktop App Status */}
      {!checkingApp && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Monitor className="mr-2 h-5 w-5" />
              Desktop App {hasDesktopApp ? 'Detected' : 'Not Found'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hasDesktopApp ? (
              <div className="text-sm text-green-700">
                ✓ Desktop app is installed. Downloads will open directly in the app.
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  Install the desktop app for a better download experience:
                </div>
                <ul className="text-sm text-gray-600 ml-4 space-y-1">
                  <li>• Faster downloads</li>
                  <li>• Direct file management</li>
                  <li>• USB drive integration</li>
                  <li>• Works offline</li>
                </ul>
                <Button size="sm" variant="outline" asChild>
                  <a href="https://github.com/mrmoe28/ytmusidownloaderapp/releases" target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Download Desktop App
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How to use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-600">
          <div>1. Copy any YouTube music video URL</div>
          <div>2. Paste it in the input field above</div>
          <div>3. Click &quot;{hasDesktopApp ? 'Open in App' : 'Download MP3'}&quot; to start processing</div>
          {hasDesktopApp ? (
            <div>4. The desktop app will handle the download</div>
          ) : (
            <>
              <div>4. Wait for the download to complete</div>
              <div>5. Click &quot;Download File&quot; to save to your device</div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}