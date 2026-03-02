import { motion } from "framer-motion"

const sizeMap = {
  sm: 48,
  md: 80,
  lg: 150,
  xl: 200,
}

const mascotImages = {
  normal: "/mascots/mascot-normal.png",
  happy: "/mascots/mascot-happy.png",
  thinking: "/mascots/mascot-thinking.png",
  sad: "/mascots/mascot-sad.png",
  cheering: "/mascots/mascot-cheering.png",
  surprised: "/mascots/mascot-surprised.png",
  studying: "/mascots/mascot-studying.png",
  sleeping: "/mascots/mascot-sleeping.png",
}

const monaImages = {
  normal: "/mascots/mona-normal.png",
  happy: "/mascots/mona-happy.png",
  thinking: "/mascots/mona-thinking.png",
  sad: "/mascots/mona-sad.png",
  cheering: "/mascots/mona-cheering.png",
  surprised: "/mascots/mona-surprised.png",
  studying: "/mascots/mona-studying.png",
  sleeping: "/mascots/mona-sleeping.png",
}

export function Mascot({
  mood = "normal",
  size = "md",
  character = "mascot",
  message,
  className = "",
  animate = true,
}) {
  const pixelSize = sizeMap[size]
  const imageUrl = character === "mona" ? monaImages[mood] : mascotImages[mood]

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-2 rounded-2xl bg-white px-4 py-2 text-sm font-medium text-[var(--text)] shadow-[var(--card-shadow)]"
          style={{ maxWidth: pixelSize * 2.5 }}
        >
          <span className="text-balance text-center block">{message}</span>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
        </motion.div>
      )}
      <motion.div
        className={animate ? "animate-float" : ""}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <img
          src={imageUrl}
          alt={character === "mona" ? "モナちゃん" : "テイラーくん"}
          width={pixelSize}
          height={pixelSize}
          className="object-contain"
          style={{ width: pixelSize, height: pixelSize }}
        />
      </motion.div>
    </div>
  )
}

export function MascotWithGlow({
  mood = "normal",
  size = "md",
  character = "mascot",
  message,
  className = "",
}) {
  const pixelSize = sizeMap[size]
  const imageUrl = character === "mona" ? monaImages[mood] : mascotImages[mood]

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-2 rounded-2xl bg-white px-4 py-2 text-sm font-medium text-[var(--text)] shadow-[var(--card-shadow)]"
          style={{ maxWidth: pixelSize * 2.5 }}
        >
          <span className="text-balance text-center block">{message}</span>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
        </motion.div>
      )}
      <motion.div
        className="animate-float animate-pulse-glow rounded-full"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <img
          src={imageUrl}
          alt={character === "mona" ? "モナちゃん" : "テイラーくん"}
          width={pixelSize}
          height={pixelSize}
          className="object-contain"
          style={{ width: pixelSize, height: pixelSize }}
        />
      </motion.div>
    </div>
  )
}
