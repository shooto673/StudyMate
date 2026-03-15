import { motion } from "framer-motion"
import { User } from "lucide-react"

export function Header({ isLoggedIn = false, grade, onNavigate, className = "" }) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`sticky top-0 z-50 w-full border-b border-[var(--card-border)] bg-white/80 backdrop-blur-md ${className}`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <button
          onClick={() => onNavigate(isLoggedIn ? "stageMap" : "landing")}
          className="flex items-center gap-2 text-xl font-bold text-[var(--text)] transition-transform hover:scale-105"
        >
          <span className="text-2xl">📖</span>
          <span>StudyMate</span>
        </button>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              {grade && (
                <span className="text-sm font-medium text-[var(--text-sub)]">
                  {grade}
                </span>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate("myPage")}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-light)] text-[var(--primary)] transition-shadow hover:shadow-md"
              >
                <User className="h-5 w-5" />
              </motion.button>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate("login")}
              className="rounded-2xl bg-[var(--primary)] px-6 py-2 font-bold text-white shadow-md transition-shadow hover:shadow-lg"
            >
              ログイン
            </motion.button>
          )}
        </div>
      </div>
    </motion.header>
  )
}
