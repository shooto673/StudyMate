import { motion } from "framer-motion"
import { Mascot } from "./Mascot"

const difficulties = [
  {
    id: "easy",
    label: "やさしい",
    emoji: "🌱",
    description: "基本問題で自信をつけよう",
    color: "var(--success)",
    bgColor: "var(--success-light)",
  },
  {
    id: "normal",
    label: "ふつう",
    emoji: "📚",
    description: "標準レベルでしっかり学ぼう",
    color: "var(--primary)",
    bgColor: "var(--primary-light)",
  },
  {
    id: "hard",
    label: "むずかしい",
    emoji: "🔥",
    description: "応用問題にチャレンジ！",
    color: "var(--error)",
    bgColor: "var(--error-light)",
  },
]

export function DifficultySelector({ subject, selectedCharacter = "mascot", onSelect, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl"
      >
        <div className="mb-4 flex justify-center">
          <Mascot character={selectedCharacter} mood="thinking" size="md" message="難易度を選んでね！" />
        </div>

        <h3 className="mb-6 text-center text-xl font-bold text-[var(--text)]">難易度を選択</h3>

        <div className="space-y-3">
          {difficulties.map((d, i) => (
            <motion.button
              key={d.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(d.id)}
              className="flex w-full items-center gap-4 rounded-2xl border-2 border-[var(--card-border)] bg-white p-4 transition-all hover:shadow-md"
              style={{ "--hover-border": d.color }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = d.color}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = ''}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                style={{ backgroundColor: d.bgColor }}
              >
                {d.emoji}
              </div>
              <div className="text-left">
                <div className="font-bold text-[var(--text)]">{d.label}</div>
                <div className="text-sm text-[var(--text-sub)]">{d.description}</div>
              </div>
            </motion.button>
          ))}
        </div>

        <button
          onClick={onCancel}
          className="mt-4 w-full text-center text-sm text-[var(--text-muted)] underline hover:no-underline"
        >
          キャンセル
        </button>
      </motion.div>
    </motion.div>
  )
}
