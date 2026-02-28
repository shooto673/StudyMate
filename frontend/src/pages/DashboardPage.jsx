import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BarChart3, Target, Flame, ArrowRight, Medal } from "lucide-react"
import { Mascot } from "../components/Mascot"
import { Header } from "../components/Header"

const englishUnits = [
  { slug: "j1-be", title: "be動詞", subject: "english", icon: "🔤", progress: 80 },
  { slug: "j1-do", title: "一般動詞", subject: "english", icon: "🔤", progress: 45 },
  { slug: "j1-neg", title: "疑問文・否定文", subject: "english", icon: "🔤", progress: 0 },
]

const mathUnits = [
  { slug: "j1-positive-negative", title: "正負の数", subject: "math", icon: "🔢", progress: 60 },
  { slug: "j1-equations", title: "一次方程式", subject: "math", icon: "🔢", progress: 25 },
  { slug: "j1-geometry", title: "平面図形", subject: "math", icon: "🔢", progress: 0 },
]

function useCountUp(target, duration = 1000) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime
    let animationFrame

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * target))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [target, duration])

  return count
}

export function DashboardPage({ onNavigate, grade, onSelectUnit, units: unitsProp, stats, usageToday, dailyLimit, userName }) {
  const [selectedSubject, setSelectedSubject] = useState("english")

  const defaultStats = { totalAnswers: 42, accuracy: 78, streak: 3 }
  const resolvedStats = stats || defaultStats

  const totalAnswers = useCountUp(resolvedStats.totalAnswers)
  const accuracy = useCountUp(resolvedStats.accuracy)
  const streak = useCountUp(resolvedStats.streak)

  const resolvedUsageToday = usageToday != null ? usageToday : 3
  const resolvedDailyLimit = dailyLimit != null ? dailyLimit : 10
  const resolvedUserName = userName || "ユーザー"

  const hasUnitsProp = Array.isArray(unitsProp) && unitsProp.length > 0

  const displayUnits = hasUnitsProp
    ? unitsProp.filter(unit => unit.subject === selectedSubject)
    : selectedSubject === "english" ? englishUnits : mathUnits

  const subjectColor = selectedSubject === "english" ? "var(--english)" : "var(--math)"
  const subjectLightColor = selectedSubject === "english" ? "var(--english-light)" : "var(--math-light)"

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Header isLoggedIn grade={grade} onNavigate={onNavigate} />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Welcome Card */}
        <motion.div
          className="bg-white rounded-3xl p-6 shadow-[var(--card-shadow)] mb-6 overflow-hidden relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: "linear-gradient(135deg, var(--bg-sub) 0%, transparent 50%)",
            }}
          />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-extrabold text-[var(--text)] mb-2">
                おかえり、{resolvedUserName}さん！👋
              </h1>
              <p className="text-[var(--text-sub)]">今日は何を勉強する？</p>
            </div>
            <Mascot mood="studying" size="md" message="今日は何を勉強する？" />
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Total Answers */}
          <motion.div
            className="bg-white rounded-2xl p-4 shadow-[var(--card-shadow)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[var(--primary-light)] flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <span className="text-sm text-[var(--text-sub)]">総回答数</span>
            </div>
            <div className="text-3xl font-extrabold text-[var(--text)]">
              {totalAnswers}問
            </div>
          </motion.div>

          {/* Accuracy */}
          <motion.div
            className="bg-white rounded-2xl p-4 shadow-[var(--card-shadow)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[var(--success-light)] flex items-center justify-center">
                <Target className="w-5 h-5 text-[var(--success)]" />
              </div>
              <span className="text-sm text-[var(--text-sub)]">正答率</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 transform -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="var(--success-light)"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="var(--success)"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${accuracy * 1.256} 126`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="text-3xl font-extrabold text-[var(--text)]">{accuracy}%</span>
            </div>
          </motion.div>

          {/* Streak */}
          <motion.div
            className="bg-white rounded-2xl p-4 shadow-[var(--card-shadow)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[var(--accent-light)] flex items-center justify-center">
                <Flame className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <span className="text-sm text-[var(--text-sub)]">連続日数</span>
            </div>
            <div className="text-3xl font-extrabold text-[var(--text)] flex items-center gap-1">
              {streak}日
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
              >
                🔥
              </motion.span>
            </div>
          </motion.div>
        </div>

        {/* Usage bar */}
        <motion.div
          className="bg-white rounded-2xl p-4 shadow-[var(--card-shadow)] mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[var(--text)]">今日の学習</span>
            <span className="text-sm text-[var(--text-sub)]">{resolvedUsageToday} / {resolvedDailyLimit}問</span>
          </div>
          <div className="h-3 bg-[var(--bg-sub)] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, var(--primary), var(--english))` }}
              initial={{ width: 0 }}
              animate={{ width: `${resolvedDailyLimit > 0 ? (resolvedUsageToday / resolvedDailyLimit) * 100 : 0}%` }}
              transition={{ duration: 0.8, type: "spring" }}
            />
          </div>
        </motion.div>

        {/* Subject Tabs */}
        <motion.div
          className="flex gap-3 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <button
            onClick={() => setSelectedSubject("english")}
            className={`
              px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-all duration-200
              ${selectedSubject === "english"
                ? "bg-[var(--english)] text-white shadow-lg"
                : "bg-white border border-[var(--card-border)] text-[var(--text-sub)] hover:border-[var(--english)]"
              }
            `}
          >
            <span>🔤</span> 英語
          </button>
          <button
            onClick={() => setSelectedSubject("math")}
            className={`
              px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-all duration-200
              ${selectedSubject === "math"
                ? "bg-[var(--math)] text-white shadow-lg"
                : "bg-white border border-[var(--card-border)] text-[var(--text-sub)] hover:border-[var(--math)]"
              }
            `}
          >
            <span>🔢</span> 数学
          </button>
        </motion.div>

        {/* Unit Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedSubject}
            className="grid md:grid-cols-2 gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {displayUnits.map((unit, i) => (
              <motion.div
                key={unit.slug}
                className="relative bg-white rounded-2xl p-5 shadow-[var(--card-shadow)] hover:-translate-y-1 hover:shadow-[var(--card-hover-shadow)] transition-all duration-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
              >
                {/* Subject indicator */}
                <div
                  className="absolute top-4 left-4 w-2 h-2 rounded-full"
                  style={{ backgroundColor: subjectColor }}
                />

                {/* Gold medal for high progress */}
                {unit.progress >= 80 && (
                  <motion.div
                    className="absolute top-3 right-3"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.3 }}
                  >
                    <Medal className="w-6 h-6 text-[var(--warning)]" />
                  </motion.div>
                )}

                <h3 className="text-lg font-bold text-[var(--text)] mb-3 ml-4">
                  {unit.title}
                </h3>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[var(--text-sub)]">進捗</span>
                    <span className="text-xs text-[var(--text-sub)]">{unit.progress}%</span>
                  </div>
                  <div className="h-2 bg-[var(--bg-sub)] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: subjectColor }}
                      initial={{ width: 0 }}
                      animate={{ width: `${unit.progress}%` }}
                      transition={{ duration: 0.8, type: "spring", delay: i * 0.1 }}
                    />
                  </div>
                </div>

                {/* Study button */}
                <button
                  onClick={() => onSelectUnit(unit.subject || selectedSubject, unit.slug)}
                  className="flex items-center gap-1 text-sm font-semibold transition-colors"
                  style={{ color: subjectColor }}
                >
                  学習する
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Footer link */}
        <div className="text-center mt-12">
          <button
            onClick={() => onNavigate("pricing")}
            className="text-[var(--primary)] font-semibold hover:underline flex items-center gap-1 mx-auto"
          >
            プランを変更
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
