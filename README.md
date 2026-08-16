# PulseTwin — A Living Digital Twin for Diabetes Awareness

> **"See your future self before your body shows it."**

PulseTwin is a **real-time life-simulation game** built for the Girl Code hackathon (health-tech track). It turns the invisible, silent build-up of Type 2 diabetes into a living, emotional, and educational experience. The user tells the app what they are doing in real time — walking, sitting, sleeping, eating, stressing — and a human-like avatar visibly mirrors those choices, showing the internal consequences the body hides for years.

> ⚠️ **Educational simulation only — not medical advice, diagnosis, or prediction.**

---

## 🌟 Why PulseTwin exists

- **The silent problem:** More than 2 in 5 U.S. adults have prediabetes; ~8 in 10 of them don't know it. *(CDC)*
- **The invisible disease:** Insulin resistance can build for years before blood sugar moves enough to trigger a diagnosis.
- **The engagement gap:** Graphs and pamphlets don't create emotional buy-in. A living character that slumps when you sit all day, flinches when you eat sugar, and brightens when you move *does*.

PulseTwin converts evidence into an emotional, playable lesson.

---

## 🎮 Core experience

### 1. Talk to your Twin (command box)
Type natural sentences and the Twin acts them out instantly:

```text
"I'm walking 2 km at 5 km/h"          → starts walking, strain drops
"I'm sitting for 90 minutes"          → slouches, energy fades
"I slept 7 hours"                     → lies down, closed eyes, recovers
"I had a sugary drink"                → glucose spike + flinch reaction
"I'm stressed and skipped lunch"      → tense, shaken, strain rises
"I'm doing a 2-minute workout"        → energetic bounce
```

### 2. Structured activity form
Choose walk / run / sit / sleep / exercise / stand and configure:
distance (0.5–10 km), pace (4–20 min/km), duration (1–120 min), reps (5–100).

### 3. Live mirrored animation
- The Twin walks, runs, sits, sleeps, exercises, or stands alongside you
- Live progress tracker shows %, time left, distance covered, reps done
- Score delta is logged automatically when the activity completes

### 4. Simulation tick loop
While an activity is active, energy, stress, glucose strain, resilience and sync score drift every 5 seconds — the app is alive, not click-driven.

### 5. Mood & character coach
Mood (calm → steady → strained → exhausted) drives the Twin's posture and speech. The Twin speaks warm educational copy: "A steady walk improves insulin sensitivity and clears the signal."

---

## 🧩 Systems included

| System | Description |
|---|---|
| **Sync Score Engine** | 0–100 score — high (≥70), mid (40–69), low (<40) bands drive posture, color, and mood |
| **Living Twin** | Hand-rigged SVG character — idle breathing, blinking, posture-by-band, per-action reactions (jump, flinch, droop, stretch, shake), live activity animations, shadowed stage with colored glow |
| **Health Insights** | Illustrative metabolic-pattern meter + evidence-backed concept cards (CDC/IDF/WHO) unlocked by gameplay |
| **Reveal Mode** | "X-ray" internal signal wave — calm at high sync, noticeably jagged at high strain |
| **Time Projection** | 0–10 year slider projecting the current trajectory — clearly illustrative-only |
| **Quiz Engine** | 7 cited awareness questions with explanations revealed on every answer |
| **Badges & Streaks** | 14 unlockable badges + cross-day streaks |
| **History Chart** | Recharts line chart of cumulative Sync Score |
| **Daily Timeline** | Time-stamped log of activities, meals, sleep, stress, recovery |
| **Life-sim meters** | Energy, Stress, Glucose Strain, Resilience + mood |
| **Command Parser** | Deterministic keyword/regex parser with friendly fallback |

---

## 🎮 The six core actions

| Action | Emoji | Delta | What it teaches |
|---|---|---|---|
| Home-cooked / veg-forward meal | 🥗 | +6 | Nourishment stabilizes the signal |
| Sugary drink or dessert | 🥤 | −7 | Spikes cause strain + recovery lag |
| 20+ min of movement | 🏃 | +9 | Movement raises sensitivity, lowers strain |
| Mostly sedentary day | 🛋️ | −5 | A day of non-motion compounds quietly |
| Good night's sleep | 😴 | +4 | Sleep restores resilience |
| High-stress / skipped meals | ⚡ | −4 | Cortisol-like strain destabilizes |

---

## 🧠 Command parser

Deterministic keyword + regex detection:

- activity type (walk / run / sit / sleep / exercise / stand)
- duration ("30 minutes", "1 hour", "2 hrs")
- distance ("3 km", "5 miles")
- pace ("5 km/h", "pace 6")
- food ("sugary", "healthy", "salad", "dessert")
- stress ("stressed", "tired", "panic", "skipped meal")
- sleep hours ("slept 7 hours")

Unclear input → friendly fallback: *"Try: 'I'm walking 2 km at 5 km/h for 30 minutes'"*

---

## 📈 Health model (educational)

Each tick (and every action) updates:

- **syncScore** (0–100) — overall pattern / posture
- **energy** (0–100)
- **stress** (0–100)
- **glucoseStrain** (0–100)
- **resilience** (0–100)
- **mood** = calm / steady / strained / exhausted

`completeActivity` applies deltas and streak logic; `tick` applies gradual drift; everything persists to localStorage.

All dynamics are deliberately simplified for education — the UI says so.

---

## 🛠 Tech stack (zero-cost, offline-first)

- **React 18 + TypeScript + Vite**
- **Zustand** (with `persist` → localStorage)
- **Tailwind CSS** (custom design tokens, no default look)
- **Framer Motion** (micro-interactions)
- **Recharts** (trend chart)
- **No external assets** — hand-coded SVG + CSS animation
- **No backend, no API keys, no paid services** — judge-safe on their phone

Fonts (Fraunces / Inter / JetBrains Mono) load from Google Fonts on first load; the app works offline afterward.

---

## 🚀 Quick start

```bash
npm install
npm run dev -- --host 0.0.0.0
# then open http://localhost:5173
```

Production:

```bash
npm run build
npm run preview -- --host 0.0.0.0
```

---

## 📁 Project structure

```text
pulsetwin/
├── src/
│   ├── activity.ts            # activity definitions + duration math
│   ├── parser.ts              # natural-language command parser
│   ├── data.ts                # six actions, quiz deck, badges
│   ├── concepts.ts            # evidence-backed concept cards (CDC/IDF/WHO)
│   ├── store.ts                # Zustand store + life-sim engine (state + actions + tick)
│   ├── types.ts
│   ├── App.tsx                  # main screen / layout
│   ├── twin.css                 # Twin animation keyframes
│   └── components/
│       ├── LivingTwin.tsx         # animated character
│       ├── CommandBox.tsx         # text command input
│       ├── ActivityPanel.tsx      # structured activity form
│       ├── ActiveActivityTracker.tsx # live progress tracker
│       ├── HealthInsights.tsx     # metabolic pattern + evidence cards
│       ├── StatusPanel.tsx        # life-sim meters
│       ├── Timeline.tsx           # daily timeline
│       ├── Coach.tsx              # character coach messages
│       ├── RevealMode.tsx         # x-ray signal view
│       ├── TimeProjection.tsx     # projection slider
│       ├── Quiz.tsx
│       ├── Badges.tsx
│       ├── HistoryChart.tsx
│       └── ActionPanel.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── PRESENTATION_GUIDE.md      # 5-minute presentation & demo script
└── README.md
```

---

## ♿ Accessibility & performance

- `prefers-reduced-motion` degrades animations while keeping color/posture state
- WCAG-AA contrast on the dark pine palette
- Fully responsive down to 360px
- ~205 kB gzipped JS bundle
- No scroll dependency — everything renders in code

---

## 📝 Disclaimers

- App-level banner: `Educational simulation only — not medical advice, diagnosis, or prediction.`
- Time Projection component: `Illustrative simulation only — not a medical prediction.`
- Reveal Mode: `This is a simplified illustration of internal metabolic strain, not a medical reading.`
- Health Insights: `Illustrative metabolic pattern` framing
- Footer repeats the disclaimer.

---

## 🏆 For the judges

A 5-minute, fully-scripted demo with narrative beats, live-demo actions, judge Q&A, and the "silent damage" hook lives in **[PRESENTATION_GUIDE.md](PRESENTATION_GUIDE.md)**.

Remember the close:

> "8 in 10 people with prediabetes don't know it. If seeing your Twin drain — or seeing that jagged signal — motivates even one person to get a fasting glucose test, this demo wins in a small, meaningful way."