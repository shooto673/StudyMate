import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Trophy, Star, Languages, Calculator, FileText } from "lucide-react"
import { Header } from "../components/Header"
import { FloatingDecorations } from "../components/FloatingDecorations"
import { Mascot } from "../components/Mascot"
import { ConfettiEffect } from "../components/ConfettiEffect"

const gradeLabels = {
  j1: "中1",
  j2: "中2",
  j3: "中3",
}

export function StageMapPage({
  onNavigate,
  grade,
  onSelectUnit,
  units = [],
  stats = { totalAnswers: 0, accuracy: 0, streak: 0 },
  usageToday = 0,
  dailyLimit = 10,
  planTier = "free",
  userName = "",
  selectedCharacter = "mascot",
}) {
  const [activeSubject, setActiveSubject] = useState("english")
  const [showConfetti, setShowConfetti] = useState(false)
  const [loadingUnit, setLoadingUnit] = useState(null)
  const mapRef = useRef(null)
  const currentNodeRef = useRef(null)

  const handleUnitClick = async (subject, slug) => {
    if (loadingUnit) return // 連打防止
    setLoadingUnit(slug)
    try {
      await onSelectUnit(subject, slug)
    } finally {
      setLoadingUnit(null)
    }
  }

  const filteredUnits = units
    .filter((u) => u.subject === activeSubject)
    .sort((a, b) => a.order - b.order)

  const allCompleted = filteredUnits.length > 0 && filteredUnits.every((u) => u.progress >= 80)

  useEffect(() => {
    if (currentNodeRef.current) {
      currentNodeRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [activeSubject])

  const getNodeStyle = (unit) => {
    if (unit.progress >= 80) return "mastered"
    if (unit.progress > 0) return "learning"
    return "unlocked"
  }

  const subjectColorHex = activeSubject === "english" ? "#4DABF7" : "#FF922B"
  const subjectColorLightHex = activeSubject === "english" ? "#E7F5FF" : "#FFF4E6"

  const getNodePosition = (index) => {
    const positions = [0, -80, 0, 80, 0, -80, 0, 80]
    return positions[index % positions.length]
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <FloatingDecorations />
      <Header isLoggedIn grade={gradeLabels[grade]} onNavigate={onNavigate} />
      <ConfettiEffect isActive={showConfetti} onComplete={() => setShowConfetti(false)} />

      <main className="mx-auto max-w-lg px-4 py-6">
        {/* Welcome Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 rounded-3xl bg-white p-5 shadow-[var(--card-shadow)]">
          <div className="flex items-start gap-4">
            <Mascot character={selectedCharacter} mood="studying" size="sm" animate={false} />
            <div className="flex-1">
              <h2 className="text-lg font-bold text-[var(--text)]">おかえり、{userName}さん！</h2>
              <p className="text-sm text-[var(--text-sub)]">今日も一緒にがんばろう！</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-[var(--primary-light)] px-3 py-1 text-[var(--primary)] font-medium">{stats.totalAnswers}問回答</span>
                <span className="rounded-full bg-[var(--success-light)] px-3 py-1 text-[var(--success)] font-medium">{stats.accuracy}%正答率</span>
                <span className="rounded-full bg-[var(--accent-light)] px-3 py-1 text-[var(--accent)] font-medium">{stats.streak}日連続</span>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-medium ${usageToday >= dailyLimit && planTier !== 'premium' ? 'text-[var(--error)]' : 'text-[var(--text-sub)]'}`}>
                    今日 {usageToday}/{planTier === 'premium' ? '∞' : dailyLimit}問
                  </span>
                  {usageToday >= dailyLimit && planTier !== 'premium' && (
                    <span className="rounded-full bg-[var(--error-light)] px-2 py-0.5 text-[var(--error)] font-medium">上限到達</span>
                  )}
                </div>
                {planTier !== 'premium' && (
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-[var(--bg-sub)]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((usageToday / dailyLimit) * 100, 100)}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`h-full rounded-full ${usageToday >= dailyLimit ? 'bg-[var(--error)]' : 'bg-[var(--primary)]'}`}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Subject Tabs */}
        <div className="mb-6 flex justify-center gap-2">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setActiveSubject("english")}
            className={`flex items-center gap-2 rounded-2xl px-6 py-3 font-bold transition-all ${activeSubject === "english" ? "bg-[var(--english)] text-white shadow-md" : "bg-[var(--english-light)] text-[var(--english)]"}`}>
            <Languages className="h-5 w-5" />英語
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setActiveSubject("math")}
            className={`flex items-center gap-2 rounded-2xl px-6 py-3 font-bold transition-all ${activeSubject === "math" ? "bg-[var(--math)] text-white shadow-md" : "bg-[var(--math-light)] text-[var(--math)]"}`}>
            <Calculator className="h-5 w-5" />数学
          </motion.button>
        </div>

        {/* Stage Map */}
        <div ref={mapRef} className="relative pb-8">
          <AnimatePresence mode="wait">
            <motion.div key={activeSubject} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative">
              {/* SVG Paths */}
              <svg className="absolute left-1/2 top-0 h-full -translate-x-1/2" style={{ width: 200, zIndex: 0 }} preserveAspectRatio="none">
                {filteredUnits.map((unit, index) => {
                  if (index === filteredUnits.length - 1) return null
                  const startX = 100 + getNodePosition(index)
                  const endX = 100 + getNodePosition(index + 1)
                  const startY = index * 160 + 50
                  const endY = (index + 1) * 160 + 50
                  const isCompleted = unit.progress > 0
                  return (
                    <path key={`path-${index}`}
                      d={`M ${startX} ${startY} C ${startX} ${startY + 60}, ${endX} ${endY - 60}, ${endX} ${endY}`}
                      stroke={isCompleted ? subjectColorHex : "#DEE2E6"} strokeWidth={isCompleted ? 6 : 4} strokeLinecap="round" fill="none" opacity={isCompleted ? 1 : 0.5} />
                  )
                })}
                {filteredUnits.length > 0 && (
                  <path
                    d={`M ${100 + getNodePosition(filteredUnits.length - 1)} ${(filteredUnits.length - 1) * 160 + 50} C ${100 + getNodePosition(filteredUnits.length - 1)} ${(filteredUnits.length - 1) * 160 + 110}, 100 ${filteredUnits.length * 160 - 10}, 100 ${filteredUnits.length * 160 + 50}`}
                    stroke={allCompleted ? "#FCC419" : "#DEE2E6"} strokeWidth={allCompleted ? 6 : 4} strokeLinecap="round" strokeDasharray={allCompleted ? "none" : "12 8"} fill="none" opacity={allCompleted ? 1 : 0.5} />
                )}
              </svg>

              {/* Nodes */}
              <div className="relative z-10 flex flex-col items-center">
                {filteredUnits.map((unit, index) => {
                  const style = getNodeStyle(unit)
                  const isCurrent = style === "learning"
                  const xOffset = getNodePosition(index)

                  return (
                    <motion.div key={unit.slug} ref={isCurrent ? currentNodeRef : undefined}
                      initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                      style={{ marginLeft: xOffset, height: 160 }} className="flex items-start justify-center pt-4">
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                        onClick={() => handleUnitClick(activeSubject, unit.slug)}
                        disabled={!!loadingUnit}
                        className="relative flex flex-col items-center cursor-pointer p-3 -m-3">
                        {style === "mastered" && (
                          <motion.div initial={{ y: 10, opacity: 0, scale: 0 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 + 0.2 }} className="absolute -top-5 z-20">
                            <Star className="h-7 w-7 fill-[#FCC419] text-[#FCC419] drop-shadow-md" />
                          </motion.div>
                        )}
                        <div className="relative">
                          {style === "learning" && (
                            <svg className="absolute -inset-2 -rotate-90" style={{ width: 100, height: 100 }}>
                              <circle cx="50" cy="50" r="44" fill="none" stroke={subjectColorLightHex} strokeWidth="8" />
                              <motion.circle cx="50" cy="50" r="44" fill="none" stroke={subjectColorHex} strokeWidth="8" strokeLinecap="round"
                                initial={{ strokeDasharray: "0 277" }} animate={{ strokeDasharray: `${(unit.progress / 100) * 277} 277` }} transition={{ duration: 1, delay: index * 0.1 + 0.3 }} />
                            </svg>
                          )}
                          <div className={`relative flex items-center justify-center rounded-full shadow-lg transition-all ${style === "mastered" ? "h-20 w-20" : style === "learning" ? "h-20 w-20" : "h-16 w-16 border-4"}`}
                            style={{ backgroundColor: style === "mastered" ? subjectColorHex : "#FFFFFF", borderColor: style === "unlocked" ? "#DEE2E6" : undefined, boxShadow: style === "mastered" ? `0 4px 20px ${subjectColorHex}40` : style === "learning" ? `0 4px 20px ${subjectColorHex}30` : "0 2px 8px rgba(0,0,0,0.08)" }}>
                            {style === "mastered" ? (
                              <Check className="h-10 w-10 text-white" strokeWidth={3} />
                            ) : (
                              <FileText className={`h-8 w-8 ${style === "learning" ? "" : "text-[#ADB5BD]"}`} style={{ color: style === "learning" ? subjectColorHex : undefined }} />
                            )}
                          </div>
                          {style === "learning" && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: index * 0.1 + 0.4, type: "spring" }}
                              className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-lg px-3 py-1 text-xs font-bold text-white shadow-md" style={{ backgroundColor: subjectColorHex }}>
                              学習中 {unit.progress}%
                            </motion.div>
                          )}
                        </div>
                        <span className={`mt-4 text-sm font-bold ${style === "mastered" || style === "learning" ? "text-[var(--text)]" : "text-[var(--text-muted)]"}`}>
                          {loadingUnit === unit.slug ? "読み込み中..." : unit.title}
                        </span>
                        {isCurrent && (
                          <motion.div initial={{ opacity: 0, x: xOffset > 0 ? -30 : 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                            className={`absolute top-0 ${xOffset >= 0 ? "-left-24" : "-right-24"}`}>
                            <Mascot character={selectedCharacter} mood="cheering" size="sm" />
                          </motion.div>
                        )}
                      </motion.button>
                    </motion.div>
                  )
                })}

                {/* Goal Node */}
                <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: filteredUnits.length * 0.1, type: "spring" }} style={{ height: 160 }} className="flex items-start justify-center pt-4">
                  <div className={`flex flex-col items-center ${allCompleted ? "" : "opacity-60"}`}>
                    <div className={`flex h-24 w-24 items-center justify-center rounded-full ${allCompleted ? "bg-gradient-to-br from-[#FCC419] to-[#FF922B] shadow-xl" : "border-4 border-dashed border-[#DEE2E6] bg-white"}`}
                      style={{ boxShadow: allCompleted ? "0 8px 30px rgba(252, 196, 25, 0.4)" : undefined }}>
                      <Trophy className={`h-12 w-12 ${allCompleted ? "text-white" : "text-[#DEE2E6]"}`} />
                    </div>
                    <span className={`mt-3 text-sm font-bold ${allCompleted ? "text-[var(--text)]" : "text-[var(--text-muted)]"}`}>
                      {allCompleted ? "全単元クリア！" : "ゴールを目指そう！"}
                    </span>
                  </div>
                  {allCompleted && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="absolute mt-32 flex justify-center gap-4">
                      <Mascot character="mascot" mood="cheering" size="md" />
                      <Mascot character="mona" mood="cheering" size="md" />
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
