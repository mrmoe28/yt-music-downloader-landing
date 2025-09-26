import { loadStripe, Stripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null> | null = null

const getStripe = () => {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    if (!key) {
      console.error('Stripe publishable key is missing')
      return Promise.resolve(null)
    }
    stripePromise = loadStripe(key)
  }
  return stripePromise
}

export default getStripe

export const createCheckoutSession = async (planId: string, clerkPlanId?: string) => {
  console.log('🚀 Starting checkout session creation...', { planId, clerkPlanId })

  try {
    // Step 1: Create checkout session on server
    console.log('📡 Calling API to create session...')
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ planId, clerkPlanId }),
    })

    console.log('📡 API response status:', response.status)
    const data = await response.json()
    console.log('📡 API response data:', data)

    if (!response.ok) {
      throw new Error(data.error || `Server error: ${response.status}`)
    }

    if (!data.sessionId) {
      throw new Error('No sessionId received from server')
    }

    // Step 2: Load Stripe
    console.log('💳 Loading Stripe library...')
    const stripe = await getStripe()

    if (!stripe) {
      throw new Error('Failed to load Stripe library - check your publishable key')
    }

    console.log('✅ Stripe loaded successfully')

    // Step 3: Redirect to checkout
    console.log('🔄 Redirecting to Stripe checkout...')
    const { error } = await stripe.redirectToCheckout({
      sessionId: data.sessionId,
    })

    if (error) {
      console.error('❌ Stripe redirect error:', error)
      throw new Error(`Checkout redirect failed: ${error.message}`)
    }

    console.log('✅ Successfully redirected to checkout')

  } catch (error) {
    console.error('❌ Checkout error:', error)
    throw error
  }
}