import { motion } from 'framer-motion'
import { useStore } from '../store'

export default function Timeline() {
  const timeline = useStore((s) => s.timeline)

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-surface border border-warm/10 p-4"
    >
      <h3 className="font-display text-lg font-semibold mb-3">Daily Timeline</h3>

      {timeline.length === 0 ? (
        <p className="text-sm text-warm/50 py-4 text-center">
          Your day's story will appear here as you guide your Twin.
        </p>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {[...timeline].reverse().map((entry) => (
            <div key={entry.id} className="flex items-center gap-3 text-sm">
              <span className="font-mono text-xs text-warm/40 shrink-0 w-12">{formatTime(entry.timestamp)}</span>
              <span className="text-base">{entry.emoji}</span>
              <span className="text-warm/80">{entry.label}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}