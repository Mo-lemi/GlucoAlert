import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QUIZ_ITEMS } from '../data'
import { useStore } from '../store'

export default function Quiz() {
  const quizIndex = useStore((s) => s.quizIndex)
  const answerQuiz = useStore((s) => s.answerQuiz)
  const awarenessPoints = useStore((s) => s.awarenessPoints)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)

  const item = QUIZ_ITEMS[quizIndex]
  if (!item) return null

  const handleSelect = (index: number) => {
    if (answered) return
    setSelected(index)
    setAnswered(true)
    answerQuiz(index === item.correctIndex)
  }

  const handleNext = () => {
    setSelected(null)
    setAnswered(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-surface border border-warm/10 p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-lg font-semibold">Awareness Quiz</h3>
        <span className="font-mono text-xs text-honey">+{awarenessPoints} pts</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <p className="text-sm font-medium mb-3">{item.question}</p>

          <div className="space-y-2">
            {item.options.map((option, i) => {
              const isCorrect = i === item.correctIndex
              const isSelected = i === selected
              let style = 'border-warm/10 hover:border-honey/40'
              if (answered) {
                if (isCorrect) style = 'border-mint/60 bg-mint/10 text-mint'
                else if (isSelected) style = 'border-coral/60 bg-coral/10 text-coral'
                else style = 'border-warm/10 opacity-50'
              }
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={answered}
                  className={`w-full text-left p-3 rounded-lg border bg-pine/40 transition-colors text-sm ${style}`}
                >
                  <span className="font-mono text-xs mr-2">{String.fromCharCode(65 + i)}.</span>
                  {option}
                </button>
              )
            })}
          </div>

          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 rounded-lg bg-pine/60 border border-warm/10"
            >
              <p className="text-sm mb-1">
                {selected === item.correctIndex ? (
                  <span className="text-mint font-semibold">✓ Correct!</span>
                ) : (
                  <span className="text-coral font-semibold">✗ Not quite.</span>
                )}
              </p>
              <p className="text-sm text-warm/80">{item.explanation}</p>
              <p className="mt-1 text-xs text-warm/50 font-mono">Source: {item.source}</p>
              <button
                onClick={handleNext}
                className="mt-3 px-4 py-2 rounded-lg bg-honey text-pine font-semibold text-sm hover:bg-honey/90 transition-colors"
              >
                Next question
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}