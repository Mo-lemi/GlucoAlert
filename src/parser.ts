import type { ActivityConfig, ActivityType } from './activity'

export type CommandAction = ActivityType | 'junk' | 'goodmeal' | 'stress'

export interface ParsedCommand {
  type: CommandAction
  config?: ActivityConfig
  label: string
}

const ACTIVITY_KEYWORDS: { type: ActivityType; keywords: string[] }[] = [
  { type: 'walk', keywords: ['walk', 'walking', 'stroll', 'strolling', 'hike', 'hiking'] },
  { type: 'run', keywords: ['run', 'running', 'jog', 'jogging', 'sprint', 'sprinting'] },
  { type: 'sit', keywords: ['sit', 'sitting', 'desk', 'sedentary', 'work', 'working', 'office'] },
  { type: 'sleep', keywords: ['sleep', 'sleeping', 'slept', 'nap', 'napping', 'rest', 'resting'] },
  { type: 'exercise', keywords: ['exercise', 'exercising', 'workout', 'gym', 'training', 'yoga', 'pilates'] },
  { type: 'stand', keywords: ['stand', 'standing', 'stretch', 'stretching', 'break'] },
]

const FOOD_KEYWORDS = {
  sugary: ['sugary', 'sugar', 'dessert', 'milkshake', 'soda', 'candy', 'sweet', 'cake', 'ice cream', 'junk', 'fast food', 'burger', 'fries'],
  healthy: ['healthy', 'salad', 'vegetable', 'veg', 'fruit', 'home-cooked', 'home cooked', 'meal', 'breakfast', 'lunch', 'dinner', 'eat', 'eating', 'ate', 'food'],
}

const STRESS_KEYWORDS = ['stress', 'stressed', 'anxious', 'anxiety', 'rushed', 'overwhelmed', 'panic', 'skipped meal', 'skipped lunch', 'skipped breakfast']

const DURATION_PATTERNS = [
  /(\d+)\s*(?:min|mins|minutes|minute)/i,
  /(\d+)\s*(?:hr|hrs|hour|hours)/i,
  /(\d+)\s*(?:h)\b/i,
]

const DISTANCE_PATTERNS = [
  /(\d+(?:\.\d+)?)\s*(?:km|kilometer|kilometers|k)/i,
  /(\d+(?:\.\d+)?)\s*(?:mi|mile|miles)/i,
]

const PACE_PATTERNS = [
  /(\d+(?:\.\d+)?)\s*(?:km\/h|kmh|kph|km per hour|km per hr)/i,
  /pace\s*(\d+(?:\.\d+)?)/i,
]

const detectActivityType = (text: string): ActivityType | null => {
  const lower = text.toLowerCase()
  for (const { type, keywords } of ACTIVITY_KEYWORDS) {
    if (keywords.some((k) => lower.includes(k))) return type
  }
  return null
}

const extractNumber = (patterns: RegExp[], text: string): number | null => {
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) return parseFloat(match[1])
  }
  return null
}

export const parseCommand = (input: string): ParsedCommand | null => {
  const text = input.trim()
  if (!text) return null

  const lower = text.toLowerCase()

  // Detect food / stress first (these are one-shot actions, not timed activities)
  const isSugary = FOOD_KEYWORDS.sugary.some((k) => lower.includes(k))
  const isHealthy = FOOD_KEYWORDS.healthy.some((k) => lower.includes(k))
  const isStress = STRESS_KEYWORDS.some((k) => lower.includes(k))

  // If it's a food or stress statement, return a quick action
  if (isSugary && !isHealthy) {
    return { type: 'junk', label: 'Sugary food/drink' }
  }
  if (isHealthy && !isSugary) {
    return { type: 'goodmeal', label: 'Healthy meal' }
  }
  if (isStress) {
    return { type: 'stress', label: 'Stress / skipped meal' }
  }

  // Detect timed activity
  const activityType = detectActivityType(text)
  if (!activityType) return null

  const config: ActivityConfig = { type: activityType }

  // Duration
  const durationMin = extractNumber(DURATION_PATTERNS, text)
  if (durationMin !== null) {
    // If it's hours, convert to minutes
    const hoursMatch = text.match(/(\d+)\s*(?:hr|hrs|hour|hours|h)\b/i)
    config.durationMin = hoursMatch ? durationMin * 60 : durationMin
  }

  // Distance
  const distanceKm = extractNumber(DISTANCE_PATTERNS, text)
  if (distanceKm !== null) {
    const milesMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:mi|mile|miles)/i)
    config.distanceKm = milesMatch ? distanceKm * 1.60934 : distanceKm
  }

  // Pace
  const paceKmh = extractNumber(PACE_PATTERNS, text)
  if (paceKmh !== null) {
    // Convert km/h to min/km
    config.paceMinPerKm = Math.round(60 / paceKmh)
  }

  // If walking/running and no distance given, use default
  if ((activityType === 'walk' || activityType === 'run') && !config.distanceKm) {
    config.distanceKm = activityType === 'walk' ? 1 : 2
  }

  // If no duration and no distance, use defaults
  if (!config.durationMin && !config.distanceKm) {
    config.durationMin = activityType === 'walk' ? 30 : activityType === 'run' ? 20 : 30
  }

  return { type: activityType, config, label: text }
}

export const getFallbackPrompt = (): string =>
  'Could you describe the activity in a quick format like: "I\'m walking 2 km at 5 km/h for 30 minutes"?'