import { motion } from 'framer-motion'
import { ACTIONS } from '../data'
import type { ActionKey } from '../types'

interface ActionPanelProps {
  onAction: (key: ActionKey) => void
}

export default function ActionPanel({ onAction }: ActionPanelProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {ACTIONS.map((action, i) => (
        <motion.button
          key={action.key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAction(action.key)}
          className="group flex flex-col items-start gap-1 p-3 rounded-xl bg-surface border border-warm/10 hover:border-honey/40 hover:bg-surface/80 transition-colors text-left"
          aria-label={`Log: ${action.label}`}
        >
          <span className="text-2xl">{action.emoji}</span>
          <span className="text-sm font-medium leading-tight">{action.label}</span>
          <span
            className={`font-mono text-xs font-semibold ${action.delta > 0 ? 'text-mint' : 'text-coral'}`}
          >
            {action.delta > 0 ? `+${action.delta}` : action.delta}
          </span>
        </motion.button>
      ))}
    </div>
  )
}