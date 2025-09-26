import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { priceId, planName, clerkPlanId } = body

    console.log('Creating checkout session for:', {
      userId,
      planId: priceId,
      clerkPlanId
    })

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 })
    }

    // For demo purposes, return a mock success URL
    // In production, you would create a real Stripe checkout session
    const mockSuccessUrl = `${request.nextUrl.origin}/dashboard?upgraded=true`

    return NextResponse.json({ url: mockSuccessUrl })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
