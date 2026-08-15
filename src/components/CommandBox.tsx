import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { parseCommand, getFallbackPrompt } from '../parser'
import { useStore } from '../store'

export default function CommandBox() {
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const startActivity = useStore((s) => s.startActivity)
  const logAction = useStore((s) => s.logAction)
  const activeActivity = useStore((s) => s.activeActivity)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const parsed = parseCommand(input)
    if (!parsed) {
      setFeedback({ type: 'error', text: getFallbackPrompt() })
      return
    }

    // If it's a quick action (food/stress), log it directly
    if (parsed.type === 'junk' || parsed.type === 'goodmeal' || parsed.type === 'stress') {
      logAction(parsed.type)
      setFeedback({ type: 'success', text: `Logged: ${parsed.label}` })
    } else if (parsed.config) {
      startActivity(parsed.config)
      setFeedback({ type: 'success', text: `Started: ${parsed.label}` })
    }

    setInput('')
    setTimeout(() => setFeedback(null), 3000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-surface border border-warm/10 p-4"
    >
      <h3 className="font-display text-lg font-semibold mb-2">Tell your Twin what you're doing</h3>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"Try: \"I'm walking 2 km at 5 km/h\" or \"I had a sugary drink\""}
          className="flex-1 px-3 py-2 rounded-lg bg-pine/60 border border-warm/10 text-sm focus:outline-none focus:border-honey/40 placeholder:text-warm/30"
          disabled={!!activeActivity}
        />
        <button
          type="submit"
          disabled={!!activeActivity}
          className="px-4 py-2 rounded-lg bg-honey text-pine font-semibold text-sm hover:bg-honey/90 transition-colors disabled:opacity-50"
        >
          Go
        </button>
      </form>

      <AnimatePresence>
        {feedback && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-2 text-xs ${feedback.type === 'success' ? 'text-mint' : 'text-coral'}`}
          >
            {feedback.text}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {['🚶 walking 2 km', '🏃 running 20 min', '🪑 sitting 1 hour', '😴 sleeping 7 hours', '🥤 sugary drink', '⚡ stressed'].map((chip) => (
          <button
            key={chip}
            onClick={() => {
              setInput(chip)
            }}
            disabled={!!activeActivity}
            className="px-2 py-1 rounded-full bg-pine/40 border border-warm/10 text-xs text-warm/70 hover:border-honey/30 transition-colors disabled:opacity-50"
          >
            {chip}
          </button>
        ))}
      </div>
    </motion.div>
  )
}