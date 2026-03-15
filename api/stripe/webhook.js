import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
)

// Vercel では bodyParser を無効にして raw body を取得
export const config = {
  api: { bodyParser: false },
}

function buffer(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

async function upsertSubscription(userId, planTier, status, stripeSubId) {
  const { error } = await supabase
    .from('subscriptions')
    .upsert(
      {
        user_id: userId,
        plan_tier: planTier,
        status: status,
        stripe_subscription_id: stripeSubId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    )
  if (error) console.error('Subscription upsert error:', error)
}

async function recordBillingEvent(userId, eventId, eventType, payload) {
  const { error } = await supabase.from('billing_events').insert({
    user_id: userId,
    stripe_event_id: eventId,
    event_type: eventType,
    payload,
    processed_at: new Date().toISOString(),
  })
  // UNIQUE constraint violation → already processed (idempotent)
  if (error && error.code !== '23505') {
    console.error('billing_events insert error:', error)
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const buf = await buffer(req)
  const sig = req.headers['stripe-signature']

  let event
  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).json({ error: `Webhook Error: ${err.message}` })
  }

  const eventId = event.id
  const eventType = event.type

  try {
    switch (eventType) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.metadata?.supabase_user_id
        const planTier = session.metadata?.plan_tier
        if (userId && planTier) {
          const normalizedTier = (planTier === 'light' || planTier === 'basic') ? 'free' : planTier
          await upsertSubscription(userId, normalizedTier, 'active', session.subscription)
          await recordBillingEvent(userId, eventId, eventType, session)
        }
        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object
        const userId = sub.metadata?.supabase_user_id
        const planTier = sub.metadata?.plan_tier
        if (userId) {
          const status = sub.cancel_at_period_end ? 'canceling' : sub.status === 'active' ? 'active' : sub.status
          await upsertSubscription(userId, planTier || 'free', status, sub.id)
          await recordBillingEvent(userId, eventId, eventType, sub)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object
        const userId = sub.metadata?.supabase_user_id
        if (userId) {
          await upsertSubscription(userId, 'free', 'canceled', sub.id)
          await recordBillingEvent(userId, eventId, eventType, sub)
        }
        break
      }

      case 'invoice.paid': {
        const invoice = event.data.object
        const subId = invoice.subscription
        if (subId) {
          const sub = await stripe.subscriptions.retrieve(subId)
          const userId = sub.metadata?.supabase_user_id
          if (userId) {
            await recordBillingEvent(userId, eventId, eventType, invoice)
          }
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object
        const subId = invoice.subscription
        if (subId) {
          const sub = await stripe.subscriptions.retrieve(subId)
          const userId = sub.metadata?.supabase_user_id
          if (userId) {
            await upsertSubscription(userId, sub.metadata?.plan_tier || 'free', 'past_due', sub.id)
            await recordBillingEvent(userId, eventId, eventType, invoice)
          }
        }
        break
      }

      default:
        // Unhandled event type
        break
    }
  } catch (err) {
    console.error(`Error processing ${eventType}:`, err)
  }

  return res.status(200).json({ received: true })
}
