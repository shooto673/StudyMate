import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from './contexts/AuthContext'
import Header from './components/Header'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import GradeSelectPage from './pages/GradeSelectPage'
import PricingPage from './pages/PricingPage'
import DashboardPage from './pages/DashboardPage'
import QuizPage from './pages/QuizPage'
import ResultsPage from './pages/ResultsPage'
import ReviewPage from './pages/ReviewPage'
import {
  getGrades,
  getPlans,
  fetchUnits,
  fetchQuestions,
  fetchStats,
  fetchUsageToday,
  fetchPlanLimit,
  fetchUnitProgress,
  saveAnswerLog,
  incrementUsage,
  updateProfileGrade,
} from './lib/api'
import './styles/app.css'

const grades = getGrades()
const plans = getPlans()

export default function App() {
  const { user, profile, planTier, loading: authLoading, refreshProfile } = useAuth()

  const [page, setPage] = useState('landing')
  const [selectedGradeId, setSelectedGradeId] = useState(null)
  const [units, setUnits] = useState([])
  const [currentUnit, setCurrentUnit] = useState(null)
  const [currentQuestions, setCurrentQuestions] = useState([])
  const [quizAnswers, setQuizAnswers] = useState([])
  const [stats, setStats] = useState({ totalAnswered: 0, accuracy: 0, streakDays: 0 })
  const [usageToday, setUsageToday] = useState(0)
  const [dailyLimit, setDailyLimit] = useState(10)
  const [error, setError] = useState('')
  const [dataLoading, setDataLoading] = useState(false)

  const selectedGradeLabel = useMemo(() => {
    return grades.find((g) => g.id === selectedGradeId)?.label || ''
  }, [selectedGradeId])

  // ユーザーがログインしたらダッシュボードへ
  useEffect(() => {
    if (!authLoading && user && page === 'landing') {
      const grade = profile?.grade || 'j1'
      setSelectedGradeId(grade)
      setPage('dashboard')
    }
  }, [authLoading, user, profile])

  // ダッシュボード表示時にデータ読み込み
  const loadDashboardData = useCallback(async (gradeId) => {
    if (!user) return
    setDataLoading(true)
    setError('')
    try {
      const [unitList, statsData, usage, limit] = await Promise.all([
        fetchUnits(gradeId),
        fetchStats(user.id),
        fetchUsageToday(user.id),
        fetchPlanLimit(planTier),
      ])

      // 進捗データ取得
      const unitIds = unitList.map((u) => u.id)
      const progressMap = await fetchUnitProgress(user.id, unitIds)
      const unitsWithProgress = unitList.map((u) => ({
        ...u,
        progress: progressMap[u.id] || 0,
      }))

      setUnits(unitsWithProgress)
      setStats(statsData)
      setUsageToday(usage)
      setDailyLimit(limit)
    } catch (err) {
      setError(err.message || 'データ取得に失敗しました')
    } finally {
      setDataLoading(false)
    }
  }, [user, planTier])

  useEffect(() => {
    if (page === 'dashboard' && selectedGradeId && user) {
      loadDashboardData(selectedGradeId)
    }
  }, [page, selectedGradeId, user, loadDashboardData])

  // ─── ハンドラー ─────────────────────

  const handleSelectGrade = (gradeId) => {
    setSelectedGradeId(gradeId)
  }

  const handleConfirmGrade = async () => {
    if (!selectedGradeId || !user) return
    try {
      await updateProfileGrade(user.id, selectedGradeId)
      await refreshProfile()
      setPage('dashboard')
    } catch {
      setPage('dashboard')
    }
  }

  const handleSelectPlan = (planId) => {
    if (planId === 'free' && user) {
      setPage('dashboard')
    } else if (!user) {
      setPage('login')
    }
  }

  const handleChangeGrade = async (gradeId) => {
    setSelectedGradeId(gradeId)
    if (user) {
      try {
        await updateProfileGrade(user.id, gradeId)
      } catch { /* ignore */ }
    }
  }

  const handleStartQuiz = async (unit) => {
    setError('')
    try {
      const questions = await fetchQuestions(unit.slug)
      setCurrentUnit(unit)
      setCurrentQuestions(questions)
      setQuizAnswers([])
      setPage('quiz')
    } catch (err) {
      setError(err.message || '問題取得に失敗しました')
    }
  }

  const handleFinishQuiz = async (answers) => {
    setQuizAnswers(answers)
    setPage('results')

    if (!user || !currentUnit) return

    try {
      // 各解答をログに保存
      for (const answer of answers) {
        await saveAnswerLog(
          user.id,
          answer.questionId,
          currentUnit.id,
          answer.selectedIndex,
          answer.isCorrect,
        )
      }
      // 利用回数をインクリメント
      await incrementUsage(user.id)
    } catch {
      // ログ保存失敗は結果表示をブロックしない
    }
  }

  // ─── 描画 ─────────────────────────

  if (authLoading) {
    return (
      <div className="app">
        <div className="page-wrap narrow">
          <p className="empty">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <Header page={page} onNavigate={setPage} selectedGradeLabel={selectedGradeLabel} />

      {error && <div className="error-banner">{error}</div>}

      {dataLoading && page === 'dashboard' ? (
        <div className="page-wrap narrow">
          <p className="empty">読み込み中...</p>
        </div>
      ) : (
        <>
          {page === 'landing' && <LandingPage onNavigate={setPage} />}

          {page === 'login' && <LoginPage />}

          {page === 'grade-select' && (
            <GradeSelectPage
              grades={grades}
              selectedGradeId={selectedGradeId}
              onSelectGrade={handleSelectGrade}
              onNext={handleConfirmGrade}
            />
          )}

          {page === 'pricing' && (
            <PricingPage
              plans={plans}
              onSelectPlan={handleSelectPlan}
              onBack={() => setPage(user ? 'dashboard' : 'landing')}
            />
          )}

          {page === 'dashboard' && (
            <DashboardPage
              units={units}
              grades={grades}
              selectedGradeId={selectedGradeId}
              onChangeGrade={handleChangeGrade}
              onStartQuiz={handleStartQuiz}
              stats={stats}
              usageToday={usageToday}
              dailyLimit={dailyLimit}
              onNavigate={setPage}
            />
          )}

          {page === 'quiz' && (
            <QuizPage
              unit={currentUnit}
              questions={currentQuestions}
              onBack={() => setPage('dashboard')}
              onFinish={handleFinishQuiz}
            />
          )}

          {page === 'results' && (
            <ResultsPage
              unitTitle={currentUnit?.title || '演習'}
              answers={quizAnswers}
              onReview={() => setPage('review')}
              onRetry={() => setPage('quiz')}
              onBack={() => setPage('dashboard')}
            />
          )}

          {page === 'review' && (
            <ReviewPage answers={quizAnswers} onBack={() => setPage('dashboard')} />
          )}
        </>
      )}
    </div>
  )
}
