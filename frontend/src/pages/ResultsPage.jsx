import Mascot from '../components/Mascot'

export default function ResultsPage({ unitTitle, answers, onReview, onRetry, onBack }) {
  const total = answers.length
  const correct = answers.filter((a) => a.isCorrect).length
  const percent = total ? Math.round((correct / total) * 100) : 0

  let message = '演習が完了しました'
  if (percent >= 80) message = 'すばらしい！高得点です'
  else if (percent >= 60) message = 'もう一歩で満点です'
  else if (total > 0) message = '復習して次は点数アップ'

  return (
    <div className="page-wrap narrow center">
      <Mascot size={96} />
      <h2>{message}</h2>
      <p className="sub">{unitTitle} の結果</p>

      <div className="score">{percent}%</div>
      <div className="stats-row">
        <div className="stat">
          <strong>{correct}</strong>
          <span>正解</span>
        </div>
        <div className="stat">
          <strong>{total - correct}</strong>
          <span>不正解</span>
        </div>
        <div className="stat">
          <strong>{total}</strong>
          <span>出題数</span>
        </div>
      </div>

      <div className="actions-col">
        <button className="btn-primary full" onClick={onReview}>間違えた問題を確認</button>
        <button className="btn-secondary full" onClick={onRetry}>もう一度解く</button>
        <button className="btn-ghost" onClick={onBack}>単元一覧へ戻る</button>
      </div>
    </div>
  )
}
