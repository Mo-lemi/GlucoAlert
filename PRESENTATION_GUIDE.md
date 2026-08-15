# PulseTwin — 5-Minute Presentation & Demo Guide

A complete, rhythm-paced script for presenting PulseTwin at the Girl Code health-tech hackathon. Designed for **5 solid minutes** of storytelling + live demo, with animated beats, stage directions, judge Q&A, and a memorable close.

> **Tagline:** *"See your future self before your body shows it."*

---

## 🎭 The 5-Minute Arc

| Time | Beat | Goal |
|---|---|---|
| 0:00–0:45 | 🎬 **The Hook** — silent danger | Emotional stakes |
| 0:45–1:45 | 🏃 **The Living Twin** — live control | "Wait, it moves?" |
| 1:45–2:30 | 🔬 **Reveal + Projection** — the x-ray | The inner story |
| 2:30–3:30 | 📚 **Evidence & Health Insights** — the proof | Credibility |
| 3:30–4:15 | 🎯 **One More Beat** — a balance moment | The "aha" |
| 4:15–5:00 | 💜 **The Close** — the ask | Call to action |

---

## 🎬 0:00–0:45 — The Hook: The Silent Problem

**Animation note:** Start with the Twin alone, mid band, slowly breathing. Stage glow is a soft honey color. Keep the screen on the Twin — no UI talk yet.

**Narrate (slowly, with eye contact):**

> "Type 2 diabetes doesn't announce itself. For years, it builds silently — no pain, no fever, no warning lights."
>
> "More than 2 in 5 US adults have prediabetes right now. And 8 out of 10 of them don't know it."
>
> "Your body won't show you what's building inside. So we built a body that will. Meet your **Twin**."

**Action:** Pause. Let the Twin's breathing be the only movement for 2–3 seconds.

**Transition:** Fade focus to the Command Box.

---

## 🏃 0:45–1:45 — The Living Twin: Your Day, Played Back

**AnimationFrame:** CommandBox input is already focused. Fingers on keyboard — type slowly.

**Say:**

> "This isn't a dashboard. This is a companion. I tell it what I'm doing — like I'd tell a friend."

### Demo A — Walking (20 sec)

**Type:** `I'm walking 2 km at 5 km/h` → **Enter**

**As it reacts (excited, almost overlapping):**

> "And just like that — it's walking. Same distance, same pace. Look at the meters — glucose strain is dropping. Energy is climbing."

### Demo B — Sitting (15 sec)

**Type:** `I'm sitting for 90 minutes` → **Enter**

**Say (slower voice, quiet):**

> "Now I'm back in a chair. And watch — it slumps. Energy drains. The strain creeps up. A whole day of this adds up — even though your body never complains."

### Demo C — Sugar (15 sec)

**Type:** `i had a sugary drink` → **Enter**

**Say (animated):**

> "And when sugar hits? A spike — a flinch! That jag is the cost of a treat — and you actually feel it now, because you can *see* it."

**Whisper to judges:**

> "Studies show we remember emotions better than numbers. That flinch *is* the education."

---

## 🔬 1:45–2:30 — Reveal & Projection: The X-Ray

### Reveal Mode (25 sec)

**Click 🔬 Reveal Mode.** The Twin goes translucent; the signal wave appears.

**Say (mysterious, clarifying):**

> "Now for the part the body hides. Reveal Mode is the X-ray — a simplified view of what's happening under the surface."
>
> "Calm, steady wave — that's a protected pattern. But when strain climbs — watch — it gets jagged. That jaggedness is the silent insulin resistance the body never surfaces."

### Time Projection (20 sec)

**Click ⏳ Time Projection.** Drag slider from 0 to 10 years slowly.

> "And this is where it gets real. If today becomes the pattern — this is the *trajectory* — 10 years of small, invisible choices, visible right now."
>
> **Point to the disclaimer:** "Illustrative, not a medical prediction. We are very clear about that."

---

## 📚 2:30–3:30 — The Evidence Layer: Play → Learn

### Health Insights (30 sec)

**Scroll or click Health Insights.**

> "But PulseTwin isn't just a game — every action rewards you with evidence."
>
> "This illustrative pattern meter summarizes today. And as you play, you unlock evidence-backed cards — real, citeable numbers from CDC, IDF and WHO."

### Unlock demo (20 sec)

**Click a Quick Log — e.g. exercise (+9).**

> "Look — 'Lifestyle change can cut diabetes risk by more than half.' That's not our opinion. That's the CDC's National Diabetes Prevention Program."
>
> "So with every action you take, you're building diabetes literacy — without reading a single brochure."

### Quiz moment (15 sec)

**Click into the Quiz.**

> "And to lock it in — a quick quiz. Every answer shows the citation and the correct explanation for it."

**Click one answer.**

> "You've just learned a real health fact — in game form."

---

## 🎯 3:30–4:15 — The Balance Beat (optional — the crowd-pleaser)

**Say:**

> "Now the reverse. What happens when a day goes well?"

**Type (fast):** `i slept 7 hours` then `i'm doing a workout`

**Watch the Twin brighten, wave calm.**

> "Two choices — and the whole signal shifts. Your habits are not neutral. They compound every day, in both directions."

---

## 💬 4:15–5:00 — The Call: What Would Your Twin Do?

**Slow down. Make firm eye contact.**

> "We built PulseTwin because 280 million people live with diabetes, and most of the next wave is preventable."
>
> "**If watching your Twin slump — or seeing that jagged wave — motivates even one person here to get a fasting glucose test, or to swap one sugary drink for water, we win.**"

**Action:** Silence. Let it land.

---

## 🎬 The One-Liner (exit line / speakers bio)

> **"PulseTwin — see your future self before your body shows it."**

---

## 🏆 Judge Q&A — sharp answers

| Question | Suggested answer |
|---|---|
| **Is this medically accurate?** | "It's an intentionally simplified, educational simulation. Every number we show is cited (CDC, IDF, WHO). We never present it as diagnosis — the disclaimer sits on every risk surface." |
| **No backend / paid APIs?** | "Completely browser-based. React + Zustand + local storage. Assets render in code — SVG and CSS animations. Offline works after first load. Judge can open a link on their phone." |
| **Who is this for?** | "People at risk of Type 2 who won't read a whiteboard — the 2-in-5 US adults with prediabetes who don't know it. We meet them with a game, not a lecture." |
| **How is it sticky?** | "14 badges, streaks, zoom quiz, evidence cards to collect, time projection, reveal mode. Every session reshapes the Twin, so every day is new." |
| **Could it scale?** | "Yes — future steps include connecting real activity from wearables, community challenges, and a backend for peer play. The simulation core is portable." |
| **Why an avatar, honestly?** | "Emotions beat numbers. Experiment: you carry a chart for 0.5 seconds — you judge a face in 0.2. A slump changes behavior. A red line just gets red." |

---

## 🔧 Deep Technical Q&A (for the engineer track)

| Question | Answer |
|---|---|
| **Architecture** | React 18 + TS + Vite; Zustand with LocalStorage persist; Tailwind; Framer Motion; Recharts |
| **Simulation loop** | Zustand store `tick()` runs on an interval during active activities; applies per-activity deltas to energy/stress/glucoseStrain/resilience; derive mood; completion persists history + score |
| **Command parser** | Deterministic regex/keyword detection: activity type, duration (min/hr), distance (km/mi), pace, food, stress — with fallback prompt |
| **Character rigging** | Hand-authored SVG groups + CSS keyframes (walking, running, sit, sleep, exercise, reactions); prefers-reduced-motion fallback |
| **Accessibility** | WCAG-AA contrast; responsive 360px–desktop; reduced-motion first-class |
| **Bundle** | ~205 kB gzipped; first-load streams Google Fonts, then offline |

---

## 🧰 Tech brief for the judges' curiosity

- **No external animation assets** — keyframe CSS on hand-drawn SVG groups
- **One Zustand store** — actions are pure functions; persistence via `persist`
- **Libs used**: react, react-dom, zustand, tailwind, framer-motion, recharts, lucide-react
- **Run**: `npm install && npm run dev` → localhost:5173

---

## ✅ Definition of Done (demo checklist)

- [ ] Open fresh localStorage (Reset Twin) so the Twin starts at 50
- [ ] Type: "I'm walking 2 km at 5 km/h" — walking animation + meters shift
- [ ] Type: "I'm sitting for 90 minutes" — slouch + drop
- [ ] Type: "I had a sugary drink" — spike + flinch
- [ ] Reveal Mode — jagged wave
- [ ] Time Projection → 10 years → disclaimer visible
- [ ] Log an action → evidence card unlocks
- [ ] Answer one quiz question → source shown
- [ ] Good-day moment (sleep + healthy meal) → Twin brightens
- [ ] No console errors
- [ ] Works on a phone at 360px

---

## 🎉 Final set

Keep your energy high, your pacing clear, and your pause. The demo is simple: **type, watch, explain.** People will remember the Twin — not the slides.

> **PulseTwin — see your future, before your body shows it.**

Hack. Health. Humanity. 🌟