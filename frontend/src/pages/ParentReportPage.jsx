import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { BookOpen, Loader2, AlertCircle } from "lucide-react"
import { WeeklyChart } from "../components/WeeklyChart"
import { fetchReportByToken } from "../lib/api"

const gradeLabels = {
  j1: "中学1年生",
  j2: "中学2年生",
  j3: "中学3年生",
}

export function ParentReportPage({ token, onNavigate }) {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!token) {
      setError("レポートトークンが見つかりません")
      setLoading(false)
      return
    }

    fetchReportByToken(token)
      .then((data) => {
        if (!data) {
          setError("このリンクは無効か、期限切れです")
        } else {
          setReport(data)
        }
      })
      .catch(() => setError("レポートの取得に失敗しました"))
      .finally(() => setLoading(false))
  }, [token])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
          <p className="text-[var(--text-sub)]">レポートを読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-[var(--card-shadow)]"
        >
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-[var(--error)]" />
          <h2 className="mb-2 text-xl font-bold text-[var(--text)]">レポートを表示できません</h2>
          <p className="mb-6 text-sm text-[var(--text-sub)]">{error}</p>
          <button
            onClick={() => {
              window.history.replaceState({}, '', window.location.pathname)
              onNavigate('landing')
            }}
            className="rounded-2xl bg-[var(--primary)] px-6 py-3 font-bold text-white"
          >
            StudyMateトップへ
          </button>
        </motion.div>
      </div>
    )
  }

  const { profile, stats, weeklyReport } = report
  const weeklyTotal = weeklyReport?.reduce((sum, d) => sum + d.count, 0) || 0
  const weeklyAvgAccuracy = (() => {
    const withData = (weeklyReport || []).filter(d => d.count > 0)
    return withData.length > 0
      ? Math.round(withData.reduce((sum, d) => sum + d.accuracy, 0) / withData.length)
      : 0
  })()

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--card-border)] bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[var(--primary)]" />
            <span className="font-bold text-[var(--text)]">StudyMate</span>
          </div>
          <span className="rounded-full bg-[var(--primary-light)] px-3 py-1 text-xs font-medium text-[var(--primary)]">
            保護者向けレポート
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        {/* Student Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 rounded-3xl bg-white p-6 shadow-[var(--card-shadow)]">
          <h1 className="mb-2 text-2xl font-bold text-[var(--text)]">
            {profile?.display_name || 'お子様'}さんの学習レポート
          </h1>
          <p className="text-sm text-[var(--text-sub)]">
            {gradeLabels[profile?.grade] || '中学生'} ・ StudyMateでの学習状況
          </p>
        </motion.div>

        {/* Overall Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 rounded-3xl bg-white p-6 shadow-[var(--card-shadow)]">
          <h2 className="mb-4 text-lg font-bold text-[var(--text)]">全体の学習状況</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl bg-[var(--primary-light)] p-4 text-center">
              <div className="text-2xl font-bold text-[var(--primary)]">{stats?.totalAnswered || 0}</div>
              <div className="text-xs text-[var(--text-sub)]">総回答数</div>
            </div>
            <div className="rounded-2xl bg-[var(--success-light)] p-4 text-center">
              <div className="text-2xl font-bold text-[var(--success)]">{stats?.accuracy || 0}%</div>
              <div className="text-xs text-[var(--text-sub)]">正答率</div>
            </div>
            <div className="rounded-2xl bg-[var(--accent-light)] p-4 text-center">
              <div className="text-2xl font-bold text-[var(--accent)]">{stats?.streakDays || 0}日</div>
              <div className="text-xs text-[var(--text-sub)]">連続学習</div>
            </div>
          </div>
        </motion.div>

        {/* Weekly Report */}
        {weeklyReport && weeklyReport.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6 rounded-3xl bg-white p-6 shadow-[var(--card-shadow)]">
            <h2 className="mb-4 text-lg font-bold text-[var(--text)]">今週の学習</h2>
            <WeeklyChart data={weeklyReport} />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[var(--bg-sub)] p-3 text-center">
                <div className="text-lg font-bold text-[var(--text)]">{weeklyTotal}</div>
                <div className="text-xs text-[var(--text-sub)]">今週の問題数</div>
              </div>
              <div className="rounded-xl bg-[var(--bg-sub)] p-3 text-center">
                <div className="text-lg font-bold text-[var(--text)]">{weeklyAvgAccuracy}%</div>
                <div className="text-xs text-[var(--text-sub)]">今週の平均正答率</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center">
          <p className="text-xs text-[var(--text-muted)]">
            このレポートは StudyMate が自動生成しています<br />
            <a href={window.location.origin} className="text-[var(--primary)] underline">StudyMate について詳しく見る</a>
          </p>
        </motion.div>
      </main>
    </div>
  )
}
