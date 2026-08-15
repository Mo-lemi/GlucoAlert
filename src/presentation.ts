export type StoryScene = {
  id: string
  title: string
  emoji: string
  narration: string[]
  accent: string
  highlight?: 'twin' | 'walk' | 'sit' | 'sugar' | 'reveal' | 'projection' | 'evidence' | 'quiz' | 'close'
  actionHint?: string
}

export const STORY_SCENES: StoryScene[] = [
  {
    id: 'hook',
    title: 'The Silent Problem',
    emoji: '🩺',
    narration: [
      'Type 2 diabetes doesn\u2019t announce itself. For years, it builds silently — no pain, no fever, no warning lights.',
      'More than 2 in 5 U.S. adults have prediabetes right now. And 8 out of 10 of them don\u2019t know it.',
      'Your body won\u2019t show you what\u2019s building inside. So we built a body that will.',
    ],
    accent: '#F2A93B',
    highlight: 'twin',
  },
  {
    id: 'live-twin',
    title: 'Meet Your Twin',
    emoji: '🫀',
    narration: [
      'This is your Twin. It\u2019s not a dashboard — it\u2019s a companion.',
      'Tell it what you\u2019re actually doing today, and it will mirror you in real time.',
    ],
    accent: '#6FE7C0',
    highlight: 'twin',
    actionHint: 'Next, we\u2019ll walk together.',
  },
  {
    id: 'walk',
    title: 'The Walking Reaction',
    emoji: '🚶',
    narration: [
      '"I\u2019m walking 2 km at 5 km/h" — and it begins.',
      'Same distance, same pace. Watch glucose strain fall, energy rise, resilience build.',
      'Movement helps your muscles use glucose. That\u2019s not a slogan — that\u2019s biology.',
    ],
    accent: '#6FE7C0',
    highlight: 'walk',
    actionHint: 'The Twin starts walking the moment you tell it.',
  },
  {
    id: 'sit',
    title: 'The Sedentary Drip',
    emoji: '🪑',
    narration: [
      'Now: "I\u2019m sitting for 90 minutes." Watch it slouch.',
      'Energy drains. Strain creeps up. A whole day of this adds up — silently.',
    ],
    accent: '#F2A93B',
    highlight: 'sit',
  },
  {
    id: 'sugar',
    title: 'The Sugar Spike',
    emoji: '🥤',
    narration: [
      '"I had a sugary drink" — spike. Flinch. Jitter.',
      'That jag is the cost of a treat. And now you can see it.',
    ],
    accent: '#F2705C',
    highlight: 'sugar',
  },
  {
    id: 'reveal',
    title: 'Reveal Mode — the X-Ray',
    emoji: '🔬',
    narration: [
      'Now the part the body hides. Reveal Mode is an on-demand X-ray of the internal signal.',
      'Calm and steady when protected. Jagged when strain is high.',
      'That jaggedness is the silent build-up of insulin resistance.',
    ],
    accent: '#6FE7C0',
    highlight: 'reveal',
  },
  {
    id: 'projection',
    title: 'Time Projection',
    emoji: '⏳',
    narration: [
      'If today becomes the pattern, what does 10 years look like?',
      'Small daily choices. Invisible. Compounding.',
      'This is illustrative, not a medical prediction — we\u2019re very clear about that.',
    ],
    accent: '#F2A93B',
    highlight: 'projection',
  },
  {
    id: 'evidence',
    title: 'Play Earns Evidence',
    emoji: '📚',
    narration: [
      'Every action you log unlocks an evidence-backed card.',
      'CDC. IDF. WHO. Real statistics — not our opinion.',
      'Lifestyle change can cut diabetes risk by more than half.',
    ],
    accent: '#6FE7C0',
    highlight: 'evidence',
  },
  {
    id: 'quiz',
    title: 'The Awareness Check',
    emoji: '🧠',
    narration: [
      'And to lock it in — a quick quiz.',
      'Every answer reveals the citation and the correct explanation.',
      'You just learned a real health fact. In game form.',
    ],
    accent: '#F2A93B',
    highlight: 'quiz',
  },
  {
    id: 'balance',
    title: 'The Reverse',
    emoji: '⚖️',
    narration: [
      'What happens when the day goes well?',
      'A good night\u2019s sleep. A workout. That\u2019s two choices.',
      'And the whole signal shifts. Habits compound — in both directions.',
    ],
    accent: '#6FE7C0',
    highlight: 'twin',
  },
  {
    id: 'close',
    title: 'See Your Future',
    emoji: '💜',
    narration: [
      '8 in 10 people with prediabetes don\u2019t know it.',
      'If watching your Twin slump — or seeing that jagged — motivates even one person to get a fasting glucose test or swap one sugary drink for water, we win.',
      'PulseTwin — see your future self before your body shows it.',
    ],
    accent: '#F5F1E8',
    highlight: 'close',
    actionHint: 'The game will now unfold. Take control of your Twin\u2019s day.',
  },
]