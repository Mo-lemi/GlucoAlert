import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import LivingTwin from './LivingTwin'
import RevealMode from './RevealMode'
import TimeProjection from './TimeProjection'
import { STORY_SCENES } from '../presentation'
import type { ActionLogEntry, ActionKey, Band } from '../types'
import type { ActivityType } from '../activity'

interface PresentationModeProps {
  onExitToGame: () => void
}

const AUTO_ADVANCE_MS = 7200

type StoryVisualization = {
  score: number
  lastAction: ActionKey | null
  activityType: ActivityType | null
  revealMode: boolean
  showProjection: boolean
}

const getBand = (score: number): Band => (score >= 70 ? 'high' : score >= 40 ? 'mid' : 'low')

const getVisualization = (highlight?: string): StoryVisualization => {
  switch (highlight) {
    case 'walk':
      return { score: 74, lastAction: 'exercise', activityType: 'walk', revealMode: false, showProjection: false }
    case 'sit':
      return { score: 42, lastAction: 'sedentary', activityType: 'sit', revealMode: false, showProjection: false }
    case 'sugar':
      return { score: 30, lastAction: 'junk', activityType: null, revealMode: false, showProjection: false }
    case 'reveal':
      return { score: 36, lastAction: null, activityType: null, revealMode: true, showProjection: false }
    case 'projection':
      return { score: 40, lastAction: null, activityType: null, revealMode: false, showProjection: true }
    case 'evidence':
      return { score: 63, lastAction: 'goodmeal', activityType: 'stand', revealMode: false, showProjection: false }
    case 'quiz':
      return { score: 66, lastAction: null, activityType: null, revealMode: false, showProjection: false }
    case 'close':
      return { score: 72, lastAction: 'sleep', activityType: null, revealMode: false, showProjection: false }
    case 'twin':
    default:
      return { score: 50, lastAction: null, activityType: null, revealMode: false, showProjection: false }
  }
}

const buildProjectionHistory = (sceneIndex: number): ActionLogEntry[] => {
  const base: Array<{ actionKey: ActionKey; delta: number }> = [
    { actionKey: 'exercise', delta: 9 },
    { actionKey: 'sedentary', delta: -5 },
    { actionKey: 'junk', delta: -7 },
    { actionKey: 'sleep', delta: 4 },
    { actionKey: 'goodmeal', delta: 6 },
    { actionKey: 'stress', delta: -4 },
  ]

  return base.slice(0, Math.max(2, Math.min(base.length, sceneIndex))).map((entry, index) => ({
    id: `story-${index}`,
    timestamp: Date.now() + index,
    actionKey: entry.actionKey,
    delta: entry.delta,
  }))
}

export default function PresentationMode({ onExitToGame }: PresentationModeProps) {
  const [sceneIndex, setSceneIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  const scene = STORY_SCENES[sceneIndex]
  const progress = ((sceneIndex + 1) / STORY_SCENES.length) * 100

  const visualization = useMemo(() => getVisualization(scene.highlight), [scene.highlight])
  const projectionHistory = useMemo(() => buildProjectionHistory(sceneIndex + 1), [sceneIndex])

  const goNext = () => {
    setSceneIndex((prev) => Math.min(prev + 1, STORY_SCENES.length - 1))
  }

  const goPrev = () => {
    setSceneIndex((prev) => Math.max(prev - 1, 0))
  }

  useEffect(() => {
    if (!autoPlay) return

    if (sceneIndex === STORY_SCENES.length - 1) {
      const finishTimer = window.setTimeout(() => onExitToGame(), 3800)
      return () => window.clearTimeout(finishTimer)
    }

    const timer = window.setTimeout(() => {
      setSceneIndex((prev) => Math.min(prev + 1, STORY_SCENES.length - 1))
    }, AUTO_ADVANCE_MS)

    return () => window.clearTimeout(timer)
  }, [sceneIndex, autoPlay, onExitToGame])

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 py-6 sm:py-10">
      <div className="rounded-3xl border border-warm/15 bg-surface/70 p-4 sm:p-6 backdrop-blur">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-xs tracking-[0.16em] uppercase text-mint/70">Presentation Version</p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-warm">PulseTwin Story Mode</h1>
            <p className="text-sm text-warm/70 mt-1">Narrative demo that unfolds once, then hands over to the full game.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setAutoPlay((prev) => !prev)}
              className="px-3 py-2 rounded-lg border border-warm/20 text-sm text-warm/80 hover:border-mint/40 hover:text-mint transition-colors"
            >
              {autoPlay ? 'Pause Story Autoplay' : 'Resume Story Autoplay'}
            </button>
            <button
              onClick={onExitToGame}
              className="px-3 py-2 rounded-lg border border-mint/40 bg-mint/15 text-sm text-mint hover:bg-mint/25 transition-colors"
            >
              Enter Full Game
            </button>
          </div>
        </div>

        <div className="mt-4 h-2 rounded-full bg-pine/70 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: scene.accent }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 110, damping: 20 }}
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[380px,1fr]">
          <div className="rounded-2xl border border-warm/15 bg-pine/50 p-4">
            <LivingTwin
              syncScore={visualization.score}
              band={getBand(visualization.score)}
              lastAction={visualization.lastAction}
              actionCount={sceneIndex + 1}
              revealMode={visualization.revealMode}
              activityType={visualization.activityType}
            />

            <AnimatePresence mode="wait">
              {visualization.revealMode && (
                <motion.div
                  key="reveal"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-4"
                >
                  <RevealMode syncScore={visualization.score} band={getBand(visualization.score)} />
                </motion.div>
              )}
              {visualization.showProjection && (
                <motion.div
                  key="projection"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-4"
                >
                  <TimeProjection syncScore={visualization.score} history={projectionHistory} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="rounded-2xl border border-warm/15 bg-pine/40 p-4 sm:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={scene.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl" aria-hidden>
                    {scene.emoji}
                  </span>
                  <div>
                    <p className="font-mono text-xs tracking-[0.1em] uppercase text-warm/60">
                      Scene {sceneIndex + 1} of {STORY_SCENES.length}
                    </p>
                    <h2 className="font-display text-2xl font-semibold" style={{ color: scene.accent }}>
                      {scene.title}
                    </h2>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {scene.narration.map((line) => (
                    <p key={line} className="text-warm/90 leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>

                {scene.actionHint && (
                  <div className="mt-5 rounded-xl border border-honey/30 bg-honey/10 px-4 py-3 text-sm text-honey">
                    {scene.actionHint}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <button
                onClick={goPrev}
                disabled={sceneIndex === 0}
                className="px-3 py-2 rounded-lg border border-warm/20 text-sm text-warm/80 disabled:opacity-40 disabled:cursor-not-allowed hover:border-warm/40 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={goNext}
                disabled={sceneIndex === STORY_SCENES.length - 1}
                className="px-3 py-2 rounded-lg border border-mint/40 bg-mint/15 text-sm text-mint disabled:opacity-40 disabled:cursor-not-allowed hover:bg-mint/25 transition-colors"
              >
                Next Scene
              </button>
              <button
                onClick={() => {
                  setSceneIndex(0)
                  setAutoPlay(false)
                }}
                className="px-3 py-2 rounded-lg border border-warm/20 text-sm text-warm/80 hover:border-honey/40 hover:text-honey transition-colors"
              >
                Restart Story
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
