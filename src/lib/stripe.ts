import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default stripePromise

export const createCheckoutSession = async (planId: string) => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ planId }),
    })

    if (!response.ok) {
      throw new Error('Failed to create checkout session')
    }

    const { sessionId } = await response.json()

    const stripe = await stripePromise
    if (!stripe) {
      throw new Error('Stripe failed to load')
    }

    // Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({
      sessionId,
    })

    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}