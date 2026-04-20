# TRAINING_SCIENCE.md

Evidence-based reference for FitRicardo's training recommendation engine.
Primary sources: ACSM Guidelines for Exercise Testing and Prescription (11th ed., 2021),
NSCA Essentials of Strength Training and Conditioning (4th ed., 2016), NSCA Position
Statements, ACSM Position Stands, and peer-reviewed meta-analyses from PubMed (Schoenfeld,
Helms, Israetel, Grgic, Ralston). All numeric prescriptions below are intended for the
recommendation engine; bracketed references map to the Sources section.

---

## 0. Terminology and constants used by the engine

- **1RM**: one-repetition maximum.
- **RPE**: Rate of Perceived Exertion on a 1-10 scale (Borg CR-10). RPE 10 = no reps left.
- **RIR**: Reps In Reserve. RIR 2 ≈ RPE 8.
- **LISS**: Low Intensity Steady State cardio, 57-63% HRmax, Zone 2.
- **MISS**: Moderate Intensity Steady State, 64-76% HRmax, Zone 3.
- **HIIT**: High Intensity Interval Training, ≥80% HRmax during work intervals.
- **HRmax estimation**: Tanaka formula `208 - 0.7 * age` (more accurate than 220-age). [S2]
- **HRR** (Heart Rate Reserve): `HRmax - HRrest`; target HR = `HRrest + %intensity * HRR` (Karvonen). [S1]
- **VO2max zones (ACSM)**: Light 37-45%, Moderate 46-63%, Vigorous 64-90%, Near-max 91-100% VO2R. [S1]
- **MEV/MAV/MRV** (Israetel/RP): Minimum Effective Volume, Maximum Adaptive Volume, Maximum Recoverable Volume, measured in weekly hard sets per muscle group. [S7]

---

## 1. Quick-reference matrix (code this as a lookup table)

| Goal | Freq (sessions/wk) | Session length (min) | Resistance: sets×reps | %1RM / RPE | Rest between sets | Cardio (min/wk) | Cardio mix (HIIT:LISS) | Rest days/wk | Expected progress |
|---|---|---|---|---|---|---|---|---|---|
| **Fat loss** | 4-6 | 45-75 | 3-4 × 8-15 | 60-75% / RPE 7-8 | 45-90 s | 150-300 | 20:80 or 30:70 | 1-2 | 0.5-1.0% bodyweight/wk (0.5-1 kg) [S3] |
| **Hypertrophy** | 4-6 (per muscle 2x/wk min) | 45-90 | 3-6 × 6-12 (some 12-20) | 65-85% / RPE 7-9 (0-3 RIR) | 60-180 s | 60-120 optional | mostly LISS | 1-2 | 0.25-0.5% BW/wk lean mass (novice), 1-2% month (intermediate) [S4] |
| **Max strength** | 3-5 | 60-120 | 3-6 × 1-5 (main), 3×5-8 accessory | 85-100% / RPE 7-9 | 3-5 min main, 2-3 accessory | 40-90 optional | LISS only, separate day | 2-3 | Novice: 2.5-5 kg/wk main lifts; Intermediate: 2.5-5 kg/month; Advanced: 2.5-5 kg/quarter [S5] |
| **Cardio endurance** | 3-5 | 30-60 | 2×/wk full body maintenance | 60-70% | 60-90 s | 150-300 | 25:75 | 2 | VO2max +5-15% in 8-12 wk [S1] |
| **5K** | 3-4 run + 1-2 cross | 30-60 run | optional 2×/wk | - | - | See §5 | 1 interval : 1 tempo : 2 easy | 2-3 | C25K: 0 to 5K in 9 wk [S9] |
| **10K** | 4-5 run | 30-75 run | 2×/wk | - | - | See §5 | 1 interval : 1 tempo : 2-3 easy | 2 | 10-14 wk from 5K base |
| **Half marathon** | 4-5 run | 30-120 run | 1-2×/wk | - | - | See §5 | 1 speed : 1 tempo : 2 easy : 1 long | 2 | 12-16 wk from 10K base |
| **Marathon** | 5-6 run | 30-180 run | 1×/wk | - | - | See §5 | Same as HM + bigger long run | 1-2 | 16-20 wk from HM base |
| **General fitness** | 3-5 | 30-60 | 2-3 × 8-12 | 60-75% / RPE 6-8 | 60-90 s | 150 | 25:75 | 2-3 | Meet ACSM minimums [S1] |
| **Tone / recomp** | 4-5 | 45-60 | 3 × 8-15 | 65-75% / RPE 7-8 | 60-90 s | 150 | 30:70 | 2 | 0.25-0.5% BW/wk, body-comp shift over 12-16 wk [S4] |
| **Rehab / return** | 2-4 | 20-45 | 2-3 × 10-15 | 40-60% / RPE 5-7 | 60-120 s | 60-150 LISS | LISS only initially | 3-5 | Progress 10% volume/wk max [S8] |

---

## 2. Detailed sections per goal

### 2.1 Fat loss (Perder grasa)

**Physiology**: caloric deficit drives fat loss; resistance training preserves lean mass;
cardio expands energy expenditure. Rate >1% BW/wk risks lean-mass loss. [S3]

- **Weekly frequency**: 4-6 sessions total. 3 resistance + 2-3 cardio is the sweet spot. [S1][S3]
- **Session duration**: 45-75 min.
- **Cardio split**: 150-300 min/wk moderate, or 75-150 vigorous, or mix. Meta-analysis
  shows HIIT and MICT produce similar fat loss when energy-equated, but HIIT is more
  time-efficient. [S10] Recommend 20-30% HIIT, 70-80% LISS for most users.
- **Resistance**: 3-4 sets × 8-15 reps, 60-75% 1RM, 45-90 s rest. Compound lifts priority.
- **Periodization**: Daily Undulating Periodization (DUP) works well to sustain intensity
  in a deficit; avoid pure linear hypertrophy blocks while deep in deficit.
- **Rate of progress**: 0.5-1.0% bodyweight per week is the ACSM-safe range. [S3]
- **Metrics**: bodyweight (weekly average, not single weigh-in), waist circumference
  (biweekly), progress photos (biweekly), strength maintenance on 2-3 key lifts,
  body-fat % via skinfolds or BIA monthly (noisy, use as trend).
- **Pitfalls**:
  1. Too-large deficit (>25% TDEE) → muscle loss, metabolic slowdown.
  2. Cutting all resistance training in favor of cardio.
  3. Daily weigh-in emotional reactions; use 7-day rolling avg.
  4. Not adjusting calories as weight drops.
  5. "Earning back" calories from cardio 1:1.

### 2.2 Hypertrophy (Ganar musculo)

**Physiology**: mechanical tension is primary driver; volume is the top adjustable
variable up to MRV; each muscle hit ≥2x/wk beats 1x/wk at matched volume. [S4][S6]

- **Frequency per muscle**: 2× per week minimum, 2-3× optimal. [S6] Translates to:
  full body 3x, upper/lower 4x, PPL 6x (or PPL 3x if advanced with high per-session volume).
- **Weekly volume (hard sets per muscle)**:
  - Novice MEV ≈ 8, MAV 10-14, MRV ≈ 18
  - Intermediate MEV ≈ 10, MAV 12-20, MRV ≈ 22
  - Advanced MEV ≈ 12, MAV 15-25, MRV ≈ 26 [S7]
- **Rep ranges**: 6-12 primary, but 5-30 all grow muscle if taken close to failure (RIR 0-3). [S4]
- **Intensity**: 65-85% 1RM or RPE 7-9 (RIR 0-3).
- **Rest**: 2-3 min for compounds (better hypertrophy than 1 min per Schoenfeld 2016). [S11]
  60-90 s acceptable for isolation.
- **Periodization**: Block or DUP. Accumulation (higher volume) → Intensification (higher
  load, lower volume) → Deload.
- **Rate of progress**:
  - Novice: 0.25-0.5 kg lean mass/wk (~1-2 kg/month)
  - Intermediate: 0.25 kg/month
  - Advanced: 1-2 kg/year [S7]
- **Metrics**: bodyweight trend, limb girths (biceps flexed, thigh, chest), logbook PRs
  in 6-12 rep range, progress photos, strength-to-weight ratio.
- **Pitfalls**:
  1. Junk volume - sets far from failure don't count.
  2. Program hopping (<8 weeks per block).
  3. Insufficient protein (<1.6 g/kg/day).
  4. Caloric maintenance instead of slight surplus (200-500 kcal).
  5. Ignoring progressive overload - same load for months.

### 2.3 Max strength (Ganar fuerza)

**Physiology**: neural adaptation dominates early; later, cross-sectional area + motor
unit recruitment + rate coding. High load is the non-negotiable stimulus. [S5]

- **Frequency**: 3-5 sessions/wk. Main lifts 2-3x/wk.
- **Reps**: 1-5 on main lifts, 5-8 on accessories.
- **Intensity**: 85-100% 1RM for top sets; 70-85% for volume work. RPE 7-9 (not regularly
  RPE 10).
- **Rest**: 3-5 min between heavy sets (shorter compromises force output). [S5]
- **Periodization**: Block (Accumulation → Transmutation → Realization) or linear (5x5 →
  3x3 → 1x1). Conjugate for advanced.
- **Progress rate** (Rippetoe/practical literature):
  - Novice (<6 mo): +2.5-5 kg/wk squat/deadlift, +1-2.5 kg/wk bench/press
  - Intermediate (6-24 mo): +2.5-5 kg/month
  - Advanced (>24 mo): +2.5-5 kg/quarter [S5]
- **Metrics**: 1RM or e1RM every 4-8 wk on squat/bench/deadlift/press; Wilks or DOTS
  score; RPE trend at fixed loads.
- **Pitfalls**:
  1. Grinding RPE 10 every session → CNS fatigue.
  2. Skipping deloads.
  3. Ignoring technique work at submaximal loads.
  4. No accessory hypertrophy block - strength ceiling = muscle size ceiling eventually.

### 2.4 Cardiovascular endurance

- **Frequency**: 3-5 sessions/wk. [S1]
- **Intensity**: ACSM moderate (64-76% HRmax) OR vigorous (77-95% HRmax), or combination.
- **Volume**: 150 min moderate OR 75 min vigorous OR equivalent mix per week, minimum. [S1]
- **HIIT protocols with evidence**:
  - 4×4 Norwegian: 4 min @ 85-95% HRmax / 3 min active recovery, 3x/wk. Raises VO2max
    ~0.5 mL/kg/min per week early. [S12]
  - 30:30s: 30 s hard / 30 s easy × 10-20.
  - Tabata: 20 s all-out / 10 s rest × 8 (4 min); true Tabata requires >170% VO2max.
- **LISS/Zone 2**: 60-120 min sessions, 60-70% HRmax. Mitochondrial biogenesis focus.
- **Periodization**: Polarized (80% easy, 20% hard) outperforms threshold-heavy for VO2max
  improvement. [S13]
- **Metrics**: resting HR (weekly), VO2max estimate (Cooper test or Rockport), HR at fixed
  pace, pace at fixed HR, recovery HR at 1 min.

### 2.5 Running-specific (see §5 for full plans)

### 2.6 General fitness / Mantenimiento

Meet ACSM minimums: 150 min moderate cardio + 2 resistance sessions covering all major
muscle groups + 2-3 flexibility sessions + balance work (esp. >50 y). [S1]

- **Frequency**: 3-5 sessions/wk total.
- **Resistance**: 2-3 full-body days, 2-3 sets × 8-12 reps, 8-10 exercises major groups.
- **Cardio**: 30 min × 5 days moderate OR 25 min × 3 days vigorous.
- **Metrics**: ACSM fitness test battery every 3 mo: push-ups to failure, plank hold,
  sit-and-reach, 1.5-mile run or 12-min walk, resting HR/BP.

### 2.7 Tonificar (recomposition)

No physiological difference from hypertrophy + slight deficit or maintenance. "Tone" =
increased muscle + decreased fat at same or lower bodyweight.

- **Frequency**: 4-5 sessions/wk.
- **Resistance**: 3×8-15, compound + isolation mix, RPE 7-8.
- **Cardio**: 150 min/wk, mostly LISS.
- **Nutrition** (engine dependency): maintenance ±10% calories, protein ≥1.8 g/kg.
- **Realistic**: recomp works best for novices, returning lifters, and those with >20% BF
  (men) / >30% BF (women). Advanced lifters: must cut or bulk. [S14]
- **Timeline**: visible change 8-16 wk.

### 2.8 Rehab / return to training

Follow physician/PT clearance. Generic framework:

- **Frequency**: 2-4 sessions/wk, starting at lower end.
- **Intensity**: 40-60% 1RM, RPE 5-7, never to failure initially.
- **Reps**: 10-15 for tendon/joint conditioning.
- **Progression rule**: ≤10% increase in volume or intensity per week (10% rule). [S8]
- **Contraindications**: pain >3/10 during exercise → reduce load. Pain lasting >24 h
  post-session → reduce volume.
- **Phases**:
  1. Mobility + activation (wk 1-2)
  2. Isolation + light compound (wk 3-4)
  3. Full compound at moderate load (wk 5-8)
  4. Return to normal programming (wk 9+)
- **Metrics**: pain scale, ROM, symmetry (L vs R), functional tests (single-leg squat,
  push-up to failure).

---

## 3. Location adaptation table

| Equipment available | Compound substitutions | Isolation substitutions | Progressive overload method | Split recommendation |
|---|---|---|---|---|
| **Commercial gym** | Barbell squat/bench/deadlift/OHP/row, cable, machines | Full selection | Load (+2.5 kg), sets, reps, tempo | Any split; PPL or U/L optimal |
| **Home gym (barbell + rack + DBs)** | Same as gym | DB variants | Load, micro-plates essential (+0.5-1 kg) | Any split; 5/3/1, StrongLifts |
| **Home (DBs + bands only)** | Goblet squat, DB RDL, DB bench floor press, DB row, band pull-apart, band OHP | DB curl, band tricep, DB lateral | Reps to failure, tempo (3-1-1-0), band tension level, unilateral, 1.5 reps | Full body 3x or U/L 4x |
| **Bodyweight only** | Squat → pistol progression, push-up → archer/one-arm, pull-up → OA negatives, lunges, inverted row, dips | Handstand push-up, L-sit, Nordic curl | Leverage progression, tempo, pauses, unilateral, volume density (same work, less time) | Full body 3-4x or push/pull/legs BW |
| **Outdoor (park, running)** | Run, sprints, pull-ups on bar, dips on bench, box jumps, lunges, step-ups | Calisthenics isolation | Pace, distance, BW progressions, weighted vest | Run 3-4x + calisthenics 2-3x |
| **Combo (gym + home + outdoor)** | Hardest movements at gym, accessories at home, cardio outdoor | - | Use gym for strength day, home for accessory day | U/L split: heavy days gym, light days home; cardio outside |

**Bodyweight progression ladders** (pick current level, progress every 2-3 wk):
- **Squat**: assisted → air squat → split squat → Bulgarian → pistol progression (box→full)
- **Push**: wall → incline → knee → full → archer → one-arm
- **Pull**: scap pulls → negatives → assisted → full → archer → one-arm
- **Hinge**: glute bridge → single-leg bridge → hip thrust → Nordic curl progression
- **Core**: plank → long-lever plank → hollow hold → dragon flag progression

---

## 4. Schedule decision tree (implementable logic)

```
INPUT: days_per_week, minutes_per_session, goal, experience, equipment, can_double_day

Step 1: Gate by minimum viable dose
  if days_per_week == 1 → return "insufficient for goal other than maintenance;
      recommend full-body 1x + encourage 1 more day"
  if minutes_per_session < 20 → reduce volume by 40%, focus compounds only

Step 2: Select split by days_per_week and goal
  if goal in {strength, hypertrophy, tone, general}:
    if days == 2 → FullBody A/B
    if days == 3:
      if experience == novice → FullBody A/B/A (StrongLifts/Starting Strength template)
      else → FullBody A/B/C OR PushPullLegs-once (if hypertrophy)
    if days == 4:
      default → UpperLower (U/L/rest/U/L) [best for strength+hyper per Schoenfeld]
      hypertrophy alternative → PPL + 1 weak-point day
    if days == 5:
      hypertrophy → PPL + Upper + Lower
      strength → 5/3/1 template (OHP, DL, Bench, Squat, accessory)
      general → 3 full body + 2 cardio
    if days == 6:
      hypertrophy-advanced → PPL x 2
      strength → avoid unless advanced; if so, Sheiko / Smolov base
    if days == 7 → insert 1 active recovery/mobility, treat as 6

  if goal == fat_loss:
    resistance_days = min(4, days - 1)
    cardio_days = days - resistance_days
    split = fullbody if resistance_days <= 3 else upper_lower

  if goal == cardio or running:
    see §5 templates

  if goal == rehab:
    cap days at 4, prefer A/B full body with mobility days between

Step 3: Handle two-a-days (can_double_day == true)
  Rules:
    - separate cardio AM / resistance PM by ≥6 h for interference minimization [S15]
    - if resistance is for the same muscle trained in cardio (e.g. legs + running),
      run AM easy, lift PM; never lift heavy then run hard same day
    - cap total weekly load: never >9 "hard" sessions; if two-a-day, one must be easy
    - add +10-20% calories and ≥9 h sleep

Step 4: Day-of-week placement
  - Avoid back-to-back same-muscle days (min 48 h for same muscle at RPE 8+)
  - Place hardest session when user is freshest (day after rest)
  - Long run on weekend if running goal
  - Deadlift/squat: ≥48 h apart; both drain CNS
```

**Split templates** (for engine to render):

- **FullBody-A**: Squat 3×5, Bench 3×5, Row 3×5, Plank 3×30s
- **FullBody-B**: Deadlift 1×5, OHP 3×5, Pull-up 3×max, Ab wheel 3×10
- **Upper**: Bench 4×6, Row 4×6, OHP 3×8, Pull-up 3×8, Curl 3×10, Tricep 3×10
- **Lower**: Squat 4×6, RDL 3×8, Leg press 3×10, Leg curl 3×10, Calf 4×12, Abs 3×15
- **Push**: Bench 4×6, OHP 3×8, Incline DB 3×10, Lateral 3×12, Tricep 3×10
- **Pull**: Deadlift 3×5 (or Row), Pull-up 4×8, Cable row 3×10, Face pull 3×15, Curl 3×10
- **Legs**: Squat 4×6, RDL 3×8, Leg press 3×10, Leg curl 3×10, Calf 4×12

---

## 5. Running program templates

### 5.1 Assess current fitness first (every program)

- **Cooper test** (12 min run, measure distance). VO2max ≈ (distance_m - 504.9) / 44.73. [S16]
- **1.5-mile timed run** (ACSM standard).
- **Talk test**: can hold conversation → Zone 2; only short phrases → threshold; single
  words → VO2max.
- **Max HR test** (only if healthy): after warm-up, 4 min hard, 3 min recover, 4 min
  all-out. Peak HR ≈ HRmax.
- **Lactate threshold estimate**: pace you can hold for ~1 h = LT pace.

### 5.2 Pace zones (use HRmax or LT pace)

| Zone | % HRmax | % LT pace | Purpose |
|---|---|---|---|
| Z1 recovery | 50-60% | <75% | active recovery |
| Z2 easy | 60-70% | 75-85% | aerobic base (majority of volume) |
| Z3 tempo | 70-80% | 85-95% | aerobic capacity |
| Z4 threshold | 80-90% | 95-105% | lactate threshold |
| Z5 VO2max | 90-100% | 105-115% | VO2max |

### 5.3 Couch to 5K (9 weeks, 3 sessions/wk) [S9]

| Wk | Workout (repeat 3x/wk) |
|---|---|
| 1 | 5 min walk WU; 8× (60 s jog / 90 s walk); 5 min walk CD |
| 2 | 5 min WU; 6× (90 s jog / 2 min walk); CD |
| 3 | 5 min WU; 2× (90 s jog, 90 s walk, 3 min jog, 3 min walk); CD |
| 4 | 5 min WU; 3 min jog, 90 s walk, 5 min jog, 2.5 min walk, 3 min jog, 90 s walk, 5 min jog; CD |
| 5a | WU; 5 min jog, 3 min walk, 5 min jog, 3 min walk, 5 min jog; CD |
| 5b | WU; 8 min jog, 5 min walk, 8 min jog; CD |
| 5c | WU; 20 min jog continuous; CD |
| 6a | WU; 5 min jog, 3 min walk, 8 min jog, 3 min walk, 5 min jog; CD |
| 6b | WU; 10 min jog, 3 min walk, 10 min jog; CD |
| 6c | WU; 25 min jog continuous; CD |
| 7 | 3× WU + 25 min jog + CD |
| 8 | 3× WU + 28 min jog + CD |
| 9 | 3× WU + 30 min jog (≈5K) + CD |

### 5.4 10K plan (10 weeks, from 5K base, 4 sessions/wk)

Weekly template: Tue interval, Thu tempo, Sat easy, Sun long.

| Wk | Tue intervals | Thu tempo | Sat easy | Sun long | Total km |
|---|---|---|---|---|---|
| 1 | 6× 400 m Z5 / 2 min walk | 15 min Z3 | 4 km Z2 | 6 km Z2 | 18-22 |
| 2 | 6× 400 m | 18 min Z3 | 4 km | 7 km | 21-25 |
| 3 | 5× 600 m Z5 / 2 min | 20 min Z3 | 5 km | 8 km | 25-28 |
| 4 | 5× 600 m | 22 min Z3 | 5 km | 9 km | 27-30 |
| 5 (deload) | 4× 400 m | 15 min Z3 | 4 km | 6 km | 18-22 |
| 6 | 4× 800 m Z5 / 2 min | 25 min Z3 | 5 km | 10 km | 28-32 |
| 7 | 4× 800 m | 28 min Z3 | 6 km | 11 km | 30-35 |
| 8 | 3× 1000 m Z4 / 3 min | 30 min Z3 | 6 km | 12 km | 32-37 |
| 9 (taper) | 3× 600 m | 20 min Z3 | 5 km | 8 km | 22-26 |
| 10 | 3× 400 m easy | 15 min Z3 | 3 km | **10K race** | race |

### 5.5 Half marathon (12-16 weeks, 4-5 sessions/wk, from 10K base)

Peak week: 48-65 km. Long run peak: 18-20 km.

Weekly template: Tue intervals, Wed easy, Thu tempo, Sat easy or cross, Sun long.

Progression rule: long run +1.5 km/wk, deload every 4th wk back to 70%. Peak 3 wks before
race, 2-wk taper. [S17]

| Phase | Weeks | Long run | Weekly km | Focus |
|---|---|---|---|---|
| Base | 1-4 | 10 → 14 km | 30-40 | aerobic |
| Build | 5-8 | 14 → 18 km | 40-55 | threshold |
| Peak | 9-11 | 18 → 20 km | 50-65 | race pace |
| Taper | 12-14 | 14 → 8 km | 35 → 20 | sharpening |

### 5.6 Marathon (16-20 weeks, 5-6 sessions/wk, from HM base)

Peak: 65-90 km/wk for first-timer, 90-130+ for competitive. Long run peak 30-35 km (3 hr
cap for most runners). [S18]

Weekly structure: 1 interval, 1 tempo, 2-3 easy, 1 long, 1 rest.

| Phase | Weeks | Long run | Weekly km |
|---|---|---|---|
| Base | 1-5 | 16 → 22 km | 40-55 |
| Build | 6-10 | 22 → 28 km | 55-75 |
| Peak | 11-15 | 28 → 32(35) km | 70-90 |
| Taper | 16-18 | 24 → 12 → 8 km | 75 → 50 → 30 |

Key sessions: Yasso 800s (10× 800 m at goal marathon time in min:sec = 800 time), marathon
pace long runs (last 10 km of long run at goal pace).

### 5.7 Current pace assessment protocol (engine flow)

1. Ask: have you run before? last 4-week volume? recent 5K/10K time?
2. If no time: do Cooper test or 1.5-mile run.
3. Compute VDOT (Daniels) or use HR zones from HRmax/HRrest.
4. Assign paces: easy = VDOT easy pace; tempo = VDOT T pace; intervals = VDOT I pace.
5. Recompute every 4 wk.

---

## 6. Recovery and periodization

### 6.1 Rest days by goal/level

| Goal | Novice | Intermediate | Advanced |
|---|---|---|---|
| Fat loss | 2-3 | 1-2 | 1-2 |
| Hypertrophy | 3 | 2 | 1 |
| Strength | 3-4 | 2-3 | 2 |
| Endurance | 2 | 1-2 | 1 |
| Running | 2-3 | 1-2 | 1 |

### 6.2 Deloads

- **Trigger rules** (any of):
  - 4-6 weeks since last deload
  - ≥2 consecutive sessions with performance regression at same RPE
  - Resting HR up >7 bpm for 3+ days
  - HRV drop >10% from baseline
  - Sleep quality declining 3+ nights
  - Joint pain or persistent DOMS >72 h
- **How**: cut volume 40-60% OR load 20%, keep frequency. 1 week. [S7]

### 6.3 Sleep

- 7-9 h/night adults (ACSM/NSF). [S19] Athletes trend 8-10 h.
- Sleep debt impairs strength, reaction time, and hypertrophy signaling.
- Consistent bed/wake time more important than total if ≥7 h.

### 6.4 Warm-up

- 5-10 min general (bike, row, jog) to raise core temp ~1 °C.
- Dynamic mobility for joints used.
- Movement-specific: 2-3 warm-up sets ramping to working load (e.g., 50%×8, 70%×5, 85%×3
  before working set).
- Static stretching pre-workout: reduces max strength 5-10%, avoid immediately before
  heavy lifting or sprinting. [S20]

### 6.5 Cool-down

- 5-10 min low-intensity movement.
- Static stretching 10-30 s per muscle (post-workout, flexibility benefit).
- Nutrition window: 20-40 g protein within 2 h; carbs for endurance refill.

### 6.6 DOMS management

- Peaks 24-72 h post-workout, resolves 72-96 h.
- Most effective: active recovery (light cardio), sleep, adequate protein.
- Limited evidence but commonly used: foam rolling, massage, contrast showers, Omega-3.
- Not effective: NSAIDs (may blunt adaptation), ice baths for hypertrophy goals (blunt
  muscle protein synthesis if used within 1 h post resistance). [S21]

---

## 7. Progressive overload principles

### 7.1 Variables to progress (priority order)

1. **Load** (+2.5% week for compounds, +5% for novice, +1-2% for advanced)
2. **Reps** (add 1-2 reps same load before bumping weight)
3. **Sets** (add 1 set/wk until MRV)
4. **Tempo** (slow eccentric 3-5 s)
5. **ROM** (deficit, paused reps)
6. **Density** (same work, less rest)
7. **Exercise difficulty** (unilateral, leverage change)

### 7.2 Double progression model (engine default)

```
For each exercise:
  rep_target_low = L
  rep_target_high = H
  load = current_load

  Session logic:
    - hit all sets at H reps → next session +2.5-5 kg (compound) or +1-2.5 kg (isolation)
    - hit between L and H → same load, try +1 rep next session
    - hit below L → reduce load 10% OR repeat
    - 3 failed progressions in a row → deload or switch variation
```

### 7.3 When to add sets vs reps vs weight

- **Novice**: linear load weekly, reps/sets fixed.
- **Intermediate**: double progression (reps first, then load).
- **Advanced**: undulating or block; add sets during accumulation, add load during
  intensification.

### 7.4 Plateau breakers

1. Deload 1 week.
2. Switch primary variation (back squat → front squat; flat → incline bench).
3. Change rep range block (hypertrophy block → strength block, or vice versa).
4. Add tempo or paused reps for 3-4 weeks.
5. Check sleep, calories, protein, stress.
6. Reduce training frequency temporarily (recovery-limited athletes).

### 7.5 Deload triggers summary (for engine flag logic)

```
flag_deload = (
  weeks_since_deload >= 5
  OR performance_drop_sessions >= 2
  OR resting_hr_delta > 7
  OR sleep_quality_poor_nights >= 3
  OR joint_pain_score >= 4
  OR missed_reps_3_sessions_in_row
)
```

---

## 8. Sources / references

- **[S1]** ACSM. *ACSM's Guidelines for Exercise Testing and Prescription*, 11th ed.
  Wolters Kluwer, 2021. (FITT-VP framework, HR zones, weekly minimums.)
- **[S2]** Tanaka H, Monahan KD, Seals DR. Age-predicted maximal heart rate revisited.
  *J Am Coll Cardiol* 2001;37(1):153-6.
- **[S3]** Donnelly JE et al. ACSM Position Stand: Appropriate physical activity
  intervention strategies for weight loss and prevention of weight regain for adults.
  *Med Sci Sports Exerc* 2009;41(2):459-471.
- **[S4]** Schoenfeld BJ, Grgic J, Van Every DW, Plotkin DL. Loading recommendations for
  muscle strength, hypertrophy, and local endurance: a re-examination of the repetition
  continuum. *Sports* 2021;9(2):32.
- **[S5]** NSCA. *Essentials of Strength Training and Conditioning*, 4th ed. Haff &
  Triplett eds., Human Kinetics, 2016.
- **[S6]** Schoenfeld BJ, Ogborn D, Krieger JW. Effects of resistance training frequency
  on measures of muscle hypertrophy: systematic review and meta-analysis. *Sports Med*
  2016;46(11):1689-97.
- **[S7]** Israetel M, Hoffmann J, Smith CW. *Scientific Principles of Strength Training*
  & Renaissance Periodization volume landmark tables (MEV/MAV/MRV).
- **[S8]** American Academy of Orthopaedic Surgeons / APTA guidance on the "10% rule" for
  return to training progression.
- **[S9]** NHS Couch to 5K program (originally Josh Clark, 1996). nhs.uk/live-well.
- **[S10]** Wewege M, van den Berg R, Ward RE, Keech A. The effects of HIIT vs MICT on
  body composition in overweight and obese adults: systematic review & meta-analysis.
  *Obes Rev* 2017;18(6):635-646.
- **[S11]** Schoenfeld BJ et al. Longer inter-set rest periods enhance muscle strength
  and hypertrophy in resistance-trained men. *J Strength Cond Res* 2016;30(7):1805-12.
- **[S12]** Helgerud J et al. Aerobic high-intensity intervals improve VO2max more than
  moderate training. *Med Sci Sports Exerc* 2007;39(4):665-71.
- **[S13]** Stöggl TL, Sperlich B. Polarized training has greater impact on key endurance
  variables than threshold, high intensity, or high volume training. *Front Physiol*
  2014;5:33.
- **[S14]** Barakat C et al. Body recomposition: can trained individuals build muscle and
  lose fat at the same time? *Strength Cond J* 2020;42(5):7-21.
- **[S15]** Wilson JM et al. Concurrent training: meta-analysis examining interference of
  aerobic and resistance exercises. *J Strength Cond Res* 2012;26(8):2293-307.
- **[S16]** Cooper KH. A means of assessing maximal oxygen intake: correlation between
  field and treadmill testing. *JAMA* 1968;203(3):201-4.
- **[S17]** Daniels J. *Daniels' Running Formula*, 4th ed. Human Kinetics, 2021. (VDOT
  tables, pace zones.)
- **[S18]** Pfitzinger P, Douglas S. *Advanced Marathoning*, 3rd ed. Human Kinetics, 2019.
- **[S19]** Hirshkowitz M et al. National Sleep Foundation's sleep time duration
  recommendations. *Sleep Health* 2015;1(1):40-43.
- **[S20]** Simic L, Sarabon N, Markovic G. Does pre-exercise static stretching inhibit
  maximal muscular performance? *Scand J Med Sci Sports* 2013;23(2):131-48.
- **[S21]** Roberts LA et al. Post-exercise cold water immersion attenuates acute
  anabolic signaling and long-term adaptations in muscle to strength training. *J Physiol*
  2015;593(18):4285-301.

---

## 9. Engine integration notes

- Every recommendation object should include: `goal`, `frequency`, `split`, `exercises[]`,
  `sets`, `reps`, `intensity_pct_1rm_or_rpe`, `rest_s`, `cardio_block`, `expected_progress`,
  `metrics_to_track[]`, `deload_every_n_weeks`.
- The lookup table in §1 is the primary dispatch; §4 decision tree refines for
  days/equipment; §3 substitutes for equipment; §5 overrides for running goals.
- Progression engine runs double-progression (§7.2) as default; switch to block for
  `experience == advanced`.
- Deload flag evaluator in §7.5 is the single function to gate each weekly plan.
