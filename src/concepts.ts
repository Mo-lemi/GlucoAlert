import type { ActionKey } from './types'

export interface ConceptCard {
  id: string
  title: string
  emoji: string
  stat: string
  fact: string
  source: string
  action: ActionKey
}

export const CONCEPT_CARDS: ConceptCard[] = [
  {
    id: 'c1',
    title: 'Prediabetes is silent and common',
    emoji: '🫸',
    stat: '2 in 5 U.S. adults',
    fact: 'More than 2 in 5 U.S. adults are estimated to have prediabetes right now, and roughly 8 in 10 of them don\u2019t know it. This is why the Twin \u201cfeels\u201d fine while the internal signal strains.',
    source: 'CDC',
    action: 'sedentary',
  },
  {
    id: 'c2',
    title: 'Undiagnosed diabetes is a global gap',
    emoji: '🌍',
    stat: '43% undiagnosed',
    fact: 'Globally, an estimated 43% of adults with diabetes — about 252 million people — are undiagnosed. Awareness is the first intervention.',
    source: 'IDF Diabetes Atlas',
    action: 'sedentary',
  },
  {
    id: 'c3',
    title: 'Lifestyle change can cut risk by half',
    emoji: '🏃',
    stat: '−50%+ risk',
    fact: 'Structured lifestyle changes (movement, food, weight) have been shown to cut diabetes risk by more than half in high-risk adults.',
    source: 'CDC National Diabetes Prevention Program',
    action: 'exercise',
  },
  {
    id: 'c4',
    title: 'Type 2 dominates',
    emoji: '📊',
    stat: '90–95% of cases',
    fact: 'Type 2 diabetes accounts for roughly 90–95% of diagnosed cases and is strongly tied to everyday lifestyle patterns.',
    source: 'CDC',
    action: 'goodmeal',
  },
  {
    id: 'c5',
    title: 'PCOS and insulin resistance',
    emoji: '💊',
    stat: 'Linked risk',
    fact: 'PCOS is strongly linked to insulin resistance, making it a diabetes risk factor worth screening for early.',
    source: 'General clinical consensus',
    action: 'goodmeal',
  },
  {
    id: 'c6',
    title: 'Prevalence has quadrupled',
    emoji: '📈',
    stat: '4× since 1990',
    fact: 'Global diabetes prevalence has more than quadrupled since 1990, driven largely by lifestyle patterns.',
    source: 'WHO',
    action: 'junk',
  },
  {
    id: 'c7',
    title: 'Insulin resistance builds for years',
    emoji: '⏳',
    stat: 'Years before diagnosis',
    fact: 'Insulin resistance can build for years before blood sugar numbers move enough to trigger a diagnosis — the entire premise of Reveal Mode.',
    source: 'Clinical consensus',
    action: 'stress',
  },
]

export const actionToConcepts = (action: ActionKey): string[] =>
  CONCEPT_CARDS.filter((c) => c.action === action).map((c) => c.id)