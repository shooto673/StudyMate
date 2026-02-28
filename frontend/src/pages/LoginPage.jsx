import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, ArrowLeft } from "lucide-react"
import { Mascot } from "../components/Mascot"

export function LoginPage({ onNavigate, onGoogleLogin }) {
  const [authMode, setAuthMode] = useState("login")
  const [showReferral, setShowReferral] = useState(false)
  const [referralCode, setReferralCode] = useState("")

  const handleGoogleAuth = () => {
    if (onGoogleLogin) {
      onGoogleLogin()
    } else {
      onNavigate("gradeSelect")
    }
  }

  const isLogin = authMode === "login"

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4 relative overflow-hidden">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, var(--primary-light) 0%, transparent 70%)",
        }}
      />

      <motion.button
        onClick={() => onNavigate("landing")}
        className="absolute top-6 left-6 flex items-center gap-2 text-[var(--text-sub)] hover:text-[var(--text)] transition-colors z-20"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">戻る</span>
      </motion.button>

      <motion.div
        className="w-full max-w-md bg-white rounded-3xl shadow-[var(--card-shadow)] p-8 relative z-10"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex justify-center mb-6">
          <Mascot
            mood="happy"
            size="lg"
            message={isLogin ? "おかえり！今日もがんばろう！" : "はじめまして！一緒に勉強しよう！"}
          />
        </div>

        <h1 className="text-2xl font-extrabold text-center text-[var(--text)] mb-6">
          {isLogin ? "StudyMateへようこそ！" : "アカウントを作成"}
        </h1>

        <div className="flex bg-[var(--bg-sub)] rounded-2xl p-1 mb-6">
          <button
            onClick={() => setAuthMode("login")}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
              isLogin
                ? "bg-white text-[var(--text)] shadow-sm"
                : "text-[var(--text-sub)] hover:text-[var(--text)]"
            }`}
          >
            ログイン
          </button>
          <button
            onClick={() => setAuthMode("signup")}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
              !isLogin
                ? "bg-white text-[var(--text)] shadow-sm"
                : "text-[var(--text-sub)] hover:text-[var(--text)]"
            }`}
          >
            アカウント作成
          </button>
        </div>

        <motion.button
          onClick={handleGoogleAuth}
          className="w-full py-4 px-6 bg-white border border-[var(--card-border)] rounded-2xl flex items-center justify-center gap-3 font-semibold text-[var(--text)] hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
          whileTap={{ scale: 0.98 }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          {isLogin ? "Googleでログイン" : "Googleで登録"}
        </motion.button>

        {!isLogin && (
          <div className="mt-6">
            <button
              onClick={() => setShowReferral(!showReferral)}
              className="w-full flex items-center justify-between text-[var(--text-sub)] text-sm hover:text-[var(--text)] transition-colors"
            >
              <span>紹介コードをお持ちですか？</span>
              {showReferral ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <AnimatePresence>
              {showReferral && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-2 mt-3">
                    <input
                      type="text"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value)}
                      placeholder="コードを入力"
                      className="flex-1 px-4 py-3 border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    />
                    <button className="px-4 py-3 bg-[var(--primary)] text-white rounded-xl font-semibold text-sm hover:bg-opacity-90 transition-colors">
                      適用
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <p className="text-xs text-[var(--text-muted)] text-center mt-8">
          {isLogin ? "ログイン" : "アカウント作成"}すると
          <a href="#" className="text-[var(--primary)] hover:underline">利用規約</a>
          に同意したものとみなされます
        </p>
      </motion.div>
    </div>
  )
}
