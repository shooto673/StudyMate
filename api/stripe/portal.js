import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'email is required' })
    }

    const customers = await stripe.customers.list({ email, limit: 1 })
    const customer = customers.data[0]

    if (!customer) {
      return res.status(404).json({ error: 'Stripe customer not found' })
    }

    const origin = req.headers.origin || req.headers.referer?.replace(/\/$/, '') || 'http://localhost:5173'

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: origin,
    })

    return res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Stripe portal error:', err)
    return res.status(500).json({ error: err.message })
  }
}
