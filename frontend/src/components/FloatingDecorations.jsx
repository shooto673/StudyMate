import { useEffect, useState } from "react"

const colors = [
  "var(--primary)",
  "var(--english)",
  "var(--math)",
  "var(--accent)",
]

export function FloatingDecorations() {
  const [shapes, setShapes] = useState([])

  useEffect(() => {
    const generatedShapes = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      type: ["circle", "triangle", "square", "star"][Math.floor(Math.random() * 4)],
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 20 + Math.random() * 40,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 15 + Math.random() * 10,
      delay: Math.random() * 5,
    }))
    setShapes(generatedShapes)
  }, [])

  const renderShape = (shape) => {
    const baseStyle = {
      position: "absolute",
      left: `${shape.left}%`,
      top: `${shape.top}%`,
      width: shape.size,
      height: shape.size,
      opacity: 0.04,
      animation: `float-shape ${shape.duration}s ease-in-out infinite`,
      animationDelay: `${shape.delay}s`,
    }

    switch (shape.type) {
      case "circle":
        return (
          <div
            key={shape.id}
            style={{
              ...baseStyle,
              borderRadius: "50%",
              backgroundColor: shape.color,
            }}
          />
        )
      case "square":
        return (
          <div
            key={shape.id}
            style={{
              ...baseStyle,
              borderRadius: "4px",
              backgroundColor: shape.color,
            }}
          />
        )
      case "triangle":
        return (
          <div
            key={shape.id}
            style={{
              ...baseStyle,
              width: 0,
              height: 0,
              borderLeft: `${shape.size / 2}px solid transparent`,
              borderRight: `${shape.size / 2}px solid transparent`,
              borderBottom: `${shape.size}px solid ${shape.color}`,
              backgroundColor: "transparent",
            }}
          />
        )
      case "star":
        return (
          <svg
            key={shape.id}
            style={baseStyle}
            viewBox="0 0 24 24"
            fill={shape.color}
          >
            <polygon points="12,2 15,9 22,9 17,14 19,22 12,17 5,22 7,14 2,9 9,9" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {shapes.map(renderShape)}
    </div>
  )
}
