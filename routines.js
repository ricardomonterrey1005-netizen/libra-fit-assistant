// ================================================================
//  LIBRA FIT - USER ROUTINES (Custom workout configuration)
// ================================================================
//  v2.0: sin rutinas hardcoded. Todo se configura en el onboarding.
//  Usuarios nuevos empiezan con 0 rutinas y 0 dias de gym.
//  Templates sugeridas se muestran en el configurador (opcionales).
// ================================================================

const UserRoutines = {
  // ===== TEMPLATES (SUGERIDAS, NO CARGADAS AUTOMATICAMENTE) =====
  // El usuario puede copiar estas como base para editar.
  // NO se asignan por defecto. Quedan como opciones en el configurador.
  TEMPLATES: [
    {
      id: 'tpl_push',
      name: 'Push (Pecho/Hombro/Triceps)',
      goal: ['muscle_gain', 'strength'],
      level: ['intermedio', 'avanzado'],
      exercises: [
        { exKey:'press_banca', sets:4, reps:'8-12', rest:90, weight:null },
        { exKey:'press_inclinado_mancuernas', sets:3, reps:'10-12', rest:90, weight:null },
        { exKey:'press_militar', sets:3, reps:'10', rest:90, weight:null },
        { exKey:'vuelos_laterales', sets:4, reps:'15', rest:45, weight:null },
        { exKey:'extension_triceps_polea', sets:3, reps:'12', rest:45, weight:null }
      ]
    },
    {
      id: 'tpl_pull',
      name: 'Pull (Espalda/Biceps)',
      goal: ['muscle_gain', 'strength'],
      level: ['intermedio', 'avanzado'],
      exercises: [
        { exKey:'dominadas', sets:4, reps:'6-10', rest:90, weight:null },
        { exKey:'remo_barra', sets:4, reps:'8-12', rest:90, weight:null },
        { exKey:'pulldown', sets:3, reps:'12', rest:60, weight:null },
        { exKey:'curl_biceps_barra', sets:3, reps:'10-12', rest:45, weight:null },
        { exKey:'curl_martillo', sets:3, reps:'12', rest:45, weight:null }
      ]
    },
    {
      id: 'tpl_legs',
      name: 'Piernas',
      goal: ['muscle_gain', 'strength', 'fat_loss'],
      level: ['principiante', 'intermedio', 'avanzado'],
      exercises: [
        { exKey:'sentadilla', sets:4, reps:'8-10', rest:120, weight:null },
        { exKey:'prensa', sets:4, reps:'10-12', rest:90, weight:null },
        { exKey:'curl_femoral', sets:3, reps:'12', rest:60, weight:null },
        { exKey:'extension_cuadriceps', sets:3, reps:'12', rest:60, weight:null },
        { exKey:'hip_thrust', sets:4, reps:'12', rest:90, weight:null }
      ]
    },
    {
      id: 'tpl_full_body',
      name: 'Full Body (Principiantes)',
      goal: ['fat_loss', 'muscle_gain', 'tone', 'maintenance'],
      level: ['principiante'],
      exercises: [
        { exKey:'sentadilla', sets:3, reps:'10', rest:90, weight:null },
        { exKey:'press_banca', sets:3, reps:'10', rest:90, weight:null },
        { exKey:'remo_barra', sets:3, reps:'10', rest:90, weight:null },
        { exKey:'press_militar', sets:3, reps:'10', rest:60, weight:null },
        { exKey:'plancha', sets:3, reps:'30 seg', rest:45, weight:null }
      ]
    },
    {
      id: 'tpl_bodyweight',
      name: 'Peso Corporal',
      goal: ['fat_loss', 'tone', 'maintenance'],
      level: ['principiante', 'intermedio'],
      location: ['casa_basico', 'sin_equipo', 'aire_libre'],
      exercises: [
        { exKey:'flexiones', sets:3, reps:'10-20', rest:60, weight:null },
        { exKey:'sentadillas_peso_corporal', sets:3, reps:'15-25', rest:60, weight:null },
        { exKey:'plancha', sets:3, reps:'30-60 seg', rest:45, weight:null },
        { exKey:'zancadas', sets:3, reps:'10 c/pierna', rest:60, weight:null }
      ]
    }
  ],

  // ===== USER DATA =====
  // Nuevo usuario: empieza con arreglo VACIO.
  // Tiene que configurar en onboarding/perfil.
  getUserRoutines() {
    return S.g('userRoutines', []);
  },

  saveUserRoutines(routines) {
    S.s('userRoutines', routines);
  },

  // Schedule vacio por defecto (todos los dias = null / sin asignar)
  getWeekSchedule() {
    return S.g('weekSchedule', { 0:null, 1:null, 2:null, 3:null, 4:null, 5:null, 6:null });
  },

  saveWeekSchedule(sched) {
    S.s('weekSchedule', sched);
  },

  // Cardio vacio por defecto (sin dias, sin tipo)
  getCardioConfig() {
    return S.g('cardioConfig', { days:[], type:null, duration:0 });
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

  // ===== UTILS =====
  newRoutineId() {
    return 'r_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  },

  // Importar una template como rutina propia (copia editable)
  importTemplate(templateId) {
    const tpl = this.TEMPLATES.find(t => t.id === templateId);
    if (!tpl) return null;
    const newRoutine = {
      id: this.newRoutineId(),
      name: tpl.name,
      exercises: tpl.exercises.map(e => ({ ...e }))
    };
    const routines = this.getUserRoutines();
    routines.push(newRoutine);
    this.saveUserRoutines(routines);
    return newRoutine;
  },

  // Filtrar templates por criterios del perfil
  getTemplatesFor(goal, level, location) {
    return this.TEMPLATES.filter(t => {
      if (goal && t.goal && !t.goal.includes(goal)) return false;
      if (level && t.level && !t.level.includes(level)) return false;
      if (location && t.location && !t.location.includes(location)) return false;
      return true;
    });
  },

  // Convertir rutina del usuario al formato legacy (para code que espera {ex:[{id,s,r,rest}]})
  routineToLegacy(routine) {
    if (!routine) return null;
    return {
      id: routine.id,
      name: routine.name,
      time: routine.time || '',
      ex: (routine.exercises || []).map(e => ({
        id: e.exKey, s: e.sets, r: e.reps, rest: e.rest
      })),
      _custom: true
    };
  },

  hasCustomConfig() {
    if (typeof localStorage === 'undefined') return false;
    return !!localStorage.getItem(S._prefix('userRoutines')) ||
           !!localStorage.getItem(S._prefix('weekSchedule'));
  },

  getExerciseOptions() {
    // Usa ExerciseDB si existe, si no arreglo vacio
    if (typeof window !== 'undefined' && window.ExerciseDB) {
      const groups = {};
      window.ExerciseDB.EXERCISES.forEach(ex => {
        const g = ex.muscleGroup || 'otros';
        if (!groups[g]) groups[g] = [];
        groups[g].push({ key: ex.id, name: ex.name, muscle: ex.primaryMuscle });
      });
      return groups;
    }
    return {};
  }
};

// ===== HELPERS GLOBALES =====
// Hoy tiene rutina? (con fallback a null, no a Ricardo)
function getEffectiveRoutine(dow) {
  const d = new Date();
  if (typeof dow === 'number') d.setDate(d.getDate() + (dow - d.getDay()));
  const custom = UserRoutines.getTodayRoutine(d);
  return custom ? UserRoutines.routineToLegacy(custom) : null;
}

function isEffectiveCardioDay(dow) {
  const d = new Date();
  if (typeof dow === 'number') d.setDate(d.getDate() + (dow - d.getDay()));
  return UserRoutines.isCardioDay(d);
}
