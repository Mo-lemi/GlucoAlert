import { motion } from 'framer-motion'
import { useStore } from '../store'
import { CONCEPT_CARDS } from '../concepts'

export default function HealthInsights() {
  const glucoseStrain = useStore((s) => s.glucoseStrain)
  const resilience = useStore((s) => s.resilience)
  const energy = useStore((s) => s.energy)
  const stress = useStore((s) => s.stress)
  const learnedConcepts = useStore((s) => s.learnedConcepts)

  // Composite metabolic risk estimate (illustrative, educational)
  const strainScore = glucoseStrain
  const protectiveScore = Math.round((resilience + energy + (100 - stress)) / 3)
  const riskIndex = Math.max(0, Math.min(100, Math.round(strainScore * 0.55 + (100 - protectiveScore) * 0.45)))

  const riskLabel =
    riskIndex >= 70 ? 'Elevated pattern' : riskIndex >= 40 ? 'Building pattern' : 'Protected pattern'
  const riskColor = riskIndex >= 70 ? '#F2705C' : riskIndex >= 40 ? '#F2A93B' : '#6FE7C0'
  const riskDetail =
    riskIndex >= 70
      ? 'This pattern mirrors the silent build-up of insulin resistance — the body often shows no symptoms for years.'
      : riskIndex >= 40
      ? 'Small daily choices are adding up. The good news: lifestyle change can cut risk by more than half.'
      : 'Your pattern is protective — movement, nutrition, sleep, and low stress are compounding in your favor.'

  const unlockedCards = CONCEPT_CARDS.filter((c) => learnedConcepts.includes(c.id))
  const progress = Math.round((learnedConcepts.length / CONCEPT_CARDS.length) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-surface border border-warm/10 p-4"
    >
      <h3 className="font-display text-lg font-semibold mb-3">Health Insights</h3>

      {/* Risk meter */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-mono text-warm/60">Illustrative metabolic pattern</span>
          <span className="text-xs font-mono font-semibold" style={{ color: riskColor }}>
            {riskLabel} · {riskIndex}
          </span>
        </div>
        <div className="h-2 rounded-full bg-pine overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: riskColor }}
            animate={{ width: `${riskIndex}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
        <p className="mt-2 text-xs text-warm/60">{riskDetail}</p>
      </div>

      {/* Key markers */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
        <div className="rounded-lg bg-pine/40 border border-warm/10 p-2">
          <p className="font-mono text-lg font-semibold text-coral">{Math.round(glucoseStrain)}</p>
          <p className="text-[10px] text-warm/50 font-mono">Glucose Strain</p>
        </div>
        <div className="rounded-lg bg-pine/40 border border-warm/10 p-2">
          <p className="font-mono text-lg font-semibold text-mint">{Math.round(resilience)}</p>
          <p className="text-[10px] text-warm/50 font-mono">Resilience</p>
        </div>
        <div className="rounded-lg bg-pine/40 border border-warm/10 p-2">
          <p className="font-mono text-lg font-semibold text-honey">{Math.round(energy)}</p>
          <p className="text-[10px] text-warm/50 font-mono">Energy</p>
        </div>
      </div>

      {/* Evidence insights progress */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-mono text-warm/60">Evidence insights unlocked</span>
          <span className="text-xs font-mono text-mint">{learnedConcepts.length}/{CONCEPT_CARDS.length}</span>
        </div>
        <div className="h-1.5 rounded-full bg-pine overflow-hidden">
          <div className="h-full rounded-full bg-mint" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Unlocked concept cards */}
      {unlockedCards.length > 0 ? (
        <div className="space-y-2">
          {unlockedCards.map((card) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-lg bg-pine/50 border border-mint/20 p-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{card.emoji}</span>
                <span className="text-sm font-semibold">{card.title}</span>
              </div>
              <p className="text-xs font-mono text-mint mb-1">{card.stat}</p>
              <p className="text-xs text-warm/70">{card.fact}</p>
              <p className="mt-1 text-[10px] text-warm/40 font-mono">Source: {card.source}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-warm/50">
          Log actions to unlock evidence-backed insights — every choice teaches a real-world concept.
        </p>
      )}
    </motion.div>
  )
}