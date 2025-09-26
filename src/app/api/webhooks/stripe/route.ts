import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { clerkClient } from '@clerk/nextjs/server'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-08-27.basil',
  })
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const sig = headersList.get('stripe-signature')!

  const stripe = getStripe()
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.mode === 'subscription') {
          const userId = session.client_reference_id
          const subscriptionId = session.subscription as string

          if (userId) {
            // Update user metadata in Clerk
            const client = await clerkClient()
            await client.users.updateUserMetadata(userId, {
              publicMetadata: {
                stripeSubscriptionId: subscriptionId,
                subscriptionStatus: 'active',
                planId: session.metadata?.planId,
              },
            })
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription

        // Find user by subscription ID
        const client = await clerkClient()
        const users = await client.users.getUserList({
          limit: 100,
        })

        const user = users.data.find(user =>
          user.publicMetadata?.stripeSubscriptionId === subscription.id
        )

        if (user) {
          await client.users.updateUserMetadata(user.id, {
            publicMetadata: {
              ...user.publicMetadata,
              subscriptionStatus: subscription.status,
            },
          })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        // Find user by subscription ID
        const client = await clerkClient()
        const users = await client.users.getUserList({
          limit: 100,
        })

        const user = users.data.find(user =>
          user.publicMetadata?.stripeSubscriptionId === subscription.id
        )

        if (user) {
          await client.users.updateUserMetadata(user.id, {
            publicMetadata: {
              ...user.publicMetadata,
              subscriptionStatus: 'canceled',
            },
          })
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}