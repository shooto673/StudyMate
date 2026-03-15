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
import { SectionPage } from './pages/SectionPage'
import { ParentReportPage } from './pages/ParentReportPage'
import { DifficultySelector } from './components/DifficultySelector'
import { SUB_UNITS, getSubjectFromSlug } from './lib/subUnits'
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
  const { user, profile, planTier, loading: authLoading, refreshProfile, signInWithGoogle, signOut } = useAuth()

  const [page, setPage] = useState('landing')
  const [selectedGradeId, setSelectedGradeId] = useState(null)
  const [selectedSubject, setSelectedSubject] = useState('english')
  const [selectedCharacter, setSelectedCharacter] = useState('mascot')
  const [units, setUnits] = useState([])
  const [currentUnit, setCurrentUnit] = useState(null)
  const [currentParentUnit, setCurrentParentUnit] = useState(null)
  const [currentQuestions, setCurrentQuestions] = useState([])
  const [quizAnswers, setQuizAnswers] = useState([])
  const [stats, setStats] = useState({ totalAnswers: 0, accuracy: 0, streak: 0 })
  const [usageToday, setUsageToday] = useState(0)
  const [dailyLimit, setDailyLimit] = useState(10)
  const [error, setError] = useState('')
  const [dataLoading, setDataLoading] = useState(false)

  // 日次制限モーダル
  const [limitReachedModal, setLimitReachedModal] = useState(false)

  // 難易度選択
  const [showDifficultySelector, setShowDifficultySelector] = useState(false)
  const [pendingQuizParams, setPendingQuizParams] = useState(null)

  // 保護者レポートトークン
  const [reportToken, setReportToken] = useState(null)

  const isLoggedIn = !!user

  const selectedGradeLabel = useMemo(() => {
    const g = grades.find((g) => g.id === selectedGradeId)
    return g ? `${g.label} ${g.emoji}` : ''
  }, [selectedGradeId])

  // URL解析で保護者レポートトークンを検出
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('report')
    if (token) {
      setReportToken(token)
      setPage('parentReport')
    }
  }, [])

  // Auto-redirect logged-in users
  useEffect(() => {
    if (!authLoading && user && page === 'landing' && !reportToken) {
      if (profile?.grade) {
        setSelectedGradeId(profile.grade)
        setPage('stageMap')
      } else {
        setPage('gradeSelect')
      }
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

  // ─── Logout handler ────────────────────
  const handleLogout = async () => {
    try {
      await signOut()
      setSelectedGradeId(null)
      setUnits([])
      setCurrentUnit(null)
      setCurrentQuestions([])
      setQuizAnswers([])
      setStats({ totalAnswers: 0, accuracy: 0, streak: 0 })
      setUsageToday(0)
      setPage('landing')
    } catch {
      setPage('landing')
    }
  }

  // ─── Navigation handler ─────────────────
  const handleNavigate = (pageName) => {
    setPage(pageName)
  }

  const handleSelectCharacter = (character) => {
    setSelectedCharacter(character)
  }

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

    const subs = SUB_UNITS[unitSlug]
    if (subs && subs.length > 0) {
      setCurrentParentUnit({
        slug: resolvedUnit.slug,
        title: resolvedUnit.title,
        subject: subject,
      })
      setCurrentUnit(resolvedUnit)
      setPage('section')
      return
    }

    await startQuiz(subject, resolvedUnit.slug, resolvedUnit)
  }

  // Sub-unit select from section page
  const handleSelectSubUnit = async (subject, subUnitSlug) => {
    await startQuiz(subject, subUnitSlug, currentUnit)
  }

  // ─── 日次制限チェック + 難易度選択 + クイズ開始 ─────────
  const startQuiz = async (subject, slug, unitForLog) => {
    setSelectedSubject(subject)

    // 日次制限チェック
    if (user) {
      try {
        const [currentUsage, limit] = await Promise.all([
          fetchUsageToday(user.id),
          fetchPlanLimit(planTier),
        ])
        if (currentUsage >= limit) {
          setUsageToday(currentUsage)
          setDailyLimit(limit)
          setLimitReachedModal(true)
          return
        }
      } catch (err) {
        console.warn('Usage check failed:', err)
      }
    }

    // Standard/Premium → 難易度選択を表示
    if (planTier === 'standard' || planTier === 'premium') {
      setPendingQuizParams({ subject, slug, unitForLog })
      setShowDifficultySelector(true)
      return
    }

    // Free → 直接「normal」で開始
    await proceedWithQuiz(subject, slug, unitForLog, 'normal')
  }

  // 難易度選択後のクイズ開始
  const handleDifficultySelected = async (difficulty) => {
    setShowDifficultySelector(false)
    if (!pendingQuizParams) return
    const { subject, slug, unitForLog } = pendingQuizParams
    setPendingQuizParams(null)
    await proceedWithQuiz(subject, slug, unitForLog, difficulty)
  }

  // 実際にクイズを開始
  const proceedWithQuiz = async (subject, slug, unitForLog, difficulty) => {
    setSelectedSubject(subject)
    try {
      const rawQuestions = await fetchQuestions(slug, 5, difficulty)
      const mapped = rawQuestions.map((q) => ({
        id: q.id,
        text: q.body,
        options: q.choices,
        correctIndex: q.correct_index,
        explanation: q.explanation,
        translation: q.translation || '',
      }))
      setCurrentUnit(unitForLog)
      setCurrentQuestions(mapped)
      setQuizAnswers([])
      setPage('quiz')
    } catch (err) {
      console.warn('API問題生成失敗、ダミーデータを使用:', err.message)
      setCurrentUnit(unitForLog)
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
        return (
          <PricingPage
            onNavigate={handleNavigate}
            isLoggedIn={isLoggedIn}
            planTier={planTier || 'free'}
            user={user}
            userEmail={user?.email || ''}
          />
        )

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
            planTier={planTier || 'free'}
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

      case 'section':
        return (
          <SectionPage
            onNavigate={handleNavigate}
            onSelectSubUnit={handleSelectSubUnit}
            parentUnit={currentParentUnit || { slug: '', title: '', subject: 'english' }}
            subUnits={currentParentUnit ? (SUB_UNITS[currentParentUnit.slug] || []) : []}
            selectedCharacter={selectedCharacter}
            grade={selectedGradeLabel}
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
            onLogout={handleLogout}
            userName={profile?.display_name || ''}
            grade={selectedGradeId || 'j1'}
            selectedCharacter={selectedCharacter}
            onSelectCharacter={handleSelectCharacter}
            planTier={planTier || 'free'}
            stats={stats}
            userId={user?.id}
          />
        )

      case 'parentReport':
        return <ParentReportPage token={reportToken} onNavigate={handleNavigate} />

      default:
        return <LandingPage onNavigate={handleNavigate} />
    }
  }

  return (
    <div className="relative min-h-screen" style={{ fontFamily: '"Noto Sans JP", sans-serif' }}>
      <FloatingDecorations />

      {error && <div className="error-banner">{error}</div>}

      {/* 日次制限モーダル */}
      <AnimatePresence>
        {limitReachedModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setLimitReachedModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-xl"
            >
              <div className="mb-4 text-4xl">🚫</div>
              <h3 className="mb-2 text-xl font-bold text-[var(--text)]">今日の上限に達しました</h3>
              <p className="mb-4 text-sm text-[var(--text-sub)]">
                本日は {usageToday}/{dailyLimit}問 を解きました。<br />
                もっと勉強したい場合はプランをアップグレードしましょう！
              </p>
              <div className="flex flex-col gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setLimitReachedModal(false)
                    setPage('pricing')
                  }}
                  className="w-full rounded-2xl bg-[var(--primary)] py-3 font-bold text-white shadow-md"
                >
                  プランを見る ⭐
                </motion.button>
                <button
                  onClick={() => setLimitReachedModal(false)}
                  className="text-sm text-[var(--text-muted)] underline hover:no-underline"
                >
                  閉じる
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 難易度選択モーダル */}
      <AnimatePresence>
        {showDifficultySelector && (
          <DifficultySelector
            subject={selectedSubject}
            selectedCharacter={selectedCharacter}
            onSelect={handleDifficultySelected}
            onCancel={() => {
              setShowDifficultySelector(false)
              setPendingQuizParams(null)
            }}
          />
        )}
      </AnimatePresence>

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
