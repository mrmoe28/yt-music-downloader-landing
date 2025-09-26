import { loadStripe, Stripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null> | null = null

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return stripePromise
}

export default getStripe

export const createCheckoutSession = async (planId: string, clerkPlanId?: string) => {
  try {
    console.log('Starting checkout session creation...', { planId, clerkPlanId })

    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ planId, clerkPlanId }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('API error:', data.error)
      throw new Error(data.error || 'Failed to create checkout session')
    }

    if (!data.sessionId) {
      console.error('No sessionId in response:', data)
      throw new Error('Invalid response from server')
    }

    console.log('Session created, loading Stripe...')
    const stripe = await getStripe()
    if (!stripe) {
      throw new Error('Stripe failed to load')
    }

    console.log('Redirecting to checkout...')
    // Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({
      sessionId: data.sessionId,
    })

    if (error) {
      console.error('Stripe redirect error:', error)
      throw error
    }
  } catch (error) {
    console.error('Error in createCheckoutSession:', error)
    throw error
  }
}