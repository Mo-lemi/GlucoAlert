import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import LivingTwin from './components/LivingTwin'
import type { ActionKey, Band } from './types'
import './twin.css'

type AgeGroup = 'child' | 'teen' | 'adult'
type Screen = 'landing' | 'name' | 'age' | 'journey' | 'lesson' | 'quiz' | 'result' | 'dashboard'

type Level = {
  id: number
  world: string
  levelLabel: string
  title: string
  fact: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  xp: number
}

const ageGroupInfo: Record<AgeGroup, { title: string; description: string; question: string; options: string[] }> = {
  child: {
    title: 'Child',
    description: 'Learning the basics',
    question: 'Which drink is a healthier everyday choice?',
    options: ['Water', 'Fizzy drink', 'Energy drink'],
  },
  teen: {
    title: 'Teen',
    description: 'Understanding your health',
    question: 'Why can regular physical activity help reduce the risk of type 2 diabetes?',
    options: [
      'It helps the body use insulin more effectively',
      'It removes all sugar from the body',
      'It means you can never develop diabetes',
    ],
  },
  adult: {
    title: 'Adult',
    description: 'Taking control of your health',
    question: 'Which combination can increase the risk of developing type 2 diabetes?',
    options: [
      'Physical inactivity + unhealthy diet',
      'Drinking water + regular activity',
      'Getting enough sleep + balanced meals',
    ],
  },
}

const levels: Level[] = [
  {
    id: 1,
    world: '🌱 World 1',
    levelLabel: 'Level 1',
    title: 'Meet Diabetes',
    fact: 'Diabetes affects how your body manages blood sugar, also called glucose.',
    question: 'What is diabetes?',
    options: ['A condition that affects how the body manages blood sugar', 'A type of vitamin', 'A heart rhythm only'],
    correctIndex: 0,
    explanation: 'Diabetes is a condition that affects how the body handles blood sugar, mainly through insulin and glucose balance.',
    xp: 100,
  },
  {
    id: 2,
    world: '🌱 World 1',
    levelLabel: 'Level 2',
    title: 'Blood Sugar Basics',
    fact: 'Your body turns carbohydrates into glucose, which is used for energy.',
    question: 'What is blood sugar?',
    options: ['The amount of glucose in your blood', 'A type of protein', 'A heart beat count'],
    correctIndex: 0,
    explanation: 'Blood sugar is the amount of glucose in your bloodstream, which your body uses as a main energy source.',
    xp: 120,
  },
  {
    id: 3,
    world: '🌱 World 1',
    levelLabel: 'Level 3',
    title: 'Understanding Insulin',
    fact: 'Insulin helps move glucose from the blood into cells for energy.',
    question: 'What is insulin mainly used for?',
    options: ['To carry oxygen', 'To help glucose get into cells', 'To make protein'],
    correctIndex: 1,
    explanation: 'Insulin acts like a key that helps glucose move from the bloodstream into cells where it can be used for energy.',
    xp: 150,
  },
  {
    id: 4,
    world: '🥗 World 2',
    levelLabel: 'Level 4',
    title: 'Food & Nutrition',
    fact: 'Balanced meals with fiber, protein, and healthy fats help keep blood sugar steadier.',
    question: 'Which meal is a healthier choice?',
    options: ['Whole grains + vegetables + lean protein', 'Only fizzy drinks', 'Candy and chips'],
    correctIndex: 0,
    explanation: 'Meals with fiber, protein, and balanced carbs are more steady for blood sugar than sugary, highly processed snacks.',
    xp: 180,
  },
  {
    id: 5,
    world: '🥗 World 2',
    levelLabel: 'Level 5',
    title: 'Drinks & Sugar',
    fact: 'Sugary drinks can cause a sharp rise in blood sugar with little nutrition.',
    question: 'Which drink is a healthier everyday choice?',
    options: ['Water', 'Fizzy drink', 'Energy drink'],
    correctIndex: 0,
    explanation: 'Water is a great everyday choice because it does not contain added sugar and helps keep you hydrated.',
    xp: 190,
  },
  {
    id: 6,
    world: '🥗 World 2',
    levelLabel: 'Level 6',
    title: 'Portion Size',
    fact: 'Portion size matters because even healthy foods can affect blood sugar in large amounts.',
    question: 'Which habit supports healthy blood sugar?',
    options: ['Listening to portions and balanced meals', 'Eating huge servings of snacks', 'Skipping meals all day'],
    correctIndex: 0,
    explanation: 'Balanced portions and regular meals help prevent big blood sugar swings.',
    xp: 200,
  },
]

const leaderboard = [
  { name: 'Lerato', xp: 3850 },
  { name: 'Thabo', xp: 3620 },
  { name: 'Ayanda', xp: 3450 },
  { name: 'Andiswa', xp: 2450 },
  { name: 'Kabelo', xp: 2300 },
]

const habitCards: {
  key: ActionKey
  label: string
  kind: 'good' | 'bad'
  bonus: number
  message: string
}[] = [
  { key: 'goodmeal', label: 'Ate a balanced breakfast', kind: 'good', bonus: 45, message: 'Amazing! Fiber-rich meals help keep blood sugar steadier.' },
  { key: 'exercise', label: 'Went for a 20-minute walk', kind: 'good', bonus: 60, message: 'You’re on fire! Movement helps the body use insulin better.' },
  { key: 'sleep', label: 'Slept 8 hours', kind: 'good', bonus: 50, message: 'Great job! Rest helps regulate stress and appetite.' },
  { key: 'goodmeal', label: 'Drank water instead of soda', kind: 'good', bonus: 35, message: 'Perfect choice! Water supports everyday hydration without added sugar.' },
  { key: 'junk', label: 'Had sugary soda', kind: 'bad', bonus: 0, message: 'Not quite — your body can recover with a better next choice. Try water or a protein snack.' },
  { key: 'sedentary', label: 'Sat all day without moving', kind: 'bad', bonus: 0, message: 'You’re learning! A short walk can help reset your energy and blood sugar.' },
  { key: 'stress', label: 'Skipped meals while feeling stressed', kind: 'bad', bonus: 0, message: 'You’ve got this — regular meals and breaks help your energy stay balanced.' },
]

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [nameDraft, setNameDraft] = useState('Andiswa')
  const [playerName, setPlayerName] = useState('Andiswa')
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('teen')
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answerResult, setAnswerResult] = useState<boolean | null>(null)
  const [xp, setXp] = useState(2450)
  const [streak, setStreak] = useState(7)
  const [rank, setRank] = useState(7)
  const [unlockedLevel, setUnlockedLevel] = useState(1)
  const [lastAction, setLastAction] = useState<ActionKey | null>(null)
  const [habitSync, setHabitSync] = useState(74)
  const [habitFeedback, setHabitFeedback] = useState<{
    kind: 'good' | 'bad'
    title: string
    message: string
  } | null>(null)

  const currentLevel = levels[currentLevelIndex]
  const ageProfile = ageGroupInfo[ageGroup]

  const currentProgress = useMemo(() => Math.min(100, ((currentLevelIndex + 1) / levels.length) * 100), [currentLevelIndex])
  const twinBand: Band = habitSync >= 70 ? 'high' : habitSync >= 40 ? 'mid' : 'low'

  const startGuestDemo = () => {
    setPlayerName('Guest')
    setNameDraft('Guest')
    setScreen('journey')
  }

  const continueToAgeSelection = () => {
    const trimmed = nameDraft.trim() || 'Andiswa'
    setPlayerName(trimmed)
    setScreen('age')
  }

  const finishProfile = () => {
    setScreen('journey')
  }

  const selectLevel = (index: number) => {
    if (index > unlockedLevel - 1) return
    setCurrentLevelIndex(index)
    setScreen('lesson')
  }

  const startLesson = () => {
    setSelectedAnswer(null)
    setAnswerResult(null)
    setScreen('quiz')
  }

  const submitAnswer = (optionIndex: number) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(optionIndex)
    const correct = optionIndex === currentLevel.correctIndex
    setAnswerResult(correct)

    if (correct) {
      setXp((value) => value + currentLevel.xp)
      setStreak((value) => value + 1)
      setRank((value) => Math.max(1, value - 1))
    }

    setScreen('result')
  }

  const retryQuiz = () => {
    setSelectedAnswer(null)
    setAnswerResult(null)
    setScreen('quiz')
  }

  const continueFromResult = () => {
    if (answerResult) {
      const nextUnlocked = Math.min(levels.length, Math.max(unlockedLevel, currentLevelIndex + 2))
      setUnlockedLevel(nextUnlocked)

      if (currentLevelIndex === levels.length - 1) {
        setScreen('dashboard')
        return
      }

      setCurrentLevelIndex((value) => Math.min(value + 1, levels.length - 1))
    }

    setScreen('lesson')
  }

  const renderLanding = () => (
    <div className="game-shell hero-panel">
      <div className="mascot-orbit">
        <motion.div
          className="mascot-card"
          animate={{ y: [0, -10, 0], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="mascot-emoji">🩺</span>
        </motion.div>
      </div>

      <div className="brand-lockup">
        <div className="brand-badge">GlucoAlert</div>
        <h1 className="hero-title">Learn. Play. Level Up. Take Control.</h1>
        <p className="hero-subtitle">A diabetes education game that turns knowledge into wins, streaks, and healthy habits.</p>
      </div>

      <div className="cta-stack">
        <button onClick={() => setScreen('name')} className="primary-button">Create Account</button>
        <button onClick={() => setScreen('name')} className="secondary-button">Login</button>
        <button onClick={startGuestDemo} className="guest-button">Guest / Demo Mode</button>
      </div>
    </div>
  )

  const renderNameScreen = () => (
    <div className="game-shell panel-glass">
      <div className="step-pill">Step 1 of 2</div>
      <h2 className="panel-title">What&apos;s your name?</h2>
      <input
        value={nameDraft}
        onChange={(event) => setNameDraft(event.target.value)}
        className="name-input"
        placeholder="Enter your name"
      />
      <div className="inline-actions">
        <button onClick={continueToAgeSelection} className="primary-button">Continue</button>
      </div>
    </div>
  )

  const renderAgeScreen = () => (
    <div className="game-shell panel-glass">
      <div className="step-pill">Step 2 of 2</div>
      <h2 className="panel-title">Nice to meet you, {playerName}! 🎉</h2>
      <p className="section-label">Choose your learning journey</p>
      <div className="age-grid">
        {(Object.keys(ageGroupInfo) as AgeGroup[]).map((group) => {
          const info = ageGroupInfo[group]
          const isSelected = ageGroup === group

          return (
            <button
              key={group}
              onClick={() => setAgeGroup(group)}
              className={`age-card ${isSelected ? 'selected' : ''}`}
            >
              <div className="age-icon">{group === 'child' ? '🧒' : group === 'teen' ? '🧑' : '👩'}</div>
              <div className="age-name">{info.title}</div>
              <div className="age-description">{info.description}</div>
            </button>
          )
        })}
      </div>
      <button onClick={finishProfile} className="primary-button">Start Adventure</button>
    </div>
  )

  const handleHabitChoice = (entry: { key: ActionKey; kind: 'good' | 'bad'; bonus: number; message: string }) => {
    setLastAction(entry.key)

    if (entry.kind === 'good') {
      setXp((value) => value + entry.bonus)
      setHabitSync((value) => Math.min(100, value + 8))
      setHabitFeedback({
        kind: 'good',
        title: 'You’re on fire! ✨',
        message: entry.message,
      })
      return
    }

    setHabitSync((value) => Math.max(0, value - 10))
    setHabitFeedback({
      kind: 'bad',
      title: 'Not quite — you’ve got this! 💪',
      message: entry.message,
    })
  }

  const renderJourney = () => (
    <div className="game-shell panel-glass">
      <div className="welcome-row">
        <div>
          <div className="section-label">Welcome, {playerName}! 👋</div>
          <h2 className="panel-title">Your diabetes adventure starts here.</h2>
        </div>
        <div className="xp-badge">⭐ {xp} XP</div>
      </div>

      <div className="habit-layout">
        <div className="habit-twin-panel">
          <LivingTwin
            syncScore={habitSync}
            band={twinBand}
            lastAction={lastAction}
            actionCount={lastAction ? 1 : 0}
            revealMode={false}
            activityType={null}
          />
        </div>

        <div className="habit-panel">
          <div className="mini-title">Real-life habit check-in</div>
          <div className="habit-grid">
            {habitCards.map((entry) => (
              <button
                key={entry.label}
                className={`habit-button ${entry.kind}`}
                onClick={() => handleHabitChoice(entry)}
              >
                <span>{entry.label}</span>
                <strong>{entry.kind === 'good' ? `+${entry.bonus} XP` : 'Learn & improve'}</strong>
              </button>
            ))}
          </div>

          {habitFeedback && (
            <div className={`habit-feedback ${habitFeedback.kind}`}>
              <strong>{habitFeedback.title}</strong>
              <p>{habitFeedback.message}</p>
            </div>
          )}
        </div>
      </div>

      <div className="level-map">
        {levels.map((level, index) => {
          const unlocked = index <= unlockedLevel - 1
          const isCurrent = index === currentLevelIndex
          return (
            <button
              key={level.id}
              onClick={() => selectLevel(index)}
              className={`level-node ${unlocked ? 'unlocked' : 'locked'} ${isCurrent ? 'current' : ''}`}
            >
              <div className="level-emoji">{index < 3 ? '🏆' : index < 6 ? '⭐' : '🔒'}</div>
              <div className="level-copy">
                <strong>{level.levelLabel}</strong>
                <span>{level.title}</span>
              </div>
            </button>
          )
        })}
      </div>

      <div className="dashboard-mini-card">
        <div className="mini-title">Continue Learning</div>
        <div className="mini-level">🌱 Level {Math.min(unlockedLevel, levels.length)} · {levels[Math.min(unlockedLevel - 1, levels.length - 1)].title}</div>
        <div className="progress-track">
          <motion.div className="progress-fill" animate={{ width: `${currentProgress}%` }} />
        </div>
        <button onClick={() => selectLevel(Math.min(unlockedLevel - 1, levels.length - 1))} className="primary-button small-button">Continue</button>
      </div>
    </div>
  )

  const renderLesson = () => (
    <div className="game-shell panel-glass">
      <div className="step-pill">{currentLevel.world}</div>
      <h2 className="panel-title">{currentLevel.levelLabel} — {currentLevel.title}</h2>
      <div className="lesson-card">
        <h3>What is diabetes?</h3>
        <p>{currentLevel.fact}</p>
        <div className="fact-pills">
          <span>🎨 Illustrations</span>
          <span>⚡ Short facts</span>
          <span>🧠 Simple examples</span>
        </div>
      </div>
      <button onClick={startLesson} className="primary-button">READY TO PLAY →</button>
    </div>
  )

  const renderQuiz = () => (
    <div className="game-shell panel-glass quiz-panel">
      <div className="quiz-header">
        <div className="step-pill">⭐ {currentLevel.levelLabel}</div>
        <div className="question-counter">Question {currentLevelIndex + 1} / {levels.length}</div>
      </div>

      <div className="progress-track">
        <motion.div className="progress-fill" animate={{ width: `${((currentLevelIndex + 1) / levels.length) * 100}%` }} />
      </div>

      <h2 className="quiz-question">{ageProfile.question}</h2>

      <div className="option-list">
        {currentLevel.options.map((option, index) => (
          <button
            key={option}
            onClick={() => submitAnswer(index)}
            className={`answer-option ${selectedAnswer === index ? 'selected' : ''}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )

  const renderResult = () => (
    <div className="game-shell panel-glass result-panel">
      {answerResult ? (
        <>
          <div className="result-emoji">🎉</div>
          <h2 className="panel-title">AMAZING, {playerName}!</h2>
          <p className="celebration-line">You nailed it! 🧠✨</p>
          <div className="result-stats">
            <span>+{currentLevel.xp} XP</span>
            <span>🔥 {streak} question streak</span>
          </div>
          <div className="explanation-box">
            <p>{currentLevel.explanation}</p>
          </div>
          <button onClick={continueFromResult} className="primary-button">CONTINUE →</button>
        </>
      ) : (
        <>
          <div className="result-emoji wrong">❌</div>
          <h2 className="panel-title">Not quite!</h2>
          <p className="celebration-line">Don&apos;t give up! 💪</p>
          <div className="explanation-box">
            <p>Correct answer: {currentLevel.options[currentLevel.correctIndex]}</p>
            <p>{currentLevel.explanation}</p>
          </div>
          <div className="inline-actions">
            <button onClick={retryQuiz} className="secondary-button">TRY AGAIN</button>
            <button onClick={continueFromResult} className="primary-button">CONTINUE</button>
          </div>
        </>
      )}
    </div>
  )

  const renderDashboard = () => (
    <div className="game-shell panel-glass dashboard-panel">
      <div className="dashboard-header">
        <div>
          <div className="section-label">Welcome back, {playerName}!</div>
          <h2 className="panel-title">Your progress is glowing.</h2>
        </div>
        <div className="xp-badge">⭐ {xp} XP</div>
      </div>

      <div className="overview-row">
        <div className="stat-card">
          <span className="stat-label">🔥 Streak</span>
          <strong>{streak} Days</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">🏆 Rank</span>
          <strong># {rank} Today</strong>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="mini-title">Continue Learning</div>
        <div className="mini-level">🌱 Level {Math.min(unlockedLevel, levels.length)} · {levels[Math.min(unlockedLevel - 1, levels.length - 1)].title}</div>
        <div className="progress-track">
          <motion.div className="progress-fill" animate={{ width: `${Math.min(100, (unlockedLevel / levels.length) * 100)}%` }} />
        </div>
        <button onClick={() => selectLevel(Math.min(unlockedLevel - 1, levels.length - 1))} className="primary-button small-button">CONTINUE</button>
      </div>

      <div className="challenge-card">
        <div className="mini-title">🎯 Daily Challenge</div>
        <div>Answer 5 diabetes questions</div>
        <strong>Reward: +500 XP</strong>
      </div>

      <div className="leaderboard-card">
        <div className="mini-title">🏆 Today&apos;s Players</div>
        {leaderboard.map((player, index) => (
          <div key={player.name} className={`leader-row ${player.name === playerName ? 'you' : ''}`}>
            <span>#{index + 1}</span>
            <span>{player.name}</span>
            <strong>{player.xp}</strong>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="app-shell">
      <div className="backdrop backdrop-a" />
      <div className="backdrop backdrop-b" />

      <div className="app-frame">
        <header className="topbar">
          <div className="brand-mark">GlucoAlert</div>
          <div className="topbar-stats">
            <span>⭐ {xp} XP</span>
            <span>🔥 {streak} day streak</span>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.main
            key={screen}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.25 }}
          >
            {screen === 'landing' && renderLanding()}
            {screen === 'name' && renderNameScreen()}
            {screen === 'age' && renderAgeScreen()}
            {screen === 'journey' && renderJourney()}
            {screen === 'lesson' && renderLesson()}
            {screen === 'quiz' && renderQuiz()}
            {screen === 'result' && renderResult()}
            {screen === 'dashboard' && renderDashboard()}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  )
}