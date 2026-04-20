// ================================================================
//  LIBRA FIT - USER ROUTINES (Custom workout configuration)
// ================================================================
//  Permite al usuario crear, editar y programar sus propias rutinas.
//  Fallback a RUT_A/RUT_B originales si no hay config personalizada.
// ================================================================

const UserRoutines = {
  // ===== PLANTILLAS POR DEFECTO =====
  DEFAULT_ROUTINES: [
    {
      id: 'push',
      name: 'Push (Pecho/Hombro/Triceps)',
      exercises: [
        { exKey: 'press_banca', sets: 4, reps: '8-12', rest: 90, weight: null },
        { exKey: 'press_inclinado', sets: 3, reps: '10-12', rest: 90, weight: null },
        { exKey: 'press_militar', sets: 3, reps: '10', rest: 90, weight: null },
        { exKey: 'vuelos_laterales', sets: 4, reps: '15', rest: 45, weight: null },
        { exKey: 'extension_triceps', sets: 3, reps: '12', rest: 45, weight: null },
        { exKey: 'fondos', sets: 3, reps: '10', rest: 60, weight: null }
      ]
    },
    {
      id: 'pull',
      name: 'Pull (Espalda/Biceps)',
      exercises: [
        { exKey: 'dominadas', sets: 4, reps: '6-10', rest: 90, weight: null },
        { exKey: 'remo_barra', sets: 4, reps: '8-12', rest: 90, weight: null },
        { exKey: 'pulldown', sets: 3, reps: '12', rest: 60, weight: null },
        { exKey: 'remo_sentado', sets: 3, reps: '12', rest: 60, weight: null },
        { exKey: 'curl_biceps_barra', sets: 3, reps: '10-12', rest: 45, weight: null },
        { exKey: 'martillo', sets: 3, reps: '12', rest: 45, weight: null }
      ]
    },
    {
      id: 'legs',
      name: 'Piernas y Gluteos',
      exercises: [
        { exKey: 'sentadilla', sets: 4, reps: '8-10', rest: 120, weight: null },
        { exKey: 'prensa', sets: 4, reps: '10-12', rest: 90, weight: null },
        { exKey: 'curl_femoral', sets: 3, reps: '12', rest: 60, weight: null },
        { exKey: 'extension_cuadriceps', sets: 3, reps: '12', rest: 60, weight: null },
        { exKey: 'hip_thrust', sets: 4, reps: '12', rest: 90, weight: null },
        { exKey: 'zancadas', sets: 3, reps: '10 c/pierna', rest: 60, weight: null }
      ]
    },
    {
      id: 'upper',
      name: 'Tren Superior (Full)',
      exercises: [
        { exKey: 'press_banca', sets: 4, reps: '8-10', rest: 90, weight: null },
        { exKey: 'remo_barra', sets: 4, reps: '8-10', rest: 90, weight: null },
        { exKey: 'press_militar', sets: 3, reps: '10', rest: 60, weight: null },
        { exKey: 'pulldown', sets: 3, reps: '12', rest: 60, weight: null },
        { exKey: 'curl_biceps_mancuernas', sets: 3, reps: '12', rest: 45, weight: null },
        { exKey: 'extension_triceps', sets: 3, reps: '12', rest: 45, weight: null }
      ]
    },
    {
      id: 'lower',
      name: 'Tren Inferior (Full)',
      exercises: [
        { exKey: 'sentadilla', sets: 4, reps: '8-10', rest: 120, weight: null },
        { exKey: 'peso_muerto', sets: 3, reps: '6-8', rest: 120, weight: null },
        { exKey: 'prensa', sets: 3, reps: '12', rest: 90, weight: null },
        { exKey: 'curl_femoral', sets: 3, reps: '12', rest: 60, weight: null },
        { exKey: 'hip_thrust', sets: 3, reps: '12', rest: 60, weight: null },
        { exKey: 'plancha', sets: 3, reps: '1 min', rest: 45, weight: null }
      ]
    },
    {
      id: 'full',
      name: 'Full Body',
      exercises: [
        { exKey: 'sentadilla', sets: 3, reps: '10', rest: 90, weight: null },
        { exKey: 'press_banca', sets: 3, reps: '10', rest: 90, weight: null },
        { exKey: 'remo_barra', sets: 3, reps: '10', rest: 90, weight: null },
        { exKey: 'press_militar', sets: 3, reps: '10', rest: 60, weight: null },
        { exKey: 'plancha', sets: 3, reps: '1 min', rest: 45, weight: null }
      ]
    }
  ],

  // Schedule por defecto: Push/Pull/Legs con cardio en lun/mie/vie
  DEFAULT_SCHEDULE: {
    0: null,     // Dom - descanso
    1: 'push',   // Lun
    2: 'pull',   // Mar
    3: null,     // Mie - descanso
    4: 'legs',   // Jue
    5: 'push',   // Vie
    6: null      // Sab - descanso
  },

  DEFAULT_CARDIO: {
    days: [1, 3, 5],       // Lun, Mie, Vie
    type: 'caminadora',     // caminadora | escaladora | caminar | trotar | eliptica | bicicleta
    duration: 20            // min
  },

  // ===== USER DATA =====
  getUserRoutines() {
    return S.g('userRoutines', this.DEFAULT_ROUTINES.map(r => ({ ...r, exercises: r.exercises.slice() })));
  },

  saveUserRoutines(routines) {
    S.s('userRoutines', routines);
  },

  getWeekSchedule() {
    return S.g('weekSchedule', { ...this.DEFAULT_SCHEDULE });
  },

  saveWeekSchedule(sched) {
    S.s('weekSchedule', sched);
  },

  getCardioConfig() {
    return S.g('cardioConfig', { ...this.DEFAULT_CARDIO });
  },

  saveCardioConfig(cfg) {
    S.s('cardioConfig', cfg);
  },

  // ===== QUERIES =====
  getRoutineById(id) {
    if (!id) return null;
    const routines = this.getUserRoutines();
    return routines.find(r => r.id === id) || null;
  },

  getTodayRoutine(d = new Date()) {
    const sched = this.getWeekSchedule();
    const id = sched[d.getDay()];
    return this.getRoutineById(id);
  },

  isCardioDay(d = new Date()) {
    const cfg = this.getCardioConfig();
    return Array.isArray(cfg.days) && cfg.days.includes(d.getDay());
  },

  // ===== COMPAT: convertir rutina de usuario al formato RUT_A/RUT_B =====
  // para que el resto del codigo siga funcionando sin cambios masivos.
  routineToLegacy(routine) {
    if (!routine) return null;
    return {
      id: routine.id,
      name: routine.name,
      time: routine.time || '',
      ex: routine.exercises.map(e => ({
        id: e.exKey,
        s: e.sets,
        r: e.reps,
        rest: e.rest
      })),
      _custom: true
    };
  },

  // Flag: usuario ha configurado sus propias rutinas?
  hasCustomConfig() {
    return !!localStorage.getItem(S._prefix('userRoutines')) ||
           !!localStorage.getItem(S._prefix('weekSchedule'));
  },

  // ===== UTILS =====
  newRoutineId() {
    return 'r_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  },

  // Listado de ejercicios agrupados para dropdown
  getExerciseOptions() {
    const groups = {};
    Object.entries(EX).forEach(([k, ex]) => {
      const g = ex.group || 'Otros';
      if (!groups[g]) groups[g] = [];
      groups[g].push({ key: k, name: ex.name, muscle: ex.muscle });
    });
    return groups;
  }
};

// ===== HOOK GLOBAL: getTodayRoutine (para uso desde engine.js / app.js) =====
// getEffectiveRoutine reemplaza el acceso directo a sch.g === 'A' ? RUT_A : RUT_B
function getEffectiveRoutine(dow) {
  const d = new Date();
  if (typeof dow === 'number') d.setDate(d.getDate() + (dow - d.getDay()));
  // 1) Si hay rutina custom para hoy, usarla
  const custom = UserRoutines.getTodayRoutine(d);
  if (custom) return UserRoutines.routineToLegacy(custom);
  // 2) Fallback al SCHED original de Ricardo
  const sch = SCHED[d.getDay()];
  if (!sch || !sch.g) return null;
  return sch.g === 'A' ? RUT_A : RUT_B;
}

function isEffectiveCardioDay(dow) {
  const d = new Date();
  if (typeof dow === 'number') d.setDate(d.getDate() + (dow - d.getDay()));
  // Si hay rutinas custom, usar config cardio custom
  if (UserRoutines.hasCustomConfig()) {
    return UserRoutines.isCardioDay(d);
  }
  const sch = SCHED[d.getDay()];
  return sch && sch.c === true;
}
