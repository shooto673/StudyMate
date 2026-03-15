import { useState } from "react"
import { motion } from "framer-motion"

const sizeMap = {
  sm: 48,
  md: 80,
  lg: 150,
  xl: 200,
}

// マスコット画像URL（テイラーくん = 青いフクロウ）- Vercel Blob Storage
const mascotImages = {
  normal: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mascot-normal-zHA2YhnWzdOV5BaLZ4fT0ZHUiohuZj.png",
  happy: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mascot-happy-61pJhWsxZsJi2rk15e9rKdNpVVcgZU.png",
  thinking: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mascot-thinking-erHP2UdAWqQEVSjr1qnbxLfb7Bb0nW.png",
  sad: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mascot-sad-dXKaF861OKC9OSsKIIhm8jA6fcn3WR.png",
  cheering: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mascot-cheering-ivILw93kIpMG1waHwgXtCsbXTAKEWp.png",
  surprised: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mascot-surprised-j8wO7EW41MAhvr9xP1WGxFmiT9KkSm.png",
  studying: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mascot-studying-70O9QCZWYVCTHVPiz48G6YvPAKswzj.png",
  sleeping: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mascot-sleeping-f0YfoRFqP0bSzMvPJESLspUCzDJGXd.png",
}

// モナちゃん画像URL（ピンクの子猫）- Vercel Blob Storage
const monaImages = {
  normal: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kitten_girl_simple_book-wcC0BU13oDXLi9FWCoBDxZy5e5xUZ8.png",
  happy: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mascot-happy.png-QinTrVAAteHHIhiAirVVIIDQszDZsk.webp",
  thinking: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mascot-thinking.png-8HViM0XrUXyqUuMr90503Uj00xeg6D.webp",
  sad: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mascot-sad.png-jEliy5t7z3WWP5apDbfwmVDAhayjVR.webp",
  cheering: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mascot-cheering.png-tPKBDhtrJdyXD4TPP9Gw4TcT1nbxhQ.webp",
  surprised: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mascot-surprised.png-6rnGN8jO9ohfppovfXsRerVbVuUGT0.webp",
  studying: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mascot-studying.png-XzAMCy7pXUVen3CCq0txteB2Ax7rbU.webp",
  sleeping: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mascot-sleeping.png-umEDL8GornguPki7gqTR3b257SODan.webp",
}

const moodEmojis = {
  normal: "😊",
  happy: "😄",
  thinking: "🤔",
  sad: "😢",
  cheering: "🎉",
  surprised: "😲",
  studying: "📖",
  sleeping: "😴",
}

function MonaFallback({ size, mood }) {
  const pixelSize = sizeMap[size]
  const emoji = moodEmojis[mood] || "😊"
  const emojiSize = Math.max(pixelSize * 0.4, 20)

  return (
    <div
      className="flex flex-col items-center justify-center rounded-full"
      style={{
        width: pixelSize,
        height: pixelSize,
        background: "linear-gradient(135deg, #FF6B9D, #C084FC)",
        boxShadow: "0 4px 20px rgba(255, 107, 157, 0.3)",
      }}
    >
      <span style={{ fontSize: emojiSize }} role="img" aria-label={mood}>{emoji}</span>
      <span
        className="font-bold text-white"
        style={{ fontSize: Math.max(pixelSize * 0.1, 8), marginTop: 2 }}
      >
        モナ
      </span>
    </div>
  )
}

function MascotImage({ character, mood, size, imageUrl }) {
  const [hasError, setHasError] = useState(false)
  const pixelSize = sizeMap[size]

  if (character === "mona" && hasError) {
    return <MonaFallback size={size} mood={mood} />
  }

  return (
    <img
      src={imageUrl}
      alt={character === "mona" ? "モナちゃん" : "テイラーくん"}
      width={pixelSize}
      height={pixelSize}
      className="object-contain"
      style={{ width: pixelSize, height: pixelSize }}
      onError={() => setHasError(true)}
    />
  )
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
        <MascotImage character={character} mood={mood} size={size} imageUrl={imageUrl} />
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
        <MascotImage character={character} mood={mood} size={size} imageUrl={imageUrl} />
      </motion.div>
    </div>
  )
}
