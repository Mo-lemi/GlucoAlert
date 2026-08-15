import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'

const TIPS = [
  'Movement helps your muscles use glucose — that\'s why your Twin brightens when you move.',
  'Long sitting creates a low-energy drift. A simple standing break resets the rhythm.',
  'Sugary spikes are followed by recovery dips. Your Twin shows the whole curve, not just the high.',
  'Sleep restores metabolic resilience — your Twin recovers fastest while resting.',
  'Stress raises cortisol-like strain, making every other choice feel heavier.',
  'Small consistent choices compound. The Twin\'s posture reflects the pattern, not one day.',
]

export default function Coach() {
  const activeActivity = useStore((s) => s.activeActivity)
  const mood = useStore((s) => s.mood)
  const syncScore = useStore((s) => s.syncScore)
  const glucoseStrain = useStore((s) => s.glucoseStrain)

  let message = ''
  if (activeActivity) {
    const def = activeActivity.config
    if (def.type === 'walk' || def.type === 'run') {
      message = def.type === 'run'
        ? 'You\'re moving your body — this helps reduce glucose strain and builds resilience.'
        : 'A steady walk improves insulin sensitivity and clears the signal.'
    } else if (def.type === 'sit') {
      message = 'Long sitting is creating a low-energy drift — try a standing break soon.'
    } else if (def.type === 'sleep') {
      message = 'Sleep is restoring your resilience and calming the strain.'
    } else if (def.type === 'exercise') {
      message = 'Energetic movement! This raises your resilience and lowers strain.'
    } else if (def.type === 'stand') {
      message = 'Standing breaks the sedentary pattern — a small win for your rhythm.'
    }
  } else if (glucoseStrain > 60) {
    message = 'Your Twin\'s glucose signal is strained — movement and rest will help settle it.'
  } else if (syncScore >= 70) {
    message = 'Your Twin is in sync — bright, upright, steady. Keep this rhythm going.'
  } else if (mood === 'strained') {
    message = 'Your Twin feels strained. A walk, a healthy meal, or sleep can restore balance.'
  } else if (mood === 'exhausted') {
    message = 'Your Twin is exhausted — sleep is the fastest way to rebuild resilience.'
  } else {
    message = TIPS[Math.floor(Date.now() / 15000) % TIPS.length]
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-surface border border-warm/10 p-4"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0">💬</span>
        <div>
          <p className="text-sm font-display font-semibold mb-1">Your Twin</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={message}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-sm text-warm/80 italic"
            >
              "{message}"
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}