# SUPPLEMENTS.md — Scientific Reference for FitRicardo Supplement Tracker

**Scope:** Evidence-based reference covering ~75 common fitness/nutrition supplements, dosing, safety, interactions, and encodable alert rules.
**Primary sources:** ISSN Position Stands (2017–2023), NIH Office of Dietary Supplements (ODS), EFSA Scientific Opinions, WADA Prohibited List 2024, AIS (Australian Institute of Sport) ABCD Classification, PubMed meta-analyses, Examine.com database.
**Language:** Technical content in English for scientific accuracy; user-facing names in Spanish for the app.
**Last reviewed:** 2026-04.

---

## 1. Executive Summary — Top 15 by Evidence

Ranked by combination of evidence strength, magnitude of effect, safety, and cost-effectiveness. These are the supplements that a rational fitness app should push to 95% of users; everything else is situational or weak.

| Rank | Supplement | Evidence | Main effect | Monthly cost |
|------|------------|----------|-------------|--------------|
| 1 | **Creatine monohydrate** | A+ | +5–15% strength/power, +1–2 kg LBM | $8–20 |
| 2 | **Whey protein** | A | Convenience for hitting 1.6–2.2 g/kg protein target | $25–50 |
| 3 | **Caffeine** | A | +2–7% endurance, +1–3% strength output | $1–5 |
| 4 | **Vitamin D3** | A (for deficient) | Bone/immune/muscle; 40%+ of adults deficient | $3–8 |
| 5 | **Omega-3 (EPA/DHA)** | A | Cardiometabolic, anti-inflammatory, possibly MPS | $10–25 |
| 6 | **Beta-alanine** | A | +2–3% performance in 1–4 min efforts | $10–15 |
| 7 | **Citrulline malate** | B+ | Modest ergogenic in resistance training | $10–20 |
| 8 | **Dietary nitrate (beetroot)** | A | +1–3% endurance, BP reduction | $15–30 |
| 9 | **Sodium/electrolytes** | A (endurance) | Prevents hyponatremia/cramps >60 min | $5–15 |
| 10 | **Protein (any form) to hit target** | A | Adequate intake = the outcome-driver | varies |
| 11 | **Magnesium (glycinate/citrate)** | B | Corrects common deficiency; sleep, cramps | $5–15 |
| 12 | **Zinc** | B | Testosterone/immune in deficient | $3–8 |
| 13 | **Ashwagandha (KSM-66)** | B | Stress, sleep, modest strength/T effects | $15–25 |
| 14 | **Melatonin (0.3–1 mg)** | B | Sleep onset, jet lag | $3–10 |
| 15 | **Multivitamin (low-dose)** | C (insurance) | Fills micronutrient gaps | $5–15 |

**Everything else:** situational, weak, or not recommended for general users.

---

## 2. Full Supplement Database

Format: JS-object entries ready to drop into a data file. IDs are snake_case, user-facing names in Spanish.

### A. Proteins & Amino Acids

```js
{
  id: 'whey_concentrate',
  name: 'Whey Protein Concentrado',
  category: 'protein',
  evidenceTier: 'A',
  mainBenefit: 'Aporte proteico de alto valor biológico, rápida absorción',
  benefits: [
    'Leucina ~2.5 g/scoop activa mTOR/MPS',
    'BV ~104, digestibilidad PDCAAS=1.0',
    'Ayuda a alcanzar 1.6–2.2 g/kg/día'
  ],
  bestFor: ['muscleGain','fatLoss','strength','generalHealth'],
  notFor: ['lactoseIntolerant_severe'],
  dose: { perServing: '20–40 g proteína', daily: 'hasta llegar al target total' },
  timing: { postWorkout: 'óptimo 0–2 h', anytime: 'funciona cualquier momento' },
  cycling: 'No necesario',
  safeUpperLimit: 'No hay UL; hasta ~3.5 g/kg/día seguro en sanos (ISSN 2017)',
  sideEffects: ['GI bloating en intolerantes a lactosa','acné leve en predispuestos'],
  contraindications: ['ERC estadio 4–5 sin supervisión','alergia a proteína de leche'],
  interactions: ['Calcio reduce absorción de hierro si se toman juntos'],
  cost: { monthly: '$25–50', value: 'excelente' },
  forms: ['polvo'],
  notes: '70–80% proteína, algo de lactosa/grasa. Mejor costo/beneficio que isolate para la mayoría.',
  scientificSources: ['Jäger et al. ISSN Position Stand Protein 2017','Morton et al. BJSM 2018 meta-analysis']
},
{
  id: 'whey_isolate',
  name: 'Whey Protein Isolado',
  category: 'protein',
  evidenceTier: 'A',
  mainBenefit: 'Whey purificado, ~90% proteína, casi sin lactosa',
  benefits: ['Misma eficacia anabólica que concentrate','Tolerado por intolerantes leves a lactosa'],
  bestFor: ['muscleGain','fatLoss','lactoseSensitive'],
  dose: { perServing: '20–40 g' },
  timing: { postWorkout: 'óptimo', anytime: 'ok' },
  safeUpperLimit: 'Ver whey_concentrate',
  sideEffects: ['Raros'],
  contraindications: ['Alergia a proteína de leche'],
  cost: { monthly: '$35–65', value: 'bueno si hay intolerancia' },
  notes: 'No superior al concentrate para ganancias; solo justificado por lactosa o grasa ultra-baja.',
  scientificSources: ['ISSN 2017']
},
{
  id: 'whey_hydrolyzed',
  name: 'Whey Hidrolizado',
  category: 'protein',
  evidenceTier: 'B',
  mainBenefit: 'Pre-digerido, absorción marginal más rápida',
  benefits: ['Picos de aminoacidemia ligeramente mayores'],
  bestFor: ['postWorkout_elite'],
  dose: { perServing: '20–40 g' },
  safeUpperLimit: 'Ver whey',
  sideEffects: ['Amargo'],
  cost: { monthly: '$50–90', value: 'pobre — sobreprecio sin beneficio clínico' },
  notes: 'Diferencia vs isolate es trivial en outcomes reales. Marketing premium.',
  scientificSources: ['Buckley et al. 2010 JSCR']
},
{
  id: 'casein',
  name: 'Caseína',
  category: 'protein',
  evidenceTier: 'A',
  mainBenefit: 'Liberación lenta de aminoácidos, ideal pre-sueño',
  benefits: ['Reduce proteólisis nocturna','Aminoacidemia sostenida 6–8 h'],
  bestFor: ['muscleGain','preSleep'],
  dose: { perServing: '30–40 g antes de dormir' },
  timing: { preSleep: 'óptimo' },
  safeUpperLimit: 'Ver whey',
  sideEffects: ['Similar a whey'],
  contraindications: ['Alergia a lácteos'],
  cost: { monthly: '$30–55', value: 'bueno si entrena y duerme separados por >4h' },
  notes: 'No mágica; la proteína total del día importa más que el timing.',
  scientificSources: ['Res et al. 2012 MSSE','Snijders et al. 2015 J Nutr']
},
{
  id: 'plant_protein_pea',
  name: 'Proteína de Guisante',
  category: 'protein',
  evidenceTier: 'B+',
  mainBenefit: 'Alternativa vegetal con buen perfil de leucina',
  benefits: ['Hipoalergénica','Equivalente a whey si dosis ≥25 g y leucina ajustada'],
  bestFor: ['vegans','lactoseIntolerant'],
  dose: { perServing: '30–40 g (vs 25 g whey)' },
  cost: { monthly: '$30–55' },
  notes: 'Mezclar con arroz mejora perfil. Babault 2015 mostró no-inferioridad vs whey en resistance training.',
  scientificSources: ['Babault et al. 2015 JISSN']
},
{
  id: 'plant_protein_soy',
  name: 'Proteína de Soya',
  category: 'protein',
  evidenceTier: 'B+',
  mainBenefit: 'Proteína vegetal completa, PDCAAS=1.0',
  benefits: ['Perfil completo de aminoácidos','Fitoestrógenos con efecto cardiometabólico neutro/positivo'],
  bestFor: ['vegans'],
  dose: { perServing: '25–40 g' },
  sideEffects: ['Mito de feminización no respaldado (Messina 2010 meta-analysis)'],
  cost: { monthly: '$20–40' },
  scientificSources: ['Messina 2010 Fertil Steril','Hevia-Larraín 2021 Sports Med']
},
{
  id: 'plant_protein_rice',
  name: 'Proteína de Arroz',
  category: 'protein',
  evidenceTier: 'B',
  mainBenefit: 'Vegetal hipoalergénica',
  benefits: ['Dosis altas (48 g) equivalen a whey (Joy 2013)'],
  dose: { perServing: '40–48 g' },
  notes: 'Baja en lisina; mejor mezclar con guisante.',
  scientificSources: ['Joy et al. 2013 Nutr J']
},
{
  id: 'plant_protein_hemp',
  name: 'Proteína de Hemp',
  category: 'protein',
  evidenceTier: 'C',
  mainBenefit: 'Vegetal con omega-3 ALA',
  benefits: ['Perfil graso favorable'],
  notes: 'Baja en leucina y lisina. No óptima como única fuente.'
},
{
  id: 'bcaa',
  name: 'BCAA (leucina/isoleucina/valina)',
  category: 'amino_acid',
  evidenceTier: 'C',
  mainBenefit: 'Ninguno demostrado si la proteína total es adecuada',
  benefits: ['Marketing; posiblemente reduce DOMS levemente'],
  bestFor: ['fastedTraining_niche'],
  notFor: ['anyoneHittingProteinTarget'],
  dose: { perServing: '5–10 g (ratio 2:1:1)' },
  safeUpperLimit: '20 g/día',
  sideEffects: ['Desequilibrio con otros AA si se abusa'],
  cost: { monthly: '$20–40', value: 'pobre — desperdicio de dinero' },
  notes: 'ISSN y múltiples meta-análisis (Wolfe 2017, Plotkin 2021) concluyen que BCAA aislados no producen MPS significativa sin los 9 EAA. Redundante si ya tomas whey.',
  scientificSources: ['Wolfe 2017 JISSN','Plotkin et al. 2021']
},
{
  id: 'eaa',
  name: 'EAA (9 aminoácidos esenciales)',
  category: 'amino_acid',
  evidenceTier: 'B',
  mainBenefit: 'Estimulan MPS con menos gramos que proteína completa',
  benefits: ['~6–10 g activan MPS','Útil intra-entreno si ayuno'],
  bestFor: ['fastedTraining','elderly_lowAppetite'],
  dose: { perServing: '10–15 g con ≥3 g leucina' },
  cost: { monthly: '$30–60', value: 'medio — whey suele ser mejor costo/beneficio' },
  notes: 'Más útiles que BCAA pero rara vez necesarios si hay proteína adecuada.',
  scientificSources: ['Jackman et al. 2017 Front Physiol']
},
{
  id: 'glutamine',
  name: 'Glutamina',
  category: 'amino_acid',
  evidenceTier: 'C',
  mainBenefit: 'Ninguno claro en sanos bien alimentados',
  benefits: ['Posible en pacientes quemados/UCI (no atletas)','Salud intestinal: evidencia muy débil'],
  notFor: ['muscleGain','recovery_inHealthyAthletes'],
  dose: { perServing: '5–10 g' },
  safeUpperLimit: '30 g/día',
  cost: { monthly: '$15–30', value: 'pobre' },
  notes: 'Gleeson 2008 y múltiples reviews: sin efecto ergogénico en atletas sanos.',
  scientificSources: ['Gleeson 2008 J Nutr']
},
{
  id: 'beta_alanine',
  name: 'Beta-Alanina',
  category: 'amino_acid_derivative',
  evidenceTier: 'A',
  mainBenefit: 'Mejora rendimiento en esfuerzos 1–4 min',
  benefits: [
    'Aumenta carnosina muscular 40–80%',
    '+2–3% rendimiento en 1–4 min (meta-analysis Saunders 2017)',
    'Útil en HIIT, crossfit, reps 8–15, 400–1500 m'
  ],
  bestFor: ['hiit','crossfit','middleDistance','bodybuilding_highReps'],
  notFor: ['pureStrength_1RM','marathon'],
  dose: {
    loading: '3.2–6.4 g/día divididos en dosis de 0.8–1.6 g',
    duration: 'Mínimo 4 semanas para saturar carnosina',
    maintenance: '3.2 g/día'
  },
  timing: { anytime: 'No importa el timing; es acumulativo' },
  cycling: 'Opcional; algunos sugieren 4 sem off cada 12 sem',
  safeUpperLimit: '6.4 g/día',
  sideEffects: [
    'Parestesia (hormigueo) dosis >1 g de una vez — inocua',
    'Usar forma de liberación sostenida o dividir dosis para evitar'
  ],
  contraindications: ['Ninguna grave conocida'],
  cost: { monthly: '$10–15', value: 'excelente' },
  scientificSources: ['Trexler et al. ISSN Position Stand Beta-Alanine 2015','Saunders 2017 BJSM meta-analysis']
},
{
  id: 'citrulline_malate',
  name: 'Citrulina Malato',
  category: 'amino_acid',
  evidenceTier: 'B+',
  mainBenefit: 'Aumenta óxido nítrico, reduce fatiga percibida',
  benefits: [
    'Más reps al fallo (+10–15% en algunos estudios, efecto modesto)',
    'Reduce DOMS',
    'Mejora vasodilatación'
  ],
  bestFor: ['bodybuilding','strengthEndurance','pumpTraining'],
  dose: { preWorkout: '6–8 g, 40–60 min antes' },
  timing: { preWorkout: 'óptimo' },
  safeUpperLimit: '10 g/día',
  sideEffects: ['GI discomfort a dosis >10 g'],
  cost: { monthly: '$15–25', value: 'bueno' },
  notes: 'Más eficaz que L-arginina oral (la citrulina eleva arginina plasmática más).',
  scientificSources: ['Pérez-Guisado & Jakeman 2010 JSCR','Vårvik et al. 2021 meta-analysis']
},
{
  id: 'arginine',
  name: 'L-Arginina',
  category: 'amino_acid',
  evidenceTier: 'C',
  mainBenefit: 'Pobre biodisponibilidad oral — usa citrulina en su lugar',
  notFor: ['mostUses'],
  dose: { perServing: '3–6 g (generalmente ineficaz)' },
  cost: { monthly: '$10–20', value: 'pobre' },
  notes: 'Primer paso hepático destruye mayoría. Citrulina es superior para elevar arginina plasmática.',
  scientificSources: ['Schwedhelm 2008 Br J Clin Pharmacol']
},
{
  id: 'taurine',
  name: 'Taurina',
  category: 'amino_acid_like',
  evidenceTier: 'B',
  mainBenefit: 'Ligero efecto ergogénico, apoyo cardiovascular',
  benefits: ['Mejora modesta en endurance','Posible reducción de DOMS','Antioxidante'],
  dose: { perServing: '1–3 g pre-entreno; hasta 6 g/día' },
  safeUpperLimit: '3 g/día (EFSA ADI)',
  sideEffects: ['Raros a dosis <3 g'],
  cost: { monthly: '$5–15' },
  scientificSources: ['Waldron et al. 2018 Sports Med meta-analysis']
},
{
  id: 'hmb',
  name: 'HMB (beta-hidroxi-beta-metilbutirato)',
  category: 'amino_acid_derivative',
  evidenceTier: 'C',
  mainBenefit: 'Posible anti-catabólico en principiantes o déficit calórico severo',
  benefits: ['Útil en principiantes y mayores','Minimo/nulo en avanzados (ISSN 2013)'],
  bestFor: ['beginners','elderly','severeDeficit'],
  notFor: ['trainedLifters'],
  dose: { daily: '3 g/día (1 g × 3)' },
  safeUpperLimit: '6 g/día',
  cost: { monthly: '$25–50', value: 'pobre para avanzados' },
  notes: 'Hipes tempranos no se replicaron en sujetos entrenados (Rowlands 2009, Phillips 2017).',
  scientificSources: ['Wilson et al. ISSN 2013','Phillips 2017 Nutrients review']
},
{
  id: 'creatine_monohydrate',
  name: 'Creatina Monohidrato',
  category: 'amino_acids_derivatives',
  evidenceTier: 'A',
  mainBenefit: 'Incremento de fuerza y masa muscular',
  benefits: [
    '+5–15% fuerza y potencia',
    '+1–2 kg masa magra en 4–8 semanas',
    'Mejor recuperación entre series',
    'Beneficios cognitivos emergentes (memoria, fatiga mental)'
  ],
  bestFor: ['muscleGain','strength','hiit','sprints','cognitive'],
  notFor: ['pureEnduranceLongDistance'],
  dose: {
    loading: '20 g/día × 5–7 días (4 × 5 g)',
    maintenance: '3–5 g/día',
    optimal: '5 g/día sin carga (mismo efecto en 3–4 semanas)'
  },
  timing: {
    postWorkout: 'ligeramente óptimo (con carbs/proteína)',
    anytime: 'lo crítico es tomarla DIARIO'
  },
  cycling: 'No necesario. Uso indefinido seguro.',
  safeUpperLimit: '10 g/día (sin beneficio > 5 g)',
  sideEffects: [
    'Retención de agua intracelular (+0.5–1 kg, no edema)',
    'GI si >5 g de una vez',
    'Calambres — MITO, no respaldado'
  ],
  contraindications: [
    'ERC estadio 3–5 pre-existente',
    'Solo supervisión médica si hay enfermedad renal'
  ],
  interactions: ['Aumentar ~500 ml agua extra/día'],
  cost: { monthly: '$8–20', value: 'excelente' },
  forms: ['polvo','cápsulas'],
  notes: 'El suplemento más estudiado (>500 RCTs). Creapure® es referencia de pureza. Otras formas (HCL, buffered, etc.) NO son superiores.',
  scientificSources: [
    'Kreider et al. ISSN Position Stand Creatine 2017',
    'Chilibeck 2017 Open Access J Sports Med',
    'Candow et al. 2019 Front Nutr'
  ]
},
{
  id: 'creatine_hcl',
  name: 'Creatina HCL',
  category: 'amino_acids_derivatives',
  evidenceTier: 'B-',
  mainBenefit: 'Misma eficacia que monohidrato, más cara',
  notes: 'Sin evidencia de superioridad. Monohidrato es gold-standard.',
  cost: { monthly: '$25–50', value: 'pobre' },
  scientificSources: ['Jäger 2011 Amino Acids']
},
{
  id: 'creatine_buffered',
  name: 'Creatina Buffered (Kre-Alkalyn)',
  category: 'amino_acids_derivatives',
  evidenceTier: 'D',
  notes: 'Jagim 2012 mostró no-superioridad vs monohidrato. Marketing engañoso.',
  scientificSources: ['Jagim et al. 2012 JISSN']
}
```

### B. Vitamins & Minerals

```js
{
  id: 'multivitamin',
  name: 'Multivitamínico',
  category: 'vitamin_mineral',
  evidenceTier: 'C',
  mainBenefit: 'Póliza de seguro contra deficiencias',
  benefits: ['Corrige deficiencias subclínicas','No mejora rendimiento en bien-nutridos'],
  bestFor: ['poorDietUsers','travelers','caloricDeficit'],
  dose: { daily: '1 cápsula/comprimido según fabricante' },
  safeUpperLimit: 'Ver vitaminas individuales (A, D, B6, hierro son los riesgos)',
  sideEffects: ['Orina amarilla fluorescente (B2, inocua)','GI en ayunas'],
  contraindications: ['Hemocromatosis (evitar los con hierro)','embarazo sin prenatal específico'],
  cost: { monthly: '$5–15' },
  notes: 'Elegir sin megadosis. Evitar A retinol > 3000 IU si mujer fértil.',
  scientificSources: ['NIH ODS Multivitamin Fact Sheet']
},
{
  id: 'vitamin_d3',
  name: 'Vitamina D3 (colecalciferol)',
  category: 'vitamin',
  evidenceTier: 'A',
  mainBenefit: 'Salud ósea, función muscular, inmunidad',
  benefits: [
    'Corrige deficiencia (40–70% adultos según región/piel)',
    'Mejora fuerza en deficientes',
    'Reduce riesgo de fractura e infección respiratoria'
  ],
  bestFor: ['everyone_especially_indoor_workers','darkSkin','northernLatitudes'],
  dose: {
    daily: '1000–2000 IU/día mantenimiento',
    deficiency: '4000–5000 IU/día × 8–12 sem luego re-testear',
    target: 'niveles séricos 30–50 ng/mL (75–125 nmol/L)'
  },
  timing: { withFat: 'óptimo (liposoluble)' },
  safeUpperLimit: '4000 IU/día (IOM), 10000 IU/día (Endocrine Society) sin supervisión',
  toxicityThreshold: '>10000 IU/día crónico, o niveles >100 ng/mL',
  sideEffects: ['Toxicidad: hipercalcemia, cálculos, náuseas — solo en sobredosis crónica'],
  contraindications: ['Hipercalcemia','sarcoidosis','hiperparatiroidismo'],
  interactions: ['Tomar con grasa','separar de calcio >500 mg'],
  cost: { monthly: '$3–8', value: 'excelente' },
  notes: 'Ideal medir 25(OH)D antes de dosificar. Panamá: alta luz solar pero gente indoor sigue deficiente.',
  scientificSources: ['Holick 2011 Endocrine Society Guidelines','NIH ODS Vitamin D','EFSA NDA 2016']
},
{
  id: 'vitamin_b12',
  name: 'Vitamina B12 (cobalamina)',
  category: 'vitamin',
  evidenceTier: 'A (en veganos/mayores)',
  mainBenefit: 'Prevención de anemia megaloblástica y daño neurológico',
  benefits: ['Esencial en veganos (no hay fuentes vegetales confiables)','Absorción reducida >50 años'],
  bestFor: ['vegans','vegetarians','elderly','metformin_users'],
  dose: {
    daily: '250–500 μg/día (cianocobalamina o metilcobalamina)',
    weekly_alternative: '2000 μg semanal'
  },
  safeUpperLimit: 'No hay UL establecido (soluble en agua)',
  sideEffects: ['Ninguno documentado en dosis orales'],
  cost: { monthly: '$3–10' },
  scientificSources: ['NIH ODS B12','EFSA 2015']
},
{
  id: 'vitamin_c',
  name: 'Vitamina C',
  category: 'vitamin',
  evidenceTier: 'B (inmunidad), D (rendimiento)',
  benefits: ['Ligera reducción duración resfriados','Co-factor colágeno'],
  notFor: ['megadosingForPerformance'],
  dose: { daily: '200–1000 mg' },
  safeUpperLimit: '2000 mg/día (UL IOM)',
  sideEffects: ['GI y diarrea osmótica >3 g','Falsos positivos en glucosuria'],
  interactions: ['Altas dosis post-entreno pueden BLOQUEAR adaptaciones al entrenamiento (Ristow 2009)'],
  cost: { monthly: '$3–10' },
  notes: 'NO tomar megadosis alrededor del entrenamiento; bloquea señalización ROS adaptativa.',
  scientificSources: ['Ristow et al. 2009 PNAS','Merry 2016 J Physiol']
},
{
  id: 'vitamin_e',
  name: 'Vitamina E',
  category: 'vitamin',
  evidenceTier: 'C',
  notFor: ['routineSupplementation'],
  dose: { daily: 'No suplementar rutinariamente' },
  safeUpperLimit: '1000 mg (1500 IU)/día',
  sideEffects: ['Dosis altas aumentan mortalidad (Miller 2005 meta-analysis)','Riesgo hemorragia con anticoagulantes'],
  contraindications: ['Warfarina','cirugía próxima'],
  notes: 'Evitar suplementar si no hay deficiencia. Misma precaución que C vs adaptación.',
  scientificSources: ['Miller et al. 2005 Ann Intern Med','Ristow 2009']
},
{
  id: 'vitamin_b_complex',
  name: 'Complejo B',
  category: 'vitamin',
  evidenceTier: 'C (general), B (veganos/estresados)',
  benefits: ['Metabolismo energético','corrige deficiencias comunes'],
  dose: { daily: '1 tableta según fabricante' },
  safeUpperLimit: 'B6 < 100 mg/día (neuropatía sensitiva >200 mg crónico)',
  sideEffects: ['B3 flush','B6 neuropatía periférica en megadosis'],
  cost: { monthly: '$5–10' }
},
{
  id: 'magnesium_glycinate',
  name: 'Magnesio Glicinato',
  category: 'mineral',
  evidenceTier: 'B',
  mainBenefit: 'Alta biodisponibilidad, suave con GI, mejor para sueño',
  benefits: ['Corrige deficiencia (50% de la población)','Mejora sueño','Reduce calambres','Relaja muscularmente'],
  dose: { daily: '200–400 mg magnesio elemental' },
  timing: { evening: 'óptimo para sueño' },
  safeUpperLimit: '350 mg/día de suplemento (IOM UL); dosis más altas = diarrea',
  sideEffects: ['Diarrea en óxido/citrato a dosis altas'],
  contraindications: ['ERC (riesgo hipermagnesemia)'],
  cost: { monthly: '$10–20', value: 'bueno' },
  scientificSources: ['NIH ODS Magnesium']
},
{
  id: 'magnesium_citrate',
  name: 'Magnesio Citrato',
  category: 'mineral',
  evidenceTier: 'B',
  mainBenefit: 'Buena biodisponibilidad, efecto laxante útil o molesto',
  dose: { daily: '200–400 mg elemental' },
  sideEffects: ['Laxante a >400 mg'],
  cost: { monthly: '$5–15' }
},
{
  id: 'magnesium_oxide',
  name: 'Magnesio Óxido',
  category: 'mineral',
  evidenceTier: 'C',
  notes: 'Biodisponibilidad baja (~4%). Usado más como laxante que suplemento nutricional.',
  cost: { monthly: '$3–10', value: 'pobre para corregir deficiencia' }
},
{
  id: 'zinc',
  name: 'Zinc',
  category: 'mineral',
  evidenceTier: 'B',
  benefits: ['Inmunidad','síntesis de testosterona en deficientes','cicatrización'],
  bestFor: ['vegetarians','heavySweaters','deficient'],
  dose: { daily: '15–30 mg (elemental)' },
  safeUpperLimit: '40 mg/día (IOM UL)',
  sideEffects: ['Náusea en ayunas','deficiencia de cobre si >50 mg crónico'],
  interactions: ['Compite con hierro y cobre — separar por 2 h'],
  cost: { monthly: '$3–8' },
  notes: 'Zinc picolinato o bisglicinato tienen mejor absorción que sulfato.',
  scientificSources: ['NIH ODS Zinc']
},
{
  id: 'iron',
  name: 'Hierro',
  category: 'mineral',
  evidenceTier: 'A (en deficientes)',
  mainBenefit: 'Corrige ferropenia; crítico para atletas mujeres',
  benefits: ['Restaura capacidad aeróbica en deficientes','Reduce fatiga'],
  bestFor: ['menstruatingWomen','vegetarians','enduranceAthletes_confirmedLowFerritin'],
  notFor: ['menWithoutDeficiency','hemochromatosisCarriers'],
  dose: {
    prevention: '18 mg/día (RDA mujer)',
    deficiency: '65–200 mg/día hierro elemental vía oral en días alternos (Stoffel 2020 optimiza absorción)'
  },
  timing: { empty_stomach: 'mejor absorción', with_vitC: 'potencia absorción 2–3×' },
  safeUpperLimit: '45 mg/día (IOM UL) sin supervisión médica',
  sideEffects: ['Estreñimiento','náuseas','heces negras','sobredosis letal en niños (>60 mg/kg)'],
  contraindications: [
    'Hemocromatosis (MORTAL a largo plazo)',
    'Talasemia sin supervisión',
    'NO suplementar sin analítica de ferritina'
  ],
  interactions: [
    'Calcio reduce absorción — separar 2 h',
    'Café/té taninos reducen 40–60% — no tomar juntos',
    'Antiácidos/IBP reducen absorción'
  ],
  cost: { monthly: '$5–15' },
  notes: 'NO asumir deficiencia. Medir ferritina primero. Hombres adultos rara vez la necesitan.',
  scientificSources: ['Stoffel 2020 Haematologica','NIH ODS Iron']
},
{
  id: 'calcium',
  name: 'Calcio',
  category: 'mineral',
  evidenceTier: 'B',
  benefits: ['Salud ósea en baja ingesta','prevención osteoporosis'],
  bestFor: ['lowDairyIntake','postmenopausal','elderly'],
  dose: { daily: '500–1000 mg elemental (si dieta <800 mg)' },
  safeUpperLimit: '2500 mg/día total (IOM UL adultos 19–50)',
  sideEffects: ['Estreñimiento','cálculos','posible riesgo CV en megadosis >1500 mg de suplemento (Bolland 2010)'],
  interactions: ['Compite con hierro y zinc — separar'],
  cost: { monthly: '$5–15' },
  notes: 'Preferir lácteos/comida. Suplementar solo si dieta pobre. Dividir dosis <500 mg para absorción.',
  scientificSources: ['Bolland et al. 2010 BMJ','NIH ODS Calcium']
},
{
  id: 'iodine',
  name: 'Yodo',
  category: 'mineral',
  evidenceTier: 'A (deficientes)',
  benefits: ['Función tiroidea'],
  dose: { daily: '150 μg (RDA)' },
  safeUpperLimit: '1100 μg/día (IOM UL)',
  sideEffects: ['Tiroiditis autoinmune en susceptibles con megadosis'],
  notes: 'Sal yodada cubre en mayoría. Veganos y dietas sin sal: suplementar. Panamá: sal yodada por ley.'
},
{
  id: 'selenium',
  name: 'Selenio',
  category: 'mineral',
  evidenceTier: 'B',
  benefits: ['Antioxidante (glutatión peroxidasa)','función tiroidea'],
  dose: { daily: '55–200 μg' },
  safeUpperLimit: '400 μg/día (UL); toxicidad en >800 μg',
  sideEffects: ['Selenosis: pérdida de cabello, uñas quebradizas, aliento a ajo'],
  notes: '2 nueces de Brasil cubren RDA. NO megadosis.'
}
```

### C. Omega-3 & Fatty Acids

```js
{
  id: 'omega3_fish',
  name: 'Omega-3 EPA/DHA (aceite de pescado)',
  category: 'fatty_acid',
  evidenceTier: 'A',
  mainBenefit: 'Salud cardiovascular, anti-inflamatorio, posible MPS',
  benefits: [
    'Reduce triglicéridos 20–30% a dosis altas',
    'Anti-inflamatorio sistémico',
    'Posible mejora de MPS y fuerza (Smith 2015)',
    'Salud ocular y cerebral'
  ],
  bestFor: ['everyone','lowFishIntake','inflammatoryConditions'],
  dose: {
    general: '1–2 g EPA+DHA/día',
    therapeutic: '2–4 g EPA+DHA/día',
    note: 'Leer etiqueta: EPA+DHA, no peso total del aceite'
  },
  timing: { withMeal: 'mejor absorción' },
  safeUpperLimit: '5 g EPA+DHA/día (EFSA)',
  sideEffects: ['Regusto a pescado','eructos','riesgo hemorragia en megadosis (>3 g)','heces blandas'],
  contraindications: ['Anticoagulantes (warfarina) sin supervisión','cirugía próxima'],
  interactions: ['Potencia anticoagulantes','aspirina a dosis altas'],
  cost: { monthly: '$10–25', value: 'excelente' },
  notes: 'Buscar forma triglicérido re-esterificado (rTG) > etil-éster para absorción. IFOS/friend-of-the-sea certificado por metales pesados.',
  scientificSources: ['EFSA 2012','Smith et al. 2015 Clin Sci','Mocking 2016 meta-analysis']
},
{
  id: 'omega3_ala',
  name: 'Omega-3 ALA (lino, chía)',
  category: 'fatty_acid',
  evidenceTier: 'C (conversión baja)',
  notes: 'Conversión ALA→EPA ~5%, ALA→DHA <1%. Insuficiente como única fuente.',
  dose: { daily: '2–4 g ALA (1 cucharada lino molido)' }
},
{
  id: 'krill_oil',
  name: 'Aceite de Krill',
  category: 'fatty_acid',
  evidenceTier: 'B',
  notes: 'Forma fosfolípida. Absorción superior por mg pero dosis de EPA/DHA menor — costo/beneficio pobre vs aceite de pescado estándar.',
  cost: { monthly: '$30–60', value: 'medio' },
  contraindications: ['Alergia al marisco']
},
{
  id: 'mct_oil',
  name: 'Aceite MCT',
  category: 'fatty_acid',
  evidenceTier: 'C',
  benefits: ['Cetogénesis rápida en dietas keto','energía rápida'],
  dose: { daily: '1–3 cucharadas (15–45 ml)' },
  sideEffects: ['Diarrea en >30 ml de golpe (empezar <10 ml)'],
  notFor: ['fatLoss_general'],
  notes: 'No "quema grasa" extra. Caloricamente denso (9 kcal/g).'
},
{
  id: 'cla',
  name: 'CLA (Ácido Linoleico Conjugado)',
  category: 'fatty_acid',
  evidenceTier: 'D',
  mainBenefit: 'Poco o nulo en humanos',
  dose: { daily: '3–6 g' },
  sideEffects: ['Resistencia a insulina','esteatosis hepática en isómero t10,c12'],
  notes: 'Meta-análisis humanos muestran ~0.1–0.2 kg grasa/mes de diferencia — clínicamente irrelevante. Evitar.',
  cost: { monthly: '$20–40', value: 'pobre — scam' },
  scientificSources: ['Onakpoya 2012 Public Health Nutr meta-analysis']
}
```

### D. Pre-Workouts

```js
{
  id: 'caffeine',
  name: 'Cafeína',
  category: 'stimulant',
  evidenceTier: 'A',
  mainBenefit: 'Ergogénico multi-modal',
  benefits: [
    '+2–7% endurance',
    '+1–3% fuerza y potencia',
    'Mejora enfoque y reduce RPE',
    'Reduce fatiga mental'
  ],
  bestFor: ['endurance','strength','hiit','teamSports','cognitive'],
  dose: {
    standard: '3–6 mg/kg peso corporal, 30–60 min pre-entreno',
    example_70kg: '210–420 mg',
    low_responder: 'empezar 2 mg/kg'
  },
  timing: { preWorkout: '30–60 min antes', avoid: '≥6 h antes de dormir' },
  cycling: 'Opcional; tolerancia se desarrolla pero efecto ergogénico persiste (Gonçalves 2017)',
  safeUpperLimit: '400 mg/día (EFSA salud general); 200 mg por dosis',
  toxicityThreshold: '>1000 mg agudo riesgo arritmia; >5 g LD50 estimado',
  sideEffects: ['Insomnio','ansiedad','taquicardia','reflujo','diuresis leve'],
  contraindications: [
    'Hipertensión no controlada',
    'Arritmia',
    'Embarazo (<200 mg/día)',
    'Ansiedad severa',
    'Metabolizadores lentos CYP1A2'
  ],
  interactions: [
    'Sinefrina: taquicardia peligrosa',
    'Yohimbina: ansiedad/taquicardia severa',
    'ISRS: puede aumentar ansiedad',
    'Efedrina: ¡NUNCA! Riesgo cardíaco grave',
    'Reducir efecto hipnótico de ansiolíticos/hipnóticos'
  ],
  cost: { monthly: '$1–5 (tabletas), $15–40 (pre-workout)' },
  notes: 'Incluir café y té en conteo total. Genotipo CYP1A2 afecta respuesta (fast/slow metabolizers).',
  scientificSources: ['Guest et al. ISSN Position Stand Caffeine 2021','Grgic et al. 2018 BJSM meta-analysis']
},
{
  id: 'nitrate_beetroot',
  name: 'Nitrato Dietético (remolacha)',
  category: 'nitric_oxide_precursor',
  evidenceTier: 'A',
  mainBenefit: 'Mejora endurance y economía metabólica',
  benefits: ['+1–3% endurance','Reduce costo O2','Reduce presión arterial'],
  bestFor: ['endurance','cycling','running_5k_10k'],
  notFor: ['pureStrength'],
  dose: {
    acute: '300–600 mg nitrato (400–800 ml jugo de remolacha) 2–3 h antes',
    chronic: 'Misma dosis diaria 3–15 días'
  },
  safeUpperLimit: '~12 mg/kg (bajo estudio)',
  sideEffects: ['Orina/heces rojas (inocuo)','beeturia'],
  interactions: [
    'Evitar enjuague bucal antibacteriano (destruye bacterias orales que reducen nitrato)',
    'Viagra/sildenafil: hipotensión'
  ],
  cost: { monthly: '$15–30' },
  scientificSources: ['Jones 2014 Sports Med','Domínguez et al. 2017 meta-analysis']
},
{
  id: 'tyrosine',
  name: 'L-Tirosina',
  category: 'amino_acid',
  evidenceTier: 'B (stress cognitivo)',
  benefits: ['Mantiene rendimiento cognitivo bajo stress/fatiga/frío','Poco efecto en estado normal'],
  dose: { preWorkout: '500–2000 mg' },
  safeUpperLimit: '12 g/día',
  contraindications: ['Hipertiroidismo','feocromocitoma','IMAOs'],
  scientificSources: ['Jongkees 2015 J Psychiatr Res']
},
{
  id: 'l_theanine',
  name: 'L-Teanina',
  category: 'amino_acid',
  evidenceTier: 'B',
  benefits: ['Sinergia con cafeína: mejora enfoque, reduce jitters','ansiolítico suave'],
  dose: { perServing: '100–200 mg (ratio 1:1 o 2:1 con cafeína)' },
  safeUpperLimit: '1200 mg/día',
  sideEffects: ['Muy raros'],
  cost: { monthly: '$10–20' },
  scientificSources: ['Owen 2008 Nutr Neurosci']
},
{
  id: 'alpha_gpc',
  name: 'Alpha-GPC',
  category: 'nootropic',
  evidenceTier: 'B-',
  benefits: ['Precursor de acetilcolina','Posible +power output'],
  dose: { preWorkout: '300–600 mg' },
  safeUpperLimit: '1200 mg/día',
  sideEffects: ['Cefalea','posible aumento de TMAO cardiovascular (Tang 2014) — controversial'],
  cost: { monthly: '$25–40', value: 'medio' },
  scientificSources: ['Bellar 2015 JISSN']
}
```

### E. Fat Burners

```js
{
  id: 'green_tea_egcg',
  name: 'Extracto de Té Verde (EGCG)',
  category: 'fat_burner',
  evidenceTier: 'B',
  benefits: ['Oxidación de grasa +3–4%','Efecto modesto (~1 kg/12 sem vs placebo)','Antioxidante'],
  dose: { daily: '400–500 mg EGCG' },
  safeUpperLimit: '800 mg EGCG/día (EFSA 2018); >800 mg hepatotoxicidad reportada',
  sideEffects: ['Hepatotoxicidad en ayunas a dosis altas'],
  contraindications: ['Hepatopatía'],
  interactions: ['Reduce absorción de hierro — separar 2 h'],
  cost: { monthly: '$10–20' },
  scientificSources: ['EFSA 2018 opinion on green tea catechins']
},
{
  id: 'yohimbine',
  name: 'Yohimbina',
  category: 'fat_burner_stimulant',
  evidenceTier: 'C',
  mainBenefit: 'Antagonista α2-adrenérgico, útil en grasa "testaruda" en ayunas',
  benefits: ['Moviliza grasa alfa-adrenérgica','En ayunas, bajo grasa corporal (<15% hombres)'],
  notFor: ['beginners','anxious','hypertensive'],
  dose: { preWorkout: '0.1–0.2 mg/kg en ayunas' },
  safeUpperLimit: '30 mg/día',
  toxicityThreshold: '>200 mg crisis hipertensiva',
  sideEffects: ['Ansiedad severa','taquicardia','hipertensión','pánico'],
  contraindications: [
    'Hipertensión',
    'Ansiedad/trastornos de pánico',
    'Enfermedad cardiovascular',
    'Embarazo',
    'ISRS/IMAO',
    'Enfermedad hepática/renal'
  ],
  interactions: [
    'Cafeína: potencia ansiedad y taquicardia',
    'Sinefrina: riesgo cardíaco alto',
    'ISRS: crisis hipertensiva',
    'Estimulantes: sumación peligrosa'
  ],
  cost: { monthly: '$15–30' },
  notes: 'Uso riesgoso. Prohibido como medicamento en varios países UE. Usar solo en cardio en ayunas, NO con otro estimulante.',
  scientificSources: ['Ostojic 2006 Res Sports Med']
},
{
  id: 'l_carnitine',
  name: 'L-Carnitina',
  category: 'fatty_acid_transport',
  evidenceTier: 'C',
  benefits: ['Posible en vegetarianos (dieta baja)','Con carbs crónico 6 mo puede aumentar carnitina muscular'],
  notFor: ['shortTermFatLoss'],
  dose: { daily: '1–3 g (L-carnitina tartrato o acetil-L-carnitina)' },
  safeUpperLimit: '3 g/día',
  sideEffects: ['"Olor a pescado" en tritmetilaminuria','posible aumento TMAO cardiovascular'],
  cost: { monthly: '$15–30', value: 'pobre para el gran público' },
  notes: 'Sobre-vendida como quemagrasa. Efecto clínico mínimo.',
  scientificSources: ['Wall et al. 2011 J Physiol']
},
{
  id: 'synephrine',
  name: 'Sinefrina (naranja amarga)',
  category: 'fat_burner_stimulant',
  evidenceTier: 'C',
  benefits: ['Termogénico suave'],
  dose: { daily: '10–50 mg' },
  safeUpperLimit: '50 mg/día',
  sideEffects: ['Taquicardia','hipertensión'],
  contraindications: ['Hipertensión','enfermedad cardíaca','embarazo'],
  interactions: ['NUNCA con cafeína >300 mg — riesgo cardíaco','yohimbina: no'],
  notes: 'Reemplazo legal post-efedrina pero menos seguro de lo que parece en stacks.',
  scientificSources: ['Stohs 2012 Int J Med Sci']
},
{
  id: 'capsaicin',
  name: 'Capsaicina',
  category: 'fat_burner',
  evidenceTier: 'C',
  benefits: ['+50 kcal/día termogénesis','Saciedad leve'],
  dose: { daily: '2–6 mg capsaicinoides' },
  sideEffects: ['GI','reflujo'],
  cost: { monthly: '$10–20' }
},
{
  id: '7keto_dhea',
  name: '7-Keto-DHEA',
  category: 'hormonal',
  evidenceTier: 'C',
  notes: 'Evidencia débil. PROHIBIDO por WADA. No usar si compites.',
  safeUpperLimit: '200 mg/día',
  contraindications: ['Competición deportiva']
}
```

### F. Probiotics & Digestive

```js
{
  id: 'probiotic',
  name: 'Probiótico (Lactobacillus/Bifidobacterium)',
  category: 'probiotic',
  evidenceTier: 'B (cepa-específica)',
  benefits: ['Prevención diarrea antibiótico-asociada','IBS','posible inmunidad'],
  dose: { daily: '1–10 billones CFU (depende cepa)' },
  safeUpperLimit: 'Muy seguro en sanos',
  sideEffects: ['Gas/distensión inicial'],
  contraindications: ['Inmunosupresión severa','catéter central','pancreatitis aguda'],
  notes: 'Eficacia ES cepa-específica. "Probiótico genérico" ≠ evidencia específica. Buscar cepas con RCT.',
  scientificSources: ['Suez 2019 Cell']
},
{
  id: 'prebiotic_inulin',
  name: 'Prebióticos (inulina/FOS)',
  category: 'prebiotic',
  evidenceTier: 'B',
  dose: { daily: '5–15 g (empezar bajo)' },
  sideEffects: ['Gas/distensión significativos al inicio','Peor en SIBO/IBS']
},
{
  id: 'psyllium',
  name: 'Psyllium (fibra soluble)',
  category: 'fiber',
  evidenceTier: 'A',
  benefits: ['Reduce LDL ~10%','regula tránsito','saciedad','control glicémico'],
  dose: { daily: '5–15 g con abundante agua' },
  sideEffects: ['Obstrucción esofágica si se toma seco'],
  interactions: ['Reduce absorción de medicamentos — separar 2 h'],
  cost: { monthly: '$5–15', value: 'excelente' }
},
{
  id: 'glucomannan',
  name: 'Glucomanano',
  category: 'fiber',
  evidenceTier: 'B (saciedad)',
  dose: { daily: '3 g (1 g × 3 antes de comidas) con agua' },
  sideEffects: ['Obstrucción esofágica — SIEMPRE con 2 vasos de agua'],
  scientificSources: ['EFSA 2010 health claim aprobado']
},
{
  id: 'digestive_enzymes',
  name: 'Enzimas digestivas',
  category: 'enzyme',
  evidenceTier: 'C (sanos), A (insuf. pancreática)',
  notes: 'Sin evidencia en población general. Útiles solo con diagnóstico (insuf. pancreática, fibrosis quística).'
}
```

### G. Sleep & Recovery

```js
{
  id: 'melatonin',
  name: 'Melatonina',
  category: 'sleep',
  evidenceTier: 'B',
  mainBenefit: 'Regula fase de sueño, jet lag',
  benefits: ['Reduce latencia de sueño ~7 min','Jet lag este→oeste'],
  dose: {
    sleep_onset: '0.3–1 mg, 30–60 min antes de dormir (dosis BAJA suele ser superior)',
    jetLag: '0.5–3 mg al acostarse destino × 3–5 noches',
    note: 'Dosis de 5–10 mg NO son superiores y pueden dar resaca'
  },
  safeUpperLimit: '10 mg/día',
  sideEffects: ['Somnolencia matinal con dosis altas','sueños vívidos','cefalea'],
  contraindications: ['Embarazo','depresión autoinmune','conducción nocturna'],
  interactions: [
    'Alcohol: depresión SNC',
    'Benzodiacepinas: sedación aditiva',
    'Warfarina: posible potencia',
    'Anticonceptivos orales: aumentan niveles de melatonina'
  ],
  cost: { monthly: '$3–10' },
  notes: 'En muchos países UE requiere receta. En Panamá/EEUU/LatAm OTC.',
  scientificSources: ['Ferracioli-Oda 2013 PLoS One meta-analysis']
},
{
  id: 'zma',
  name: 'ZMA (zinc + magnesio + B6)',
  category: 'sleep_hormonal',
  evidenceTier: 'C (para T), B (deficiencias)',
  dose: { daily: '30 mg zinc + 450 mg mag + 10.5 mg B6 pre-sueño (hombres)' },
  notes: 'El efecto sobre testosterona NO se ha replicado (Koehler 2009). Útil solo si hay deficiencia real.',
  scientificSources: ['Koehler 2009 Eur J Clin Nutr']
},
{
  id: 'glycine',
  name: 'Glicina',
  category: 'sleep',
  evidenceTier: 'B-',
  benefits: ['Mejora calidad subjetiva del sueño','Reduce somnolencia diurna'],
  dose: { preSleep: '3 g' },
  safeUpperLimit: '9 g/día',
  cost: { monthly: '$10–15' }
},
{
  id: '5_htp',
  name: '5-HTP',
  category: 'sleep_mood',
  evidenceTier: 'C',
  benefits: ['Precursor serotonina'],
  dose: { daily: '50–300 mg' },
  safeUpperLimit: '400 mg/día (precaución)',
  sideEffects: ['Náusea','GI'],
  contraindications: ['ISRS/IMAO/IRSN: SÍNDROME SEROTONINÉRGICO MORTAL','Embarazo','Parkinson con carbidopa'],
  interactions: [
    '*** PELIGRO MORTAL con antidepresivos serotoninérgicos ***',
    'Triptanos (migraña)',
    'Tramadol'
  ],
  notes: 'Alertar fuertemente si usuario declara antidepresivos.',
  scientificSources: ['Turner 2006 Pharmacol Ther']
},
{
  id: 'valerian',
  name: 'Valeriana',
  category: 'sleep',
  evidenceTier: 'C',
  dose: { preSleep: '300–600 mg extracto' },
  sideEffects: ['Somnolencia residual','hepatotoxicidad rara'],
  contraindications: ['Hepatopatía','embarazo']
}
```

### H. Hormonal / Natural Testosterone

```js
{
  id: 'ashwagandha_ksm66',
  name: 'Ashwagandha (KSM-66 o Sensoril)',
  category: 'adaptogen',
  evidenceTier: 'B',
  benefits: [
    'Reduce cortisol y estrés percibido',
    '+14–22% testosterona en hombres subfértiles/estresados (modesto)',
    'Mejora fuerza 1RM (~2–3 kg vs placebo)',
    'Mejora VO2max leve'
  ],
  dose: { daily: '300–600 mg extracto estandarizado (KSM-66 o Sensoril)' },
  safeUpperLimit: '1250 mg/día',
  sideEffects: ['GI leve','somnolencia'],
  contraindications: [
    'Embarazo (abortivo)',
    'Hipertiroidismo',
    'Enfermedad autoinmune (Lupus, AR)',
    'Hepatopatía (casos de hepatotoxicidad reportados 2019–2023)',
    'Inmunosupresores'
  ],
  interactions: ['Sedantes','hormonas tiroideas'],
  cost: { monthly: '$15–25' },
  scientificSources: ['Wankhede 2015 JISSN','Lopresti 2019 Medicine']
},
{
  id: 'fenugreek',
  name: 'Fenogreco',
  category: 'hormonal',
  evidenceTier: 'C',
  dose: { daily: '500–600 mg extracto' },
  benefits: ['Efecto modesto en T y libido','control glicémico'],
  sideEffects: ['Sudor con olor a jarabe de arce','hipoglucemia'],
  contraindications: ['Embarazo','anticoagulantes']
},
{
  id: 'tongkat_ali',
  name: 'Tongkat Ali',
  category: 'hormonal',
  evidenceTier: 'C',
  dose: { daily: '200–400 mg extracto' },
  benefits: ['Posible aumento de T libre en hombres con bajos niveles'],
  scientificSources: ['Talbott 2013 JISSN']
},
{
  id: 'tribulus',
  name: 'Tribulus Terrestris',
  category: 'hormonal',
  evidenceTier: 'D',
  notes: 'Múltiples meta-análisis: NO aumenta testosterona ni rendimiento en hombres eugonadales. Clásico scam.',
  cost: { monthly: '$10–25', value: 'muy pobre' },
  scientificSources: ['Pokrywka 2014','Ma 2017 meta-analysis']
},
{
  id: 'daa',
  name: 'Ácido D-Aspártico (DAA)',
  category: 'hormonal',
  evidenceTier: 'D',
  notes: 'Estudios iniciales no replicados. Melville 2015: NO aumenta T en entrenados; dosis altas REDUCEN T.',
  scientificSources: ['Melville 2015 JISSN']
}
```

### I. Adaptogens & Cognitive

```js
{
  id: 'rhodiola',
  name: 'Rhodiola Rosea',
  category: 'adaptogen',
  evidenceTier: 'B-',
  benefits: ['Reduce fatiga mental','Posible mejora en esfuerzos agotadores'],
  dose: { daily: '200–600 mg (3% rosavina / 1% salidrosida)' },
  sideEffects: ['Insomnio si se toma tarde'],
  contraindications: ['Trastorno bipolar'],
  scientificSources: ['Ishaque 2012 BMC Complement Altern Med']
},
{
  id: 'panax_ginseng',
  name: 'Ginseng (Panax)',
  category: 'adaptogen',
  evidenceTier: 'C',
  dose: { daily: '200–400 mg extracto' },
  contraindications: ['Anticoagulantes','hipertensión']
},
{
  id: 'cordyceps',
  name: 'Cordyceps',
  category: 'adaptogen',
  evidenceTier: 'C',
  dose: { daily: '1–3 g CS-4' },
  benefits: ['Posible mejora leve VO2max (evidencia débil)']
},
{
  id: 'bacopa',
  name: 'Bacopa Monnieri',
  category: 'nootropic',
  evidenceTier: 'B',
  benefits: ['Memoria a largo plazo tras 8–12 sem'],
  dose: { daily: '300 mg (50% bacósidos)' },
  sideEffects: ['GI'],
  scientificSources: ['Pase 2012 J Altern Complement Med']
},
{
  id: 'lions_mane',
  name: 'Lion\'s Mane (Hericium erinaceus)',
  category: 'nootropic',
  evidenceTier: 'C',
  dose: { daily: '500–3000 mg extracto' },
  notes: 'Evidencia preliminar en cognición de mayores; datos en sanos escasos.'
}
```

### J. Hydration & Electrolytes

```js
{
  id: 'electrolytes',
  name: 'Electrolitos (Na/K/Mg/Ca)',
  category: 'electrolyte',
  evidenceTier: 'A',
  mainBenefit: 'Previene hiponatremia y calambres en ejercicio prolongado',
  benefits: ['Crítico >60 min de ejercicio, especialmente en calor','Previene cramps','Restaura pérdida por sudor'],
  bestFor: ['endurance','longSessions','hotClimate','heavySweaters'],
  dose: {
    sweat_loss: '300–700 mg sodio/hora en ejercicio prolongado/caloroso',
    daily_general: 'dieta cubre mayoría'
  },
  sideEffects: ['Hipertensión con exceso de sodio en sedentarios'],
  cost: { monthly: '$5–15' },
  notes: 'Panamá: clima caluroso y húmedo aumenta pérdidas. Crítico en corredores/ciclistas.',
  scientificSources: ['ACSM Position Stand 2007','Hew-Butler 2015 Consensus Hyponatremia']
},
{
  id: 'sports_drink',
  name: 'Bebida deportiva (carbs + electrolitos)',
  category: 'performance',
  evidenceTier: 'A',
  dose: { during: '30–60 g CHO/hora en >60 min, hasta 90 g/h en >2.5 h (mezcla glucosa+fructosa)' },
  notFor: ['sessions < 60 min', 'fatLoss_shortWorkouts']
},
{
  id: 'maltodextrin',
  name: 'Maltodextrina',
  category: 'carbohydrate',
  evidenceTier: 'A',
  dose: { during: '30–60 g/h en endurance', postWorkout: '0.8–1.2 g/kg' },
  cost: { monthly: '$10–20' }
}
```

### K. Other Popular

```js
{
  id: 'collagen_hydrolyzed',
  name: 'Colágeno Hidrolizado',
  category: 'structural',
  evidenceTier: 'B (tendones/piel), C (músculo)',
  benefits: [
    '15 g + vitamina C 30–60 min pre-entreno mejora síntesis colágeno tendinoso (Shaw 2017)',
    'Reduce dolor articular en osteoartritis leve',
    'Piel: mejora hidratación/elasticidad modesta'
  ],
  notFor: ['muscleGain_asProteinSubstitute'],
  dose: {
    tendon_health: '15 g + 50 mg vit C, 30–60 min pre-entreno',
    skin_joints: '10 g/día'
  },
  safeUpperLimit: '20 g/día',
  sideEffects: ['Raros'],
  cost: { monthly: '$20–40' },
  notes: 'Perfil AA incompleto (sin triptófano) — NO substituto de whey para hipertrofia.',
  scientificSources: ['Shaw 2017 Am J Clin Nutr','Zdzieblik 2015 Br J Nutr']
},
{
  id: 'glucosamine_chondroitin',
  name: 'Glucosamina + Condroitina',
  category: 'joint',
  evidenceTier: 'C',
  benefits: ['Posible alivio leve en OA de rodilla','Efecto heterogéneo'],
  dose: { daily: '1500 mg glucosamina sulfato + 1200 mg condroitina' },
  sideEffects: ['GI','posible aumento de glucosa en diabetes'],
  contraindications: ['Alergia al marisco (glucosamina)','warfarina'],
  scientificSources: ['GAIT trial 2006 NEJM']
},
{
  id: 'msm',
  name: 'MSM (metilsulfonilmetano)',
  category: 'joint',
  evidenceTier: 'C',
  dose: { daily: '1.5–6 g' },
  benefits: ['Alivio leve DOMS y OA']
},
{
  id: 'turmeric_curcumin',
  name: 'Cúrcuma (curcumina)',
  category: 'antiinflammatory',
  evidenceTier: 'B',
  benefits: ['Anti-inflamatorio','reduce DOMS modesto','OA alivio similar a NSAIDs a dosis altas'],
  dose: { daily: '500–2000 mg curcumina con piperina o fórmula biodisponible (Meriva/BCM-95/Theracurmin)' },
  sideEffects: ['GI','hepatotoxicidad rara con formulaciones potenciadas'],
  contraindications: ['Anticoagulantes','cálculos biliares','embarazo','pre-cirugía'],
  scientificSources: ['Hewlings 2017 Foods review']
},
{
  id: 'quercetin',
  name: 'Quercetina',
  category: 'flavonoid',
  evidenceTier: 'C',
  dose: { daily: '500–1000 mg' },
  notes: 'Efecto ergogénico trivial (+~3% VO2max en algunos estudios). No recomendado de rutina.'
},
{
  id: 'resveratrol',
  name: 'Resveratrol',
  category: 'polyphenol',
  evidenceTier: 'C',
  notes: 'Hype no respaldado. Posible BLOQUEO de adaptaciones al entrenamiento (Gliemann 2013) — EVITAR pre/post entreno.',
  scientificSources: ['Gliemann 2013 J Physiol']
},
{
  id: 'greens_powder',
  name: 'Greens Powder',
  category: 'multi_nutrient',
  evidenceTier: 'C',
  notes: 'No reemplaza vegetales reales. Costo alto para beneficio marginal.',
  cost: { monthly: '$60–100', value: 'pobre' }
},
{
  id: 'acai_goji',
  name: 'Açaí / Goji',
  category: 'superfood',
  evidenceTier: 'D',
  notes: 'Marketing. Sin efectos ergogénicos comprobados.'
},
{
  id: 'spirulina',
  name: 'Espirulina',
  category: 'algae',
  evidenceTier: 'C',
  benefits: ['Proteína completa','efecto antioxidante leve'],
  dose: { daily: '3–5 g' },
  notes: 'Riesgo de contaminación con microcistinas — elegir marca certificada.'
},
{
  id: 'omega7',
  name: 'Omega-7 (ácido palmitoleico)',
  category: 'fatty_acid',
  evidenceTier: 'D',
  notes: 'Evidencia débil. No recomendado.'
}
```

---

## 3. Goal-Based Stacks

### Fat Loss (evidence-based, minimum)
| Supplement | Dose | Why |
|-----------|------|-----|
| Caffeine | 3–6 mg/kg pre-workout or pre-fasted cardio | Performance + modest thermogenesis + appetite |
| Whey protein | 25–50 g × 1–2/día | Hit 2.0–2.4 g/kg in deficit |
| Creatine | 5 g/día | Preserves LBM and performance in deficit |
| Vitamin D3 | 1000–2000 IU | Deficiency common |
| Omega-3 | 1–2 g EPA+DHA | Anti-inflammatory, satiety |
| Multivitamin (low-dose) | 1/día | Insurance in low-cal diet |
| **Optional** | | |
| Green tea extract | 400 mg EGCG | Mild synergy with caffeine |
| Psyllium | 5–10 g | Satiety + LDL |
| **NOT needed** | Exotic fat burners, CLA, raspberry ketones, L-carnitine, "detox" teas |

### Muscle Gain
| Supplement | Dose | Why |
|-----------|------|-----|
| Creatine | 5 g/día | Must-have, +1–2 kg LBM in 4–8 wk |
| Whey protein | 25–40 g × 1–3/día | Hit 1.6–2.2 g/kg |
| Casein | 30–40 g pre-sueño | Optional — MPS overnight |
| Caffeine | 3–6 mg/kg pre-workout | Training quality |
| Vitamin D3 | 1000–2000 IU | Hormonal support |
| Omega-3 | 1–2 g EPA+DHA | Anti-inflammation + MPS |
| **Optional** | | |
| Citrulline malate | 6–8 g pre | Modest rep-out benefit |
| Beta-alanine | 3.2 g/día | If training 8–15 rep hypertrophy |

### Strength / Powerlifting
| Supplement | Dose |
|-----------|------|
| Creatine | 5 g/día |
| Whey | target dependent |
| Caffeine | 3–6 mg/kg pre-workout |
| Beta-alanine | 3.2 g (if AMRAP / accessory high rep work) |
| Vitamin D3 | 1000–2000 IU |

### Endurance (running/cycling/triathlon)
| Supplement | Dose |
|-----------|------|
| Caffeine | 3–6 mg/kg pre-race (or lower with habitual use) |
| Sodium/electrolytes | 300–700 mg Na/hour during |
| Carbs during | 30–90 g/h (glucose+fructose in >2.5 h) |
| Dietary nitrate | 400–800 mg NO3, 2–3 h pre |
| Omega-3 | 1–2 g EPA+DHA |
| Vitamin D3 + Iron (women) | maintenance / after testing ferritin |
| Beta-alanine | 3.2 g if HIIT/sprints in training |
| **Creatine** | Optional — no longer believed to impair endurance |

### General Health (non-athletic)
| Supplement | Dose |
|-----------|------|
| Vitamin D3 | 1000–2000 IU |
| Omega-3 | 1–2 g EPA+DHA |
| Magnesium | 200–400 mg (if dietary gap) |
| B12 | 250 μg (if vegan/elderly) |
| Creatine | 3–5 g (cognitive + sarcopenia prevention) |
| Psyllium | 5–10 g (CV + gut) |

### Vegan/Vegetarian Additions
Prioritize: **B12, D3, Omega-3 (algae-based), Iron (women), Zinc, Iodine, Creatine, Carnosine/Beta-alanine, Taurine.**

---

## 4. Contraindications Matrix

### Supplement × Supplement

| Supplement A | Supplement B | Severity | Issue |
|--------------|--------------|----------|-------|
| 5-HTP | SSRI/SNRI/MAOI | **CRITICAL** | Serotonin syndrome (fatal) |
| Tryptophan | SSRI/SNRI/MAOI | **CRITICAL** | Serotonin syndrome |
| St John's Wort | SSRI/anticonceptivos/warfarina | **CRITICAL** | Interacción CYP3A4 múltiple |
| Yohimbine | Caffeine >200 mg | HIGH | Tachycardia, anxiety, HTN crisis |
| Yohimbine | SSRI | **CRITICAL** | Hypertensive crisis |
| Yohimbine | Synephrine | **CRITICAL** | Cardiovascular danger |
| Synephrine | Caffeine >300 mg | HIGH | Tachycardia, BP spike |
| Synephrine | Yohimbine | **CRITICAL** | Cardiac risk |
| Ephedrine (any source) | Caffeine/synephrine | **CRITICAL/BANNED** | Cardiac events |
| Melatonin | Alcohol | MEDIUM | CNS depression |
| Melatonin | Benzodiazepines | MEDIUM | Additive sedation |
| Iron | Calcium | LOW | Reduced Fe absorption — separate 2 h |
| Iron | Coffee/tea (tannins) | LOW | Reduced Fe absorption 40–60% |
| Iron | Zinc | LOW | Compete — separate |
| Iron | PPI/antacids | MEDIUM | Reduced absorption |
| Zinc | Copper (long-term high zinc) | MEDIUM | Cu deficiency if Zn >50 mg chronic |
| Calcium | Iron/Zinc | LOW | Compete — separate 2 h |
| Calcium | Thyroid hormone | MEDIUM | Reduced levothyroxine absorption |
| Vitamin E high dose | Vitamin K / warfarin | HIGH | Bleeding risk |
| Omega-3 high dose | Warfarin/aspirin | MEDIUM | Bleeding risk >3 g/día |
| Ashwagandha | Thyroid hormone | MEDIUM | May raise T4 — hyperthyroid risk |
| Ashwagandha | Immunosuppressants | HIGH | Immunostimulant |
| Ashwagandha | Sedatives/alcohol | MEDIUM | Additive |
| Green tea extract | Iron | LOW | Reduced Fe absorption |
| Green tea high dose | Hepatotoxic drugs | MEDIUM | Liver injury |
| Caffeine | Alcohol | MEDIUM | Masks impairment |
| Caffeine | Stimulant medications | HIGH | Additive |
| Nitrate (beetroot) | Sildenafil/nitrates Rx | HIGH | Hypotension |
| Fish oil | Anticoagulants | MEDIUM | Bleeding (>3 g/día) |
| Turmeric high dose | Anticoagulants | MEDIUM | Bleeding |
| Creatine | Nephrotoxic drugs | MEDIUM | Monitor renal |
| BCAA | (none serious) | - | Just redundancy with protein |
| Creatine monohydrate | Creatine HCL | Redundancy | Pick one |
| Whey + BCAA | - | Redundancy | BCAA unnecessary |

### Supplement × Condition

| Condition | Avoid / Caution |
|-----------|-----------------|
| **Pregnancy** | Ashwagandha, fenogreco, tribulus, yohimbine, high caffeine (>200 mg), high vit A retinol (>3000 IU), melatonin, 5-HTP, most herbs, high iron (without test), high fish oil, valerian, St John's Wort |
| **Hypertension** | Yohimbine, synephrine, ephedra, high caffeine, licorice, ginseng (cautious), high sodium |
| **Chronic kidney disease (CKD 3–5)** | Creatine (supervised), high protein (supervised), magnesium, potassium, high vit D, NSAID-like (curcumin high dose) |
| **Hepatopathy** | Green tea extract high dose, kava, high curcumin formulations, anabolic "supplements", high niacin, ashwagandha (recent case reports) |
| **Diabetes** | Fenogreco + hypoglycemics (hypoglycemia risk), high chromium, berberine (with metformin → hypo), cinnamon high dose |
| **Hyperthyroidism** | Ashwagandha, iodine high dose, tyrosine, kelp |
| **Hypothyroidism on levothyroxine** | Separate calcium, iron, soy by 4 h |
| **Bipolar / psychiatric** | Rhodiola, St John's Wort, ashwagandha, 5-HTP, any stimulant, SAM-e |
| **Autoimmune (MS, RA, Lupus)** | Ashwagandha, echinacea, spirulina (immunostimulants) |
| **Hemochromatosis** | Iron, vitamin C high dose with iron-containing foods |
| **Warfarin / anticoagulants** | Vit E, vit K, high omega-3, garlic, ginkgo, ginseng, turmeric, fish oil >3 g |
| **Cardiac arrhythmia** | Caffeine high, yohimbine, synephrine, ephedra, bitter orange |
| **Peptic ulcer / GERD** | High caffeine, capsaicin, high iron, NSAIDs, curcumin on empty stomach |
| **Epilepsy** | Ginkgo, evening primrose, high caffeine, some nootropics |
| **Surgery (within 2 wks)** | Stop fish oil, garlic, ginkgo, vit E, ginseng, turmeric, ashwagandha |

---

## 5. Detection & Alert Algorithm (Pseudocode)

```js
// === 1. OVERDOSE / UPPER LIMITS ===
const HARD_LIMITS = {
  caffeine_total_mg_day: 400,       // from all sources
  caffeine_per_dose_mg: 200,
  creatine_g_day: 10,
  vitamin_d_iu_day_chronic: 4000,   // without medical supervision
  vitamin_d_iu_day_absolute: 10000,
  vitamin_c_mg_day: 2000,
  vitamin_b6_mg_day: 100,
  vitamin_e_iu_day: 1000,
  vitamin_a_retinol_iu_day: 10000,  // 3000 if pregnant
  iron_mg_day: 45,                  // without deficiency dx
  zinc_mg_day: 40,
  calcium_mg_day_supp: 1500,
  magnesium_mg_supplement_day: 350, // from supplements only (food unlimited)
  selenium_mcg_day: 400,
  niacin_mg_day: 35,                // as nicotinic acid (flush limit)
  beta_alanine_g_day: 6.4,
  citrulline_g_day: 10,
  taurine_g_day: 6,
  bcaa_g_day: 20,
  glutamine_g_day: 30,
  omega3_epa_dha_g_day: 5,
  melatonin_mg_day: 10,
  ashwagandha_mg_day: 1250,
  green_tea_egcg_mg_day: 800,
  yohimbine_mg_day: 30,
  synephrine_mg_day: 50,
  hmb_g_day: 6,
};

function checkOverdose(intakeLog) {
  const todayTotals = sumToday(intakeLog);
  for (const [key, limit] of Object.entries(HARD_LIMITS)) {
    if (todayTotals[key] > limit) {
      alert({
        severity: 'high',
        message: `Has superado la dosis segura diaria de ${prettyName(key)}: ${todayTotals[key]} > ${limit}`,
        action: 'Reduce la dosis hoy y revisa tu plan'
      });
    }
  }
}

// Caffeine is tricky — sum from multiple sources
function sumCaffeine(user, date) {
  return (user.logs[date].supplements
    .filter(s => ['caffeine','pre_workout','green_tea_egcg','yerba_mate'].includes(s.id))
    .reduce((a,s) => a + (s.caffeineMg || 0), 0))
    + (user.logs[date].coffeeCups || 0) * 95
    + (user.logs[date].teaCups || 0) * 40
    + (user.logs[date].energyDrinks_ml || 0) * 0.32;
}

// === 2. DANGEROUS COMBINATIONS ===
const COMBO_BLOCKS = [
  { a:'5_htp', b:['ssri','snri','maoi','tramadol','triptan'], sev:'critical',
    msg:'RIESGO MORTAL: síndrome serotoninérgico. NO combinar.' },
  { a:'yohimbine', b:['caffeine_high','ssri','snri','maoi','synephrine'], sev:'high',
    msg:'Combinación cardiovascularmente peligrosa.' },
  { a:'synephrine', b:['caffeine_high','yohimbine','ephedra'], sev:'high',
    msg:'Riesgo de taquicardia e hipertensión.' },
  { a:'melatonin', b:['alcohol','benzodiazepine'], sev:'medium',
    msg:'Sedación aditiva; cuidado al conducir.' },
  { a:'fish_oil_high', b:['warfarin','apixaban','rivaroxaban','aspirin_high'], sev:'medium',
    msg:'Mayor riesgo de hemorragia con dosis >3 g omega-3.' },
  { a:'iron', b:['calcium','coffee','tea','zinc','ppi'], sev:'low',
    msg:'Reduce absorción de hierro. Separa por 2 horas.' },
  { a:'ashwagandha', b:['levothyroxine','immunosuppressant'], sev:'medium',
    msg:'Puede interferir con tu medicación. Consulta médico.' },
  { a:'green_tea_extract', b:['iron_supplement','liver_med'], sev:'medium',
    msg:'Riesgo hepático a dosis altas; separa del hierro.' },
  { a:'creatine_monohydrate', b:['creatine_hcl','creatine_buffered'], sev:'low',
    msg:'Estás tomando múltiples formas de creatina. Solo necesitas una.' },
  { a:'bcaa', b:['whey_concentrate','whey_isolate','casein','eaa'], sev:'info',
    msg:'Si ya alcanzas tu meta de proteína, los BCAAs son redundantes.' },
];

function checkCombos(activeSupps, conditions) {
  for (const rule of COMBO_BLOCKS) {
    if (hasSupp(rule.a, activeSupps) && rule.b.some(x => hasSuppOrCondition(x, activeSupps, conditions))) {
      alert({ severity: rule.sev, message: rule.msg });
    }
  }
}

// === 3. CONDITION-BASED ===
const CONDITION_BLOCKS = {
  pregnancy: ['ashwagandha','fenugreek','tribulus','yohimbine','5_htp','melatonin_chronic','high_vit_a_retinol','caffeine_high','valerian','st_johns_wort'],
  hypertension: ['yohimbine','synephrine','caffeine_high','ephedra','licorice'],
  ckd_3_5: ['creatine_no_supervision','high_protein','high_magnesium','high_potassium','high_vit_d'],
  liver_disease: ['green_tea_extract_high','high_curcumin','niacin_high','ashwagandha_caution'],
  hyperthyroidism: ['ashwagandha','iodine_high','tyrosine','kelp'],
  autoimmune: ['ashwagandha','echinacea','spirulina'],
  hemochromatosis: ['iron','vit_c_with_iron'],
  anticoagulants: ['vit_e_high','fish_oil_high','garlic','ginkgo','ginseng','turmeric_high'],
  ssri_snri: ['5_htp','tryptophan','st_johns_wort','yohimbine','sam_e'],
  diabetes_hypoglycemic_meds: ['fenugreek','berberine','cinnamon_high','bitter_melon'],
  arrhythmia: ['caffeine_high','yohimbine','synephrine','ephedra'],
};

function checkConditions(user) {
  for (const cond of user.healthConditions) {
    const blocklist = CONDITION_BLOCKS[cond] || [];
    for (const s of user.activeSupplements) {
      if (blocklist.includes(s.id)) {
        alert({
          severity: 'high',
          message: `Dada tu condición (${cond}), ${s.name} está contraindicado o requiere supervisión médica.`,
          action: 'Consulta con tu médico antes de continuar.'
        });
      }
    }
  }
}

// === 4. REDUNDANCY / WASTE ===
const REDUNDANT_GROUPS = [
  ['creatine_monohydrate','creatine_hcl','creatine_buffered','creatine_ethyl_ester'],
  ['whey_concentrate','whey_isolate','whey_hydrolyzed'],  // warning if all three
  ['bcaa','eaa'],  // use only one
  ['multivitamin_A','multivitamin_B'],
  ['magnesium_glycinate','magnesium_citrate','magnesium_oxide'],  // pick one
];

function checkRedundancy(active) {
  for (const group of REDUNDANT_GROUPS) {
    const overlapping = group.filter(id => hasSupp(id, active));
    if (overlapping.length > 1) {
      alert({
        severity: 'info',
        message: `Estás tomando múltiples productos con función similar: ${overlapping.join(', ')}. Uno es suficiente.`
      });
    }
  }
  // BCAA + adequate protein
  if (hasSupp('bcaa', active) && user.proteinDailyG >= user.weightKg * 1.6) {
    alert({ severity: 'info', message: 'Alcanzas >1.6 g/kg de proteína. Los BCAAs son redundantes.' });
  }
}

// === 5. INEFFECTIVE / LOW-EVIDENCE ===
const SCAM_LIST = {
  tribulus: 'La evidencia muestra que NO aumenta testosterona en hombres sanos.',
  daa: 'Estudios recientes muestran efecto nulo o negativo sobre la testosterona.',
  glutamine_for_muscle: 'Sin efecto ergogénico comprobado en atletas sanos.',
  cla: 'Efecto clínicamente irrelevante (~0.1–0.2 kg/mes).',
  raspberry_ketones: 'Ningún estudio humano de calidad.',
  garcinia_cambogia: 'Meta-análisis: efecto placebo.',
  hmb_in_trained: 'Pobre evidencia en atletas entrenados.',
  detox_tea: 'No existe "detox". Laxantes disfrazados.',
  hgh_boosters: 'No elevan HGH de forma significativa.',
  deer_antler: 'Scam. IGF-1 oral no absorbido.',
  resveratrol_pre_workout: 'Puede BLOQUEAR adaptaciones al entrenamiento.',
};

function checkScams(active) {
  for (const s of active) {
    if (SCAM_LIST[s.id]) {
      alert({
        severity: 'info',
        message: `${s.name}: ${SCAM_LIST[s.id]} Considera dejarlo para ahorrar dinero.`
      });
    }
  }
}

// === 6. MISSING IMPORTANT ===
function checkGaps(user) {
  const goals = user.goals;
  const active = user.activeSupplements.map(s=>s.id);

  if (goals.includes('muscleGain') && !active.includes('creatine_monohydrate')) {
    alert({ severity:'info', message:'Considera creatina monohidrato (5 g/día). Es el suplemento más efectivo para hipertrofia.' });
  }
  if (user.proteinDailyG < user.weightKg * 1.4 && !hasAnyProteinSupp(active)) {
    alert({ severity:'info', message:'No alcanzas tu meta de proteína. Considera whey u otra fuente.' });
  }
  if (user.sunExposureLow && !active.includes('vitamin_d3') && !user.labs?.vitD_adequate) {
    alert({ severity:'info', message:'Exposición solar baja. Considera medir 25(OH)D y suplementar D3.' });
  }
  if (user.isVegan && !active.includes('vitamin_b12')) {
    alert({ severity:'high', message:'Vegano sin B12: riesgo de deficiencia neurológica irreversible. Suplementa.' });
  }
  if (user.isVegan && !active.includes('omega3_algae')) {
    alert({ severity:'info', message:'Considera omega-3 de algas (EPA/DHA).' });
  }
  if (user.isMenstruating && user.endurance && !user.labs?.ferritinChecked) {
    alert({ severity:'info', message:'Atleta mujer: revisa ferritina sérica anualmente.' });
  }
}

// === 7. TIMING CHECKS ===
function checkTiming(log) {
  // Caffeine after 3 pm
  const caffeineLate = log.filter(e => e.id.includes('caffeine') && hourOf(e.time) >= 15);
  if (caffeineLate.length && user.sleepGoal) {
    alert({ severity:'info', message:'Cafeína después de las 3 pm puede afectar tu sueño.' });
  }
  // Iron with coffee within 2 h
  const ironEvents = log.filter(e => e.id === 'iron');
  const coffeeEvents = log.filter(e => e.id === 'coffee');
  for (const iron of ironEvents) {
    if (coffeeEvents.some(c => Math.abs(hourDiff(c.time, iron.time)) < 2)) {
      alert({ severity:'low', message:'Café cerca del hierro reduce absorción. Separa al menos 2 h.' });
    }
  }
  // Vit C megadose around workout
  if (hasDose('vitamin_c', log) > 1000 && within2h(log, 'workout','vitamin_c')) {
    alert({ severity:'low', message:'Megadosis de vitamina C post-entreno puede bloquear adaptaciones.' });
  }
}

// === 8. ADHERENCE ===
function checkAdherence(user) {
  for (const s of user.scheduledSupplements) {
    const last7 = daysTakenInLast(7, s.id);
    if (s.frequency === 'daily' && last7 < 5) {
      alert({ severity:'info', message:`Has olvidado ${s.name} ${7-last7} días esta semana.` });
    }
    if (s.id === 'creatine_monohydrate' && last7 < 6) {
      alert({ severity:'info', message:'La creatina requiere consistencia diaria para ser efectiva.' });
    }
  }
}
```

---

## 6. Abuse / Safety Hard Thresholds (Single-Source of Truth)

These are the numbers to encode as hard ceilings. Exceeding them triggers a **HIGH-severity** alert.

| Supplement | Daily hard limit | Acute single dose | Source |
|-----------|------------------|-------------------|--------|
| Caffeine | 400 mg | 200 mg/dose | EFSA 2015 |
| Caffeine (pregnant) | 200 mg | — | EFSA |
| Creatine | 10 g | 5 g/dose | ISSN 2017 |
| Beta-alanine | 6.4 g | 1.6 g/dose (tingling) | ISSN 2015 |
| Citrulline | 10 g | — | Tolerance |
| Taurine | 6 g | — | EFSA |
| BCAA | 20 g | — | Practical |
| Glutamine | 30 g | — | Practical |
| Whey/protein | 3.5 g/kg | — | ISSN 2017 |
| HMB | 6 g | — | ISSN 2013 |
| Vitamin A (retinol) | 10,000 IU (3,000 preg) | — | IOM |
| Vitamin D3 | 4,000 IU (chronic OTC) / 10,000 IU absolute | — | IOM / Endocrine Soc. |
| Vitamin E | 1,000 mg (1,500 IU) | — | IOM |
| Vitamin C | 2,000 mg | — | IOM |
| Vitamin B6 | 100 mg | — | IOM |
| Niacin | 35 mg (nicotinic) | — | IOM |
| Folate (synthetic) | 1,000 μg | — | IOM |
| Calcium | 2,500 mg total / 1,500 mg from supplement | 500 mg/dose for absorption | IOM / Bolland |
| Magnesium | 350 mg from supplement | — | IOM |
| Zinc | 40 mg | — | IOM |
| Iron (without dx) | 45 mg | — | IOM |
| Selenium | 400 μg | — | IOM |
| Iodine | 1,100 μg | — | IOM |
| Copper | 10 mg | — | IOM |
| Omega-3 EPA+DHA | 5 g | — | EFSA |
| Green tea EGCG | 800 mg | 300 mg/dose | EFSA 2018 |
| Melatonin | 10 mg | 5 mg/dose | Consensus |
| Ashwagandha | 1,250 mg | — | Consensus |
| Yohimbine | 30 mg | 15 mg | Consensus |
| Synephrine | 50 mg | — | Consensus |
| Glucosamine | 1,500 mg | — | EMA |
| Psyllium | 30 g (with water!) | — | Practical |

---

## 7. Tracking Data Model

```js
// Master supplement catalog entry (static)
Supplement = {
  id: String,                  // snake_case unique
  nameEs: String,              // display name Spanish
  nameEn: String,
  aliases: [String],           // brand/common names for matching user input
  category: Enum,
  evidenceTier: Enum('A','B','C','D'),
  mainBenefit: String,
  defaultUnit: Enum('g','mg','mcg','IU','ml','capsule','scoop'),
  defaultDose: Number,
  defaultDoseUnit: String,
  defaultFrequency: Enum('once_daily','twice_daily','pre_workout','post_workout','with_meal','as_needed'),
  hardLimitDaily: Number,
  hardLimitUnit: String,
  contraindicatedConditions: [String],
  interactsWith: [String],     // other supp ids or drug classes
  requiresWithFood: Boolean,
  requiresEmptyStomach: Boolean,
  caffeineMg: Number | null,   // for dose calc
  costUSDMonthly: [min, max],
  sources: [String],
};

// User's active plan
UserSupplement = {
  userId: String,
  supplementId: String,
  addedAt: Timestamp,
  doseAmount: Number,
  doseUnit: String,
  frequency: Enum,
  schedule: [{ time: 'HH:mm', withMeal: String|null }],
  goalTag: String,             // 'muscleGain'|'fatLoss'|...
  brandName: String|null,
  active: Boolean,
  cyclingPlan: { onDays: N, offDays: N } | null,
  notes: String,
};

// Individual dose event (history log)
SupplementIntake = {
  id: UUID,
  userId: String,
  supplementId: String,
  timeTaken: ISO8601,
  doseAmount: Number,
  doseUnit: String,
  withMeal: Enum('desayuno','almuerzo','cena','snack','ninguna'),
  withWorkout: Enum('pre','post','intra','no'),
  source: Enum('scheduled','manual'),
  notes: String,
};

// Reminder config
Reminder = {
  userSupplementId: String,
  time: 'HH:mm',
  daysOfWeek: [0..6],
  linkedToWorkout: Boolean,   // schedule relative to workout log
  offsetMinutes: Number,       // e.g. -30 for pre-workout
};

// Health profile (drives contraindication engine)
UserHealthProfile = {
  conditions: [String],        // ['hypertension','ckd','pregnancy'...]
  medications: [String],       // ['ssri','warfarin','levothyroxine'...]
  allergies: [String],
  isPregnant: Boolean,
  isBreastfeeding: Boolean,
  isVegan: Boolean,
  ageYears: Number,
  weightKg: Number,
  sexAtBirth: Enum('male','female'),
  labs: {                      // optional user-entered
    vitD_ngmL: Number,
    ferritin_ngmL: Number,
    vitB12_pgmL: Number,
    ...
  },
  sunExposureLow: Boolean,
};
```

**Analytics views to build:**
- Weekly adherence heatmap per supplement.
- Daily caffeine total (all sources) with 400 mg reference line.
- Cost-per-month rollup.
- Evidence-tier breakdown ("% of your stack is tier A/B/C/D").
- Goal coverage ("your goal is muscleGain — you have 4/5 evidence-A recommended items").

---

## 8. Scam / Ineffective List (Don't Waste Money)

| Product | Verdict | Why |
|---------|---------|-----|
| Tribulus terrestris | Scam for T | Meta-analyses show no T effect in eugonadal men (Pokrywka 2014; Ma 2017) |
| D-Aspartic Acid (DAA) | Scam for T | Melville 2015: null or negative in trained men |
| Testosterone "boosters" (blends) | Scam | Mostly tribulus + DAA + fenugreek; marginal at best |
| HGH "releasers" | Scam | Oral amino acids don't meaningfully raise HGH |
| Deer antler velvet / IGF-1 sprays | Scam | IGF-1 not orally bioavailable |
| Raspberry ketones | Scam | Zero quality human evidence |
| Garcinia cambogia | Scam | Meta-analyses: placebo-equivalent |
| CLA | Near-scam | ~0.1–0.2 kg/mo difference; side effects |
| Waxy maize "superior carbs" | Scam | No advantage over maltodextrin/glucose |
| L-Arginine oral for pump | Weak | Citrulline is the correct choice |
| BCAA (if protein adequate) | Redundant | No muscle benefit; marketing |
| Glutamine for muscle | Ineffective | No ergogenic effect in healthy |
| Detox teas | Scam + laxative | No such thing as "detox" |
| Apple cider vinegar capsules | Hype | Minor glycemic effect; not fat loss |
| Green coffee bean extract | Scam | Flawed studies, retracted Oz endorsement |
| Hydroxycut blends | Mixed / hyped | Effect = caffeine they contain |
| Glutathione oral | Scam | Destroyed in gut |
| Colloidal silver | Scam + dangerous | Argyria; not antimicrobial in humans |
| Alkaline water "for performance" | Scam | Stomach acid eliminates effect |
| Fat-burner "thermogenic" blends | Mostly caffeine | Pay for caffeine cheaply |
| Resveratrol for athletes | Contraproductive | Blunts training adaptations |
| Vitamin megadose C/E around workout | Contraproductive | Ristow 2009 — blunts mitochondrial adaptation |
| Ketone esters for general fat loss | Hyped | Niche endurance benefit, very expensive |
| SARMs (Ostarine, LGD-4033, etc.) | **Dangerous + banned** | WADA-banned; unregulated; liver/hormonal harm |
| Prohormones / DHEA | **Dangerous + banned** | WADA-banned; hormonal disruption |

---

## 9. WADA Prohibited List (Competitive Athletes)

Supplements/substances **banned at all times** in sanctioned competition (WADA Prohibited List 2024):

### S1. Anabolic agents
- All anabolic-androgenic steroids
- **SARMs**: ostarine, andarine, LGD-4033 (ligandrol), RAD-140, YK-11
- **Prohormones**: DHEA, androstenedione, 1-AD, 4-DHEA, 7-keto-DHEA precursors
- Clenbuterol, zeranol, zilpaterol

### S2. Peptide hormones
- HGH and releasers marketed as "GH boosters" (even if ineffective, marketing can trigger tests)
- IGF-1, erythropoietin (EPO)
- hCG (males)

### S3. Beta-2 agonists
- Higenamine (in some pre-workouts, fat burners!)
- Ractopamine

### S4. Hormone and metabolic modulators
- Aromatase inhibitors (sold as "estrogen blockers"): androstatriendione, 6-oxo
- SERMs: clomiphene, tamoxifen
- Myostatin inhibitors

### S5. Diuretics & masking agents
- Furosemide, spironolactone, acetazolamide
- Any masking agent

### S6. Stimulants (**in competition only**)
- **Ephedrine >10 μg/mL urine**
- **Methylhexanamine (DMAA)** — still in some pre-workouts
- **DMHA** (1,5-dimethylhexylamine)
- **Synephrine** — currently NOT banned but monitored
- **Octopamine**, **higenamine**
- **Amphetamines**, cocaine, modafinil
- Caffeine is NOT banned but monitored

### S7. Narcotics, S8. Cannabinoids, S9. Glucocorticoids (injectable in-competition)

### Common supplement contamination
- Informed Sport, NSF Certified for Sport, Cologne List: third-party tested brands for competing athletes
- **Always verify for Panamanian athletes competing internationally (Pan-American Games, Olympics).**

Source: WADA Prohibited List 2024 (effective Jan 2024); ADAMA/ONAD updates.

---

## 10. Panama / Latin America Context

### Availability
- **Easily available (gyms, pharmacies, Farmacias Arrocha, Metro, online):**
  - Whey (ON Gold Standard, MuscleTech, Dymatize, Body Tech — local GNC/Bodytech), creatine, multivit, fish oil, vitamin D, magnesium, pre-workouts, BCAAs, glutamine.
- **Available but often overpriced (~2× US price):**
  - Premium whey isolates, Kre-Alkalyn, novel peptides.
- **Harder to find / online only (Amazon, iHerb shipped via casillero / Mailbox Etc):**
  - Specific strains of probiotic, KSM-66 ashwagandha, high-dose omega-3 with IFOS, third-party-tested (Informed Sport) products, bulk unflavored powders.
- **Prescription in Panama:**
  - Melatonin is OTC (differs from UK/EU where it's Rx).
  - Most other supplements are OTC.
- **Regulation:**
  - MINSA regulates as "suplementos alimenticios" — lighter than drugs. Contamination risk exists; avoid unknown brands.

### Brands users may mention
- **Panama pharmacy shelves:** Centrum, One A Day, Solgar, Nature Made, Now Foods, GNC, Optimum Nutrition.
- **Gym/fitness chains:** GNC Panama, Farmacias Arrocha, MultiMax, Bodytech supplement bar.
- **Local gym brands:** Muscle Tech, Body Fortress, Dymatize, MusclePharm.
- **Online (iHerb via casillero):** NOW, Jarrow, Thorne, Pure Encapsulations.

### Pricing context (USD, 2024–2026 approx, Panama retail)
- Whey 2 kg: $45–80 (vs $35–55 US)
- Creatine 500 g: $20–35 (vs $15–25 US)
- Vit D3 5000 IU × 120: $8–15
- Omega-3 1000 mg × 120: $12–30
- Pre-workouts tub: $35–60

### Cultural notes
- **"Protein shake" =** often associated with male bodybuilders; less normalized for women.
- **"Quemadores"** (fat burners) — very popular, often abused. App should steer away from stimulant stacks.
- **Herbal/natural preference** in LatAm — ashwagandha, moringa, maca are well-known.
- **Maca** (from Peru) — popular but evidence tier C for libido/energy.

---

## 11. Sources / References

### Position Stands & Consensus
- **ISSN Position Stands** (International Society of Sports Nutrition, *JISSN*):
  - Kreider et al. 2017 — Creatine (updated 2021)
  - Trexler et al. 2015 — Beta-alanine
  - Guest et al. 2021 — Caffeine
  - Jäger et al. 2017 — Protein and exercise
  - Campbell et al. 2007/2023 — Protein/amino acids
  - Wilson et al. 2013 — HMB
  - Kerksick et al. 2018/2024 — Nutrient timing
  - Aragon et al. 2017 — Diets and body composition
- **ACSM/AND/DC Joint Position Statement** 2016 — Nutrition and athletic performance.
- **IOC Consensus Statement 2018** (Maughan et al., *BJSM*) — Dietary supplements and the high-performance athlete.
- **AIS ABCD Classification** (Australian Institute of Sport) — Evidence-based ranking of sports supplements.
- **ACSM Position Stand** 2007 — Exercise and fluid replacement.

### Regulatory / Safety
- **NIH Office of Dietary Supplements (ODS)** — Fact sheets: Vitamin D, B12, Iron, Zinc, Magnesium, Calcium, Omega-3, Multivitamin, Creatine, Caffeine.
- **EFSA Scientific Opinions** — Caffeine (2015), Omega-3 (2012), Green tea catechins (2018), Melatonin, Taurine.
- **Institute of Medicine (IOM) / NAM Dietary Reference Intakes** — All vitamin/mineral ULs.
- **Endocrine Society Clinical Practice Guideline** — Vitamin D (Holick 2011).
- **WADA Prohibited List 2024** — wada-ama.org.

### Key meta-analyses / RCTs cited
- Morton et al. 2018 *BJSM* — Protein supplementation and resistance training.
- Saunders et al. 2017 *BJSM* — Beta-alanine performance effects.
- Grgic et al. 2018 *BJSM* — Caffeine meta-analysis.
- Smith et al. 2015 *Clin Sci* — Omega-3 and muscle protein synthesis.
- Vårvik et al. 2021 — Citrulline meta-analysis.
- Domínguez et al. 2017 — Nitrate meta-analysis.
- Shaw et al. 2017 *Am J Clin Nutr* — Collagen + vitamin C for tendons.
- Stoffel et al. 2020 *Haematologica* — Alternate-day iron dosing.
- Ferracioli-Oda et al. 2013 *PLoS One* — Melatonin meta-analysis.
- Ristow et al. 2009 *PNAS* — Antioxidants blunt training adaptations.
- Miller et al. 2005 *Ann Intern Med* — Vitamin E high-dose mortality.
- Bolland et al. 2010 *BMJ* — Calcium supplementation CV risk.
- Koehler et al. 2009 *Eur J Clin Nutr* — ZMA null.
- Melville et al. 2015 *JISSN* — DAA null in trained men.
- Pokrywka 2014; Ma 2017 — Tribulus null.
- Plotkin 2021 — BCAA review.
- Gonçalves et al. 2017 — Caffeine habitual use.
- Gliemann et al. 2013 *J Physiol* — Resveratrol blunts adaptations.
- Onakpoya 2012 — CLA meta-analysis.

### Databases
- **Examine.com** — Per-supplement evidence summaries (updated continuously).
- **PubMed / Cochrane Library** — Primary literature.

---

**Maintenance note:** This document should be re-reviewed annually against the latest ISSN position stands and WADA Prohibited List updates (published each January). Supplement research shifts slowly; the A-tier entries above are extremely stable.
