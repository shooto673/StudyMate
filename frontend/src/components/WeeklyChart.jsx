import { motion } from "framer-motion"

export function WeeklyChart({ data = [] }) {
  if (!data.length) return null

  const maxCount = Math.max(...data.map((d) => d.count), 1)

  return (
    <div className="flex items-end gap-2" style={{ height: 140 }}>
      {data.map((d, i) => {
        const barHeight = d.count > 0 ? Math.max((d.count / maxCount) * 100, 8) : 4
        const isToday = i === data.length - 1

        return (
          <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
            {/* Count label */}
            <span className="text-xs font-medium text-[var(--text-sub)]">
              {d.count > 0 ? d.count : ""}
            </span>

            {/* Bar */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: barHeight }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
              className={`w-full rounded-t-lg ${
                d.count === 0
                  ? "bg-[var(--bg-sub)]"
                  : isToday
                    ? "bg-[var(--primary)]"
                    : "bg-[var(--primary-light)]"
              }`}
              style={{ minWidth: 24 }}
            />

            {/* Day label */}
            <span className={`text-xs ${isToday ? "font-bold text-[var(--primary)]" : "text-[var(--text-muted)]"}`}>
              {d.dayLabel}
            </span>

            {/* Accuracy */}
            {d.count > 0 && (
              <span className="text-[10px] text-[var(--text-muted)]">{d.accuracy}%</span>
            )}
          </div>
        )
      })}
    </div>
  )
}
