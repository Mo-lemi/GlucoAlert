import { motion } from 'framer-motion'
import { useStore } from '../store'
import type { Mood } from '../types'

const MOOD_COLORS: Record<Mood, { color: string; label: string; emoji: string }> = {
  calm: { color: '#6FE7C0', label: 'Calm', emoji: '😌' },
  steady: { color: '#F2A93B', label: 'Steady', emoji: '🙂' },
  strained: { color: '#F2705C', label: 'Strained', emoji: '😟' },
  exhausted: { color: '#C4503F', label: 'Exhausted', emoji: '😩' },
}

interface MeterProps {
  label: string
  value: number
  color: string
}

function Meter({ label, value, color }: MeterProps) {
  return (
    <div>
      <div className="flex justify-between text-xs font-mono text-warm/60 mb-1">
        <span>{label}</span>
        <span>{Math.round(value)}</span>
      </div>
      <div className="h-1.5 rounded-full bg-pine overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  )
}

export default function StatusPanel() {
  const energy = useStore((s) => s.energy)
  const stress = useStore((s) => s.stress)
  const glucoseStrain = useStore((s) => s.glucoseStrain)
  const resilience = useStore((s) => s.resilience)
  const mood = useStore((s) => s.mood)

  const moodInfo = MOOD_COLORS[mood]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-surface border border-warm/10 p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-lg font-semibold">Live Status</h3>
        <span
          className="px-3 py-1 rounded-full text-xs font-mono font-semibold"
          style={{ color: moodInfo.color, background: `${moodInfo.color}15` }}
        >
          {moodInfo.emoji} {moodInfo.label}
        </span>
      </div>

      <div className="space-y-3">
        <Meter label="Energy" value={energy} color="#F2A93B" />
        <Meter label="Stress" value={stress} color="#F2705C" />
        <Meter label="Glucose Strain" value={glucoseStrain} color="#C4503F" />
        <Meter label="Resilience" value={resilience} color="#6FE7C0" />
      </div>
    </motion.div>
  )
}