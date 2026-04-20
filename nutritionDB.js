/**
 * nutritionDB.js - Libra Fit Nutrition Database
 * Base de datos de alimentos con macros completos, alergenos y tags dietarios.
 * Macros por 100g. Datos basados en USDA + referencias regionales Panama.
 *
 * v2.0: 60+ alimentos comunes. Se expandira en versiones siguientes.
 */

const ALLERGEN_INFO = {
  gluten:       { name:'Gluten',              desc:'Presente en trigo, cebada, centeno, avena no certificada.' },
  lacteos:      { name:'Lacteos',             desc:'Leche y derivados (proteinas de leche, lactosa).' },
  huevo:        { name:'Huevo',               desc:'Proteinas de clara y yema.' },
  pescado:      { name:'Pescado',             desc:'Todas las especies de pescado.' },
  mariscos:     { name:'Mariscos/Crustaceos', desc:'Camaron, langosta, cangrejo, langostino.' },
  moluscos:     { name:'Moluscos',            desc:'Calamar, pulpo, mejillon, almeja, ostra.' },
  cacahuate:    { name:'Cacahuate/Mani',      desc:'Leguminosa, alergeno mayor.' },
  soya:         { name:'Soya',                desc:'Soja y derivados.' },
  frutos_secos: { name:'Frutos secos',        desc:'Almendra, nuez, maranon, pistacho.' },
  mostaza:      { name:'Mostaza',             desc:'Semillas y salsas derivadas.' },
  apio:         { name:'Apio',                desc:'Tallo, hojas y semillas.' },
  sesamo:       { name:'Sesamo',              desc:'Semillas y tahini.' },
  sulfitos:     { name:'Sulfitos',            desc:'Conservante en vinos, frutos secos.' }
};

const DIETARY_TAGS_INFO = {
  halal:          'Permitido segun ley islamica.',
  kosher:         'Permitido segun ley judia.',
  sin_gluten:     'Libre de gluten.',
  sin_lactosa:    'Libre de lactosa.',
  vegetariano:    'Sin carne ni pescado.',
  vegano:         'Sin productos de origen animal.',
  bajo_carbo:     'Menos de 10g de carbohidratos por 100g.',
  alto_proteina:  'Mas de 15g de proteina por 100g.',
  bajo_grasa:     'Menos de 3g de grasa por 100g.',
  alto_fibra:     'Mas de 6g de fibra por 100g.',
  keto:           'Apto para dieta cetogenica.',
  paleo:          'Apto para dieta paleo.'
};

// Helper para crear entrada de alimento con defaults
function _f(id, name, cat, cal, p, c, f, extra = {}) {
  return {
    id, name, nameEn: extra.nameEn || name,
    category: cat, subcategory: extra.subcategory || cat,
    cal, protein: p, carbs: c, fat: f,
    fiber: extra.fiber || 0, sugar: extra.sugar || 0, sodium: extra.sodium || 0,
    servings: extra.servings || [{ label:'100g', grams:100 }],
    defaultServing: extra.defaultServing || 100,
    allergens: extra.allergens || [],
    dietaryTags: extra.dietaryTags || [],
    availability: extra.availability || 'panama_comun',
    goalFit: extra.goalFit || { fatLoss:5, muscleGain:5, endurance:5, maintenance:5 },
    glycemicIndex: extra.gi ?? null,
    notes: extra.notes || ''
  };
}

const FOODS = [
  // ===== PROTEINAS ANIMALES - AVES =====
  _f('pechuga_pollo', 'Pechuga de Pollo', 'proteina_animal', 165, 31, 0, 3.6, {
    subcategory:'ave', sodium:74, defaultServing:120,
    dietaryTags:['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','bajo_grasa','paleo'],
    goalFit:{fatLoss:10,muscleGain:10,endurance:7,maintenance:9},
    servings:[{label:'1 pechuga mediana',grams:170},{label:'1 filete',grams:120}],
    notes:'Excelente fuente de proteina magra.'}),
  _f('muslo_pollo', 'Muslo de Pollo', 'proteina_animal', 209, 26, 0, 11, {
    subcategory:'ave', sodium:86, defaultServing:110,
    dietaryTags:['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','paleo'],
    goalFit:{fatLoss:7,muscleGain:9,endurance:7,maintenance:9},
    notes:'Mas jugoso que la pechuga.'}),
  _f('pollo_molido', 'Pollo Molido', 'proteina_animal', 143, 17, 0, 8, {
    subcategory:'ave',
    dietaryTags:['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','paleo'],
    goalFit:{fatLoss:8,muscleGain:9,endurance:6,maintenance:9}}),
  _f('pechuga_pavo', 'Pechuga de Pavo', 'proteina_animal', 135, 30, 0, 1, {
    subcategory:'ave',
    dietaryTags:['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','bajo_grasa','paleo'],
    goalFit:{fatLoss:10,muscleGain:10,endurance:7,maintenance:9},
    notes:'Aun mas magra que el pollo.'}),
  _f('pavo_molido', 'Pavo Molido', 'proteina_animal', 148, 20, 0, 7, {
    subcategory:'ave',
    dietaryTags:['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','paleo'],
    goalFit:{fatLoss:9,muscleGain:9,endurance:6,maintenance:9}}),

  // ===== CARNES ROJAS =====
  _f('res_molida_80', 'Res Molida 80/20', 'proteina_animal', 254, 17, 0, 20, {
    subcategory:'res',
    dietaryTags:['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','paleo','keto'],
    goalFit:{fatLoss:4,muscleGain:8,endurance:5,maintenance:6}}),
  _f('res_molida_90', 'Res Molida 90/10', 'proteina_animal', 176, 20, 0, 10, {
    subcategory:'res',
    dietaryTags:['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','paleo'],
    goalFit:{fatLoss:7,muscleGain:9,endurance:6,maintenance:8}}),
  _f('bistec_res', 'Bistec de Res', 'proteina_animal', 217, 26, 0, 12, {
    subcategory:'res',
    dietaryTags:['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','paleo','keto'],
    goalFit:{fatLoss:7,muscleGain:9,endurance:6,maintenance:8}}),
  _f('lomo_res', 'Lomo de Res', 'proteina_animal', 247, 26, 0, 15, {
    subcategory:'res',
    dietaryTags:['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','paleo','keto'],
    goalFit:{fatLoss:6,muscleGain:9,endurance:5,maintenance:7}}),
  _f('cerdo_lomo', 'Lomo de Cerdo', 'proteina_animal', 143, 26, 0, 3.5, {
    subcategory:'cerdo',
    dietaryTags:['sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','bajo_grasa','paleo'],
    goalFit:{fatLoss:9,muscleGain:9,endurance:6,maintenance:8}}),

  // ===== PESCADOS =====
  _f('salmon', 'Salmon', 'proteina_animal', 208, 20, 0, 13, {
    subcategory:'pescado', allergens:['pescado'],
    dietaryTags:['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','paleo','keto'],
    goalFit:{fatLoss:9,muscleGain:10,endurance:8,maintenance:10},
    notes:'Alto en omega-3.'}),
  _f('atun_fresco', 'Atun Fresco', 'proteina_animal', 132, 29, 0, 1, {
    subcategory:'pescado', allergens:['pescado'],
    dietaryTags:['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','bajo_grasa','paleo'],
    goalFit:{fatLoss:10,muscleGain:10,endurance:8,maintenance:9}}),
  _f('atun_lata', 'Atun en Lata (agua)', 'proteina_animal', 116, 26, 0, 1, {
    subcategory:'pescado', allergens:['pescado'], sodium:377,
    dietaryTags:['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','bajo_grasa','paleo'],
    goalFit:{fatLoss:10,muscleGain:9,endurance:7,maintenance:9}}),
  _f('tilapia', 'Tilapia', 'proteina_animal', 96, 20, 0, 2, {
    subcategory:'pescado', allergens:['pescado'],
    dietaryTags:['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','bajo_grasa','paleo'],
    goalFit:{fatLoss:10,muscleGain:9,endurance:7,maintenance:9}}),
  _f('corvina', 'Corvina', 'proteina_animal', 100, 22, 0, 1, {
    subcategory:'pescado', allergens:['pescado'],
    dietaryTags:['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','bajo_grasa','paleo'],
    goalFit:{fatLoss:10,muscleGain:9,endurance:7,maintenance:9},
    notes:'Pescado clasico de Panama.'}),
  _f('camaron', 'Camaron', 'proteina_animal', 99, 24, 0, 0.3, {
    subcategory:'marisco', allergens:['mariscos'],
    dietaryTags:['kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','bajo_grasa','paleo','keto'],
    goalFit:{fatLoss:10,muscleGain:9,endurance:7,maintenance:9}}),

  // ===== HUEVOS =====
  _f('huevo_entero', 'Huevo Entero', 'proteina_animal', 155, 13, 1, 11, {
    subcategory:'huevo', allergens:['huevo'],
    servings:[{label:'1 huevo grande',grams:50}],
    dietaryTags:['vegetariano','halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','paleo','keto'],
    goalFit:{fatLoss:8,muscleGain:9,endurance:7,maintenance:9}}),
  _f('clara_huevo', 'Clara de Huevo', 'proteina_animal', 52, 11, 0.7, 0.2, {
    subcategory:'huevo', allergens:['huevo'],
    servings:[{label:'1 clara',grams:33}],
    dietaryTags:['vegetariano','halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','bajo_grasa'],
    goalFit:{fatLoss:10,muscleGain:9,endurance:7,maintenance:9}}),

  // ===== LACTEOS =====
  _f('yogurt_griego', 'Yogurt Griego Natural', 'lacteo', 59, 10, 3.6, 0.4, {
    allergens:['lacteos'],
    dietaryTags:['vegetariano','halal','kosher','sin_gluten','bajo_grasa','alto_proteina'],
    goalFit:{fatLoss:9,muscleGain:9,endurance:7,maintenance:9}}),
  _f('queso_fresco', 'Queso Fresco', 'lacteo', 98, 11, 3.5, 4, {
    allergens:['lacteos'],
    dietaryTags:['vegetariano','halal','kosher','sin_gluten','bajo_carbo'],
    goalFit:{fatLoss:7,muscleGain:8,endurance:5,maintenance:7}}),
  _f('leche_entera', 'Leche Entera', 'lacteo', 61, 3.2, 4.8, 3.3, {
    allergens:['lacteos'], servings:[{label:'1 taza',grams:240}],
    dietaryTags:['vegetariano','halal','kosher','sin_gluten'],
    goalFit:{fatLoss:5,muscleGain:7,endurance:7,maintenance:7}}),
  _f('requeson', 'Requeson (Cottage Cheese)', 'lacteo', 98, 11, 3.4, 4.3, {
    allergens:['lacteos'],
    dietaryTags:['vegetariano','halal','kosher','sin_gluten','alto_proteina'],
    goalFit:{fatLoss:9,muscleGain:9,endurance:6,maintenance:8}}),

  // ===== CARBOHIDRATOS =====
  _f('arroz_blanco', 'Arroz Blanco Cocido', 'carbo', 130, 2.7, 28, 0.3, {
    subcategory:'grano',
    dietaryTags:['vegano','vegetariano','halal','kosher','sin_gluten','sin_lactosa','bajo_grasa'],
    goalFit:{fatLoss:5,muscleGain:8,endurance:9,maintenance:7},
    gi:73}),
  _f('arroz_integral', 'Arroz Integral Cocido', 'carbo', 112, 2.6, 24, 0.9, {
    subcategory:'grano', fiber:1.8,
    dietaryTags:['vegano','vegetariano','halal','kosher','sin_gluten','sin_lactosa','bajo_grasa'],
    goalFit:{fatLoss:7,muscleGain:8,endurance:9,maintenance:8},
    gi:68}),
  _f('avena', 'Avena (cruda)', 'carbo', 389, 17, 66, 7, {
    subcategory:'grano', fiber:10.6, allergens:[], // si no esta certificada puede tener gluten
    dietaryTags:['vegano','vegetariano','halal','kosher','sin_lactosa','alto_fibra'],
    goalFit:{fatLoss:9,muscleGain:8,endurance:9,maintenance:9},
    gi:55}),
  _f('tortilla_maiz', 'Tortilla de Maiz', 'carbo', 218, 5.7, 45, 2.9, {
    subcategory:'pan', fiber:6.3,
    servings:[{label:'1 tortilla',grams:25}],
    dietaryTags:['vegano','vegetariano','halal','kosher','sin_gluten','sin_lactosa'],
    goalFit:{fatLoss:6,muscleGain:7,endurance:8,maintenance:7}}),
  _f('pan_integral', 'Pan Integral', 'carbo', 247, 13, 41, 3.5, {
    subcategory:'pan', fiber:7, allergens:['gluten'],
    servings:[{label:'1 rebanada',grams:30}],
    dietaryTags:['vegano','vegetariano','halal','kosher','alto_fibra'],
    goalFit:{fatLoss:6,muscleGain:7,endurance:8,maintenance:7}}),
  _f('papa', 'Papa Cocida', 'carbo', 77, 2, 17, 0.1, {
    subcategory:'tuberculo', fiber:2.2,
    dietaryTags:['vegano','vegetariano','halal','kosher','sin_gluten','sin_lactosa','bajo_grasa'],
    goalFit:{fatLoss:7,muscleGain:7,endurance:9,maintenance:8},
    gi:78}),
  _f('camote', 'Camote Cocido', 'carbo', 86, 1.6, 20, 0.1, {
    subcategory:'tuberculo', fiber:3,
    dietaryTags:['vegano','vegetariano','halal','kosher','sin_gluten','sin_lactosa','bajo_grasa','alto_fibra'],
    goalFit:{fatLoss:8,muscleGain:8,endurance:9,maintenance:9},
    gi:63}),
  _f('yuca', 'Yuca Cocida', 'carbo', 160, 1.4, 38, 0.3, {
    subcategory:'tuberculo', fiber:1.8,
    dietaryTags:['vegano','vegetariano','halal','kosher','sin_gluten','sin_lactosa','bajo_grasa'],
    goalFit:{fatLoss:5,muscleGain:7,endurance:8,maintenance:7}}),
  _f('platano_maduro', 'Platano Maduro', 'carbo', 122, 1.3, 32, 0.4, {
    subcategory:'tuberculo', fiber:2.3,
    dietaryTags:['vegano','vegetariano','halal','kosher','sin_gluten','sin_lactosa'],
    goalFit:{fatLoss:5,muscleGain:7,endurance:9,maintenance:7}}),
  _f('quinoa', 'Quinoa Cocida', 'carbo', 120, 4.4, 21, 1.9, {
    subcategory:'grano', fiber:2.8,
    dietaryTags:['vegano','vegetariano','halal','kosher','sin_gluten','sin_lactosa'],
    goalFit:{fatLoss:8,muscleGain:8,endurance:9,maintenance:9},
    gi:53}),

  // ===== LEGUMBRES =====
  _f('frijol_negro', 'Frijoles Negros', 'carbo', 132, 8.9, 24, 0.5, {
    subcategory:'legumbre', fiber:8.7,
    dietaryTags:['vegano','vegetariano','halal','kosher','sin_gluten','sin_lactosa','alto_fibra'],
    goalFit:{fatLoss:9,muscleGain:8,endurance:8,maintenance:9}}),
  _f('lentejas', 'Lentejas Cocidas', 'carbo', 116, 9, 20, 0.4, {
    subcategory:'legumbre', fiber:7.9,
    dietaryTags:['vegano','vegetariano','halal','kosher','sin_gluten','sin_lactosa','alto_fibra'],
    goalFit:{fatLoss:9,muscleGain:8,endurance:9,maintenance:9},
    gi:32}),
  _f('garbanzos', 'Garbanzos Cocidos', 'carbo', 164, 9, 27, 2.6, {
    subcategory:'legumbre', fiber:7.6,
    dietaryTags:['vegano','vegetariano','halal','kosher','sin_gluten','sin_lactosa','alto_fibra'],
    goalFit:{fatLoss:8,muscleGain:8,endurance:9,maintenance:9}}),

  // ===== VEGETALES =====
  _f('brocoli', 'Brocoli', 'vegetal', 34, 2.8, 7, 0.4, {
    fiber:2.6,
    dietaryTags:['vegano','vegetariano','halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','bajo_grasa'],
    goalFit:{fatLoss:10,muscleGain:8,endurance:7,maintenance:10}}),
  _f('espinaca', 'Espinaca', 'vegetal', 23, 2.9, 3.6, 0.4, {
    fiber:2.2,
    dietaryTags:['vegano','vegetariano','halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','bajo_grasa'],
    goalFit:{fatLoss:10,muscleGain:7,endurance:7,maintenance:10}}),
  _f('lechuga', 'Lechuga', 'vegetal', 15, 1.4, 2.9, 0.2, {
    fiber:1.3,
    dietaryTags:['vegano','vegetariano','halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','bajo_grasa'],
    goalFit:{fatLoss:10,muscleGain:5,endurance:5,maintenance:9}}),
  _f('tomate', 'Tomate', 'vegetal', 18, 0.9, 3.9, 0.2, {
    fiber:1.2,
    dietaryTags:['vegano','vegetariano','halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','bajo_grasa'],
    goalFit:{fatLoss:9,muscleGain:5,endurance:6,maintenance:9}}),
  _f('zanahoria', 'Zanahoria', 'vegetal', 41, 0.9, 10, 0.2, {
    fiber:2.8,
    dietaryTags:['vegano','vegetariano','halal','kosher','sin_gluten','sin_lactosa','bajo_grasa'],
    goalFit:{fatLoss:9,muscleGain:6,endurance:7,maintenance:9}}),

  // ===== FRUTAS =====
  _f('manzana', 'Manzana', 'fruta', 52, 0.3, 14, 0.2, {
    fiber:2.4, sugar:10,
    servings:[{label:'1 unidad',grams:180}],
    dietaryTags:['vegano','vegetariano','halal','kosher','sin_gluten','sin_lactosa','bajo_grasa'],
    goalFit:{fatLoss:8,muscleGain:6,endurance:7,maintenance:9}}),
  _f('banana', 'Banana', 'fruta', 89, 1.1, 23, 0.3, {
    fiber:2.6, sugar:12,
    servings:[{label:'1 unidad',grams:120}],
    dietaryTags:['vegano','vegetariano','halal','kosher','sin_gluten','sin_lactosa','bajo_grasa'],
    goalFit:{fatLoss:6,muscleGain:8,endurance:9,maintenance:8}}),
  _f('naranja', 'Naranja', 'fruta', 47, 0.9, 12, 0.1, {
    fiber:2.4, sugar:9,
    servings:[{label:'1 unidad',grams:150}],
    dietaryTags:['vegano','vegetariano','halal','kosher','sin_gluten','sin_lactosa','bajo_grasa'],
    goalFit:{fatLoss:9,muscleGain:6,endurance:8,maintenance:9}}),
  _f('fresa', 'Fresas', 'fruta', 32, 0.7, 7.7, 0.3, {
    fiber:2, sugar:4.9,
    dietaryTags:['vegano','vegetariano','halal','kosher','sin_gluten','sin_lactosa','bajo_grasa','bajo_carbo'],
    goalFit:{fatLoss:10,muscleGain:6,endurance:7,maintenance:9}}),
  _f('pina', 'Pina', 'fruta', 50, 0.5, 13, 0.1, {
    fiber:1.4, sugar:10,
    dietaryTags:['vegano','vegetariano','halal','kosher','sin_gluten','sin_lactosa','bajo_grasa'],
    goalFit:{fatLoss:8,muscleGain:5,endurance:7,maintenance:9}}),
  _f('mango', 'Mango', 'fruta', 60, 0.8, 15, 0.4, {
    fiber:1.6, sugar:14,
    dietaryTags:['vegano','vegetariano','halal','kosher','sin_gluten','sin_lactosa','bajo_grasa'],
    goalFit:{fatLoss:7,muscleGain:6,endurance:8,maintenance:8}}),
  _f('papaya', 'Papaya', 'fruta', 43, 0.5, 11, 0.3, {
    fiber:1.7, sugar:8,
    dietaryTags:['vegano','vegetariano','halal','kosher','sin_gluten','sin_lactosa','bajo_grasa'],
    goalFit:{fatLoss:9,muscleGain:5,endurance:7,maintenance:9}}),

  // ===== GRASAS SALUDABLES =====
  _f('aguacate', 'Aguacate', 'grasa', 160, 2, 9, 15, {
    fiber:6.7,
    dietaryTags:['vegano','vegetariano','halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','keto','paleo','alto_fibra'],
    goalFit:{fatLoss:8,muscleGain:8,endurance:7,maintenance:9}}),
  _f('almendras', 'Almendras', 'grasa', 579, 21, 22, 50, {
    fiber:12.5, allergens:['frutos_secos'],
    servings:[{label:'10 unidades',grams:12}],
    dietaryTags:['vegano','vegetariano','halal','kosher','sin_gluten','sin_lactosa','keto','paleo','alto_fibra'],
    goalFit:{fatLoss:7,muscleGain:8,endurance:7,maintenance:8}}),
  _f('nueces', 'Nueces', 'grasa', 654, 15, 14, 65, {
    fiber:6.7, allergens:['frutos_secos'],
    dietaryTags:['vegano','vegetariano','halal','kosher','sin_gluten','sin_lactosa','keto','paleo'],
    goalFit:{fatLoss:6,muscleGain:8,endurance:7,maintenance:8}}),
  _f('mani', 'Mani/Cacahuate', 'grasa', 567, 26, 16, 49, {
    fiber:8.5, allergens:['cacahuate'],
    dietaryTags:['vegano','vegetariano','halal','kosher','sin_gluten','sin_lactosa','keto'],
    goalFit:{fatLoss:6,muscleGain:8,endurance:7,maintenance:8}}),
  _f('mantequilla_mani', 'Mantequilla de Mani', 'grasa', 588, 25, 20, 50, {
    allergens:['cacahuate'], sugar:9,
    dietaryTags:['vegano','vegetariano','halal','kosher','sin_gluten','sin_lactosa'],
    goalFit:{fatLoss:5,muscleGain:8,endurance:7,maintenance:7}}),
  _f('aceite_oliva', 'Aceite de Oliva Extra Virgen', 'grasa', 884, 0, 0, 100, {
    servings:[{label:'1 cucharada',grams:15}],
    dietaryTags:['vegano','vegetariano','halal','kosher','sin_gluten','sin_lactosa','keto','paleo','bajo_carbo'],
    goalFit:{fatLoss:7,muscleGain:7,endurance:7,maintenance:9}}),
  _f('chia', 'Semillas de Chia', 'grasa', 486, 17, 42, 31, {
    fiber:34,
    dietaryTags:['vegano','vegetariano','halal','kosher','sin_gluten','sin_lactosa','alto_fibra','paleo'],
    goalFit:{fatLoss:8,muscleGain:8,endurance:8,maintenance:9}}),

  // ===== BEBIDAS =====
  _f('agua', 'Agua', 'bebida', 0, 0, 0, 0, {
    servings:[{label:'1 vaso',grams:250},{label:'1 litro',grams:1000}],
    dietaryTags:['vegano','vegetariano','halal','kosher','sin_gluten','sin_lactosa','keto','paleo'],
    goalFit:{fatLoss:10,muscleGain:10,endurance:10,maintenance:10}}),
  _f('cafe', 'Cafe Negro', 'bebida', 2, 0.3, 0, 0, {
    servings:[{label:'1 taza',grams:240}],
    dietaryTags:['vegano','vegetariano','halal','kosher','sin_gluten','sin_lactosa','keto','paleo'],
    goalFit:{fatLoss:9,muscleGain:7,endurance:8,maintenance:8}}),
  _f('te_verde', 'Te Verde', 'bebida', 1, 0.2, 0, 0, {
    servings:[{label:'1 taza',grams:240}],
    dietaryTags:['vegano','vegetariano','halal','kosher','sin_gluten','sin_lactosa','keto','paleo'],
    goalFit:{fatLoss:10,muscleGain:7,endurance:8,maintenance:9}}),
  _f('leche_almendras', 'Leche de Almendras (sin azucar)', 'bebida', 13, 0.4, 0.3, 1.1, {
    allergens:['frutos_secos'],
    servings:[{label:'1 taza',grams:240}],
    dietaryTags:['vegano','vegetariano','halal','kosher','sin_gluten','sin_lactosa','keto','paleo','bajo_grasa'],
    goalFit:{fatLoss:9,muscleGain:5,endurance:6,maintenance:8}}),

  // ===== SUPLEMENTOS (como alimentos) =====
  _f('whey_protein', 'Whey Protein', 'suplemento', 400, 80, 8, 5, {
    allergens:['lacteos'],
    servings:[{label:'1 scoop',grams:30}],
    dietaryTags:['vegetariano','halal','kosher','sin_gluten','alto_proteina','bajo_grasa'],
    goalFit:{fatLoss:10,muscleGain:10,endurance:7,maintenance:9}})
];

// ===== FoodDB API =====
window.FoodDB = {
  FOODS,
  ALLERGEN_INFO,
  DIETARY_TAGS_INFO,

  getFood(id) {
    return FOODS.find(f => f.id === id) || null;
  },

  searchFood(query) {
    if(!query) return [];
    const q = String(query).toLowerCase().trim();
    const results = [];
    FOODS.forEach(f => {
      const name = (f.name || '').toLowerCase();
      const nameEn = (f.nameEn || '').toLowerCase();
      let score = 0;
      if(name === q || nameEn === q) score = 100;
      else if(name.startsWith(q) || nameEn.startsWith(q)) score = 80;
      else if(name.includes(q) || nameEn.includes(q)) score = 50;
      else if(f.id.includes(q.replace(/\s/g, '_'))) score = 40;
      if(score > 0) results.push({ ...f, _score: score });
    });
    return results.sort((a, b) => b._score - a._score).slice(0, 20);
  },

  filterByAllergens(excludeAllergens) {
    if(!excludeAllergens || !excludeAllergens.length) return FOODS;
    return FOODS.filter(f => !f.allergens.some(a => excludeAllergens.includes(a)));
  },

  filterByDietary(tags) {
    if(!tags || !tags.length) return FOODS;
    return FOODS.filter(f => tags.every(t => f.dietaryTags.includes(t)));
  },

  // Calcular macros para X gramos
  calcMacros(foodId, grams) {
    const f = this.getFood(foodId);
    if(!f || !grams) return null;
    const factor = grams / 100;
    return {
      cal:     Math.round(f.cal * factor),
      protein: Math.round(f.protein * factor * 10) / 10,
      carbs:   Math.round(f.carbs * factor * 10) / 10,
      fat:     Math.round(f.fat * factor * 10) / 10,
      fiber:   Math.round((f.fiber || 0) * factor * 10) / 10
    };
  },

  // Recomendar alimentos por meta + filtro alergenos
  recommendFoods(goal, excludeAllergens = [], count = 20) {
    return FOODS
      .filter(f => !f.allergens.some(a => excludeAllergens.includes(a)))
      .filter(f => f.goalFit && f.goalFit[goal] >= 7)
      .sort((a, b) => (b.goalFit[goal] || 0) - (a.goalFit[goal] || 0))
      .slice(0, count);
  },

  // Categorias disponibles
  getCategories() {
    const cats = new Set();
    FOODS.forEach(f => cats.add(f.category));
    return Array.from(cats);
  },

  count() {
    return FOODS.length;
  }
};

if(typeof module !== 'undefined' && module.exports) {
  module.exports = { FOODS, ALLERGEN_INFO, DIETARY_TAGS_INFO, FoodDB: window.FoodDB };
}
