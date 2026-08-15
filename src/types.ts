export type ActionKey = 'goodmeal' | 'junk' | 'exercise' | 'sedentary' | 'sleep' | 'stress'

export interface ActionLogEntry {
  id: string
  timestamp: number
  actionKey: ActionKey
  delta: number
}

export interface QuizItem {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  source: string
}

export interface Badge {
  id: string
  label: string
  description: string
  test: (state: TwinState) => boolean
}

export type Mood = 'calm' | 'steady' | 'strained' | 'exhausted'

export interface TimelineEntry {
  id: string
  timestamp: number
  label: string
  emoji: string
  type: 'activity' | 'meal' | 'stress' | 'sleep' | 'recovery'
}

export interface TwinState {
  syncScore: number
  awarenessPoints: number
  streak: number
  lastActionDate: string | null
  history: ActionLogEntry[]
  unlockedBadges: string[]
  quizIndex: number
  answeredQuizIds: string[]
  // Life-sim meters
  energy: number
  stress: number
  glucoseStrain: number
  resilience: number
  mood: Mood
  timeline: TimelineEntry[]
  // Education layer: evidence-backed concept cards unlocked by gameplay
  learnedConcepts: string[]
}

export type Band = 'high' | 'mid' | 'low'

export interface BandInfo {
  label: string
  color: string
  mood: string
  description: string
}