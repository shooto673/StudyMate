export default function ReviewPage({ answers, onBack }) {
  const wrong = answers.filter((a) => !a.isCorrect)

  return (
    <div className="page-wrap narrow">
      <div className="review-head">
        <h2>間違えた問題の復習</h2>
        <button className="btn-ghost" onClick={onBack}>戻る</button>
      </div>

      {wrong.length === 0 && <p className="empty">全問正解です。復習対象はありません。</p>}

      {wrong.map((item) => {
        // correct_answer (text) または _correctIndex (number) の両方に対応
        const correctText =
          item.question.correct_answer ||
          item.question.choices[item.question._correctIndex ?? item.question.correct_index] ||
          '不明'

        return (
          <article key={item.questionId} className="review-card">
            <p className="prompt">{item.question.body}</p>
            <p>あなたの答え: <strong>{item.question.choices[item.selectedIndex]}</strong></p>
            <p>正解: <strong>{correctText}</strong></p>
            <p className="explanation">{item.question.explanation}</p>
          </article>
        )
      })}
    </div>
  )
}
