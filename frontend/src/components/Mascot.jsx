import { motion } from "framer-motion"

const moodImages = {
  normal: "/mascots/mascot-normal.png",
  happy: "/mascots/mascot-happy.png",
  thinking: "/mascots/mascot-thinking.png",
  sad: "/mascots/mascot-sad.png",
  cheering: "/mascots/mascot-cheering.png",
  surprised: "/mascots/mascot-surprised.png",
  studying: "/mascots/mascot-studying.png",
  sleeping: "/mascots/mascot-sleeping.png",
}

const sizeMap = {
  sm: 48,
  md: 80,
  lg: 150,
  xl: 200,
}

export function Mascot({ mood = "normal", size = "md", message, className = "" }) {
  const imageSize = sizeMap[size]

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <motion.div
        className="relative animate-float animate-pulse-glow"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, type: "spring" }}
      >
        <img
          src={moodImages[mood]}
          alt="StudyMateくん"
          className="object-contain"
          style={{ width: imageSize, height: imageSize }}
        />
      </motion.div>

      {message && (
        <motion.div
          className="relative bg-white rounded-2xl px-4 py-3 shadow-md max-w-[200px]"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3, type: "spring", stiffness: 300 }}
        >
          <div className="absolute left-0 top-1/2 -translate-x-2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white" />
          <p className="text-sm text-[var(--text)] font-medium leading-relaxed">{message}</p>
        </motion.div>
      )}
    </div>
  )
}
