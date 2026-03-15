import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, LogOut, ChevronRight, CreditCard, GraduationCap, ArrowLeft, BarChart3, Brain, Share2, Copy, ExternalLink, Loader2, AlertTriangle } from "lucide-react"
import { Header } from "../components/Header"
import { FloatingDecorations } from "../components/FloatingDecorations"
import { Mascot } from "../components/Mascot"
import { WeeklyChart } from "../components/WeeklyChart"
import { fetchWeeklyReport, fetchWeaknessAnalysis, createParentShareToken } from "../lib/api"

const gradeLabels = {
  j1: "中学1年 🌸",
  j2: "中学2年 🌿",
  j3: "中学3年 🌙",
}

const planInfo = {
  free: { name: "Free", price: 0, limit: 10, limitLabel: "10問/日" },
  standard: { name: "Standard", price: 699, limit: 50, limitLabel: "50問/日" },
  premium: { name: "Premium", price: 999, limit: null, limitLabel: "無制限" },
}

export function MyPage({
  onNavigate,
  onLogout,
  userName = "",
  grade = "j1",
  selectedCharacter = "mascot",
  onSelectCharacter,
  planTier = "free",
  stats = { totalAnswers: 0, accuracy: 0, streak: 0 },
  userId,
}) {
  const [changingCharacter, setChangingCharacter] = useState(null)

  // レポートデータ
  const [weeklyReport, setWeeklyReport] = useState(null)
  const [reportLoading, setReportLoading] = useState(false)

  // 弱点分析データ
  const [weaknesses, setWeaknesses] = useState(null)
  const [weaknessLoading, setWeaknessLoading] = useState(false)

  // 保護者共有
  const [shareToken, setShareToken] = useState(null)
  const [shareLoading, setShareLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleChangeCharacter = (character) => {
    if (character === selectedCharacter) return
    setChangingCharacter(character)
    setTimeout(() => {
      onSelectCharacter(character)
      setChangingCharacter(null)
    }, 600)
  }

  const plan = planInfo[planTier] || planInfo.free

  // レポートデータを読み込み
  useEffect(() => {
    if (!userId) return
    if (planTier === 'standard' || planTier === 'premium') {
      setReportLoading(true)
      fetchWeeklyReport(userId)
        .then(setWeeklyReport)
        .catch(console.error)
        .finally(() => setReportLoading(false))
    }
    if (planTier === 'premium') {
      setWeaknessLoading(true)
      fetchWeaknessAnalysis(userId)
        .then(setWeaknesses)
        .catch(console.error)
        .finally(() => setWeaknessLoading(false))
    }
  }, [userId, planTier])

  const handleGenerateShareLink = async () => {
    if (!userId) return
    setShareLoading(true)
    try {
      const token = await createParentShareToken(userId)
      setShareToken(token)
    } catch (err) {
      console.error('Share token error:', err)
    } finally {
      setShareLoading(false)
    }
  }

  const handleCopyLink = () => {
    if (!shareToken) return
    const url = `${window.location.origin}?report=${shareToken}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <FloatingDecorations />
      <Header isLoggedIn grade={gradeLabels[grade]} onNavigate={onNavigate} />

      <main className="mx-auto max-w-2xl px-4 py-6">
        {/* Back to Map */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onNavigate("stageMap")}
          className="mb-4 flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-medium text-[var(--primary)] shadow-[var(--card-shadow)] transition-all hover:shadow-md"
        >
          <ArrowLeft className="h-5 w-5" />
          マップに戻る
        </motion.button>

        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 rounded-3xl bg-white p-6 shadow-[var(--card-shadow)]">
          <div className="flex flex-col items-center text-center">
            <Mascot character={selectedCharacter} mood="happy" size="lg" animate={false} />
            <h2 className="mt-4 text-xl font-bold text-[var(--text)]">{userName}さん</h2>
            <p className="text-sm text-[var(--text-sub)]">{gradeLabels[grade]}</p>
            <span className="mt-2 rounded-full bg-[var(--primary-light)] px-4 py-1 text-sm font-medium text-[var(--primary)]">{plan.name} プラン</span>
          </div>
        </motion.div>

        {/* Partner Change */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 rounded-3xl bg-white p-6 shadow-[var(--card-shadow)]">
          <h3 className="mb-4 text-lg font-bold text-[var(--text)]">パートナー変更</h3>
          <div className="grid grid-cols-2 gap-4">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleChangeCharacter("mascot")}
              className={`relative rounded-2xl border-2 p-4 transition-all ${selectedCharacter === "mascot" ? "border-[var(--primary)] bg-[var(--primary-light)]" : "border-[var(--card-border)] bg-white hover:border-[var(--text-muted)]"}`}>
              <AnimatePresence>
                {selectedCharacter === "mascot" && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)] text-white">
                    <Check className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.div animate={changingCharacter === "mascot" ? { y: [0, -15, 0], transition: { duration: 0.5 } } : {}} className="flex justify-center">
                <Mascot character="mascot" mood={selectedCharacter === "mascot" ? "happy" : "normal"} size="md" animate={false} />
              </motion.div>
              <p className="mt-2 text-center text-sm font-medium text-[var(--text)]">テイラーくん</p>
              {selectedCharacter === "mascot" ? <p className="mt-1 text-center text-xs text-[var(--primary)]">選択中</p> : <p className="mt-1 text-center text-xs text-[var(--text-muted)]">変更する</p>}
            </motion.button>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleChangeCharacter("mona")}
              className={`relative rounded-2xl border-2 p-4 transition-all ${selectedCharacter === "mona" ? "border-[var(--primary)] bg-[var(--primary-light)]" : "border-[var(--card-border)] bg-white hover:border-[var(--text-muted)]"}`}>
              <AnimatePresence>
                {selectedCharacter === "mona" && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)] text-white">
                    <Check className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.div animate={changingCharacter === "mona" ? { y: [0, -15, 0], transition: { duration: 0.5 } } : {}} className="flex justify-center">
                <Mascot character="mona" mood={selectedCharacter === "mona" ? "happy" : "normal"} size="md" animate={false} />
              </motion.div>
              <p className="mt-2 text-center text-sm font-medium text-[var(--text)]">モナちゃん</p>
              {selectedCharacter === "mona" ? <p className="mt-1 text-center text-xs text-[var(--primary)]">選択中</p> : <p className="mt-1 text-center text-xs text-[var(--text-muted)]">変更する</p>}
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6 rounded-3xl bg-white p-6 shadow-[var(--card-shadow)]">
          <h3 className="mb-4 text-lg font-bold text-[var(--text)]">学習統計</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl bg-[var(--primary-light)] p-4 text-center">
              <div className="text-2xl font-bold text-[var(--primary)]">{stats.totalAnswers}</div>
              <div className="text-xs text-[var(--text-sub)]">総回答数</div>
            </div>
            <div className="rounded-2xl bg-[var(--success-light)] p-4 text-center">
              <div className="text-2xl font-bold text-[var(--success)]">{stats.accuracy}%</div>
              <div className="text-xs text-[var(--text-sub)]">正答率</div>
            </div>
            <div className="rounded-2xl bg-[var(--accent-light)] p-4 text-center">
              <div className="text-2xl font-bold text-[var(--accent)]">{stats.streak}日</div>
              <div className="text-xs text-[var(--text-sub)]">連続日数</div>
            </div>
          </div>
        </motion.div>

        {/* 学習レポート (Standard+) */}
        {(planTier === 'standard' || planTier === 'premium') ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-6 rounded-3xl bg-white p-6 shadow-[var(--card-shadow)]">
            <div className="mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[var(--primary)]" />
              <h3 className="text-lg font-bold text-[var(--text)]">
                {planTier === 'premium' ? '学習レポート（日次）' : '学習レポート（週次）'}
              </h3>
            </div>
            {reportLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-[var(--primary)]" />
              </div>
            ) : weeklyReport ? (
              <div>
                <WeeklyChart data={weeklyReport} />
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[var(--bg-sub)] p-3 text-center">
                    <div className="text-lg font-bold text-[var(--text)]">
                      {weeklyReport.reduce((sum, d) => sum + d.count, 0)}
                    </div>
                    <div className="text-xs text-[var(--text-sub)]">今週の問題数</div>
                  </div>
                  <div className="rounded-xl bg-[var(--bg-sub)] p-3 text-center">
                    <div className="text-lg font-bold text-[var(--text)]">
                      {(() => {
                        const withData = weeklyReport.filter(d => d.count > 0)
                        return withData.length > 0
                          ? Math.round(withData.reduce((sum, d) => sum + d.accuracy, 0) / withData.length)
                          : 0
                      })()}%
                    </div>
                    <div className="text-xs text-[var(--text-sub)]">今週の平均正答率</div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-[var(--text-muted)]">データがまだありません</p>
            )}
          </motion.div>
        ) : (
          /* Free向けティーザー */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-6 rounded-3xl border-2 border-dashed border-[var(--card-border)] bg-white p-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-[var(--text-muted)]" />
              <div>
                <h3 className="font-bold text-[var(--text)]">学習レポート</h3>
                <p className="text-sm text-[var(--text-sub)]">Standardプラン以上で週次レポートが見られます</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate("pricing")}
              className="mt-4 w-full rounded-2xl bg-[var(--primary)] py-2.5 text-sm font-bold text-white"
            >
              プランを見る ⭐
            </motion.button>
          </motion.div>
        )}

        {/* AI弱点分析 (Premium) */}
        {planTier === 'premium' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-6 rounded-3xl bg-white p-6 shadow-[var(--card-shadow)]">
            <div className="mb-4 flex items-center gap-2">
              <Brain className="h-5 w-5 text-[var(--warning)]" />
              <h3 className="text-lg font-bold text-[var(--text)]">AI弱点分析</h3>
            </div>
            {weaknessLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-[var(--warning)]" />
              </div>
            ) : weaknesses && weaknesses.length > 0 ? (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Mascot character={selectedCharacter} mood="thinking" size="sm" animate={false} />
                  <p className="text-sm text-[var(--text-sub)]">この単元を重点的に復習しよう！</p>
                </div>
                <div className="space-y-2">
                  {weaknesses.map((w, i) => (
                    <motion.div
                      key={w.unitId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between rounded-2xl bg-[var(--bg-sub)] p-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--error-light)] text-xs font-bold text-[var(--error)]">
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-[var(--text)]">{w.title}</p>
                          <p className="text-xs text-[var(--text-muted)]">正答率 {w.accuracy}%（{w.total}問）</p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onNavigate("stageMap")}
                        className="rounded-xl bg-[var(--primary)] px-3 py-1.5 text-xs font-bold text-white"
                      >
                        練習
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-4">
                <AlertTriangle className="mb-2 h-8 w-8 text-[var(--text-muted)]" />
                <p className="text-sm text-[var(--text-muted)]">
                  {weaknesses && weaknesses.length === 0 ? "まだ十分なデータがありません（各単元5問以上解いてください）" : "データの取得に失敗しました"}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* 保護者レポート共有 (Premium) */}
        {planTier === 'premium' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mb-6 rounded-3xl bg-white p-6 shadow-[var(--card-shadow)]">
            <div className="mb-4 flex items-center gap-2">
              <Share2 className="h-5 w-5 text-[var(--accent)]" />
              <h3 className="text-lg font-bold text-[var(--text)]">保護者レポート共有</h3>
            </div>
            <p className="mb-4 text-sm text-[var(--text-sub)]">
              学習の進捗を保護者と共有できるリンクを生成します。リンクは7日間有効です。
            </p>
            {shareToken ? (
              <div>
                <div className="flex items-center gap-2 rounded-xl bg-[var(--bg-sub)] p-3">
                  <ExternalLink className="h-4 w-4 flex-shrink-0 text-[var(--text-muted)]" />
                  <span className="flex-1 truncate text-sm text-[var(--text)]">
                    {window.location.origin}?report={shareToken}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopyLink}
                    className="flex items-center gap-1 rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-bold text-white"
                  >
                    <Copy className="h-3 w-3" />
                    {copied ? "コピー済み！" : "コピー"}
                  </motion.button>
                </div>
                <p className="mt-2 text-xs text-[var(--text-muted)]">このリンクを保護者に送ってください（7日間有効）</p>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerateShareLink}
                disabled={shareLoading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] py-3 font-bold text-white"
              >
                {shareLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4" />
                    共有リンクを生成
                  </>
                )}
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Plan Management */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-6 rounded-3xl bg-white p-6 shadow-[var(--card-shadow)]">
          <h3 className="mb-4 text-lg font-bold text-[var(--text)]">プラン管理</h3>
          <div className="mb-4 rounded-2xl bg-[var(--bg-sub)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-[var(--text)]">{plan.name} プラン</p>
                <p className="text-sm text-[var(--text-sub)]">{plan.price === 0 ? "無料" : `¥${plan.price.toLocaleString()}/月`} ・ {plan.limitLabel}</p>
              </div>
              {planTier !== "free" && <span className="rounded-full bg-[var(--success-light)] px-3 py-1 text-xs font-medium text-[var(--success)]">有効</span>}
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => onNavigate("pricing")}
            className="flex w-full items-center justify-between rounded-2xl border-2 border-[var(--card-border)] bg-white p-4 transition-all hover:border-[var(--primary)]">
            <div className="flex items-center gap-3"><CreditCard className="h-5 w-5 text-[var(--text-sub)]" /><span className="font-medium text-[var(--text)]">プランを変更</span></div>
            <ChevronRight className="h-5 w-5 text-[var(--text-muted)]" />
          </motion.button>
          {planTier !== "free" && <button className="mt-3 w-full text-center text-sm text-[var(--text-muted)] underline hover:text-[var(--error)]">解約する</button>}
        </motion.div>

        {/* Settings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mb-6 rounded-3xl bg-white p-6 shadow-[var(--card-shadow)]">
          <h3 className="mb-4 text-lg font-bold text-[var(--text)]">その他の設定</h3>
          <div className="space-y-3">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => onNavigate("gradeSelect")}
              className="flex w-full items-center justify-between rounded-2xl border-2 border-[var(--card-border)] bg-white p-4 transition-all hover:border-[var(--primary)]">
              <div className="flex items-center gap-3"><GraduationCap className="h-5 w-5 text-[var(--text-sub)]" /><span className="font-medium text-[var(--text)]">学年変更</span></div>
              <ChevronRight className="h-5 w-5 text-[var(--text-muted)]" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onLogout || (() => onNavigate("landing"))}
              className="flex w-full items-center justify-between rounded-2xl border-2 border-[var(--error-light)] bg-white p-4 text-[var(--error)] transition-all hover:bg-[var(--error-light)]">
              <div className="flex items-center gap-3"><LogOut className="h-5 w-5" /><span className="font-medium">ログアウト</span></div>
            </motion.button>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
