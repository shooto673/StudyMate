import { motion } from "framer-motion"
import { BookOpen, ChevronDown } from "lucide-react"

export default function Header({ isLoggedIn = false, grade, onNavigate }) {
  return (
    <motion.header
      className="sticky top-0 z-50 bg-white border-b border-[var(--card-border)] shadow-sm"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <button
          onClick={() => onNavigate(isLoggedIn ? "dashboard" : "landing")}
          className="flex items-center gap-2 text-xl font-extrabold text-[var(--text)] hover:opacity-80 transition-opacity"
        >
          <motion.span
            className="text-2xl"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          >
            <BookOpen className="w-7 h-7 text-[var(--primary)]" />
          </motion.span>
          <span>StudyMate</span>
        </button>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              {grade && (
                <button className="flex items-center gap-1 px-4 py-2 bg-[var(--primary-light)] text-[var(--primary)] rounded-full text-sm font-semibold hover:bg-opacity-80 transition-colors">
                  {grade}
                  <ChevronDown className="w-4 h-4" />
                </button>
              )}
              <div className="w-10 h-10 rounded-full bg-[var(--primary-light)] border-2 border-[var(--primary)] flex items-center justify-center">
                <span className="text-[var(--primary)] font-bold text-sm">U</span>
              </div>
              <span className="px-3 py-1 bg-[var(--primary-light)] text-[var(--primary)] rounded-full text-xs font-bold">
                Lv.12
              </span>
            </>
          ) : (
            <button
              onClick={() => onNavigate("login")}
              className="px-5 py-2 bg-[var(--primary)] text-white rounded-full font-semibold text-sm hover:scale-105 hover:shadow-lg transition-all duration-200"
            >
              ログイン
            </button>
          )}
        </div>
      </div>
    </motion.header>
  )
}
