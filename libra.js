// ================================================================
//  LIBRA - ASISTENTE INTELIGENTE DE FITRICARDO
//  NLP Engine + Command Executor + Context Manager
//  Puede leer Y modificar cualquier aspecto de la app
// ================================================================

const Libra = {
  // Conversation history & context
  history: [],
  context: { lastIntent: null, lastEntity: null, awaitingConfirm: null, topic: null },
  maxHistory: 50,

  // ===== NORMALIZE TEXT =====
  norm(t) {
    return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[¿¡!?.,;:()]/g, '').trim();
  },

  // ===== FUZZY MATCH =====
  fuzzy(text, patterns) {
    const n = this.norm(text);
    for (const p of patterns) {
      if (typeof p === 'string') { if (n.includes(p)) return true; }
      else if (p instanceof RegExp) { if (p.test(n)) return true; }
    }
    return false;
  },

  // ===== EXTRACT NUMBERS (including Spanish words) =====
  nums(text) {
    const spanishNums = {un:1,uno:1,una:1,dos:2,tres:3,cuatro:4,cinco:5,seis:6,siete:7,ocho:8,nueve:9,diez:10,
      medio:0.5,media:0.5,mitad:0.5,par:2,doce:12,once:11};
    const n = this.norm(text);
    const results = [];
    // Extract digit numbers
    const digitMatches = text.match(/\d+\.?\d*/g);
    if (digitMatches) results.push(...digitMatches.map(Number));
    // Extract Spanish word numbers
    for (const [word, val] of Object.entries(spanishNums)) {
      if (n.split(/\s+/).includes(word)) results.push(val);
    }
    return results.length ? results : [];
  },

  // ===== INTENT RECOGNITION =====
  detectIntent(text) {
    const n = this.norm(text);
    const w = n.split(/\s+/);

    // --- GREETINGS ---
    if (this.fuzzy(n, ['hola', 'hey', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches', 'que tal', 'como estas', 'saludos']))
      return { intent: 'greeting' };

    // --- HELP ---
    if (this.fuzzy(n, ['ayuda', 'help', 'que puedes hacer', 'que haces', 'como funciona', 'comandos', 'instrucciones', 'para que sirves']))
      return { intent: 'help' };

    // --- LOG WEIGHT ---
    if (this.fuzzy(n, ['peso ', 'mi peso', 'registra peso', 'log peso', 'registrar peso', /peso\s+\d/, /\d+\s*(lbs|libras|lb)/, 'me pese', 'pese hoy'])) {
      const nums = this.nums(text);
      const weight = nums.find(x => x >= 50 && x <= 500);
      return { intent: 'log_weight', weight };
    }

    // --- LOG WATER ---
    if (this.fuzzy(n, ['agua', 'tome agua', 'bebi agua', 'hidrat', 'tomar agua', /\d+\s*ml/, /\d+\s*litro/, 'vaso', 'botella'])) {
      const nums = this.nums(text);
      let ml = 0;
      if (n.includes('litro') || n.includes('lt') || n.includes('l ')) {
        ml = (nums[0] || 1) * 1000;
      } else if (nums.length) {
        ml = nums[0] >= 1 && nums[0] <= 10 ? nums[0] * 1000 : nums[0];
      } else if (n.includes('vaso')) {
        ml = 250;
      } else if (n.includes('botella')) {
        ml = 500;
      } else {
        ml = 500; // default
      }
      return { intent: 'log_water', ml };
    }

    // --- PARTIAL MEAL (must check before full log_meal) ---
    if (this.fuzzy(n, ['solo comi', 'solo me comi', 'nada mas comi', 'solo desayune', 'no me comi todo', 'solo almorse', 'medio desayuno', 'la mitad', 'incompleto', 'no termine', 'solo tome', 'me comi solo', 'comi nada mas', /solo\s+\d+/, /nada mas\s+\d+/])) {
      // Detect which meal
      let meal = null;
      if (this.fuzzy(n, ['desayun'])) meal = 'desayuno';
      else if (this.fuzzy(n, ['almuer', 'almors', 'lunch'])) meal = 'almuerzo';
      else if (this.fuzzy(n, ['cen', 'dinner'])) meal = 'cena';
      else if (this.fuzzy(n, ['merienda'])) meal = new Date().getHours() < 13 ? 'merienda1' : 'merienda2';
      else if (this.fuzzy(n, ['fibra'])) meal = 'fibra';
      // Extract what they actually ate
      const foodWords = n.replace(/solo|nada mas|me|comi|desayune|almorce|cene|no|todo|el|la|los|las|del|de|un|una|unos|unas/g, '').trim();
      const nums = this.nums(text);
      return { intent: 'partial_meal', meal, foodDesc: foodWords, qty: nums[0] || null, originalText: text };
    }

    // --- ASK STREAK ---
    if (this.fuzzy(n, ['racha', 'streak', 'mis puntos', 'mi nivel', 'mi racha', 'cuantos dias llevo', 'mis logros', 'badges', 'mis insignias', 'xp', 'nivel', 'experiencia'])) {
      return { intent: 'ask_streak' };
    }

    // --- LOG MEAL ---
    if (this.fuzzy(n, ['ya desayune', 'ya almorce', 'ya cene', 'comi', 'ya comi', 'marcar comida', 'marcar desayuno', 'marcar almuerzo', 'marcar cena', 'marcar merienda', 'marcar fibra', 'termine de comer', 'desayune', 'almorce', 'cene', 'meriende', 'tome fibra', 'ya meriende'])) {
      let meal = null;
      if (this.fuzzy(n, ['desayun'])) meal = 'desayuno';
      else if (this.fuzzy(n, ['almuer', 'almors', 'lunch'])) meal = 'almuerzo';
      else if (this.fuzzy(n, ['cen', 'dinner'])) meal = 'cena';
      else if (this.fuzzy(n, ['merienda 1', 'merienda1', 'primera merienda', 'snack 1'])) meal = 'merienda1';
      else if (this.fuzzy(n, ['merienda 2', 'merienda2', 'segunda merienda', 'snack 2'])) meal = 'merienda2';
      else if (this.fuzzy(n, ['fibra', 'psyllium', 'metamucil'])) meal = 'fibra';
      else if (this.fuzzy(n, ['merienda', 'snack'])) {
        // Determine which snack based on time
        const h = new Date().getHours();
        meal = h < 13 ? 'merienda1' : 'merienda2';
      }
      return { intent: 'log_meal', meal };
    }

    // --- ASK FOOD (can I eat?) ---
    if (this.fuzzy(n, ['puedo comer', 'puedo tomar', 'esta bien si como', 'me puedo comer', 'calorias de', 'calorias del', 'cuantas calorias', 'es bueno comer', 'es malo comer', 'que tiene', 'nutri'])) {
      // Extract food name
      const foodPatterns = ['puedo comer ', 'puedo tomar ', 'calorias de ', 'calorias del ', 'que tiene '];
      let food = '';
      for (const p of foodPatterns) {
        const idx = n.indexOf(p);
        if (idx >= 0) { food = n.slice(idx + p.length).trim(); break; }
      }
      if (!food) food = w.filter(x => x.length > 3 && !['puedo', 'comer', 'tomar', 'bueno', 'malo', 'calorias', 'cuantas'].includes(x)).join(' ');
      return { intent: 'ask_food', food };
    }

    // --- ADD EXTRA FOOD ---
    if (this.fuzzy(n, ['comi un', 'comi una', 'me comi', 'comi ', 'agregar comida', 'anota que comi', 'agrega que comi'])) {
      const foodWords = n.replace(/comi (un |una |el |la |los |las )?/g, '').replace(/me |agregar |anota |agrega |que /g, '').trim();
      return { intent: 'add_food', food: foodWords };
    }

    // --- ASK PLAN (today) ---
    if (this.fuzzy(n, ['que como hoy', 'que toca hoy', 'plan de hoy', 'que hay de comer', 'que almuerzo', 'que desayuno', 'que ceno', 'que merienda', 'menu de hoy', 'que toca de'])) {
      let meal = null;
      if (this.fuzzy(n, ['desayun'])) meal = 'desayuno';
      else if (this.fuzzy(n, ['almuer', 'lunch'])) meal = 'almuerzo';
      else if (this.fuzzy(n, ['cen'])) meal = 'cena';
      else if (this.fuzzy(n, ['merienda'])) meal = new Date().getHours() < 13 ? 'merienda1' : 'merienda2';
      return { intent: 'ask_plan', meal };
    }

    // --- TOMORROW ---
    if (this.fuzzy(n, ['manana', 'que toca manana', 'plan de manana', 'que como manana', 'que llevo manana', 'que preparo', 'que ejercicio manana'])) {
      return { intent: 'tomorrow' };
    }

    // --- ASK EXERCISE ---
    if (this.fuzzy(n, ['que ejercicio', 'rutina de hoy', 'que toca en gym', 'como se hace', 'como hago', 'tecnica de', 'que muscul', 'ejercicio de'])) {
      let exercise = null;
      for (const [id, ex] of Object.entries(EX)) {
        if (n.includes(this.norm(ex.name)) || n.includes(id.replace(/_/g, ' '))) {
          exercise = id; break;
        }
      }
      return { intent: 'ask_exercise', exercise };
    }

    // --- LOG EXERCISE ---
    if (this.fuzzy(n, ['hice', 'termine', 'complete', 'hoy hice', 'acabe', /(\d+)\s*(lbs|libras)\s*(en|de|para)/])) {
      let exercise = null, weight = null;
      for (const [id, ex] of Object.entries(EX)) {
        if (n.includes(this.norm(ex.name)) || n.includes(id.replace(/_/g, ' '))) {
          exercise = id; break;
        }
      }
      const nums = this.nums(text);
      weight = nums.find(x => x >= 1 && x <= 500);
      if (this.fuzzy(n, ['termine rutina', 'termine gym', 'acabe rutina', 'acabe gym', 'complete rutina'])) {
        return { intent: 'complete_routine' };
      }
      return { intent: 'log_exercise', exercise, weight };
    }

    // --- ASK PROGRESS ---
    if (this.fuzzy(n, ['como voy', 'mi progreso', 'cuanto he bajado', 'cuanto peso', 'peso actual', 'cuanto me falta', 'estado', 'resumen', 'como estoy', 'avance'])) {
      return { intent: 'ask_progress' };
    }

    // --- ASK CALORIES ---
    if (this.fuzzy(n, ['cuantas calorias llevo', 'calorias de hoy', 'cuanto he comido', 'presupuesto calor', 'cuanto me queda', 'quedan calorias', 'ya me pase'])) {
      return { intent: 'ask_calories' };
    }

    // --- MODIFY GOAL ---
    if (this.fuzzy(n, ['mi meta', 'quiero pesar', 'quiero llegar', 'objetivo', 'cambiar meta', 'nueva meta', 'quiero bajar a'])) {
      const nums = this.nums(text);
      const target = nums.find(x => x >= 50 && x <= 500);
      return { intent: 'modify_goal', target };
    }

    // --- MODIFY PROFILE ---
    if (this.fuzzy(n, ['tengo', 'mido', 'mi nombre', 'mi edad', 'cambiar nombre', 'actualizar perfil', /tengo \d+ anos/, /mido \d+/])) {
      const nums = this.nums(text);
      let field = null, value = null;
      if (this.fuzzy(n, ['anos', 'edad'])) { field = 'age'; value = nums.find(x => x >= 10 && x <= 100); }
      else if (this.fuzzy(n, ['mido', 'altura', 'estatura', 'cm'])) { field = 'height'; value = nums.find(x => x >= 100 && x <= 250); }
      else if (this.fuzzy(n, ['nombre', 'llamo', 'llama'])) {
        field = 'name';
        value = text.replace(/mi nombre es |me llamo |me llaman /gi, '').trim();
      }
      return { intent: 'modify_profile', field, value };
    }

    // --- SUPPLEMENTS ---
    if (this.fuzzy(n, ['suplemento', 'suplement', 'creatina', 'proteina whey', 'magnesio', 'omega', 'vitamina', 'fibra suple', 'bcaa', 'cafeina', 'multivit'])) {
      let supId = null;
      const supMap = { creatina: 'creatina', proteina: 'proteina', whey: 'proteina', magnesio: 'magnesio', omega: 'omega3', 'vitamina d': 'vitamina_d', fibra: 'fibra', bcaa: 'bcaa', cafeina: 'cafeina', multi: 'multi' };
      for (const [k, v] of Object.entries(supMap)) { if (n.includes(k)) { supId = v; break; } }

      if (this.fuzzy(n, ['agrega', 'agregar', 'anade', 'anadir', 'quiero tomar', 'empezar a tomar'])) {
        return { intent: 'add_supplement', supId };
      }
      if (this.fuzzy(n, ['quita', 'quitar', 'elimina', 'eliminar', 'deja de', 'no quiero'])) {
        return { intent: 'remove_supplement', supId };
      }
      if (this.fuzzy(n, ['que suplemento', 'recomienda', 'debo tomar', 'que tomo'])) {
        return { intent: 'ask_supplements' };
      }
      return { intent: 'ask_supplement_info', supId };
    }

    // --- CARDIO ---
    if (this.fuzzy(n, ['cardio', 'caminadora', 'eliptica', 'bicicleta', 'correr', 'caminar'])) {
      if (this.fuzzy(n, ['hice', 'termine', 'complete', 'ya hice'])) {
        return { intent: 'complete_cardio' };
      }
      return { intent: 'ask_cardio' };
    }

    // --- SETTINGS ---
    if (this.fuzzy(n, ['activa', 'desactiva', 'activar', 'desactivar', 'apaga', 'prende', 'enciende'])) {
      const setting = this.fuzzy(n, ['notificacion']) ? 'notif' :
        this.fuzzy(n, ['agua']) ? 'water' :
        this.fuzzy(n, ['dormir', 'sueno', 'sleep']) ? 'sleep' :
        this.fuzzy(n, ['comida', 'meal']) ? 'meal' :
        this.fuzzy(n, ['gym', 'ejercicio']) ? 'gym' :
        this.fuzzy(n, ['manana', 'morning', 'briefing']) ? 'morning' : null;
      const enable = this.fuzzy(n, ['activa', 'activar', 'prende', 'enciende']);
      return { intent: 'toggle_setting', setting, enable };
    }

    // --- MOTIVATION ---
    if (this.fuzzy(n, ['cansado', 'no quiero', 'no puedo', 'desanima', 'desmotiv', 'aburrido', 'dificil', 'rindo', 'rendirme', 'floj', 'perez', 'no tengo ganas', 'dame animo', 'motivame', 'sin ganas', 'anima'])) {
      return { intent: 'motivation' };
    }

    // --- SLEEP ---
    if (this.fuzzy(n, ['dormi', 'sueno', 'insomnio', 'horas de sueno', 'me desperte', 'no pude dormir', 'a dormir'])) {
      const nums = this.nums(text);
      return { intent: 'sleep', hours: nums[0] || null };
    }

    // --- BATCH COOKING ---
    if (this.fuzzy(n, ['batch', 'cocinar', 'meal prep', 'preparar comida', 'que cocino'])) {
      return { intent: 'batch_cooking' };
    }

    // --- NAVIGATE ---
    if (this.fuzzy(n, ['ir a', 've a', 'abre', 'muestrame', 'entra a', 'llevarme a'])) {
      let page = null;
      if (this.fuzzy(n, ['hoy', 'inicio', 'home'])) page = 0;
      else if (this.fuzzy(n, ['comida', 'alimenta', 'comidas', 'plan'])) page = 1;
      else if (this.fuzzy(n, ['gym', 'ejercicio', 'rutina'])) page = 2;
      else if (this.fuzzy(n, ['progreso', 'peso', 'grafic'])) page = 3;
      else if (this.fuzzy(n, ['perfil', 'config', 'ajuste'])) page = 4;
      return { intent: 'navigate', page };
    }

    // --- RESET ---
    if (this.fuzzy(n, ['reiniciar', 'borrar hoy', 'reset', 'empezar de nuevo'])) {
      return { intent: 'reset_day' };
    }

    // --- ASK TODAY / TODAY'S PLAN ---
    if (this.fuzzy(n, ['que dia es hoy', 'que toca hoy', 'que tengo que hacer', 'que hago hoy', 'plan hoy'])) {
      return { intent: 'ask_today' };
    }

    // --- ASK GYM TODAY ---
    if (this.fuzzy(n, ['que toca de gym', 'rutina hoy', 'ejercicios hoy', 'gym hoy', 'que ejercicios toca'])) {
      return { intent: 'ask_gym_today' };
    }

    // --- ASK NEXT MEAL ---
    if (this.fuzzy(n, ['que como ahora', 'proxima comida', 'siguiente comida', 'que toca comer'])) {
      return { intent: 'ask_meal_now' };
    }

    // --- ASK WATER ---
    if (this.fuzzy(n, ['cuanta agua', 'agua que llevo', 'cuanto agua llevo', 'llevo de agua', 'agua llevo'])) {
      return { intent: 'ask_water' };
    }

    // --- TIP / ADVICE ---
    if (this.fuzzy(n, ['tip', 'consejo', 'que me recomiendas', 'dame un consejo', 'recomendacion'])) {
      return { intent: 'tip' };
    }

    // --- FAQ / Fitness questions (fuzzy match knowledge base) ---
    const faqAns = this.faqLookup(n);
    if (faqAns) return { intent: 'faq', answer: faqAns };

    // --- UNKNOWN ---
    return { intent: 'unknown' };
  },

  // ===== FAQ KNOWLEDGE BASE =====
  faq: [
    { patterns: ['cuantas calorias debo comer', 'cuantas calorias necesito', 'calorias al dia', 'cuanto comer'],
      response: () => {
        const b = calBudget();
        return `Tu presupuesto calorico personalizado:\n\n• **Meta:** ${b.target} cal/dia (deficit moderado)\n• **Minimo:** ${b.min} cal (no bajes de aqui)\n• **Maximo:** ${b.max} cal\n\nBajar 1 lb/sem = deficit de ~500 cal/dia.` ;
      }},
    { patterns: ['cuanta proteina', 'proteina necesito', 'gramos de proteina'],
      response: () => {
        const w = getWeights();
        const lbs = w.length ? w[0].weight : (getProfile().wStart || 180);
        const kg = lbs / 2.205;
        const lo = Math.round(kg * 1.6), hi = Math.round(kg * 2.2);
        return `Para construir musculo/quemar grasa: **${lo}-${hi}g de proteina/dia** (1.6-2.2g por kg).\n\nBasado en tu peso (${lbs} lbs = ${kg.toFixed(1)} kg). Divide en 4-5 comidas.`;
      }},
    { patterns: ['cuantos dias debo entrenar', 'cuantas veces entrenar', 'cuantos dias gym', 'frecuencia gym'],
      response: '4-5 dias a la semana es ideal. Tu plan actual es 5 (A-B-A-B-A). Menos de 3 pierdes progreso, mas de 6 sin descanso = sobreentreno.\n\nDescansa minimo 1-2 dias por semana.'},
    { patterns: ['es malo comer de noche', 'comer tarde engorda', 'comer en la noche'],
      response: 'MITO. Lo que importa son las calorias TOTALES del dia, no la hora. Tu cena (8:30 PM) es parte del plan.\n\nLo unico real: si comes muy pesado antes de dormir puede afectar tu sueno.'},
    { patterns: ['puedo beber cafe', 'el cafe engorda', 'cafe sirve'],
      response: '**Cafe negro = SI.** Cero calorias, acelera metabolismo, mejora rendimiento en gym.\n\n• Evita: azucar, crema, saborizantes\n• No lo tomes despues de 2 PM (afecta sueno)\n• Max 400mg cafeina/dia (~4 tazas)'},
    { patterns: ['cuanto peso pierdo', 'cuanto bajo por semana', 'cuanto puedo bajar'],
      response: 'Saludable: **0.5-1 kg / 1-2 lbs por semana**.\n\nMas rapido = pierdes musculo + efecto rebote. Menos = puede que necesites mas deficit o cardio.\n\nNo te peses diario; el peso fluctua. Pesate 1-2x/sem mismo horario.'},
    { patterns: ['cuando veo resultados', 'cuanto tardo en ver', 'cuando cambia'],
      response: 'Timeline realista:\n\n• **2-4 semanas:** Tu te notas mejor (ropa, espejo)\n• **6-8 semanas:** Otros lo notan\n• **12 semanas:** Cambio visible dramatico\n\nLa constancia vence a la perfeccion. No te rindas en semana 3!'},
    { patterns: ['tengo hambre', 'mucha hambre', 'me muero de hambre', 'sigo con hambre'],
      response: 'Hambre real o antojo? Checklist:\n\n1. **Toma agua** (sed disfrazada de hambre)\n2. **Proteina/fibra:** yogurt griego, atun, almendras, huevo duro\n3. Si duermes mal, tienes mas hambre (dormir 7-8h)\n4. Si es antojo dulce: gelatina sin azucar, 1 fruta\n\nNO pases hambre extrema - puede romper tu racha.'},
    { patterns: ['no bajo de peso', 'estoy estancado', 'estancamiento', 'plateau', 'ya no bajo'],
      response: 'Plateau es NORMAL. Checklist:\n\n1. **Cuanto tiempo?** Menos de 2 sem = fluctuacion normal\n2. **Sueno:** <7h baja metabolismo\n3. **Estres:** cortisol retiene agua\n4. **Deficit real?** Trackea todo lo que comes por 3 dias\n5. **Cardio:** agrega 20 min mas\n6. **Recomp:** quizas ganaste musculo (buena senal)\n\nNo subas calorias. Se paciente.'},
    { patterns: ['como subir de peso', 'ganar peso', 'ganar masa'],
      response: 'Para ganar musculo:\n\n• **Superavit calorico:** +300-500 cal/dia sobre mantenimiento\n• **Proteina alta:** 2g/kg\n• **Gym pesado:** 4-5 dias, progresion de cargas\n• **Dormir 7-9h**\n\nGanarse 0.5-1 lb/sem es ideal. Mas rapido = mucha grasa.'},
    { patterns: ['que es deficit', 'deficit calorico', 'que significa deficit'],
      response: 'Deficit calorico = **comer MENOS de lo que tu cuerpo quema**. Es la unica forma de bajar grasa.\n\n• Deficit suave: 200-300 cal/dia\n• Deficit agresivo: 500-700 cal/dia\n• Muy agresivo: >800 (pierdes musculo)\n\nTu plan actual es deficit moderado.'},
    { patterns: ['debo desayunar', 'ayuno intermitente', 'saltarse desayuno'],
      response: 'Depende de ti. **Ayuno intermitente (16:8)** funciona si te acomoda, pero no es magia.\n\nLo importante es: calorias totales + proteina alta. Si prefieres desayunar, desayuna.\n\nTu plan tiene desayuno porque entrenas 5 AM (necesitas energia).'},
    { patterns: ['cardio en ayunas', 'ayunas cardio'],
      response: 'Cardio en ayunas NO quema mas grasa que cardio con comida (los estudios son claros).\n\nPero tiene ventaja: mas comodo hacerlo temprano antes de trabajar. Si te funciona mental/logisticamente: dale.'},
    { patterns: ['cuanto descansar entre series', 'descanso entre series'],
      response: '• **Fuerza (4-6 reps):** 2-3 min\n• **Hipertrofia (8-12 reps):** 60-90 seg\n• **Resistencia (15+ reps):** 30-45 seg\n\nTu plan es 45-60s porque es hipertrofia + eficiencia de tiempo.'},
    { patterns: ['agua cuanto tomar', 'cuanta agua al dia'],
      response: 'Minimo: **3-4 litros/dia** (mas si entrenas/calor).\n\nSenal: orina clara = bien hidratado. Orina amarilla oscura = toma mas.\n\nTu meta es 4L.'},
  ],

  faqLookup(normText) {
    for (const item of this.faq) {
      for (const p of item.patterns) {
        if (normText.includes(p)) {
          return typeof item.response === 'function' ? item.response() : item.response;
        }
      }
    }
    // Also try word-overlap match for loose queries
    const words = normText.split(/\s+/).filter(w => w.length > 3);
    let best = null, bestScore = 0;
    for (const item of this.faq) {
      for (const p of item.patterns) {
        const pw = p.split(/\s+/);
        let score = 0;
        for (const w of words) if (pw.some(x => x.includes(w) || w.includes(x))) score++;
        if (score >= 2 && score > bestScore) { bestScore = score; best = item; }
      }
    }
    if (best) return typeof best.response === 'function' ? best.response() : best.response;
    return null;
  },

  // ===== EXECUTE COMMAND =====
  execute(intent) {
    const now = new Date(), dow = now.getDay(), st = getDay();
    let response = '', action = null;

    switch (intent.intent) {

      case 'greeting': {
        const h = now.getHours();
        const greet = h < 12 ? 'Buenos dias' : h < 18 ? 'Buenas tardes' : 'Buenas noches';
        const sch = SCHED[dow];
        response = `${greet}! Soy Libra, tu asistente. `;
        if (sch.g) {
          const r = sch.g === 'A' ? RUT_A : RUT_B;
          response += `Hoy toca ${r.name}. `;
        } else {
          response += 'Hoy es dia de descanso. ';
        }
        const meals = Object.values(st.meals).filter(Boolean).length;
        response += `Llevas ${meals}/6 comidas y ${(st.water/1000).toFixed(1)}L agua. Que necesitas?`;
        break;
      }

      case 'help':
        response = `Puedo ayudarte con TODO en la app:\n\n` +
          `**Comidas:** "ya desayune", "marcar almuerzo", "puedo comer pizza?"\n` +
          `**Agua:** "tome 500ml", "tome 1 litro", "un vaso de agua"\n` +
          `**Peso:** "peso 190 libras", "cuanto peso?"\n` +
          `**Gym:** "que ejercicio toca?", "como se hace hip thrust?"\n` +
          `**Calorias:** "cuantas calorias llevo?", "puedo comer helado?"\n` +
          `**Metas:** "mi meta es 175 libras", "como voy?"\n` +
          `**Suplementos:** "agrega creatina", "para que sirve el magnesio?"\n` +
          `**Manana:** "que toca manana?", "que llevo?"\n` +
          `**Perfil:** "tengo 29 anos", "mido 175 cm"\n` +
          `**Navegacion:** "ir a gym", "abre progreso"\n` +
          `**Comida parcial:** "solo comi 2 tortillas", "no me comi todo"\n` +
          `**Racha:** "mi racha", "mis puntos", "mis logros"\n` +
          `**Y mas!** Solo dime que necesitas.`;
        break;

      case 'log_weight': {
        if (!intent.weight) {
          response = 'Cuanto pesas? Dime el numero en libras. Ej: "peso 190 libras"';
          this.context.awaitingConfirm = 'weight';
          break;
        }
        const ws = getWeights();
        ws.unshift({ date: dk(), weight: intent.weight });
        const seen = new Set();
        saveWeights(ws.filter(w => { if (seen.has(w.date)) return false; seen.add(w.date); return true; }));
        const gg = getGoals();
        if (!gg.startWeight) { gg.startWeight = intent.weight; saveGoals(gg); }
        const prev = ws.length > 1 ? ws[1].weight : null;
        response = `Peso registrado: **${intent.weight} lbs**`;
        if (prev) {
          const diff = intent.weight - prev;
          response += diff < 0 ? ` (${diff.toFixed(1)} lbs desde ultimo registro!)` :
            diff > 0 ? ` (+${diff.toFixed(1)} lbs. Revisa la dieta.)` : ' (igual que antes)';
        }
        if (gg.targetWeight) {
          const left = intent.weight - gg.targetWeight;
          response += left > 0 ? `\nTe faltan ${left.toFixed(1)} lbs para tu meta de ${gg.targetWeight}.` :
            `\nYa estas en/debajo de tu meta! Meta: ${gg.targetWeight} lbs.`;
        }
        action = 'refresh';
        break;
      }

      case 'log_water': {
        st.water = Math.max(0, st.water + intent.ml);
        saveDay(st);
        const pct = Math.min(100, Math.round(st.water / 4000 * 100));
        response = `+${intent.ml}ml de agua. Total: **${(st.water/1000).toFixed(1)}L** (${pct}% de meta)`;
        if (st.water >= 4000) response += '\n4 litros cumplidos! Excelente!';
        else response += `\nFaltan ${((4000 - st.water)/1000).toFixed(1)}L`;
        action = 'refresh';
        break;
      }

      case 'partial_meal': {
        // User ate only part of a meal
        const origText = intent.originalText || '';
        const nn = this.norm(origText);

        // Try to figure out what they ate
        let partialCal = 0;
        let partialDesc = '';

        // Search food database for what they mentioned
        const foodDesc = intent.foodDesc || '';
        const foodResults = searchFood(foodDesc);

        // Common partial items with calorie estimates
        const partialMap = {
          'tortilla': 75, 'arepa': 75, 'huevo': 72, 'clara': 17, 'pan': 80,
          'arroz': 205, 'cafe': 5, 'te': 5, 'leche': 60, 'fruta': 90,
          'manzana': 95, 'pera': 100, 'banana': 105, 'yogurt': 120,
          'almendra': 7, 'nuez': 20, 'taza': 205
        };

        const qty = intent.qty || 1;
        let matched = false;

        // Check for "la mitad" / "medio" - half of the full meal
        if (nn.includes('mitad') || nn.includes('medio') || nn.includes('media')) {
          const fullMeal = getMeal(mealKey, dow);
          partialCal = Math.round(fullMeal.cal / 2);
          partialDesc = `la mitad de ${fullMeal.label}`;
          matched = true;
        }

        // Try to match specific partial food items
        if (!matched) {
          for (const [food, calPer] of Object.entries(partialMap)) {
            if (nn.includes(food)) {
              partialCal = qty * calPer;
              partialDesc = `${qty} ${food}${qty > 1 ? 's' : ''}`;
              matched = true;
              break;
            }
          }
        }

        // Try food database
        if (!matched && foodResults.length) {
          const f = foodResults[0];
          partialCal = qty > 0 ? Math.round(f.c * Math.min(qty, 10)) : f.c;
          partialDesc = `${qty > 0 ? qty + ' ' : ''}${f.n}`;
          matched = true;
        }

        // Detect meal context
        let mealKey = intent.meal;
        if (!mealKey) {
          const h = now.getHours();
          if (h < 10) mealKey = 'desayuno';
          else if (h < 12) mealKey = 'merienda1';
          else if (h < 15) mealKey = 'almuerzo';
          else if (h < 18) mealKey = 'merienda2';
          else mealKey = 'cena';
        }

        if (matched && partialCal > 0) {
          // Mark meal as done (partial counts)
          st.meals[mealKey] = true;
          // Add as extra with adjusted calories (subtract full meal cal, add partial)
          const fullMeal = getMeal(mealKey, dow);
          const diff = partialCal - fullMeal.cal;
          if (diff !== 0) {
            st.extras = st.extras || [];
            st.extras.push({ n: `${fullMeal.label} parcial: ${partialDesc}`, c: diff });
          }
          saveDay(st);

          response = `Entendido! Registre ${fullMeal.label} como parcial:\n`;
          response += `**Comiste:** ${partialDesc} (~${partialCal} cal)\n`;
          response += `**Comida completa era:** ${fullMeal.desc} (~${fullMeal.cal} cal)\n`;
          response += `**Diferencia:** ${diff > 0 ? '+' : ''}${diff} cal\n`;
          response += `\nTotal hoy: ${todayCal(st, dow)} cal`;

          // Smart advice
          if (partialCal < fullMeal.cal * 0.5) {
            response += '\n\n⚠️ Comiste menos de la mitad. Intenta comer porciones completas para mantener el metabolismo activo.';
          }
          action = 'refresh';
        } else {
          // Couldn't determine food, ask for details
          const mealLabel = getMeal(mealKey, dow).label;
          response = `Entiendo que no comiste todo el ${mealLabel}. Que fue exactamente lo que comiste? `;
          response += `Ej: "solo 2 tortillas", "la mitad del arroz", "solo el huevo"`;
          this.context.awaitingConfirm = 'partial_detail';
          this.context.lastEntity = mealKey;
        }
        break;
      }

      case 'ask_streak': {
        const streak = Streaks.getCurrent();
        const best = Streaks.getBest();
        const lv = Streaks.getLevel();
        const title = Streaks.getLevelTitle();
        const xp = Streaks.getXP();
        const lvProg = Streaks.getLevelProgress();
        const badges = Streaks.getBadges();
        const today = getDayScore();

        response = `**Tu Racha & Nivel:**\n\n`;
        response += `🔥 Racha actual: **${streak} dias**\n`;
        response += `🏆 Mejor racha: **${best} dias**\n`;
        response += `⭐ Nivel ${lv}: **${title}**\n`;
        response += `✨ XP: ${xp} (${lvProg.current}/${lvProg.needed} para nivel ${lv + 1})\n`;
        response += `📊 Hoy: ${today.pct}% completado\n`;

        if (badges.length) {
          response += `\n**Insignias:**\n`;
          badges.forEach(b => { response += `${b.icon} ${b.name} - ${b.desc}\n`; });
        }

        response += `\n${Streaks.getMotivation()}`;
        break;
      }

      case 'log_meal': {
        if (!intent.meal) {
          response = 'Cual comida? Desayuno, merienda 1, almuerzo, merienda 2, cena, o fibra?';
          this.context.awaitingConfirm = 'meal';
          break;
        }
        st.meals[intent.meal] = !st.meals[intent.meal];
        saveDay(st);
        const m = getMeal(intent.meal, dow);
        const done = st.meals[intent.meal];
        response = done ? `${m.label} marcado! (+${m.cal} cal)` : `${m.label} desmarcado.`;
        const totalMeals = Object.values(st.meals).filter(Boolean).length;
        response += `\n${totalMeals}/6 comidas hoy.`;
        if (totalMeals === 6) response += ' Todas las comidas completas! Excelente!';

        // Streak encouragement
        const curStreak = Streaks.getCurrent();
        if (curStreak > 0 && totalMeals >= 4) {
          response += `\n🔥 Racha: ${curStreak} dias. No la pierdas!`;
        }
        action = 'refresh';
        break;
      }

      case 'ask_food': {
        if (!intent.food) {
          response = 'Que comida quieres consultar? Ej: "puedo comer pizza?"';
          break;
        }
        const results = searchFood(intent.food);
        if (!results.length) {
          response = `No encontre "${intent.food}" en mi base de datos. Intenta: pizza, pollo, arroz, helado, cerveza...`;
          break;
        }
        response = '';
        results.slice(0, 3).forEach(f => {
          const r = canIEat(f.k, st, dow);
          if (!r) return;
          const icon = r.ans === 'go' ? '✅' : r.ans === 'no' ? '🚫' : '⚠️';
          response += `${icon} **${f.n}** (${f.c} cal)\n`;
          response += `Proteina: ${f.p}g | Carbs: ${f.cb}g | Grasa: ${f.f}g\n`;
          response += `${r.msg}\n\n`;
        });
        break;
      }

      case 'add_food': {
        const results = searchFood(intent.food);
        if (results.length) {
          const f = results[0];
          st.extras = st.extras || [];
          st.extras.push({ n: f.n, c: f.c });
          saveDay(st);
          response = `Agregado: **${f.n}** (+${f.c} cal). Total hoy: ${todayCal(st, dow)} cal.`;
          action = 'refresh';
        } else {
          response = `No encontre "${intent.food}". Quieres que busque otra cosa?`;
        }
        break;
      }

      case 'ask_plan': {
        if (intent.meal) {
          const m = getMeal(intent.meal, dow);
          response = `**${m.label}** (${m.time})\n${m.desc}\n~${m.cal} cal`;
          if (m.alts.length) response += `\n\nAlternativas:\n${m.alts.map(a => '→ ' + a).join('\n')}`;
        } else {
          response = `Plan de hoy (${DAY_NAMES[dow]}):\n\n`;
          MEAL_ORDER.forEach(k => {
            const m = getMeal(k, dow);
            const done = st.meals[k];
            response += `${done ? '✅' : '⬜'} **${m.time}** ${m.label}: ${m.desc} (~${m.cal} cal)\n`;
          });
          const cal = todayCal(st, dow), bud = calBudget();
          response += `\nTotal plan: ~${MEAL_ORDER.reduce((s, k) => s + getMeal(k, dow).cal, 0)} cal`;
          response += `\nPresupuesto: ${bud.target} cal`;
        }
        break;
      }

      case 'tomorrow': {
        const tp = Engine.tomorrowPreview();
        response = `**${tp.dayName}:**\n\n`;
        if (tp.ex) {
          response += `🏋️ ${tp.ex.name} (${tp.ex.time})\n`;
          tp.ex.ex.forEach(e => {
            const g = EX[e.id], h = getExHist(e.id), lw = h.length ? h[0].weight : g.dw;
            response += `  → ${g.name}: ${e.s}x${e.r} (${lw}lbs)\n`;
          });
        } else {
          response += `😴 Dia de descanso\n`;
        }
        response += `\n🍽️ Comidas:\n`;
        tp.meals.forEach(m => { response += `  ${m.time} ${m.label}: ${m.desc}\n`; });
        if (tp.cardio) response += `\n🏃 Cardio ${tp.cardio === 'opt' ? 'opcional' : '6-7 PM'}`;
        if (tp.batch) response += `\n🍳 Batch: ${tp.batch.t}`;
        response += `\n\n🎒 **Lleva:**\n`;
        tp.bring.forEach(b => { response += `  📦 ${b}\n`; });
        break;
      }

      case 'ask_exercise': {
        if (intent.exercise) {
          const g = EX[intent.exercise];
          response = `**${g.name}** (${g.muscle})\n\n`;
          response += `**Como hacerlo:**\n${g.how}\n\n`;
          response += `**Tip:** ${g.tip}\n`;
          response += `**Errores:** ${g.errors.split('|').map(e => e.trim()).join(', ')}\n`;
          response += `**Musculos:** ${g.muscles}\n`;
          response += `**Respiracion:** ${g.breath}\n`;
          response += `**Maquina SmartFit:** ${g.machine}`;
        } else {
          const sch = SCHED[dow];
          if (sch.g) {
            const r = sch.g === 'A' ? RUT_A : RUT_B;
            response = `Hoy: **${r.name}** (${r.time})\n\n`;
            r.ex.forEach((e, i) => {
              const g = EX[e.id], h = getExHist(e.id), lw = h.length ? h[0].weight : g.dw;
              const log = st.exLog[e.id];
              const done = log?.sets?.every(s => s.done);
              response += `${done ? '✅' : '⬜'} ${i+1}. ${g.name} - ${e.s}x${e.r} (${lw}lbs)\n`;
            });
          } else {
            response = 'Hoy es dia de descanso. No hay rutina programada.';
          }
        }
        break;
      }

      case 'log_exercise': {
        if (intent.exercise && intent.weight) {
          const h = getExHist(intent.exercise);
          h.unshift({ date: dk(), weight: intent.weight });
          saveExHist(intent.exercise, h.slice(0, 100));
          const g = EX[intent.exercise];
          const an = Engine.exAnalysis(intent.exercise, intent.weight);
          response = `**${g.name}**: ${intent.weight} lbs registrado.`;
          an.out.forEach(w => { response += `\n${w.i} ${w.m}`; });
          action = 'refresh';
        } else {
          response = 'Dime el ejercicio y el peso. Ej: "hice hip thrust con 50 libras"';
        }
        break;
      }

      case 'complete_routine': {
        const sch = SCHED[dow];
        if (!sch.g) { response = 'Hoy es descanso, no hay rutina.'; break; }
        const r = sch.g === 'A' ? RUT_A : RUT_B;
        r.ex.forEach(e => {
          if (!st.exLog[e.id]) {
            const h = getExHist(e.id), lw = h.length ? h[0].weight : EX[e.id].dw;
            st.exLog[e.id] = { w: lw, sets: Array.from({ length: e.s }, () => ({ done: true })) };
          } else {
            st.exLog[e.id].sets.forEach(s => s.done = true);
          }
        });
        saveDay(st);
        response = `Rutina ${sch.g} completada! Todos los ejercicios marcados.`;
        action = 'refresh';
        break;
      }

      case 'ask_progress': {
        const w = getWeights(), g = getGoals(), ins = Engine.bodyAnalysis();
        if (!w.length) {
          response = 'No tienes peso registrado. Dime tu peso: "peso 190 libras"';
          break;
        }
        response = `**Tu progreso:**\n`;
        response += `Peso actual: **${w[0].weight} lbs** (${fmtDate(w[0].date)})\n`;
        if (g.startWeight) response += `Peso inicial: ${g.startWeight} lbs\n`;
        if (g.targetWeight) {
          const lost = g.startWeight ? g.startWeight - w[0].weight : 0;
          response += `Meta: ${g.targetWeight} lbs\n`;
          if (lost > 0) response += `Has bajado: ${lost.toFixed(1)} lbs\n`;
          response += `Te faltan: ${(w[0].weight - g.targetWeight).toFixed(1)} lbs\n`;
        }
        if (g.targetDate) {
          const left = dBetween(now, pk(g.targetDate));
          response += `Dias restantes: ${left}\n`;
        }
        ins.forEach(i => { response += `\n${i.i} ${i.m}`; });
        break;
      }

      case 'ask_calories': {
        const cal = todayCal(st, dow), bud = calBudget();
        response = `**Calorias hoy:**\n`;
        response += `Consumidas: **${cal}** / ${bud.target} cal\n`;
        response += `Restante: **${Math.max(0, bud.target - cal)}** cal\n`;
        response += `Limite: ${bud.max} cal\n\n`;
        response += `Desglose:\n`;
        MEAL_ORDER.forEach(k => {
          const m = getMeal(k, dow), done = st.meals[k];
          response += `${done ? '✅' : '⬜'} ${m.label}: ${m.cal} cal\n`;
        });
        if ((st.extras || []).length) {
          response += `\nExtras:\n`;
          st.extras.forEach(e => { response += `  ${e.n}: ${e.c} cal\n`; });
        }
        break;
      }

      case 'modify_goal': {
        if (!intent.target) {
          response = 'Cual es tu meta en libras? Ej: "mi meta es 175 libras"';
          this.context.awaitingConfirm = 'goal';
          break;
        }
        const g = getGoals();
        g.targetWeight = intent.target;
        saveGoals(g);
        // Also update profile
        const p = getProfile();
        p.wGoal = intent.target;
        saveProfile(p);
        response = `Meta actualizada: **${intent.target} lbs**`;
        const w = getWeights();
        if (w.length) {
          response += `\nPeso actual: ${w[0].weight} lbs. Te faltan ${(w[0].weight - intent.target).toFixed(1)} lbs.`;
        }
        action = 'refresh';
        break;
      }

      case 'modify_profile': {
        if (!intent.field || !intent.value) {
          response = 'Que quieres actualizar? Ej: "tengo 29 anos", "mido 175 cm"';
          break;
        }
        const p = getProfile();
        p[intent.field] = intent.value;
        saveProfile(p);
        const labels = { age: 'Edad', height: 'Altura', name: 'Nombre' };
        response = `${labels[intent.field] || intent.field} actualizado: **${intent.value}**${intent.field === 'height' ? ' cm' : intent.field === 'age' ? ' anos' : ''}`;
        action = 'refresh';
        break;
      }

      case 'add_supplement': {
        if (!intent.supId) {
          response = 'Cual suplemento? creatina, proteina, magnesio, omega 3, vitamina D, fibra, multivitaminico, cafeina, bcaa';
          break;
        }
        const ms = getMySups();
        if (ms.includes(intent.supId)) {
          response = `Ya tienes ${intent.supId} en tu rutina.`;
        } else {
          ms.push(intent.supId);
          saveMySups(ms);
          const sup = SUPS.find(s => s.id === intent.supId);
          response = `**${sup.name}** agregado a tu rutina!\n${sup.schedule ? `Horario: ${sup.schedule.time} - ${sup.schedule.amount}` : ''}`;
          action = 'refresh';
        }
        break;
      }

      case 'remove_supplement': {
        if (!intent.supId) {
          response = 'Cual suplemento quieres quitar?';
          break;
        }
        const ms2 = getMySups().filter(x => x !== intent.supId);
        saveMySups(ms2);
        response = `${intent.supId} removido de tu rutina.`;
        action = 'refresh';
        break;
      }

      case 'ask_supplements': {
        const ms = getMySups();
        response = `**Tus suplementos:**\n`;
        if (ms.length) {
          SUPS.filter(s => ms.includes(s.id)).forEach(s => {
            response += `${s.icon} ${s.name}${s.schedule ? ` (${s.schedule.time} - ${s.schedule.amount})` : ''}\n`;
          });
        } else {
          response += 'No tienes suplementos activos.\n';
        }
        response += `\n**Recomendados:** creatina, fibra, multivitaminico (basicos para tu plan).`;
        break;
      }

      case 'ask_supplement_info': {
        const sup = SUPS.find(s => s.id === intent.supId);
        if (!sup) {
          response = 'No encontre ese suplemento. Disponibles: creatina, proteina, magnesio, omega 3, vitamina D, fibra, multi, cafeina, bcaa';
          break;
        }
        response = `${sup.icon} **${sup.name}**\n\n`;
        response += `**Para ti:** ${sup.forYou}\n\n`;
        response += `**Beneficios:** ${sup.ben.join(', ')}\n\n`;
        response += `**Dosis:** ${sup.dose}\n`;
        response += `**Cuando:** ${sup.when}\n`;
        response += `**Efectos adversos:** ${sup.side}\n`;
        response += `**Marcas:** ${sup.brands}`;
        break;
      }

      case 'ask_cardio': {
        response = '**Opciones de cardio:**\n\n';
        CARDIO.forEach(c => {
          response += `${c.icon} **${c.name}** - ${c.dur}\n${c.det}\n~${c.cal} cal\n\n`;
        });
        const sch = SCHED[dow];
        response += sch.c === true ? 'Hoy toca cardio 6-7 PM.' :
          sch.c === 'opt' ? 'Hoy cardio es opcional.' : 'Hoy no toca cardio.';
        break;
      }

      case 'complete_cardio': {
        st.cardioDone = true;
        if (!st.cardioId) st.cardioId = 'caminadora';
        saveDay(st);
        const c = CARDIO.find(x => x.id === st.cardioId) || CARDIO[0];
        response = `Cardio completado! ~${c.cal} cal quemadas. Buen trabajo!`;
        action = 'refresh';
        break;
      }

      case 'toggle_setting': {
        if (!intent.setting) {
          response = 'Cual notificacion? agua, comida, gym, dormir, briefing';
          break;
        }
        const s = getSettings();
        s[intent.setting] = intent.enable;
        saveSettings(s);
        response = `${intent.setting}: ${intent.enable ? 'ACTIVADO' : 'DESACTIVADO'}`;
        action = 'refresh';
        break;
      }

      case 'motivation': {
        const tips = [
          'Cada dia que entrenas es un dia que tu futuro yo te agradece. 10 minutos es mejor que 0.',
          'No necesitas motivacion, necesitas disciplina. La motivacion va y viene, la disciplina te cambia.',
          'Piensa en como te sentiras DESPUES de entrenar. Nunca te arrepientes de haber ido.',
          'Tu cuerpo puede aguantar casi todo. Es tu mente la que necesitas convencer.',
          'El dolor de la disciplina pesa gramos. El dolor del arrepentimiento pesa toneladas.',
          'No estas haciendo dieta. Estas construyendo un nuevo estilo de vida.',
          'Faltan pocos dias para tu meta. Cada dia cuenta. No lo desperdicies.',
          'El gimnasio no te pide que seas perfecto. Solo que aparezcas.',
        ];
        const w = getWeights(), g = getGoals();
        response = tips[Math.floor(Math.random() * tips.length)];
        if (w.length && g.startWeight) {
          const lost = g.startWeight - w[0].weight;
          if (lost > 0) response += `\n\nYa has bajado ${lost.toFixed(1)} lbs. No desperdicies ese progreso!`;
        }
        const left = g.targetDate ? dBetween(now, pk(g.targetDate)) : null;
        if (left && left > 0) response += `\nFaltan ${left} dias para tu meta. TU PUEDES!`;
        break;
      }

      case 'sleep': {
        if (intent.hours) {
          response = intent.hours >= 7 ? `${intent.hours} horas es perfecto! El descanso es cuando tu cuerpo se recupera y quema grasa.` :
            intent.hours >= 5 ? `${intent.hours} horas es poco. Intenta dormir 7-8h. Te recomiendo magnesio glicinato antes de dormir.` :
            `${intent.hours} horas es muy poco! Tu recuperacion muscular sufre mucho. Prioriza el sueno.`;
          if (intent.hours < 7 && !getMySups().includes('magnesio')) {
            response += '\n\nQuieres que agregue magnesio a tus suplementos? Ayuda mucho con el sueno.';
            this.context.awaitingConfirm = 'add_magnesio';
          }
        } else {
          response = 'El sueno es CLAVE para quemar grasa y ganar musculo. Meta: 7-8 horas. Cama a las 10 PM.';
          if (!getMySups().includes('magnesio')) {
            response += '\nMagnesio glicinato antes de dormir te ayuda a dormir mejor y mas profundo.';
          }
        }
        break;
      }

      case 'batch_cooking': {
        const bc = BATCH[dow];
        if (bc) {
          response = `**Hoy toca cocinar:**\n${bc.t}\nPara: ${bc.p}\nTiempo: ${bc.e}`;
        } else {
          response = 'Hoy no toca batch cooking.\n\n**Proximos:**\n';
          for (const [d, b] of Object.entries(BATCH)) {
            response += `${DAY_NAMES[d]}: ${b.t}\n`;
          }
        }
        break;
      }

      case 'navigate': {
        if (intent.page !== null && intent.page !== undefined) {
          response = `Abriendo ${['Inicio', 'Comida', 'Gym', 'Progreso', 'Perfil'][intent.page]}...`;
          action = { type: 'navigate', page: intent.page };
        } else {
          response = 'A donde quieres ir? Hoy, Comida, Gym, Progreso, o Perfil?';
        }
        break;
      }

      case 'reset_day': {
        this.context.awaitingConfirm = 'reset';
        response = 'Seguro que quieres reiniciar los datos de hoy? Responde "si" para confirmar.';
        break;
      }

      case 'ask_today': {
        const sch = SCHED[dow];
        response = `**Hoy (${DAY_NAMES[dow]}):**\n\n`;
        if (sch.g) {
          const r = sch.g === 'A' ? RUT_A : RUT_B;
          response += `🏋️ ${r.name} (${r.time})\n`;
        } else {
          response += `😴 ${dow === 0 ? 'Descanso total' : 'Descanso activo'}\n`;
        }
        if (sch.c === true) response += `🏃 Cardio 6-7 PM\n`;
        response += `\n🍽️ Comidas:\n`;
        MEAL_ORDER.forEach(k => {
          const m = getMeal(k, dow), done = st.meals[k];
          response += `${done ? '✅' : '⬜'} ${m.time} ${m.label}\n`;
        });
        response += `\n💧 Agua: ${(st.water/1000).toFixed(1)} / 4L`;
        break;
      }

      case 'ask_gym_today': {
        const sch = SCHED[dow];
        if (!sch.g) { response = 'Hoy es dia de descanso. Nada de gym!'; break; }
        const r = sch.g === 'A' ? RUT_A : RUT_B;
        response = `**${r.name}** (${r.time})\n\n`;
        r.ex.forEach((e, i) => {
          const g2 = EX[e.id], h = getExHist(e.id), lw = h.length ? h[0].weight : g2.dw;
          const log = st.exLog[e.id];
          const done = log?.sets?.every(s => s.done);
          response += `${done ? '✅' : '⬜'} ${i+1}. ${g2.name}: ${e.s}x${e.r} (${lw}lbs)\n`;
        });
        break;
      }

      case 'ask_meal_now': {
        const h = now.getHours();
        let key;
        if (h < 9) key = 'desayuno';
        else if (h < 11) key = 'merienda1';
        else if (h < 14) key = 'almuerzo';
        else if (h < 18) key = 'merienda2';
        else if (h < 21) key = 'cena';
        else key = 'fibra';
        const m = getMeal(key, dow);
        response = `**${m.label}** (${m.time})\n${m.desc}\n~${m.cal} cal`;
        if (m.alts?.length) response += `\n\nAlternativas:\n${m.alts.map(a => '→ ' + a).join('\n')}`;
        break;
      }

      case 'ask_water': {
        const pct = Math.min(100, Math.round(st.water / 4000 * 100));
        response = `💧 Llevas **${(st.water/1000).toFixed(1)}L** de 4L (${pct}%).\n`;
        if (st.water >= 4000) response += 'Meta cumplida! Brutal.';
        else response += `Faltan ${((4000-st.water)/1000).toFixed(1)}L. Tomate un vaso YA.`;
        break;
      }

      case 'tip': {
        const tips = [
          '💧 Toma un vaso de agua AL DESPERTAR. Activa metabolismo y te quita la sed acumulada.',
          '🥩 Come proteina en CADA comida. Te llena mas y preserva musculo.',
          '😴 Dormir <7h dispara cortisol y hambre al dia siguiente. Prioriza el sueno.',
          '🏋️ Progresion gradual > intensidad maxima. Sube 2-5 lbs por semana.',
          '📱 No uses el celular entre series. Descansa completo 45-60 seg.',
          '🍽️ Mastica lento. Tardas 15 min en sentir saciedad.',
          '☕ Cafe negro antes del gym = mas fuerza (cafeina activa el sistema).',
          '🥗 Si no comes vegetales, TOMA FIBRA (psyllium). Sin excusa.',
          '⏰ Entrena misma hora cada dia. Tu cuerpo se adapta mejor.',
          '💪 Calidad > Cantidad. 3 series a muerte > 5 flojas.',
          '🧠 Pesarse en la MISMA balanza, misma hora, mismo dia de la semana.',
          '🚫 No existe "pecado del cheat day". Existe el DIA libre planeado.',
        ];
        response = tips[Math.floor(Math.random() * tips.length)];
        break;
      }

      case 'faq': {
        response = intent.answer;
        break;
      }

      default:
        // Check if we're awaiting confirmation
        if (this.context.awaitingConfirm) {
          return this.handleConfirm(intent);
        }
        response = 'No estoy seguro que preguntaste. Puedo ayudarte con:\n\n' +
          '• 🍽️ Registrar comidas ("ya desayune")\n' +
          '• 💧 Tomar agua ("tome 500 ml")\n' +
          '• 🏋️ Ejercicios ("que toca de gym?")\n' +
          '• 📊 Ver tu progreso ("como voy?")\n' +
          '• 🔥 Calorias ("cuanta agua llevo?")\n' +
          '• 💡 Tips de fitness ("dame un consejo")\n' +
          '• 💪 Motivarte ("dame animo")\n\n' +
          'Intenta algo como: "que como hoy?", "cuanta agua llevo?", o "cuanta proteina necesito?"';
    }

    return { response, action };
  },

  // ===== HANDLE CONFIRMATIONS =====
  handleConfirm(intent) {
    const n = this.norm(intent.originalText || '');
    const yes = this.fuzzy(n, ['si', 'ok', 'dale', 'claro', 'confirma', 'hazlo', 'adelante', 'yes']);
    const ctx = this.context.awaitingConfirm;
    this.context.awaitingConfirm = null;

    if (ctx === 'reset' && yes) {
      S.d('d_' + dk());
      return { response: 'Dia reiniciado. Todo en cero.', action: 'refresh' };
    }
    if (ctx === 'add_magnesio' && yes) {
      const ms = getMySups();
      if (!ms.includes('magnesio')) { ms.push('magnesio'); saveMySups(ms); }
      return { response: 'Magnesio agregado! Tomalo 30-60 min antes de dormir (400mg).', action: 'refresh' };
    }
    if (ctx === 'weight') {
      const nums = this.nums(intent.originalText || '');
      const w = nums.find(x => x >= 50 && x <= 500);
      if (w) return this.execute({ intent: 'log_weight', weight: w });
    }
    if (ctx === 'meal') {
      const detected = this.detectIntent(intent.originalText || '');
      if (detected.intent === 'log_meal') return this.execute(detected);
    }
    if (ctx === 'goal') {
      const nums = this.nums(intent.originalText || '');
      const t = nums.find(x => x >= 50 && x <= 500);
      if (t) return this.execute({ intent: 'modify_goal', target: t });
    }
    if (ctx === 'partial_detail') {
      const mealKey = this.context.lastEntity;
      return this.execute({ intent: 'partial_meal', meal: mealKey, foodDesc: intent.originalText || '', qty: this.nums(intent.originalText || '')[0] || 1, originalText: intent.originalText });
    }

    return { response: 'Entendido. Que mas necesitas?', action: null };
  },

  // ===== MAIN CHAT FUNCTION =====
  chat(text) {
    if (!text || !text.trim()) return null;

    // Save to history
    this.history.push({ role: 'user', text, time: new Date().toISOString() });

    // Check awaiting confirmation first
    if (this.context.awaitingConfirm) {
      const result = this.handleConfirm({ ...this.detectIntent(text), originalText: text });
      this.history.push({ role: 'libra', text: result.response, time: new Date().toISOString() });
      if (this.history.length > this.maxHistory) this.history = this.history.slice(-this.maxHistory);
      return result;
    }

    // Detect intent
    const intent = this.detectIntent(text);
    intent.originalText = text;

    // Execute
    const result = this.execute(intent);

    // Save response to history
    this.history.push({ role: 'libra', text: result.response, time: new Date().toISOString() });

    // Trim history
    if (this.history.length > this.maxHistory) this.history = this.history.slice(-this.maxHistory);

    // Update context
    this.context.lastIntent = intent.intent;
    this.context.topic = intent.intent;

    return result;
  }
};
