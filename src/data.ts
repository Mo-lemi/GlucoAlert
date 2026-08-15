import type { ActionKey, Band, BandInfo, QuizItem, Badge } from './types'

export const ACTIONS: {
  key: ActionKey
  label: string
  emoji: string
  delta: number
  description: string
}[] = [
  { key: 'goodmeal', label: 'Home-cooked / veg-forward meal', emoji: '🥗', delta: 6, description: 'A nourishing, plant-forward meal.' },
  { key: 'junk', label: 'Sugary drink or dessert', emoji: '🥤', delta: -7, description: 'A spike of refined sugar.' },
  { key: 'exercise', label: '20+ min of movement', emoji: '🏃', delta: 9, description: 'Your body loves this.' },
  { key: 'sedentary', label: 'Mostly sedentary day', emoji: '🛋️', delta: -5, description: 'Long stretches without movement.' },
  { key: 'sleep', label: "Good night's sleep", emoji: '😴', delta: 4, description: 'Rest and recovery.' },
  { key: 'stress', label: 'High-stress / skipped meals', emoji: '⚡', delta: -4, description: 'Cortisol and missed meals.' },
]

export const BANDS: Record<Band, BandInfo> = {
  high: {
    label: 'Synced',
    color: '#6FE7C0',
    mood: 'Bright & steady',
    description: 'Your Twin is thriving — steady energy, calm rhythm.',
  },
  mid: {
    label: 'Drifting',
    color: '#F2A93B',
    mood: 'Wavering',
    description: 'Your Twin is holding on, but small choices are adding up.',
  },
  low: {
    label: 'Desynced',
    color: '#F2705C',
    mood: 'Strained',
    description: 'Your Twin is struggling — the internal signal is jagged.',
  },
}

export const QUIZ_ITEMS: QuizItem[] = [
  {
    id: 'q1',
    question: 'How many U.S. adults are estimated to have prediabetes right now?',
    options: ['About 1 in 10', 'More than 2 in 5', 'About 1 in 20', 'Nearly everyone'],
    correctIndex: 1,
    explanation: 'More than 2 in 5 U.S. adults are estimated to have prediabetes, and roughly 8 in 10 of them don\u2019t know it.',
    source: 'CDC',
  },
  {
    id: 'q2',
    question: 'Globally, how many adults with diabetes are estimated to be undiagnosed?',
    options: ['About 5 million', 'About 43% — roughly 252 million people', 'About 10%', 'Almost none'],
    correctIndex: 1,
    explanation: 'An estimated 43% of adults with diabetes — about 252 million people — are undiagnosed worldwide.',
    source: 'IDF Diabetes Atlas',
  },
  {
    id: 'q3',
    question: 'What can structured lifestyle changes do for diabetes risk in high-risk adults?',
    options: ['Nothing', 'Cut risk by more than half', 'Double the risk', 'Only delay it by a month'],
    correctIndex: 1,
    explanation: 'Structured lifestyle changes (movement, food, weight) have been shown to cut diabetes risk by more than half in high-risk adults.',
    source: 'CDC National Diabetes Prevention Program',
  },
  {
    id: 'q4',
    question: 'What share of diagnosed diabetes cases is Type 2?',
    options: ['About 10%', 'About 50%', 'Roughly 90–95%', 'Less than 1%'],
    correctIndex: 2,
    explanation: 'Type 2 diabetes accounts for roughly 90–95% of diagnosed cases and is strongly tied to everyday lifestyle patterns.',
    source: 'CDC',
  },
  {
    id: 'q5',
    question: 'Which condition is strongly linked to insulin resistance and is a diabetes risk factor?',
    options: ['PCOS', 'Seasonal allergies', 'Mild dehydration', 'Poor eyesight'],
    correctIndex: 0,
    explanation: 'PCOS is strongly linked to insulin resistance, making it a diabetes risk factor worth screening for early.',
    source: 'General clinical consensus',
  },
  {
    id: 'q6',
    question: 'How has global diabetes prevalence changed since 1990?',
    options: ['Stayed the same', 'Halved', 'More than quadrupled', 'Slightly decreased'],
    correctIndex: 2,
    explanation: 'Global diabetes prevalence has more than quadrupled since 1990.',
    source: 'WHO',
  },
  {
    id: 'q7',
    question: 'How long can insulin resistance build before blood sugar numbers move enough for a diagnosis?',
    options: ['A few hours', 'A few days', 'Years', 'It never does'],
    correctIndex: 2,
    explanation: 'Insulin resistance can build for years before blood sugar numbers move enough to trigger a diagnosis — this is the entire premise of Reveal Mode.',
    source: 'Clinical consensus',
  },
]

export const BADGES: Badge[] = [
  {
    id: 'first-log',
    label: 'First Step',
    description: 'Logged your first action.',
    test: (s) => s.history.length >= 1,
  },
  {
    id: 'ten-logs',
    label: 'Ten Logs',
    description: 'Logged 10 actions.',
    test: (s) => s.history.length >= 10,
  },
  {
    id: 'twenty-five-logs',
    label: 'Quarter Century',
    description: 'Logged 25 actions.',
    test: (s) => s.history.length >= 25,
  },
  {
    id: 'high-sync',
    label: 'In Sync',
    description: 'Reached a Sync Score of 70 or higher.',
    test: (s) => s.syncScore >= 70,
  },
  {
    id: 'low-sync',
    label: 'Wake-Up Call',
    description: 'Saw your Twin dip below 40.',
    test: (s) => s.syncScore < 40,
  },
  {
    id: 'streak-3',
    label: 'Three-Day Streak',
    description: 'Logged on 3 consecutive days.',
    test: (s) => s.streak >= 3,
  },
  {
    id: 'streak-7',
    label: 'Week Warrior',
    description: 'Logged on 7 consecutive days.',
    test: (s) => s.streak >= 7,
  },
  {
    id: 'quiz-1',
    label: 'Curious Mind',
    description: 'Answered your first quiz question.',
    test: (s) => s.answeredQuizIds.length >= 1,
  },
  {
    id: 'quiz-3',
    label: 'Awareness Builder',
    description: 'Answered 3 quiz questions.',
    test: (s) => s.answeredQuizIds.length >= 3,
  },
  {
    id: 'quiz-7',
    label: 'Diabetes Aware',
    description: 'Completed the full quiz deck.',
    test: (s) => s.answeredQuizIds.length >= QUIZ_ITEMS.length,
  },
  {
    id: 'concept-1',
    label: 'First Insight',
    description: 'Unlocked your first evidence-backed insight.',
    test: (s) => s.learnedConcepts.length >= 1,
  },
  {
    id: 'concept-3',
    label: 'Insight Seeker',
    description: 'Unlocked 3 evidence-backed insights.',
    test: (s) => s.learnedConcepts.length >= 3,
  },
  {
    id: 'concept-7',
    label: 'Evidence Scholar',
    description: 'Unlocked all evidence-backed insights.',
    test: (s) => s.learnedConcepts.length >= 7,
  },
  {
    id: 'balanced-day',
    label: 'Balanced Day',
    description: 'Logged a mix of activity and recovery choices.',
    test: (s) => {
      const keys = new Set(s.history.map((h) => h.actionKey))
      return keys.has('exercise') && keys.has('goodmeal') && keys.has('sleep')
    },
  },
]

export const DISCLAIMER = 'Educational simulation only — not medical advice, diagnosis, or prediction.'