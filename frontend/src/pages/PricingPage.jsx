import { motion } from "framer-motion"
import { Check, Crown, Star } from "lucide-react"
import { Header } from "../components/Header"
import { FloatingDecorations } from "../components/FloatingDecorations"
import { Mascot } from "../components/Mascot"

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    questions: 10,
    badge: null,
    features: ["基本フィードバック", "履歴保存", "全単元アクセス"],
    highlight: false,
  },
  {
    id: "light",
    name: "Light",
    price: 500,
    questions: 50,
    badge: null,
    features: ["問題数UP", "履歴分析", "広告なし", "復習キュー"],
    highlight: false,
  },
  {
    id: "standard",
    name: "Standard",
    price: 799,
    questions: 100,
    badge: "おすすめ",
    features: ["詳細AIフィードバック", "弱点分析", "復習提案", "学習レポート"],
    highlight: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 999,
    questions: 200,
    badge: "プレミアム",
    features: ["週次レポート", "優先サポート", "保護者向け要約", "カスタム学習プラン"],
    highlight: false,
  },
]

export function PricingPage({ onNavigate, isLoggedIn = false }) {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <FloatingDecorations />
      <Header isLoggedIn={isLoggedIn} onNavigate={onNavigate} />

      <main className="mx-auto max-w-6xl px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold text-[var(--text)] md:text-4xl">料金プラン</h1>
          <p className="text-[var(--text-sub)]">あなたにぴったりのプランを選んでください</p>
          <div className="mt-6 flex justify-center">
            <Mascot character="mona" mood="happy" size="md" message="どのプランにする？" />
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className={`relative rounded-3xl bg-white p-6 shadow-[var(--card-shadow)] transition-all ${
                plan.highlight ? "scale-105 ring-2 ring-[var(--primary)]"
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
                <div className="mt-2 text-sm text-[var(--text-sub)]">{plan.questions}問/日</div>
              </div>

              <div className="mb-4 flex justify-center">
                <span className="rounded-full bg-[var(--bg-sub)] px-3 py-1 text-xs font-medium text-[var(--text-sub)]">英語・数学 全教科対応</span>
              </div>

              <ul className="mb-6 space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-[var(--text-sub)]">
                    <Check className="h-4 w-4 text-[var(--success)]" />
                    {feature}
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={plan.id === "free"}
                className={`w-full rounded-2xl py-3 font-bold transition-all ${
                  plan.id === "free" ? "cursor-not-allowed bg-[var(--bg-sub)] text-[var(--text-muted)]"
                  : plan.highlight ? "bg-[var(--primary)] text-white shadow-md hover:shadow-lg"
                  : plan.id === "premium" ? "bg-[var(--warning)] text-white shadow-md hover:shadow-lg"
                  : "border-2 border-[var(--primary)] bg-white text-[var(--primary)] hover:bg-[var(--primary-light)]"
                }`}
              >
                {plan.id === "free" ? "現在のプラン" : "このプランを選ぶ"}
              </motion.button>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-12 text-center">
          <p className="text-sm text-[var(--text-muted)]">
            いつでもプラン変更・解約できます。<br />
            ご不明な点は<button className="text-[var(--primary)] underline hover:no-underline">お問い合わせ</button>ください。
          </p>
        </motion.div>
      </main>
    </div>
  )
}
