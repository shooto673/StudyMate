import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Check, X } from "lucide-react"
import { Mascot } from "../components/Mascot"
import { ConfettiEffect } from "../components/ConfettiEffect"

const optionLabels = ["A", "B", "C", "D"]

const dummyQuestions = [
  { id: "q1", text: "She (   ) a student.", options: ["am", "is", "are", "be"], correctIndex: 1, explanation: "主語がSheのときはisです。" },
  { id: "q2", text: "I (   ) from Osaka.", options: ["am", "is", "are", "be"], correctIndex: 0, explanation: "Iのときはamを使います。" },
  { id: "q3", text: "They (   ) my friends.", options: ["am", "is", "are", "be"], correctIndex: 2, explanation: "複数主語Theyにはareを使います。" },
  { id: "q4", text: "He is tired. の否定文は？", options: ["He not is tired.", "He is not tired.", "He does not tired.", "He are not tired."], correctIndex: 1, explanation: "be動詞の否定はbe動詞 + notです。" },
  { id: "q5", text: "You are a student. の疑問文は？", options: ["Do you a student?", "Are you a student?", "Is you a student?", "Does you a student?"], correctIndex: 1, explanation: "be動詞の疑問文はbe動詞を先頭に出します。" },
]

export function QuizPage({ onNavigate, subject = "english", unitTitle = "", onComplete, questions: questionsProp = [], selectedCharacter = "mascot" }) {
  const questions = questionsProp.length > 0 ? questionsProp : dummyQuestions

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [answers, setAnswers] = useState([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [startTime, setStartTime] = useState(Date.now())
  const [showXP, setShowXP] = useState(false)

  const currentQuestion = questions[currentIndex]
  const isCorrect = selectedOption === currentQuestion?.correctIndex
  const subjectColor = subject === "english" ? "var(--english)" : "var(--math)"
  const subjectBg = subject === "english" ? "var(--english-light)" : "var(--math-light)"

  useEffect(() => {
    setStartTime(Date.now())
  }, [currentIndex])

  const handleSelectOption = (index) => {
    if (hasAnswered) return
    setSelectedOption(index)
  }

  const handleSubmit = () => {
    if (selectedOption === null) return

    const timeSpent = (Date.now() - startTime) / 1000
    const newAnswer = {
      questionId: currentQuestion.id,
      selectedIndex: selectedOption,
      isCorrect: selectedOption === currentQuestion.correctIndex,
      timeSpent,
    }

    setAnswers([...answers, newAnswer])
    setHasAnswered(true)

    if (newAnswer.isCorrect) {
      setShowConfetti(true)
      setShowXP(true)
      setTimeout(() => setShowXP(false), 1500)
    }
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedOption(null)
      setHasAnswered(false)
    } else {
      const finalAnswers = [...answers]
      if (onComplete) onComplete(finalAnswers)
    }
  }

  const getMascotMessage = () => {
    if (!hasAnswered) return "じっくり考えてみよう..."
    if (isCorrect) return "すごい！正解だよ！"
    return "惜しい！次はきっとできるよ！"
  }

  const getMascotMood = () => {
    if (!hasAnswered) return "thinking"
    if (isCorrect) return "happy"
    return "sad"
  }

  if (!currentQuestion) return null

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <ConfettiEffect isActive={showConfetti} onComplete={() => setShowConfetti(false)} />

      <AnimatePresence>
        {showXP && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed left-1/2 top-1/3 z-50 -translate-x-1/2 rounded-2xl bg-[var(--success)] px-6 py-3 font-bold text-white shadow-lg"
          >
            +10 XP
          </motion.div>
        )}
      </AnimatePresence>

      <header className="sticky top-0 z-40 border-b border-[var(--card-border)] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <button onClick={() => onNavigate("stageMap")} className="flex items-center gap-2 text-[var(--text-sub)] hover:text-[var(--text)]">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm">戻る</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="rounded-full px-3 py-1 text-xs font-bold text-white" style={{ backgroundColor: subjectColor }}>
              {subject === "english" ? "🔤 英語" : "🔢 数学"}
            </span>
            <span className="text-sm font-medium text-[var(--text)]">{unitTitle}</span>
          </div>
          <div className="w-16" />
        </div>
        <div className="flex justify-center gap-2 pb-3">
          {questions.map((_, index) => (
            <div key={index} className={`h-2 w-2 rounded-full transition-all ${index < currentIndex ? "bg-[var(--success)]" : index === currentIndex ? "w-6 bg-[var(--primary)]" : "bg-[var(--text-muted)]"}`} />
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <motion.div key={currentIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-3xl bg-white p-6 shadow-[var(--card-shadow)]">
          <div className="mb-4 inline-flex rounded-full px-4 py-1 text-sm font-bold text-white" style={{ backgroundColor: subjectColor }}>
            Q{currentIndex + 1}
          </div>
          <h2 className="mb-6 text-lg font-bold text-[var(--text)]">{currentQuestion.text}</h2>

          <div className="mb-6 flex justify-center">
            <Mascot character={selectedCharacter} mood={getMascotMood()} size="md" message={getMascotMessage()} />
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedOption === index
              const isCorrectOption = index === currentQuestion.correctIndex

              let bgColor = "bg-white"
              let borderColor = "border-[var(--card-border)]"
              let textColor = "text-[var(--text)]"

              if (hasAnswered) {
                if (isCorrectOption) { bgColor = "bg-[var(--success-light)]"; borderColor = "border-[var(--success)]"; textColor = "text-[var(--success)]" }
                else if (isSelected && !isCorrectOption) { bgColor = "bg-[var(--error-light)]"; borderColor = "border-[var(--error)]"; textColor = "text-[var(--error)]" }
              }

              return (
                <motion.button
                  key={index}
                  whileHover={!hasAnswered ? { scale: 1.02 } : {}}
                  whileTap={!hasAnswered ? { scale: 0.98 } : {}}
                  onClick={() => handleSelectOption(index)}
                  disabled={hasAnswered}
                  className={`flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all ${bgColor} ${borderColor}`}
                  style={!hasAnswered && isSelected ? { backgroundColor: subjectBg, borderColor: subjectColor } : {}}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold ${
                      hasAnswered && isCorrectOption ? "border-[var(--success)] bg-[var(--success)] text-white"
                      : hasAnswered && isSelected && !isCorrectOption ? "border-[var(--error)] bg-[var(--error)] text-white"
                      : isSelected ? "border-current bg-current text-white"
                      : "border-[var(--text-muted)] text-[var(--text-muted)]"
                    }`}
                    style={!hasAnswered && isSelected ? { borderColor: subjectColor, backgroundColor: subjectColor } : {}}
                  >
                    {hasAnswered && isCorrectOption ? <Check className="h-4 w-4" /> : hasAnswered && isSelected && !isCorrectOption ? <X className="h-4 w-4" /> : optionLabels[index]}
                  </span>
                  <span className={`flex-1 font-medium ${textColor}`}>{option}</span>
                </motion.button>
              )
            })}
          </div>

          <AnimatePresence>
            {hasAnswered && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-6 overflow-hidden">
                <div className="rounded-2xl bg-[var(--bg-sub)] p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-bold text-[var(--text)]">💡 解説</div>
                  <p className="text-sm text-[var(--text-sub)]">{currentQuestion.explanation}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="mt-6 flex justify-center">
          {!hasAnswered ? (
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleSubmit} disabled={selectedOption === null} className="rounded-2xl bg-[var(--primary)] px-12 py-4 font-bold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50">
              回答する
            </motion.button>
          ) : (
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleNext} className="rounded-2xl bg-[var(--primary)] px-12 py-4 font-bold text-white shadow-md transition-all hover:shadow-lg">
              {currentIndex < questions.length - 1 ? "次の問題" : "結果を見る"}
            </motion.button>
          )}
        </div>
      </main>
    </div>
  )
}
