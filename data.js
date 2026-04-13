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
    tip:'NO descansar entre biceps y triceps. Congestiona al maximo.',breath:'Exhala en contraccion, inhala al estirar',machine:'Mancuernas o Poleas'}
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
