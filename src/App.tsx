import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LivingTwin from './components/LivingTwin'
import ActionPanel from './components/ActionPanel'
import ActivityPanel from './components/ActivityPanel'
import ActiveActivityTracker from './components/ActiveActivityTracker'
import CommandBox from './components/CommandBox'
import StatusPanel from './components/StatusPanel'
import Timeline from './components/Timeline'
import Coach from './components/Coach'
import HealthInsights from './components/HealthInsights'
import PreventionLab from './components/PreventionLab'
import RevealMode from './components/RevealMode'
import TimeProjection from './components/TimeProjection'
import Quiz from './components/Quiz'
import Badges from './components/Badges'
import HistoryChart from './components/HistoryChart'
import PresentationMode from './components/PresentationMode'
import { useStore } from './store'
import { BANDS, DISCLAIMER } from './data'
import type { ActionKey, Band } from './types'
import './twin.css'

const getBand = (score: number): Band => (score >= 70 ? 'high' : score >= 40 ? 'mid' : 'low')
const PRESENTATION_DONE_KEY = 'pulsetwin-presentation-completed-v1'

const hasCompletedPresentation = () => {
  try {
    return window.localStorage.getItem(PRESENTATION_DONE_KEY) === 'true'
  } catch {
    return false
  }
}

const markPresentationCompleted = () => {
  try {
    window.localStorage.setItem(PRESENTATION_DONE_KEY, 'true')
  } catch {
    // Ignore storage write failures (private mode / blocked storage)
  }
}

export default function App() {
  const syncScore = useStore((s) => s.syncScore)
  const streak = useStore((s) => s.streak)
  const awarenessPoints = useStore((s) => s.awarenessPoints)
  const history = useStore((s) => s.history)
  const logAction = useStore((s) => s.logAction)
  const reset = useStore((s) => s.reset)
  const activeActivity = useStore((s) => s.activeActivity)

  const tick = useStore((s) => s.tick)

  const [lastAction, setLastAction] = useState<ActionKey | null>(null)
  const [revealMode, setRevealMode] = useState(false)
  const [showProjection, setShowProjection] = useState(false)
  const [appMode, setAppMode] = useState<'presentation-version' | 'game'>(() =>
    hasCompletedPresentation() ? 'game' : 'presentation-version'
  )

  // Simulation tick loop — update meters every 5 seconds while an activity is active
  useEffect(() => {
    if (!activeActivity) return
    const interval = setInterval(tick, 5000)
    return () => clearInterval(interval)
  }, [activeActivity, tick])

  const band = getBand(syncScore)
  const bandInfo = BANDS[band]

  const handleAction = (key: ActionKey) => {
    logAction(key)
    setLastAction(key)
  }

  const enterGameFromPresentation = () => {
    markPresentationCompleted()
    setAppMode('game')
  }

  const openPresentationVersion = () => {
    setAppMode('presentation-version')
  }

  const actionCount = history.length

  if (appMode === 'presentation-version') {
    return <PresentationMode onExitToGame={enterGameFromPresentation} />
  }

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 py-6 sm:py-10">
      <div className="mb-4 flex justify-end">
        <button
          onClick={openPresentationVersion}
          className="px-3 py-2 rounded-lg border border-mint/40 bg-mint/10 text-mint text-xs sm:text-sm hover:bg-mint/20 transition-colors"
        >
          Presentation Version
        </button>
      </div>

      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">
            Pulse<span className="text-mint">Twin</span>
          </h1>
          <p className="text-sm text-warm/60">Your living digital twin</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-mono text-xs text-warm/50">Streak</p>
            <p className="font-mono text-lg font-semibold text-honey">🔥 {streak}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-xs text-warm/50">Awareness</p>
            <p className="font-mono text-lg font-semibold text-mint">✦ {awarenessPoints}</p>
          </div>
        </div>
      </header>

      {/* Disclaimer banner */}
      <div className="mb-6 px-4 py-2 rounded-lg bg-honey/10 border border-honey/30 text-honey text-xs text-center">
        {DISCLAIMER}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left column: The Twin */}
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-sm rounded-3xl bg-surface border border-warm/10 p-6 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-4">
              <span
                className="px-3 py-1 rounded-full text-xs font-mono font-semibold"
                style={{ color: bandInfo.color, background: `${bandInfo.color}15` }}
              >
                {bandInfo.label}
              </span>
              <span className="text-xs text-warm/60">{bandInfo.mood}</span>
            </div>

            <LivingTwin
              syncScore={syncScore}
              band={band}
              lastAction={lastAction}
              actionCount={actionCount}
              revealMode={revealMode}
              activityType={activeActivity?.config.type ?? null}
            />

            <p className="mt-4 text-sm text-warm/70 text-center">{bandInfo.description}</p>

            {/* Sync bar */}
            <div className="mt-4 w-full">
              <div className="flex justify-between text-xs font-mono text-warm/50 mb-1">
                <span>Desynced</span>
                <span>Synced</span>
              </div>
              <div className="h-2 rounded-full bg-pine overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: bandInfo.color }}
                  animate={{ width: `${syncScore}%` }}
                  transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                />
              </div>
            </div>

            {/* Toggle buttons */}
            <div className="mt-4 flex gap-2 w-full">
              <button
                onClick={() => setRevealMode(!revealMode)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  revealMode
                    ? 'bg-mint/15 border-mint/40 text-mint'
                    : 'bg-pine/40 border-warm/10 text-warm/70 hover:border-mint/40'
                }`}
              >
                {revealMode ? 'Hide Reveal' : '🔬 Reveal Mode'}
              </button>
              <button
                onClick={() => setShowProjection(!showProjection)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  showProjection
                    ? 'bg-honey/15 border-honey/40 text-honey'
                    : 'bg-pine/40 border-warm/10 text-warm/70 hover:border-honey/40'
                }`}
              >
                {showProjection ? 'Hide Projection' : '⏳ Time Projection'}
              </button>
            </div>
          </div>

          {/* Reveal + Projection panels */}
          <AnimatePresence>
            {revealMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full max-w-sm mt-4 overflow-hidden"
              >
                <RevealMode syncScore={syncScore} band={band} />
              </motion.div>
            )}
            {showProjection && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full max-w-sm mt-4 overflow-hidden"
              >
                <TimeProjection syncScore={syncScore} history={history} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right column: Actions + systems */}
        <div className="space-y-4">
          <CommandBox />

          <HealthInsights />
          <PreventionLab />
          <StatusPanel />
          <Timeline />
          <Coach />

          <div>
            <h2 className="font-display text-xl font-semibold mb-2">Quick Log</h2>
            <ActionPanel onAction={handleAction} />
          </div>

          <ActivityPanel />
          <ActiveActivityTracker />

          <Quiz />
          <HistoryChart />
          <Badges />

          <button
            onClick={reset}
            className="w-full px-4 py-2 rounded-lg border border-coral/30 text-coral text-sm hover:bg-coral/10 transition-colors"
          >
            Reset Twin
          </button>
        </div>
      </div>

      {/* Footer disclaimer */}
      <footer className="mt-10 text-center text-xs text-warm/40">
        {DISCLAIMER} · Built for the Girl Code hackathon, health-tech track.
      </footer>
    </div>
  )
}