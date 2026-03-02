import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from './contexts/AuthContext'
import { FloatingDecorations } from './components/FloatingDecorations'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { CharacterSelectPage } from './pages/CharacterSelectPage'
import { GradeSelectPage } from './pages/GradeSelectPage'
import { StageMapPage } from './pages/StageMapPage'
import { DashboardPage } from './pages/DashboardPage'
import { PricingPage } from './pages/PricingPage'
import { QuizPage } from './pages/QuizPage'
import { ResultsPage } from './pages/ResultsPage'
import { ReviewPage } from './pages/ReviewPage'
import { MyPage } from './pages/MyPage'
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
  const { user, profile, planTier, loading: authLoading, refreshProfile, signInWithGoogle } = useAuth()

  const [page, setPage] = useState('landing')
  const [selectedGradeId, setSelectedGradeId] = useState(null)
  const [selectedSubject, setSelectedSubject] = useState('english')
  const [selectedCharacter, setSelectedCharacter] = useState('mascot')
  const [units, setUnits] = useState([])
  const [currentUnit, setCurrentUnit] = useState(null)
  const [currentQuestions, setCurrentQuestions] = useState([])
  const [quizAnswers, setQuizAnswers] = useState([])
  const [stats, setStats] = useState({ totalAnswers: 0, accuracy: 0, streak: 0 })
  const [usageToday, setUsageToday] = useState(0)
  const [dailyLimit, setDailyLimit] = useState(10)
  const [error, setError] = useState('')
  const [dataLoading, setDataLoading] = useState(false)

  const isLoggedIn = !!user

  const selectedGradeLabel = useMemo(() => {
    const g = grades.find((g) => g.id === selectedGradeId)
    return g ? `${g.label} ${g.emoji}` : ''
  }, [selectedGradeId])

  // Auto-redirect logged-in users to stageMap
  useEffect(() => {
    if (!authLoading && user && page === 'landing') {
      const grade = profile?.grade || 'j1'
      setSelectedGradeId(grade)
      setPage('stageMap')
    }
  }, [authLoading, user, profile])

  // Load data when entering stageMap or dashboard
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
      setStats({
        totalAnswers: statsData.totalAnswered || 0,
        accuracy: statsData.accuracy || 0,
        streak: statsData.streakDays || 0,
      })
      setUsageToday(usage)
      setDailyLimit(limit)
    } catch (err) {
      setError(err.message || 'データ取得に失敗しました')
    } finally {
      setDataLoading(false)
    }
  }, [user, planTier])

  useEffect(() => {
    if ((page === 'stageMap' || page === 'dashboard') && selectedGradeId && user) {
      loadDashboardData(selectedGradeId)
    }
  }, [page, selectedGradeId, user, loadDashboardData])

  // ─── Navigation handler ─────────────────
  const handleNavigate = (pageName) => {
    setPage(pageName)
  }

  // Character select
  const handleSelectCharacter = (character) => {
    setSelectedCharacter(character)
  }

  // Grade select
  const handleSelectGrade = (gradeId) => {
    setSelectedGradeId(gradeId)
  }

  const handleConfirmGradeAndNavigate = async (gradeId) => {
    handleSelectGrade(gradeId)
    if (user) {
      try {
        await updateProfileGrade(user.id, gradeId)
        await refreshProfile()
      } catch { /* ignore */ }
    }
    setPage('stageMap')
  }

  // Unit select from stage map
  const handleSelectUnit = async (subject, unitSlug) => {
    setSelectedSubject(subject)
    setError('')

    const unit = units.find((u) => u.slug === unitSlug)
    const resolvedUnit = unit || { slug: unitSlug, title: unitSlug }

    try {
      const questions = await fetchQuestions(resolvedUnit.slug)
      setCurrentUnit(resolvedUnit)
      setCurrentQuestions(questions)
      setQuizAnswers([])
      setPage('quiz')
    } catch (err) {
      console.warn('API問題生成失敗、ダミーデータを使用:', err.message)
      setCurrentUnit(resolvedUnit)
      setCurrentQuestions([])
      setQuizAnswers([])
      setPage('quiz')
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
        return (
          <LoginPage
            onNavigate={handleNavigate}
            onGoogleLogin={async () => {
              try {
                await signInWithGoogle()
              } catch (err) {
                setError(err.message || 'ログインに失敗しました')
              }
            }}
          />
        )

      case 'characterSelect':
        return (
          <CharacterSelectPage
            onNavigate={handleNavigate}
            onSelectCharacter={handleSelectCharacter}
          />
        )

      case 'gradeSelect':
        return (
          <GradeSelectPage
            onNavigate={(p) => {
              if (p === 'dashboard' || p === 'stageMap') {
                setPage('stageMap')
              } else {
                setPage(p)
              }
            }}
            onSelectGrade={handleConfirmGradeAndNavigate}
            selectedCharacter={selectedCharacter}
          />
        )

      case 'pricing':
        return <PricingPage onNavigate={handleNavigate} isLoggedIn={isLoggedIn} />

      case 'stageMap':
        return (
          <StageMapPage
            onNavigate={handleNavigate}
            grade={selectedGradeId}
            onSelectUnit={handleSelectUnit}
            units={units}
            stats={stats}
            usageToday={usageToday}
            dailyLimit={dailyLimit}
            userName={profile?.display_name || ''}
            selectedCharacter={selectedCharacter}
          />
        )

      case 'dashboard':
        return (
          <DashboardPage
            onNavigate={handleNavigate}
            userName={profile?.display_name || ''}
            selectedCharacter={selectedCharacter}
          />
        )

      case 'quiz':
        return (
          <QuizPage
            onNavigate={handleNavigate}
            subject={selectedSubject}
            unitTitle={currentUnit?.title || ''}
            onComplete={handleQuizComplete}
            questions={currentQuestions}
            selectedCharacter={selectedCharacter}
          />
        )

      case 'results':
        return (
          <ResultsPage
            onNavigate={handleNavigate}
            subject={selectedSubject}
            answers={quizAnswers}
            selectedCharacter={selectedCharacter}
          />
        )

      case 'review':
        return (
          <ReviewPage
            onNavigate={handleNavigate}
            subject={selectedSubject}
            answers={quizAnswers}
            questions={currentQuestions}
            selectedCharacter={selectedCharacter}
          />
        )

      case 'myPage':
        return (
          <MyPage
            onNavigate={handleNavigate}
            userName={profile?.display_name || ''}
            grade={selectedGradeId || 'j1'}
            selectedCharacter={selectedCharacter}
            onSelectCharacter={handleSelectCharacter}
            planTier={planTier || 'free'}
            stats={stats}
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

      {dataLoading && (page === 'stageMap' || page === 'dashboard') ? (
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
