import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { getStripe } from '@/lib/stripe-server'
import type Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { planId, clerkPlanId } = body

    console.log('Creating checkout session for:', {
      userId,
      planId,
      clerkPlanId
    })

    // Build line items based on whether we have a price ID
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = planId
      ? [
          {
            price: planId,
            quantity: 1,
          },
        ]
      : [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'YouTube Music Downloader Pro',
                description: 'Unlimited downloads, premium features, and priority support',
              },
              unit_amount: 999, // $9.99 in cents
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ]

    // Configure Stripe checkout session
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: lineItems,
      success_url: `${request.nextUrl.origin}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/pricing?canceled=true`,
      customer_email: user?.emailAddresses[0]?.emailAddress,
      metadata: {
        userId,
        clerkPlanId: clerkPlanId || '',
      },
    }

    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create(sessionConfig)

    console.log('Checkout session created:', session.id)

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
