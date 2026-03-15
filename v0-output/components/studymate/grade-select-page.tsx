"use client"

import { motion } from "framer-motion"
import { Lock } from "lucide-react"
import { Header } from "./header"
import { FloatingDecorations } from "./floating-decorations"
import { Mascot } from "./mascot"

interface GradeSelectPageProps {
  onNavigate: (page: string) => void
  onSelectGrade: (grade: string) => void
  selectedCharacter: "mascot" | "mona"
}

const grades = [
  { id: "e4", label: "小学4年", emoji: "🌱", locked: true },
  { id: "e5", label: "小学5年", emoji: "🌻", locked: true },
  { id: "e6", label: "小学6年", emoji: "🍀", locked: true },
  { id: "j1", label: "中学1年", emoji: "🌸", locked: false },
  { id: "j2", label: "中学2年", emoji: "🌿", locked: false },
  { id: "j3", label: "中学3年", emoji: "🌙", locked: false },
]

export function GradeSelectPage({ onNavigate, onSelectGrade, selectedCharacter }: GradeSelectPageProps) {
  const handleSelectGrade = (gradeId: string, locked: boolean) => {
    if (!locked) {
      onSelectGrade(gradeId)
      onNavigate("dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <FloatingDecorations />
      <Header onNavigate={onNavigate} />

      <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12">
        <div className="mb-8 flex justify-center">
          <Mascot
            character={selectedCharacter}
            mood="thinking"
            size="lg"
            message="どの学年？"
          />
        </div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center text-2xl font-bold text-[var(--text)] md:text-3xl"
        >
          学年を選んでね
        </motion.h1>

        <div className="grid w-full max-w-2xl grid-cols-2 gap-4 md:grid-cols-3">
          {grades.map((grade, index) => (
            <motion.button
              key={grade.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={!grade.locked ? { scale: 1.03, y: -4 } : {}}
              whileTap={!grade.locked ? { scale: 0.97 } : {}}
              onClick={() => handleSelectGrade(grade.id, grade.locked)}
              disabled={grade.locked}
              className={`relative rounded-3xl p-6 text-center shadow-[var(--card-shadow)] transition-all ${
                grade.locked
                  ? "cursor-not-allowed bg-gray-100 opacity-60"
                  : "bg-white hover:shadow-[var(--card-hover-shadow)]"
              }`}
            >
              {grade.locked && (
                <div className="absolute right-3 top-3">
                  <Lock className="h-4 w-4 text-[var(--text-muted)]" />
                </div>
              )}
              
              <div className="mb-2 text-3xl">{grade.emoji}</div>
              <h3 className="mb-2 text-lg font-bold text-[var(--text)]">
                {grade.label}
              </h3>
              
              {grade.locked ? (
                <p className="text-xs text-[var(--text-muted)]">準備中...</p>
              ) : (
                <p className="text-xs text-[var(--success)]">
                  英語・数学対応中 ✅
                </p>
              )}
            </motion.button>
          ))}
        </div>
      </main>
    </div>
  )
}
