import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, LogOut, ChevronRight, CreditCard, GraduationCap, ArrowLeft } from "lucide-react"
import { Header } from "../components/Header"
import { FloatingDecorations } from "../components/FloatingDecorations"
import { Mascot } from "../components/Mascot"

const gradeLabels = {
  j1: "中学1年 🌸",
  j2: "中学2年 🌿",
  j3: "中学3年 🌙",
}

const planInfo = {
  free: { name: "Free", price: 0, limit: 10 },
  light: { name: "Light", price: 500, limit: 50 },
  standard: { name: "Standard", price: 799, limit: 100 },
  premium: { name: "Premium", price: 999, limit: 200 },
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
}) {
  const [changingCharacter, setChangingCharacter] = useState(null)

  const handleChangeCharacter = (character) => {
    if (character === selectedCharacter) return
    setChangingCharacter(character)
    setTimeout(() => {
      onSelectCharacter(character)
      setChangingCharacter(null)
    }, 600)
  }

  const plan = planInfo[planTier] || planInfo.free

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

        {/* Plan Management */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-6 rounded-3xl bg-white p-6 shadow-[var(--card-shadow)]">
          <h3 className="mb-4 text-lg font-bold text-[var(--text)]">プラン管理</h3>
          <div className="mb-4 rounded-2xl bg-[var(--bg-sub)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-[var(--text)]">{plan.name} プラン</p>
                <p className="text-sm text-[var(--text-sub)]">{plan.price === 0 ? "無料" : `¥${plan.price.toLocaleString()}/月`} ・ {plan.limit}問/日</p>
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-6 rounded-3xl bg-white p-6 shadow-[var(--card-shadow)]">
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
