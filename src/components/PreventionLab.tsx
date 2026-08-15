import { motion } from 'framer-motion'
import { useStore } from '../store'
import type { ActionKey } from '../types'

type Intervention = {
  key: ActionKey
  label: string
  reason: string
  expected: string
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const INTERVENTIONS: Intervention[] = [
  {
    key: 'exercise',
    label: '10-20 min movement burst',
    reason: 'Movement helps muscles absorb glucose with less insulin demand.',
    expected: 'Expected: lower strain, better resilience.',
  },
  {
    key: 'goodmeal',
    label: 'Fiber-forward meal swap',
    reason: 'Balanced meals can reduce spike amplitude and post-meal crashes.',
    expected: 'Expected: smoother energy and lower strain volatility.',
  },
  {
    key: 'sleep',
    label: 'Recovery sleep block',
    reason: 'Sleep helps regulate stress signaling and glucose metabolism.',
    expected: 'Expected: stress reset and resilience gain.',
  },
]

export default function PreventionLab() {
  const logAction = useStore((s) => s.logAction)
  const syncScore = useStore((s) => s.syncScore)
  const glucoseStrain = useStore((s) => s.glucoseStrain)
  const resilience = useStore((s) => s.resilience)
  const energy = useStore((s) => s.energy)
  const stress = useStore((s) => s.stress)
  const streak = useStore((s) => s.streak)
  const history = useStore((s) => s.history)

  const protectiveScore = Math.round((resilience + energy + (100 - stress)) / 3)
  const riskIndex = clamp(Math.round(glucoseStrain * 0.55 + (100 - protectiveScore) * 0.45), 0, 100)

  const insulinSensitivityIndex = clamp(
    Math.round((100 - glucoseStrain) * 0.55 + resilience * 0.25 + (100 - stress) * 0.2),
    0,
    100
  )

  const lastEight = history.slice(-8)
  const volatility =
    lastEight.length === 0
      ? 0
      : Math.round(lastEight.reduce((sum, item) => sum + Math.abs(item.delta), 0) / lastEight.length)

  const projectedA1c = (5 + riskIndex * 0.019).toFixed(1)

  const recentKeys = new Set(history.slice(-12).map((entry) => entry.actionKey))
  const positiveRecentCount = history.slice(-12).filter((entry) => entry.delta > 0).length

  const missionOneDone = recentKeys.has('goodmeal') && recentKeys.has('exercise')
  const missionTwoDone = stress <= 45 && recentKeys.has('sleep')
  const missionThreeDone = streak >= 3 || positiveRecentCount >= 6

  const scoreBand =
    riskIndex >= 70
      ? { label: 'High Watch', color: '#F2705C' }
      : riskIndex >= 40
      ? { label: 'Moderate Watch', color: '#F2A93B' }
      : { label: 'Protective Track', color: '#6FE7C0' }

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-surface border border-warm/10 p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-lg font-semibold">Prevention Lab</h3>
        <span
          className="px-3 py-1 rounded-full text-xs font-mono font-semibold"
          style={{ color: scoreBand.color, background: `${scoreBand.color}18` }}
        >
          {scoreBand.label}
        </span>
      </div>

      <p className="text-xs text-warm/60 mb-4">
        Advanced educational simulator: tracks risk trajectory, response quality, and habit consistency.
      </p>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="rounded-lg bg-pine/45 border border-warm/10 p-3">
          <p className="text-[10px] font-mono text-warm/50">Insulin Sensitivity Index*</p>
          <p className="font-mono text-2xl text-mint font-semibold">{insulinSensitivityIndex}</p>
        </div>
        <div className="rounded-lg bg-pine/45 border border-warm/10 p-3">
          <p className="text-[10px] font-mono text-warm/50">Risk Volatility*</p>
          <p className="font-mono text-2xl text-honey font-semibold">{volatility}</p>
        </div>
        <div className="rounded-lg bg-pine/45 border border-warm/10 p-3">
          <p className="text-[10px] font-mono text-warm/50">Sync Momentum</p>
          <p className="font-mono text-2xl text-warm font-semibold">{syncScore}</p>
        </div>
        <div className="rounded-lg bg-pine/45 border border-warm/10 p-3">
          <p className="text-[10px] font-mono text-warm/50">A1c Trajectory*</p>
          <p className="font-mono text-2xl text-coral font-semibold">{projectedA1c}%</p>
        </div>
      </div>

      <div className="rounded-xl border border-mint/20 bg-mint/5 p-3 mb-4">
        <p className="text-xs font-mono text-mint mb-2">Actionable Intervention Queue</p>
        <div className="space-y-2">
          {INTERVENTIONS.map((item) => (
            <div key={item.key} className="rounded-lg border border-warm/10 bg-pine/45 p-2.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-warm/90">{item.label}</p>
                <button
                  onClick={() => logAction(item.key)}
                  className="px-2.5 py-1 rounded-md text-xs font-mono border border-honey/40 text-honey hover:bg-honey/15 transition-colors"
                >
                  Simulate
                </button>
              </div>
              <p className="text-xs text-warm/60 mt-1">{item.reason}</p>
              <p className="text-[11px] text-mint mt-1">{item.expected}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-warm/10 bg-pine/50 p-3">
        <p className="text-xs font-mono text-warm/60 mb-2">Prevention Missions</p>
        <div className="space-y-2 text-sm">
          <p className={missionOneDone ? 'text-mint' : 'text-warm/75'}>
            {missionOneDone ? '✓' : '○'} Pair movement + balanced meal in one cycle.
          </p>
          <p className={missionTwoDone ? 'text-mint' : 'text-warm/75'}>
            {missionTwoDone ? '✓' : '○'} Trigger stress recovery (stress ≤ 45 + sleep logged).
          </p>
          <p className={missionThreeDone ? 'text-mint' : 'text-warm/75'}>
            {missionThreeDone ? '✓' : '○'} Build consistency loop (3-day streak or 6 positive logs).
          </p>
        </div>
      </div>

      <p className="mt-3 text-[10px] text-warm/45">
        *All advanced metrics are illustrative gameplay signals for diabetes prevention education, not clinical measurements.
      </p>
    </motion.section>
  )
}
