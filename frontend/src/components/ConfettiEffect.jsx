import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const colors = ["#FF6B6B", "#4DABF7", "#51CF66", "#FCC419", "#6C63FF", "#FF922B"]

export function ConfettiEffect({ isActive, onComplete }) {
  const [pieces, setPieces] = useState([])

  useEffect(() => {
    if (isActive) {
      const newPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        rotation: Math.random() * 360,
        size: Math.random() * 8 + 6,
      }))
      setPieces(newPieces)

      const timer = setTimeout(() => {
        setPieces([])
        onComplete?.()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isActive, onComplete])

  return (
    <AnimatePresence>
      {pieces.length > 0 && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              className="absolute rounded-sm"
              style={{
                left: `${piece.x}%`,
                top: -20,
                width: piece.size,
                height: piece.size * 0.6,
                backgroundColor: piece.color,
              }}
              initial={{
                y: -20,
                rotate: piece.rotation,
                opacity: 1,
              }}
              animate={{
                y: "100vh",
                rotate: piece.rotation + 720,
                opacity: 0,
              }}
              transition={{
                duration: 2.5,
                delay: piece.delay,
                ease: "easeIn",
              }}
              exit={{ opacity: 0 }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  )
}
