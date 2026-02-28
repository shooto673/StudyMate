import { useState } from "react"
import { motion } from "framer-motion"
import { Lock, Check, ArrowRight } from "lucide-react"
import Mascot from "../components/Mascot"

const grades = [
  { id: "e4", label: "小学4年生", emoji: "🌱", available: false, subjects: "近日公開" },
  { id: "e5", label: "小学5年生", emoji: "🌿", available: false, subjects: "近日公開" },
  { id: "e6", label: "小学6年生", emoji: "🍀", available: false, subjects: "近日公開" },
  { id: "j1", label: "中学1年生", emoji: "📗", available: true, subjects: "英語・数学対応中" },
  { id: "j2", label: "中学2年生", emoji: "📘", available: true, subjects: "英語・数学対応中" },
  { id: "j3", label: "中学3年生", emoji: "📙", available: true, subjects: "英語・数学対応中" },
]

export default function GradeSelectPage({ onNavigate, onSelectGrade }) {
  const [selectedGrade, setSelectedGrade] = useState(null)

  const handleNext = () => {
    if (selectedGrade) {
      const grade = grades.find(g => g.id === selectedGrade)
      if (grade) {
        onSelectGrade(grade.label)
        onNavigate("dashboard")
      }
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Mascot */}
        <div className="flex justify-center mb-8">
          <Mascot mood="normal" size="md" message="学年を教えてね！" />
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-center text-[var(--text)] mb-8">
          学年を選んでください
        </h1>

        {/* Grade Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {grades.map((grade, i) => (
            <motion.button
              key={grade.id}
              onClick={() => grade.available && setSelectedGrade(grade.id)}
              disabled={!grade.available}
              className={`
                relative p-6 rounded-3xl transition-all duration-200
                ${grade.available
                  ? selectedGrade === grade.id
                    ? "bg-[var(--primary-light)] border-2 border-[var(--primary)] shadow-lg"
                    : "bg-white border-2 border-transparent shadow-[var(--card-shadow)] hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-lg"
                  : "bg-gray-100 opacity-40 cursor-not-allowed"
                }
              `}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              {/* Selected checkmark */}
              {selectedGrade === grade.id && (
                <motion.div
                  className="absolute top-3 right-3 w-6 h-6 bg-[var(--primary)] rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              )}

              {/* Locked badge */}
              {!grade.available && (
                <div className="absolute top-3 right-3">
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
              )}

              <div className="text-4xl mb-3">{grade.emoji}</div>
              <div className="font-bold text-[var(--text)] mb-1">{grade.label}</div>
              <div className={`text-xs ${grade.available ? "text-[var(--primary)]" : "text-gray-400"}`}>
                {grade.subjects}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Next Button */}
        <div className="flex justify-center">
          <motion.button
            onClick={handleNext}
            disabled={!selectedGrade}
            className={`
              px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-2 transition-all duration-200
              ${selectedGrade
                ? "bg-[var(--primary)] text-white hover:shadow-lg hover:scale-105"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }
            `}
            whileTap={selectedGrade ? { scale: 0.98 } : {}}
          >
            次へ
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
