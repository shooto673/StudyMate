import { useAuth } from '../contexts/AuthContext'
import Mascot from '../components/Mascot'
import ProgressRing from '../components/ProgressRing'

export default function DashboardPage({
  units,
  grades,
  selectedGradeId,
  onChangeGrade,
  onStartQuiz,
  stats,
  usageToday,
  dailyLimit,
  onNavigate,
}) {
  const { profile, planTier } = useAuth()

  const limitReached = planTier === 'free' && usageToday >= dailyLimit

  return (
    <div className="page-wrap wide">
      <div className="hero-card">
        <Mascot size={64} />
        <div>
          <h2>{profile?.display_name || 'ユーザー'}さん、がんばろう!</h2>
          <p>単元を選んで演習を開始してください。</p>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat">
          <strong>{stats.totalAnswered}</strong>
          <span>解答数</span>
        </div>
        <div className="stat">
          <strong>{stats.accuracy}%</strong>
          <span>正答率</span>
        </div>
        <div className="stat">
          <strong>{stats.streakDays}</strong>
          <span>連続日数</span>
        </div>
      </div>

      {planTier === 'free' && (
        <div className="usage-bar">
          <div className="usage-text">
            今日の利用: {usageToday} / {dailyLimit} 問
          </div>
          <div className="usage-track">
            <div
              className="usage-fill"
              style={{ width: `${Math.min(100, (usageToday / dailyLimit) * 100)}%` }}
            />
          </div>
          {limitReached && (
            <div className="usage-limit-msg">
              今日の無料利用上限に達しました。
              <button className="btn-link" onClick={() => onNavigate('pricing')}>
                プランをアップグレード
              </button>
            </div>
          )}
        </div>
      )}

      <div className="tabs">
        {grades
          .filter((g) => !g.disabled)
          .map((g) => (
            <button
              key={g.id}
              className={`tab ${selectedGradeId === g.id ? 'active' : ''}`}
              onClick={() => onChangeGrade(g.id)}
            >
              {g.shortLabel}
            </button>
          ))}
      </div>

      <div className="units">
        {units.length === 0 && <div className="empty">単元データがありません。</div>}
        {units.map((unit) => (
          <button
            key={unit.id}
            className="unit-card"
            onClick={() => onStartQuiz(unit)}
            disabled={limitReached}
          >
            <ProgressRing value={unit.progress || 0} />
            <div className="unit-main">
              <div className="unit-grade">{unit.grade?.replace('j', '中')}</div>
              <h3>{unit.title}</h3>
            </div>
            <span className="arrow">›</span>
          </button>
        ))}
      </div>
    </div>
  )
}
