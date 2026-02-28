import { motion } from "framer-motion"
import { ArrowLeft, Check, X } from "lucide-react"
import { Mascot } from "../components/Mascot"

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

export function ReviewPage({ onNavigate, subject, answers, questions: questionsProp }) {
  const questions = (questionsProp && questionsProp.length > 0)
    ? questionsProp
    : subject === "english" ? englishQuestions : mathQuestions
  const subjectColor = subject === "english" ? "var(--english)" : "var(--math)"
  const unitName = subject === "english" ? "be動詞" : "正負の数"

  const answerMap = new Map(answers.map(a => [a.questionId, a]))

  return (
    <div className="min-h-screen bg-[var(--bg)] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <button
            onClick={() => onNavigate("results")}
            className="flex items-center gap-2 text-[var(--text-sub)] hover:text-[var(--text)] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            結果に戻る
          </button>

          <h1 className="text-2xl font-extrabold text-[var(--text)] mb-2">解答の確認</h1>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-white text-xs font-bold" style={{ backgroundColor: subjectColor }}>
              {subject === "english" ? "🔤 英語" : "🔢 数学"}
            </span>
            <span className="font-semibold text-[var(--text)]">{unitName}</span>
          </div>
        </motion.div>

        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Mascot mood="studying" size="sm" message="一つずつ確認していこう！" />
        </motion.div>

        <div className="space-y-6">
          {questions.map((question, i) => {
            const answer = answerMap.get(question.id)
            const isCorrect = answer?.isCorrect ?? false
            const selectedIndex = answer?.selectedIndex ?? -1

            return (
              <motion.div
                key={question.id}
                className="bg-white rounded-3xl p-5 shadow-[var(--card-shadow)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-white text-xs font-bold ${isCorrect ? "bg-[var(--success)]" : "bg-[var(--error)]"}`}>
                    問{i + 1}
                  </span>
                  {isCorrect ? (
                    <span className="text-[var(--success)] font-semibold text-sm flex items-center gap-1">
                      <Check className="w-4 h-4" /> 正解
                    </span>
                  ) : (
                    <span className="text-[var(--error)] font-semibold text-sm flex items-center gap-1">
                      <X className="w-4 h-4" /> 不正解
                    </span>
                  )}
                </div>

                <p className="text-lg font-semibold text-[var(--text)] mb-4">{question.body}</p>

                <div className="space-y-2 mb-4">
                  {question.choices.map((choice, j) => {
                    const isSelected = selectedIndex === j
                    const isCorrectChoice = j === question.correct_index

                    return (
                      <div
                        key={j}
                        className={`p-3 rounded-xl flex items-center gap-3 ${
                          isCorrectChoice
                            ? "bg-[var(--success-light)]"
                            : isSelected && !isCorrectChoice
                              ? "bg-[var(--error-light)]"
                              : "bg-[var(--bg-sub)]"
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                          isCorrectChoice
                            ? "bg-[var(--success)]"
                            : isSelected && !isCorrectChoice
                              ? "bg-[var(--error)]"
                              : "bg-[var(--text-muted)]"
                        }`}>
                          {isCorrectChoice ? <Check className="w-3 h-3" /> : isSelected && !isCorrectChoice ? <X className="w-3 h-3" /> : String.fromCharCode(65 + j)}
                        </span>
                        <span className={isCorrectChoice ? "text-[var(--success)] font-semibold" : "text-[var(--text)]"}>
                          {choice}
                        </span>
                        {isSelected && (
                          <span className="ml-auto text-xs text-[var(--text-sub)]">あなたの回答</span>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="p-4 rounded-xl bg-[var(--bg-sub)] border-l-4" style={{ borderColor: subjectColor }}>
                  <p className="text-sm text-[var(--text-sub)] leading-relaxed">
                    <span className="font-bold text-[var(--text)]">💡 解説: </span>
                    {question.explanation}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <button
            onClick={() => onNavigate("dashboard")}
            className="px-8 py-4 bg-[var(--primary)] text-white rounded-2xl font-bold hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            ダッシュボードへ戻る
          </button>
        </motion.div>
      </div>
    </div>
  )
}
