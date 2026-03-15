import { useState } from "react"
import { motion } from "framer-motion"
import { Check, X, Crown, Star, ArrowLeft, Loader2 } from "lucide-react"
import { Header } from "../components/Header"
import { FloatingDecorations } from "../components/FloatingDecorations"
import { Mascot } from "../components/Mascot"

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    questionsLabel: "10問/日（2回分）",
    badge: null,
    highlight: false,
    features: {
      questions: "10問/日",
      subjects: true,
      allUnits: true,
      review: true,
      difficulty: false,
      report: false,
      weakness: false,
      parentShare: false,
    },
  },
  {
    id: "standard",
    name: "Standard",
    price: 699,
    questionsLabel: "50問/日",
    badge: "おすすめ",
    highlight: true,
    features: {
      questions: "50問/日",
      subjects: true,
      allUnits: true,
      review: true,
      difficulty: true,
      report: "週次レポート",
      weakness: false,
      parentShare: false,
    },
  },
  {
    id: "premium",
    name: "Premium",
    price: 999,
    questionsLabel: "無制限",
    badge: "プレミアム",
    highlight: false,
    features: {
      questions: "無制限",
      subjects: true,
      allUnits: true,
      review: true,
      difficulty: true,
      report: "日次＋グラフ",
      weakness: true,
      parentShare: true,
    },
  },
]

const featureRows = [
  { key: "questions", label: "1日の問題数", type: "text" },
  { key: "subjects", label: "英語・数学", type: "bool" },
  { key: "allUnits", label: "全単元・副単元", type: "bool" },
  { key: "review", label: "間違い復習", type: "bool" },
  { key: "difficulty", label: "問題の難易度選択", type: "bool" },
  { key: "report", label: "学習レポート", type: "mixed" },
  { key: "weakness", label: "AI弱点分析", type: "bool" },
  { key: "parentShare", label: "保護者レポート共有", type: "bool" },
]

const tierOrder = { free: 0, standard: 1, premium: 2 }

export function PricingPage({ onNavigate, isLoggedIn = false, planTier = "free", user = null, userEmail = "" }) {
  const [checkoutLoading, setCheckoutLoading] = useState(null)
  const [error, setError] = useState(null)

  const handleCheckout = async (planId) => {
    if (planId === "free") return
    if (planId === planTier) return

    if (!user || !userEmail) {
      onNavigate("login")
      return
    }

    try {
      setError(null)
      setCheckoutLoading(planId)
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          userId: user.id,
          email: userEmail,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || "エラーが発生しました")
      }
    } catch (err) {
      console.error("Checkout error:", err)
      setError("通信エラーが発生しました")
    } finally {
      setCheckoutLoading(null)
    }
  }

  const getButtonProps = (planId) => {
    if (planId === planTier) {
      return { label: "現在のプラン", disabled: true, style: "cursor-not-allowed bg-[var(--bg-sub)] text-[var(--text-muted)]" }
    }
    if (planId === "free") {
      return { label: "無料プラン", disabled: true, style: "cursor-not-allowed bg-[var(--bg-sub)] text-[var(--text-muted)]" }
    }
    const isUpgrade = tierOrder[planId] > tierOrder[planTier]
    if (isUpgrade) {
      if (planId === "premium") {
        return { label: "アップグレード 👑", disabled: false, style: "bg-[var(--warning)] text-white shadow-md hover:shadow-lg" }
      }
      return { label: "アップグレード ⭐", disabled: false, style: "bg-[var(--primary)] text-white shadow-md hover:shadow-lg" }
    }
    return { label: "ダウングレード", disabled: false, style: "border-2 border-[var(--card-border)] bg-white text-[var(--text-sub)] hover:border-[var(--primary)]" }
  }

  const renderFeatureValue = (value) => {
    if (value === true) return <Check className="mx-auto h-5 w-5 text-[var(--success)]" />
    if (value === false) return <X className="mx-auto h-5 w-5 text-[var(--text-muted)]" />
    return <span className="text-sm font-medium text-[var(--text)]">{value}</span>
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <FloatingDecorations />
      <Header isLoggedIn={isLoggedIn} onNavigate={onNavigate} />

      <main className="mx-auto max-w-5xl px-4 py-12">
        {isLoggedIn && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate("stageMap")}
            className="mb-6 flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-medium text-[var(--primary)] shadow-[var(--card-shadow)] transition-all hover:shadow-md"
          >
            <ArrowLeft className="h-5 w-5" />
            マップに戻る
          </motion.button>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold text-[var(--text)] md:text-4xl">料金プラン</h1>
          <p className="text-[var(--text-sub)]">あなたにぴったりのプランを選んでください</p>
          <div className="mt-6 flex justify-center">
            <Mascot character="mona" mood="happy" size="md" message="どのプランにする？" />
          </div>
        </motion.div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto mb-6 max-w-md rounded-2xl bg-[var(--error-light)] p-4 text-center text-sm text-[var(--error)]">
            {error}
          </motion.div>
        )}

        {/* Plan Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan, index) => {
            const btn = getButtonProps(plan.id)
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className={`relative rounded-3xl bg-white p-6 shadow-[var(--card-shadow)] transition-all ${
                  plan.highlight ? "scale-[1.03] ring-2 ring-[var(--primary)]"
                  : plan.id === "premium" ? "ring-2 ring-[var(--warning)]"
                  : ""
                }`}
              >
                {plan.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full px-4 py-1 text-xs font-bold text-white ${plan.id === "premium" ? "bg-[var(--warning)]" : "bg-[var(--primary)]"}`}>
                    {plan.id === "premium" ? <Crown className="h-3 w-3" /> : <Star className="h-3 w-3" />}
                    {plan.badge}
                  </div>
                )}

                <div className="mb-4 text-center">
                  <h3 className="text-xl font-bold text-[var(--text)]">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-[var(--text)]">¥{plan.price.toLocaleString()}</span>
                    <span className="text-sm text-[var(--text-sub)]">/月</span>
                  </div>
                  <div className="mt-2 text-sm font-medium text-[var(--primary)]">{plan.questionsLabel}</div>
                </div>

                <motion.button
                  whileHover={btn.disabled ? {} : { scale: 1.03 }}
                  whileTap={btn.disabled ? {} : { scale: 0.97 }}
                  disabled={btn.disabled || checkoutLoading === plan.id}
                  onClick={() => handleCheckout(plan.id)}
                  className={`w-full rounded-2xl py-3 font-bold transition-all ${btn.style}`}
                >
                  {checkoutLoading === plan.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      処理中...
                    </span>
                  ) : (
                    btn.label
                  )}
                </motion.button>
              </motion.div>
            )
          })}
        </div>

        {/* Feature Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 overflow-hidden rounded-3xl bg-white shadow-[var(--card-shadow)]"
        >
          <h2 className="border-b border-[var(--card-border)] bg-[var(--bg-sub)] px-6 py-4 text-center text-lg font-bold text-[var(--text)]">
            機能比較
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--card-border)]">
                  <th className="px-6 py-4 text-left text-sm font-medium text-[var(--text-sub)]">機能</th>
                  {plans.map((plan) => (
                    <th key={plan.id} className={`px-4 py-4 text-center text-sm font-bold ${plan.highlight ? "text-[var(--primary)]" : plan.id === "premium" ? "text-[var(--warning)]" : "text-[var(--text)]"}`}>
                      {plan.name}
                      <div className="mt-1 text-xs font-normal text-[var(--text-sub)]">¥{plan.price.toLocaleString()}/月</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {featureRows.map((row, i) => (
                  <tr key={row.key} className={`border-b border-[var(--card-border)] ${i % 2 === 0 ? "bg-white" : "bg-[var(--bg-sub)]"}`}>
                    <td className="px-6 py-3 text-sm font-medium text-[var(--text)]">{row.label}</td>
                    {plans.map((plan) => (
                      <td key={plan.id} className="px-4 py-3 text-center">
                        {renderFeatureValue(plan.features[row.key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-12 text-center">
          <p className="text-sm text-[var(--text-muted)]">
            いつでもプラン変更・解約できます。<br />
            ご不明な点は<button className="text-[var(--primary)] underline hover:no-underline">お問い合わせ</button>ください。
          </p>
        </motion.div>
      </main>
    </div>
  )
}
