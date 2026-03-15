"use client"

import { motion } from "framer-motion"
import { Header } from "./header"
import { Mascot } from "./mascot"
import { BarChart3, Target, Flame, Languages, Calculator, ChevronRight, BookOpen } from "lucide-react"

interface DashboardPageProps {
  onNavigate: (page: string) => void
  userName?: string
  character: "taylor" | "mona"
}

export function DashboardPage({ onNavigate, userName = "ユーザー", character }: DashboardPageProps) {
  // Mock data - would come from API in real app
  const stats = {
    totalAnswers: 42,
    accuracy: 78,
    streak: 3,
    todayProgress: 3,
    todayGoal: 10,
  }

  const subjects = [
    {
      id: "english",
      name: "英語",
      icon: Languages,
      color: "var(--english)",
      bgColor: "var(--english-light)",
      progress: 45,
      nextUnit: "be動詞の過去形",
    },
    {
      id: "math",
      name: "数学",
      icon: Calculator,
      color: "var(--math)",
      bgColor: "var(--math-light)",
      progress: 32,
      nextUnit: "連立方程式",
    },
  ]

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Header onNavigate={onNavigate} isLoggedIn userName={userName} />

      <main className="mx-auto max-w-4xl px-4 py-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center justify-between rounded-3xl bg-white p-6 shadow-[var(--card-shadow)]"
        >
          <div>
            <h1 className="text-2xl font-bold text-[var(--text)]">
              おかえり、{userName}さん！
            </h1>
            <p className="mt-1 text-[var(--text-sub)]">今日は何を勉強する？</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[var(--bg-sub)] px-4 py-2 text-sm text-[var(--text-sub)]">
              今日は何を勉強する？
            </div>
            <Mascot character={character} mood="studying" size="md" />
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 grid grid-cols-3 gap-4"
        >
          {/* Total Answers */}
          <div className="rounded-2xl bg-white p-5 shadow-[var(--card-shadow)]">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary-light)]">
                <BarChart3 className="h-5 w-5 text-[var(--primary)]" />
              </div>
              <span className="text-sm text-[var(--text-sub)]">総回答数</span>
            </div>
            <p className="text-3xl font-bold text-[var(--text)]">
              {stats.totalAnswers}
              <span className="ml-1 text-lg font-normal text-[var(--text-sub)]">問</span>
            </p>
          </div>

          {/* Accuracy */}
          <div className="rounded-2xl bg-white p-5 shadow-[var(--card-shadow)]">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--success-light)]">
                <Target className="h-5 w-5 text-[var(--success)]" />
              </div>
              <span className="text-sm text-[var(--text-sub)]">正答率</span>
            </div>
            <div className="flex items-center gap-3">
              {/* Circular Progress */}
              <div className="relative h-12 w-12">
                <svg className="h-12 w-12 -rotate-90" viewBox="0 0 48 48">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="var(--success-light)"
                    strokeWidth="4"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="var(--success)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${(stats.accuracy / 100) * 125.6} 125.6`}
                  />
                </svg>
              </div>
              <p className="text-3xl font-bold text-[var(--text)]">
                {stats.accuracy}
                <span className="text-lg font-normal text-[var(--text-sub)]">%</span>
              </p>
            </div>
          </div>

          {/* Streak */}
          <div className="rounded-2xl bg-white p-5 shadow-[var(--card-shadow)]">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-light)]">
                <Flame className="h-5 w-5 text-[var(--accent)]" />
              </div>
              <span className="text-sm text-[var(--text-sub)]">連続日数</span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold text-[var(--text)]">
                {stats.streak}
                <span className="ml-1 text-lg font-normal text-[var(--text-sub)]">日</span>
              </p>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-2xl"
              >
                <Flame className="h-7 w-7 text-orange-500" fill="currentColor" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Today's Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 rounded-2xl bg-white p-5 shadow-[var(--card-shadow)]"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="font-medium text-[var(--text)]">今日の学習</span>
            <span className="text-sm text-[var(--text-sub)]">
              {stats.todayProgress} / {stats.todayGoal}問
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-[var(--bg-sub)]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(stats.todayProgress / stats.todayGoal) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, var(--primary), var(--english))",
              }}
            />
          </div>
        </motion.div>

        {/* Subject Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="mb-4 text-lg font-bold text-[var(--text)]">教科を選ぶ</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {subjects.map((subject) => (
              <motion.button
                key={subject.id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate("stageMap")}
                className="flex items-center gap-4 rounded-2xl bg-white p-5 text-left shadow-[var(--card-shadow)] transition-shadow hover:shadow-[var(--card-hover-shadow)]"
              >
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: subject.bgColor }}
                >
                  <subject.icon className="h-7 w-7" style={{ color: subject.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[var(--text)]">{subject.name}</h3>
                    <ChevronRight className="h-5 w-5 text-[var(--text-muted)]" />
                  </div>
                  <p className="mt-1 text-sm text-[var(--text-sub)]">
                    次の単元: {subject.nextUnit}
                  </p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--bg-sub)]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${subject.progress}%`,
                        backgroundColor: subject.color,
                      }}
                    />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 grid grid-cols-2 gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate("review")}
            className="flex items-center gap-3 rounded-2xl bg-[var(--primary-light)] p-4 text-left transition-colors hover:bg-[var(--primary-light)]/80"
          >
            <BookOpen className="h-6 w-6 text-[var(--primary)]" />
            <div>
              <p className="font-medium text-[var(--primary)]">復習する</p>
              <p className="text-sm text-[var(--primary)]/70">間違えた問題を確認</p>
            </div>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate("myPage")}
            className="flex items-center gap-3 rounded-2xl bg-[var(--accent-light)] p-4 text-left transition-colors hover:bg-[var(--accent-light)]/80"
          >
            <Target className="h-6 w-6 text-[var(--accent)]" />
            <div>
              <p className="font-medium text-[var(--accent)]">マイページ</p>
              <p className="text-sm text-[var(--accent)]/70">学習記録を見る</p>
            </div>
          </motion.button>
        </motion.div>
      </main>
    </div>
  )
}
