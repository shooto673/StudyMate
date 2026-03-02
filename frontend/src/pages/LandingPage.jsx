import { motion } from "framer-motion"
import { Check, Sparkles, Zap, Trophy, Smartphone, PenLine, RefreshCw, Languages, Calculator } from "lucide-react"
import { Header } from "../components/Header"
import { FloatingDecorations } from "../components/FloatingDecorations"
import { Mascot } from "../components/Mascot"

const steps = [
  { icon: Smartphone, title: "Googleでログイン", description: "1秒で登録完了" },
  { icon: PenLine, title: "問題を解く", description: "AIが最適な問題を出題" },
  { icon: RefreshCw, title: "弱点を復習", description: "苦手を克服" },
]

const features = [
  { icon: Sparkles, title: "単元にピッタリの問題", description: "学年・単元に合わせてAIが問題を自動生成" },
  { icon: Zap, title: "間違いを即フィードバック", description: "その場で解説を表示して理解を深める" },
  { icon: Trophy, title: "やる気が続く仕組み", description: "ストリークや達成感でモチベーションUP" },
]

export function LandingPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <FloatingDecorations />
      <Header onNavigate={onNavigate} />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-balance text-3xl font-bold leading-tight text-[var(--text)] md:text-4xl lg:text-5xl">
                AIが、きみだけの
                <br />
                <span className="text-[var(--primary)]">勉強パートナーに。</span>
              </h1>
              <p className="mt-6 text-pretty text-lg text-[var(--text-sub)]">
                AIが学年・単元に合わせた問題をリアルタイム生成。
                <br />
                毎日の学習がもっと楽しくなる。
              </p>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onNavigate("login")}
                className="mt-8 rounded-2xl bg-[var(--accent)] px-8 py-4 text-lg font-bold text-white shadow-lg transition-shadow hover:shadow-xl"
              >
                無料ではじめる →
              </motion.button>

              <div className="mt-6 flex flex-wrap gap-4 text-sm text-[var(--text-sub)]">
                <span className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-[var(--success)]" />
                  ずっと無料で使える
                </span>
                <span className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-[var(--success)]" />
                  クレカ不要
                </span>
                <span className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-[var(--success)]" />
                  Googleで1秒登録
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center gap-4"
            >
              <Mascot character="mascot" mood="happy" size="xl" />
              <Mascot character="mona" mood="cheering" size="xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3 Steps Section */}
      <section className="bg-[var(--bg-sub)] px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center text-2xl font-bold text-[var(--text)] md:text-3xl"
          >
            かんたん3ステップで始められる
          </motion.h2>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className="rounded-3xl bg-white p-6 text-center shadow-[var(--card-shadow)] transition-shadow hover:shadow-[var(--card-hover-shadow)]"
              >
                <div className="mb-4 flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-[var(--primary-light)]">
                  <step.icon className="h-7 w-7 text-[var(--primary)]" />
                </div>
                <div className="mb-1 text-sm font-medium text-[var(--primary)]">
                  STEP {index + 1}
                </div>
                <h3 className="mb-2 text-lg font-bold text-[var(--text)]">
                  {step.title}
                </h3>
                <p className="text-sm text-[var(--text-sub)]">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center text-2xl font-bold text-[var(--text)] md:text-3xl"
          >
            StudyMateの特徴
          </motion.h2>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className="rounded-3xl bg-white p-6 shadow-[var(--card-shadow)] transition-shadow hover:shadow-[var(--card-hover-shadow)]"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary-light)]">
                  <feature.icon className="h-6 w-6 text-[var(--primary)]" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-[var(--text)]">
                  {feature.title}
                </h3>
                <p className="text-sm text-[var(--text-sub)]">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subject Badges */}
      <section className="bg-[var(--bg-sub)] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 text-2xl font-bold text-[var(--text)] md:text-3xl"
          >
            対応教科
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4"
          >
            <span className="flex items-center gap-2 rounded-full bg-[var(--english-light)] px-6 py-3 text-lg font-bold text-[var(--english)]">
              <Languages className="h-5 w-5" />
              英語
            </span>
            <span className="flex items-center gap-2 rounded-full bg-[var(--math-light)] px-6 py-3 text-lg font-bold text-[var(--math)]">
              <Calculator className="h-5 w-5" />
              数学
            </span>
          </motion.div>

          <p className="mt-4 text-[var(--text-sub)]">中学1〜3年対応</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-white p-8 shadow-[var(--card-shadow)] md:p-12"
          >
            <div className="mb-6 flex justify-center gap-4">
              <Mascot character="mascot" mood="cheering" size="lg" />
              <Mascot character="mona" mood="happy" size="lg" />
            </div>
            <h2 className="mb-4 text-2xl font-bold text-[var(--text)]">
              さあ、一緒に勉強しよう！
            </h2>
            <p className="mb-8 text-[var(--text-sub)]">
              テイラーくんとモナちゃんがきみの学習をサポートするよ
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate("login")}
              className="rounded-2xl bg-[var(--accent)] px-8 py-4 text-lg font-bold text-white shadow-lg transition-shadow hover:shadow-xl"
            >
              無料ではじめる →
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--card-border)] bg-white px-4 py-8">
        <div className="mx-auto max-w-6xl text-center text-sm text-[var(--text-sub)]">
          <p>© 2026 StudyMate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
