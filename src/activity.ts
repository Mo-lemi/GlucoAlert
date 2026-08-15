export type ActivityType = 'walk' | 'run' | 'sit' | 'sleep' | 'exercise' | 'stand'

export interface ActivityConfig {
  type: ActivityType
  // For walk/run
  distanceKm?: number
  paceMinPerKm?: number
  // For sit/sleep/stand/exercise
  durationMin?: number
  // For exercise
  reps?: number
}

export interface ActivityDefinition {
  type: ActivityType
  label: string
  emoji: string
  description: string
  hasDistance: boolean
  hasPace: boolean
  hasDuration: boolean
  hasReps: boolean
  defaultDistanceKm: number
  defaultPaceMinPerKm: number
  defaultDurationMin: number
  defaultReps: number
  // Which action this logs on completion
  logsAction: 'goodmeal' | 'junk' | 'exercise' | 'sedentary' | 'sleep' | 'stress'
  // Score delta applied on completion
  delta: number
}

export const ACTIVITY_DEFS: ActivityDefinition[] = [
  {
    type: 'walk',
    label: 'Walking',
    emoji: '🚶',
    description: 'A steady walk — your Twin walks alongside you.',
    hasDistance: true,
    hasPace: true,
    hasDuration: false,
    hasReps: false,
    defaultDistanceKm: 1,
    defaultPaceMinPerKm: 10,
    defaultDurationMin: 10,
    defaultReps: 10,
    logsAction: 'exercise',
    delta: 6,
  },
  {
    type: 'run',
    label: 'Running',
    emoji: '🏃',
    description: 'A brisk run — your Twin keeps pace with you.',
    hasDistance: true,
    hasPace: true,
    hasDuration: false,
    hasReps: false,
    defaultDistanceKm: 2,
    defaultPaceMinPerKm: 6,
    defaultDurationMin: 12,
    defaultReps: 10,
    logsAction: 'exercise',
    delta: 9,
  },
  {
    type: 'sit',
    label: 'Sitting',
    emoji: '🪑',
    description: 'A sedentary stretch — your Twin sits with you.',
    hasDistance: false,
    hasPace: false,
    hasDuration: true,
    hasReps: false,
    defaultDistanceKm: 1,
    defaultPaceMinPerKm: 10,
    defaultDurationMin: 30,
    defaultReps: 10,
    logsAction: 'sedentary',
    delta: -5,
  },
  {
    type: 'sleep',
    label: 'Sleeping',
    emoji: '😴',
    description: 'Rest and recovery — your Twin sleeps beside you.',
    hasDistance: false,
    hasPace: false,
    hasDuration: true,
    hasReps: false,
    defaultDistanceKm: 1,
    defaultPaceMinPerKm: 10,
    defaultDurationMin: 60,
    defaultReps: 10,
    logsAction: 'sleep',
    delta: 4,
  },
  {
    type: 'exercise',
    label: 'Exercise',
    emoji: '🤸',
    description: 'Active movement — your Twin works out with you.',
    hasDistance: false,
    hasPace: false,
    hasDuration: true,
    hasReps: true,
    defaultDistanceKm: 1,
    defaultPaceMinPerKm: 10,
    defaultDurationMin: 20,
    defaultReps: 20,
    logsAction: 'exercise',
    delta: 9,
  },
  {
    type: 'stand',
    label: 'Standing',
    emoji: '🧍',
    description: 'A standing break — your Twin stands with you.',
    hasDistance: false,
    hasPace: false,
    hasDuration: true,
    hasReps: false,
    defaultDistanceKm: 1,
    defaultPaceMinPerKm: 10,
    defaultDurationMin: 5,
    defaultReps: 10,
    logsAction: 'exercise',
    delta: 2,
  },
]

export const getActivityDurationMin = (config: ActivityConfig): number => {
  const def = ACTIVITY_DEFS.find((d) => d.type === config.type)
  if (!def) return 0
  if (def.hasDistance && config.distanceKm && config.paceMinPerKm) {
    return config.distanceKm * config.paceMinPerKm
  }
  if (def.hasReps && config.reps) {
    return config.reps * 0.5 // 30s per rep
  }
  return config.durationMin ?? def.defaultDurationMin
}