import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function PricingPage({ plans, onSelectPlan, onBack }) {
  const { user, planTier } = useAuth()
  const [loading, setLoading] = useState(null)

  const handleSelect = async (planId) => {
    if (planId === 'free') {
      onSelectPlan('free')
      return
    }

    if (!user) {
      onSelectPlan(planId)
      return
    }

    // 有料プラン → Stripe Checkout
    setLoading(planId)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          userId: user.id,
          email: user.email,
          referralCode: localStorage.getItem('study-mate-referral-code') || '',
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'チェックアウトの作成に失敗しました')
      }
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="page-wrap wide">
      <h2>プランを選択</h2>
      <p className="sub">無料プランでも継続利用できます。</p>

      <div className="grid plans">
        {plans.map((plan) => {
          const isCurrent = planTier === plan.id
          return (
            <button
              key={plan.id}
              type="button"
              className={`plan-card ${isCurrent ? 'active' : ''}`}
              onClick={() => handleSelect(plan.id)}
              disabled={loading !== null || isCurrent}
            >
              {isCurrent && <div className="plan-badge">現在のプラン</div>}
              <div className="plan-name">{plan.name}</div>
              <div className="plan-price">{plan.priceLabel}</div>
              <ul>
                {plan.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              {!isCurrent && (
                <div className="plan-action">
                  {loading === plan.id
                    ? '処理中...'
                    : plan.id === 'free'
                      ? '無料で始める'
                      : 'このプランにする'}
                </div>
              )}
            </button>
          )
        })}
      </div>

      <button type="button" className="btn-ghost" onClick={onBack}>
        戻る
      </button>
    </div>
  )
}
