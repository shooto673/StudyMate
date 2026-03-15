"use client"

import { motion } from "framer-motion"

const shapes = [
  { type: "star", color: "#FCC419", size: 20, x: "10%", y: "20%", delay: 0 },
  { type: "circle", color: "#4DABF7", size: 16, x: "85%", y: "15%", delay: 0.5 },
  { type: "triangle", color: "#FF922B", size: 18, x: "75%", y: "60%", delay: 1 },
  { type: "star", color: "#6C63FF", size: 24, x: "5%", y: "70%", delay: 1.5 },
  { type: "circle", color: "#51CF66", size: 14, x: "90%", y: "80%", delay: 2 },
  { type: "triangle", color: "#FF6B6B", size: 16, x: "15%", y: "85%", delay: 2.5 },
  { type: "star", color: "#4DABF7", size: 18, x: "60%", y: "10%", delay: 0.8 },
  { type: "circle", color: "#FCC419", size: 12, x: "30%", y: "30%", delay: 1.2 },
]

function Star({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

function Circle({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <circle cx="12" cy="12" r="10" />
    </svg>
  )
}

function Triangle({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2L2 22h20L12 2z" />
    </svg>
  )
}

export function FloatingDecorations() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{ left: shape.x, top: shape.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 0.3,
            scale: 1,
            y: [0, -15, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            opacity: { duration: 0.5, delay: shape.delay },
            scale: { duration: 0.5, delay: shape.delay },
            y: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: shape.delay,
            },
            rotate: {
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: shape.delay,
            },
          }}
        >
          {shape.type === "star" && <Star color={shape.color} size={shape.size} />}
          {shape.type === "circle" && <Circle color={shape.color} size={shape.size} />}
          {shape.type === "triangle" && <Triangle color={shape.color} size={shape.size} />}
        </motion.div>
      ))}
    </div>
  )
}
