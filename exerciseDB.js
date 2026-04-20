// ================================================================
//  LIBRA FIT - EXERCISE DATABASE (Hevy-inspired)
// ================================================================
//  Base de datos completa de ejercicios con metadatos para motor
//  de recomendaciones y generador automatico de rutinas.
//  Vanilla JS. Se carga via <script src="exerciseDB.js">.
// ================================================================

(function (global) {
  'use strict';

  // ---------- Helpers de construccion (reducen verbosidad) ----------
  function mk(o) {
    // Defaults sensatos para cualquier ejercicio
    return Object.assign({
      category: 'compound',
      secondaryMuscles: [],
      equipment: [],
      equipmentType: 'gym',
      difficulty: 'intermedio',
      force: 'push',
      mechanic: 'compound',
      type: 'strength',
      recovery: 48,
      calPerMin: 6,
      defaultSets: 3,
      defaultReps: '8-12',
      defaultRest: 90,
      defaultWeight: null,
      progression: 'weight',
      instructions: [],
      tips: [],
      commonErrors: [],
      variations: [],
      contraindications: [],
      goalFit: { fatLoss: 5, muscleGain: 7, strength: 6, endurance: 4, tone: 6 }
    }, o);
  }

  // ================================================================
  //  EXERCISE_DB - ~160 ejercicios
  // ================================================================
  var EXERCISE_DB = [

    // =========================================================
    //  PECHO (18)
    // =========================================================
    mk({
      id: 'press_banca', name: 'Press de Banca', nameEn: 'Barbell Bench Press',
      primaryMuscle: 'pectoral', secondaryMuscles: ['triceps', 'deltoides_anterior'],
      muscleGroup: 'pecho', equipment: ['barra', 'banco'], equipmentType: 'gym',
      difficulty: 'intermedio', force: 'push', calPerMin: 7, defaultSets: 4, defaultRest: 120,
      instructions: [
        '1. Acuestate en el banco con los pies firmes en el piso',
        '2. Agarra la barra un poco mas ancho que los hombros',
        '3. Baja la barra al pecho controlado (2s)',
        '4. Empuja hacia arriba extendiendo los brazos'
      ],
      tips: ['Manten los hombros retraidos y el pecho elevado', 'No arquees excesivamente', 'Controla la bajada'],
      commonErrors: ['Rebotar la barra en el pecho', 'Despegar los pies del piso', 'Codos muy abiertos'],
      variations: ['press_banca_inclinado', 'press_banca_declinado', 'press_mancuernas'],
      contraindications: ['lesion hombro', 'lesion muneca'],
      goalFit: { fatLoss: 6, muscleGain: 10, strength: 10, endurance: 3, tone: 7 }
    }),
    mk({
      id: 'press_banca_inclinado', name: 'Press Inclinado con Barra', nameEn: 'Incline Bench Press',
      primaryMuscle: 'pectoral_superior', secondaryMuscles: ['deltoides_anterior', 'triceps'],
      muscleGroup: 'pecho', equipment: ['barra', 'banco_inclinado'], defaultRest: 90,
      instructions: ['1. Inclina banco a 30-45 grados', '2. Agarra barra a ancho de hombros', '3. Baja a la clavicula', '4. Empuja arriba'],
      tips: ['No pases de 45 grados (activa mas hombro)'],
      commonErrors: ['Inclinacion muy alta', 'Rebotar en el pecho'],
      goalFit: { fatLoss: 6, muscleGain: 10, strength: 9, endurance: 3, tone: 7 }
    }),
    mk({
      id: 'press_banca_declinado', name: 'Press Declinado con Barra', nameEn: 'Decline Bench Press',
      primaryMuscle: 'pectoral_inferior', secondaryMuscles: ['triceps'],
      muscleGroup: 'pecho', equipment: ['barra', 'banco_declinado'],
      instructions: ['1. Banco en declinacion, pies fijos', '2. Baja barra al pecho inferior', '3. Empuja arriba'],
      tips: ['Buena opcion si tienes molestia de hombro en banca plana'],
      goalFit: { fatLoss: 6, muscleGain: 9, strength: 9, endurance: 3, tone: 7 }
    }),
    mk({
      id: 'press_mancuernas', name: 'Press con Mancuernas', nameEn: 'Dumbbell Bench Press',
      primaryMuscle: 'pectoral', secondaryMuscles: ['triceps', 'deltoides_anterior'],
      muscleGroup: 'pecho', equipment: ['mancuernas', 'banco'], equipmentType: 'casa_avanzado',
      defaultSets: 4,
      instructions: ['1. Sienta con mancuernas en muslos', '2. Acuesta subiendo las mancuernas', '3. Baja a nivel del pecho', '4. Empuja'],
      tips: ['Mayor rango de movimiento que barra'],
      goalFit: { fatLoss: 6, muscleGain: 10, strength: 8, endurance: 4, tone: 8 }
    }),
    mk({
      id: 'press_inclinado_mancuernas', name: 'Press Inclinado con Mancuernas', nameEn: 'Incline Dumbbell Press',
      primaryMuscle: 'pectoral_superior', secondaryMuscles: ['deltoides_anterior', 'triceps'],
      muscleGroup: 'pecho', equipment: ['mancuernas', 'banco_inclinado'], equipmentType: 'casa_avanzado',
      goalFit: { fatLoss: 6, muscleGain: 10, strength: 8, endurance: 4, tone: 8 }
    }),
    mk({
      id: 'press_maquina', name: 'Press en Maquina', nameEn: 'Machine Chest Press',
      primaryMuscle: 'pectoral', secondaryMuscles: ['triceps'],
      muscleGroup: 'pecho', equipment: ['maquina'], difficulty: 'principiante',
      tips: ['Ideal para principiantes - trayectoria fija'],
      goalFit: { fatLoss: 6, muscleGain: 9, strength: 7, endurance: 4, tone: 7 }
    }),
    mk({
      id: 'press_smith', name: 'Press en Smith', nameEn: 'Smith Machine Press',
      primaryMuscle: 'pectoral', secondaryMuscles: ['triceps', 'deltoides_anterior'],
      muscleGroup: 'pecho', equipment: ['smith', 'banco'], difficulty: 'principiante',
      goalFit: { fatLoss: 6, muscleGain: 8, strength: 7, endurance: 3, tone: 6 }
    }),
    mk({
      id: 'aperturas_mancuernas', name: 'Aperturas con Mancuernas', nameEn: 'Dumbbell Flyes',
      primaryMuscle: 'pectoral', secondaryMuscles: ['deltoides_anterior'],
      muscleGroup: 'pecho', equipment: ['mancuernas', 'banco'], equipmentType: 'casa_avanzado',
      category: 'isolation', mechanic: 'isolation', force: 'dynamic',
      defaultReps: '12-15', defaultRest: 60, calPerMin: 5,
      instructions: ['1. Acuesta con mancuernas sobre el pecho', '2. Baja en arco amplio con codos ligeramente flexionados', '3. Sube apretando el pecho'],
      tips: ['No bajes mas alla del torso', 'Enfoca la contraccion'],
      goalFit: { fatLoss: 5, muscleGain: 8, strength: 5, endurance: 4, tone: 8 }
    }),
    mk({
      id: 'aperturas_poleas', name: 'Cruce de Poleas', nameEn: 'Cable Crossover',
      primaryMuscle: 'pectoral', secondaryMuscles: ['deltoides_anterior'],
      muscleGroup: 'pecho', equipment: ['poleas'], category: 'isolation', mechanic: 'isolation',
      defaultReps: '12-15', defaultRest: 60, calPerMin: 5,
      goalFit: { fatLoss: 5, muscleGain: 8, strength: 4, endurance: 5, tone: 9 }
    }),
    mk({
      id: 'aperturas_maquina', name: 'Peck Deck / Aperturas Maquina', nameEn: 'Pec Deck',
      primaryMuscle: 'pectoral', muscleGroup: 'pecho', equipment: ['maquina'],
      category: 'isolation', mechanic: 'isolation', difficulty: 'principiante',
      defaultReps: '12-15', defaultRest: 60,
      goalFit: { fatLoss: 5, muscleGain: 8, strength: 4, endurance: 5, tone: 9 }
    }),
    mk({
      id: 'fondos_paralelas', name: 'Fondos en Paralelas (Pecho)', nameEn: 'Chest Dips',
      primaryMuscle: 'pectoral_inferior', secondaryMuscles: ['triceps', 'deltoides_anterior'],
      muscleGroup: 'pecho', equipment: ['paralelas'], equipmentType: 'gym',
      difficulty: 'avanzado', calPerMin: 8, defaultReps: '8-12', defaultRest: 90, defaultWeight: null,
      progression: 'reps',
      instructions: ['1. Sujetate en paralelas brazos extendidos', '2. Inclina torso adelante', '3. Baja hasta 90 grados', '4. Empuja arriba'],
      tips: ['Inclina el torso para enfatizar pecho', 'Torso recto enfatiza triceps'],
      goalFit: { fatLoss: 7, muscleGain: 9, strength: 9, endurance: 5, tone: 8 }
    }),
    mk({
      id: 'push_ups', name: 'Flexiones (Push Ups)', nameEn: 'Push Ups',
      primaryMuscle: 'pectoral', secondaryMuscles: ['triceps', 'deltoides_anterior', 'core'],
      muscleGroup: 'pecho', equipment: [], equipmentType: 'sin_equipo',
      difficulty: 'principiante', calPerMin: 7, defaultReps: '10-20', defaultRest: 45,
      progression: 'reps', defaultWeight: null,
      instructions: ['1. Plancha con manos al ancho de hombros', '2. Baja controlado hasta casi tocar piso', '3. Empuja arriba'],
      tips: ['Core contraido', 'Cuello neutro'],
      commonErrors: ['Cadera caida o muy alta', 'Codos disparados hacia afuera'],
      variations: ['push_ups_diamante', 'push_ups_declinados', 'push_ups_palmadas'],
      goalFit: { fatLoss: 7, muscleGain: 7, strength: 6, endurance: 8, tone: 8 }
    }),
    mk({
      id: 'push_ups_diamante', name: 'Flexiones Diamante', nameEn: 'Diamond Push Ups',
      primaryMuscle: 'triceps', secondaryMuscles: ['pectoral'],
      muscleGroup: 'pecho', equipment: [], equipmentType: 'sin_equipo',
      difficulty: 'intermedio', defaultReps: '8-15', defaultRest: 60,
      goalFit: { fatLoss: 6, muscleGain: 7, strength: 6, endurance: 7, tone: 8 }
    }),
    mk({
      id: 'push_ups_declinados', name: 'Flexiones Declinadas', nameEn: 'Decline Push Ups',
      primaryMuscle: 'pectoral_superior', secondaryMuscles: ['triceps', 'deltoides_anterior'],
      muscleGroup: 'pecho', equipment: ['caja'], equipmentType: 'casa_basico',
      difficulty: 'intermedio',
      goalFit: { fatLoss: 7, muscleGain: 8, strength: 7, endurance: 7, tone: 8 }
    }),
    mk({
      id: 'push_ups_rodillas', name: 'Flexiones en Rodillas', nameEn: 'Knee Push Ups',
      primaryMuscle: 'pectoral', secondaryMuscles: ['triceps'],
      muscleGroup: 'pecho', equipment: [], equipmentType: 'sin_equipo',
      difficulty: 'principiante', defaultReps: '10-15',
      goalFit: { fatLoss: 5, muscleGain: 5, strength: 4, endurance: 7, tone: 7 }
    }),
    mk({
      id: 'pullover', name: 'Pull Over con Mancuerna', nameEn: 'Dumbbell Pullover',
      primaryMuscle: 'pectoral', secondaryMuscles: ['dorsal', 'serrato'],
      muscleGroup: 'pecho', equipment: ['mancuerna', 'banco'], category: 'isolation',
      defaultReps: '10-15', defaultRest: 60,
      tips: ['Trabaja pecho y espalda simultaneamente'],
      goalFit: { fatLoss: 5, muscleGain: 7, strength: 5, endurance: 5, tone: 7 }
    }),
    mk({
      id: 'svend_press', name: 'Svend Press (Press con Disco)', nameEn: 'Svend Press',
      primaryMuscle: 'pectoral', muscleGroup: 'pecho', equipment: ['disco'],
      category: 'isolation', difficulty: 'principiante', defaultReps: '12-15',
      goalFit: { fatLoss: 4, muscleGain: 6, strength: 4, endurance: 5, tone: 7 }
    }),
    mk({
      id: 'landmine_press', name: 'Landmine Press', nameEn: 'Landmine Press',
      primaryMuscle: 'pectoral_superior', secondaryMuscles: ['deltoides_anterior', 'triceps'],
      muscleGroup: 'pecho', equipment: ['barra', 'landmine'], difficulty: 'intermedio',
      goalFit: { fatLoss: 6, muscleGain: 8, strength: 7, endurance: 4, tone: 7 }
    }),

    // =========================================================
    //  ESPALDA (17)
    // =========================================================
    mk({
      id: 'peso_muerto', name: 'Peso Muerto', nameEn: 'Deadlift',
      primaryMuscle: 'espalda_baja', secondaryMuscles: ['gluteos', 'femoral', 'trapecio', 'core'],
      muscleGroup: 'espalda', equipment: ['barra'], equipmentType: 'gym',
      difficulty: 'avanzado', force: 'pull', calPerMin: 9, defaultSets: 4, defaultReps: '5-8', defaultRest: 180,
      recovery: 72,
      instructions: ['1. Pies ancho de cadera, barra sobre medio pie', '2. Agarra barra, espalda neutra', '3. Empuja piso, extiende cadera y rodilla', '4. Baja controlado'],
      tips: ['Barra pegada al cuerpo', 'Espalda neutra siempre', 'No hiperextiendas arriba'],
      commonErrors: ['Espalda redondeada', 'Barra alejada', 'Hiperextension'],
      variations: ['peso_muerto_rumano', 'peso_muerto_sumo', 'rack_pull'],
      contraindications: ['hernia discal', 'lesion lumbar'],
      goalFit: { fatLoss: 8, muscleGain: 10, strength: 10, endurance: 4, tone: 8 }
    }),
    mk({
      id: 'peso_muerto_rumano', name: 'Peso Muerto Rumano', nameEn: 'Romanian Deadlift',
      primaryMuscle: 'femoral', secondaryMuscles: ['gluteos', 'espalda_baja'],
      muscleGroup: 'espalda', equipment: ['barra'], force: 'pull', difficulty: 'intermedio',
      defaultReps: '8-12', defaultRest: 90, recovery: 48,
      instructions: ['1. Parado con barra', '2. Empuja caderas atras manteniendo espalda neutra', '3. Baja hasta sentir estiramiento en femoral', '4. Sube extendiendo cadera'],
      tips: ['Rodillas ligeramente flexionadas', 'No llegas al piso'],
      goalFit: { fatLoss: 7, muscleGain: 9, strength: 8, endurance: 4, tone: 8 }
    }),
    mk({
      id: 'peso_muerto_sumo', name: 'Peso Muerto Sumo', nameEn: 'Sumo Deadlift',
      primaryMuscle: 'gluteos', secondaryMuscles: ['femoral', 'aductor', 'espalda_baja'],
      muscleGroup: 'espalda', equipment: ['barra'], difficulty: 'avanzado',
      goalFit: { fatLoss: 7, muscleGain: 9, strength: 10, endurance: 4, tone: 8 }
    }),
    mk({
      id: 'rack_pull', name: 'Rack Pull', nameEn: 'Rack Pull',
      primaryMuscle: 'espalda_baja', secondaryMuscles: ['trapecio', 'femoral'],
      muscleGroup: 'espalda', equipment: ['barra', 'rack'], difficulty: 'intermedio',
      goalFit: { fatLoss: 6, muscleGain: 8, strength: 9, endurance: 3, tone: 7 }
    }),
    mk({
      id: 'dominadas', name: 'Dominadas Pronadas', nameEn: 'Pull Ups',
      primaryMuscle: 'dorsal', secondaryMuscles: ['biceps', 'trapecio', 'romboides'],
      muscleGroup: 'espalda', equipment: ['barra_dominadas'], equipmentType: 'casa_basico',
      difficulty: 'avanzado', force: 'pull', calPerMin: 8, defaultReps: '6-10', defaultRest: 120,
      progression: 'reps', defaultWeight: null,
      instructions: ['1. Agarra la barra pronado, ancho de hombros', '2. Tira subiendo hasta barbilla sobre la barra', '3. Baja controlado'],
      tips: ['Aprieta los escapulares al subir', 'Baja completo para rango full'],
      commonErrors: ['Balancearse', 'Medio rango', 'Codos no extendidos'],
      variations: ['dominadas_supinadas', 'dominadas_neutras', 'dominadas_asistidas'],
      goalFit: { fatLoss: 7, muscleGain: 9, strength: 9, endurance: 5, tone: 9 }
    }),
    mk({
      id: 'dominadas_supinadas', name: 'Dominadas Supinadas (Chin Ups)', nameEn: 'Chin Ups',
      primaryMuscle: 'dorsal', secondaryMuscles: ['biceps'],
      muscleGroup: 'espalda', equipment: ['barra_dominadas'], force: 'pull', difficulty: 'intermedio',
      defaultReps: '6-12', defaultRest: 90,
      goalFit: { fatLoss: 7, muscleGain: 9, strength: 8, endurance: 5, tone: 9 }
    }),
    mk({
      id: 'dominadas_neutras', name: 'Dominadas Neutras', nameEn: 'Neutral Grip Pull Ups',
      primaryMuscle: 'dorsal', secondaryMuscles: ['biceps', 'braquial'],
      muscleGroup: 'espalda', equipment: ['barra_dominadas'], difficulty: 'intermedio',
      goalFit: { fatLoss: 7, muscleGain: 9, strength: 8, endurance: 5, tone: 9 }
    }),
    mk({
      id: 'dominadas_asistidas', name: 'Dominadas Asistidas', nameEn: 'Assisted Pull Ups',
      primaryMuscle: 'dorsal', secondaryMuscles: ['biceps'],
      muscleGroup: 'espalda', equipment: ['maquina'], difficulty: 'principiante',
      goalFit: { fatLoss: 6, muscleGain: 7, strength: 6, endurance: 5, tone: 8 }
    }),
    mk({
      id: 'remo_barra', name: 'Remo con Barra', nameEn: 'Barbell Row',
      primaryMuscle: 'dorsal', secondaryMuscles: ['romboides', 'trapecio', 'biceps'],
      muscleGroup: 'espalda', equipment: ['barra'], force: 'pull', difficulty: 'intermedio',
      defaultSets: 4, defaultRest: 90,
      instructions: ['1. Inclinate 45 grados con espalda neutra', '2. Agarra barra', '3. Tira al abdomen bajo', '4. Baja controlado'],
      tips: ['Escapulares retraidos al final'],
      goalFit: { fatLoss: 6, muscleGain: 9, strength: 9, endurance: 4, tone: 8 }
    }),
    mk({
      id: 'remo_mancuerna', name: 'Remo con Mancuerna a 1 Brazo', nameEn: 'One-Arm Dumbbell Row',
      primaryMuscle: 'dorsal', secondaryMuscles: ['romboides', 'biceps'],
      muscleGroup: 'espalda', equipment: ['mancuerna', 'banco'], equipmentType: 'casa_avanzado',
      force: 'pull', defaultReps: '10-12', defaultRest: 60,
      goalFit: { fatLoss: 6, muscleGain: 9, strength: 7, endurance: 4, tone: 8 }
    }),
    mk({
      id: 'remo_t', name: 'Remo en T', nameEn: 'T-Bar Row',
      primaryMuscle: 'dorsal', secondaryMuscles: ['romboides', 'trapecio'],
      muscleGroup: 'espalda', equipment: ['t_bar'], force: 'pull', difficulty: 'intermedio',
      goalFit: { fatLoss: 6, muscleGain: 9, strength: 8, endurance: 4, tone: 8 }
    }),
    mk({
      id: 'remo_sentado', name: 'Remo Sentado en Polea', nameEn: 'Seated Cable Row',
      primaryMuscle: 'dorsal', secondaryMuscles: ['romboides', 'trapecio', 'biceps'],
      muscleGroup: 'espalda', equipment: ['polea'], force: 'pull', difficulty: 'principiante',
      defaultRest: 60,
      tips: ['No balancees el torso'],
      goalFit: { fatLoss: 6, muscleGain: 8, strength: 7, endurance: 5, tone: 8 }
    }),
    mk({
      id: 'pulldown', name: 'Jalon al Pecho', nameEn: 'Lat Pulldown',
      primaryMuscle: 'dorsal', secondaryMuscles: ['biceps', 'romboides'],
      muscleGroup: 'espalda', equipment: ['polea'], force: 'pull', difficulty: 'principiante',
      defaultRest: 60,
      instructions: ['1. Sienta con muslos bajo almohadilla', '2. Agarra barra ancho', '3. Tira al pecho alto', '4. Sube controlado'],
      tips: ['No te inclines demasiado atras'],
      goalFit: { fatLoss: 6, muscleGain: 8, strength: 7, endurance: 5, tone: 8 }
    }),
    mk({
      id: 'pulldown_neutro', name: 'Jalon Neutro', nameEn: 'Neutral Grip Pulldown',
      primaryMuscle: 'dorsal', secondaryMuscles: ['biceps'],
      muscleGroup: 'espalda', equipment: ['polea'], force: 'pull',
      goalFit: { fatLoss: 6, muscleGain: 8, strength: 7, endurance: 5, tone: 8 }
    }),
    mk({
      id: 'face_pull', name: 'Face Pull', nameEn: 'Face Pull',
      primaryMuscle: 'deltoides_posterior', secondaryMuscles: ['trapecio', 'romboides'],
      muscleGroup: 'espalda', equipment: ['polea'], category: 'isolation', mechanic: 'isolation',
      force: 'pull', defaultReps: '12-15', defaultRest: 45,
      tips: ['Excelente para salud de hombro', 'Rota externamente al final'],
      goalFit: { fatLoss: 4, muscleGain: 6, strength: 4, endurance: 6, tone: 8 }
    }),
    mk({
      id: 'hiperextensiones', name: 'Hiperextensiones', nameEn: 'Back Extensions',
      primaryMuscle: 'espalda_baja', secondaryMuscles: ['gluteos', 'femoral'],
      muscleGroup: 'espalda', equipment: ['banco_romano'], defaultReps: '12-15', defaultRest: 60,
      goalFit: { fatLoss: 5, muscleGain: 6, strength: 5, endurance: 6, tone: 7 }
    }),
    mk({
      id: 'shrugs', name: 'Encogimientos (Shrugs)', nameEn: 'Shrugs',
      primaryMuscle: 'trapecio', muscleGroup: 'espalda', equipment: ['mancuernas'],
      category: 'isolation', mechanic: 'isolation', defaultReps: '12-15', defaultRest: 60,
      goalFit: { fatLoss: 4, muscleGain: 7, strength: 5, endurance: 4, tone: 7 }
    }),

    // =========================================================
    //  HOMBROS (13)
    // =========================================================
    mk({
      id: 'press_militar', name: 'Press Militar con Barra', nameEn: 'Military Press',
      primaryMuscle: 'deltoides', secondaryMuscles: ['triceps', 'trapecio', 'core'],
      muscleGroup: 'hombros', equipment: ['barra'], difficulty: 'intermedio', defaultRest: 120,
      instructions: ['1. Parado con barra al nivel clavicula', '2. Empuja arriba sin pasar la cabeza adelante', '3. Bloquea arriba', '4. Baja controlado'],
      tips: ['Core contraido', 'Gluteos apretados'],
      commonErrors: ['Arquear lumbar', 'No bloquear arriba'],
      goalFit: { fatLoss: 6, muscleGain: 9, strength: 10, endurance: 3, tone: 7 }
    }),
    mk({
      id: 'press_militar_mancuernas', name: 'Press Militar con Mancuernas', nameEn: 'DB Shoulder Press',
      primaryMuscle: 'deltoides', secondaryMuscles: ['triceps'],
      muscleGroup: 'hombros', equipment: ['mancuernas'], equipmentType: 'casa_avanzado',
      defaultRest: 90,
      goalFit: { fatLoss: 6, muscleGain: 9, strength: 7, endurance: 4, tone: 8 }
    }),
    mk({
      id: 'press_arnold', name: 'Press Arnold', nameEn: 'Arnold Press',
      primaryMuscle: 'deltoides', secondaryMuscles: ['triceps', 'pectoral_superior'],
      muscleGroup: 'hombros', equipment: ['mancuernas'], difficulty: 'intermedio',
      defaultReps: '10-12', defaultRest: 60,
      tips: ['Rotacion de palma de supino a prono'],
      goalFit: { fatLoss: 6, muscleGain: 9, strength: 7, endurance: 4, tone: 8 }
    }),
    mk({
      id: 'press_hombros_maquina', name: 'Press de Hombros Maquina', nameEn: 'Shoulder Press Machine',
      primaryMuscle: 'deltoides', muscleGroup: 'hombros', equipment: ['maquina'],
      difficulty: 'principiante',
      goalFit: { fatLoss: 6, muscleGain: 8, strength: 6, endurance: 4, tone: 7 }
    }),
    mk({
      id: 'vuelos_laterales', name: 'Elevaciones Laterales', nameEn: 'Lateral Raises',
      primaryMuscle: 'deltoides_lateral', muscleGroup: 'hombros',
      equipment: ['mancuernas'], equipmentType: 'casa_basico',
      category: 'isolation', mechanic: 'isolation', force: 'dynamic',
      difficulty: 'principiante', defaultReps: '12-15', defaultRest: 45, calPerMin: 4,
      instructions: ['1. Parado con mancuernas a los lados', '2. Sube los brazos hasta la altura del hombro', '3. Baja controlado'],
      tips: ['Peso moderado', 'Codos ligeramente flexionados', 'No uses impulso'],
      commonErrors: ['Usar demasiado peso', 'Levantar por encima del hombro'],
      goalFit: { fatLoss: 5, muscleGain: 8, strength: 4, endurance: 6, tone: 9 }
    }),
    mk({
      id: 'vuelos_laterales_polea', name: 'Elevaciones Laterales en Polea', nameEn: 'Cable Lateral Raise',
      primaryMuscle: 'deltoides_lateral', muscleGroup: 'hombros', equipment: ['polea'],
      category: 'isolation', mechanic: 'isolation', defaultReps: '12-15',
      goalFit: { fatLoss: 4, muscleGain: 8, strength: 4, endurance: 6, tone: 9 }
    }),
    mk({
      id: 'elevaciones_frontales', name: 'Elevaciones Frontales', nameEn: 'Front Raises',
      primaryMuscle: 'deltoides_anterior', muscleGroup: 'hombros',
      equipment: ['mancuernas'], category: 'isolation', mechanic: 'isolation',
      defaultReps: '12-15', defaultRest: 45,
      goalFit: { fatLoss: 4, muscleGain: 7, strength: 4, endurance: 5, tone: 8 }
    }),
    mk({
      id: 'pajaro', name: 'Pajaro (Rear Delt Fly)', nameEn: 'Rear Delt Fly',
      primaryMuscle: 'deltoides_posterior', secondaryMuscles: ['romboides', 'trapecio'],
      muscleGroup: 'hombros', equipment: ['mancuernas'], category: 'isolation',
      mechanic: 'isolation', defaultReps: '12-15', defaultRest: 45,
      tips: ['Importante para postura y balance de hombro'],
      goalFit: { fatLoss: 4, muscleGain: 7, strength: 4, endurance: 5, tone: 8 }
    }),
    mk({
      id: 'rear_delt_maquina', name: 'Rear Delt en Maquina', nameEn: 'Rear Delt Machine',
      primaryMuscle: 'deltoides_posterior', muscleGroup: 'hombros', equipment: ['maquina'],
      category: 'isolation', defaultReps: '12-15',
      goalFit: { fatLoss: 4, muscleGain: 7, strength: 4, endurance: 5, tone: 8 }
    }),
    mk({
      id: 'remo_alto', name: 'Remo al Menton', nameEn: 'Upright Row',
      primaryMuscle: 'deltoides_lateral', secondaryMuscles: ['trapecio'],
      muscleGroup: 'hombros', equipment: ['barra'], defaultReps: '10-12',
      contraindications: ['lesion hombro'],
      goalFit: { fatLoss: 5, muscleGain: 7, strength: 6, endurance: 4, tone: 7 }
    }),
    mk({
      id: 'pike_pushup', name: 'Pike Pushup', nameEn: 'Pike Pushup',
      primaryMuscle: 'deltoides', secondaryMuscles: ['triceps'],
      muscleGroup: 'hombros', equipment: [], equipmentType: 'sin_equipo',
      difficulty: 'intermedio', defaultReps: '8-12',
      goalFit: { fatLoss: 6, muscleGain: 7, strength: 7, endurance: 6, tone: 8 }
    }),
    mk({
      id: 'handstand_pushup', name: 'Flexion en Parada de Manos', nameEn: 'Handstand Pushup',
      primaryMuscle: 'deltoides', secondaryMuscles: ['triceps', 'trapecio'],
      muscleGroup: 'hombros', equipment: ['pared'], equipmentType: 'sin_equipo',
      difficulty: 'avanzado', defaultReps: '3-8',
      goalFit: { fatLoss: 6, muscleGain: 8, strength: 9, endurance: 4, tone: 8 }
    }),
    mk({
      id: 'press_landmine_hombro', name: 'Press Landmine de Hombro', nameEn: 'Landmine Shoulder Press',
      primaryMuscle: 'deltoides', secondaryMuscles: ['pectoral_superior'],
      muscleGroup: 'hombros', equipment: ['landmine', 'barra'], difficulty: 'intermedio',
      goalFit: { fatLoss: 5, muscleGain: 7, strength: 7, endurance: 4, tone: 7 }
    }),

    // =========================================================
    //  BRAZOS (17)
    // =========================================================
    mk({
      id: 'curl_biceps_barra', name: 'Curl de Biceps con Barra', nameEn: 'Barbell Curl',
      primaryMuscle: 'biceps', secondaryMuscles: ['braquial'],
      muscleGroup: 'brazos', equipment: ['barra'], category: 'isolation', mechanic: 'isolation',
      force: 'pull', defaultReps: '8-12', defaultRest: 60, calPerMin: 5, recovery: 48,
      instructions: ['1. Parado con barra agarre supino', '2. Sube la barra contrayendo biceps', '3. Baja controlado'],
      tips: ['Codos pegados al torso', 'No balances'],
      commonErrors: ['Balanceo', 'Muneca rota', 'Rango parcial'],
      variations: ['curl_mancuernas', 'curl_martillo', 'curl_predicador'],
      goalFit: { fatLoss: 4, muscleGain: 8, strength: 6, endurance: 5, tone: 8 }
    }),
    mk({
      id: 'curl_mancuernas', name: 'Curl con Mancuernas', nameEn: 'Dumbbell Curl',
      primaryMuscle: 'biceps', muscleGroup: 'brazos', equipment: ['mancuernas'],
      equipmentType: 'casa_basico', category: 'isolation', mechanic: 'isolation',
      defaultReps: '10-12', defaultRest: 45,
      goalFit: { fatLoss: 4, muscleGain: 8, strength: 5, endurance: 6, tone: 9 }
    }),
    mk({
      id: 'curl_alternado', name: 'Curl Alternado', nameEn: 'Alternating DB Curl',
      primaryMuscle: 'biceps', muscleGroup: 'brazos', equipment: ['mancuernas'],
      category: 'isolation', mechanic: 'isolation',
      goalFit: { fatLoss: 4, muscleGain: 8, strength: 5, endurance: 6, tone: 9 }
    }),
    mk({
      id: 'curl_martillo', name: 'Curl Martillo', nameEn: 'Hammer Curl',
      primaryMuscle: 'braquial', secondaryMuscles: ['biceps', 'braquiorradial'],
      muscleGroup: 'brazos', equipment: ['mancuernas'], category: 'isolation',
      mechanic: 'isolation', defaultReps: '10-12', defaultRest: 45,
      tips: ['Excelente para grosor del brazo'],
      goalFit: { fatLoss: 4, muscleGain: 8, strength: 5, endurance: 6, tone: 9 }
    }),
    mk({
      id: 'curl_predicador', name: 'Curl en Banco Predicador', nameEn: 'Preacher Curl',
      primaryMuscle: 'biceps', muscleGroup: 'brazos',
      equipment: ['barra_z', 'banco_predicador'], category: 'isolation', mechanic: 'isolation',
      defaultReps: '8-12', defaultRest: 60,
      goalFit: { fatLoss: 3, muscleGain: 8, strength: 6, endurance: 4, tone: 8 }
    }),
    mk({
      id: 'curl_arana', name: 'Curl Araña', nameEn: 'Spider Curl',
      primaryMuscle: 'biceps', muscleGroup: 'brazos',
      equipment: ['mancuernas', 'banco_inclinado'], category: 'isolation',
      defaultReps: '10-12', defaultRest: 45,
      goalFit: { fatLoss: 3, muscleGain: 8, strength: 5, endurance: 5, tone: 9 }
    }),
    mk({
      id: 'curl_concentrado', name: 'Curl Concentrado', nameEn: 'Concentration Curl',
      primaryMuscle: 'biceps', muscleGroup: 'brazos', equipment: ['mancuerna'],
      category: 'isolation', mechanic: 'isolation',
      goalFit: { fatLoss: 3, muscleGain: 7, strength: 4, endurance: 5, tone: 9 }
    }),
    mk({
      id: 'curl_polea', name: 'Curl en Polea', nameEn: 'Cable Curl',
      primaryMuscle: 'biceps', muscleGroup: 'brazos', equipment: ['polea'],
      category: 'isolation', defaultReps: '10-12',
      goalFit: { fatLoss: 4, muscleGain: 7, strength: 5, endurance: 6, tone: 9 }
    }),
    mk({
      id: 'extension_triceps_polea', name: 'Extension de Triceps en Polea', nameEn: 'Triceps Pushdown',
      primaryMuscle: 'triceps', muscleGroup: 'brazos', equipment: ['polea'],
      category: 'isolation', mechanic: 'isolation', force: 'push',
      defaultReps: '10-12', defaultRest: 45,
      instructions: ['1. Parado frente a polea alta', '2. Agarra la cuerda/barra', '3. Baja extendiendo los codos', '4. Sube controlado'],
      tips: ['Codos pegados al torso'],
      goalFit: { fatLoss: 4, muscleGain: 7, strength: 6, endurance: 5, tone: 8 }
    }),
    mk({
      id: 'skull_crushers', name: 'Skull Crushers', nameEn: 'Skull Crushers',
      primaryMuscle: 'triceps', muscleGroup: 'brazos',
      equipment: ['barra_z', 'banco'], category: 'isolation', mechanic: 'isolation',
      defaultReps: '8-12', defaultRest: 60,
      contraindications: ['lesion codo'],
      goalFit: { fatLoss: 4, muscleGain: 8, strength: 6, endurance: 4, tone: 8 }
    }),
    mk({
      id: 'extension_triceps_overhead', name: 'Extension Triceps Overhead', nameEn: 'Overhead Triceps Extension',
      primaryMuscle: 'triceps', muscleGroup: 'brazos', equipment: ['mancuerna'],
      category: 'isolation', defaultReps: '10-12', defaultRest: 45,
      tips: ['Enfatiza cabeza larga del triceps'],
      goalFit: { fatLoss: 4, muscleGain: 7, strength: 5, endurance: 5, tone: 8 }
    }),
    mk({
      id: 'fondos_banco', name: 'Fondos en Banco', nameEn: 'Bench Dips',
      primaryMuscle: 'triceps', secondaryMuscles: ['deltoides_anterior'],
      muscleGroup: 'brazos', equipment: ['banco'], equipmentType: 'casa_basico',
      difficulty: 'principiante', defaultReps: '10-15', defaultRest: 45,
      goalFit: { fatLoss: 5, muscleGain: 6, strength: 5, endurance: 7, tone: 8 }
    }),
    mk({
      id: 'fondos_triceps', name: 'Fondos en Paralelas (Triceps)', nameEn: 'Triceps Dips',
      primaryMuscle: 'triceps', secondaryMuscles: ['pectoral'],
      muscleGroup: 'brazos', equipment: ['paralelas'], difficulty: 'avanzado',
      defaultReps: '8-12', defaultRest: 90,
      goalFit: { fatLoss: 7, muscleGain: 8, strength: 8, endurance: 5, tone: 8 }
    }),
    mk({
      id: 'patada_triceps', name: 'Patada de Triceps', nameEn: 'Triceps Kickback',
      primaryMuscle: 'triceps', muscleGroup: 'brazos', equipment: ['mancuerna'],
      category: 'isolation', defaultReps: '12-15',
      goalFit: { fatLoss: 3, muscleGain: 6, strength: 3, endurance: 5, tone: 8 }
    }),
    mk({
      id: 'curl_muneca', name: 'Curl de Muneca', nameEn: 'Wrist Curl',
      primaryMuscle: 'antebrazo', muscleGroup: 'brazos', equipment: ['mancuernas'],
      category: 'isolation', defaultReps: '15-20', defaultRest: 45,
      goalFit: { fatLoss: 2, muscleGain: 5, strength: 4, endurance: 5, tone: 6 }
    }),
    mk({
      id: 'curl_reverso', name: 'Curl Reverso', nameEn: 'Reverse Curl',
      primaryMuscle: 'braquiorradial', secondaryMuscles: ['biceps', 'antebrazo'],
      muscleGroup: 'brazos', equipment: ['barra'], category: 'isolation',
      defaultReps: '10-12',
      goalFit: { fatLoss: 3, muscleGain: 6, strength: 4, endurance: 5, tone: 7 }
    }),
    mk({
      id: 'curl_21s', name: 'Curl 21s', nameEn: '21s Biceps Curl',
      primaryMuscle: 'biceps', muscleGroup: 'brazos', equipment: ['barra'],
      category: 'isolation', difficulty: 'intermedio', defaultReps: '21',
      goalFit: { fatLoss: 4, muscleGain: 8, strength: 5, endurance: 7, tone: 9 }
    }),

    // =========================================================
    //  PIERNAS (22)
    // =========================================================
    mk({
      id: 'sentadilla', name: 'Sentadilla con Barra', nameEn: 'Barbell Back Squat',
      primaryMuscle: 'cuadriceps', secondaryMuscles: ['gluteos', 'femoral', 'core'],
      muscleGroup: 'piernas', equipment: ['barra', 'rack'], difficulty: 'intermedio',
      force: 'dynamic', defaultSets: 4, defaultReps: '6-10', defaultRest: 150,
      calPerMin: 9, recovery: 72,
      instructions: ['1. Barra en trapecio, pies ancho de hombros', '2. Sienta como si tiraras silla atras', '3. Baja hasta femoral paralelo o mas', '4. Empuja piso subiendo'],
      tips: ['Rodillas en linea con dedos', 'Espalda neutra', 'Mirada al frente'],
      commonErrors: ['Rodillas adentro', 'Talones levantados', 'Medio rango'],
      variations: ['sentadilla_frontal', 'sentadilla_goblet', 'sentadilla_sumo'],
      contraindications: ['lesion rodilla severa', 'hernia discal aguda'],
      goalFit: { fatLoss: 9, muscleGain: 10, strength: 10, endurance: 5, tone: 9 }
    }),
    mk({
      id: 'sentadilla_frontal', name: 'Sentadilla Frontal', nameEn: 'Front Squat',
      primaryMuscle: 'cuadriceps', secondaryMuscles: ['core', 'gluteos'],
      muscleGroup: 'piernas', equipment: ['barra', 'rack'], difficulty: 'avanzado',
      defaultReps: '6-8', defaultRest: 150,
      goalFit: { fatLoss: 8, muscleGain: 10, strength: 10, endurance: 4, tone: 8 }
    }),
    mk({
      id: 'sentadilla_goblet', name: 'Sentadilla Goblet', nameEn: 'Goblet Squat',
      primaryMuscle: 'cuadriceps', secondaryMuscles: ['gluteos', 'core'],
      muscleGroup: 'piernas', equipment: ['mancuerna'], equipmentType: 'casa_basico',
      difficulty: 'principiante', defaultReps: '10-12', defaultRest: 90,
      tips: ['Perfecta para aprender el patron de sentadilla'],
      goalFit: { fatLoss: 7, muscleGain: 8, strength: 6, endurance: 6, tone: 8 }
    }),
    mk({
      id: 'sentadilla_sumo', name: 'Sentadilla Sumo', nameEn: 'Sumo Squat',
      primaryMuscle: 'aductor', secondaryMuscles: ['gluteos', 'cuadriceps'],
      muscleGroup: 'piernas', equipment: ['mancuerna', 'barra'], difficulty: 'intermedio',
      goalFit: { fatLoss: 7, muscleGain: 8, strength: 7, endurance: 5, tone: 8 }
    }),
    mk({
      id: 'pistol_squat', name: 'Pistol Squat', nameEn: 'Pistol Squat',
      primaryMuscle: 'cuadriceps', secondaryMuscles: ['gluteos', 'core'],
      muscleGroup: 'piernas', equipment: [], equipmentType: 'sin_equipo',
      difficulty: 'avanzado', defaultReps: '5-8',
      goalFit: { fatLoss: 7, muscleGain: 7, strength: 9, endurance: 5, tone: 9 }
    }),
    mk({
      id: 'hack_squat', name: 'Hack Squat', nameEn: 'Hack Squat',
      primaryMuscle: 'cuadriceps', secondaryMuscles: ['gluteos'],
      muscleGroup: 'piernas', equipment: ['maquina'], difficulty: 'intermedio',
      goalFit: { fatLoss: 7, muscleGain: 9, strength: 8, endurance: 4, tone: 8 }
    }),
    mk({
      id: 'prensa', name: 'Prensa de Piernas', nameEn: 'Leg Press',
      primaryMuscle: 'cuadriceps', secondaryMuscles: ['gluteos', 'femoral'],
      muscleGroup: 'piernas', equipment: ['maquina'], difficulty: 'principiante',
      defaultSets: 4, defaultRest: 120,
      instructions: ['1. Sienta en la prensa', '2. Pies ancho de hombros en plataforma', '3. Baja hasta 90 grados en rodilla', '4. Empuja'],
      tips: ['No bloquees rodillas arriba', 'Control en la bajada'],
      goalFit: { fatLoss: 7, muscleGain: 9, strength: 8, endurance: 5, tone: 8 }
    }),
    mk({
      id: 'sentadilla_bulgara', name: 'Sentadilla Bulgara', nameEn: 'Bulgarian Split Squat',
      primaryMuscle: 'cuadriceps', secondaryMuscles: ['gluteos', 'femoral'],
      muscleGroup: 'piernas', equipment: ['mancuernas', 'banco'], equipmentType: 'casa_avanzado',
      difficulty: 'intermedio', defaultReps: '8-10 c/pierna', defaultRest: 60,
      tips: ['Excelente para corregir desbalances'],
      goalFit: { fatLoss: 8, muscleGain: 9, strength: 8, endurance: 6, tone: 9 }
    }),
    mk({
      id: 'zancadas', name: 'Zancadas', nameEn: 'Lunges',
      primaryMuscle: 'cuadriceps', secondaryMuscles: ['gluteos', 'femoral'],
      muscleGroup: 'piernas', equipment: ['mancuernas'], equipmentType: 'casa_basico',
      difficulty: 'principiante', defaultReps: '10 c/pierna', defaultRest: 60,
      instructions: ['1. Parado, da un paso adelante', '2. Baja hasta 90 grados ambas rodillas', '3. Empuja atras a la posicion inicial'],
      goalFit: { fatLoss: 8, muscleGain: 8, strength: 7, endurance: 7, tone: 9 }
    }),
    mk({
      id: 'zancadas_caminando', name: 'Zancadas Caminando', nameEn: 'Walking Lunges',
      primaryMuscle: 'cuadriceps', secondaryMuscles: ['gluteos'],
      muscleGroup: 'piernas', equipment: ['mancuernas'], defaultReps: '20 pasos',
      goalFit: { fatLoss: 8, muscleGain: 7, strength: 6, endurance: 8, tone: 9 }
    }),
    mk({
      id: 'zancadas_reversas', name: 'Zancadas Reversas', nameEn: 'Reverse Lunges',
      primaryMuscle: 'cuadriceps', secondaryMuscles: ['gluteos'],
      muscleGroup: 'piernas', equipment: ['mancuernas'], equipmentType: 'casa_basico',
      goalFit: { fatLoss: 8, muscleGain: 7, strength: 6, endurance: 7, tone: 9 }
    }),
    mk({
      id: 'step_up', name: 'Step Up', nameEn: 'Step Ups',
      primaryMuscle: 'cuadriceps', secondaryMuscles: ['gluteos'],
      muscleGroup: 'piernas', equipment: ['banco', 'mancuernas'], equipmentType: 'casa_basico',
      difficulty: 'principiante', defaultReps: '10 c/pierna',
      goalFit: { fatLoss: 7, muscleGain: 7, strength: 5, endurance: 7, tone: 8 }
    }),
    mk({
      id: 'extension_cuadriceps', name: 'Extension de Cuadriceps', nameEn: 'Leg Extension',
      primaryMuscle: 'cuadriceps', muscleGroup: 'piernas', equipment: ['maquina'],
      category: 'isolation', mechanic: 'isolation', defaultReps: '12-15', defaultRest: 60,
      goalFit: { fatLoss: 5, muscleGain: 7, strength: 5, endurance: 6, tone: 8 }
    }),
    mk({
      id: 'curl_femoral', name: 'Curl Femoral Tumbado', nameEn: 'Lying Leg Curl',
      primaryMuscle: 'femoral', muscleGroup: 'piernas', equipment: ['maquina'],
      category: 'isolation', mechanic: 'isolation', defaultReps: '10-12', defaultRest: 60,
      goalFit: { fatLoss: 5, muscleGain: 8, strength: 6, endurance: 5, tone: 8 }
    }),
    mk({
      id: 'curl_femoral_sentado', name: 'Curl Femoral Sentado', nameEn: 'Seated Leg Curl',
      primaryMuscle: 'femoral', muscleGroup: 'piernas', equipment: ['maquina'],
      category: 'isolation', defaultReps: '10-12',
      goalFit: { fatLoss: 5, muscleGain: 8, strength: 6, endurance: 5, tone: 8 }
    }),
    mk({
      id: 'good_morning', name: 'Buenos Dias', nameEn: 'Good Morning',
      primaryMuscle: 'femoral', secondaryMuscles: ['espalda_baja', 'gluteos'],
      muscleGroup: 'piernas', equipment: ['barra'], difficulty: 'avanzado',
      defaultReps: '8-10', defaultRest: 90,
      contraindications: ['lesion lumbar'],
      goalFit: { fatLoss: 6, muscleGain: 7, strength: 7, endurance: 4, tone: 7 }
    }),
    mk({
      id: 'gemelos_parado', name: 'Elevacion de Gemelos de Pie', nameEn: 'Standing Calf Raise',
      primaryMuscle: 'gemelos', muscleGroup: 'piernas',
      equipment: ['maquina'], equipmentType: 'casa_basico',
      category: 'isolation', mechanic: 'isolation', defaultReps: '12-20', defaultRest: 45,
      tips: ['Rango completo arriba y abajo'],
      goalFit: { fatLoss: 4, muscleGain: 7, strength: 5, endurance: 7, tone: 8 }
    }),
    mk({
      id: 'gemelos_sentado', name: 'Gemelos Sentado', nameEn: 'Seated Calf Raise',
      primaryMuscle: 'soleo', muscleGroup: 'piernas', equipment: ['maquina'],
      category: 'isolation', defaultReps: '15-20',
      goalFit: { fatLoss: 4, muscleGain: 7, strength: 5, endurance: 7, tone: 8 }
    }),
    mk({
      id: 'gemelos_prensa', name: 'Gemelos en Prensa', nameEn: 'Leg Press Calf Raise',
      primaryMuscle: 'gemelos', muscleGroup: 'piernas', equipment: ['maquina'],
      category: 'isolation', defaultReps: '15-20',
      goalFit: { fatLoss: 4, muscleGain: 7, strength: 5, endurance: 7, tone: 8 }
    }),
    mk({
      id: 'abduccion_maquina', name: 'Abduccion en Maquina', nameEn: 'Hip Abduction',
      primaryMuscle: 'gluteo_medio', muscleGroup: 'piernas', equipment: ['maquina'],
      category: 'isolation', defaultReps: '12-15',
      goalFit: { fatLoss: 4, muscleGain: 6, strength: 4, endurance: 5, tone: 8 }
    }),
    mk({
      id: 'aduccion_maquina', name: 'Aduccion en Maquina', nameEn: 'Hip Adduction',
      primaryMuscle: 'aductor', muscleGroup: 'piernas', equipment: ['maquina'],
      category: 'isolation', defaultReps: '12-15',
      goalFit: { fatLoss: 4, muscleGain: 6, strength: 4, endurance: 5, tone: 7 }
    }),
    mk({
      id: 'sentadilla_cuerpo', name: 'Sentadilla Libre (Sin Peso)', nameEn: 'Air Squat',
      primaryMuscle: 'cuadriceps', secondaryMuscles: ['gluteos'],
      muscleGroup: 'piernas', equipment: [], equipmentType: 'sin_equipo',
      difficulty: 'principiante', defaultReps: '15-25', defaultRest: 45,
      goalFit: { fatLoss: 6, muscleGain: 4, strength: 3, endurance: 8, tone: 7 }
    }),

    // =========================================================
    //  GLUTEOS (11)
    // =========================================================
    mk({
      id: 'hip_thrust', name: 'Hip Thrust con Barra', nameEn: 'Hip Thrust',
      primaryMuscle: 'gluteos', secondaryMuscles: ['femoral', 'cuadriceps'],
      muscleGroup: 'gluteos', equipment: ['barra', 'banco'], difficulty: 'intermedio',
      force: 'dynamic', defaultSets: 4, defaultReps: '8-12', defaultRest: 90, calPerMin: 7,
      instructions: ['1. Apoya parte alta de la espalda en banco', '2. Barra sobre las caderas (acolchado)', '3. Empuja cadera arriba apretando gluteos', '4. Baja controlado'],
      tips: ['Barbilla al pecho', 'Pausa 1-2s arriba', 'Menton neutro'],
      commonErrors: ['Hiperextension lumbar', 'Rango parcial'],
      goalFit: { fatLoss: 7, muscleGain: 10, strength: 9, endurance: 5, tone: 10 }
    }),
    mk({
      id: 'hip_thrust_maquina', name: 'Hip Thrust en Maquina', nameEn: 'Machine Hip Thrust',
      primaryMuscle: 'gluteos', muscleGroup: 'gluteos', equipment: ['maquina'],
      difficulty: 'principiante',
      goalFit: { fatLoss: 6, muscleGain: 9, strength: 7, endurance: 5, tone: 9 }
    }),
    mk({
      id: 'hip_thrust_unilateral', name: 'Hip Thrust Unilateral', nameEn: 'Single-Leg Hip Thrust',
      primaryMuscle: 'gluteos', muscleGroup: 'gluteos', equipment: ['banco'],
      equipmentType: 'casa_basico', difficulty: 'intermedio', defaultReps: '10 c/pierna',
      goalFit: { fatLoss: 6, muscleGain: 8, strength: 7, endurance: 6, tone: 9 }
    }),
    mk({
      id: 'puente_gluteo', name: 'Puente de Gluteo', nameEn: 'Glute Bridge',
      primaryMuscle: 'gluteos', secondaryMuscles: ['femoral'],
      muscleGroup: 'gluteos', equipment: [], equipmentType: 'sin_equipo',
      difficulty: 'principiante', defaultReps: '12-15', defaultRest: 45,
      goalFit: { fatLoss: 5, muscleGain: 5, strength: 4, endurance: 7, tone: 8 }
    }),
    mk({
      id: 'patada_gluteo_cuadrupedo', name: 'Patada de Gluteo Cuadrupedo', nameEn: 'Donkey Kick',
      primaryMuscle: 'gluteos', muscleGroup: 'gluteos', equipment: [],
      equipmentType: 'sin_equipo', category: 'isolation',
      defaultReps: '15 c/pierna', defaultRest: 30,
      goalFit: { fatLoss: 4, muscleGain: 5, strength: 3, endurance: 7, tone: 8 }
    }),
    mk({
      id: 'patada_gluteo_polea', name: 'Patada de Gluteo en Polea', nameEn: 'Cable Kickback',
      primaryMuscle: 'gluteos', muscleGroup: 'gluteos', equipment: ['polea'],
      category: 'isolation', defaultReps: '12-15 c/pierna',
      goalFit: { fatLoss: 4, muscleGain: 7, strength: 5, endurance: 6, tone: 9 }
    }),
    mk({
      id: 'abduccion_cadera_banda', name: 'Abduccion de Cadera con Banda', nameEn: 'Banded Hip Abduction',
      primaryMuscle: 'gluteo_medio', muscleGroup: 'gluteos', equipment: ['banda'],
      equipmentType: 'casa_basico', category: 'isolation',
      defaultReps: '15-20', defaultRest: 30,
      goalFit: { fatLoss: 4, muscleGain: 5, strength: 3, endurance: 7, tone: 8 }
    }),
    mk({
      id: 'clamshell', name: 'Clamshell', nameEn: 'Clamshells',
      primaryMuscle: 'gluteo_medio', muscleGroup: 'gluteos', equipment: ['banda'],
      equipmentType: 'casa_basico', category: 'isolation',
      defaultReps: '15-20 c/lado', defaultRest: 30,
      tips: ['Excelente para activacion pre-sentadilla'],
      goalFit: { fatLoss: 3, muscleGain: 4, strength: 3, endurance: 6, tone: 7 }
    }),
    mk({
      id: 'cossack_squat', name: 'Sentadilla Cossack', nameEn: 'Cossack Squat',
      primaryMuscle: 'aductor', secondaryMuscles: ['gluteos', 'cuadriceps'],
      muscleGroup: 'gluteos', equipment: [], equipmentType: 'sin_equipo',
      difficulty: 'intermedio', defaultReps: '8 c/lado',
      goalFit: { fatLoss: 6, muscleGain: 5, strength: 5, endurance: 6, tone: 8 }
    }),
    mk({
      id: 'monster_walk', name: 'Monster Walk', nameEn: 'Monster Walk',
      primaryMuscle: 'gluteo_medio', muscleGroup: 'gluteos', equipment: ['banda'],
      equipmentType: 'casa_basico', defaultReps: '10 pasos c/direccion',
      goalFit: { fatLoss: 4, muscleGain: 4, strength: 3, endurance: 6, tone: 8 }
    }),
    mk({
      id: 'frog_pump', name: 'Frog Pump', nameEn: 'Frog Pump',
      primaryMuscle: 'gluteos', muscleGroup: 'gluteos', equipment: [],
      equipmentType: 'sin_equipo', difficulty: 'principiante',
      defaultReps: '20-30',
      goalFit: { fatLoss: 4, muscleGain: 5, strength: 3, endurance: 7, tone: 8 }
    }),

    // =========================================================
    //  CORE (14)
    // =========================================================
    mk({
      id: 'plancha', name: 'Plancha Frontal', nameEn: 'Plank',
      primaryMuscle: 'core', secondaryMuscles: ['hombros', 'gluteos'],
      muscleGroup: 'core', equipment: [], equipmentType: 'sin_equipo',
      category: 'isolation', mechanic: 'isolation', force: 'static',
      difficulty: 'principiante', defaultSets: 3, defaultReps: '30-60s', defaultRest: 45,
      progression: 'time', calPerMin: 4, recovery: 24,
      instructions: ['1. Apoya antebrazos y puntas de pie', '2. Cuerpo recto como tabla', '3. Mantener posicion'],
      tips: ['Gluteos apretados', 'No hundir cadera'],
      commonErrors: ['Cadera caida', 'Cadera muy alta', 'Aguantar respiracion'],
      goalFit: { fatLoss: 5, muscleGain: 4, strength: 5, endurance: 7, tone: 7 }
    }),
    mk({
      id: 'plancha_lateral', name: 'Plancha Lateral', nameEn: 'Side Plank',
      primaryMuscle: 'oblicuos', secondaryMuscles: ['core'],
      muscleGroup: 'core', equipment: [], equipmentType: 'sin_equipo',
      force: 'static', progression: 'time', defaultReps: '30-45s c/lado',
      goalFit: { fatLoss: 4, muscleGain: 4, strength: 4, endurance: 7, tone: 8 }
    }),
    mk({
      id: 'crunch', name: 'Crunches', nameEn: 'Crunches',
      primaryMuscle: 'abdominales', muscleGroup: 'core', equipment: [],
      equipmentType: 'sin_equipo', category: 'isolation',
      defaultReps: '15-25', defaultRest: 30, recovery: 24,
      goalFit: { fatLoss: 4, muscleGain: 4, strength: 3, endurance: 6, tone: 7 }
    }),
    mk({
      id: 'sit_up', name: 'Sit Ups', nameEn: 'Sit Ups',
      primaryMuscle: 'abdominales', secondaryMuscles: ['flexor_cadera'],
      muscleGroup: 'core', equipment: [], defaultReps: '15-20',
      goalFit: { fatLoss: 5, muscleGain: 4, strength: 4, endurance: 6, tone: 7 }
    }),
    mk({
      id: 'elevacion_piernas_colgado', name: 'Elevacion de Piernas Colgado', nameEn: 'Hanging Leg Raise',
      primaryMuscle: 'abdominales', secondaryMuscles: ['flexor_cadera'],
      muscleGroup: 'core', equipment: ['barra_dominadas'], difficulty: 'avanzado',
      defaultReps: '8-12',
      goalFit: { fatLoss: 6, muscleGain: 7, strength: 7, endurance: 5, tone: 9 }
    }),
    mk({
      id: 'elevacion_piernas_piso', name: 'Elevacion de Piernas Acostado', nameEn: 'Lying Leg Raise',
      primaryMuscle: 'abdominales', muscleGroup: 'core', equipment: [],
      equipmentType: 'sin_equipo', defaultReps: '12-15',
      goalFit: { fatLoss: 5, muscleGain: 5, strength: 5, endurance: 6, tone: 8 }
    }),
    mk({
      id: 'russian_twist', name: 'Russian Twist', nameEn: 'Russian Twist',
      primaryMuscle: 'oblicuos', muscleGroup: 'core',
      equipment: ['mancuerna'], equipmentType: 'casa_basico',
      defaultReps: '20 totales', defaultRest: 30,
      goalFit: { fatLoss: 5, muscleGain: 5, strength: 4, endurance: 6, tone: 8 }
    }),
    mk({
      id: 'bicycle_crunch', name: 'Crunch Bicicleta', nameEn: 'Bicycle Crunch',
      primaryMuscle: 'abdominales', secondaryMuscles: ['oblicuos'],
      muscleGroup: 'core', equipment: [], equipmentType: 'sin_equipo',
      defaultReps: '20 totales',
      goalFit: { fatLoss: 6, muscleGain: 5, strength: 4, endurance: 7, tone: 8 }
    }),
    mk({
      id: 'mountain_climbers', name: 'Mountain Climbers', nameEn: 'Mountain Climbers',
      primaryMuscle: 'core', secondaryMuscles: ['hombros', 'piernas'],
      muscleGroup: 'core', equipment: [], equipmentType: 'sin_equipo',
      type: 'endurance', calPerMin: 10, defaultReps: '30-45s', progression: 'time',
      goalFit: { fatLoss: 9, muscleGain: 4, strength: 4, endurance: 8, tone: 8 }
    }),
    mk({
      id: 'dead_bug', name: 'Dead Bug', nameEn: 'Dead Bug',
      primaryMuscle: 'core', muscleGroup: 'core', equipment: [],
      equipmentType: 'sin_equipo', difficulty: 'principiante',
      defaultReps: '10 c/lado',
      tips: ['Excelente para estabilidad lumbar'],
      goalFit: { fatLoss: 3, muscleGain: 4, strength: 4, endurance: 6, tone: 7 }
    }),
    mk({
      id: 'bird_dog', name: 'Bird Dog', nameEn: 'Bird Dog',
      primaryMuscle: 'core', secondaryMuscles: ['espalda_baja', 'gluteos'],
      muscleGroup: 'core', equipment: [], equipmentType: 'sin_equipo',
      difficulty: 'principiante', defaultReps: '10 c/lado',
      goalFit: { fatLoss: 3, muscleGain: 4, strength: 4, endurance: 6, tone: 7 }
    }),
    mk({
      id: 'hollow_hold', name: 'Hollow Hold', nameEn: 'Hollow Hold',
      primaryMuscle: 'core', muscleGroup: 'core', equipment: [],
      force: 'static', defaultReps: '20-40s', progression: 'time',
      goalFit: { fatLoss: 4, muscleGain: 5, strength: 5, endurance: 7, tone: 8 }
    }),
    mk({
      id: 'cable_woodchop', name: 'Leñador en Polea', nameEn: 'Cable Wood Chop',
      primaryMuscle: 'oblicuos', secondaryMuscles: ['core'],
      muscleGroup: 'core', equipment: ['polea'], defaultReps: '10 c/lado',
      goalFit: { fatLoss: 5, muscleGain: 5, strength: 5, endurance: 5, tone: 8 }
    }),
    mk({
      id: 'pallof_press', name: 'Pallof Press', nameEn: 'Pallof Press',
      primaryMuscle: 'core', secondaryMuscles: ['oblicuos'],
      muscleGroup: 'core', equipment: ['polea'], force: 'static',
      defaultReps: '10 c/lado',
      tips: ['Anti-rotacion - excelente para estabilidad'],
      goalFit: { fatLoss: 4, muscleGain: 5, strength: 5, endurance: 6, tone: 8 }
    }),

    // =========================================================
    //  CARDIO (11)
    // =========================================================
    mk({
      id: 'correr', name: 'Correr', nameEn: 'Running',
      primaryMuscle: 'piernas', secondaryMuscles: ['core'],
      muscleGroup: 'cardio', equipment: [], equipmentType: 'aire_libre',
      category: 'cardio', type: 'cardio', force: 'dynamic', mechanic: 'compound',
      defaultSets: 1, defaultReps: '20-40min', defaultRest: 0,
      progression: 'distance', calPerMin: 11, recovery: 24,
      instructions: ['1. Calentamiento 5 min trote suave', '2. Mantener pace objetivo', '3. Enfriar 5 min caminando'],
      tips: ['Hidratacion adecuada', 'Zapatillas apropiadas'],
      goalFit: { fatLoss: 10, muscleGain: 2, strength: 2, endurance: 10, tone: 6 }
    }),
    mk({
      id: 'caminar', name: 'Caminar Rapido', nameEn: 'Brisk Walking',
      muscleGroup: 'cardio', primaryMuscle: 'piernas',
      equipment: [], equipmentType: 'aire_libre',
      category: 'cardio', type: 'cardio', difficulty: 'principiante',
      defaultReps: '30-60min', progression: 'distance', calPerMin: 5,
      goalFit: { fatLoss: 7, muscleGain: 1, strength: 1, endurance: 7, tone: 4 }
    }),
    mk({
      id: 'escaladora', name: 'Escaladora', nameEn: 'Stair Climber',
      muscleGroup: 'cardio', primaryMuscle: 'piernas', secondaryMuscles: ['gluteos'],
      equipment: ['escaladora'], category: 'cardio', type: 'cardio',
      defaultReps: '20-30min', progression: 'time', calPerMin: 9,
      goalFit: { fatLoss: 9, muscleGain: 3, strength: 3, endurance: 8, tone: 7 }
    }),
    mk({
      id: 'eliptica', name: 'Eliptica', nameEn: 'Elliptical',
      muscleGroup: 'cardio', primaryMuscle: 'piernas',
      equipment: ['eliptica'], category: 'cardio', type: 'cardio',
      difficulty: 'principiante', defaultReps: '20-40min',
      progression: 'time', calPerMin: 8,
      goalFit: { fatLoss: 8, muscleGain: 2, strength: 2, endurance: 8, tone: 5 }
    }),
    mk({
      id: 'bicicleta_estatica', name: 'Bicicleta Estatica', nameEn: 'Stationary Bike',
      muscleGroup: 'cardio', primaryMuscle: 'piernas',
      equipment: ['bicicleta'], category: 'cardio', type: 'cardio',
      defaultReps: '20-40min', progression: 'time', calPerMin: 8,
      goalFit: { fatLoss: 8, muscleGain: 2, strength: 2, endurance: 9, tone: 5 }
    }),
    mk({
      id: 'remo_maquina', name: 'Remo en Maquina', nameEn: 'Rowing Machine',
      muscleGroup: 'cardio', primaryMuscle: 'espalda', secondaryMuscles: ['piernas', 'core'],
      equipment: ['remo_maquina'], category: 'cardio', type: 'cardio',
      defaultReps: '15-30min', calPerMin: 10,
      goalFit: { fatLoss: 9, muscleGain: 4, strength: 4, endurance: 9, tone: 7 }
    }),
    mk({
      id: 'jumping_jacks', name: 'Jumping Jacks', nameEn: 'Jumping Jacks',
      muscleGroup: 'cardio', primaryMuscle: 'full', equipment: [],
      equipmentType: 'sin_equipo', category: 'cardio', type: 'cardio',
      difficulty: 'principiante', defaultReps: '30-60s', progression: 'time', calPerMin: 9,
      goalFit: { fatLoss: 8, muscleGain: 1, strength: 1, endurance: 7, tone: 5 }
    }),
    mk({
      id: 'burpees', name: 'Burpees', nameEn: 'Burpees',
      muscleGroup: 'cardio', primaryMuscle: 'full',
      secondaryMuscles: ['piernas', 'pectoral', 'core'],
      equipment: [], equipmentType: 'sin_equipo',
      category: 'cardio', type: 'cardio', difficulty: 'intermedio',
      defaultReps: '10-15', defaultRest: 45, calPerMin: 12,
      goalFit: { fatLoss: 10, muscleGain: 4, strength: 4, endurance: 9, tone: 8 }
    }),
    mk({
      id: 'high_knees', name: 'High Knees', nameEn: 'High Knees',
      muscleGroup: 'cardio', primaryMuscle: 'piernas', secondaryMuscles: ['core'],
      equipment: [], equipmentType: 'sin_equipo',
      category: 'cardio', type: 'cardio', defaultReps: '30-45s',
      progression: 'time', calPerMin: 10,
      goalFit: { fatLoss: 9, muscleGain: 1, strength: 2, endurance: 8, tone: 6 }
    }),
    mk({
      id: 'jump_rope', name: 'Saltar Cuerda', nameEn: 'Jump Rope',
      muscleGroup: 'cardio', primaryMuscle: 'piernas', secondaryMuscles: ['hombros'],
      equipment: ['cuerda'], equipmentType: 'casa_basico',
      category: 'cardio', type: 'cardio', defaultReps: '5-15min',
      progression: 'time', calPerMin: 12,
      goalFit: { fatLoss: 10, muscleGain: 2, strength: 2, endurance: 9, tone: 7 }
    }),
    mk({
      id: 'hiit', name: 'HIIT Intervalos', nameEn: 'HIIT',
      muscleGroup: 'cardio', primaryMuscle: 'full', equipment: [],
      equipmentType: 'sin_equipo', category: 'cardio', type: 'cardio',
      difficulty: 'intermedio',
      defaultReps: '15-25min', defaultSets: 1, progression: 'time', calPerMin: 13,
      tips: ['30s intensos / 30s descanso', 'Mejor quema de grasa por tiempo'],
      goalFit: { fatLoss: 10, muscleGain: 3, strength: 3, endurance: 9, tone: 8 }
    }),

    // =========================================================
    //  FULL BODY / FUNCIONAL (11)
    // =========================================================
    mk({
      id: 'thruster', name: 'Thruster', nameEn: 'Thruster',
      primaryMuscle: 'full', secondaryMuscles: ['cuadriceps', 'hombros', 'gluteos'],
      muscleGroup: 'full', equipment: ['barra'], difficulty: 'intermedio',
      defaultReps: '8-12', defaultRest: 90, calPerMin: 10,
      instructions: ['1. Barra en racking position', '2. Sentadilla frontal', '3. Al subir, empuja la barra overhead', '4. Baja a racking y repite'],
      goalFit: { fatLoss: 9, muscleGain: 7, strength: 7, endurance: 7, tone: 8 }
    }),
    mk({
      id: 'clean_jerk', name: 'Clean & Jerk', nameEn: 'Clean and Jerk',
      primaryMuscle: 'full', secondaryMuscles: ['piernas', 'espalda', 'hombros'],
      muscleGroup: 'full', equipment: ['barra'], difficulty: 'avanzado',
      defaultReps: '3-5', defaultRest: 180, calPerMin: 10,
      goalFit: { fatLoss: 8, muscleGain: 8, strength: 10, endurance: 5, tone: 8 }
    }),
    mk({
      id: 'snatch', name: 'Snatch', nameEn: 'Snatch',
      primaryMuscle: 'full', secondaryMuscles: ['piernas', 'espalda', 'hombros'],
      muscleGroup: 'full', equipment: ['barra'], difficulty: 'avanzado',
      defaultReps: '3-5', defaultRest: 180, calPerMin: 10,
      goalFit: { fatLoss: 8, muscleGain: 8, strength: 10, endurance: 5, tone: 8 }
    }),
    mk({
      id: 'kettlebell_swing', name: 'Kettlebell Swing', nameEn: 'Kettlebell Swing',
      primaryMuscle: 'gluteos', secondaryMuscles: ['femoral', 'core', 'espalda'],
      muscleGroup: 'full', equipment: ['kettlebell'], equipmentType: 'casa_avanzado',
      difficulty: 'intermedio', defaultReps: '15-20', defaultRest: 60, calPerMin: 11,
      tips: ['Movimiento de cadera explosivo, no de brazos'],
      goalFit: { fatLoss: 9, muscleGain: 6, strength: 6, endurance: 8, tone: 8 }
    }),
    mk({
      id: 'turkish_getup', name: 'Turkish Get Up', nameEn: 'Turkish Get Up',
      primaryMuscle: 'full', secondaryMuscles: ['core', 'hombros'],
      muscleGroup: 'full', equipment: ['kettlebell'], difficulty: 'avanzado',
      defaultReps: '3-5 c/lado', defaultRest: 90,
      goalFit: { fatLoss: 6, muscleGain: 6, strength: 7, endurance: 5, tone: 8 }
    }),
    mk({
      id: 'bear_crawl', name: 'Bear Crawl', nameEn: 'Bear Crawl',
      primaryMuscle: 'full', secondaryMuscles: ['core', 'hombros'],
      muscleGroup: 'full', equipment: [], equipmentType: 'sin_equipo',
      difficulty: 'intermedio', defaultReps: '20-30 pasos', calPerMin: 9,
      goalFit: { fatLoss: 7, muscleGain: 4, strength: 5, endurance: 7, tone: 7 }
    }),
    mk({
      id: 'wall_ball', name: 'Wall Ball', nameEn: 'Wall Ball',
      primaryMuscle: 'full', secondaryMuscles: ['piernas', 'hombros'],
      muscleGroup: 'full', equipment: ['med_ball', 'pared'], difficulty: 'intermedio',
      defaultReps: '15-20', calPerMin: 11,
      goalFit: { fatLoss: 9, muscleGain: 5, strength: 5, endurance: 8, tone: 7 }
    }),
    mk({
      id: 'man_maker', name: 'Man Maker', nameEn: 'Man Maker',
      primaryMuscle: 'full', muscleGroup: 'full', equipment: ['mancuernas'],
      difficulty: 'avanzado', defaultReps: '6-10', defaultRest: 90, calPerMin: 12,
      goalFit: { fatLoss: 10, muscleGain: 6, strength: 6, endurance: 7, tone: 8 }
    }),
    mk({
      id: 'box_jump', name: 'Box Jump', nameEn: 'Box Jump',
      primaryMuscle: 'piernas', secondaryMuscles: ['gluteos', 'core'],
      muscleGroup: 'full', equipment: ['caja'], difficulty: 'intermedio',
      defaultReps: '6-10', defaultRest: 90, calPerMin: 10,
      contraindications: ['lesion rodilla', 'lesion tobillo'],
      goalFit: { fatLoss: 8, muscleGain: 5, strength: 7, endurance: 6, tone: 8 }
    }),
    mk({
      id: 'farmer_carry', name: 'Farmer Carry', nameEn: 'Farmer Carry',
      primaryMuscle: 'full', secondaryMuscles: ['antebrazo', 'trapecio', 'core'],
      muscleGroup: 'full', equipment: ['mancuernas'], equipmentType: 'casa_avanzado',
      defaultReps: '30-60s', progression: 'time', defaultRest: 60,
      goalFit: { fatLoss: 7, muscleGain: 6, strength: 7, endurance: 6, tone: 7 }
    }),
    mk({
      id: 'sled_push', name: 'Empuje de Trineo', nameEn: 'Sled Push',
      primaryMuscle: 'piernas', secondaryMuscles: ['gluteos', 'core'],
      muscleGroup: 'full', equipment: ['trineo'], difficulty: 'intermedio',
      defaultReps: '20m', calPerMin: 12,
      goalFit: { fatLoss: 9, muscleGain: 6, strength: 8, endurance: 7, tone: 8 }
    })

  ];

  // ================================================================
  //  EQUIPMENT ACCESS MATRIX
  //  Dado profile.location (gym/casa/aire_libre), que equipmentType
  //  del ejercicio es accesible.
  // ================================================================
  var LOCATION_ACCESS = {
    gym: ['gym', 'casa_basico', 'casa_avanzado', 'sin_equipo', 'aire_libre'],
    casa_avanzado: ['casa_avanzado', 'casa_basico', 'sin_equipo'],
    casa_basico: ['casa_basico', 'sin_equipo'],
    casa: ['casa_basico', 'sin_equipo'],
    aire_libre: ['aire_libre', 'sin_equipo'],
    sin_equipo: ['sin_equipo']
  };

  // ================================================================
  //  GOAL PRIORITIES - science-backed
  //  Rango de reps/rest tipico segun objetivo del usuario
  // ================================================================
  var GOAL_PARAMS = {
    fatLoss:    { sets: 3, reps: '12-15', rest: 45,  cardioMin: 25, priority: ['compound', 'full'] },
    muscleGain: { sets: 4, reps: '8-12',  rest: 75,  cardioMin: 10, priority: ['compound', 'isolation'] },
    strength:   { sets: 5, reps: '3-6',   rest: 180, cardioMin: 0,  priority: ['compound'] },
    endurance:  { sets: 3, reps: '15-20', rest: 30,  cardioMin: 30, priority: ['compound', 'cardio'] },
    tone:       { sets: 3, reps: '12-15', rest: 45,  cardioMin: 15, priority: ['isolation', 'compound'] }
  };

  // ================================================================
  //  DAY TYPE -> MUSCLE GROUP FOCUS
  // ================================================================
  var DAY_FOCUS = {
    push:   { primary: ['pecho', 'hombros'], secondary: ['brazos'], exclude: ['espalda'] },
    pull:   { primary: ['espalda'], secondary: ['brazos'], exclude: ['pecho', 'hombros'] },
    legs:   { primary: ['piernas', 'gluteos'], secondary: ['core'], exclude: [] },
    upper:  { primary: ['pecho', 'espalda', 'hombros'], secondary: ['brazos'], exclude: ['piernas'] },
    lower:  { primary: ['piernas', 'gluteos'], secondary: ['core'], exclude: [] },
    full:   { primary: ['pecho', 'espalda', 'piernas'], secondary: ['hombros', 'core'], exclude: [] },
    cardio: { primary: ['cardio'], secondary: ['core'], exclude: [] },
    core:   { primary: ['core'], secondary: [], exclude: [] }
  };

  // ================================================================
  //  recommendExercises(profile)
  //  Devuelve ejercicios ordenados por goalFit del objetivo principal.
  //  profile = {
  //    location: 'gym' | 'casa_basico' | 'casa_avanzado' | 'aire_libre' | 'sin_equipo',
  //    goal: 'fatLoss' | 'muscleGain' | 'strength' | 'endurance' | 'tone',
  //    experience: 'principiante' | 'intermedio' | 'avanzado',
  //    injuries: ['hombro', 'rodilla', ...]   (substrings to match contraindications)
  //    muscleGroup: 'pecho' (opcional filter),
  //    limit: 20 (opcional)
  //  }
  // ================================================================
  function recommendExercises(profile) {
    profile = profile || {};
    var loc = profile.location || 'gym';
    var goal = profile.goal || 'muscleGain';
    var exp = profile.experience || 'intermedio';
    var injuries = profile.injuries || [];
    var limit = profile.limit || 999;

    var allowedEquip = LOCATION_ACCESS[loc] || LOCATION_ACCESS.gym;
    var expLevels = {
      principiante: ['principiante'],
      intermedio: ['principiante', 'intermedio'],
      avanzado: ['principiante', 'intermedio', 'avanzado']
    };
    var allowedDiff = expLevels[exp] || expLevels.intermedio;

    var filtered = EXERCISE_DB.filter(function (ex) {
      // Equipment access
      if (allowedEquip.indexOf(ex.equipmentType) === -1) return false;
      // Difficulty cap
      if (allowedDiff.indexOf(ex.difficulty) === -1) return false;
      // Muscle group filter (opcional)
      if (profile.muscleGroup && ex.muscleGroup !== profile.muscleGroup) return false;
      // Contraindicaciones segun lesiones
      if (injuries.length && ex.contraindications && ex.contraindications.length) {
        for (var i = 0; i < injuries.length; i++) {
          var inj = (injuries[i] || '').toLowerCase();
          for (var j = 0; j < ex.contraindications.length; j++) {
            if (ex.contraindications[j].toLowerCase().indexOf(inj) !== -1) return false;
          }
        }
      }
      return true;
    });

    // Ordenar por goalFit
    filtered.sort(function (a, b) {
      var ga = (a.goalFit && a.goalFit[goal]) || 0;
      var gb = (b.goalFit && b.goalFit[goal]) || 0;
      return gb - ga;
    });

    return filtered.slice(0, limit);
  }

  // ================================================================
  //  buildRoutine(profile, dayType)
  //  Genera una rutina completa adaptada al objetivo y experiencia.
  // ================================================================
  function buildRoutine(profile, dayType) {
    profile = profile || {};
    dayType = dayType || 'full';
    var goal = profile.goal || 'muscleGain';
    var gp = GOAL_PARAMS[goal] || GOAL_PARAMS.muscleGain;
    var focus = DAY_FOCUS[dayType] || DAY_FOCUS.full;

    var candidates = recommendExercises(Object.assign({}, profile, { limit: 9999 }));

    // Filtrar por muscleGroup del dia
    var primaryPool = candidates.filter(function (ex) {
      return focus.primary.indexOf(ex.muscleGroup) !== -1;
    });
    var secondaryPool = candidates.filter(function (ex) {
      return focus.secondary.indexOf(ex.muscleGroup) !== -1;
    });

    // Preferir compound primero para fuerza/hipertrofia
    function sortByMechanic(list) {
      return list.slice().sort(function (a, b) {
        var aScore = (a.mechanic === 'compound' ? 2 : 0) + (a.goalFit[goal] || 0) / 10;
        var bScore = (b.mechanic === 'compound' ? 2 : 0) + (b.goalFit[goal] || 0) / 10;
        return bScore - aScore;
      });
    }

    var pickedIds = {};
    var picks = [];

    function pushEx(ex, sets, reps, rest) {
      if (pickedIds[ex.id]) return;
      pickedIds[ex.id] = true;
      picks.push({
        exKey: ex.id,
        name: ex.name,
        muscleGroup: ex.muscleGroup,
        primaryMuscle: ex.primaryMuscle,
        sets: sets != null ? sets : (ex.defaultSets || gp.sets),
        reps: reps != null ? reps : (ex.defaultReps || gp.reps),
        rest: rest != null ? rest : (ex.defaultRest || gp.rest),
        weight: null
      });
    }

    var sortedPrimary = sortByMechanic(primaryPool);
    var sortedSecondary = sortByMechanic(secondaryPool);

    // Distribuir: 2-3 compound primarios + 2-3 accesorios primarios + 1-2 secundarios
    var target = goal === 'strength' ? 5 : (goal === 'endurance' || goal === 'fatLoss' ? 7 : 6);
    var primaryCount = Math.max(3, Math.ceil(target * 0.7));
    var secondaryCount = target - primaryCount;

    // Asegurar balance por muscleGroup dentro del primary
    var usedGroups = {};
    for (var i = 0; i < sortedPrimary.length && picks.length < primaryCount; i++) {
      var ex = sortedPrimary[i];
      // Si es el primer ejercicio del grupo o compound, siempre lo tomamos
      var group = ex.muscleGroup;
      usedGroups[group] = (usedGroups[group] || 0);
      // Limitar 3 por grupo muscular
      if (usedGroups[group] >= 3) continue;
      pushEx(ex, gp.sets, ex.defaultReps || gp.reps, gp.rest);
      usedGroups[group]++;
    }
    // Secundarios
    for (var k = 0; k < sortedSecondary.length && picks.length < target; k++) {
      pushEx(sortedSecondary[k], Math.max(3, gp.sets - 1), gp.reps, Math.max(30, gp.rest - 15));
    }

    // Si falta por pocos, rellenar con core
    if (picks.length < target) {
      var coreList = candidates.filter(function (e) { return e.muscleGroup === 'core'; });
      for (var m = 0; m < coreList.length && picks.length < target; m++) {
        pushEx(coreList[m], 3, coreList[m].defaultReps, 45);
      }
    }

    // Cardio al final si objetivo lo requiere
    if (gp.cardioMin > 0 && dayType !== 'cardio') {
      var cardio = candidates.filter(function (e) { return e.muscleGroup === 'cardio'; });
      if (cardio.length) {
        // Elegir uno accesible (primero por ranking)
        pushEx(cardio[0], 1, gp.cardioMin + 'min', 0);
      }
    }

    return {
      dayType: dayType,
      goal: goal,
      totalExercises: picks.length,
      estimatedDuration: estimateDuration(picks),
      exercises: picks
    };
  }

  function estimateDuration(picks) {
    // setTime ~ 45s/rep * reps + rest
    var total = 0;
    picks.forEach(function (p) {
      var sets = parseInt(p.sets, 10) || 3;
      var restPerSet = parseInt(p.rest, 10) || 60;
      total += sets * 60 + sets * restPerSet; // ~60s por serie trabajo
    });
    return Math.round(total / 60) + ' min';
  }

  // ================================================================
  //  Helpers de busqueda / acceso
  // ================================================================
  function findById(id) {
    for (var i = 0; i < EXERCISE_DB.length; i++) {
      if (EXERCISE_DB[i].id === id) return EXERCISE_DB[i];
    }
    return null;
  }
  function search(query) {
    query = (query || '').toLowerCase();
    if (!query) return [];
    return EXERCISE_DB.filter(function (ex) {
      return ex.name.toLowerCase().indexOf(query) !== -1 ||
             (ex.nameEn && ex.nameEn.toLowerCase().indexOf(query) !== -1) ||
             ex.primaryMuscle.toLowerCase().indexOf(query) !== -1 ||
             ex.muscleGroup.toLowerCase().indexOf(query) !== -1;
    });
  }
  function byMuscleGroup(mg) {
    return EXERCISE_DB.filter(function (ex) { return ex.muscleGroup === mg; });
  }

  // ================================================================
  //  Export global
  // ================================================================
  global.ExerciseDB = {
    EXERCISES: EXERCISE_DB,
    LOCATION_ACCESS: LOCATION_ACCESS,
    GOAL_PARAMS: GOAL_PARAMS,
    DAY_FOCUS: DAY_FOCUS,
    recommendExercises: recommendExercises,
    buildRoutine: buildRoutine,
    findById: findById,
    search: search,
    byMuscleGroup: byMuscleGroup,
    count: EXERCISE_DB.length
  };

  // Node/CommonJS compat (para scripts CLI)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = global.ExerciseDB;
  }

})(typeof window !== 'undefined' ? window : globalThis);
