import Stripe from 'stripe'

// Initialize Stripe only when actually needed, not at module load time
let stripe: Stripe | null = null

export const getStripe = (): Stripe => {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
    }

    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-08-27.basil',
      typescript: true,
    })
  }

  return stripe
}

// For backward compatibility
export { getStripe as stripe }
