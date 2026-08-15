import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useStore } from '../store'

export default function HistoryChart() {
  const history = useStore((s) => s.history)

  // Build cumulative score data from history
  const data = history.reduce<{ index: number; score: number }[]>((acc, entry, i) => {
    const prevScore = i === 0 ? 50 : acc[i - 1].score
    const score = Math.max(0, Math.min(100, prevScore + entry.delta))
    acc.push({ index: i + 1, score })
    return acc
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-surface border border-warm/10 p-4"
    >
      <h3 className="font-display text-lg font-semibold mb-3">Sync Score History</h3>

      {data.length === 0 ? (
        <p className="text-sm text-warm/50 py-8 text-center">
          Log some actions to see your Twin's journey.
        </p>
      ) : (
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <CartesianGrid stroke="#12302B" strokeDasharray="3 3" />
              <XAxis dataKey="index" stroke="#F5F1E8" fontSize={10} tickLine={false} />
              <YAxis domain={[0, 100]} stroke="#F5F1E8" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#12302B', border: '1px solid rgba(245,241,232,0.2)', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#F5F1E8' }}
                itemStyle={{ color: '#6FE7C0' }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#6FE7C0"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  )
}