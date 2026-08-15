import { useState } from 'react'
import { motion } from 'framer-motion'
import { ACTIVITY_DEFS } from '../activity'
import type { ActivityConfig, ActivityType } from '../activity'
import { useStore } from '../store'

export default function ActivityPanel() {
  const startActivity = useStore((s) => s.startActivity)
  const activeActivity = useStore((s) => s.activeActivity)

  const [selectedType, setSelectedType] = useState<ActivityType>('walk')
  const [distanceKm, setDistanceKm] = useState(1)
  const [paceMinPerKm, setPaceMinPerKm] = useState(10)
  const [durationMin, setDurationMin] = useState(30)
  const [reps, setReps] = useState(20)

  const def = ACTIVITY_DEFS.find((d) => d.type === selectedType)!

  const handleStart = () => {
    const config: ActivityConfig = { type: selectedType }
    if (def.hasDistance) {
      config.distanceKm = distanceKm
      config.paceMinPerKm = paceMinPerKm
    }
    if (def.hasDuration) config.durationMin = durationMin
    if (def.hasReps) config.reps = reps
    startActivity(config)
  }

  if (activeActivity) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-surface border border-warm/10 p-4"
    >
      <h3 className="font-display text-lg font-semibold mb-3">Guide your Twin</h3>
      <p className="text-sm text-warm/70 mb-3">
        Tell your Twin what you're doing right now — it will mimic you in real time.
      </p>

      {/* Activity type selector */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {ACTIVITY_DEFS.map((a) => (
          <button
            key={a.type}
            onClick={() => setSelectedType(a.type)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-colors ${
              selectedType === a.type
                ? 'bg-honey/15 border-honey/40 text-honey'
                : 'bg-pine/40 border-warm/10 text-warm/70 hover:border-honey/30'
            }`}
          >
            <span className="text-xl">{a.emoji}</span>
            <span className="text-xs font-medium">{a.label}</span>
          </button>
        ))}
      </div>

      {/* Config inputs */}
      <div className="space-y-3 mb-4">
        {def.hasDistance && (
          <>
            <div>
              <label className="flex justify-between text-xs font-mono text-warm/60 mb-1">
                <span>Distance</span>
                <span>{distanceKm} km</span>
              </label>
              <input
                type="range"
                min={0.5}
                max={10}
                step={0.5}
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="flex justify-between text-xs font-mono text-warm/60 mb-1">
                <span>Pace</span>
                <span>{paceMinPerKm} min/km</span>
              </label>
              <input
                type="range"
                min={4}
                max={20}
                step={1}
                value={paceMinPerKm}
                onChange={(e) => setPaceMinPerKm(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </>
        )}

        {def.hasDuration && (
          <div>
            <label className="flex justify-between text-xs font-mono text-warm/60 mb-1">
              <span>Duration</span>
              <span>{durationMin} min</span>
            </label>
            <input
              type="range"
              min={1}
              max={120}
              step={1}
              value={durationMin}
              onChange={(e) => setDurationMin(Number(e.target.value))}
              className="w-full"
            />
          </div>
        )}

        {def.hasReps && (
          <div>
            <label className="flex justify-between text-xs font-mono text-warm/60 mb-1">
              <span>Reps</span>
              <span>{reps} reps</span>
            </label>
            <input
              type="range"
              min={5}
              max={100}
              step={5}
              value={reps}
              onChange={(e) => setReps(Number(e.target.value))}
              className="w-full"
            />
          </div>
        )}
      </div>

      <button
        onClick={handleStart}
        className="w-full px-4 py-3 rounded-lg bg-honey text-pine font-semibold hover:bg-honey/90 transition-colors"
      >
        Start {def.label} with your Twin
      </button>
    </motion.div>
  )
}