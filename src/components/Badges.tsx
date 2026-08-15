import { motion } from 'framer-motion'
import { BADGES } from '../data'
import { useStore } from '../store'

export default function Badges() {
  const unlockedBadges = useStore((s) => s.unlockedBadges)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-surface border border-warm/10 p-4"
    >
      <h3 className="font-display text-lg font-semibold mb-3">Badges</h3>
      <div className="flex flex-wrap gap-2">
        {BADGES.map((badge) => {
          const unlocked = unlockedBadges.includes(badge.id)
          return (
            <div
              key={badge.id}
              title={badge.description}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                unlocked
                  ? 'bg-honey/15 border-honey/40 text-honey'
                  : 'bg-pine/40 border-warm/10 text-warm/40'
              }`}
            >
              {unlocked ? '🏅' : '🔒'} {badge.label}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}