import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from './contexts/AuthContext'
import FloatingDecorations from './components/FloatingDecorations'
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

export default function App() {
  const { user, profile, planTier, loading: authLoading, refreshProfile } = useAuth()

  const [page, setPage] = useState('landing')
  const [selectedGradeId, setSelectedGradeId] = useState(null)
  const [selectedSubject, setSelectedSubject] = useState('english')
  const [units, setUnits] = useState([])
  const [currentUnit, setCurrentUnit] = useState(null)
  const [currentQuestions, setCurrentQuestions] = useState([])
  const [quizAnswers, setQuizAnswers] = useState([])
  const [stats, setStats] = useState({ totalAnswered: 0, accuracy: 0, streakDays: 0 })
  const [usageToday, setUsageToday] = useState(0)
  const [dailyLimit, setDailyLimit] = useState(10)
  const [error, setError] = useState('')
  const [dataLoading, setDataLoading] = useState(false)

  const isLoggedIn = !!user

  const selectedGradeLabel = useMemo(() => {
    const g = grades.find((g) => g.id === selectedGradeId)
    return g ? `${g.label} ${g.emoji}` : ''
  }, [selectedGradeId])

  // Auto-redirect logged-in users to dashboard
  useEffect(() => {
    if (!authLoading && user && page === 'landing') {
      const grade = profile?.grade || 'j1'
      setSelectedGradeId(grade)
      setPage('dashboard')
    }
  }, [authLoading, user, profile])

  // Load dashboard data
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

  // ─── Navigation handler ─────────────────
  const handleNavigate = (pageName) => {
    setPage(pageName)
  }

  // Grade select
  const handleSelectGrade = (gradeLabel) => {
    // Find grade by label match
    const grade = grades.find(
      (g) => g.label === gradeLabel || `${g.label} ${g.emoji}` === gradeLabel
    )
    if (grade) {
      setSelectedGradeId(grade.id)
    }
  }

  const handleConfirmGradeAndNavigate = async (gradeLabel) => {
    handleSelectGrade(gradeLabel)
    const grade = grades.find(
      (g) => g.label === gradeLabel || `${g.label} ${g.emoji}` === gradeLabel
    )
    if (grade && user) {
      try {
        await updateProfileGrade(user.id, grade.id)
        await refreshProfile()
      } catch { /* ignore */ }
    }
    setPage('dashboard')
  }

  // Unit select from dashboard
  const handleSelectUnit = async (subject, unitSlug) => {
    setSelectedSubject(subject)
    setError('')

    // Find real unit from loaded units
    const unit = units.find((u) => u.slug === unitSlug)
    if (!unit) {
      // Fallback: try to load questions with slug directly
      try {
        const questions = await fetchQuestions(unitSlug)
        setCurrentUnit({ slug: unitSlug, title: unitSlug })
        setCurrentQuestions(questions)
        setQuizAnswers([])
        setPage('quiz')
      } catch (err) {
        setError(err.message || '問題取得に失敗しました')
      }
      return
    }

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

  // Quiz complete
  const handleQuizComplete = async (answers) => {
    setQuizAnswers(answers)
    setPage('results')

    if (!user || !currentUnit) return
    try {
      for (const answer of answers) {
        await saveAnswerLog(
          user.id,
          answer.questionId,
          currentUnit.id,
          answer.selectedIndex,
          answer.isCorrect,
        )
      }
      await incrementUsage(user.id)
    } catch {
      // Don't block results display
    }
  }

  // ─── Render ─────────────────────────
  if (authLoading) {
    return (
      <div className="loading-screen">
        <p>読み込み中...</p>
      </div>
    )
  }

  const renderPage = () => {
    switch (page) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />

      case 'login':
        return <LoginPage onNavigate={handleNavigate} />

      case 'gradeSelect':
        return (
          <GradeSelectPage
            onNavigate={(p) => {
              if (p === 'dashboard') {
                // GradeSelectPage calls onNavigate("dashboard") after selecting
                setPage('dashboard')
              } else {
                setPage(p)
              }
            }}
            onSelectGrade={handleConfirmGradeAndNavigate}
          />
        )

      case 'pricing':
        return <PricingPage onNavigate={handleNavigate} isLoggedIn={isLoggedIn} />

      case 'dashboard':
        return (
          <DashboardPage
            onNavigate={handleNavigate}
            grade={selectedGradeLabel}
            onSelectUnit={handleSelectUnit}
            units={units}
            stats={stats}
            usageToday={usageToday}
            dailyLimit={dailyLimit}
            userName={profile?.display_name || ''}
          />
        )

      case 'quiz':
        return (
          <QuizPage
            onNavigate={handleNavigate}
            subject={selectedSubject}
            onComplete={handleQuizComplete}
          />
        )

      case 'results':
        return (
          <ResultsPage
            onNavigate={handleNavigate}
            subject={selectedSubject}
            answers={quizAnswers}
          />
        )

      case 'review':
        return (
          <ReviewPage
            onNavigate={handleNavigate}
            subject={selectedSubject}
            answers={quizAnswers}
          />
        )

      default:
        return <LandingPage onNavigate={handleNavigate} />
    }
  }

  return (
    <div className="relative min-h-screen" style={{ fontFamily: '"Noto Sans JP", sans-serif' }}>
      <FloatingDecorations />

      {error && <div className="error-banner">{error}</div>}

      {dataLoading && page === 'dashboard' ? (
        <div className="loading-screen">
          <p>読み込み中...</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative z-10"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
