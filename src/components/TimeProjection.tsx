import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { BANDS } from '../data'
import type { ActionLogEntry, Band } from '../types'

interface TimeProjectionProps {
  syncScore: number
  history: ActionLogEntry[]
}

const getBand = (score: number): Band => (score >= 70 ? 'high' : score >= 40 ? 'mid' : 'low')

export default function TimeProjection({ syncScore, history }: TimeProjectionProps) {
  const [years, setYears] = useState(0)

  const projection = useMemo(() => {
    // Average delta from recent history (last 20 entries)
    const recent = history.slice(-20)
    let avgDelta = 0
    if (recent.length > 0) {
      avgDelta = recent.reduce((sum, e) => sum + e.delta, 0) / recent.length
    }

    // Project: each "year" compounds the average delta, with decay toward 50
    const projectedScore = Math.max(0, Math.min(100, syncScore + avgDelta * years * 0.8))
    const projectedBand = getBand(projectedScore)
    return { projectedScore, projectedBand, avgDelta }
  }, [syncScore, history, years])

  const bandInfo = BANDS[projection.projectedBand]

  const narrative =
    projection.projectedBand === 'high'
      ? 'If this trajectory holds, your Twin stays bright and steady — resilient, energetic, in sync.'
      : projection.projectedBand === 'mid'
      ? 'If this trajectory holds, your Twin drifts — wavering between okay and strained, small choices compounding.'
      : 'If this trajectory holds, your Twin struggles — a strained, jagged internal rhythm that the body may not show for years.'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-surface border border-warm/10 p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-lg font-semibold">Time Projection</h3>
        <span className="font-mono text-xs px-2 py-1 rounded-full bg-honey/15 text-honey">
          {years} {years === 1 ? 'year' : 'years'} ahead
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={years}
        onChange={(e) => setYears(Number(e.target.value))}
        className="w-full"
        aria-label="Projection years ahead"
      />

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-warm/50 font-mono">Projected Sync Score</p>
          <p className="font-mono text-3xl font-semibold" style={{ color: bandInfo.color }}>
            {Math.round(projection.projectedScore)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-warm/50 font-mono">Current</p>
          <p className="font-mono text-xl text-warm/80">{syncScore}</p>
        </div>
      </div>

      <p className="mt-3 text-sm" style={{ color: bandInfo.color }}>
        {bandInfo.label} — {narrative}
      </p>

      <p className="mt-3 text-xs text-warm/50 border-t border-warm/10 pt-3">
        ⚠️ Illustrative simulation only. This projection is not a medical prediction or diagnosis. Real health outcomes depend on many factors.
      </p>
    </motion.div>
  )
}