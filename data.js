// ================================================================
//  FITRICARDO - DATA LAYER
// ================================================================

const DAY_NAMES=['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'];
const DAY_SHORT=['Dom','Lun','Mar','Mie','Jue','Vie','Sab'];
const MONTHS=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

// ===== MEALS =====
const MEALS={
  desayuno:{time:'07:00',label:'Desayuno',fixed:true,desc:'4 Huevos (2 enteros + 2 claras), 2 Arepas/Tortillas de maiz (sin aceite), Te de canela con Stevia',alts:['3 Huevos revueltos + 1 arepa','Avena con proteina + 1 huevo','Omelette de claras + jamon pavo + tortilla'],cal:450,prep:15},
  merienda1:{time:'10:00',label:'Merienda 1',byDay:{
    0:{d:'Cafe negro',a:['Te verde','Americano'],c:5,p:3},1:{d:'Yogurt Griego',a:['Cafe negro','Te verde'],c:120,p:1},2:{d:'Cafe negro',a:['Te canela','Americano'],c:5,p:3},
    3:{d:'Yogurt Griego',a:['Cafe negro','Almendras'],c:120,p:1},4:{d:'Cafe negro',a:['Te verde','Yogurt griego'],c:5,p:3},5:{d:'Punado de nueces',a:['Yogurt griego','Cafe + almendras'],c:160,p:0},6:{d:'Libre',a:['Yogurt griego','Cafe con leche almendras'],c:100,p:0}}},
  almuerzo:{time:'12:00',label:'Almuerzo',byDay:{
    0:{d:'Carne guisada + 1 taza Arroz + Lentejas',a:['Pechuga plancha + arroz + lentejas','Carne molida + arroz + porotos'],c:650,p:5},
    1:{d:'Carne guisada + 1 taza Arroz + Lentejas',a:['Pechuga plancha + arroz + lentejas','Bistec encebollado + arroz'],c:650,p:5},
    2:{d:'Carne guisada + 1 taza Arroz + Lentejas',a:['Pollo guisado + arroz + lentejas','Carne molida + arroz + porotos'],c:650,p:5},
    3:{d:'Pollo guisado + 1 taza Arroz + Porotos',a:['Pechuga plancha + arroz + porotos','Carne guisada + arroz'],c:600,p:5},
    4:{d:'Pollo guisado + 1 taza Arroz + Porotos',a:['Pescado plancha + arroz','Carne guisada + arroz + lentejas'],c:600,p:5},
    5:{d:'Sopa de Pollo (Mucha presa, 1 name)',a:['Sancocho de res','Caldo pollo con papa'],c:550,p:10},
    6:{d:'Pescado o Pollo asado + 1 taza Arroz',a:['Carne asada + arroz','Salmon al horno + arroz'],c:580,p:15}}},
  merienda2:{time:'16:30',label:'Merienda 2',byDay:{
    0:{d:'1 Manzana',a:['1 Pera','1 Naranja','10 Almendras'],c:95,p:0},1:{d:'1 Pera',a:['1 Manzana','10 Almendras'],c:100,p:0},
    2:{d:'10 Almendras',a:['1 Fruta','Yogurt griego','Atun'],c:140,p:0},3:{d:'1 Lata de Atun',a:['10 Almendras','1 Fruta'],c:120,p:0},
    4:{d:'1 Fruta',a:['10 Almendras','Atun','Yogurt'],c:90,p:0},5:{d:'1 Fruta',a:['Yogurt griego','10 Almendras'],c:90,p:0},
    6:{d:'Yogurt Griego',a:['1 Fruta','10 Almendras'],c:120,p:0}}},
  cena:{time:'20:30',label:'Cena',byDay:{
    0:{d:'Carne guisada (sin arroz) + 10 Almendras',a:['Pollo plancha + almendras','Atun con aguacate'],c:400,p:5},
    1:{d:'Carne guisada (sin arroz) + 1 cda Mant. Mani',a:['Pollo desmenuzado + almendras','3 claras revueltas'],c:380,p:5},
    2:{d:'Cena Jennifer: Corte carne o Salmon',a:['Pechuga plancha','Salmon horno','Atun plancha'],c:450,p:0},
    3:{d:'Pollo guisado (sin arroz)',a:['Carne plancha','3 Huevos revueltos','Atun + limon'],c:350,p:5},
    4:{d:'Pollo guisado o Salmon plancha',a:['Carne plancha','Atun + aguacate','3 Huevos + almendras'],c:380,p:5},
    5:{d:'Parrillada (Carnes mixtas, cero harinas)',a:['Carne asada sola','Pollo asado'],c:500,p:0},
    6:{d:'3-4 Huevos revueltos (Cena ligera)',a:['Atun + limon','Yogurt + almendras'],c:300,p:10}}},
  fibra:{time:'21:30',label:'Fibra (Antes dormir)',fixed:true,desc:'Vaso de agua con Fibra (Metamucil/Psyllium)',alts:['Linaza molida en agua','Chia en agua (remojar 15 min)'],cal:15,prep:2}
};
const MEAL_ORDER=['desayuno','merienda1','almuerzo','merienda2','cena','fibra'];

function getMeal(key,dow){
  const m=MEALS[key];
  if(m.fixed)return{desc:m.desc,alts:m.alts,cal:m.cal,prep:m.prep,time:m.time,label:m.label};
  const d=m.byDay[dow];return{desc:d.d,alts:d.a,cal:d.c,prep:d.p,time:m.time,label:m.label};
}

// ===== EXERCISES =====
const EX={
  hip_thrust:{name:'Hip Thrust',muscle:'Gluteos',group:'Tren Inferior',equip:'Barra + Banco',dw:40,
    how:'1. Espalda media contra banco\n2. Barra sobre caderas (usa pad)\n3. Pies ancho de hombros, rodillas 90°\n4. Empuja caderas arriba, torso paralelo al piso\n5. Aprieta gluteos 2 seg arriba\n6. Baja controlado',
    muscles:'Gluteo mayor, Gluteo medio, Isquiotibiales, Core',errors:'No subir caderas suficiente | Arquear espalda | Empujar con pies',
    tip:'Sin barra: usa mancuerna o peso corporal',breath:'Exhala al subir, inhala al bajar',machine:'Banco plano + Barra (o Smith Machine)'},
  press_inclinado:{name:'Press Banca Inclinado',muscle:'Pecho Superior',group:'Tren Superior',equip:'Banco inclinado + Mancuernas',dw:15,
    how:'1. Banco a 30-45°\n2. Mancuernas a la altura del pecho\n3. Pies firmes, espalda pegada\n4. Baja controlado, codos a 90°\n5. Empuja explosivo arriba\n6. No choques mancuernas',
    muscles:'Pectoral superior, Deltoides anterior, Triceps',errors:'Angulo muy alto | Rebotar abajo | Espalda despegada | Codos muy abiertos',
    tip:'30° es ideal. A 45° ya trabaja mucho hombro. Baja 3 seg, sube 1 seg.',breath:'Inhala al bajar, exhala al empujar',machine:'Banco ajustable + Mancuernas'},
  sentadilla_bulgara:{name:'Sentadilla Bulgara',muscle:'Piernas + Gluteos',group:'Tren Inferior',equip:'Mancuernas + Banco',dw:10,
    how:'1. De espaldas al banco, pie trasero en banco\n2. Pie delantero ~60cm adelante\n3. Baja controlado con mancuernas\n4. Rodilla no pasa punta del pie\n5. Muslo paralelo al piso\n6. Sube con talon delantero',
    muscles:'Cuadriceps, Gluteos, Isquiotibiales, Core',errors:'Rodilla va hacia adentro | Torso muy inclinado | Pie muy cerca',
    tip:'Si pierdes equilibrio, hazlo sin peso primero.',breath:'Inhala al bajar, exhala al subir',machine:'Banco + Mancuernas'},
  cruce_poleas:{name:'Cruce de Poleas',muscle:'Pecho Central',group:'Tren Superior',equip:'Poleas / Peck Deck',dw:25,
    how:'1. Poleas a altura del pecho\n2. Paso al frente, torso ligeramente inclinado\n3. Brazos semi-extendidos, junta manos al frente\n4. Aprieta pecho al centro 1-2 seg\n5. Abre controlado\n6. Peck Deck: asiento para brazos a 90°',
    muscles:'Pectoral medio, Pectoral menor, Deltoides anterior',errors:'Mucho peso | No apretar al centro | Brazos muy estirados',
    tip:'Ejercicio de SENSACION. Peso moderado, siente el pecho.',breath:'Exhala al cerrar, inhala al abrir',machine:'Peck Deck o Cable Crossover'},
  patada_gluteo:{name:'Patada Gluteo en Polea',muscle:'Gluteos',group:'Tren Inferior',equip:'Polea baja / Maquina',dw:15,
    how:'1. Polea baja, tobillera enganchada\n2. De pie frente a maquina\n3. Inclina torso ligeramente\n4. Pierna recta hacia atras\n5. Aprieta gluteo arriba 1 seg\n6. Regresa controlado',
    muscles:'Gluteo mayor, Gluteo medio, Isquiotibiales',errors:'Balancear cuerpo | Arquear espalda | Usar impulso',
    tip:'Lento y controlado. Sin polea: en 4 puntos en el piso.',breath:'Exhala al patear, inhala al regresar',machine:'Cable Machine + tobillera'},
  plancha:{name:'Plancha Abdominal',muscle:'Core / Abdomen',group:'Core',equip:'Ninguno',dw:0,isTime:true,
    how:'1. Antebrazos en piso, codos bajo hombros\n2. Piernas extendidas, puntas de pies\n3. Cuerpo RECTO como tabla\n4. Aprieta abdomen\n5. Manten posicion\n6. Respira normal',
    muscles:'Recto abdominal, Oblicuos, Transverso, Erectores',errors:'Cadera muy alta | Cadera caida | Mirar al frente | Aguantar respiracion',
    tip:'30 seg si 1 min es mucho. Calidad > tiempo.',breath:'Normal y constante',machine:'Solo piso (mat)'},
  jalon_pecho:{name:'Jalon al Pecho',muscle:'Espalda (Dorsal)',group:'Tren Superior',equip:'Polea alta + barra ancha',dw:40,
    how:'1. Sientate, ajusta soporte piernas\n2. Agarre pronado en barra ancha\n3. Inclina torso 15-20° atras\n4. Jala barra al pecho alto\n5. Aprieta escapulas\n6. Sube controlado',
    muscles:'Dorsal ancho, Redondo mayor, Romboides, Biceps',errors:'Jalar con biceps | Inclinarse mucho | Barra atras del cuello',
    tip:'Jala con los CODOS, no con las manos. Activa mas espalda.',breath:'Exhala al jalar, inhala al subir',machine:'Lat Pulldown Machine'},
  remo_sentado:{name:'Remo Sentado Cable',muscle:'Espalda Media',group:'Tren Superior',equip:'Polea baja + agarre V',dw:35,
    how:'1. Sientate frente a polea, pies en soportes\n2. Rodillas ligeramente flexionadas\n3. Jala handle al abdomen\n4. Saca pecho, aprieta escapulas\n5. Manten 1 seg\n6. Extiende controlado',
    muscles:'Romboides, Trapecio medio, Dorsal, Biceps',errors:'Redondear espalda | Usar impulso | No apretar escapulas',
    tip:'Aprieta escapulas como rompiendo una nuez entre ellas.',breath:'Exhala al jalar, inhala al extender',machine:'Seated Row Machine'},
  vuelos_laterales:{name:'Vuelos Laterales',muscle:'Hombro Lateral',group:'Tren Superior',equip:'Mancuernas',dw:8,
    how:'1. De pie, mancuernas a los lados\n2. Torso ligeramente inclinado\n3. Sube a los lados como alas\n4. Hasta altura de hombros\n5. Codos ligeramente flexionados\n6. Baja controlado 3 seg',
    muscles:'Deltoides lateral, Deltoides posterior, Trapecio',errors:'Peso MUY pesado | Subir hombros | Brazos estirados | Impulso',
    tip:'PESO LIGERO! 8 lbs con forma perfecta > 15 lbs con swing.',breath:'Exhala al subir, inhala al bajar',machine:'Mancuernas'},
  press_militar:{name:'Press Militar Sentado',muscle:'Hombro Frontal',group:'Tren Superior',equip:'Mancuernas + Banco 90°',dw:12,
    how:'1. Banco a 90° con respaldo\n2. Mancuernas a altura de orejas\n3. Empuja arriba (no bloquear codos)\n4. Baja controlado a 90°\n5. Core apretado siempre',
    muscles:'Deltoides anterior/medio, Triceps, Trapecio, Serrato',errors:'Arquear espalda | Bajar debajo orejas | Bloquear codos',
    tip:'Si duelen hombros: agarre neutro (palmas hacia ti).',breath:'Exhala arriba, inhala al bajar',machine:'Shoulder Press Machine'},
  biceps_triceps:{name:'Superserie: Biceps + Triceps',muscle:'Brazos',group:'Tren Superior',equip:'Mancuernas / Poleas',dw:10,
    how:'BICEPS: Curl 12 reps (palmas frente, flexiona codos, aprieta arriba)\nSIN DESCANSO\nTRICEPS: Extension sobre cabeza 12 reps (mancuerna ambas manos, extiende arriba)',
    muscles:'Biceps braquial, Braquial, Triceps (3 cabezas)',errors:'Mover codos | Usar impulso | Descansar entre ejercicios',
    tip:'NO descansar entre biceps y triceps. Congestiona al maximo.',breath:'Exhala en contraccion, inhala al estirar',machine:'Mancuernas o Poleas'},

  // ===== PECHO =====
  press_banca:{name:'Press Banca Plano',muscle:'Pecho',group:'Tren Superior',equip:'Barra + Banco plano',dw:45,
    how:'1. Acostado, espalda firme en banco\n2. Barra sobre el pecho medio\n3. Agarre un poco mas ancho que hombros\n4. Baja controlado al pecho\n5. Empuja hasta extender codos\n6. No rebotar',
    muscles:'Pectoral mayor, Deltoides anterior, Triceps',errors:'Rebotar barra | Codos muy abiertos | Espalda despegada | No bajar hasta el pecho',
    tip:'Bloquea escapulas contra el banco. Trayectoria suave.',breath:'Inhala al bajar, exhala al empujar',machine:'Banco plano + Barra'},
  press_mancuernas:{name:'Press Mancuernas Plano',muscle:'Pecho',group:'Tren Superior',equip:'Mancuernas + Banco plano',dw:20,
    how:'1. Acostado con mancuernas a la altura del pecho\n2. Palmas mirando hacia los pies\n3. Empuja arriba sin chocar\n4. Baja controlado 90°\n5. Core firme',
    muscles:'Pectoral mayor, Deltoides anterior, Triceps',errors:'Chocar mancuernas | Bajar muy rapido | Arquear mucho',
    tip:'Mancuernas dan mas rango de movimiento que barra.',breath:'Inhala al bajar, exhala al empujar',machine:'Banco plano + Mancuernas'},
  aperturas:{name:'Aperturas con Mancuernas',muscle:'Pecho',group:'Tren Superior',equip:'Mancuernas + Banco',dw:10,
    how:'1. Acostado, mancuernas arriba con codos semiflex\n2. Abre brazos en arco hacia los lados\n3. Siente el estiramiento del pecho\n4. Regresa juntando las manos arriba',
    muscles:'Pectoral mayor, Deltoides anterior',errors:'Codos rectos | Peso excesivo | Bajar demasiado',
    tip:'Peso ligero, enfoque en la contraccion del pecho.',breath:'Inhala al abrir, exhala al juntar',machine:'Banco + Mancuernas'},
  fondos:{name:'Fondos en Paralelas',muscle:'Pecho + Triceps',group:'Tren Superior',equip:'Barras paralelas',dw:0,
    how:'1. Sujeta las barras paralelas\n2. Inclina torso para enfocar pecho\n3. Baja hasta 90° en codos\n4. Empuja arriba sin bloquear codos\n5. Manten core activo',
    muscles:'Pectoral inferior, Triceps, Deltoides anterior',errors:'Bajar demasiado | Torso recto (trabaja triceps) | Impulso',
    tip:'Para pecho: inclina el torso. Para triceps: mantenlo recto.',breath:'Inhala al bajar, exhala al empujar',machine:'Dip Station o paralelas'},

  // ===== ESPALDA =====
  dominadas:{name:'Dominadas',muscle:'Espalda',group:'Tren Superior',equip:'Barra de dominadas',dw:0,
    how:'1. Cuelgate con agarre pronado, manos ancho de hombros\n2. Activa escapulas primero\n3. Jala con los codos hasta subir menton sobre la barra\n4. Baja controlado, extiende completo',
    muscles:'Dorsal ancho, Romboides, Biceps, Trapecio',errors:'Impulso | No completar rango | Subir solo con brazos',
    tip:'Si no puedes: usa banda elastica o maquina asistida.',breath:'Exhala al subir, inhala al bajar',machine:'Barra fija o Assisted Pull-Up'},
  remo_barra:{name:'Remo con Barra',muscle:'Espalda Media',group:'Tren Superior',equip:'Barra',dw:50,
    how:'1. Parado, inclina torso 45°\n2. Agarra la barra ancho de hombros\n3. Jala hacia el abdomen bajo\n4. Aprieta escapulas arriba\n5. Baja controlado',
    muscles:'Dorsal, Romboides, Trapecio medio, Biceps',errors:'Redondear espalda | Jalar con biceps | Demasiado peso',
    tip:'Espalda neutra siempre. El movimiento es de los codos hacia atras.',breath:'Exhala al jalar, inhala al bajar',machine:'Barra libre'},
  remo_mancuerna:{name:'Remo con Mancuerna',muscle:'Espalda (unilateral)',group:'Tren Superior',equip:'Mancuerna + Banco',dw:25,
    how:'1. Rodilla y mano en el banco, torso paralelo al piso\n2. Mancuerna en mano libre\n3. Jala hacia la cadera\n4. Codo cerca del cuerpo\n5. Controla la bajada',
    muscles:'Dorsal, Romboides, Biceps, Core',errors:'Rotar torso | Usar impulso | Hombro encogido',
    tip:'Manten cadera y hombros paralelos al piso.',breath:'Exhala al jalar, inhala al bajar',machine:'Banco + Mancuerna'},
  pulldown:{name:'Pulldown Polea Alta',muscle:'Espalda',group:'Tren Superior',equip:'Polea alta',dw:50,
    how:'1. Sentado con muslos bajo el soporte\n2. Agarre pronado amplio\n3. Inclina torso 15°\n4. Jala la barra al pecho superior\n5. Aprieta escapulas y sube controlado',
    muscles:'Dorsal ancho, Romboides, Biceps',errors:'Jalar detras del cuello | Balancearse | Codos hacia atras',
    tip:'Piensa en llevar los codos hacia abajo y atras.',breath:'Exhala al jalar, inhala al subir',machine:'Lat Pulldown'},
  jalones:{name:'Jalones Polea (agarre cerrado)',muscle:'Espalda',group:'Tren Superior',equip:'Polea alta + agarre V',dw:45,
    how:'1. Sentado, agarre en V (palmas enfrentadas)\n2. Inclina torso ligeramente\n3. Jala al esternon\n4. Aprieta dorsales\n5. Sube controlado',
    muscles:'Dorsal, Redondo mayor, Biceps',errors:'Mucho peso | No completar el rango | Balanceo',
    tip:'Agarre cerrado = mas enfasis en mitad del dorsal.',breath:'Exhala al jalar, inhala al subir',machine:'Lat Pulldown + Agarre V'},

  // ===== HOMBROS (extra) =====
  press_mancuernas_hombro:{name:'Press Mancuernas Hombro',muscle:'Hombro',group:'Tren Superior',equip:'Mancuernas + Banco 90°',dw:15,
    how:'1. Sentado con respaldo a 90°\n2. Mancuernas a la altura de orejas, palmas al frente\n3. Empuja arriba sin chocar\n4. Baja controlado\n5. Core apretado',
    muscles:'Deltoides anterior, Medio, Triceps',errors:'Arquear espalda | Bloquear codos | Chocar mancuernas',
    tip:'Si duele el hombro, usa agarre neutro (palmas enfrentadas).',breath:'Exhala al empujar, inhala al bajar',machine:'Banco 90° + Mancuernas'},
  posteriores:{name:'Vuelos Posteriores',muscle:'Hombro Posterior',group:'Tren Superior',equip:'Mancuernas',dw:8,
    how:'1. Inclina torso 45° adelante\n2. Mancuernas colgando\n3. Abre brazos hacia atras como alas\n4. Codos ligeramente flexionados\n5. Aprieta escapulas\n6. Baja controlado',
    muscles:'Deltoides posterior, Romboides, Trapecio',errors:'Mucho peso | Usar impulso | Levantar hombros',
    tip:'Peso muy ligero. Enfoque en sentir la parte trasera del hombro.',breath:'Exhala al subir, inhala al bajar',machine:'Mancuernas o Reverse Fly Machine'},

  // ===== BRAZOS =====
  curl_biceps_barra:{name:'Curl Biceps con Barra',muscle:'Biceps',group:'Tren Superior',equip:'Barra Z o recta',dw:30,
    how:'1. De pie, agarre supino ancho de hombros\n2. Codos pegados al torso\n3. Flexiona subiendo la barra al pecho\n4. Aprieta biceps arriba\n5. Baja controlado',
    muscles:'Biceps braquial, Braquial, Antebrazo',errors:'Balancearse | Mover codos | No extender abajo',
    tip:'Si usas impulso, baja el peso. Control > ego.',breath:'Exhala al subir, inhala al bajar',machine:'Barra Z o recta'},
  curl_biceps_mancuernas:{name:'Curl Biceps con Mancuernas',muscle:'Biceps',group:'Tren Superior',equip:'Mancuernas',dw:12,
    how:'1. De pie o sentado, mancuernas a los lados\n2. Palmas al frente o neutras\n3. Flexiona subiendo al hombro\n4. Rota palmas hacia arriba (supinacion)\n5. Baja controlado',
    muscles:'Biceps braquial, Braquial',errors:'Mover codos | Balanceo | Mucho peso',
    tip:'Supinacion en la subida activa mas biceps.',breath:'Exhala al subir, inhala al bajar',machine:'Mancuernas'},
  extension_triceps:{name:'Extension de Triceps en Polea',muscle:'Triceps',group:'Tren Superior',equip:'Polea alta + cuerda/barra',dw:30,
    how:'1. De pie frente a polea alta\n2. Agarra cuerda o barra\n3. Codos pegados al cuerpo\n4. Extiende hacia abajo hasta bloquear\n5. Sube controlado sin separar codos',
    muscles:'Triceps (3 cabezas)',errors:'Mover codos | Usar espalda | Mucho peso',
    tip:'Codos como bisagras fijas.',breath:'Exhala al extender, inhala al subir',machine:'Polea alta + Cuerda'},
  martillo:{name:'Curl Martillo',muscle:'Biceps/Braquial',group:'Tren Superior',equip:'Mancuernas',dw:12,
    how:'1. De pie, mancuernas a los lados\n2. Palmas enfrentadas (agarre neutro)\n3. Flexiona sin rotar\n4. Sube al hombro\n5. Baja controlado',
    muscles:'Braquial, Biceps, Antebrazo',errors:'Balanceo | Mover codos | Rotar muneca',
    tip:'Agarre neutro protege la muneca y activa braquial.',breath:'Exhala al subir, inhala al bajar',machine:'Mancuernas'},

  // ===== PIERNAS =====
  sentadilla:{name:'Sentadilla con Barra',muscle:'Piernas',group:'Tren Inferior',equip:'Barra + Rack',dw:60,
    how:'1. Barra sobre trapecio\n2. Pies ancho de hombros, puntas ligeramente afuera\n3. Baja como sentandote atras\n4. Muslos paralelos al piso\n5. Sube empujando con talones',
    muscles:'Cuadriceps, Gluteos, Isquiotibiales, Core',errors:'Rodillas adentro | Talones despegados | Espalda redondeada',
    tip:'Pecho arriba, mirada al frente, core firme.',breath:'Inhala al bajar, exhala al subir',machine:'Squat Rack + Barra'},
  prensa:{name:'Prensa de Piernas',muscle:'Piernas',group:'Tren Inferior',equip:'Maquina de prensa',dw:150,
    how:'1. Sientate en la maquina, espalda firme\n2. Pies ancho de hombros en plataforma\n3. Baja hasta 90° en rodillas\n4. Empuja sin bloquear codos\n5. No despegar cadera',
    muscles:'Cuadriceps, Gluteos, Isquiotibiales',errors:'Bloquear rodillas | Bajar poco | Cadera despega',
    tip:'Pies mas altos en plataforma = mas gluteo.',breath:'Inhala al bajar, exhala al empujar',machine:'Leg Press 45°'},
  curl_femoral:{name:'Curl Femoral',muscle:'Isquiotibiales',group:'Tren Inferior',equip:'Maquina',dw:40,
    how:'1. Acostado boca abajo en maquina\n2. Tobillos bajo el rodillo\n3. Flexiona rodillas llevando talones a gluteos\n4. Aprieta arriba 1 seg\n5. Baja controlado',
    muscles:'Isquiotibiales, Gemelos',errors:'Despegar cadera | Balanceo | Mucho peso',
    tip:'Controla la bajada 3 segundos.',breath:'Exhala al flexionar, inhala al bajar',machine:'Leg Curl Machine'},
  extension_cuadriceps:{name:'Extension de Cuadriceps',muscle:'Cuadriceps',group:'Tren Inferior',equip:'Maquina',dw:40,
    how:'1. Sentado en maquina, tobillos bajo rodillo\n2. Espalda contra respaldo\n3. Extiende rodillas\n4. Aprieta cuadriceps arriba 1 seg\n5. Baja controlado',
    muscles:'Cuadriceps (4 cabezas)',errors:'Balanceo | Bloquear rodilla bruscamente | Mucho peso',
    tip:'Extension completa + pausa arriba = mas activacion.',breath:'Exhala al extender, inhala al bajar',machine:'Leg Extension'},
  peso_muerto:{name:'Peso Muerto',muscle:'Espalda baja + Piernas',group:'Tren Inferior',equip:'Barra',dw:70,
    how:'1. Pies bajo la barra ancho de cadera\n2. Agarra la barra fuera de las piernas\n3. Pecho arriba, espalda neutra\n4. Sube empujando el piso con las piernas\n5. Extiende cadera al final, aprieta gluteos',
    muscles:'Gluteos, Isquiotibiales, Dorsal, Trapecio, Core',errors:'Redondear espalda | Separar barra del cuerpo | Hiperextender arriba',
    tip:'La barra debe subir pegada a las piernas.',breath:'Inhala antes de subir, exhala al final',machine:'Barra + Discos'},
  zancadas:{name:'Zancadas con Mancuernas',muscle:'Piernas + Gluteos',group:'Tren Inferior',equip:'Mancuernas',dw:15,
    how:'1. De pie, mancuernas a los lados\n2. Da un paso al frente largo\n3. Baja hasta rodilla trasera casi toca\n4. Empuja con el talon delantero\n5. Alterna piernas',
    muscles:'Cuadriceps, Gluteos, Isquiotibiales, Core',errors:'Rodilla pasa punta del pie | Paso corto | Torso inclinado',
    tip:'Paso largo = mas gluteo. Paso corto = mas cuadriceps.',breath:'Inhala al bajar, exhala al subir',machine:'Mancuernas'},

  // ===== GLUTEOS (extra) =====
  abduccion_cadera:{name:'Abduccion de Cadera',muscle:'Gluteo medio',group:'Tren Inferior',equip:'Maquina abductora',dw:40,
    how:'1. Sentado en maquina, espalda firme\n2. Rodillas contra las almohadillas\n3. Abre piernas contra la resistencia\n4. Aprieta gluteo medio\n5. Cierra controlado',
    muscles:'Gluteo medio, Gluteo menor',errors:'Mover torso | Mucho peso | Rango corto',
    tip:'Inclinate ligeramente al frente para mas activacion.',breath:'Exhala al abrir, inhala al cerrar',machine:'Hip Abductor'},

  // ===== CORE =====
  crunches:{name:'Crunches Abdominales',muscle:'Abdomen',group:'Core',equip:'Colchoneta',dw:0,
    how:'1. Acostado boca arriba, rodillas flexionadas\n2. Manos en las sienes (no jalar cuello)\n3. Contrae abdomen subiendo hombros\n4. Pausa arriba 1 seg\n5. Baja controlado',
    muscles:'Recto abdominal superior',errors:'Jalar cuello | Subir mucho | Impulso',
    tip:'El movimiento es pequeno. La clave es la contraccion.',breath:'Exhala al subir, inhala al bajar',machine:'Mat'},
  elevacion_piernas:{name:'Elevacion de Piernas',muscle:'Abdomen inferior',group:'Core',equip:'Colchoneta o barra',dw:0,
    how:'1. Acostado boca arriba, manos bajo gluteos\n2. Piernas estiradas\n3. Sube piernas hasta 90°\n4. Baja sin tocar el piso\n5. Manten abdomen apretado',
    muscles:'Recto abdominal inferior, Flexores de cadera',errors:'Despegar espalda baja | Balanceo | No controlar la bajada',
    tip:'Si duele la espalda, flexiona ligeramente las rodillas.',breath:'Exhala al subir, inhala al bajar',machine:'Mat o Captain Chair'},
  russian_twist:{name:'Russian Twist',muscle:'Oblicuos',group:'Core',equip:'Mancuerna o disco',dw:10,
    how:'1. Sentado con rodillas flexionadas\n2. Torso inclinado 45° atras\n3. Pies arriba del piso (opcional)\n4. Rota de lado a lado con peso\n5. Toca el piso a cada lado',
    muscles:'Oblicuos, Recto abdominal, Core',errors:'Mover brazos solos | Espalda redondeada | Poco rango',
    tip:'La rotacion viene del torso, no de los brazos.',breath:'Normal y constante',machine:'Mat + Mancuerna'}
};

const RUT_A={id:'A',name:'Rutina A: Gluteos y Pecho',time:'5:00-6:00 AM',
  ex:[{id:'hip_thrust',s:4,r:'15',rest:60},{id:'press_inclinado',s:4,r:'12',rest:60},{id:'sentadilla_bulgara',s:3,r:'12 c/pierna',rest:45},{id:'cruce_poleas',s:3,r:'15',rest:45},{id:'patada_gluteo',s:3,r:'15 c/pierna',rest:45},{id:'plancha',s:3,r:'1 min',rest:45}]};
const RUT_B={id:'B',name:'Rutina B: Espalda y Hombros',time:'5:00-6:00 AM',
  ex:[{id:'jalon_pecho',s:4,r:'12',rest:60},{id:'remo_sentado',s:3,r:'12',rest:60},{id:'vuelos_laterales',s:4,r:'15',rest:45},{id:'press_militar',s:3,r:'10',rest:60},{id:'biceps_triceps',s:3,r:'12 c/u',rest:45}]};

const CARDIO=[
  {id:'caminadora',icon:'🚶',name:'Caminadora',sub:'Mejor para grasa abdominal',dur:'45-60 min',det:'Inclinacion 10-12%, Vel 4.2-4.5 km/h. CAMINAR.',cal:350},
  {id:'eliptica',icon:'🏋️',name:'Eliptica',sub:'Bajo impacto',dur:'45 min',det:'Resistencia 8-10. Ritmo constante.',cal:320},
  {id:'bicicleta',icon:'🚴',name:'Bicicleta',sub:'Intervalos',dur:'45 min',det:'5 min suave + 30 min (1 rapido/1 lento) + 10 suave.',cal:300}
];

const SCHED={0:{g:null,c:false},1:{g:'A',c:true},2:{g:'B',c:true},3:{g:'A',c:true},4:{g:'B',c:true},5:{g:'A',c:true},6:{g:null,c:'opt'}};
const BATCH={0:{t:'Lote 1: Carne/Puerco guisado + Lentejas/Porotos',p:'Lunes-Miercoles',e:'1.5-2h'},3:{t:'Lote 2: Pollo/Pescado guisado + Menestras',p:'Jueves-Viernes',e:'1-1.5h'},4:{t:'Lote 2: Pollo/Pescado guisado + Menestras',p:'Jueves-Viernes',e:'1-1.5h'}};

// ===== FOOD DATABASE =====
const FOOD={
  pizza:{n:'Pizza (1 porcion)',c:285,p:12,cb:36,f:10,v:'warn',note:'1 porcion=285 cal. Pizza entera ~2000. Max 1-2 porciones.'},
  hamburguesa:{n:'Hamburguesa',c:540,p:25,cb:40,f:30,v:'bad',note:'Muchas calorias y grasa. Sin papas fritas.'},
  'hot dog':{n:'Hot Dog',c:290,p:10,cb:24,f:17,v:'warn',note:'No es lo peor, pero pan y salsas suman.'},
  'papas fritas':{n:'Papas Fritas',c:365,p:4,cb:48,f:17,v:'bad',note:'Pura grasa y carb. Evitalas.'},
  empanada:{n:'Empanada',c:300,p:8,cb:28,f:18,v:'warn',note:'1 ok, 2-3 ya son muchas calorias.'},
  arepa:{n:'Arepa sola',c:150,p:3,cb:30,f:2,v:'ok',note:'Parte de tu plan. Sin mantequilla extra.'},
  tortilla:{n:'Tortilla de maiz',c:75,p:2,cb:15,f:1,v:'ok',note:'Parte del plan. Mejor que pan.'},
  platano:{n:'Platano',c:105,p:1,cb:27,f:0,v:'ok',note:'Energia rapida, buen pre-entreno.'},
  yogurt:{n:'Yogurt Griego',c:120,p:15,cb:8,f:4,v:'ok',note:'Excelente snack. Parte del plan.'},
  tacos:{n:'Tacos (2)',c:340,p:14,cb:28,f:18,v:'warn',note:'Pollo o carne magra es mejor relleno.'},
  burrito:{n:'Burrito',c:600,p:25,cb:60,f:25,v:'bad',note:'Muy calorico. Si lo comes = almuerzo completo.'},
  sushi:{n:'Sushi (8 pz)',c:350,p:15,cb:50,f:8,v:'warn',note:'Evita rolls fritos. Prefiere sashimi.'},
  'pollo frito':{n:'Pollo Frito (2 pz)',c:480,p:30,cb:16,f:32,v:'bad',note:'Mucha grasa. Mejor pollo plancha/horno.'},
  chocolate:{n:'Chocolate (barra)',c:230,p:3,cb:25,f:13,v:'bad',note:'Mucha azucar. Mejor 70% cacao 1-2 cuadritos.'},
  galletas:{n:'Galletas (4)',c:200,p:2,cb:28,f:9,v:'bad',note:'Azucar pura. Evitalas.'},
  helado:{n:'Helado (1 bola)',c:140,p:2,cb:16,f:7,v:'warn',note:'1 bola ok como premio semanal.'},
  palomitas:{n:'Palomitas sin mantequilla',c:110,p:3,cb:20,f:1,v:'ok',note:'Buen snack sin mantequilla.'},
  almendras:{n:'Almendras (10)',c:70,p:3,cb:2,f:6,v:'ok',note:'Excelente snack. Parte de tu plan.'},
  manzana:{n:'Manzana',c:95,p:0,cb:25,f:0,v:'ok',note:'Perfecto. Parte de tu plan.'},
  banana:{n:'Banana',c:105,p:1,cb:27,f:0,v:'ok',note:'Buena energia, mas azucar que otras frutas.'},
  pera:{n:'Pera',c:100,p:1,cb:27,f:0,v:'ok',note:'Parte de tu plan.'},
  naranja:{n:'Naranja',c:62,p:1,cb:15,f:0,v:'ok',note:'Buena vitamina C.'},
  pollo:{n:'Pechuga pollo (150g)',c:230,p:43,cb:0,f:5,v:'ok',note:'Excelente proteina magra.'},
  carne:{n:'Carne res (150g)',c:340,p:36,cb:0,f:20,v:'ok',note:'Buena proteina. Cortes magros.'},
  salmon:{n:'Salmon (150g)',c:310,p:34,cb:0,f:18,v:'ok',note:'Omega 3 + proteina. Excelente!'},
  atun:{n:'Atun (lata)',c:120,p:26,cb:0,f:1,v:'ok',note:'Super proteina, casi cero grasa.'},
  huevo:{n:'Huevo (1)',c:72,p:6,cb:0,f:5,v:'ok',note:'Parte de tu plan.'},
  'yogurt griego':{n:'Yogurt Griego',c:120,p:15,cb:8,f:4,v:'ok',note:'Excelente snack. Parte del plan.'},
  arroz:{n:'Arroz (1 taza)',c:205,p:4,cb:45,f:0,v:'ok',note:'Solo 1 taza al almuerzo.'},
  pan:{n:'Pan (2 rebanadas)',c:160,p:5,cb:30,f:2,v:'warn',note:'No esta en plan. Si comes: integral, max 2.'},
  pasta:{n:'Pasta (1 taza)',c:220,p:8,cb:43,f:1,v:'warn',note:'No esta en plan. Muchos carbs.'},
  lentejas:{n:'Lentejas (1 taza)',c:230,p:18,cb:40,f:1,v:'ok',note:'Parte del plan. Proteina + fibra.'},
  cerveza:{n:'Cerveza (lata)',c:150,p:1,cb:13,f:0,v:'bad',note:'Calorias vacias + inflama. Evitala.'},
  vino:{n:'Vino (copa)',c:125,p:0,cb:4,f:0,v:'warn',note:'Max 1 copa en ocasion social.'},
  refresco:{n:'Refresco/Soda',c:140,p:0,cb:39,f:0,v:'bad',note:'Azucar liquida. PROHIBIDO.'},
  jugo:{n:'Jugo fruta',c:110,p:1,cb:26,f:0,v:'warn',note:'Azucar sin fibra. Come la fruta entera.'},
  'cafe negro':{n:'Cafe negro',c:5,p:0,cb:0,f:0,v:'ok',note:'Perfecto! Sin azucar ni crema.'},
  agua:{n:'Agua',c:0,p:0,cb:0,f:0,v:'ok',note:'Lo mejor. Meta: 4L diarios!'},
  torta:{n:'Torta/Pastel',c:350,p:4,cb:50,f:16,v:'bad',note:'Bomba azucar + grasa. Solo cumpleanos.'},
  gelatina:{n:'Gelatina sin azucar',c:10,p:2,cb:0,f:0,v:'ok',note:'Buena opcion dulce! Casi 0 cal.'},
  aguacate:{n:'Aguacate (medio)',c:160,p:2,cb:9,f:15,v:'ok',note:'Grasa buena. Max medio.'},
  queso:{n:'Queso (30g)',c:110,p:7,cb:0,f:9,v:'warn',note:'Mucha grasa. Con moderacion.'},
  'mantequilla mani':{n:'Mant. mani (1 cda)',c:95,p:4,cb:3,f:8,v:'ok',note:'Parte del plan. Solo 1 cda.'},
  avena:{n:'Avena (1/2 taza)',c:150,p:5,cb:27,f:3,v:'ok',note:'Buena alternativa desayuno.'},
  'proteina whey':{n:'Batido Proteina Whey',c:130,p:25,cb:3,f:2,v:'ok',note:'Excelente post-gym.'},
  gatorade:{n:'Gatorade',c:80,p:0,cb:21,f:0,v:'warn',note:'Solo post-ejercicio intenso.'}
};

// ===== EXTENDED FOOD DATABASE (macros per 100g) =====
// Structure: cat='proteina|carbo|vegetal|fruta|grasa|snack|bebida'
// cal100, p100, c100, f100, fib100 = per 100g
// serving = typical g serving, unit = textual unit description
// v='ok|bad|warn', note = Spanish tip
// Also populates legacy fields (c, p, cb, f) = per serving for canIEat() compat.
const FOOD_EXT={
  // PROTEINAS
  pollo_pechuga:{n:'Pechuga de Pollo',cat:'proteina',cal100:165,p100:31,c100:0,f100:3.6,fib100:0,serving:150,unit:'150g = 1 pechuga',v:'ok',note:'Proteina magra top. Base de tu dieta.'},
  res_magra:{n:'Carne de Res (magra)',cat:'proteina',cal100:217,p100:26,c100:0,f100:12,fib100:0,serving:150,unit:'150g = 1 corte',v:'ok',note:'Buena proteina + hierro. Corta magra.'},
  res_molida:{n:'Carne Molida 90/10',cat:'proteina',cal100:176,p100:20,c100:0,f100:10,fib100:0,serving:150,unit:'150g',v:'ok',note:'Verifica que sea magra (90/10).'},
  cerdo_lomo:{n:'Lomo de Cerdo',cat:'proteina',cal100:143,p100:26,c100:0,f100:3.5,fib100:0,serving:150,unit:'150g',v:'ok',note:'Cerdo magro, excelente proteina.'},
  salmon_f:{n:'Salmon',cat:'proteina',cal100:208,p100:22,c100:0,f100:13,fib100:0,serving:150,unit:'150g = 1 filete',v:'ok',note:'Omega 3. Come 1-2x por semana.'},
  atun_lata:{n:'Atun en agua (lata)',cat:'proteina',cal100:116,p100:26,c100:0,f100:1,fib100:0,serving:100,unit:'100g = 1 lata',v:'ok',note:'Super proteina, casi cero grasa.'},
  atun_aceite:{n:'Atun en aceite',cat:'proteina',cal100:200,p100:25,c100:0,f100:11,fib100:0,serving:100,unit:'100g = 1 lata',v:'warn',note:'Preferible en agua para menos grasa.'},
  pescado_blanco:{n:'Pescado Blanco (corvina/tilapia)',cat:'proteina',cal100:96,p100:20,c100:0,f100:1.7,fib100:0,serving:150,unit:'150g = 1 filete',v:'ok',note:'Magro y liviano. Excelente cena.'},
  camaron_f:{n:'Camarones',cat:'proteina',cal100:99,p100:24,c100:0.2,f100:0.3,fib100:0,serving:100,unit:'100g',v:'ok',note:'Baja cal, alta proteina. A la plancha.'},
  pavo_pechuga:{n:'Pechuga de Pavo',cat:'proteina',cal100:135,p100:30,c100:0,f100:1,fib100:0,serving:150,unit:'150g',v:'ok',note:'Muy magra. Alternativa al pollo.'},
  jamon_pavo:{n:'Jamon de Pavo',cat:'proteina',cal100:104,p100:17,c100:2,f100:3,fib100:0,serving:50,unit:'50g = 3-4 lonchas',v:'ok',note:'Procesado. Busca bajo en sodio.'},
  huevo_f:{n:'Huevo Entero',cat:'proteina',cal100:155,p100:13,c100:1.1,f100:11,fib100:0,serving:50,unit:'50g = 1 huevo',v:'ok',note:'Proteina completa. 1 huevo=72 cal.'},
  clara_huevo:{n:'Clara de Huevo',cat:'proteina',cal100:52,p100:11,c100:0.7,f100:0.2,fib100:0,serving:33,unit:'33g = 1 clara',v:'ok',note:'Pura proteina sin grasa.'},
  yogurt_griego_f:{n:'Yogurt Griego natural',cat:'proteina',cal100:97,p100:10,c100:4,f100:5,fib100:0,serving:150,unit:'150g = 1 envase',v:'ok',note:'Busca sin azucar. Excelente snack.'},
  yogurt_griego_0:{n:'Yogurt Griego 0%',cat:'proteina',cal100:59,p100:10,c100:4,f100:0.4,fib100:0,serving:150,unit:'150g',v:'ok',note:'Aun mejor: proteina sin grasa.'},
  queso_fresco:{n:'Queso Fresco',cat:'proteina',cal100:264,p100:17,c100:3,f100:21,fib100:0,serving:30,unit:'30g = 1 loncha',v:'warn',note:'Moderacion. 30g basta.'},
  queso_mozzarella:{n:'Queso Mozzarella',cat:'proteina',cal100:280,p100:22,c100:2,f100:22,fib100:0,serving:30,unit:'30g',v:'warn',note:'Mucha grasa. Usa con moderacion.'},
  requeson:{n:'Requeson (cottage cheese)',cat:'proteina',cal100:98,p100:11,c100:3.4,f100:4.3,fib100:0,serving:100,unit:'100g',v:'ok',note:'Excelente snack alto en proteina.'},
  leche_entera:{n:'Leche Entera',cat:'proteina',cal100:61,p100:3.2,c100:4.8,f100:3.3,fib100:0,serving:240,unit:'240ml = 1 vaso',v:'ok',note:'Buena fuente de proteina y calcio.'},
  leche_descremada:{n:'Leche Descremada',cat:'proteina',cal100:34,p100:3.4,c100:5,f100:0.1,fib100:0,serving:240,unit:'240ml',v:'ok',note:'Misma proteina sin grasa.'},
  leche_almendras:{n:'Leche de Almendras',cat:'bebida',cal100:15,p100:0.6,c100:0.6,f100:1.2,fib100:0.3,serving:240,unit:'240ml',v:'ok',note:'Muy baja cal. Busca sin azucar.'},
  proteina_polvo:{n:'Proteina Whey (polvo)',cat:'proteina',cal100:400,p100:80,c100:8,f100:6,fib100:0,serving:30,unit:'30g = 1 scoop',v:'ok',note:'1 scoop = ~25g proteina.'},

  // CARBOHIDRATOS
  arroz_blanco:{n:'Arroz Blanco cocido',cat:'carbo',cal100:130,p100:2.7,c100:28,f100:0.3,fib100:0.4,serving:150,unit:'150g = 1 taza',v:'ok',note:'Base de tu almuerzo. 1 taza = 200 cal.'},
  arroz_integral:{n:'Arroz Integral cocido',cat:'carbo',cal100:112,p100:2.6,c100:23,f100:0.9,fib100:1.8,serving:150,unit:'150g = 1 taza',v:'ok',note:'Mas fibra, mas saciante.'},
  pan_integral:{n:'Pan Integral',cat:'carbo',cal100:247,p100:13,c100:41,f100:3.4,fib100:7,serving:30,unit:'30g = 1 rebanada',v:'ok',note:'Mejor opcion de pan.'},
  pan_blanco:{n:'Pan Blanco',cat:'carbo',cal100:265,p100:9,c100:49,f100:3.2,fib100:2.7,serving:30,unit:'30g = 1 rebanada',v:'warn',note:'Preferir integral.'},
  pasta_cocida:{n:'Pasta cocida',cat:'carbo',cal100:158,p100:5.8,c100:31,f100:0.9,fib100:1.8,serving:150,unit:'150g = 1 taza',v:'warn',note:'No esta en tu plan. Alto en carbs.'},
  tortilla_maiz:{n:'Tortilla de Maiz',cat:'carbo',cal100:218,p100:5.7,c100:45,f100:2.9,fib100:6.3,serving:30,unit:'30g = 1 tortilla',v:'ok',note:'1 tortilla ~75 cal. Parte del plan.'},
  arepa_f:{n:'Arepa',cat:'carbo',cal100:215,p100:4.5,c100:44,f100:2.5,fib100:4,serving:70,unit:'70g = 1 arepa',v:'ok',note:'1 arepa ~150 cal. Sin mantequilla.'},
  avena_cocida:{n:'Avena cocida',cat:'carbo',cal100:71,p100:2.5,c100:12,f100:1.5,fib100:1.7,serving:200,unit:'200g = 1 taza',v:'ok',note:'Buena fibra, desayuno ideal.'},
  avena_cruda:{n:'Avena (hojuelas crudas)',cat:'carbo',cal100:389,p100:17,c100:66,f100:7,fib100:10,serving:40,unit:'40g = 1/2 taza',v:'ok',note:'Antes de cocinar. 40g = 150 cal.'},
  quinoa_cocida:{n:'Quinoa cocida',cat:'carbo',cal100:120,p100:4.4,c100:21,f100:1.9,fib100:2.8,serving:150,unit:'150g = 1 taza',v:'ok',note:'Pseudocereal, proteina + fibra.'},
  papa_cocida:{n:'Papa cocida',cat:'carbo',cal100:87,p100:1.9,c100:20,f100:0.1,fib100:1.8,serving:150,unit:'150g = 1 mediana',v:'ok',note:'Saciante. Sin fritar.'},
  camote:{n:'Camote (batata)',cat:'carbo',cal100:86,p100:1.6,c100:20,f100:0.1,fib100:3,serving:150,unit:'150g = 1 mediano',v:'ok',note:'Mas fibra que la papa. Excelente.'},
  yuca_cocida:{n:'Yuca cocida',cat:'carbo',cal100:160,p100:1.4,c100:38,f100:0.3,fib100:1.8,serving:150,unit:'150g',v:'warn',note:'Carbo denso. Porcion moderada.'},
  platano_maduro:{n:'Platano Maduro cocido',cat:'carbo',cal100:122,p100:1.3,c100:32,f100:0.4,fib100:2.3,serving:100,unit:'100g = 1/2 platano',v:'warn',note:'Dulce. Porcion chica.'},
  lentejas_cocidas:{n:'Lentejas cocidas',cat:'carbo',cal100:116,p100:9,c100:20,f100:0.4,fib100:7.9,serving:200,unit:'200g = 1 taza',v:'ok',note:'Proteina + fibra. Excelente.'},
  frijoles:{n:'Frijoles cocidos',cat:'carbo',cal100:127,p100:8.7,c100:23,f100:0.5,fib100:6.4,serving:200,unit:'200g = 1 taza',v:'ok',note:'Carbo + proteina + fibra.'},
  garbanzos:{n:'Garbanzos cocidos',cat:'carbo',cal100:164,p100:8.9,c100:27,f100:2.6,fib100:7.6,serving:150,unit:'150g = 1 taza',v:'ok',note:'Versatil, alto en fibra.'},

  // VEGETALES
  brocoli:{n:'Brocoli',cat:'vegetal',cal100:34,p100:2.8,c100:7,f100:0.4,fib100:2.6,serving:100,unit:'100g = 1 taza',v:'ok',note:'Gratis calorico, lleno de fibra.'},
  espinaca:{n:'Espinaca',cat:'vegetal',cal100:23,p100:2.9,c100:3.6,f100:0.4,fib100:2.2,serving:50,unit:'50g = 1 taza',v:'ok',note:'Hierro y fibra. Comela cruda o cocida.'},
  lechuga:{n:'Lechuga',cat:'vegetal',cal100:15,p100:1.4,c100:2.9,f100:0.2,fib100:1.3,serving:50,unit:'50g = 1 taza',v:'ok',note:'Base de ensaladas.'},
  zanahoria:{n:'Zanahoria',cat:'vegetal',cal100:41,p100:0.9,c100:10,f100:0.2,fib100:2.8,serving:80,unit:'80g = 1 mediana',v:'ok',note:'Crunchy y dulce natural.'},
  tomate:{n:'Tomate',cat:'vegetal',cal100:18,p100:0.9,c100:3.9,f100:0.2,fib100:1.2,serving:100,unit:'100g = 1 mediano',v:'ok',note:'Licopeno, antioxidante.'},
  pepino:{n:'Pepino',cat:'vegetal',cal100:15,p100:0.7,c100:3.6,f100:0.1,fib100:0.5,serving:100,unit:'100g = 1/2 pepino',v:'ok',note:'Hidratante, casi cero cal.'},
  pimenton:{n:'Pimenton',cat:'vegetal',cal100:31,p100:1,c100:6,f100:0.3,fib100:2.1,serving:100,unit:'100g = 1 mediano',v:'ok',note:'Vitamina C altisima.'},
  cebolla:{n:'Cebolla',cat:'vegetal',cal100:40,p100:1.1,c100:9,f100:0.1,fib100:1.7,serving:50,unit:'50g = 1/2 cebolla',v:'ok',note:'Da sabor y antioxidantes.'},
  calabacin:{n:'Calabacin (zucchini)',cat:'vegetal',cal100:17,p100:1.2,c100:3.1,f100:0.3,fib100:1,serving:100,unit:'100g',v:'ok',note:'Muy bajo en cal, versatil.'},
  coliflor:{n:'Coliflor',cat:'vegetal',cal100:25,p100:1.9,c100:5,f100:0.3,fib100:2,serving:100,unit:'100g = 1 taza',v:'ok',note:'Saciante y bajo en cal.'},
  apio:{n:'Apio',cat:'vegetal',cal100:16,p100:0.7,c100:3,f100:0.2,fib100:1.6,serving:50,unit:'50g = 1 tallo',v:'ok',note:'Casi cero cal, buen snack.'},

  // FRUTAS
  manzana_f:{n:'Manzana',cat:'fruta',cal100:52,p100:0.3,c100:14,f100:0.2,fib100:2.4,serving:180,unit:'180g = 1 mediana',v:'ok',note:'Perfecto snack. ~95 cal.'},
  banana_f:{n:'Banana (platano de seda)',cat:'fruta',cal100:89,p100:1.1,c100:23,f100:0.3,fib100:2.6,serving:120,unit:'120g = 1 mediana',v:'ok',note:'Energia rapida, buen pre-entreno.'},
  naranja_f:{n:'Naranja',cat:'fruta',cal100:47,p100:0.9,c100:12,f100:0.1,fib100:2.4,serving:130,unit:'130g = 1 mediana',v:'ok',note:'Vitamina C. Comela, no en jugo.'},
  pera_f:{n:'Pera',cat:'fruta',cal100:57,p100:0.4,c100:15,f100:0.1,fib100:3.1,serving:180,unit:'180g = 1 mediana',v:'ok',note:'Alta fibra, saciante.'},
  fresa:{n:'Fresas',cat:'fruta',cal100:32,p100:0.7,c100:7.7,f100:0.3,fib100:2,serving:150,unit:'150g = 1 taza',v:'ok',note:'Baja cal, antioxidantes.'},
  pina:{n:'Pina',cat:'fruta',cal100:50,p100:0.5,c100:13,f100:0.1,fib100:1.4,serving:150,unit:'150g = 1 taza',v:'ok',note:'Enzima digestiva. Buena post-comida.'},
  mango:{n:'Mango',cat:'fruta',cal100:60,p100:0.8,c100:15,f100:0.4,fib100:1.6,serving:150,unit:'150g = 1 taza',v:'ok',note:'Dulce natural. Moderacion.'},
  uvas:{n:'Uvas',cat:'fruta',cal100:69,p100:0.7,c100:18,f100:0.2,fib100:0.9,serving:100,unit:'100g = 1 puno',v:'warn',note:'Muy dulces. Porcion chica.'},
  sandia:{n:'Sandia',cat:'fruta',cal100:30,p100:0.6,c100:7.6,f100:0.2,fib100:0.4,serving:200,unit:'200g = 1 tajada',v:'ok',note:'Hidratante, baja cal.'},
  melon:{n:'Melon',cat:'fruta',cal100:34,p100:0.8,c100:8,f100:0.2,fib100:0.9,serving:150,unit:'150g',v:'ok',note:'Refrescante, bajo en cal.'},
  arandanos:{n:'Arandanos (blueberries)',cat:'fruta',cal100:57,p100:0.7,c100:14,f100:0.3,fib100:2.4,serving:100,unit:'100g = 1 taza',v:'ok',note:'Antioxidantes top.'},

  // GRASAS
  almendras_f:{n:'Almendras',cat:'grasa',cal100:579,p100:21,c100:22,f100:50,fib100:12,serving:15,unit:'15g = 10-12 almendras',v:'ok',note:'10 almendras ~70 cal. Controla porcion.'},
  nueces:{n:'Nueces',cat:'grasa',cal100:654,p100:15,c100:14,f100:65,fib100:6.7,serving:20,unit:'20g = puno pequeno',v:'ok',note:'Omega 3. Porcion justa.'},
  mani_f:{n:'Mani (cacahuate)',cat:'grasa',cal100:567,p100:26,c100:16,f100:49,fib100:8.5,serving:20,unit:'20g = puno pequeno',v:'ok',note:'Alto en grasa. Moderacion.'},
  mantequilla_mani_f:{n:'Mantequilla de Mani',cat:'grasa',cal100:588,p100:25,c100:20,f100:50,fib100:6,serving:16,unit:'16g = 1 cda',v:'ok',note:'1 cda ~95 cal. Max 1-2 cdas/dia.'},
  aguacate_f:{n:'Aguacate',cat:'grasa',cal100:160,p100:2,c100:9,f100:15,fib100:6.7,serving:100,unit:'100g = 1/2 aguacate',v:'ok',note:'Grasa buena. Max medio al dia.'},
  aceite_oliva:{n:'Aceite de Oliva',cat:'grasa',cal100:884,p100:0,c100:0,f100:100,fib100:0,serving:14,unit:'14g = 1 cda',v:'ok',note:'1 cda ~120 cal. Para cocinar y ensaladas.'},
  aceite_coco:{n:'Aceite de Coco',cat:'grasa',cal100:862,p100:0,c100:0,f100:100,fib100:0,serving:14,unit:'14g = 1 cda',v:'warn',note:'Saturada. Uso moderado.'},
  semillas_chia:{n:'Semillas de Chia',cat:'grasa',cal100:486,p100:17,c100:42,f100:31,fib100:34,serving:12,unit:'12g = 1 cda',v:'ok',note:'Omega 3 + fibra. 1 cda basta.'},
  semillas_linaza:{n:'Linaza molida',cat:'grasa',cal100:534,p100:18,c100:29,f100:42,fib100:27,serving:10,unit:'10g = 1 cda',v:'ok',note:'Omega 3. Muele para absorcion.'},

  // SNACKS / OTROS
  barra_proteina:{n:'Barra de Proteina',cat:'snack',cal100:400,p100:30,c100:40,f100:12,fib100:6,serving:60,unit:'60g = 1 barra',v:'warn',note:'OK post-gym. Revisa azucar.'},
  galletas_saladas:{n:'Galletas Saladas',cat:'snack',cal100:420,p100:9,c100:73,f100:10,fib100:3,serving:30,unit:'30g = ~6 galletas',v:'warn',note:'Procesado. Ocasional.'},
  chocolate_70:{n:'Chocolate 70% cacao',cat:'snack',cal100:546,p100:7.8,c100:45,f100:31,fib100:10,serving:20,unit:'20g = 2 cuadritos',v:'ok',note:'Antioxidante. Max 20g/dia.'},
  chocolate_leche:{n:'Chocolate con Leche',cat:'snack',cal100:535,p100:7.6,c100:59,f100:30,fib100:3,serving:30,unit:'30g',v:'bad',note:'Mucha azucar. Prefiere 70%+.'},
  helado_f:{n:'Helado',cat:'snack',cal100:207,p100:3.5,c100:24,f100:11,fib100:0.7,serving:80,unit:'80g = 1 bola',v:'warn',note:'Cheat semanal, 1 bola.'},
  miel:{n:'Miel',cat:'snack',cal100:304,p100:0.3,c100:82,f100:0,fib100:0.2,serving:20,unit:'20g = 1 cda',v:'warn',note:'Azucar natural. Poca cantidad.'},
  stevia:{n:'Stevia',cat:'snack',cal100:0,p100:0,c100:0,f100:0,fib100:0,serving:1,unit:'1g = 1 sobre',v:'ok',note:'Endulzante cero cal. Perfecto.'},

  // BEBIDAS
  agua_f:{n:'Agua',cat:'bebida',cal100:0,p100:0,c100:0,f100:0,fib100:0,serving:250,unit:'250ml = 1 vaso',v:'ok',note:'Lo mejor. Meta: 4L diarios.'},
  cafe_negro_f:{n:'Cafe negro',cat:'bebida',cal100:2,p100:0.1,c100:0,f100:0,fib100:0,serving:240,unit:'240ml = 1 taza',v:'ok',note:'Sin azucar. Cafeina = energia.'},
  te_verde:{n:'Te Verde',cat:'bebida',cal100:1,p100:0,c100:0,f100:0,fib100:0,serving:240,unit:'240ml',v:'ok',note:'Antioxidantes. Cero cal.'}
};

// Expand primary FOOD with per-serving legacy fields derived from macros
(function mergeFoodExt(){
  for(const[k,v]of Object.entries(FOOD_EXT)){
    const srv=v.serving||100,f=srv/100;
    FOOD[k]={
      n:v.n,
      c:Math.round(v.cal100*f),
      p:Math.round(v.p100*f*10)/10,
      cb:Math.round(v.c100*f*10)/10,
      f:Math.round(v.f100*f*10)/10,
      v:v.v,
      note:v.note,
      cat:v.cat,
      cal100:v.cal100,p100:v.p100,c100:v.c100,f100:v.f100,fib100:v.fib100||0,
      serving:srv,unit:v.unit
    };
  }
  // Also enrich existing FOOD entries (pollo, huevo, etc) with cat + macros100
  const enrich={
    pollo:{cat:'proteina',cal100:165,p100:31,c100:0,f100:3.6,fib100:0,serving:150,unit:'150g = 1 pechuga'},
    carne:{cat:'proteina',cal100:226,p100:24,c100:0,f100:13,fib100:0,serving:150,unit:'150g'},
    salmon:{cat:'proteina',cal100:208,p100:22,c100:0,f100:13,fib100:0,serving:150,unit:'150g'},
    atun:{cat:'proteina',cal100:116,p100:26,c100:0,f100:1,fib100:0,serving:100,unit:'100g = 1 lata'},
    huevo:{cat:'proteina',cal100:155,p100:13,c100:1.1,f100:11,fib100:0,serving:50,unit:'50g = 1 huevo'},
    yogurt:{cat:'proteina',cal100:80,p100:10,c100:5,f100:2.7,fib100:0,serving:150,unit:'150g'},
    'yogurt griego':{cat:'proteina',cal100:80,p100:10,c100:5,f100:2.7,fib100:0,serving:150,unit:'150g'},
    arroz:{cat:'carbo',cal100:130,p100:2.7,c100:28,f100:0.3,fib100:0.4,serving:150,unit:'150g = 1 taza'},
    pan:{cat:'carbo',cal100:265,p100:9,c100:49,f100:3.2,fib100:2.7,serving:60,unit:'60g = 2 rebanadas'},
    pasta:{cat:'carbo',cal100:158,p100:5.8,c100:31,f100:0.9,fib100:1.8,serving:150,unit:'150g'},
    lentejas:{cat:'carbo',cal100:116,p100:9,c100:20,f100:0.4,fib100:7.9,serving:200,unit:'200g'},
    avena:{cat:'carbo',cal100:389,p100:17,c100:66,f100:7,fib100:10,serving:40,unit:'40g'},
    arepa:{cat:'carbo',cal100:215,p100:4.5,c100:44,f100:2.5,fib100:4,serving:70,unit:'70g'},
    tortilla:{cat:'carbo',cal100:218,p100:5.7,c100:45,f100:2.9,fib100:6.3,serving:30,unit:'30g'},
    platano:{cat:'fruta',cal100:89,p100:1.1,c100:23,f100:0.3,fib100:2.6,serving:120,unit:'120g'},
    manzana:{cat:'fruta',cal100:52,p100:0.3,c100:14,f100:0.2,fib100:2.4,serving:180,unit:'180g'},
    banana:{cat:'fruta',cal100:89,p100:1.1,c100:23,f100:0.3,fib100:2.6,serving:120,unit:'120g'},
    pera:{cat:'fruta',cal100:57,p100:0.4,c100:15,f100:0.1,fib100:3.1,serving:180,unit:'180g'},
    naranja:{cat:'fruta',cal100:47,p100:0.9,c100:12,f100:0.1,fib100:2.4,serving:130,unit:'130g'},
    almendras:{cat:'grasa',cal100:579,p100:21,c100:22,f100:50,fib100:12,serving:15,unit:'15g = 10-12 almendras'},
    aguacate:{cat:'grasa',cal100:160,p100:2,c100:9,f100:15,fib100:6.7,serving:100,unit:'100g = 1/2'},
    queso:{cat:'proteina',cal100:367,p100:23,c100:3,f100:30,fib100:0,serving:30,unit:'30g'},
    'mantequilla mani':{cat:'grasa',cal100:588,p100:25,c100:20,f100:50,fib100:6,serving:16,unit:'16g = 1 cda'},
    'proteina whey':{cat:'proteina',cal100:400,p100:80,c100:8,f100:6,fib100:0,serving:30,unit:'30g = 1 scoop'},
    agua:{cat:'bebida',cal100:0,p100:0,c100:0,f100:0,fib100:0,serving:250,unit:'250ml'},
    'cafe negro':{cat:'bebida',cal100:2,p100:0.1,c100:0,f100:0,fib100:0,serving:240,unit:'240ml'}
  };
  for(const[k,ext]of Object.entries(enrich))if(FOOD[k])Object.assign(FOOD[k],ext);
})();

function searchFood(q){
  q=q.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  let r=[];
  for(const[k,v]of Object.entries(FOOD)){
    const nm=v.n.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    if(nm.includes(q)||k.includes(q))r.push({k,...v});
  }
  if(!r.length){const ws=q.split(' ');for(const[k,v]of Object.entries(FOOD)){const nm=v.n.toLowerCase();if(ws.some(w=>w.length>2&&(nm.includes(w)||k.includes(w))))r.push({k,...v});}}
  return r;
}

// Food utility: compute macros for a given foodKey + grams
function foodMacros(foodKey,grams){
  const f=FOOD[foodKey];
  if(!f)return{cal:0,p:0,c:0,fat:0,fib:0};
  // If food has per-100g macros use them; else scale per-serving legacy fields.
  if(typeof f.cal100==='number'){
    const g=grams/100;
    return{
      cal:Math.round(f.cal100*g),
      p:Math.round(f.p100*g*10)/10,
      c:Math.round(f.c100*g*10)/10,
      fat:Math.round(f.f100*g*10)/10,
      fib:Math.round((f.fib100||0)*g*10)/10
    };
  }
  // Legacy: f.c is per default serving; assume 100g baseline
  const srv=f.serving||100,sc=grams/srv;
  return{
    cal:Math.round((f.c||0)*sc),
    p:Math.round((f.p||0)*sc*10)/10,
    c:Math.round((f.cb||0)*sc*10)/10,
    fat:Math.round((f.f||0)*sc*10)/10,
    fib:0
  };
}

// ===== SUPPLEMENTS =====
const SUPS=[
  {id:'proteina',name:'Proteina Whey',icon:'🥛',prio:'alta',
    ben:['Repara y construye musculo','Aumenta saciedad','Previene perdida muscular en deficit','Facil y rapida de preparar'],
    con:['Hinchazon si intolerante a lactosa','No reemplaza comida completa'],
    side:'Gases/hinchazon (lactosa). Prueba Isolate o vegana.',
    dose:'1-2 scoops (25-50g)/dia post-gym o entre comidas',when:'Post-entreno o entre comidas',
    brands:'Optimum Gold Standard, Dymatize ISO100, MyProtein',
    forYou:'1 scoop post-gym suficiente. Cubre proteina sin calorias extra.',
    schedule:{time:'06:00',label:'Post-Gym',amount:'1 scoop (25g)'}},
  {id:'creatina',name:'Creatina Monohidrato',icon:'💊',prio:'alta',
    ben:['Suplemento MAS estudiado y seguro','Aumenta fuerza en gym','Construye masa muscular','Mejora recuperacion','Beneficios cognitivos'],
    con:['Retencion agua 1-2 lbs (temporal)','Resultados en 2-3 semanas'],
    side:'Retencion agua leve. Muy raro: malestar estomacal.',
    dose:'5g diarios (1 cucharadita). Todos los dias.',when:'Cualquier momento. Muchos con batido post-gym.',
    brands:'Creapure, Optimum Nutrition, Dymatize',
    forYou:'ALTAMENTE RECOMENDADA. Mas fuerza = mas musculo = mas quema de grasa.',
    schedule:{time:'06:00',label:'Con batido',amount:'5g (1 cucharadita)'}},
  {id:'multi',name:'Multivitaminico',icon:'💊',prio:'media',
    ben:['Cubre deficiencias (sin vegetales!)','Mejora inmunidad','Mejor recuperacion','Mas energia'],
    con:['No reemplaza buena alimentacion','Algunos de baja calidad'],
    side:'Nauseas en ayunas. Cambio color orina (normal).',
    dose:'1 tableta/dia con desayuno.',when:'Con el desayuno (mejor absorcion).',
    brands:'Centrum, One A Day, Kirkland',
    forYou:'RECOMENDADO porque no comes vegetales. Cubre vitaminas faltantes.',
    schedule:{time:'07:00',label:'Con desayuno',amount:'1 tableta'}},
  {id:'omega3',name:'Omega 3 (Aceite Pescado)',icon:'🐟',prio:'media',
    ben:['Reduce inflamacion','Salud cardiovascular','Ayuda quemar grasa','Piel y articulaciones'],
    con:['Eructos pescado (compra con recubrimiento)','Interactua con anticoagulantes'],
    side:'Eructos pescado, malestar leve. Raro: diarrea.',
    dose:'1-2 capsulas/dia (min 500mg EPA+DHA).',when:'Con almuerzo o cena.',
    brands:'Nordic Naturals, NOW Foods, Kirkland',
    forYou:'Comes salmon 1-2x/semana. Omega 3 cubre el resto.',
    schedule:{time:'12:00',label:'Con almuerzo',amount:'1 capsula'}},
  {id:'vitamina_d',name:'Vitamina D3',icon:'☀️',prio:'media',
    ben:['Absorcion calcio (huesos)','Mejora inmunidad','Niveles testosterona','Mejora animo'],
    con:['Exceso toxico (max 4000 IU/dia)','Tarda semanas en subir'],
    side:'Dosis normales: ninguno. Exceso: nauseas.',
    dose:'2000-4000 IU/dia con grasa (comida).',when:'Con desayuno o almuerzo.',
    brands:'NOW Foods, NatureWise, Kirkland',
    forYou:'Si poco sol u oficina = casi obligatoria.',
    schedule:{time:'07:00',label:'Con desayuno',amount:'2000 IU'}},
  {id:'magnesio',name:'Magnesio Glicinato',icon:'🧲',prio:'media',
    ben:['Mejora sueno (meta: 10 PM)','Reduce calambres','Recuperacion muscular','Reduce estres'],
    con:['Diarrea con mucho (citrato)','No todos se absorben igual'],
    side:'Diarrea dosis altas. Glicinato es mas suave.',
    dose:'200-400mg/dia. Glicinato o Citrato.',when:'30-60 min antes de dormir.',
    brands:'NOW Foods Glycinate, Doctors Best, Natural Vitality Calm',
    forYou:'MUY recomendado. Glicinato antes de dormir = dormir mas rapido y profundo.',
    schedule:{time:'21:00',label:'Antes de dormir',amount:'400mg'}},
  {id:'fibra',name:'Fibra (Psyllium)',icon:'🥤',prio:'alta',
    ben:['Compensa falta de vegetales','Mejora digestion','Aumenta saciedad','Reduce colesterol'],
    con:['Gases primeras semanas','Necesita mucha agua (4L ok)'],
    side:'Gases/hinchazon al inicio (1-2 sem adaptacion).',
    dose:'1 cucharada (5-10g) en vaso grande agua.',when:'Antes de dormir (ya en tu plan).',
    brands:'Metamucil, NOW Psyllium Husk, Yerba Prima',
    forYou:'YA EN TU PLAN. Esencial sin vegetales. NUNCA la saltes.',
    schedule:{time:'21:30',label:'Antes de dormir',amount:'1 cucharada'}},
  {id:'cafeina',name:'Cafeina / Pre-entreno',icon:'☕',prio:'baja',
    ben:['Mas energia en gym','Acelera metabolismo','Mejora rendimiento','Reduce fatiga'],
    con:['Ansiedad/nerviosismo','Interfiere con sueno','Genera tolerancia'],
    side:'Nerviosismo, insomnio, taquicardia. Dolor cabeza si la dejas.',
    dose:'100-200mg pre-gym. NO despues 2 PM.',when:'30 min antes del gym (4:30 AM).',
    brands:'Cafe negro, C4 Original, Ghost Legend',
    forYou:'Ya tomas cafe negro = suficiente. Pre-entreno solo si necesitas mas energia 5 AM.',
    schedule:{time:'04:30',label:'Pre-gym',amount:'1-2 tazas cafe'}},
  {id:'bcaa',name:'BCAAs',icon:'💧',prio:'baja',
    ben:['Reduce dolor post-gym','Previene perdida muscular','Sabor agradable'],
    con:['Redundante si tomas whey','Caro para lo que aporta','Estudios cuestionan beneficio'],
    side:'Practicamente ninguno. Nauseas si mucho.',
    dose:'5-10g durante entreno con agua.',when:'Durante el entrenamiento.',
    brands:'Xtend, Scivation, Optimum Nutrition',
    forYou:'OPCIONAL. Si tomas whey, BCAAs son innecesarios. Ahorra ese dinero.',
    schedule:null}
];
