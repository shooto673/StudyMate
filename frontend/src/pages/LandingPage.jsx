import { motion } from "framer-motion"
import { CheckCircle, Sparkles, Zap, Trophy, ArrowRight } from "lucide-react"
import { Mascot } from "../components/Mascot"
import { Header } from "../components/Header"

export function LandingPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Header onNavigate={onNavigate} />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, var(--primary) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              className="flex-1 text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-lg text-[var(--text-sub)] mb-2">AIが、きみだけの</p>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-[var(--primary)] mb-6 relative inline-block text-balance">
                勉強パートナーに。
                <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 200 12" fill="none">
                  <path d="M2 8c40-4 80-2 120 0s80 4 76 0" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" opacity="0.3"/>
                </svg>
              </h1>
              <p className="text-[var(--text-sub)] text-lg mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed">
                AIが学年・単元に合わせた問題をリアルタイム生成。
                毎日の学習がもっと楽しくなる。
              </p>

              <motion.button
                onClick={() => onNavigate("login")}
                className="px-8 py-4 bg-[var(--accent)] text-white text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 mx-auto lg:mx-0"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                無料ではじめる
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-6">
                {["ずっと無料で使える", "クレカ不要", "Googleで1秒登録"].map((text, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-[var(--text-sub)]">
                    <div className="w-5 h-5 rounded-full bg-[var(--success-light)] flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-[var(--success)]" />
                    </div>
                    {text}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="flex-shrink-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Mascot mood="happy" size="xl" message="一緒に勉強しよう！" />
            </motion.div>
          </div>

          <motion.div
            className="flex flex-wrap justify-center gap-4 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <span className="px-4 py-2 bg-[var(--english-light)] text-[var(--english)] rounded-full font-semibold flex items-center gap-2">
              <span>🔤</span> 英語
            </span>
            <span className="px-4 py-2 bg-[var(--math-light)] text-[var(--math)] rounded-full font-semibold flex items-center gap-2">
              <span>🔢</span> 数学
            </span>
          </motion.div>
          <p className="text-center text-[var(--text-sub)] text-sm mt-3">中学1〜3年対応</p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 bg-[var(--bg-sub)]">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-center text-[var(--text)] mb-12">
            使い方は<span className="text-[var(--primary)]">かんたん</span>3ステップ
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: 1, icon: "📱", title: "Googleでログイン", desc: "メアドとパスワードは不要。タップ1回で開始！" },
              { step: 2, icon: "📝", title: "問題を解く", desc: "教科と単元を選んで、さっそく学習スタート。" },
              { step: 3, icon: "🔄", title: "弱点を復習", desc: "間違えた問題は自動で復習リストに追加。" },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-3xl p-6 shadow-[var(--card-shadow)] relative hover:-translate-y-1 hover:shadow-[var(--card-hover-shadow)] transition-all duration-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="absolute -top-4 left-6 w-10 h-10 bg-[var(--primary)] text-white rounded-full flex items-center justify-center font-extrabold text-lg">
                  {item.step}
                </div>
                <div className="text-4xl mb-4 mt-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-[var(--text)] mb-2">{item.title}</h3>
                <p className="text-[var(--text-sub)] text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-[var(--bg)]">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-center text-[var(--text)] mb-12">
            StudyMateの<span className="text-[var(--primary)]">特徴</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Sparkles className="w-6 h-6 text-[var(--primary)]" />,
                bg: "var(--primary-light)",
                title: "単元にピッタリの問題",
                desc: "AIが学年・単元に合わせて毎回違う問題を生成。飽きずに続けられる！"
              },
              {
                icon: <Zap className="w-6 h-6 text-[var(--english)]" />,
                bg: "var(--english-light)",
                title: "間違いを即フィードバック",
                desc: "回答直後にわかりやすい日本語解説。すぐに理解が深まる。"
              },
              {
                icon: <Trophy className="w-6 h-6 text-[var(--warning)]" />,
                bg: "var(--accent-light)",
                title: "やる気が続く仕組み",
                desc: "連続日数、正答率、マスコットの応援でモチベーションアップ！"
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-3xl p-6 shadow-[var(--card-shadow)] hover:-translate-y-1 hover:shadow-[var(--card-hover-shadow)] transition-all duration-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                viewport={{ once: true }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: item.bg }}
                >
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-[var(--text)] mb-2">{item.title}</h3>
                <p className="text-[var(--text-sub)] text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-[var(--bg-sub)]">
        <div className="text-center">
          <button
            onClick={() => onNavigate("pricing")}
            className="text-[var(--primary)] font-semibold hover:underline flex items-center gap-1 mx-auto"
          >
            有料プランとの違いを見る
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  )
}
