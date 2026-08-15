import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ActionKey, Band } from '../types'
import { BANDS } from '../data'
import type { ActivityType } from '../activity'

interface LivingTwinProps {
  syncScore: number
  band: Band
  lastAction: ActionKey | null
  actionCount: number
  revealMode: boolean
  activityType: ActivityType | null
}

type Reaction = 'goodmeal' | 'junk' | 'exercise' | 'sedentary' | 'sleep' | 'stress' | null

const REACTION_CLASS: Record<Exclude<Reaction, null>, string> = {
  goodmeal: 'reaction-goodmeal',
  junk: 'reaction-junk',
  exercise: 'reaction-exercise',
  sedentary: 'reaction-sedentary',
  sleep: 'reaction-sleep',
  stress: 'reaction-stress',
}

const ACTIVITY_CLASS: Record<ActivityType, string> = {
  walk: 'activity-walk',
  run: 'activity-run',
  sit: 'activity-sit',
  sleep: 'activity-sleep',
  exercise: 'activity-exercise',
  stand: 'activity-stand',
}

export default function LivingTwin({ syncScore, band, lastAction, actionCount, revealMode, activityType }: LivingTwinProps) {
  const [reaction, setReaction] = useState<Reaction>(null)
  const [blink, setBlink] = useState(false)
  const prevActionCount = useRef(actionCount)
  const bandColor = BANDS[band].color

  // Trigger reaction when a new action is logged
  useEffect(() => {
    if (actionCount > prevActionCount.current && lastAction) {
      setReaction(lastAction)
      const t = setTimeout(() => setReaction(null), 1600)
      prevActionCount.current = actionCount
      return () => clearTimeout(t)
    }
    prevActionCount.current = actionCount
  }, [actionCount, lastAction])

  // Blink loop
  useEffect(() => {
    const blinkTimer = setInterval(() => {
      setBlink(true)
      setTimeout(() => setBlink(false), 150)
    }, 3500 + Math.random() * 2000)
    return () => clearInterval(blinkTimer)
  }, [])

  // Posture based on band
  const postureClass = band === 'high' ? 'posture-high' : band === 'mid' ? 'posture-mid' : 'posture-low'
  const reactionClass = reaction ? REACTION_CLASS[reaction] : ''
  const activityClass = activityType ? ACTIVITY_CLASS[activityType] : ''

  // Eye state for sleep
  const eyesClosed = activityType === 'sleep'

  return (
    <div className="relative flex flex-col items-center">
      {/* Stage glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-56 h-8 rounded-full blur-2xl opacity-40 transition-colors duration-700"
        style={{ background: bandColor }}
      />

      {/* The Twin */}
      <div className={`twin-container ${postureClass} ${reactionClass} ${activityClass} ${revealMode ? 'reveal-mode' : ''}`}>
        <svg
          viewBox="0 0 200 260"
          className="w-48 h-64 sm:w-56 sm:h-72"
          role="img"
          aria-label={`Your digital twin, currently ${BANDS[band].mood}`}
        >
          {/* Shadow */}
          <ellipse cx="100" cy="248" rx="42" ry="8" fill="rgba(0,0,0,0.35)" className="twin-shadow" />

          {/* Legs */}
          <g className="twin-legs">
            <rect x="78" y="185" width="16" height="55" rx="7" fill="#2E5A50" />
            <rect x="106" y="185" width="16" height="55" rx="7" fill="#2E5A50" />
          </g>

          {/* Body / torso */}
          <g className="twin-torso">
            <rect x="70" y="105" width="60" height="85" rx="20" fill="#3A6B5F" />
            {/* Belly highlight */}
            <rect x="82" y="130" width="36" height="40" rx="12" fill="#4A7D70" opacity="0.6" />
          </g>

          {/* Arms */}
          <g className="twin-arms">
            <rect x="48" y="112" width="16" height="60" rx="8" fill="#2E5A50" transform="rotate(8 56 112)" />
            <rect x="136" y="112" width="16" height="60" rx="8" fill="#2E5A50" transform="rotate(-8 144 112)" />
            {/* Hands */}
            <circle cx="58" cy="172" r="8" fill="#F5C9A8" />
            <circle cx="142" cy="172" r="8" fill="#F5C9A8" />
          </g>

          {/* Head */}
          <g className="twin-head">
            <circle cx="100" cy="72" r="38" fill="#F5C9A8" />
            {/* Hair */}
            <path d="M62 68 Q62 30 100 30 Q138 30 138 68 Q138 50 100 48 Q62 50 62 68 Z" fill="#2E2A28" />
            {/* Eyes */}
            <g className={blink || eyesClosed ? 'twin-eyes-blink' : ''}>
              <ellipse cx="86" cy="72" rx="5" ry="6" fill="#2E2A28" />
              <ellipse cx="114" cy="72" rx="5" ry="6" fill="#2E2A28" />
              <circle cx="88" cy="70" r="1.8" fill="#fff" />
              <circle cx="116" cy="70" r="1.8" fill="#fff" />
            </g>
            {/* Mouth */}
            <path
              d={band === 'high' ? 'M90 92 Q100 100 110 92' : band === 'mid' ? 'M92 94 Q100 98 108 94' : 'M92 96 Q100 92 108 96'}
              stroke="#8A5A3B"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* Cheeks */}
            <circle cx="78" cy="84" r="5" fill="#F2A93B" opacity="0.25" />
            <circle cx="122" cy="84" r="5" fill="#F2A93B" opacity="0.25" />
          </g>

          {/* Reveal mode overlay: internal signal */}
          {revealMode && (
            <g className="reveal-overlay">
              <path
                d="M30 200 Q50 190 70 200 T110 200 T150 200 T190 200"
                stroke={bandColor}
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                className="reveal-wave"
              />
              <circle cx="100" cy="72" r="30" fill="none" stroke={bandColor} strokeWidth="1.5" opacity="0.4" className="reveal-pulse" />
            </g>
          )}
        </svg>
      </div>

      {/* Reaction label */}
      <AnimatePresence>
        {reaction && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            className="absolute -top-2 left-1/2 -translate-x-1/2 bg-surface border border-warm/20 rounded-full px-3 py-1 text-xs font-mono"
          >
            {reaction === 'goodmeal' && '🥗 Nourished!'}
            {reaction === 'junk' && '🥤 Sugar spike!'}
            {reaction === 'exercise' && '🏃 Energized!'}
            {reaction === 'sedentary' && '🛋️ Slumping...'}
            {reaction === 'sleep' && '😴 Restored'}
            {reaction === 'stress' && '⚡ Stressed'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Activity label */}
      {activityType && (
        <div className="mt-2 font-mono text-xs px-3 py-1 rounded-full bg-honey/15 border border-honey/30 text-honey">
          {activityType === 'walk' && '🚶 Walking'}
          {activityType === 'run' && '🏃 Running'}
          {activityType === 'sit' && '🪑 Sitting'}
          {activityType === 'sleep' && '😴 Sleeping'}
          {activityType === 'exercise' && '🤸 Exercising'}
          {activityType === 'stand' && '🧍 Standing'}
        </div>
      )}

      {/* Sync score badge */}
      <div
        className="mt-2 font-mono text-sm px-3 py-1 rounded-full border transition-colors duration-500"
        style={{ color: bandColor, borderColor: `${bandColor}55`, background: `${bandColor}11` }}
      >
        {syncScore} / 100
      </div>
    </div>
  )
}