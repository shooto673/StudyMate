export default function ProgressRing({ value }) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0))
  const radius = 23
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (safeValue / 100) * circumference

  return (
    <div className="progress-ring">
      <svg viewBox="0 0 52 52" aria-hidden="true">
        <circle className="bg" cx="26" cy="26" r={radius} />
        <circle
          className="fg"
          cx="26"
          cy="26"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span>{safeValue}%</span>
    </div>
  )
}
