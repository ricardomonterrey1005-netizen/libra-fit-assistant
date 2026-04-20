# NUTRITION_SCIENCE.md
Evidence-based reference for the FitRicardo nutrition recommender engine.
All numbers are implementation-ready. Sources are listed at the end (ISSN, ACSM, Academy of Nutrition and Dietetics, WHO/FAO, EFSA, NIH ODS, Cochrane, FDA FALCPA, EU Regulation 1169/2011).

---

## 1. CALORIC / MACRO CALCULATOR

### 1.1 BMR — Mifflin-St Jeor (preferred by Academy of Nutrition and Dietetics)

```
Male:   BMR = 10*kg + 6.25*cm - 5*age + 5
Female: BMR = 10*kg + 6.25*cm - 5*age - 161
```

Alternative if body fat % is known — Katch-McArdle (more accurate for lean individuals):
```
BMR = 370 + 21.6 * LBM_kg   where LBM_kg = weight_kg * (1 - bodyFat/100)
```

### 1.2 TDEE — Activity multipliers (Harris-Benedict / Mifflin convention)

| Level | Multiplier | Description |
|---|---|---|
| Sedentary | 1.200 | Desk job, little/no exercise |
| Light | 1.375 | 1-3 sessions/week, light cardio or walking |
| Moderate | 1.550 | 3-5 sessions/week, moderate intensity |
| Active | 1.725 | 6-7 sessions/week, hard training |
| Very active | 1.900 | 2x/day training, physical job + training |

`TDEE = BMR * activityMultiplier`

### 1.3 Goal adjustments (% of TDEE)

| Goal | Rate | Adjustment | Expected weekly change |
|---|---|---|---|
| Aggressive fat loss | >1% BW/wk | -25% TDEE | -0.7 to -1.0 kg |
| Standard fat loss | 0.5-1% BW/wk | -20% TDEE | -0.5 to -0.7 kg |
| Conservative fat loss (recomp) | <0.5% BW/wk | -10 to -15% TDEE | -0.2 to -0.4 kg |
| Maintenance / performance / toning | 0 | 0% | 0 |
| Lean bulk (muscle gain) | 0.25-0.5% BW/wk | +10% TDEE | +0.2 to -0.4 kg |
| Standard bulk | 0.5-1% BW/wk | +15% TDEE | +0.4 to +0.7 kg |
| Aggressive bulk (novice/underweight) | >1% BW/wk | +20% TDEE | +0.7+ kg |

**Floor rules (safety):**
- Never drop below `max(BMR * 1.1, 1500 kcal men / 1200 kcal women)` for sustained periods.
- WHO/ACSM minimum: females >= 1200 kcal, males >= 1500 kcal without medical supervision.

### 1.4 Rate of change sanity caps
- Max sustainable loss: ~1% bodyweight/week (ISSN).
- Max lean gain: ~0.25-0.5 kg/month for trained, up to 1 kg/month for novices (Helms et al.).

---

## 2. MACRONUTRIENT DISTRIBUTION

### 2.1 Protein targets (g/kg bodyweight/day)

| Population | g/kg | Notes |
|---|---|---|
| Sedentary adult (RDA) | 0.8 | Minimum to prevent deficiency (WHO/IOM) |
| General health / active | 1.2-1.6 | Academy of Nutrition and Dietetics |
| Endurance athlete | 1.2-1.6 | ACSM/ISSN |
| Strength/hypertrophy | 1.6-2.2 | ISSN position stand (Jager 2017) |
| Cutting while preserving LBM | 1.8-2.7 | Helms 2014; use higher end when lean |
| Older adult (>60, sarcopenia prevention) | 1.2-1.6 | PROT-AGE consensus |
| Pregnant/lactating | 1.1-1.3 | EFSA |

For obese individuals (BMI >30) use **lean body mass** or adjusted weight (IBW + 0.25*(actual-IBW)) to avoid overestimation.

### 2.2 Fat targets
- Minimum for hormonal function: **0.6 g/kg** (women) / **0.5 g/kg** (men).
- Typical range: 20-35% of kcal (WHO, AMDR).
- Keto: 70-75% of kcal from fat.
- Saturated fat cap: <10% of kcal (WHO 2023 update).

### 2.3 Carbohydrate targets (fill remainder after protein + fat)
- General: 45-65% kcal (AMDR).
- Endurance (>1h daily): 5-7 g/kg light day, 7-10 g/kg heavy, 10-12 g/kg ultra.
- Strength: 4-7 g/kg.
- Fat loss: 2-4 g/kg (minimum ~100 g/day to support CNS and training).
- Keto: <50 g/day net carbs (typically 20-30 g).

### 2.4 Goal-specific distribution (% kcal) — quick lookup

| Goal | Protein | Carbs | Fat |
|---|---|---|---|
| Fat loss | 30-35% | 35-40% | 25-30% |
| Muscle gain (lean bulk) | 25-30% | 45-55% | 20-25% |
| Endurance | 15-20% | 55-65% | 20-25% |
| Keto | 20-25% | 5-10% | 70-75% |
| Balanced / general | 20-25% | 45-55% | 25-30% |
| Recomp / maintenance | 30% | 40% | 30% |

**Implementation rule:** compute protein first (g/kg), fat second (g/kg or %), carbs = remainder.

### 2.5 Fiber
- 14 g per 1000 kcal (Academy of Nutrition and Dietetics / DGA).
- Minimum 25 g women / 38 g men.

---

## 3. MEAL FREQUENCY & TIMING

### 3.1 Meal frequency — evidence
- **3 vs 5-6 meals:** No significant difference in weight loss or metabolic rate when calories/protein are equated (Schoenfeld 2015 meta-analysis, La Bounty 2011 ISSN).
- **Protein distribution matters more than frequency.** For MPS (muscle protein synthesis), distribute protein across 3-5 meals of 0.3-0.4 g/kg each (Areta 2013, Schoenfeld 2018).
- **Practical:** 3-4 meals for adherence; 5-6 for athletes with high kcal needs or those who feel hungry.

### 3.2 Intermittent fasting

| Protocol | Window | Best for | Avoid if |
|---|---|---|---|
| 16/8 (Leangains) | 8h eating | Fat loss, adherence | Heavy AM training, pregnant, ED history |
| 14/10 | 10h eating | General, easier entry | - |
| 5:2 | 500-600 kcal on 2 non-consecutive days | Fat loss, metabolic flexibility | Athletes in high-volume phase |
| OMAD | 1 meal | Not recommended for athletes | Muscle gain goals |
| Ramadan-style | Sunset-sunrise | Religious adherence | Competition phases |

**Evidence:** IF matches continuous caloric restriction for fat loss when kcal equated (Seimon 2015, Harris 2018). Muscle retention may be slightly worse on IF in lean trainees if protein isn't high (Tinsley 2017).

### 3.3 Pre / Intra / Post workout

**Pre-workout (1-3h before):**
- Carbs: 1-4 g/kg (closer to training = smaller amount).
- Protein: 0.25-0.4 g/kg.
- Low fat & fiber to avoid GI distress.

**Intra-workout (only if session >75 min):**
- Carbs: 30-60 g/h (mixed glucose:fructose 2:1 allows up to 90 g/h).
- Electrolytes if sweating heavily or >60 min.

**Post-workout (anabolic window = 2-4h, not 30 min):**
- Protein: 0.25-0.4 g/kg (20-40 g for most).
- Carbs: 1-1.2 g/kg if next session <8h away, otherwise just include in next meal.
- **Myth:** "30-minute window" — meta-analyses (Schoenfeld 2013) show total daily intake dominates.

### 3.4 Protein timing rules (ISSN 2017)
- Spread protein every 3-5h.
- Each feeding: 0.3-0.4 g/kg (min 20 g leucine-rich).
- Pre-sleep: 30-40 g casein improves overnight MPS (Res 2012, Snijders 2015).

---

## 4. TOP FOODS BY GOAL

### 4.1 Fat loss (high satiety, high protein, high volume, low kcal density)
1. Chicken breast
2. Turkey breast
3. Egg whites / whole eggs
4. White fish (cod, tilapia, corvina)
5. Tuna (canned in water)
6. Greek yogurt 0-2%
7. Cottage cheese low-fat
8. Whey / casein protein
9. Lentils
10. Black beans
11. Broccoli, cauliflower, leafy greens
12. Bell peppers, cucumber, tomatoes
13. Berries (strawberries, blueberries)
14. Apples, grapefruit
15. Oats (rolled, not instant)
16. Quinoa
17. Sweet potato
18. Shirataki / konjac noodles
19. Popcorn (air-popped)
20. Coffee, green tea, water

### 4.2 Muscle gain (calorie-dense, quality protein, easy digestion)
1. Ground beef 85/15
2. Lean steak (sirloin, flank)
3. Salmon
4. Whole eggs
5. Chicken thighs
6. Whey + casein blend
7. Greek yogurt full-fat
8. Whole milk
9. Rice (white for volume tolerance, brown for micronutrients)
10. Pasta
11. Oats
12. Sweet potato & white potato
13. Bananas
14. Dried fruit (dates, raisins)
15. Peanut butter / almond butter
16. Olive oil, avocado
17. Nuts (almonds, walnuts, cashews)
18. Granola
19. Cheese
20. Dark chocolate 70%+

### 4.3 Endurance (high-carb, glycogen support, anti-inflammatory)
1. Oats
2. Rice
3. Pasta
4. Sweet potato
5. Bananas
6. Dates / medjool
7. Whole-grain bread
8. Honey
9. Salmon / sardines (omega-3)
10. Chicken breast
11. Eggs
12. Greek yogurt
13. Beets (nitrates)
14. Spinach, kale
15. Berries (polyphenols, recovery)
16. Cherries (tart cherry juice — DOMS reduction)
17. Beans, lentils
18. Tofu / tempeh
19. Dark chocolate
20. Coffee, electrolyte drinks

### 4.4 Keto (<50g net carbs)
1. Beef (fatty cuts)
2. Pork belly, bacon
3. Salmon, mackerel, sardines
4. Eggs
5. Butter, ghee
6. Olive oil, coconut oil, MCT oil
7. Avocado
8. Hard cheeses
9. Heavy cream
10. Greek yogurt full-fat (small portions)
11. Nuts (macadamia, pecans, almonds)
12. Seeds (chia, flax, hemp)
13. Leafy greens (spinach, kale, arugula)
14. Broccoli, cauliflower, zucchini
15. Asparagus, Brussels sprouts
16. Mushrooms
17. Olives
18. Dark chocolate 85%+
19. Berries (small portions)
20. Bone broth

### 4.5 Balanced / general health (Mediterranean pattern)
1. Fatty fish 2x/week (salmon, sardines)
2. Chicken/turkey
3. Eggs
4. Legumes 3x/week (lentils, chickpeas, beans)
5. Greek yogurt
6. Oats, quinoa, brown rice
7. Whole-grain bread
8. Sweet potato
9. Olive oil (extra virgin)
10. Nuts 1 handful/day
11. Seeds (chia, flax)
12. Avocado
13. Leafy greens daily
14. Cruciferous (broccoli, cabbage)
15. Berries
16. Citrus (orange, grapefruit)
17. Tomatoes
18. Garlic, onion
19. Herbs/spices (turmeric, oregano)
20. Water, coffee, green tea

---

## 5. ALLERGENS REFERENCE (Major 14 — EU Reg. 1169/2011 + FDA FALCPA)

| # | Allergen | Hidden sources | Cross-reactivity | Alternatives |
|---|---|---|---|---|
| 1 | **Gluten** (wheat, rye, barley, oats*) | Soy sauce, beer, seitan, couscous, bulgur, breaded foods, soups, sauces | Other cereals; oats via contamination | Rice, corn, quinoa, buckwheat, certified GF oats, cassava |
| 2 | **Crustaceans** (shrimp, crab, lobster) | Surimi, seafood stocks, fish sauce, paella | Molluscs (~40%) | Fish, tofu, tempeh |
| 3 | **Eggs** | Baked goods, pasta, mayo, meringue, marshmallows, vaccines (rare), lecithin (E322 may derive) | - | Flax egg (1 tbsp + 3 tbsp water), chia egg, aquafaba, commercial replacers |
| 4 | **Fish** | Worcestershire sauce, Caesar dressing, fish sauce, omega-3 supplements | Other fish (70% cross-reactive) | Algae omega-3, legumes, tofu |
| 5 | **Peanuts** | Baked goods, satay, African/Asian cuisine, "arachis oil" | Tree nuts (~35%), legumes (low) | Sunflower seed butter, soy butter, pumpkin seed butter |
| 6 | **Soy** | Edamame, tofu, tempeh, soy sauce, miso, emulsifiers (E322 lecithin), processed meats, protein bars | Other legumes (low) | Pea protein, hemp, coconut aminos (soy sauce alt) |
| 7 | **Dairy** (milk) | Casein, whey, lactose, butter, ghee, "natural flavoring", deli meats, bread | Beef (rare ~10%), goat/sheep milk (~90%) | Oat, almond, soy, coconut milk; nutritional yeast (cheese flavor) |
| 8 | **Tree nuts** (almond, cashew, walnut, pecan, pistachio, hazelnut, Brazil, macadamia) | Pesto, marzipan, nut oils, granola | Often cross-reactive between nuts | Seeds (sunflower, pumpkin), roasted chickpeas |
| 9 | **Celery** | Stocks, spice mixes, soups, processed meats | Mugwort, birch pollen (OAS) | Fennel, bok choy |
| 10 | **Mustard** | Dressings, marinades, curry, mayonnaise | Rapeseed, cabbage family | Horseradish (low cross), turmeric |
| 11 | **Sesame** | Tahini, hummus, burger buns, halva, falafel, "vegetable oil" | Poppy seed, other seeds (low) | Sunflower seed paste, pumpkin seed |
| 12 | **Sulphites** (>10 ppm; E220-E228) | Wine, dried fruit, processed potato, shrimp, vinegar | - | Fresh fruit, unsulphured alternatives |
| 13 | **Lupin** | Mediterranean breads, gluten-free flour mixes, pasta | Peanut (~50%), legumes | Chickpea flour, pea protein |
| 14 | **Molluscs** (mussels, oysters, squid, octopus, snails) | Oyster sauce, XO sauce, paella | Crustaceans | Fish, plant proteins |

*Oats are intrinsically GF but frequently contaminated — require "certified GF".

### 5.1 Dietary patterns

| Pattern | Allowed | Excluded | Notes |
|---|---|---|---|
| Vegetarian (lacto-ovo) | Plants, dairy, eggs | Meat, fish | Watch B12, iron, omega-3 |
| Vegan | Plants only | All animal products | Supplement B12 (mandatory), D, omega-3 (algae), consider iron/zinc/iodine |
| Pescatarian | Plants + fish + dairy/eggs | Meat, poultry | Good omega-3 profile |
| Flexitarian | Mostly plants, occasional meat | - | Most flexible |
| Halal | Zabiha-slaughtered meat, no pork, no alcohol | Pork, non-halal meat, alcohol, blood | Check gelatin, vanilla extract (alcohol), enzymes |
| Kosher | Kosher-certified; no pork/shellfish; no meat+dairy mix | Pork, shellfish, mixed meat/dairy meals | Separate utensils; check hechsher |
| Hindu (many) | Often vegetarian; no beef | Beef; sometimes all meat | - |
| Jain | Strict veg; no root vegetables | Meat, eggs, onion, garlic, potato | - |

---

## 6. COOKING PATTERNS

### 6.1 Cook all meals at home
- **Macros accuracy:** ±5% (gold standard).
- **Tips:** Digital scale mandatory, use USDA/INCAP food db, batch proteins + starches, keep 3 "base sauces" (pesto, tomato, tahini).
- **Time budget:** 60-90 min/day or 2-3h batch 2x/week.

### 6.2 Sunday meal prep (7 days)
- **Macros accuracy:** ±5-8%.
- **Storage:** Proteins 3-4 days fridge; rice/pasta 4-5 days; freeze portions days 5-7.
- **Formula:** Cook 2-3 proteins (e.g., chicken + ground beef + tofu), 2 starches (rice + sweet potato), 2 veg bases (roasted + raw), 2 sauces. Mix-and-match.
- **Day-of reheat rule:** Add fresh veg/greens the day of for texture.

### 6.3 Pre-made healthy meals (delivery / grocery prepared)
- **Macros accuracy:** ±10-15% (trust labels but cross-check brand).
- **Tips:** Prefer brands with full macro disclosure, filter <600 kcal/<15g sat fat per meal, add a fruit + veg serving to extend.
- **Watch:** Hidden sodium (often 1200+ mg/meal), added sugars in "healthy" sauces.

### 6.4 Eat out frequently
- **Macros accuracy:** ±20-30% (restaurants under-report oil by 30-50%).
- **Rules of thumb:**
  - Add 20% kcal to menu estimates.
  - Protein palm-size = ~25-30 g.
  - Order grilled/baked, sauce on side, double veg instead of fries.
  - Starch = 1 closed fist (~40-50 g carbs).
- **Chains:** Use official nutrition apps (Subway, Chipotle, Starbucks publish accurate data).

### 6.5 Combination (realistic default)
- **60/40 rule:** Cook breakfasts + dinners (structured), buy lunches (time-saving).
- **Weekly template:** 5 home dinners, 2 restaurant/delivery; 5 packed lunches, 2 bought.
- **Macro buffer:** Budget 100-150 kcal/day "uncertainty buffer" on bought meals.

---

## 7. "BUILD MY MENU" ALGORITHM (pseudocode)

```
FUNCTION buildMenu(userProfile, ingredientsOnHand, days):
    targets = computeTargets(userProfile)   // from sections 1 & 2
    pantryMap = categorize(ingredientsOnHand)
    // categorize -> { protein:[], carb:[], veg:[], fat:[], fruit:[], dairy:[], seasoning:[] }

    missing = checkCoverage(pantryMap, targets)
    IF missing.any: suggestShoppingList(missing)   // e.g., "need 1 protein source"

    mealPlan = []
    FOR day IN 1..days:
        dayMeals = []
        remainingMacros = clone(targets)
        mealSlots = chooseMealCount(userProfile)   // 3 / 4 / 5

        FOR slot IN mealSlots:
            slotFraction = distributionFor(slot)
            // breakfast 25%, lunch 35%, dinner 30%, snack 10% (adjust for training time)

            meal = selectMeal(
                pantry = pantryMap,
                macroBudget = remainingMacros * slotFraction,
                allergens = userProfile.allergens,
                dietPattern = userProfile.diet,
                avoidRepeats = last7meals(mealPlan),
                cookingPattern = userProfile.cookingPattern
            )

            dayMeals.push(meal)
            remainingMacros -= meal.macros
            decrementPantry(pantryMap, meal.ingredients)

        mealPlan.push(dayMeals)

    enforceVariety(mealPlan)   // max 2x same protein/week; rotate veg colors
    enforceProteinDistribution(mealPlan)   // each meal >= 0.3 g/kg protein
    RETURN mealPlan


FUNCTION selectMeal(pantry, macroBudget, allergens, diet, avoidRepeats, cookingPattern):
    candidates = recipeDB
        .filter(r => r.ingredients.every(i => pantry.has(i) OR i.isStaple))
        .filter(r => r.allergens INTERSECT allergens == empty)
        .filter(r => diet.allows(r))
        .filter(r => cookingPattern.supports(r.prepTime))
        .filter(r => !avoidRepeats.includes(r.id))
    // rank by macro fit
    scored = candidates.map(r => ({
        recipe: r,
        score: -macroDistance(r.macros, macroBudget) + varietyBonus(r)
    }))
    RETURN top(scored).recipe


FUNCTION macroDistance(a, b):
    // weighted L2 — protein matters most
    wP=3, wC=1, wF=1
    RETURN sqrt( wP*(a.p-b.p)² + wC*(a.c-b.c)² + wF*(a.f-b.f)² )


FUNCTION categorize(ingredients):
    // Use ingredient ontology (USDA FoodData Central codes)
    MAP:
      chicken, beef, fish, eggs, tofu, lentils  -> protein
      rice, pasta, bread, oats, potato, plantain -> carb
      spinach, broccoli, tomato, pepper         -> veg
      oil, avocado, nuts, butter                -> fat
      apple, banana, berries                    -> fruit
      milk, yogurt, cheese                      -> dairy


FUNCTION checkCoverage(pantry, targets):
    needs = []
    IF !pantry.protein.any: needs.push("protein source")
    IF pantry.veg.count < 3: needs.push("more vegetable variety")
    IF !pantry.fat.any: needs.push("healthy fat (olive oil, nuts, avocado)")
    IF estimateCarbs(pantry) < targets.carbs * 0.7: needs.push("more carbs")
    RETURN needs
```

### 7.1 Variety heuristics
- Max 2 repeats of same protein per 7 days.
- Rotate 5 veg colors weekly (green, red, orange, purple, white).
- Alternate carb sources across days (rice -> potato -> oats -> pasta -> quinoa).

### 7.2 Shopping list generation
If pantry < targets, output prioritized list:
1. Protein gap first (highest macro leverage).
2. Vegetables next (fiber/micros).
3. Healthy fats.
4. Carbs last (usually cheapest gap to fill).

---

## 8. SUPPLEMENT DECISION TREE

### 8.1 Evidence tiers (ISSN / Examine.com consensus)

**Tier A — Strong evidence:**
| Supplement | Dose | Goal | Notes |
|---|---|---|---|
| Creatine monohydrate | 3-5 g/day | Strength, muscle | No loading needed; take any time |
| Whey / casein protein | To hit 1.6-2.2 g/kg | Muscle, fat loss | Food first; supplement if gap |
| Caffeine | 3-6 mg/kg 30-60 min pre | Performance, fat loss | Avoid <6h before sleep |
| Vitamin D3 | 1000-4000 IU | General (if <30 ng/mL 25OH-D) | Test 25(OH)D; Panama UV high but indoor workers often low |
| Omega-3 (EPA+DHA) | 1-3 g/day | General, recovery | 2-3 fatty fish servings/week = no supp |

**Tier B — Moderate evidence:**
| Supplement | Dose | Goal |
|---|---|---|
| Beta-alanine | 3-6 g/day (split) | Endurance, HIIT (60s-4min efforts) |
| Citrulline malate | 6-8 g pre | Pump, strength endurance |
| Electrolytes (Na/K/Mg) | Per sweat loss | Endurance >60 min, hot climate |
| Sodium bicarbonate | 0.2-0.3 g/kg | Anaerobic; GI side effects |
| Beetroot / nitrates | 6-8 mmol NO3 | Endurance |
| Magnesium | 200-400 mg | Sleep, deficiency |
| Ashwagandha | 300-600 mg KSM-66 | Stress, sleep, possible T support |

**Tier C — Limited / conditional:**
Green tea extract (fat loss, modest ~80 kcal/day), HMB (untrained only), glutamine (only GI/clinical).

**Tier D — Skip:**
Testosterone boosters (unless TRT prescribed), fat burners with synephrine/yohimbine stacks, BCAAs (if protein is sufficient), detox teas.

### 8.2 Decision tree (implementation)

```
IF protein_from_food < target: suggest whey (gap_grams/25g scoops)
IF goal = strength/hypertrophy: recommend creatine 5g
IF 25OH-D last test < 30 ng/mL OR no sun exposure: vitamin D3 2000 IU
IF fatty_fish_servings_per_week < 2: omega-3 1-2g EPA+DHA
IF diet = vegan: B12 250 mcg/day OR 2500 mcg/week (MANDATORY)
IF woman menstruating AND ferritin < 30: iron bisglycinate 20-40 mg (with vit C, away from coffee/dairy)
IF endurance athlete AND session > 60 min: electrolytes intra
IF strength athlete AND plateau: creatine (if not taking)
IF pre-training AND tolerates: caffeine 3-6 mg/kg
IF HIIT/CrossFit/sprint sport: beta-alanine 3-5g/day
IF sleep issues: magnesium glycinate 200-400mg
IF pregnant: folate 400-600 mcg, iron, DHA 200mg+ (consult MD)
```

### 8.3 Deficiency pattern detection (from tracking)
If tracker shows, over 14 days:
- Protein < 1.2 g/kg -> suggest whey, high-protein foods
- Fiber < 20 g/day -> suggest legumes, berries, psyllium
- Calcium < 800 mg -> dairy or fortified alternatives
- Iron trend down + female of reproductive age -> flag for clinical test
- Sodium > 3500 mg -> reduce processed foods
- Added sugar > 10% kcal -> specific food swaps

---

## 9. HYDRATION

### 9.1 Baseline
- **35 ml/kg/day** (EFSA/IOM adjusted).
- Men ~3.7 L, women ~2.7 L total water (including food ~20%).

### 9.2 Training adjustments
- **+500-750 ml per hour of training**.
- Weigh pre/post session: replace 125-150% of weight lost (ACSM).
- Urine color: pale straw = euhydrated.

### 9.3 Electrolytes — when
- Any session > 60 min.
- Heat/humidity (Panama default): add electrolytes if sweating heavy >45 min.
- Sodium: 300-700 mg/L sweat (individual, heavy sweaters up to 1500 mg/L).
- Recommended intra: 300-600 mg sodium/hour endurance.

### 9.4 Over-hydration warning
- >1 L/hour without electrolytes risks hyponatremia.
- Cap water at ~800 ml/hour during endurance unless losses measured.

---

## 10. PANAMA / LATIN AMERICAN CONTEXT

### 10.1 Local staples (per 100g cooked unless noted)

| Food | kcal | P (g) | C (g) | F (g) | Notes |
|---|---|---|---|---|---|
| Arroz blanco | 130 | 2.7 | 28 | 0.3 | Staple; pair with beans for complete protein |
| Arroz con guandú | 160 | 5 | 30 | 2 | Traditional; higher protein |
| Frijoles rojos/negros | 127 | 8.7 | 23 | 0.5 | Excellent fiber |
| Lentejas | 116 | 9 | 20 | 0.4 | High protein |
| Plátano maduro (frito) | 215 | 1.3 | 32 | 9 | Watch oil; baked = 150 kcal |
| Plátano verde (patacón) | 200 | 1.5 | 30 | 8 | Fried; baked alternative |
| Yuca cocida | 160 | 1.4 | 38 | 0.3 | Resistant starch if cooled |
| Ñame | 118 | 1.5 | 28 | 0.2 | Low GI |
| Otoe (malanga) | 132 | 1.9 | 32 | 0.2 | Hypoallergenic starch |
| Maíz (tortilla de maíz) | 218 | 5.7 | 45 | 2.8 | Nixtamalized = more niacin |
| Aguacate | 160 | 2 | 9 | 15 | Monounsaturated fat |
| Coco (pulpa) | 354 | 3.3 | 15 | 33 | High sat fat |
| Pescado (corvina, róbalo) | 100-120 | 20-22 | 0 | 2-3 | Lean, local, affordable |
| Pargo rojo | 128 | 26 | 0 | 1.7 | Very lean |
| Carne de res magra | 150-180 | 26 | 0 | 6-8 | |
| Pollo (pechuga) | 165 | 31 | 0 | 3.6 | |
| Huevo (1 unidad ~50g) | 72 | 6.3 | 0.4 | 5 | |
| Queso blanco panameño | 280 | 18 | 3 | 22 | High sat fat/sodium |
| Leche entera | 61 | 3.2 | 4.8 | 3.3 | |
| Mango | 60 | 0.8 | 15 | 0.4 | |
| Papaya | 43 | 0.5 | 11 | 0.3 | Enzyme papain |
| Piña | 50 | 0.5 | 13 | 0.1 | Bromelain |
| Guineo (banano) | 89 | 1.1 | 23 | 0.3 | |
| Sancocho (1 taza, gallina) | ~250 | 22 | 18 | 10 | Traditional; lean if skinless |
| Hojaldra (frita) | 380 | 6 | 45 | 20 | Treat food |
| Tamal | 220 | 7 | 28 | 9 | Varies with relleno |

### 10.2 Cultural eating patterns
- **Desayuno:** Often heavy (hojaldras, tortilla de maíz con queso, huevos, café). Healthier swap: avena con frutas + huevos.
- **Almuerzo principal:** Typically rice + beans/lentils + protein + patacón + ensalada. Balanced if portions controlled (rice ~1 cup, protein palm, patacón 2 pieces).
- **Cena ligera:** Sopas, sándwich. Easy to align with deficit.
- **Frequent:** Fried foods, sugary drinks (chicha, sodas). Swap chicha natural sin azúcar, agua de coco.
- **Seasonings:** Sofrito base (ajo, cebolla, culantro, ají) — low kcal, high flavor. Encourage.

### 10.3 Easily available vs imports
**Cheap & local:** rice, beans, lentils, plantain, yuca, ñame, corvina, pargo, chicken, eggs, mango, papaya, piña, guineo, coco, aguacate, ají, culantro.

**Imported / premium:** salmon, berries (blueberries), quinoa (available but pricier), Greek yogurt (Chobani, local Bonlac), whey protein, almond milk.

**Budget swaps:**
- Salmon -> sardinas enlatadas or corvina + flaxseed.
- Blueberries -> local berries or mora, papaya (vit C).
- Quinoa -> arroz con guandú (similar AA profile when paired).
- Almond milk -> leche de coco (local) or regular low-fat.

### 10.4 Implementation notes for Panama users
- Default food DB: USDA + INCAP (Tabla de Composición de Alimentos para Centroamérica).
- UI unit: grams & "taza / cucharada" equivalences.
- Highlight seasonal fruit to boost adherence (mango Mar-Jun, piña year-round).
- Flag sodium in queso blanco, embutidos, sopas instantáneas (Panama avg intake ~3800 mg vs WHO 2000 mg target).

---

## 11. SOURCES

1. **ISSN Position Stands** (Journal of the ISSN): Protein and Exercise (Jager 2017); Nutrient Timing (Kerksick 2017); Diets and Body Composition (Aragon 2017); Caffeine (Guest 2021); Creatine (Kreider 2017); Beta-Alanine (Trexler 2015).
2. **Academy of Nutrition and Dietetics / ACSM / Dietitians of Canada Joint Position:** Nutrition and Athletic Performance (Thomas, Erdman, Burke 2016).
3. **WHO:** Healthy diet fact sheet 2020; Sodium intake guideline 2012/2023; Saturated and trans-fatty acid intake 2023; Sugars intake guideline 2015.
4. **EFSA:** Dietary reference values (DRVs) 2017; Water intake 2010; Protein 2012.
5. **NIH Office of Dietary Supplements:** fact sheets on Vitamin D, Omega-3, Creatine, Iron, B12.
6. **Cochrane Reviews:** Intermittent fasting vs continuous restriction; Protein supplementation.
7. **Key meta-analyses:** Schoenfeld B. (2013, 2015, 2018) protein timing/frequency; Helms E. (2014) natural bodybuilding; Morton R. (2018) protein and resistance training; Aragon & Schoenfeld (2013) nutrient timing revisited.
8. **FDA FALCPA 2004 & FASTER Act 2021** (sesame added); **EU Regulation 1169/2011** (14 declared allergens).
9. **INCAP Tabla de Composición de Alimentos para Centroamérica** (9ª ed.).
10. **USDA FoodData Central** (for food DB backbone).
11. **PROT-AGE Study Group** (Bauer 2013) — older adult protein.
12. **ACSM Position Stand:** Exercise and Fluid Replacement (Sawka 2007).
13. **Examine.com** supplement reference database (for dose/evidence tiers cross-check).

---

*Reference compiled for FitRicardo recommender engine. Numbers are population averages — always gate with medical disclaimer and encourage professional consultation for clinical conditions (diabetes, CKD, pregnancy, eating disorders).*
