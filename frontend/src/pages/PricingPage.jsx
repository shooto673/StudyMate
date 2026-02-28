import { motion } from "framer-motion"
import { Check, ArrowLeft, Star, Crown } from "lucide-react"
import { Header } from "../components/Header"

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    limit: "10問/日",
    features: ["基本フィードバック", "履歴保存", "英語・数学全単元"],
    badge: null,
    highlight: false,
    buttonText: "現在のプラン",
    disabled: true,
  },
  {
    id: "light",
    name: "Light",
    price: 500,
    limit: "50問/日",
    features: ["Freeの全機能", "問題数上限アップ", "履歴分析", "広告なし", "復習キュー"],
    badge: null,
    highlight: false,
    buttonText: "このプランにする",
    disabled: false,
  },
  {
    id: "standard",
    name: "Standard",
    price: 799,
    limit: "100問/日",
    features: ["Lightの全機能", "詳細AIフィードバック", "弱点分析", "復習提案", "学習レポート"],
    badge: { text: "おすすめ", icon: <Star className="w-3 h-3" /> },
    highlight: true,
    buttonText: "このプランにする",
    disabled: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: 999,
    limit: "200問/日",
    features: ["Standardの全機能", "週次レポート", "優先サポート", "保護者向け要約", "カスタム学習プラン"],
    badge: { text: "プレミアム", icon: <Crown className="w-3 h-3" /> },
    highlight: false,
    borderColor: "var(--warning)",
    buttonText: "このプランにする",
    disabled: false,
  },
]

export function PricingPage({ onNavigate, isLoggedIn = false }) {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Header isLoggedIn={isLoggedIn} onNavigate={onNavigate} />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text)] mb-4">
            あなたにぴったりのプランを
          </h1>
          <p className="text-[var(--text-sub)]">すべてのプランで英語・数学が学べます</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              className={`
                relative bg-white rounded-3xl p-6 shadow-[var(--card-shadow)]
                ${plan.highlight ? "scale-105 border-2 border-[var(--primary)] z-10" : ""}
                ${plan.borderColor ? "border-2" : ""}
              `}
              style={plan.borderColor ? { borderColor: plan.borderColor } : {}}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              {plan.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1 ${
                  plan.highlight ? "bg-[var(--primary)]" : "bg-[var(--warning)]"
                }`}>
                  {plan.badge.icon}
                  {plan.badge.text}
                </div>
              )}

              <h2 className="text-xl font-extrabold text-[var(--text)] mb-2 mt-2">{plan.name}</h2>

              <div className="mb-4">
                <span className="text-4xl font-extrabold text-[var(--text)]">¥{plan.price.toLocaleString()}</span>
                <span className="text-[var(--text-sub)] text-sm">/月</span>
              </div>

              <div className="inline-block px-3 py-1 bg-[var(--primary-light)] text-[var(--primary)] rounded-full text-xs font-semibold mb-4">
                {plan.limit}
              </div>

              <div className="px-3 py-1 bg-[var(--bg-sub)] text-[var(--text-sub)] rounded-full text-xs font-medium mb-4 inline-block ml-2">
                英語・数学 全教科対応
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-[var(--text)]">
                    <Check className="w-4 h-4 text-[var(--success)] flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                disabled={plan.disabled}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                  plan.disabled
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-[var(--primary)] text-white hover:shadow-lg hover:scale-105"
                }`}
              >
                {plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => onNavigate("landing")}
            className="text-[var(--text-sub)] hover:text-[var(--text)] flex items-center gap-2 mx-auto transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            戻る
          </button>
        </div>
      </div>
    </div>
  )
}
