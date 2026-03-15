"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Header } from "./header"
import { FloatingDecorations } from "./floating-decorations"
import { Mascot } from "./mascot"

interface CharacterSelectPageProps {
  onNavigate: (page: string) => void
  onSelectCharacter: (character: "mascot" | "mona") => void
}

export function CharacterSelectPage({ onNavigate, onSelectCharacter }: CharacterSelectPageProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<"mascot" | "mona" | null>(null)
  const [isSelecting, setIsSelecting] = useState(false)

  const handleSelect = (character: "mascot" | "mona") => {
    setSelectedCharacter(character)
    setIsSelecting(true)
    
    setTimeout(() => {
      onSelectCharacter(character)
      onNavigate("gradeSelect")
    }, 800)
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <FloatingDecorations />
      <Header onNavigate={onNavigate} />

      <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 text-center text-2xl font-bold text-[var(--text)] md:text-3xl"
        >
          きみのパートナーをえらぼう！
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12 text-center text-[var(--text-sub)]"
        >
          一緒に勉強してくれるキャラクターを選んでね
        </motion.p>

        <div className="grid gap-8 md:grid-cols-2">
          {/* テイラーくん */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={!isSelecting ? { scale: 1.02, y: -4 } : {}}
            className={`relative rounded-3xl bg-white p-8 shadow-[var(--card-shadow)] transition-all ${
              selectedCharacter === "mascot" ? "ring-4 ring-[var(--primary)]" : ""
            }`}
          >
            <AnimatePresence>
              {selectedCharacter === "mascot" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] text-white"
                >
                  ✓
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mb-6 flex justify-center">
              <motion.div
                animate={
                  selectedCharacter === "mascot"
                    ? { y: [0, -20, 0], transition: { duration: 0.5 } }
                    : {}
                }
              >
                <Mascot
                  character="mascot"
                  mood={selectedCharacter === "mascot" ? "cheering" : "happy"}
                  size="xl"
                />
              </motion.div>
            </div>

            <h2 className="mb-2 text-center text-xl font-bold text-[var(--text)]">
              テイラーくん
            </h2>
            <p className="mb-6 text-center text-sm text-[var(--text-sub)]">
              よろしくね！
              <br />
              一緒にがんばろう！
            </p>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect("mascot")}
              disabled={isSelecting}
              className="w-full rounded-2xl bg-[var(--primary)] py-3 font-bold text-white shadow-md transition-shadow hover:shadow-lg disabled:opacity-50"
            >
              このコにする！
            </motion.button>
          </motion.div>

          {/* モナちゃん */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={!isSelecting ? { scale: 1.02, y: -4 } : {}}
            className={`relative rounded-3xl bg-white p-8 shadow-[var(--card-shadow)] transition-all ${
              selectedCharacter === "mona" ? "ring-4 ring-[var(--primary)]" : ""
            }`}
          >
            <AnimatePresence>
              {selectedCharacter === "mona" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] text-white"
                >
                  ✓
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mb-6 flex justify-center">
              <motion.div
                animate={
                  selectedCharacter === "mona"
                    ? { y: [0, -20, 0], transition: { duration: 0.5 } }
                    : {}
                }
              >
                <Mascot
                  character="mona"
                  mood={selectedCharacter === "mona" ? "cheering" : "happy"}
                  size="xl"
                />
              </motion.div>
            </div>

            <h2 className="mb-2 text-center text-xl font-bold text-[var(--text)]">
              モナちゃん
            </h2>
            <p className="mb-6 text-center text-sm text-[var(--text-sub)]">
              わたしと一緒に
              <br />
              楽しく勉強しよう！
            </p>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect("mona")}
              disabled={isSelecting}
              className="w-full rounded-2xl bg-[var(--primary)] py-3 font-bold text-white shadow-md transition-shadow hover:shadow-lg disabled:opacity-50"
            >
              このコにする！
            </motion.button>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center text-sm text-[var(--text-muted)]"
        >
          ※後からマイページで変更できます
        </motion.p>
      </main>
    </div>
  )
}
