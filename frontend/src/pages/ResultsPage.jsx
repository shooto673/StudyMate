import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ClipboardList, RotateCcw, Home } from "lucide-react"
import { Mascot } from "../components/Mascot"

function useCountUp(target, duration = 1500) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime
    let animationFrame

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [target, duration])

  return count
}

export function ResultsPage({ onNavigate, subject, answers }) {
  const correctCount = answers.filter(a => a.isCorrect).length
  const totalCount = answers.length || 5
  const scorePercent = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0

  const animatedScore = useCountUp(scorePercent)

  const subjectColor = subject === "english" ? "var(--english)" : "var(--math)"
  const unitName = subject === "english" ? "be動詞" : "正負の数"

  const isExcellent = scorePercent >= 80
  const isGood = scorePercent >= 50 && scorePercent < 80

  const circleColor = isExcellent ? "var(--warning)" : isGood ? "var(--primary)" : "var(--error)"
  const mascotMood = isExcellent ? "happy" : isGood ? "cheering" : "sad"
  const mascotMessage = isExcellent
    ? "天才！よくがんばったね！"
    : isGood
      ? "いい調子！もっとできるよ！"
      : "大丈夫！復習すればきっとできる！"

  const radius = 70
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference

  return (
    <div className="min-h-screen bg-[var(--bg)] py-12 px-4 relative overflow-hidden">
      {isExcellent && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-[var(--warning)] text-2xl"
              style={{ left: `${10 + Math.random() * 80}%`, top: `${10 + Math.random() * 80}%` }}
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{
                rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 },
              }}
            >
              ★
            </motion.div>
          ))}
        </div>
      )}

      <div className="max-w-md mx-auto relative z-10">
        <motion.div
          className="flex justify-center mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <div className="relative">
            <svg className="w-48 h-48 transform -rotate-90">
              <circle cx="96" cy="96" r={radius} stroke="var(--bg-sub)" strokeWidth="12" fill="none" />
              <motion.circle
                cx="96" cy="96" r={radius} stroke={circleColor} strokeWidth="12" fill="none" strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl font-extrabold" style={{ color: circleColor }}>{animatedScore}%</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col items-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Mascot mood={mascotMood} size="lg" message={mascotMessage} />
          <p className="text-xl font-extrabold text-[var(--text)] mt-4">
            {totalCount}問中 {correctCount}問正解！
          </p>
        </motion.div>

        <motion.div
          className="bg-white rounded-3xl p-6 shadow-[var(--card-shadow)] mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full text-white text-xs font-bold" style={{ backgroundColor: subjectColor }}>
              {subject === "english" ? "🔤 英語" : "🔢 数学"}
            </span>
            <span className="font-bold text-[var(--text)]">{unitName}</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[var(--primary-light)] flex items-center justify-center">
                <span className="text-[var(--primary)]">✓</span>
              </div>
              <div>
                <div className="text-sm text-[var(--text-sub)]">正解数</div>
                <div className="font-bold text-[var(--text)]">{correctCount} / {totalCount}問</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[var(--success-light)] flex items-center justify-center">
                <span className="text-[var(--success)]">%</span>
              </div>
              <div>
                <div className="text-sm text-[var(--text-sub)]">正答率</div>
                <div className="font-bold text-[var(--text)]">{scorePercent}%</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[var(--english-light)] flex items-center justify-center">
                <span className="text-[var(--english)]">⏱</span>
              </div>
              <div>
                <div className="text-sm text-[var(--text-sub)]">かかった時間</div>
                <div className="font-bold text-[var(--text)]">2分30秒</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <button
            onClick={() => onNavigate("review")}
            className="flex-1 px-6 py-4 bg-[var(--primary)] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <ClipboardList className="w-5 h-5" />
            解答を確認
          </button>
          <button
            onClick={() => onNavigate("quiz")}
            className="flex-1 px-6 py-4 bg-white border-2 border-[var(--primary)] text-[var(--primary)] rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <RotateCcw className="w-5 h-5" />
            もう一度
          </button>
        </motion.div>

        <button
          onClick={() => onNavigate("dashboard")}
          className="w-full mt-4 py-3 text-[var(--text-sub)] font-semibold flex items-center justify-center gap-2 hover:text-[var(--text)] transition-colors"
        >
          <Home className="w-4 h-4" />
          ダッシュボードへ
        </button>
      </div>
    </div>
  )
}
