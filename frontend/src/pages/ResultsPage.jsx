import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FileText, RotateCcw, Map } from "lucide-react"
import { Mascot } from "../components/Mascot"
import { ConfettiEffect } from "../components/ConfettiEffect"

export function ResultsPage({ onNavigate, subject = "english", answers = [], selectedCharacter = "mascot" }) {
  const [displayPercentage, setDisplayPercentage] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  const correctCount = answers.filter((a) => a.isCorrect).length
  const totalCount = answers.length || 1
  const percentage = Math.round((correctCount / totalCount) * 100)
  const totalTime = answers.reduce((sum, a) => sum + (a.timeSpent || 0), 0)
  const minutes = Math.floor(totalTime / 60)
  const seconds = Math.round(totalTime % 60)

  const subjectColor = subject === "english" ? "var(--english)" : "var(--math)"

  useEffect(() => {
    const duration = 1500
    const steps = 60
    const increment = percentage / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= percentage) {
        setDisplayPercentage(percentage)
        clearInterval(timer)
        if (percentage >= 80) {
          setShowConfetti(true)
        }
      } else {
        setDisplayPercentage(Math.round(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [percentage])

  const getMascotMood = () => {
    if (percentage >= 80) return "happy"
    if (percentage >= 50) return "cheering"
    return "sad"
  }

  const getMascotMessage = () => {
    if (percentage >= 80) return "天才！よくがんばったね！"
    if (percentage >= 50) return "いい調子！もっとできるよ！"
    return "大丈夫！復習すればきっとできる！"
  }

  const radius = 70
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (displayPercentage / 100) * circumference

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <ConfettiEffect isActive={showConfetti} onComplete={() => setShowConfetti(false)} />

      <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full rounded-3xl bg-white p-8 shadow-[var(--card-shadow)]"
        >
          <h1 className="mb-8 text-center text-2xl font-bold text-[var(--text)]">結果発表</h1>

          {/* Donut Chart */}
          <div className="relative mb-8 flex justify-center">
            <svg width="180" height="180" className="-rotate-90">
              <circle cx="90" cy="90" r={radius} fill="none" stroke="var(--bg-sub)" strokeWidth="16" />
              <motion.circle
                cx="90" cy="90" r={radius} fill="none"
                stroke={subjectColor} strokeWidth="16" strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-[var(--text)]">{displayPercentage}%</span>
              <span className="text-sm text-[var(--text-sub)]">正答率</span>
            </div>
          </div>

          {/* Mascot */}
          <div className="mb-8 flex justify-center">
            <Mascot character={selectedCharacter} mood={getMascotMood()} size="lg" message={getMascotMessage()} />
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-3 gap-4">
            <div className="rounded-2xl bg-[var(--success-light)] p-4 text-center">
              <div className="text-2xl font-bold text-[var(--success)]">{correctCount}</div>
              <div className="text-xs text-[var(--text-sub)]">正解数</div>
            </div>
            <div className="rounded-2xl bg-[var(--primary-light)] p-4 text-center">
              <div className="text-2xl font-bold text-[var(--primary)]">{percentage}%</div>
              <div className="text-xs text-[var(--text-sub)]">正答率</div>
            </div>
            <div className="rounded-2xl bg-[var(--bg-sub)] p-4 text-center">
              <div className="text-2xl font-bold text-[var(--text)]">
                {minutes > 0 ? `${minutes}:${seconds.toString().padStart(2, "0")}` : `${seconds}秒`}
              </div>
              <div className="text-xs text-[var(--text-sub)]">時間</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => onNavigate("review")} className="flex items-center justify-center gap-2 rounded-2xl border-2 border-[var(--primary)] bg-white px-6 py-4 font-bold text-[var(--primary)] transition-all hover:bg-[var(--primary-light)]">
              <FileText className="h-5 w-5" />
              解答を確認
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => onNavigate("quiz")} className="flex items-center justify-center gap-2 rounded-2xl border-2 border-[var(--text-muted)] bg-white px-6 py-4 font-bold text-[var(--text-sub)] transition-all hover:border-[var(--text-sub)] hover:bg-[var(--bg-sub)]">
              <RotateCcw className="h-5 w-5" />
              もう一度
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => onNavigate("stageMap")} className="flex items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-6 py-4 font-bold text-white shadow-md transition-all hover:shadow-lg">
              <Map className="h-5 w-5" />
              マップへ戻る
            </motion.button>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
