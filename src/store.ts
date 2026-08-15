import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ActionKey, ActionLogEntry, TimelineEntry, TwinState, Mood } from './types'
import { ACTIONS, BADGES, QUIZ_ITEMS } from './data'
import { actionToConcepts } from './concepts'
import type { ActivityConfig } from './activity'
import { ACTIVITY_DEFS, getActivityDurationMin } from './activity'

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

const todayKey = () => new Date().toISOString().slice(0, 10)

const initialState: TwinState = {
  syncScore: 50,
  awarenessPoints: 0,
  streak: 0,
  lastActionDate: null,
  history: [],
  unlockedBadges: [],
  quizIndex: 0,
  answeredQuizIds: [],
  energy: 70,
  stress: 30,
  glucoseStrain: 30,
  resilience: 60,
  mood: 'steady',
  timeline: [],
  learnedConcepts: [],
}

export interface ActiveActivity {
  config: ActivityConfig
  startedAt: number
  totalDurationMs: number
}

interface Store extends TwinState {
  logAction: (key: ActionKey) => void
  answerQuiz: (correct: boolean) => void
  reset: () => void
  startActivity: (config: ActivityConfig) => void
  completeActivity: () => void
  cancelActivity: () => void
  tick: () => void
  activeActivity: ActiveActivity | null
}

const checkBadges = (state: TwinState): string[] => {
  const newlyUnlocked = BADGES.filter((b) => !state.unlockedBadges.includes(b.id) && b.test(state)).map((b) => b.id)
  return [...state.unlockedBadges, ...newlyUnlocked]
}

const computeMood = (s: TwinState): Mood => {
  if (s.energy < 30 || s.stress > 70) return 'exhausted'
  if (s.syncScore < 40 || s.glucoseStrain > 60) return 'strained'
  if (s.syncScore >= 70 && s.stress < 40) return 'calm'
  return 'steady'
}

const addTimeline = (state: TwinState, entry: Omit<TimelineEntry, 'id' | 'timestamp'>): TimelineEntry[] => {
  const newEntry: TimelineEntry = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
  }
  return [...state.timeline, newEntry].slice(-30)
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      ...initialState,
      activeActivity: null,

      logAction: (key) => {
        const action = ACTIONS.find((a) => a.key === key)
        if (!action) return

        const now = Date.now()
        const today = todayKey()
        const prev = get()

        let streak = prev.streak
        if (prev.lastActionDate === today) {
          // keep
        } else if (prev.lastActionDate === new Date(Date.now() - 86400000).toISOString().slice(0, 10)) {
          streak = prev.streak + 1
        } else {
          streak = 1
        }

        const entry: ActionLogEntry = {
          id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
          timestamp: now,
          actionKey: key,
          delta: action.delta,
        }

        const newScore = clamp(prev.syncScore + action.delta, 0, 100)

        // Apply meter effects based on action
        let energy = prev.energy
        let stress = prev.stress
        let glucoseStrain = prev.glucoseStrain
        let resilience = prev.resilience
        let timeline = prev.timeline

        switch (key) {
          case 'goodmeal':
            energy = clamp(energy + 5, 0, 100)
            glucoseStrain = clamp(glucoseStrain - 3, 0, 100)
            resilience = clamp(resilience + 2, 0, 100)
            timeline = addTimeline(prev, { label: 'Healthy meal', emoji: '🥗', type: 'meal' })
            break
          case 'junk':
            glucoseStrain = clamp(glucoseStrain + 12, 0, 100)
            stress = clamp(stress + 5, 0, 100)
            energy = clamp(energy - 2, 0, 100)
            timeline = addTimeline(prev, { label: 'Sugary spike', emoji: '🥤', type: 'meal' })
            break
          case 'exercise':
            energy = clamp(energy + 8, 0, 100)
            glucoseStrain = clamp(glucoseStrain - 6, 0, 100)
            resilience = clamp(resilience + 4, 0, 100)
            stress = clamp(stress - 3, 0, 100)
            timeline = addTimeline(prev, { label: 'Movement', emoji: '🏃', type: 'activity' })
            break
          case 'sedentary':
            energy = clamp(energy - 6, 0, 100)
            glucoseStrain = clamp(glucoseStrain + 5, 0, 100)
            stress = clamp(stress + 3, 0, 100)
            timeline = addTimeline(prev, { label: 'Sedentary stretch', emoji: '🛋️', type: 'activity' })
            break
          case 'sleep':
            energy = clamp(energy + 10, 0, 100)
            stress = clamp(stress - 8, 0, 100)
            resilience = clamp(resilience + 6, 0, 100)
            glucoseStrain = clamp(glucoseStrain - 4, 0, 100)
            timeline = addTimeline(prev, { label: 'Restful sleep', emoji: '😴', type: 'sleep' })
            break
          case 'stress':
            stress = clamp(stress + 12, 0, 100)
            energy = clamp(energy - 5, 0, 100)
            glucoseStrain = clamp(glucoseStrain + 4, 0, 100)
            timeline = addTimeline(prev, { label: 'High stress', emoji: '⚡', type: 'stress' })
            break
        }

        const newConcepts = actionToConcepts(key)
        const learnedConcepts = Array.from(new Set([...prev.learnedConcepts, ...newConcepts]))

        const nextState: TwinState = {
          ...prev,
          syncScore: newScore,
          streak,
          lastActionDate: today,
          history: [...prev.history, entry].slice(-60),
          energy,
          stress,
          glucoseStrain,
          resilience,
          timeline,
          learnedConcepts,
        }
        nextState.mood = computeMood(nextState)
        nextState.unlockedBadges = checkBadges(nextState)

        set(nextState)
      },

      answerQuiz: (correct) => {
        const prev = get()
        const quizItem = QUIZ_ITEMS[prev.quizIndex]
        if (!quizItem) return

        const nextState: TwinState = {
          ...prev,
          awarenessPoints: prev.awarenessPoints + (correct ? 10 : 2),
          quizIndex: (prev.quizIndex + 1) % QUIZ_ITEMS.length,
          answeredQuizIds: prev.answeredQuizIds.includes(quizItem.id)
            ? prev.answeredQuizIds
            : [...prev.answeredQuizIds, quizItem.id],
        }
        nextState.unlockedBadges = checkBadges(nextState)

        set(nextState)
      },

      startActivity: (config) => {
        const def = ACTIVITY_DEFS.find((d) => d.type === config.type)
        if (!def) return
        const durationMin = getActivityDurationMin(config)
        set({
          activeActivity: {
            config,
            startedAt: Date.now(),
            totalDurationMs: durationMin * 60 * 1000,
          },
        })
      },

      completeActivity: () => {
        const prev = get()
        const active = prev.activeActivity
        if (!active) return
        const def = ACTIVITY_DEFS.find((d) => d.type === active.config.type)
        if (!def) return

        const now = Date.now()
        const today = todayKey()
        let streak = prev.streak
        if (prev.lastActionDate === today) {
          // keep
        } else if (prev.lastActionDate === new Date(Date.now() - 86400000).toISOString().slice(0, 10)) {
          streak = prev.streak + 1
        } else {
          streak = 1
        }

        const entry: ActionLogEntry = {
          id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
          timestamp: now,
          actionKey: def.logsAction,
          delta: def.delta,
        }

        const newScore = clamp(prev.syncScore + def.delta, 0, 100)
        const newHistory = [...prev.history, entry].slice(-60)

        // Apply meter effects on completion
        let energy = prev.energy
        let stress = prev.stress
        let glucoseStrain = prev.glucoseStrain
        let resilience = prev.resilience
        let timeline = prev.timeline

        switch (def.type) {
          case 'walk':
          case 'run':
          case 'exercise':
            energy = clamp(energy + 10, 0, 100)
            glucoseStrain = clamp(glucoseStrain - 8, 0, 100)
            resilience = clamp(resilience + 5, 0, 100)
            stress = clamp(stress - 4, 0, 100)
            timeline = addTimeline(prev, { label: `${def.label} completed`, emoji: def.emoji, type: 'activity' })
            break
          case 'sit':
            energy = clamp(energy - 8, 0, 100)
            glucoseStrain = clamp(glucoseStrain + 6, 0, 100)
            stress = clamp(stress + 4, 0, 100)
            timeline = addTimeline(prev, { label: 'Long sitting', emoji: '🪑', type: 'activity' })
            break
          case 'sleep':
            energy = clamp(energy + 15, 0, 100)
            stress = clamp(stress - 10, 0, 100)
            resilience = clamp(resilience + 8, 0, 100)
            glucoseStrain = clamp(glucoseStrain - 5, 0, 100)
            timeline = addTimeline(prev, { label: 'Sleep session', emoji: '😴', type: 'sleep' })
            break
          case 'stand':
            energy = clamp(energy + 3, 0, 100)
            glucoseStrain = clamp(glucoseStrain - 2, 0, 100)
            timeline = addTimeline(prev, { label: 'Standing break', emoji: '🧍', type: 'activity' })
            break
        }

        const newConcepts = actionToConcepts(def.logsAction)
        const learnedConcepts = Array.from(new Set([...prev.learnedConcepts, ...newConcepts]))

        const nextState: TwinState = {
          ...prev,
          syncScore: newScore,
          streak,
          lastActionDate: today,
          history: newHistory,
          energy,
          stress,
          glucoseStrain,
          resilience,
          timeline,
          learnedConcepts,
        }
        nextState.mood = computeMood(nextState)
        nextState.unlockedBadges = checkBadges(nextState)

        set({ ...nextState, activeActivity: null })
      },

      cancelActivity: () => set({ activeActivity: null }),

      tick: () => {
        const prev = get()
        const active = prev.activeActivity
        if (!active) return

        const def = ACTIVITY_DEFS.find((d) => d.type === active.config.type)
        if (!def) return

        // Gradual meter changes during active activity
        let energy = prev.energy
        let stress = prev.stress
        let glucoseStrain = prev.glucoseStrain
        let resilience = prev.resilience

        switch (def.type) {
          case 'walk':
          case 'run':
          case 'exercise':
            energy = clamp(energy + 0.5, 0, 100)
            glucoseStrain = clamp(glucoseStrain - 0.4, 0, 100)
            resilience = clamp(resilience + 0.3, 0, 100)
            stress = clamp(stress - 0.2, 0, 100)
            break
          case 'sit':
            energy = clamp(energy - 0.4, 0, 100)
            glucoseStrain = clamp(glucoseStrain + 0.3, 0, 100)
            stress = clamp(stress + 0.2, 0, 100)
            break
          case 'sleep':
            energy = clamp(energy + 0.8, 0, 100)
            stress = clamp(stress - 0.5, 0, 100)
            resilience = clamp(resilience + 0.4, 0, 100)
            glucoseStrain = clamp(glucoseStrain - 0.2, 0, 100)
            break
          case 'stand':
            energy = clamp(energy + 0.2, 0, 100)
            glucoseStrain = clamp(glucoseStrain - 0.1, 0, 100)
            break
        }

        const nextState: TwinState = {
          ...prev,
          energy,
          stress,
          glucoseStrain,
          resilience,
        }
        nextState.mood = computeMood(nextState)

        set(nextState)
      },

      reset: () => set({ ...initialState, activeActivity: null }),
    }),
    {
      name: 'pulsetwin-state',
      partialize: (state) => {
        const { activeActivity, ...rest } = state
        return rest
      },
    }
  )
)