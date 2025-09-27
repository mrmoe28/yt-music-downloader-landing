import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Only enable middleware for non-static export builds
const isStaticExport = process.env.STATIC_EXPORT === "true" || process.env.GITHUB_PAGES === "true"

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])

export default clerkMiddleware(async (auth, req) => {
  // Skip middleware for static export builds
  if (isStaticExport) {
    return
  }
  
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes (only when not in static export mode)
    ...(isStaticExport ? [] : ['/(api|trpc)(.*)']),
  ],
}