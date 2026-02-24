import { useEffect, useState } from 'react'

export default function QuizPage({ unit, questions, onBack, onFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [answers, setAnswers] = useState([])

  useEffect(() => {
    setCurrentIndex(0)
    setSelectedIndex(null)
    setShowFeedback(false)
    setAnswers([])
  }, [unit?.id])

  if (!unit || !questions.length) {
    return (
      <div className="page-wrap narrow">
        <p className="empty">この単元の問題は準備中です。</p>
        <button className="btn-secondary" onClick={onBack}>戻る</button>
      </div>
    )
  }

  const question = questions[currentIndex]
  const choices = question.choices || []
  const progress = ((currentIndex + (showFeedback ? 1 : 0)) / questions.length) * 100

  // correct_answer (text) または correct_index (number) の両方に対応
  const getCorrectIndex = (q) => {
    if (typeof q.correct_index === 'number') return q.correct_index
    if (typeof q.correct_answer === 'string') {
      const idx = q.choices.indexOf(q.correct_answer)
      return idx >= 0 ? idx : 0
    }
    return 0
  }

  const correctIdx = getCorrectIndex(question)
  const isCorrect = selectedIndex === correctIdx

  const handleSelect = (choiceIndex) => {
    if (selectedIndex !== null) return
    setSelectedIndex(choiceIndex)
    setShowFeedback(true)
    setAnswers((prev) => [
      ...prev,
      {
        questionId: question.id,
        question: { ...question, _correctIndex: getCorrectIndex(question) },
        selectedIndex: choiceIndex,
        isCorrect: choiceIndex === getCorrectIndex(question),
      },
    ])
  }

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      onFinish(answers)
      return
    }
    setCurrentIndex((i) => i + 1)
    setSelectedIndex(null)
    setShowFeedback(false)
  }

  return (
    <div className="page-wrap narrow">
      <div className="quiz-head">
        <button className="btn-ghost" onClick={onBack}>終了</button>
        <div className="progress-bar">
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className="counter">{currentIndex + 1}/{questions.length}</div>
      </div>

      <div className="question-card">
        <h2>{unit.title}</h2>
        <p className="prompt">{question.body}</p>

        <div className="choices">
          {choices.map((choice, index) => {
            let cn = 'choice'
            if (selectedIndex !== null) {
              if (index === selectedIndex && index === correctIdx) cn += ' correct'
              else if (index === selectedIndex) cn += ' wrong'
              else if (index === correctIdx) cn += ' reveal'
              else cn += ' muted'
            }
            return (
              <button key={index} className={cn} onClick={() => handleSelect(index)}>
                <span>{String.fromCharCode(65 + index)}</span>
                {choice}
              </button>
            )
          })}
        </div>
      </div>

      {showFeedback && (
        <div className={`feedback ${isCorrect ? 'ok' : 'ng'}`}>
          <h3>{isCorrect ? '正解です' : '不正解です'}</h3>
          <p>{question.explanation}</p>
          <button className="btn-primary full" onClick={handleNext}>
            {currentIndex + 1 >= questions.length ? '結果を見る' : '次の問題へ'}
          </button>
        </div>
      )}
    </div>
  )
}
