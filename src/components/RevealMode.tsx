import { motion } from 'framer-motion'
import { BANDS } from '../data'
import type { Band } from '../types'

interface RevealModeProps {
  syncScore: number
  band: Band
}

export default function RevealMode({ syncScore, band }: RevealModeProps) {
  const bandInfo = BANDS[band]
  // Amplitude/jaggedness scales with distance from "synced" (50)
  const distance = Math.abs(syncScore - 50) / 50
  const amplitude = 8 + distance * 22
  const jaggedness = 0.3 + distance * 0.7

  // Build a wave path whose jaggedness reflects the score
  const points: string[] = []
  const width = 100
  const height = 40
  const midY = height / 2
  const segments = 20
  for (let i = 0; i <= segments; i++) {
    const x = (i / segments) * width
    const phase = i * jaggedness * Math.PI
    const y = midY + Math.sin(phase) * amplitude * (i % 2 === 0 ? 1 : -0.6)
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`)
  }
  const wavePath = `M${points.join(' L')}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-surface border border-warm/10 p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-lg font-semibold">Reveal Mode</h3>
        <span className="font-mono text-xs px-2 py-1 rounded-full" style={{ color: bandInfo.color, background: `${bandInfo.color}15` }}>
          {bandInfo.label}
        </span>
      </div>

      <p className="text-sm text-warm/70 mb-4">
        A simplified view of the internal signal beneath the surface.
      </p>

      <div className="relative h-24 rounded-xl bg-pine/60 border border-warm/10 overflow-hidden">
        <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
          <path d={wavePath} fill="none" stroke={bandInfo.color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-pine/80 to-transparent pointer-events-none" />
      </div>

      <p className="mt-3 text-sm" style={{ color: bandInfo.color }}>
        {band === 'high'
          ? 'Calm, steady rhythm — your Twin is in sync.'
          : band === 'mid'
          ? 'A wavering signal — small choices are adding up.'
          : 'A strained, jagged rhythm — your Twin is struggling.'}
      </p>

      <p className="mt-2 text-xs text-warm/50">
        This is a simplified illustration of internal metabolic strain, not a medical reading.
      </p>
    </motion.div>
  )
}