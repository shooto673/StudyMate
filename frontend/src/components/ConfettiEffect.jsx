import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const colors = [
  "var(--primary)",
  "var(--accent)",
  "var(--english)",
  "var(--math)",
  "var(--success)",
  "var(--warning)",
]

export default function ConfettiEffect({ isActive, onComplete }) {
  const [confetti, setConfetti] = useState([])

  useEffect(() => {
    if (isActive) {
      const newConfetti = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 6 + Math.random() * 8,
        type: Math.random() > 0.5 ? "circle" : "star",
        delay: Math.random() * 0.5,
        duration: 3 + Math.random() * 2,
        sway: (Math.random() - 0.5) * 100,
      }))
      setConfetti(newConfetti)

      const timer = setTimeout(() => {
        setConfetti([])
        onComplete?.()
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [isActive, onComplete])

  return (
    <AnimatePresence>
      {confetti.length > 0 && (
        <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
          {confetti.map((item) => (
            <motion.div
              key={item.id}
              initial={{
                x: `${item.x}vw`,
                y: -20,
                rotate: 0,
                opacity: 1,
              }}
              animate={{
                y: "110vh",
                x: `calc(${item.x}vw + ${item.sway}px)`,
                rotate: 720,
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: item.duration,
                delay: item.delay,
                ease: "linear",
              }}
              style={{
                position: "absolute",
                width: item.size,
                height: item.size,
              }}
            >
              {item.type === "circle" ? (
                <div
                  className="w-full h-full rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              ) : (
                <svg viewBox="0 0 24 24" fill={item.color} className="w-full h-full">
                  <polygon points="12,2 15,9 22,9 17,14 19,22 12,17 5,22 7,14 2,9 9,9" />
                </svg>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  )
}
