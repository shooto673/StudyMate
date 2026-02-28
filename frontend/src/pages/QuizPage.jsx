import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react"
import { Mascot } from "../components/Mascot"
import { ConfettiEffect } from "../components/ConfettiEffect"

const englishQuestions = [
  { id: "q1", body: "She (   ) a student.", choices: ["am", "is", "are", "be"], correct_index: 1, correct_answer: "is", explanation: "主語がSheのときはisです。" },
  { id: "q2", body: "I (   ) from Osaka.", choices: ["am", "is", "are", "be"], correct_index: 0, correct_answer: "am", explanation: "Iのときはamを使います。" },
  { id: "q3", body: "They (   ) my friends.", choices: ["am", "is", "are", "be"], correct_index: 2, correct_answer: "are", explanation: "複数主語Theyにはareを使います。" },
  { id: "q4", body: "He is tired. の否定文は？", choices: ["He not is tired.", "He is not tired.", "He does not tired.", "He are not tired."], correct_index: 1, correct_answer: "He is not tired.", explanation: "be動詞の否定はbe動詞 + notです。" },
  { id: "q5", body: "You are a student. の疑問文は？", choices: ["Do you a student?", "Are you a student?", "Is you a student?", "Does you a student?"], correct_index: 1, correct_answer: "Are you a student?", explanation: "be動詞の疑問文はbe動詞を先頭に出します。" },
]

const mathQuestions = [
  { id: "m1", body: "(-3) + (+5) = ?", choices: ["-8", "-2", "2", "8"], correct_index: 2, correct_answer: "2", explanation: "異符号の足し算は絶対値の差を取り、絶対値が大きい方の符号をつけます。" },
  { id: "m2", body: "(-7) - (-3) = ?", choices: ["-10", "-4", "4", "10"], correct_index: 1, correct_answer: "-4", explanation: "引く負の数は足し算に変わります。(-7)+3=-4です。" },
  { id: "m3", body: "(-4) × (+6) = ?", choices: ["-24", "-10", "10", "24"], correct_index: 0, correct_answer: "-24", explanation: "異符号のかけ算は答えが負になります。4×6=24なので-24です。" },
  { id: "m4", body: "(-12) ÷ (-4) = ?", choices: ["-3", "-8", "3", "8"], correct_index: 2, correct_answer: "3", explanation: "同符号のわり算は答えが正になります。12÷4=3です。" },
  { id: "m5", body: "次のうち、絶対値が最も大きい数は？", choices: ["+2", "-5", "+3", "-1"], correct_index: 1, correct_answer: "-5", explanation: "絶対値は符号を取った値です。|-5|=5が最大です。" },
]

const choiceLabels = ["A", "B", "C", "D"]

export function QuizPage({ onNavigate, subject, onComplete, questions: questionsProp }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)
  const [answers, setAnswers] = useState([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [showXpFloat, setShowXpFloat] = useState(false)
  const [showFlash, setShowFlash] = useState(false)

  // Use real questions if provided, otherwise use dummy data
  const questions = (questionsProp && questionsProp.length > 0)
    ? questionsProp
    : subject === "english" ? englishQuestions : mathQuestions
  const currentQuestion = questions[currentIndex]
  const subjectColor = subject === "english" ? "var(--english)" : "var(--math)"
  const subjectLightColor = subject === "english" ? "var(--english-light)" : "var(--math-light)"
  const unitName = subject === "english" ? "be動詞" : "正負の数"

  const handleAnswer = () => {
    if (selectedChoice === null) return

    const correct = selectedChoice === currentQuestion.correct_index
    setIsCorrect(correct)
    setIsAnswered(true)

    const newAnswer = {
      questionId: currentQuestion.id,
      selectedIndex: selectedChoice,
      isCorrect: correct,
    }
    setAnswers([...answers, newAnswer])

    if (correct) {
      setShowFlash(true)
      setShowConfetti(true)
      setShowXpFloat(true)
      setTimeout(() => setShowFlash(false), 300)
      setTimeout(() => setShowXpFloat(false), 1000)
    }
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedChoice(null)
      setIsAnswered(false)
      setIsCorrect(null)
    } else {
      onComplete([...answers])
      onNavigate("results")
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] relative">
      <AnimatePresence>
        {showFlash && (
          <motion.div
            className="fixed inset-0 z-50 pointer-events-none"
            style={{ backgroundColor: "rgba(81, 207, 102, 0.12)" }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      <ConfettiEffect isActive={showConfetti} onComplete={() => setShowConfetti(false)} />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-2 text-[var(--text-sub)] hover:text-[var(--text)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            戻る
          </button>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-white text-xs font-bold" style={{ backgroundColor: subjectColor }}>
              {subject === "english" ? "🔤 英語" : "🔢 数学"}
            </span>
            <span className="font-extrabold text-[var(--text)]">{unitName}</span>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {questions.map((_, i) => (
            <div key={i} className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full transition-colors ${
                  i < currentIndex ? "" : i === currentIndex ? "ring-2 ring-offset-2" : "bg-[var(--text-muted)]"
                }`}
                style={{
                  backgroundColor: i <= currentIndex ? subjectColor : undefined,
                  ringColor: i === currentIndex ? subjectColor : undefined,
                }}
              />
              {i < questions.length - 1 && <div className="w-4 h-0.5 bg-[var(--text-muted)] opacity-30" />}
            </div>
          ))}
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className={`bg-white rounded-3xl p-6 shadow-lg mb-6 ${isAnswered && !isCorrect ? "animate-shake" : ""}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: "spring", duration: 0.4 }}
          >
            <span className="inline-block px-4 py-1 rounded-full text-white text-sm font-bold mb-4" style={{ backgroundColor: subjectColor }}>
              Q{currentIndex + 1}
            </span>

            <h2 className="text-xl font-semibold text-[var(--text)] mb-6 leading-relaxed">
              {currentQuestion.body}
            </h2>

            <div className="flex justify-center mb-6">
              <Mascot
                mood={isAnswered ? (isCorrect ? "happy" : "sad") : "thinking"}
                size="md"
                message={isAnswered ? (isCorrect ? "すごい！正解だよ！" : "惜しい！次はきっとできるよ！") : "じっくり考えてみよう..."}
              />
            </div>

            <AnimatePresence>
              {showXpFloat && (
                <motion.div
                  className="text-center text-[var(--primary)] font-bold text-lg"
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 0, y: -30 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                >
                  +10 XP
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3">
              {currentQuestion.choices.map((choice, i) => {
                const isSelected = selectedChoice === i
                const isCorrectChoice = i === currentQuestion.correct_index
                const showCorrect = isAnswered && isCorrectChoice
                const showWrong = isAnswered && isSelected && !isCorrectChoice

                return (
                  <motion.button
                    key={i}
                    onClick={() => !isAnswered && setSelectedChoice(i)}
                    disabled={isAnswered}
                    className={`
                      w-full p-4 rounded-2xl border-2 flex items-center gap-3 text-left transition-all duration-200
                      ${!isAnswered && isSelected
                        ? ""
                        : showCorrect
                          ? "border-[var(--success)] bg-[var(--success-light)]"
                          : showWrong
                            ? "border-[var(--error)] bg-[var(--error-light)]"
                            : "border-[var(--card-border)] bg-white hover:bg-opacity-80"
                      }
                      ${!isAnswered && !isSelected ? "hover:scale-[1.01]" : ""}
                    `}
                    style={!isAnswered && isSelected ? { borderColor: subjectColor, backgroundColor: subjectLightColor } : {}}
                    whileTap={!isAnswered ? { scale: 0.98 } : {}}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        showCorrect ? "bg-[var(--success)] text-white" : showWrong ? "bg-[var(--error)] text-white" : "text-white"
                      }`}
                      style={!showCorrect && !showWrong ? { backgroundColor: subjectColor } : {}}
                    >
                      {showCorrect ? <Check className="w-4 h-4" /> : showWrong ? <X className="w-4 h-4" /> : choiceLabels[i]}
                    </div>
                    <span className="text-[var(--text)] font-medium flex-1">{choice}</span>
                    {showCorrect && <Check className="w-5 h-5 text-[var(--success)]" />}
                    {showWrong && <X className="w-5 h-5 text-[var(--error)]" />}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Explanation */}
        <AnimatePresence>
          {isAnswered && (
            <motion.div
              className="bg-white rounded-2xl p-5 shadow-md mb-6 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: subjectColor }} />
              <h3 className="font-extrabold text-[var(--text)] mb-2 flex items-center gap-2">
                <span className="text-lg">💡</span> 解説
              </h3>
              <p className="text-[var(--text-sub)] leading-relaxed">{currentQuestion.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action buttons */}
        <div className="flex justify-center">
          {!isAnswered ? (
            <motion.button
              onClick={handleAnswer}
              disabled={selectedChoice === null}
              className={`px-8 py-4 rounded-2xl font-bold text-lg w-full max-w-xs transition-all duration-200 ${
                selectedChoice !== null
                  ? "bg-[var(--primary)] text-white hover:shadow-lg"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-40"
              }`}
              whileTap={selectedChoice !== null ? { scale: 0.98 } : {}}
            >
              回答する
            </motion.button>
          ) : (
            <motion.button
              onClick={handleNext}
              className="px-8 py-4 rounded-2xl font-bold text-lg w-full max-w-xs bg-[var(--primary)] text-white hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.98 }}
            >
              {currentIndex < questions.length - 1 ? "次の問題" : "結果を見る"}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  )
}
