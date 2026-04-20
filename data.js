// ================================================================
//  LIBRA FIT - DATA LAYER (generic constants + reference data)
// ================================================================
//  LIMPIO v2.0: Cero datos personales. Cero plan pre-cargado.
//  - Constantes universales (dias, meses, unidades)
//  - Referencias genericas (actividad, metas, lugares)
//  - Stubs vacios para compat legacy (MEALS, SUPS, etc.)
//  - Los planes personalizados viven en meals.js/routines.js/exerciseDB.js
// ================================================================

// ===== TIEMPO =====
const DAY_NAMES = ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'];
const DAY_SHORT = ['Dom','Lun','Mar','Mie','Jue','Vie','Sab'];
const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const MONTHS_SHORT = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

// ===== META / OBJETIVOS =====
const GOAL_TYPES = {
  fat_loss:    { name:'Bajar de peso',       icon:'📉', metric:'lbs_to_lose' },
  muscle_gain: { name:'Ganar musculo',       icon:'💪', metric:'lbs_to_gain' },
  strength:    { name:'Ganar fuerza',        icon:'🏋️', metric:'prs' },
  endurance:   { name:'Mejorar condicion',   icon:'🏃', metric:'time_or_distance' },
  tone:        { name:'Tonificar',           icon:'✨', metric:'body_fat_pct' },
  maintenance: { name:'Mantenimiento',       icon:'⚖️', metric:'maintain' },
  recovery:    { name:'Volver al ejercicio', icon:'🔄', metric:'consistency' }
};

// ===== EXPERIENCIA =====
const EXPERIENCE_LEVELS = {
  principiante: { name:'Principiante', desc:'Empezando o < 6 meses' },
  intermedio:   { name:'Intermedio',   desc:'6 meses - 2 anos' },
  avanzado:     { name:'Avanzado',     desc:'2+ anos consistente' }
};

// ===== LUGARES ENTRENAMIENTO =====
const TRAINING_LOCATIONS = {
  gym_comercial: { name:'Gym comercial',        equip:['barra','mancuernas','maquinas','banco','poleas','cardio'] },
  gym_casa:      { name:'Gym en casa',          equip:['mancuernas','barra','banco','bandas'] },
  casa_basico:   { name:'Casa (equipo basico)', equip:['mancuernas','bandas'] },
  sin_equipo:    { name:'Sin equipo',           equip:[] },
  aire_libre:    { name:'Aire libre',           equip:['running','parques','calistenia'] }
};

// ===== ACTIVIDAD (para TDEE) =====
const ACTIVITY_LEVELS = {
  sedentario: { name:'Sedentario',  desc:'Trabajo escritorio, poco movimiento', multiplier:1.2 },
  ligero:     { name:'Ligero',      desc:'Ejercicio 1-3 dias/sem',              multiplier:1.375 },
  moderado:   { name:'Moderado',    desc:'Ejercicio 3-5 dias/sem',              multiplier:1.55 },
  activo:     { name:'Activo',      desc:'Ejercicio 6-7 dias/sem',              multiplier:1.725 },
  muy_activo: { name:'Muy activo',  desc:'Ejercicio intenso + trabajo fisico',  multiplier:1.9 }
};

// ===== ALERGENOS =====
const COMMON_ALLERGENS = {
  gluten:       { name:'Gluten',           severity:'alta' },
  lacteos:      { name:'Lacteos',          severity:'media' },
  huevo:        { name:'Huevo',            severity:'alta' },
  pescado:      { name:'Pescado',          severity:'alta' },
  mariscos:     { name:'Mariscos',         severity:'alta' },
  cacahuate:    { name:'Cacahuate/Mani',   severity:'alta' },
  soya:         { name:'Soya',             severity:'media' },
  frutos_secos: { name:'Frutos secos',     severity:'alta' },
  sesamo:       { name:'Sesamo',           severity:'media' },
  sulfitos:     { name:'Sulfitos',         severity:'baja' }
};

// ===== TAGS DIETARIOS =====
const DIETARY_TAGS = {
  vegetariano:  'Vegetariano',
  vegano:       'Vegano',
  pescetariano: 'Pescetariano',
  halal:        'Halal',
  kosher:       'Kosher',
  sin_gluten:   'Sin gluten',
  sin_lactosa:  'Sin lactosa',
  keto:         'Keto',
  bajo_sodio:   'Bajo sodio'
};

// ===== HABITOS ALIMENTARIOS =====
const EATING_PATTERNS = {
  cocino_todo:  { name:'Cocino en casa',        desc:'Preparas todas tus comidas' },
  meal_prep:    { name:'Meal prep',             desc:'Cocinas una vez por semana' },
  comprado:     { name:'Comidas compradas',     desc:'Pides/compras comida lista' },
  restaurante:  { name:'Restaurante frecuente', desc:'Comes fuera casi siempre' },
  mixto:        { name:'Mixto',                 desc:'Combinacion de varios' }
};

// ===== CARDIO =====
const CARDIO_TYPES = {
  caminadora: { name:'Caminadora', icon:'🚶', calPerMin:6 },
  eliptica:   { name:'Eliptica',   icon:'🏋️', calPerMin:7 },
  bicicleta:  { name:'Bicicleta',  icon:'🚴', calPerMin:7 },
  escaladora: { name:'Escaladora', icon:'🪜', calPerMin:8 },
  correr:     { name:'Correr',     icon:'🏃', calPerMin:10 },
  trotar:     { name:'Trotar',     icon:'🏃', calPerMin:8 },
  caminar:    { name:'Caminar',    icon:'🚶', calPerMin:4 },
  natacion:   { name:'Natacion',   icon:'🏊', calPerMin:9 },
  remo:       { name:'Remo',       icon:'🚣', calPerMin:8 },
  hiit:       { name:'HIIT',       icon:'⚡', calPerMin:12 }
};

// Compat: array para codigo legacy que espera CARDIO
const CARDIO = Object.keys(CARDIO_TYPES).map(id => ({ id, ...CARDIO_TYPES[id] }));

// ================================================================
//  STUBS LEGACY (vacios, compat)
// ================================================================
// El codigo viejo espera estos simbolos. Los dejamos VACIOS.
// Los datos reales vienen de:
//   - meals.js        (UserMeals.getTodayMeals)
//   - routines.js     (UserRoutines.getTodayRoutine)
//   - exerciseDB.js   (ExerciseDB.findById, etc.)
//   - nutritionDB.js  (FoodDB.getFood, etc.)
// ================================================================

const MEALS = {};              // vacio: no hay plan hardcoded
const MEAL_ORDER = [];         // vacio: orden viene del template del usuario
const RUT_A = { id:'A', name:'', ex:[] };  // vacio: rutinas viven en routines.js
const RUT_B = { id:'B', name:'', ex:[] };  // vacio
const SCHED = { 0:{g:null,c:false}, 1:{g:null,c:false}, 2:{g:null,c:false},
                3:{g:null,c:false}, 4:{g:null,c:false}, 5:{g:null,c:false},
                6:{g:null,c:false} };  // todos los dias vacios (no hay default)
const BATCH = {};              // vacio: no hay cooking schedule hardcoded
const SUPS = [];               // vacio: usuario elige sus suplementos

// EX (exercise registry) - compat shim que delega a ExerciseDB si existe
const EX = new Proxy({}, {
  get(target, key) {
    if (typeof window !== 'undefined' && window.ExerciseDB) {
      const ex = window.ExerciseDB.findById(key);
      if (ex) return {
        name: ex.name,
        muscle: ex.primaryMuscle || ex.muscleGroup,
        group: ex.muscleGroup,
        equip: ex.equipment?.join(' + ') || '',
        dw: ex.defaultWeight || 0,
        how: (ex.instructions || []).join('\n'),
        muscles: [ex.primaryMuscle, ...(ex.secondaryMuscles || [])].join(', '),
        errors: (ex.commonErrors || []).join(' | '),
        tip: (ex.tips || [])[0] || '',
        breath: '',
        machine: ex.equipment?.join(' + ') || ''
      };
    }
    return null;
  },
  has(target, key) {
    if (typeof window !== 'undefined' && window.ExerciseDB) {
      return !!window.ExerciseDB.findById(key);
    }
    return false;
  }
});

// FOOD (generic food registry) - compat shim que delega a FoodDB si existe
// Si no existe, es objeto vacio (no hay hardcoded foods de Ricardo)
const FOOD = new Proxy({}, {
  get(target, key) {
    if (typeof window !== 'undefined' && window.FoodDB) {
      const f = window.FoodDB.getFood(key);
      if (f) return {
        n: f.name, c: f.cal, p: f.protein, cb: f.carbs, f: f.fat,
        v: f.goalFit?.fatLoss >= 7 ? 'ok' : 'warn',
        note: f.notes || ''
      };
    }
    return null;
  },
  has(target, key) {
    if (typeof window !== 'undefined' && window.FoodDB) {
      return !!window.FoodDB.getFood(key);
    }
    return false;
  }
});

// ================================================================
//  COMPAT SHIMS para codigo legacy
// ================================================================

// getMeal(key, dow) - legacy: devolvia plan hardcoded de Ricardo.
// Ahora: delega a UserMeals si existe, si no devuelve null (sin plan).
function getMeal(key, dow) {
  if (typeof UserMeals !== 'undefined' && UserMeals.getMealById) {
    const m = UserMeals.getMealById(key);
    if (m) {
      const macros = UserMeals.calcMealMacros ? UserMeals.calcMealMacros(m) : { cal:0 };
      return {
        desc: m.foods && m.foods.length
              ? m.foods.map(f => `${f.grams}g ${f.foodKey}`).join(' + ')
              : 'Sin configurar',
        alts: [],
        cal: macros.cal || 0,
        prep: 0,
        time: m.time || '',
        label: m.label || key
      };
    }
  }
  return null;
}
