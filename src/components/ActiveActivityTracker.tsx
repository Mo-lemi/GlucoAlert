import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ACTIVITY_DEFS } from '../activity'
import { useStore } from '../store'

export default function ActiveActivityTracker() {
  const activeActivity = useStore((s) => s.activeActivity)
  const completeActivity = useStore((s) => s.completeActivity)
  const cancelActivity = useStore((s) => s.cancelActivity)

  const [elapsedMs, setElapsedMs] = useState(0)
  const completedRef = useRef(false)

  useEffect(() => {
    if (!activeActivity) return
    completedRef.current = false
    setElapsedMs(0)

    const interval = setInterval(() => {
      const elapsed = Date.now() - activeActivity.startedAt
      setElapsedMs(elapsed)
      if (elapsed >= activeActivity.totalDurationMs && !completedRef.current) {
        completedRef.current = true
        clearInterval(interval)
        completeActivity()
      }
    }, 100)

    return () => clearInterval(interval)
  }, [activeActivity, completeActivity])

  if (!activeActivity) return null

  const def = ACTIVITY_DEFS.find((d) => d.type === activeActivity.config.type)!
  const progress = Math.min(1, elapsedMs / activeActivity.totalDurationMs)
  const remainingMs = Math.max(0, activeActivity.totalDurationMs - elapsedMs)
  const remainingMin = Math.ceil(remainingMs / 60000)

  // Distance progress for walk/run
  const distanceKm = activeActivity.config.distanceKm
  const distanceProgress = distanceKm ? distanceKm * progress : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-surface border border-honey/30 p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-lg font-semibold">
          {def.emoji} {def.label} with your Twin
        </h3>
        <span className="font-mono text-xs text-honey">{Math.round(progress * 100)}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-3 rounded-full bg-pine overflow-hidden mb-3">
        <motion.div
          className="h-full rounded-full bg-honey"
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <div className="flex justify-between text-sm font-mono text-warm/70 mb-3">
        <span>⏱ {remainingMin} min left</span>
        {distanceProgress !== null && <span>📍 {distanceProgress.toFixed(2)} / {distanceKm} km</span>}
        {activeActivity.config.reps && (
          <span>🔁 {Math.round(activeActivity.config.reps * progress)} / {activeActivity.config.reps} reps</span>
        )}
      </div>

      <p className="text-sm text-warm/70 mb-3">
        Your Twin is {def.type === 'walk' ? 'walking' : def.type === 'run' ? 'running' : def.type === 'sit' ? 'sitting' : def.type === 'sleep' ? 'sleeping' : def.type === 'exercise' ? 'exercising' : 'standing'} alongside you. Keep going!
      </p>

      <button
        onClick={cancelActivity}
        className="w-full px-4 py-2 rounded-lg border border-coral/30 text-coral text-sm hover:bg-coral/10 transition-colors"
      >
        Cancel activity
      </button>
    </motion.div>
  )
}