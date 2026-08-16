import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState, useEffect } from 'react'
import './twin.css'

type Screen = 'landing' | 'name' | 'journey' | 'lesson' | 'quiz' | 'result' | 'dashboard' | 'reports'

type Question = {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

type DiabetesStatistics = {
  national_prevalence: number
  estimated_cases: number
  undiagnosed_cases: number
  undiagnosed_percentage: number
  units: string
}

type DiabetesCase = {
  country: string
  data_type: string
  statistics: DiabetesStatistics
  provincial_breakdown: Record<string, number>
  key_findings: Array<{
    finding: string
    value: string
    description: string
  }>
  sources: Array<{ name: string; version: string }>
  source_type: string
}

type Level = {
  id: number
  world: string
  levelLabel: string
  title: string
  fact: string
  questions: Question[]
  xp: number
}

const levels: Level[] = [
  {
    id: 1,
    world: '🌱 World 1',
    levelLabel: 'Level 1',
    title: 'Meet Diabetes',
    fact: 'Diabetes affects how your body manages blood sugar, also called glucose.',
    questions: [
      {
        question: 'What is diabetes?',
        options: ['A condition that affects how the body manages blood sugar', 'A type of vitamin deficiency', 'Only a digestive issue'],
        correctIndex: 0,
        explanation: 'Diabetes is a condition that affects how the body handles blood sugar, mainly through insulin production and glucose control.',
      },
      {
        question: 'How many types of diabetes are commonly recognized?',
        options: ['Two main types: Type 1 and Type 2', 'Only one type', 'More than five types'],
        correctIndex: 0,
        explanation: 'Type 1 and Type 2 are the most common forms of diabetes, with gestational diabetes being a third temporary type.',
      },
      {
        question: 'Can diabetes be managed?',
        options: ['Yes, with proper diet, exercise, and monitoring', 'No, it cannot be managed', 'Only with medication'],
        correctIndex: 0,
        explanation: 'Diabetes can be effectively managed through lifestyle changes and medical treatment working together.',
      },
      {
        question: 'What is the main role of the pancreas in blood sugar?',
        options: ['It produces insulin to regulate blood sugar', 'It stores all the glucose', 'It has no role in blood sugar'],
        correctIndex: 0,
        explanation: 'The pancreas produces insulin, a hormone essential for managing blood sugar levels throughout your body.',
      },
      {
        question: 'Is diabetes hereditary?',
        options: ['It can run in families, but lifestyle also matters', 'It is never hereditary', 'It is always hereditary'],
        correctIndex: 0,
        explanation: 'Having family members with diabetes increases risk, but healthy choices can help prevent or delay its onset.',
      },
    ],
    xp: 50,
  },
  {
    id: 2,
    world: '🌱 World 1',
    levelLabel: 'Level 2',
    title: 'Blood Sugar Basics',
    fact: 'Your body turns carbohydrates into glucose, which is used for energy.',
    questions: [
      {
        question: 'What happens to carbohydrates when you eat them?',
        options: ['Your body converts them into glucose for energy', 'They turn into fat immediately', 'They stay in your stomach forever'],
        correctIndex: 0,
        explanation: 'When you eat carbohydrates, your body breaks them down into glucose, which is then used as fuel for your cells.',
      },
      {
        question: 'What is blood glucose?',
        options: ['The amount of sugar in your blood', 'A type of white blood cell', 'A protein in your muscles'],
        correctIndex: 0,
        explanation: 'Blood glucose is the sugar in your bloodstream that your body uses for energy, also called blood sugar.',
      },
      {
        question: 'What is a normal blood sugar range?',
        options: ['70-100 mg/dL when fasting', 'Above 200 mg/dL always', 'Below 50 mg/dL'],
        correctIndex: 0,
        explanation: 'A fasting blood sugar of 70-100 mg/dL is generally considered normal for most people without diabetes.',
      },
      {
        question: 'What happens when blood sugar gets too high?',
        options: ['It can damage blood vessels and nerves over time', 'Nothing happens', 'Your body becomes stronger'],
        correctIndex: 0,
        explanation: 'Chronically high blood sugar can damage small blood vessels and nerves, leading to various complications.',
      },
      {
        question: 'What happens when blood sugar gets too low?',
        options: ['You may feel shaky, dizzy, or confused', 'Nothing unusual happens', 'Your muscles grow bigger'],
        correctIndex: 0,
        explanation: 'Low blood sugar (hypoglycemia) causes symptoms like shakiness, dizziness, sweating, and confusion, and needs quick treatment.',
      },
    ],
    xp: 60,
  },
  {
    id: 3,
    world: '🌱 World 1',
    levelLabel: 'Level 3',
    title: 'Understanding Insulin',
    fact: 'Insulin is a hormone that helps move glucose from the blood into cells for energy.',
    questions: [
      {
        question: 'What does insulin do in your body?',
        options: ['It helps glucose enter cells for energy', 'It creates new sugar in your body', 'It prevents you from eating food'],
        correctIndex: 0,
        explanation: 'Insulin acts like a key that helps glucose move from the bloodstream into cells where it can be used for energy or stored.',
      },
      {
        question: 'Where is insulin produced?',
        options: ['In the pancreas', 'In the heart', 'In the liver'],
        correctIndex: 0,
        explanation: 'The pancreas is an organ that produces insulin in response to rising blood sugar levels.',
      },
      {
        question: 'What is insulin resistance?',
        options: ['When cells do not respond well to insulin', 'When insulin is too strong', 'When your body has too much energy'],
        correctIndex: 0,
        explanation: 'Insulin resistance occurs when cells become less sensitive to insulin, requiring more of it to have the same effect.',
      },
      {
        question: 'How quickly does insulin work?',
        options: ['Within 15-30 minutes for regular insulin', 'It takes several hours', 'It works instantly'],
        correctIndex: 0,
        explanation: 'Different types of insulin work at different speeds; regular insulin typically starts working within 15-30 minutes.',
      },
      {
        question: 'Can the body produce less insulin over time?',
        options: ['Yes, especially with Type 2 diabetes progression', 'No, production stays constant', 'The body always produces more insulin'],
        correctIndex: 0,
        explanation: 'In Type 2 diabetes, the body may gradually produce less insulin over time as pancreatic function declines.',
      },
    ],
    xp: 70,
  },
  {
    id: 4,
    world: '🥗 World 2',
    levelLabel: 'Level 4',
    title: 'Food & Nutrition',
    fact: 'Balanced meals with fiber, protein, and healthy fats help keep blood sugar steadier.',
    questions: [
      {
        question: 'Which meal choice helps keep blood sugar stable?',
        options: ['Whole grains, vegetables, and lean protein', 'Sugary snacks and candy', 'Fried foods only'],
        correctIndex: 0,
        explanation: 'Meals with fiber, protein, and complex carbs digest slowly and help prevent rapid blood sugar spikes.',
      },
      {
        question: 'What does fiber do for blood sugar?',
        options: ['It slows down glucose absorption', 'It increases blood sugar quickly', 'It has no effect on blood sugar'],
        correctIndex: 0,
        explanation: 'Dietary fiber slows down the digestion of carbohydrates, resulting in a slower, steadier rise in blood sugar.',
      },
      {
        question: 'Which carbohydrates are better for blood sugar?',
        options: ['Complex carbs like whole grains and oats', 'White bread and refined sugars', 'High-fructose corn syrup'],
        correctIndex: 0,
        explanation: 'Complex carbohydrates have more fiber and nutrients, causing a slower, more stable rise in blood sugar compared to refined carbs.',
      },
      {
        question: 'How does protein affect blood sugar?',
        options: ['It slows glucose absorption and keeps you full longer', 'It spikes blood sugar immediately', 'It has no effect on blood sugar'],
        correctIndex: 0,
        explanation: 'Protein slows the digestion of carbohydrates, moderates blood sugar rise, and promotes longer-lasting fullness.',
      },
      {
        question: 'What is portion control important for?',
        options: ['It helps prevent blood sugar spikes from eating too much', 'Portion size does not matter', 'You should eat as much as possible'],
        correctIndex: 0,
        explanation: 'Controlling portion sizes helps prevent excessive glucose intake and keeps blood sugar levels more stable.',
      },
    ],
    xp: 80,
  },
  {
    id: 5,
    world: '🥗 World 2',
    levelLabel: 'Level 5',
    title: 'Drinks & Sugar',
    fact: 'Sugary drinks can cause a sharp rise in blood sugar very quickly.',
    questions: [
      {
        question: 'Why are sugary drinks a concern for blood sugar?',
        options: ['They cause rapid blood sugar spikes', 'They contain no calories', 'They help insulin work better'],
        correctIndex: 0,
        explanation: 'Sugary drinks provide fast-digesting sugars with no fiber or nutrients, causing sharp blood sugar spikes.',
      },
      {
        question: 'How much added sugar can a typical soda contain?',
        options: ['Around 39 grams per 12 oz can', 'No sugar at all', 'Less than 1 gram'],
        correctIndex: 0,
        explanation: 'A 12 oz can of regular soda can contain about 39 grams of sugar, far exceeding recommended daily limits.',
      },
      {
        question: 'What is a better drink choice than soda?',
        options: ['Water, unsweetened tea, or coffee', 'More sugary drinks', 'Energy drinks with more sugar'],
        correctIndex: 0,
        explanation: 'Water, unsweetened tea, and coffee have no added sugars and are healthier choices for blood sugar management.',
      },
      {
        question: 'What about artificial sweeteners?',
        options: ['They add no sugar but should be used in moderation', 'They are always the best choice', 'They are as bad as sugar'],
        correctIndex: 0,
        explanation: 'Artificial sweeteners have minimal glucose impact but should be consumed in moderation as part of a balanced diet.',
      },
      {
        question: 'How often should you drink sugary beverages?',
        options: ['Rarely or never', 'Every day is fine', 'Multiple times per day'],
        correctIndex: 0,
        explanation: 'Sugary drinks should be limited or avoided entirely to maintain stable blood sugar and overall health.',
      },
    ],
    xp: 90,
  },
  {
    id: 6,
    world: '🥗 World 2',
    levelLabel: 'Level 6',
    title: 'Physical Activity',
    fact: 'Regular physical activity helps your body use glucose more efficiently.',
    questions: [
      {
        question: 'How does exercise help with blood sugar management?',
        options: ['It helps your body use glucose more efficiently', 'It creates more sugar in your blood', 'It stops insulin from working'],
        correctIndex: 0,
        explanation: 'Exercise helps your muscles use glucose for energy without needing as much insulin, improving overall blood sugar control.',
      },
      {
        question: 'How much physical activity is recommended per week?',
        options: ['At least 150 minutes of moderate activity', 'No exercise is needed', 'Only when you feel like it'],
        correctIndex: 0,
        explanation: 'The WHO recommends at least 150 minutes of moderate aerobic activity per week for good health, including blood sugar control.',
      },
      {
        question: 'What type of exercise is good for blood sugar?',
        options: ['Both aerobic exercise and strength training', 'No exercise helps', 'Only extreme intense workouts'],
        correctIndex: 0,
        explanation: 'A combination of aerobic exercise (like walking or cycling) and strength training provides the best blood sugar benefits.',
      },
      {
        question: 'When is the best time to exercise?',
        options: ['After meals to help control blood sugar spikes', 'Exercise time does not matter', 'Only in the morning'],
        correctIndex: 0,
        explanation: 'Exercising after meals can help prevent blood sugar spikes by using the glucose your body just consumed.',
      },
      {
        question: 'Can exercise lower blood sugar too much?',
        options: ['Yes, it can cause low blood sugar if not managed', 'No, exercise never lowers blood sugar', 'Blood sugar always stays the same'],
        correctIndex: 0,
        explanation: 'Vigorous exercise can lower blood sugar significantly, so people with diabetes should monitor levels and eat if needed.',
      },
    ],
    xp: 100,
  },
]

const leaderboard = [
  { name: 'Lerato', xp: 3850 },
  { name: 'Thabo', xp: 3620 },
  { name: 'Ayanda', xp: 3450 },
  { name: 'Andiswa', xp: 2450 },
  { name: 'Kabelo', xp: 2300 },
]

type AuthMode = 'create' | 'login'

type SignedInUser = {
  email: string
  fullName: string
  signedIn: boolean
  createdAt: string
}

const signedUsersKey = 'glucoalert-signed-users'

const getStoredUsers = (): SignedInUser[] => {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(signedUsersKey)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((item): item is SignedInUser => Boolean(item && typeof item.email === 'string')) : []
  } catch {
    return []
  }
}

const persistUsers = (users: SignedInUser[]) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(signedUsersKey, JSON.stringify(users))
}

const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value)

const createShuffledIndexes = (length: number) => {
  const indexes = Array.from({ length }, (_, index) => index)

  for (let index = indexes.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[indexes[index], indexes[swapIndex]] = [indexes[swapIndex], indexes[index]]
  }

  return indexes
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [screenHistory, setScreenHistory] = useState<Screen[]>(['landing'])
  const [authMode, setAuthMode] = useState<AuthMode>('create')
  const [nameDraft, setNameDraft] = useState('')
  const [emailDraft, setEmailDraft] = useState('')
  const [authError, setAuthError] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answerResult, setAnswerResult] = useState<boolean | null>(null)
  const [xp, setXp] = useState(0)
  const [streak, setStreak] = useState(0)
  const [lastCorrectDate, setLastCorrectDate] = useState<string | null>(null)
  const [rank, setRank] = useState(0)
  const [unlockedLevel, setUnlockedLevel] = useState(1)
  const [diabetesData, setDiabetesData] = useState<DiabetesCase | null>(null)
  const [loadingReports, setLoadingReports] = useState(false)
  const [levelDecks, setLevelDecks] = useState<Record<number, number[]>>({})

  const currentLevel = levels[currentLevelIndex]
  const currentLevelDeck = levelDecks[currentLevel.id] ?? []
  const currentQuestionIndexInDeck = currentLevelDeck[currentQuestionIndex] ?? 0
  const currentQuestion = currentLevel.questions[currentQuestionIndexInDeck]
  const canGoBack = screenHistory.length > 1

  const currentProgress = useMemo(() => Math.min(100, ((currentLevelIndex + 1) / levels.length) * 100), [currentLevelIndex])

  const navigateTo = (nextScreen: Screen) => {
    setScreenHistory((previous) => [...previous, nextScreen])
    setScreen(nextScreen)
  }

  const goBack = () => {
    setScreenHistory((previous) => {
      if (previous.length <= 1) return previous

      const nextScreen = previous[previous.length - 2]
      setScreen(nextScreen)
      return previous.slice(0, -1)
    })
  }

  const goHome = () => {
    setCurrentLevelIndex(0)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setAnswerResult(null)
    setScreen('journey')
    setScreenHistory(['journey'])
  }

  const fetchDiabetesReports = async () => {
    setLoadingReports(true)
    try {
      const response = await fetch('http://localhost:8000/api/sa-diabetes-cases')
      if (response.ok) {
        const data = await response.json()
        setDiabetesData(data)
      }
    } catch (error) {
      console.error('Failed to fetch diabetes reports:', error)
    } finally {
      setLoadingReports(false)
    }
  }

  useEffect(() => {
    if (screen === 'reports' && !diabetesData && !loadingReports) {
      fetchDiabetesReports()
    }
  }, [screen, diabetesData, loadingReports])

  const openAuthScreen = (mode: AuthMode) => {
    setAuthMode(mode)
    setAuthError('')
    setNameDraft(playerName || '')
    setEmailDraft('')
    navigateTo('name')
  }

  const submitAuth = () => {
    const trimmedName = nameDraft.trim()
    const trimmedEmail = emailDraft.trim().toLowerCase()

    if (authMode === 'create') {
      if (!trimmedName) {
        setAuthError('Please enter your full name.')
        return
      }

      if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
        setAuthError('Please enter a valid email address.')
        return
      }

      const users = getStoredUsers()
      const existingUser = users.find((user) => user.email === trimmedEmail)

      if (existingUser?.signedIn) {
        setAuthError('This account is already signed in. Please sign out first or use a different account.')
        return
      }

      const nextUsers = existingUser
        ? users.map((user) => (user.email === trimmedEmail ? { ...user, fullName: trimmedName, signedIn: false } : user))
        : [...users, { email: trimmedEmail, fullName: trimmedName, signedIn: false, createdAt: new Date().toISOString() }]

      persistUsers(nextUsers)
      setPlayerName(trimmedName)
      setNameDraft(trimmedName)
      setAuthError('')
      navigateTo('journey')
      return
    }

    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      setAuthError('Please enter your email to sign in.')
      return
    }

    const users = getStoredUsers()
    const existingUser = users.find((user) => user.email === trimmedEmail)

    if (!existingUser) {
      setAuthError('We could not find that email. Please create an account first.')
      return
    }

    // Check if a different user is already signed in
    const activeUser = users.find((user) => user.signedIn && user.email !== trimmedEmail)
    if (activeUser) {
      setAuthError(`${activeUser.fullName} is already signed in. Please sign out first to switch accounts.`)
      return
    }

    const nextUsers = users.map((user) =>
      user.email === trimmedEmail ? { ...user, signedIn: true } : user,
    )

    persistUsers(nextUsers)
    setPlayerName(existingUser.fullName || trimmedName || 'Player')
    setNameDraft(existingUser.fullName || trimmedName || 'Player')
    setAuthError('')
    navigateTo('journey')
  }

  const signOut = () => {
    const users = getStoredUsers()
    persistUsers(users.map((user) => ({ ...user, signedIn: false })))
    setPlayerName('')
    setNameDraft('')
    setEmailDraft('')
    setStreak(0)
    setLastCorrectDate(null)
    setScreen('landing')
    setScreenHistory(['landing'])
  }

  const selectLevel = (index: number) => {
    if (index > unlockedLevel - 1) return
    setCurrentLevelIndex(index)
    navigateTo('lesson')
  }

  const startLesson = () => {
    const shuffledIndexes = createShuffledIndexes(currentLevel.questions.length)
    setLevelDecks((previous) => ({ ...previous, [currentLevel.id]: shuffledIndexes }))
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setAnswerResult(null)
    navigateTo('quiz')
  }

  const submitAnswer = (optionIndex: number) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(optionIndex)
    const correct = optionIndex === currentQuestion.correctIndex
    setAnswerResult(correct)

    if (correct) {
      const xpPerQuestion = currentLevel.xp / currentLevel.questions.length
      const todayKey = new Date().toISOString().slice(0, 10)
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayKey = yesterday.toISOString().slice(0, 10)

      if (!lastCorrectDate) {
        setStreak(1)
        setLastCorrectDate(todayKey)
      } else if (lastCorrectDate === todayKey) {
        setLastCorrectDate(todayKey)
      } else if (lastCorrectDate === yesterdayKey) {
        setStreak((value) => value + 1)
        setLastCorrectDate(todayKey)
      } else {
        setStreak(1)
        setLastCorrectDate(todayKey)
      }

      setXp((value) => value + xpPerQuestion)
      setRank((value) => Math.max(1, value - 1))
    }

    setScreen('result')
  }

  const retryQuiz = () => {
    setSelectedAnswer(null)
    setAnswerResult(null)
    setScreen('quiz')
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < currentLevel.questions.length - 1) {
      setCurrentQuestionIndex((value) => value + 1)
      setSelectedAnswer(null)
      setAnswerResult(null)
      setScreen('quiz')
    } else {
      continueFromResult()
    }
  }

  useEffect(() => {
    if (!levelDecks[currentLevel.id]) {
      setLevelDecks((previous) => ({
        ...previous,
        [currentLevel.id]: createShuffledIndexes(currentLevel.questions.length),
      }))
    }
  }, [currentLevel.id, currentLevel.questions.length, levelDecks])

  const continueFromResult = () => {
    if (answerResult) {
      const nextUnlocked = Math.min(levels.length, Math.max(unlockedLevel, currentLevelIndex + 2))
      setUnlockedLevel(nextUnlocked)

      if (currentLevelIndex === levels.length - 1) {
        setScreen('dashboard')
        return
      }

      setCurrentLevelIndex((value) => Math.min(value + 1, levels.length - 1))
      setCurrentQuestionIndex(0)
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
          <svg viewBox="0 0 120 120" className="graph-mascot" aria-hidden="true">
            <path d="M16 82L38 62L56 72L76 36L98 28L104 22" />
            <path d="M16 94H104" />
            <path d="M16 18V94" />
            <circle cx="38" cy="62" r="4" />
            <circle cx="56" cy="72" r="4" />
            <circle cx="76" cy="36" r="4" />
            <circle cx="98" cy="28" r="4" />
          </svg>
        </motion.div>
      </div>

      <div className="brand-lockup">
        <div className="brand-badge">GlucoAlert</div>
        <h1 className="hero-title">Learn. Play. Level Up. Take Control.</h1>
        <p className="hero-subtitle">A diabetes education game that turns knowledge into wins, streaks, and healthy habits.</p>
      </div>

      <div className="cta-stack">
        <button onClick={() => openAuthScreen('create')} className="primary-button">Create Account</button>
        <button onClick={() => openAuthScreen('login')} className="secondary-button">Login</button>
      </div>
    </div>
  )

  const renderNameScreen = () => (
    <div className="game-shell panel-glass">
      <div className="step-pill">{authMode === 'create' ? 'Create account' : 'Welcome back'}</div>
      <h2 className="panel-title">{authMode === 'create' ? 'Create your account' : 'Sign in to continue'}</h2>

      {authMode === 'create' && (
        <div className="auth-field-group">
          <label className="field-label">Full name</label>
          <input
            value={nameDraft}
            onChange={(event) => setNameDraft(event.target.value)}
            className="name-input"
            placeholder="Enter your full name"
          />
        </div>
      )}

      <div className="auth-field-group">
        <label className="field-label">Email address</label>
        <input
          value={emailDraft}
          onChange={(event) => setEmailDraft(event.target.value)}
          className="name-input"
          placeholder="you@example.com"
          type="email"
        />
      </div>

      {authError && <div className="auth-error">{authError}</div>}

      <div className="inline-actions">
        <button type="button" onClick={submitAuth} className="primary-button">
          {authMode === 'create' ? 'Create account' : 'Sign in'}
        </button>
      </div>
    </div>
  )

  const renderJourney = () => (
    <div className="game-shell panel-glass">
      <div className="welcome-row">
        <div>
          <div className="section-label">Welcome, {playerName}! 👋</div>
          <h2 className="panel-title">Let&apos;s learn about diabetes</h2>
        </div>
        <div className="xp-badge">⭐ {xp} XP</div>
      </div>

      <div className="journey-layout">
        <div className="mascot-panel">
          <motion.div
            className="mascot-avatar"
            animate={{ y: currentLevelIndex === 0 ? [0, -10, 0] : [0, -18, 0] }}
            transition={{ duration: 0.7, repeat: 1, ease: 'easeInOut' }}
          >
            <div className="mascot-head">
              <span className="eye left" />
              <span className="eye right" />
              <span className="smile" />
            </div>
            <div className="mascot-body" />
            <div className="mascot-arm left" />
            <div className="mascot-arm right" />
            <div className="mascot-leg left" />
            <div className="mascot-leg right" />
          </motion.div>
          <div className="mascot-meter">
            <span>{xp}</span>
            <small>XP</small>
          </div>
        </div>

        <div className="level-map">
          {levels.map((level, index) => {
            const unlocked = index <= unlockedLevel - 1
            const isCurrent = index === currentLevelIndex
            const stepOffset = index * 8

            return (
              <button
                key={level.id}
                onClick={() => selectLevel(index)}
                className={`level-node ${unlocked ? 'unlocked' : 'locked'} ${isCurrent ? 'current' : ''}`}
                style={{ marginLeft: `${stepOffset}px` }}
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
      </div>

      <div className="dashboard-mini-card">
        <div className="mini-title">Continue Learning</div>
        <div className="mini-level">🌱 Level {Math.min(unlockedLevel, levels.length)} · {levels[Math.min(unlockedLevel - 1, levels.length - 1)].title}</div>
        <div className="progress-track">
          <motion.div className="progress-fill" animate={{ width: `${currentProgress}%` }} />
        </div>
        <button onClick={() => selectLevel(Math.min(unlockedLevel - 1, levels.length - 1))} className="primary-button small-button">Continue</button>
      </div>

      <button onClick={() => navigateTo('reports')} className="primary-button">📊 View Health Reports</button>
    </div>
  )

  const renderLesson = () => (
    <div className="game-shell panel-glass">
      <div className="inline-actions">
        <button onClick={goHome} className="secondary-button">🏠 Home</button>
      </div>
      <div className="step-pill">{currentLevel.world}</div>
      <h2 className="panel-title">{currentLevel.levelLabel} — {currentLevel.title}</h2>
      <div className="lesson-card">
        <h3>{currentLevel.title}</h3>
        <p>{currentLevel.fact}</p>
        <div className="fact-pills">
          <span>🎨 Easy to understand</span>
          <span>⚡ Key concept</span>
          <span>🧠 Important fact</span>
        </div>
      </div>
      <button onClick={startLesson} className="primary-button">READY TO PLAY →</button>
    </div>
  )

  const renderQuiz = () => (
    <div className="game-shell panel-glass quiz-panel">
      <div className="inline-actions">
        <button onClick={goHome} className="secondary-button">🏠 Home</button>
      </div>
      <div className="quiz-header">
        <div className="step-pill">⭐ {currentLevel.levelLabel}</div>
        <div className="question-counter">Question {currentQuestionIndex + 1} / {currentLevel.questions.length}</div>
      </div>

      <div className="progress-track">
        <motion.div className="progress-fill" animate={{ width: `${((currentQuestionIndex + 1) / currentLevel.questions.length) * 100}%` }} />
      </div>

      <h2 className="quiz-question">{currentQuestion.question}</h2>

      <div className="option-list">
        {currentQuestion.options.map((option, index) => (
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
      <div className="inline-actions">
        <button onClick={goHome} className="secondary-button">🏠 Home</button>
      </div>
      {answerResult ? (
        <>
          <div className="result-emoji">🎉</div>
          <h2 className="panel-title">AMAZING, {playerName}!</h2>
          <p className="celebration-line">You nailed it! 🧠✨</p>
          <div className="result-stats">
            <span>+{Math.round(currentLevel.xp / currentLevel.questions.length)} XP</span>
            <span>🔥 {streak} question streak</span>
          </div>
          <div className="explanation-box">
            <p>{currentQuestion.explanation}</p>
          </div>
          <button onClick={nextQuestion} className="primary-button">
            {currentQuestionIndex === currentLevel.questions.length - 1 ? 'LEVEL COMPLETE →' : 'NEXT QUESTION →'}
          </button>
        </>
      ) : (
        <>
          <div className="result-emoji wrong">❌</div>
          <h2 className="panel-title">Not quite!</h2>
          <p className="celebration-line">Don&apos;t give up! 💪</p>
          <div className="explanation-box">
            <p>Correct answer: {currentQuestion.options[currentQuestion.correctIndex]}</p>
            <p>{currentQuestion.explanation}</p>
          </div>
          <div className="inline-actions">
            <button onClick={retryQuiz} className="secondary-button">TRY AGAIN</button>
            <button onClick={nextQuestion} className="primary-button">
              {currentQuestionIndex === currentLevel.questions.length - 1 ? 'NEXT LEVEL' : 'NEXT QUESTION'}
            </button>
          </div>
        </>
      )}
    </div>
  )

  const renderReports = () => (
    <div className="game-shell panel-glass">
      <div className="inline-actions">
        <button onClick={goHome} className="secondary-button">🏠 Home</button>
      </div>
      <h2 className="panel-title">📊 South Africa Diabetes Reports</h2>
      
      {loadingReports ? (
        <div className="lesson-card">
          <p>Loading latest diabetes statistics for South Africa...</p>
        </div>
      ) : diabetesData ? (
        <>
          <div className="lesson-card">
            <h3>Current Statistics</h3>
            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-value">{diabetesData.statistics.national_prevalence}%</div>
                <div className="stat-label">National Prevalence</div>
              </div>
              <div className="stat-box">
                <div className="stat-value">4.5M</div>
                <div className="stat-label">Estimated Cases</div>
              </div>
              <div className="stat-box">
                <div className="stat-value">{diabetesData.statistics.undiagnosed_percentage}%</div>
                <div className="stat-label">Undiagnosed</div>
              </div>
            </div>
          </div>

          <div className="lesson-card">
            <h3>Key Findings</h3>
            {diabetesData.key_findings.map((finding, index) => (
              <div key={index} className="finding-item">
                <strong>{finding.finding}:</strong> {finding.value}
                <p>{finding.description}</p>
              </div>
            ))}
          </div>

          <div className="lesson-card">
            <h3>Provincial Breakdown (Top 5)</h3>
            <div className="province-list">
              {Object.entries(diabetesData.provincial_breakdown)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([province, rate]) => (
                  <div key={province} className="province-item">
                    <span>{province}</span>
                    <span className="rate">{rate}%</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="lesson-card">
            <h3>Data Sources</h3>
            <p className="source-type">{diabetesData.source_type}</p>
            <ul>
              {diabetesData.sources.map((source, index) => (
                <li key={index}>{source.name} ({source.version})</li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div className="lesson-card">
          <p>Unable to load diabetes reports. Please try again.</p>
        </div>
      )}

      <button onClick={goHome} className="primary-button" style={{ marginTop: '20px' }}>Back to Journey</button>
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
          {screen !== 'landing' && canGoBack && (
            <button type="button" onClick={goBack} className="back-button">← Back</button>
          )}
          <div className="brand-mark" aria-label="GlucoAlert logo">
            <svg viewBox="0 0 64 64" className="brand-mark-icon" aria-hidden="true">
              <path d="M8 45L18 36L27 41L38 25L50 18L56 16" />
              <path d="M8 50H56" />
              <circle cx="18" cy="36" r="2.5" />
              <circle cx="27" cy="41" r="2.5" />
              <circle cx="38" cy="25" r="2.5" />
              <circle cx="50" cy="18" r="2.5" />
            </svg>
            <span>GlucoAlert</span>
          </div>
              <div className="topbar-stats">
            <span>⭐ {xp} XP</span>
            <span>🔥 {streak} day streak</span>
            {screen !== 'landing' && (
              <button type="button" onClick={signOut} className="sign-out-button">Sign out</button>
            )}
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
            {screen === 'journey' && renderJourney()}
            {screen === 'lesson' && renderLesson()}
            {screen === 'quiz' && renderQuiz()}
            {screen === 'result' && renderResult()}
            {screen === 'dashboard' && renderDashboard()}
            {screen === 'reports' && renderReports()}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  )
}