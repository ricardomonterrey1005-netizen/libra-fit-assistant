# Libra Fit Assistant — Research Report

Date: 2026-04-19
Stack target: PWA, vanilla JS frontend, Node/Express backend, encrypted JSON DB, zero-budget APIs.

---

## 1. Executive Summary — What to Prioritize

If you only ship 5 things, ship these in order:

1. **Solid food entry UX** — fuzzy search + recent/favorites + "per 100g" model with serving-size multipliers. This is the single biggest driver of retention in MyFitnessPal/Cronometer/YAZIO. If logging a meal takes more than 15 seconds, users quit.
2. **Meal swap / substitution flow** — "instead of tortilla I ate bread" is a killer feature most apps do badly. Make it one tap from today's plan.
3. **Local-first reminders via the Notifications API + Service Worker** — no backend push needed for v1. Works offline, free, respects the PWA model.
4. **Workout templates + last-session autofill** — Strong/Hevy win because they pre-fill your last weights. Don't make users type from scratch.
5. **AI chat as "nutrition coach" using Groq or Gemini free tier** — scoped to user's own logged data. This is your differentiator vs MyFitnessPal.

Deprioritize: barcode scanning (nice-to-have, needs camera + DB), social features, photo food recognition, wearable sync.

---

## 2. Food Configuration — Winning Patterns

### How the leaders do it

| App | Key pattern |
|---|---|
| **MyFitnessPal** | 4 default meals (Breakfast/Lunch/Dinner/Snacks), user-editable. "Quick add calories" escape hatch. Copy meal from yesterday/other day. |
| **Cronometer** | Most accurate DB (USDA-backed). Tracks 80+ micronutrients. "Diary" day-view with macro ring chart updating live. |
| **YAZIO** | Pre-built meal plans as a paid feature. Free users: custom meals, water tracker, fasting timer. Strong UI for portion sizes. |
| **Lifesum** | Visual "plate" UI. Color-coded macro scoring (A–E grade per meal). |
| **FatSecret** | Best free community food DB. Journal-style entries. |
| **Foodvisor** | AI photo recognition (hard to replicate). |
| **Yuka** | Barcode-only, scores products 0–100 based on nutrition + additives. |

### Data model that works (use this)

```js
// Food item
{
  id: "f_abc123",
  name: "Tortilla de maíz",
  brand: null,                     // or "Maseca"
  category: "cereales",
  source: "custom" | "off" | "usda",
  per100g: {
    kcal: 218, protein_g: 5.7, carbs_g: 44.6,
    fat_g: 2.9, fiber_g: 6.3, sugar_g: 0.6, sodium_mg: 45
  },
  servings: [                      // user can add their own
    { label: "1 tortilla mediana", grams: 30, default: true },
    { label: "1 taza", grams: 120 }
  ],
  barcode: "7501234567890",        // optional
  verified: false,
  createdBy: "system" | userId
}

// Meal entry (log)
{
  id: "e_...",
  userId, date: "2026-04-19", mealSlot: "lunch",
  foodId, grams: 60,               // ALWAYS store grams, compute rest
  loggedAt: ISO8601,
  swappedFromId: null              // for "I ate X instead of Y"
}
```

Rule: **store grams, compute everything else.** Don't store "2 tortillas" — store 60g. This makes macro math trivial and avoids unit-conversion bugs.

### Meal slots & times

- Default 4 slots (Desayuno / Almuerzo / Cena / Snacks) but let user configure N slots with times.
- Each slot has an optional `reminderTime` (HH:mm) — feeds the Notification system (section 4).
- "Meal plan templates": user saves Monday's logged foods as a template, reuses it.

### The swap feature (your differentiator)

Flow:
1. User views today's plan, sees "Almuerzo: 2 tortillas + pollo".
2. Taps any item → "Cambiar por otro alimento".
3. Search modal → pick bread → pick grams.
4. App shows delta: `+45 kcal, -2g proteína, +8g carbs` before confirming.
5. On confirm: original entry gets `swappedFromId`, new entry is logged. Keep the original in history (for streaks / "did you follow the plan?" analytics).

### Live macro balance

A simple progress bar per macro is enough. Show:
- Consumed / Goal (e.g., `1420 / 2100 kcal`)
- Remaining
- Color coding: green within 90–110%, yellow outside, red if >120% or <70%.
- Update instantly on add/swap/delete — no page reload.

### Free food database recommendations

Ranked for your use case (Spanish-speaking users, PWA, no budget):

1. **Open Food Facts** (openfoodfacts.org) — **TOP PICK**
   - Fully free, no API key, no rate limit (be polite: add User-Agent).
   - 3M+ products, excellent barcode coverage in Latin America / Spain.
   - Endpoint: `https://world.openfoodfacts.org/api/v2/product/{barcode}.json`
   - Search: `https://world.openfoodfacts.org/cgi/search.pl?search_terms=tortilla&json=1`
   - Spanish names available (`product_name_es`).
   - Downloadable full dump (JSONL, ~10GB) if you want offline.

2. **USDA FoodData Central** — best for raw/generic foods (not branded Latin products).
   - Free API key, 1000 req/hr. Endpoint: `api.nal.usda.gov/fdc/v1/foods/search`.
   - Use for fallback when OFF doesn't have the item.
   - English only — you'd translate common names manually.

3. **FatSecret Platform API** — free tier exists but requires OAuth + approval. Skip for v1.

4. **Edamam** — free tier 10 req/min, 10K/month. Nice for recipes, overkill for food lookup.

5. **Nutritionix** — free tier requires commercial review. Avoid.

**Recommended strategy for you:**
- Seed a local JSON file with ~200 common Panamanian/Latin foods (tortilla, plátano, arroz, frijoles, pollo, yuca, etc.) with verified macros. This covers 80% of daily logging with zero API calls.
- Fallback 1: Open Food Facts for branded/packaged food (barcode or search).
- Fallback 2: USDA for anything else.
- Cache every successful lookup into your local DB so it's instant next time.

---

## 3. Exercise Configuration — Winning Patterns

### How the leaders do it

| App | Key pattern |
|---|---|
| **Strong** | Template-first. Pick template → log sets → done. Auto-fills last weights. Rest timer auto-starts on set completion. |
| **Hevy** | Same as Strong but social + free. Best UX for set logging (tap to +1 rep). |
| **FitBod** | AI-generated next workout based on recovery + muscle fatigue. |
| **Jefit** | Huge exercise DB with animations/videos. |
| **StrongLifts 5×5** | Opinionated: one program, forces progression. Good for beginners. |

### Data model

```js
// Exercise (library item)
{
  id: "ex_bench",
  name: "Press de banca",
  muscleGroup: "pecho",
  secondaryMuscles: ["tríceps", "hombro"],
  equipment: "barra",
  instructions: "…",
  videoUrl: null,                 // optional
  isCustom: false
}

// Routine/Template
{
  id: "rt_...", userId,
  name: "Push Day",
  exercises: [
    { exerciseId: "ex_bench", targetSets: 4, targetReps: "6-8", restSec: 120 },
    …
  ]
}

// Workout session (log)
{
  id: "ws_...", userId, date, routineId,
  startedAt, endedAt,
  entries: [
    {
      exerciseId: "ex_bench",
      sets: [
        { reps: 8, weight: 60, rpe: 7, done: true },
        { reps: 8, weight: 60, done: true },
        …
      ]
    }
  ]
}
```

### Must-have features

1. **Autofill last session** — when user picks an exercise, pre-fill weight × reps from last time. Huge retention win.
2. **Rest timer** — auto-start when a set is marked done. Vibrate + beep on finish. Use `navigator.vibrate()` + Web Audio API. All in-browser.
3. **Progressive overload hints** — "Last week: 60kg × 8. Try 62.5kg × 8?" Simple rule: if all target reps hit last time, suggest +2.5kg (compound) or +1kg (isolation).
4. **Built-in templates** — ship 5–6 routines:
   - Full Body 3x/semana (beginner)
   - Push / Pull / Legs (intermediate, 6 days)
   - Upper / Lower (4 days)
   - Push/Pull/Legs + Upper/Lower (5 days)
   - Weider split (bro split) — popular in LatAm.
   - Home workout (bodyweight only)
5. **Exercise library** — 80–120 common exercises is enough. Seed from the free [wger exercise DB](https://wger.de/api/v2/exercise/) (CC-BY-SA, Spanish translations available) or [free-exercise-db](https://github.com/yuhonas/free-exercise-db) on GitHub (public domain, JSON + GIF images).

### Exercise DB recommendations (free)

1. **free-exercise-db** (github.com/yuhonas/free-exercise-db) — MIT, 800+ exercises, JSON + demo GIFs. Download once, ship with app. **TOP PICK.**
2. **wger** (wger.de) — free REST API, German origin, has Spanish. Community-maintained.
3. **ExerciseDB (RapidAPI)** — has a free tier but rate-limited and requires key.

---

## 4. Reminder / Notification System — Best Practices

### Stack for your PWA

- **Notifications API** (`Notification.requestPermission()`) — ask on first meaningful interaction, not on page load.
- **Service Worker** with `showNotification()` — works when app is closed on Android PWA installed.
- **IndexedDB** to persist scheduled reminders locally.
- **Periodic Background Sync** (Android only, Chromium) — best-effort wake-ups. Don't rely on exactness.
- For reliable timing on installed Android PWA: schedule with `setTimeout` inside the SW isn't reliable — instead, compute the next 24h of reminders on app open and register them, plus use Periodic Background Sync to re-register daily.
- **Web Push** (VAPID + `web-push` npm package) only if you need server-triggered reminders. Free, but requires keeping push subscriptions server-side. Skip for v1.

### Timing patterns

| Reminder | Recommended schedule |
|---|---|
| Meal reminder | Per user-configured meal time, ±15 min tolerance. One-shot per meal per day. |
| Water | Default every 2h between 8:00–20:00 (6 reminders/day). Let user toggle "smart" mode: skip if water was logged in last 90 min. |
| Workout | User picks days+time. Remind 30 min before. |
| Over-calorie alert | Trigger when daily total > 110% of goal. One per day max. Soft tone: "Vas 250 kcal por encima de tu meta. Considera una cena ligera." |
| Streak | Only if user has streak ≥ 3 days and hasn't logged anything by 20:00. "Tu racha de 5 días está en riesgo." |

### Content rules

- Spanish, warm tone ("vamos", "tú puedes"), never shaming.
- Always actionable: include 1 button ("Registrar ahora").
- Kill-switch: global toggle in settings + per-category toggle.
- Don't send more than 6 notifications/day total. Batch similar ones.
- Respect Do Not Disturb windows (default 22:00–7:00).

### Quiet / smart behavior

Track a `lastInteractionAt`. If user opened app in last 30 min, don't send the pending reminder — they're already engaged.

---

## 5. Chat / AI Assistant — Recommendations

### What the leaders do well

- **Noom** — CBT-style coaching, focuses on behavior change, not just calories. Asks "why did you eat that?" to build awareness.
- **MacroFactor** — algorithmic coach that adapts calories weekly based on actual weight trend vs goal. Not chat per se, but *personalized*.
- **Fitbot / ChatGPT-style fitness bots** — conversational workout planning.

Common strengths:
1. Responses are **grounded in the user's own data** (what they logged today, their goal, their history).
2. **Short** — 2–4 sentences, not essays.
3. **Action-oriented** — end with a question or a suggested action.
4. **Persistent memory** — remembers user's goal, allergies, dislikes.

### Free AI APIs for a zero-budget PWA

Ranked:

1. **Groq** (groq.com) — **TOP PICK for chat**
   - Free tier, extremely fast (Llama 3.3 70B at ~300 tok/s).
   - Generous rate limits (30 req/min, 14.4K req/day on free tier as of late 2025).
   - OpenAI-compatible API — drop-in.
   - Caveat: terms of service require you not to build a competing model. Normal app use is fine.

2. **Google Gemini API** (ai.google.dev)
   - Free tier: Gemini 2.5 Flash — 15 RPM, 1M tokens/day free.
   - Strong Spanish. Has function calling if you want structured output.

3. **Mistral La Plateforme** — free tier exists but smaller limits. Good backup.

4. **Cloudflare Workers AI** — free tier 10K neurons/day, Llama models. Runs at edge. Good if you're already on Cloudflare.

5. **OpenRouter free models** (openrouter.ai) — aggregator, some free models (DeepSeek, Llama variants). Limits rotate.

**Recommended:** Primary = Groq, fallback = Gemini. Implement both behind a single `aiProvider.js` abstraction so you can swap.

### Prompt pattern that works

```
System prompt:
Eres el coach de Libra Fit, un asistente de nutrición y ejercicio.
Hablas español panameño, tono cálido y directo, máx 4 frases.
NUNCA des consejos médicos. Si el usuario menciona síntomas,
recomienda consultar a un profesional.

Context (injected every turn):
USER_PROFILE: { edad, peso, meta: "perder 0.5kg/semana", alergias: [...] }
TODAY_LOG: { kcal_consumed: 1420, kcal_goal: 2100, protein_consumed: 80, protein_goal: 140, meals: [...] }
RECENT_WORKOUTS: [last 3 sessions]

User: "¿puedo comerme una pizza esta noche?"
```

### Safety rails

- Hard-coded keyword filter for medical/mental-health topics → respond with disclaimer + suggest professional.
- Log all AI responses to your encrypted DB for review + user export.
- Token budget per user per day (e.g., 20 turns) to stay inside free tier.

---

## 6. Error Reporting / Feedback — Implementation Patterns

### What modern apps do

1. **Shake-to-report** — `devicemotion` event, detect acceleration spike > threshold. Show modal.
2. **In-app "Report a problem"** button in settings.
3. **Auto-attach**: last 50 console logs, app version, user agent, current route, anonymized user ID.
4. **Screenshot** — html2canvas or `navigator.mediaDevices.getDisplayMedia()` (user-consented).
5. **Toast on uncaught error** — `window.onerror` + `unhandledrejection` handlers pipe to a buffered log.

### Minimal implementation for vanilla JS PWA

```js
// logger.js — ring buffer
const BUF = [];
const push = (level, msg) => {
  BUF.push({ t: Date.now(), level, msg: String(msg).slice(0, 500) });
  if (BUF.length > 50) BUF.shift();
};
['log','warn','error'].forEach(k => {
  const orig = console[k];
  console[k] = (...a) => { push(k, a.join(' ')); orig(...a); };
});
window.addEventListener('error', e => push('error', e.message));
window.addEventListener('unhandledrejection', e => push('error', e.reason));

export const getLogs = () => BUF.slice();
```

```js
// shake detection
let last = 0, shakes = 0;
window.addEventListener('devicemotion', e => {
  const a = e.accelerationIncludingGravity;
  const mag = Math.hypot(a.x||0, a.y||0, a.z||0);
  const now = Date.now();
  if (mag > 25 && now - last > 300) {
    shakes++; last = now;
    if (shakes >= 3) { shakes = 0; openReportModal(); }
  }
  if (now - last > 1500) shakes = 0;
});
```

Backend endpoint: `POST /api/feedback` with JSON `{type, message, logs, route, version, userId}`. Store in a dedicated `feedback.json` (encrypted like the rest). Optionally email yourself on new reports via a free SMTP (e.g., Resend free tier 3K/month, or just Nodemailer + Gmail app password).

### Form fields (keep it short)

1. Tipo: Bug / Sugerencia / Otro
2. ¿Qué pasó? (textarea)
3. Checkbox: "Adjuntar información técnica" (default on)
4. Enviar.

That's it. Don't ask for steps-to-reproduce up front — you can follow up.

---

## 7. Specific Recommendations for Libra Fit Assistant

Given your stack (vanilla JS PWA, Node/Express, encrypted JSON DB, no paid APIs):

### Architecture tweaks

- **Split your encrypted JSON into domain files**: `users.enc.json`, `foods.enc.json`, `logs.enc.json`, `workouts.enc.json`, `feedback.enc.json`. Easier to back up and smaller write surface per transaction.
- **Add a debounced write queue** per file. Every mutation marks file dirty; a 500ms timer flushes. Prevents losing writes on concurrent requests without locking on every op.
- **Keep a compact in-memory index** for food search — a simple `{ lowered_name → foodId }` map plus a trigram index for fuzzy matching. With <5K foods this is trivially fast in JS.

### Food system — concrete plan

1. Seed `foods.seed.json` with ~200 Latin/Panamanian foods (I'd start with: arroz blanco, frijoles, pollo, carne res, plátano maduro, plátano verde, yuca, tortilla de maíz, pan, huevo, leche, queso blanco, aguacate, tomate, cebolla, lechuga, papa, sancocho ingredients, sopa de mondongo, etc.).
2. Build `GET /api/foods/search?q=` with in-memory fuzzy search. Return top 20.
3. Add `POST /api/foods` for custom foods. Flag `createdBy: userId`.
4. Add Open Food Facts proxy endpoint: `GET /api/foods/barcode/:code` → fetches OFF, maps fields, caches into your DB. Rate-limit to 10/min per user.
5. All meal logs store `{ foodId, grams }` only. Compute macros at read time via a pure function `computeMacros(food, grams)`.

### Meal swap — concrete plan

- UI: long-press or "..." menu on any logged entry → "Cambiar".
- Backend: `PATCH /api/logs/:id/swap` with `{ newFoodId, grams }`. Server creates new log with `swappedFromId` pointing to original, soft-deletes original (keep for history).
- Show macro delta in modal *before* confirming — use a shared `computeMacros` on frontend.

### Reminders — concrete plan

- Skip Web Push for v1. Use `Notification` + Service Worker `showNotification` scheduled via `setTimeout` on app open for the next 24h of reminders.
- Register a Periodic Background Sync handler that re-schedules reminders every 12h (works on installed PWA on Android).
- Settings screen: toggle per category + time picker per meal + DND window.

### Workout system — concrete plan

1. Import `free-exercise-db` JSON at build time → `exercises.seed.json`. Translate names/instructions for the top 80 to Spanish (one-time manual work).
2. Ship 4 built-in routines (Full Body, PPL, Upper/Lower, Casa sin equipo).
3. On exercise selection, server returns last session's sets for autofill.
4. Rest timer: pure frontend, `navigator.vibrate([200,100,200])` + short beep on completion.

### AI chat — concrete plan

1. Backend proxy: `POST /api/coach` — never expose Groq API key to client.
2. Build context server-side from logged user data (today's log + goal + profile). Don't send chat to AI without this context.
3. Use Groq `llama-3.3-70b-versatile`. Set `max_tokens: 300`. Stream responses via SSE for snappy UX (Express + `res.write` works fine, no extra deps).
4. Store conversation in `chats.enc.json` per user, capped to last 50 messages.
5. Add a daily token budget check before each call. On exceed: fall back to Gemini, or respond with a canned "estoy descansando, vuelve en unas horas".

### Feedback — concrete plan

- Add the ring-buffer logger (above) to `app.js`.
- Shake detection on mobile.
- Settings → "Reportar problema" always visible.
- `POST /api/feedback` appends to `feedback.enc.json`.
- `admin.html` view to list/mark-resolved feedback entries. You already have admin.html — extend it.

### What to skip for v1

- Barcode scanning via camera (use manual barcode entry instead — `getUserMedia` + `BarcodeDetector` has patchy support).
- Photo food recognition (needs paid vision API or heavy local model).
- Social/sharing features.
- Wearable integrations.
- Web Push notifications (local scheduling covers 90% of cases).

### Rough roadmap

- **Sprint 1 (week 1-2):** Food DB seed + search + log flow + macro totals. Swap feature.
- **Sprint 2 (week 3):** Workout templates + exercise library + session logging + rest timer.
- **Sprint 3 (week 4):** Reminders via SW + settings.
- **Sprint 4 (week 5):** AI coach proxy + context injection + chat UI.
- **Sprint 5 (week 6):** Feedback/bug reporting + admin view + polish.

---

## Quick reference — free resources to bookmark

- Open Food Facts API: https://openfoodfacts.org/data
- USDA FoodData Central: https://fdc.nal.usda.gov/api-guide.html
- free-exercise-db: https://github.com/yuhonas/free-exercise-db
- wger API: https://wger.de/en/software/api
- Groq console: https://console.groq.com
- Gemini free tier: https://ai.google.dev/pricing
- Web Notifications spec: https://developer.mozilla.org/docs/Web/API/Notifications_API
- Periodic Background Sync: https://developer.mozilla.org/docs/Web/API/Web_Periodic_Background_Synchronization_API
