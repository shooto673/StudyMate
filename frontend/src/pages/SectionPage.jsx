import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, ChevronRight, BookOpen, Calculator } from "lucide-react"
import { Header } from "../components/Header"
import { FloatingDecorations } from "../components/FloatingDecorations"
import { Mascot } from "../components/Mascot"

export function SectionPage({
  onNavigate,
  onSelectSubUnit,
  parentUnit = { slug: '', title: '', subject: 'english' },
  subUnits = [],
  selectedCharacter = "mascot",
  grade = "",
}) {
  const [loadingSlug, setLoadingSlug] = useState(null)

  const isEnglish = parentUnit.subject === 'english'
  const accentColor = isEnglish ? 'var(--english)' : 'var(--math)'
  const accentBg = isEnglish ? 'var(--english-light)' : 'var(--math-light)'
  const SubjectIcon = isEnglish ? BookOpen : Calculator

  const handleClick = async (subUnit) => {
    if (loadingSlug) return
    setLoadingSlug(subUnit.slug)
    try {
      await onSelectSubUnit(parentUnit.subject, subUnit.slug)
    } catch {
      setLoadingSlug(null)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <FloatingDecorations />
      <Header isLoggedIn grade={grade} onNavigate={onNavigate} />

      <main className="mx-auto max-w-2xl px-4 py-6">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onNavigate("stageMap")}
          className="mb-4 flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-medium text-[var(--primary)] shadow-[var(--card-shadow)] transition-all hover:shadow-md"
        >
          <ArrowLeft className="h-5 w-5" />
          単元マップに戻る
        </motion.button>

        {/* Unit header with mascot */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-4 rounded-3xl bg-white p-5 shadow-[var(--card-shadow)]"
        >
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
            style={{ backgroundColor: accentBg }}
          >
            <SubjectIcon className="h-7 w-7" style={{ color: accentColor }} />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-[var(--text)]">{parentUnit.title}</h1>
            <p className="text-sm text-[var(--text-sub)]">{subUnits.length}つのセクション</p>
          </div>
          <Mascot character={selectedCharacter} mood="thinking" size="sm" message="どれから始める？" />
        </motion.div>

        {/* Sub-unit list */}
        <div className="space-y-3">
          {subUnits.map((sub, index) => (
            <motion.button
              key={sub.slug}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleClick(sub)}
              disabled={!!loadingSlug}
              className={`flex w-full items-center gap-4 rounded-2xl bg-white p-4 text-left shadow-[var(--card-shadow)] transition-all hover:shadow-[var(--card-hover-shadow)] ${
                loadingSlug === sub.slug ? 'ring-2 ring-[var(--primary)]' : ''
              } ${loadingSlug && loadingSlug !== sub.slug ? 'opacity-50' : ''}`}
            >
              {/* Number badge */}
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                style={{ backgroundColor: accentColor }}
              >
                {sub.number}
              </div>

              {/* Title */}
              <div className="flex-1">
                <p className="font-medium text-[var(--text)]">
                  {loadingSlug === sub.slug ? '読み込み中...' : sub.title}
                </p>
              </div>

              {/* Arrow */}
              <ChevronRight className="h-5 w-5 shrink-0 text-[var(--text-muted)]" />
            </motion.button>
          ))}
        </div>

        <div className="h-8" />
      </main>
    </div>
  )
}
