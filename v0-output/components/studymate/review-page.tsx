"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Check, X, Map } from "lucide-react"
import { Mascot } from "./mascot"
import type { Question, Answer } from "./quiz-page"

interface ReviewPageProps {
  onNavigate: (page: string) => void
  subject: "english" | "math"
  answers: Answer[]
  questions: Question[]
  selectedCharacter: "mascot" | "mona"
}

const optionLabels = ["A", "B", "C", "D"]

export function ReviewPage({
  onNavigate,
  subject,
  answers,
  questions,
  selectedCharacter,
}: ReviewPageProps) {
  const subjectColor = subject === "english" ? "var(--english)" : "var(--math)"

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--card-border)] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <button
            onClick={() => onNavigate("results")}
            className="flex items-center gap-2 text-[var(--text-sub)] hover:text-[var(--text)]"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm">結果へ戻る</span>
          </button>

          <h1 className="text-lg font-bold text-[var(--text)]">解答確認</h1>

          <div className="w-16" />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <div className="space-y-6">
          {questions.map((question, qIndex) => {
            const answer = answers.find((a) => a.questionId === question.id)
            const isCorrect = answer?.isCorrect ?? false

            return (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: qIndex * 0.1 }}
                className="rounded-3xl bg-white p-6 shadow-[var(--card-shadow)]"
              >
                {/* Question Header */}
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className="rounded-full px-4 py-1 text-sm font-bold text-white"
                    style={{ backgroundColor: subjectColor }}
                  >
                    Q{qIndex + 1}
                  </div>
                  <div
                    className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                      isCorrect
                        ? "bg-[var(--success-light)] text-[var(--success)]"
                        : "bg-[var(--error-light)] text-[var(--error)]"
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <Check className="h-3 w-3" /> 正解
                      </>
                    ) : (
                      <>
                        <X className="h-3 w-3" /> 不正解
                      </>
                    )}
                  </div>
                </div>

                {/* Question Text */}
                <h3 className="mb-4 text-lg font-bold text-[var(--text)]">
                  {question.text}
                </h3>

                {/* Options */}
                <div className="mb-4 space-y-2">
                  {question.options.map((option, oIndex) => {
                    const isSelected = answer?.selectedIndex === oIndex
                    const isCorrectOption = oIndex === question.correctIndex

                    let bgColor = "bg-white"
                    let borderColor = "border-[var(--card-border)]"
                    let textColor = "text-[var(--text)]"

                    if (isCorrectOption) {
                      bgColor = "bg-[var(--success-light)]"
                      borderColor = "border-[var(--success)]"
                      textColor = "text-[var(--success)]"
                    } else if (isSelected && !isCorrectOption) {
                      bgColor = "bg-[var(--error-light)]"
                      borderColor = "border-[var(--error)]"
                      textColor = "text-[var(--error)]"
                    }

                    return (
                      <div
                        key={oIndex}
                        className={`flex items-center gap-3 rounded-2xl border-2 p-3 ${bgColor} ${borderColor}`}
                      >
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                            isCorrectOption
                              ? "bg-[var(--success)] text-white"
                              : isSelected && !isCorrectOption
                              ? "bg-[var(--error)] text-white"
                              : "border-2 border-[var(--text-muted)] text-[var(--text-muted)]"
                          }`}
                        >
                          {isCorrectOption ? (
                            <Check className="h-4 w-4" />
                          ) : isSelected && !isCorrectOption ? (
                            <X className="h-4 w-4" />
                          ) : (
                            optionLabels[oIndex]
                          )}
                        </span>
                        <span className={`flex-1 text-sm font-medium ${textColor}`}>
                          {option}
                        </span>
                        {isSelected && (
                          <span className="text-xs text-[var(--text-muted)]">
                            あなたの回答
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Explanation */}
                <div className="rounded-2xl bg-[var(--bg-sub)] p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-bold text-[var(--text)]">
                    💡 解説
                  </div>
                  <p className="text-sm text-[var(--text-sub)]">
                    {question.explanation}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: questions.length * 0.1 }}
          className="mt-8"
        >
          <div className="mb-6 flex justify-center">
            <Mascot
              character={selectedCharacter}
              mood="cheering"
              size="lg"
              message="お疲れさま！次もがんばろう！"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate("stageMap")}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-6 py-4 font-bold text-white shadow-md transition-all hover:shadow-lg"
          >
            <Map className="h-5 w-5" />
            マップへ戻る
          </motion.button>
        </motion.div>
      </main>
    </div>
  )
}
