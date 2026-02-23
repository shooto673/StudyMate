import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
)

const PRICE_MAP = {
  light: process.env.STRIPE_PRICE_LIGHT,
  standard: process.env.STRIPE_PRICE_STANDARD,
  premium: process.env.STRIPE_PRICE_PREMIUM,
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { planId, userId, email, referralCode } = req.body

    if (!planId || !userId || !email) {
      return res.status(400).json({ error: 'planId, userId, email are required' })
    }

    const priceId = PRICE_MAP[planId]
    if (!priceId) {
      return res.status(400).json({ error: `Invalid planId: ${planId}` })
    }

    // 既存の Stripe Customer を検索、なければ作成
    const customers = await stripe.customers.list({ email, limit: 1 })
    let customer = customers.data[0]

    if (!customer) {
      customer = await stripe.customers.create({
        email,
        metadata: { supabase_user_id: userId },
      })
    }

    const origin = req.headers.origin || req.headers.referer?.replace(/\/$/, '') || 'http://localhost:5173'

    // 紹介コードがある場合は7日間無料トライアル
    let hasValidReferral = false
    if (referralCode) {
      const { data: codeData } = await supabase
        .from('referral_codes')
        .select('id')
        .eq('code', referralCode)
        .eq('is_active', true)
        .single()
      if (codeData) hasValidReferral = true
    }

    const subscriptionData = {
      metadata: { supabase_user_id: userId, plan_tier: planId },
    }
    if (hasValidReferral) {
      subscriptionData.trial_period_days = 7
    }

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}?checkout=success`,
      cancel_url: `${origin}?checkout=cancel`,
      metadata: { supabase_user_id: userId, plan_tier: planId, referral_code: referralCode || '' },
      subscription_data: subscriptionData,
    })

    return res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return res.status(500).json({ error: err.message })
  }
}
