// Generator script for nutritionDB.js - run with: node _build_db.js
const fs = require('fs');
const path = require('path');

// Helper to build food entry concisely
function f(id, name, nameEn, category, subcategory, cal, protein, carbs, fat, fiber, sugar, sodium, servings, defaultServing, allergens, dietaryTags, availability, goalFit, glycemicIndex, prepTime, storage, alternatives, notes) {
  return { id, name, nameEn, category, subcategory, cal, protein, carbs, fat, fiber, sugar, sodium, servings, defaultServing, allergens, dietaryTags, availability, goalFit, glycemicIndex, prepTime, storage, alternatives, notes };
}
const s = (label, grams) => ({ label, grams });
const gf = (fl, mg, en, mt) => ({ fatLoss: fl, muscleGain: mg, endurance: en, maintenance: mt });

const FOODS = [];

// ========== PROTEINAS ANIMALES - AVES ==========
FOODS.push(f('pechuga_pollo','Pechuga de Pollo','Chicken Breast','proteina_animal','ave',165,31,0,3.6,0,0,74,[s('1 pechuga mediana',170),s('1 filete',120),s('100g',100)],120,[],['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','bajo_grasa','paleo'],'panama_comun',gf(10,10,7,9),0,15,'refrigerador 3 dias',['pechuga_pavo','lomo_cerdo','atun_fresco'],'Excelente fuente de proteina magra, bajo en grasa.'));
FOODS.push(f('muslo_pollo','Muslo de Pollo','Chicken Thigh','proteina_animal','ave',209,26,0,11,0,0,86,[s('1 muslo',110),s('100g',100)],110,[],['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','paleo'],'panama_comun',gf(7,9,7,9),0,25,'refrigerador 3 dias',['pechuga_pollo'],'Mas jugoso y sabroso que la pechuga.'));
FOODS.push(f('pollo_molido','Pollo Molido','Ground Chicken','proteina_animal','ave',143,17.4,0,8.1,0,0,60,[s('1 porcion',100),s('1 libra',454)],100,[],['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','paleo'],'panama_comun',gf(8,9,6,9),0,15,'refrigerador 2 dias',['pavo_molido','res_molida_90'],'Versatil para albondigas, tacos y salsas.'));
FOODS.push(f('pechuga_pavo','Pechuga de Pavo','Turkey Breast','proteina_animal','ave',135,30,0,1,0,0,70,[s('1 filete',120),s('100g',100)],120,[],['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','bajo_grasa','paleo'],'panama_comun',gf(10,10,7,9),0,18,'refrigerador 3 dias',['pechuga_pollo','atun_fresco'],'Aun mas magra que el pollo.'));
FOODS.push(f('pavo_molido','Pavo Molido','Ground Turkey','proteina_animal','ave',148,19.7,0,7.4,0,0,66,[s('1 porcion',100),s('1 libra',454)],100,[],['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','paleo'],'panama_comun',gf(9,9,6,9),0,15,'refrigerador 2 dias',['pollo_molido','res_molida_90'],'Alternativa saludable a la res molida.'));
FOODS.push(f('pato','Pato (pechuga)','Duck Breast','proteina_animal','ave',337,19,0,28,0,0,59,[s('1 filete',150),s('100g',100)],120,[],['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','paleo','keto'],'panama_importado',gf(4,7,5,6),0,20,'refrigerador 2 dias',['muslo_pollo'],'Alto en grasa, sabor intenso.'));

// CARNES ROJAS
FOODS.push(f('res_molida_80','Res Molida 80/20','Ground Beef 80/20','proteina_animal','res',254,17,0,20,0,0,66,[s('1 porcion',100),s('1 libra',454)],120,[],['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','paleo','keto'],'panama_comun',gf(4,8,5,6),0,12,'refrigerador 2 dias',['res_molida_90','pavo_molido'],'Mas sabor, mas grasa.'));
FOODS.push(f('res_molida_90','Res Molida 90/10','Ground Beef 90/10','proteina_animal','res',176,20,0,10,0,0,72,[s('1 porcion',100),s('1 libra',454)],120,[],['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','paleo'],'panama_comun',gf(7,9,6,8),0,12,'refrigerador 2 dias',['pavo_molido','pollo_molido'],'Buen balance magra/grasa.'));
FOODS.push(f('bistec_res','Bistec de Res','Beef Steak','proteina_animal','res',217,26,0,12,0,0,55,[s('1 bistec',150),s('100g',100)],150,[],['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','paleo','keto'],'panama_comun',gf(7,9,6,8),0,10,'refrigerador 3 dias',['lomo_res','filete_res'],'Corte clasico panameño.'));
FOODS.push(f('lomo_res','Lomo de Res','Beef Tenderloin','proteina_animal','res',247,26,0,15,0,0,50,[s('1 porcion',150),s('100g',100)],150,[],['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','paleo','keto'],'panama_comun',gf(6,9,6,8),0,12,'refrigerador 3 dias',['filete_res','bistec_res'],'Corte tierno y magro.'));
FOODS.push(f('filete_res','Filete de Res','Beef Filet Mignon','proteina_animal','res',227,27,0,13,0,0,54,[s('1 filete',180),s('100g',100)],180,[],['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','paleo','keto'],'panama_comun',gf(7,9,6,8),0,10,'refrigerador 3 dias',['lomo_res','bistec_res'],'Corte premium muy tierno.'));
FOODS.push(f('picana','Picana','Picanha','proteina_animal','res',230,26,0,14,0,0,58,[s('1 porcion',180),s('100g',100)],180,[],['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','paleo','keto'],'panama_comun',gf(6,9,6,7),0,20,'refrigerador 3 dias',['bistec_res','lomo_res'],'Corte brasileño popular para parrilla.'));
FOODS.push(f('costilla_res','Costilla de Res','Beef Ribs','proteina_animal','res',288,20,0,23,0,0,80,[s('1 porcion',200),s('100g',100)],200,[],['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','paleo','keto'],'panama_comun',gf(3,7,4,5),0,90,'refrigerador 3 dias',['costilla_cerdo'],'Muy sabrosa, alta en grasa.'));
FOODS.push(f('lomo_cerdo','Lomo de Cerdo','Pork Loin','proteina_animal','cerdo',143,26,0,3.5,0,0,50,[s('1 porcion',150),s('100g',100)],150,[],['sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','bajo_grasa','paleo'],'panama_comun',gf(9,9,6,9),0,20,'refrigerador 3 dias',['pechuga_pollo'],'Corte magro de cerdo, similar a pechuga de pollo.'));
FOODS.push(f('chuleta_cerdo','Chuleta de Cerdo','Pork Chop','proteina_animal','cerdo',231,24,0,14,0,0,62,[s('1 chuleta',150),s('100g',100)],150,[],['sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','paleo','keto'],'panama_comun',gf(5,8,5,7),0,15,'refrigerador 3 dias',['lomo_cerdo','bistec_res'],'Clasico en la mesa panameña.'));
FOODS.push(f('jamon_cocido','Jamon Cocido','Cooked Ham','proteina_animal','embutido',145,21,1.5,6,0,1,1200,[s('1 lonja',30),s('100g',100)],60,[],['sin_gluten','sin_lactosa','alto_proteina'],'panama_comun',gf(6,7,5,6),0,0,'refrigerador 5 dias',['pechuga_pavo'],'Procesado, alto en sodio.'));
FOODS.push(f('jamon_serrano','Jamon Serrano','Serrano Ham','proteina_animal','embutido',241,31,0,13,0,0,2100,[s('1 lonja',20),s('100g',100)],40,['sulfitos'],['sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','paleo'],'panama_importado',gf(6,8,5,6),0,0,'refrigerador 7 dias',['jamon_cocido'],'Muy alto en sodio.'));
FOODS.push(f('salchicha','Salchicha','Sausage','proteina_animal','embutido',301,12,2,27,0,1,848,[s('1 salchicha',50),s('100g',100)],100,['sulfitos'],['sin_gluten','sin_lactosa','bajo_carbo'],'panama_comun',gf(2,4,3,4),0,8,'refrigerador 5 dias',['pechuga_pavo','jamon_cocido'],'Ultraprocesado, consumo ocasional.'));

// PESCADOS
FOODS.push(f('salmon','Salmon','Salmon','proteina_animal','pescado',208,20,0,13,0,0,59,[s('1 filete',150),s('100g',100)],150,['pescado'],['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','paleo','keto'],'panama_importado',gf(9,10,9,10),0,15,'refrigerador 2 dias',['trucha','atun_fresco'],'Rico en omega-3. Ideal para todas las metas.'));
FOODS.push(f('atun_fresco','Atun Fresco','Fresh Tuna','proteina_animal','pescado',144,23,0,5,0,0,39,[s('1 filete',150),s('100g',100)],150,['pescado'],['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','paleo'],'panama_comun',gf(10,10,8,9),0,8,'refrigerador 1 dia',['salmon','corvina'],'Ideal bajo en grasa y alto en proteina.'));
FOODS.push(f('atun_enlatado','Atun Enlatado en Agua','Canned Tuna (water)','proteina_animal','pescado',116,26,0,1,0,0,247,[s('1 lata',140),s('100g',100)],140,['pescado'],['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','bajo_grasa','paleo'],'panama_comun',gf(10,9,7,9),0,0,'despensa 2 años',['atun_fresco','sardina'],'Practico y economico.'));
FOODS.push(f('tilapia','Tilapia','Tilapia','proteina_animal','pescado',96,20,0,1.7,0,0,52,[s('1 filete',130),s('100g',100)],130,['pescado'],['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','bajo_grasa','paleo'],'panama_comun',gf(10,9,7,9),0,12,'refrigerador 2 dias',['corvina','mero'],'Pescado blanco suave.'));
FOODS.push(f('corvina','Corvina','Corvina','proteina_animal','pescado',105,22,0,1.8,0,0,75,[s('1 filete',150),s('100g',100)],150,['pescado'],['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','bajo_grasa','paleo'],'panama_comun',gf(10,9,7,9),0,12,'refrigerador 2 dias',['tilapia','mero'],'Pescado local muy valorado en Panama.'));
FOODS.push(f('mero','Mero','Grouper','proteina_animal','pescado',92,19,0,1,0,0,53,[s('1 filete',150),s('100g',100)],150,['pescado'],['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','bajo_grasa','paleo'],'panama_comun',gf(10,9,7,9),0,15,'refrigerador 2 dias',['corvina','tilapia'],'Carne firme, excelente al horno.'));
FOODS.push(f('bacalao','Bacalao','Cod','proteina_animal','pescado',82,18,0,0.7,0,0,54,[s('1 filete',150),s('100g',100)],150,['pescado'],['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','bajo_grasa','paleo'],'panama_importado',gf(10,8,7,9),0,12,'refrigerador 2 dias',['mero','tilapia'],'Muy bajo en grasa.'));
FOODS.push(f('sardina','Sardina','Sardine','proteina_animal','pescado',208,25,0,11,0,0,505,[s('1 lata',90),s('100g',100)],90,['pescado'],['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','paleo'],'panama_comun',gf(8,9,8,9),0,0,'despensa 3 años',['atun_enlatado','caballa'],'Alta en omega-3 y calcio.'));
FOODS.push(f('caballa','Caballa','Mackerel','proteina_animal','pescado',205,19,0,14,0,0,90,[s('1 filete',120),s('100g',100)],120,['pescado'],['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','paleo','keto'],'panama_comun',gf(7,9,9,9),0,15,'refrigerador 2 dias',['salmon','sardina'],'Rica en omega-3.'));
FOODS.push(f('trucha','Trucha','Trout','proteina_animal','pescado',148,21,0,7,0,0,52,[s('1 filete',150),s('100g',100)],150,['pescado'],['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','paleo'],'panama_importado',gf(9,9,8,9),0,15,'refrigerador 2 dias',['salmon','corvina'],'Alternativa al salmon.'));

// MARISCOS
FOODS.push(f('camaron','Camaron','Shrimp','proteina_animal','marisco',99,24,0.2,0.3,0,0,111,[s('1 porcion',100),s('6 camarones',90)],100,['mariscos'],['halal','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','bajo_grasa','paleo'],'panama_comun',gf(10,9,7,9),0,8,'refrigerador 2 dias',['langostino','tilapia'],'Muy bajo en calorias y grasa.'));
FOODS.push(f('langostino','Langostino','Prawn','proteina_animal','marisco',106,20,0.9,1.7,0,0,224,[s('1 porcion',100),s('5 piezas',120)],100,['mariscos'],['halal','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','bajo_grasa','paleo'],'panama_comun',gf(10,9,7,9),0,10,'refrigerador 2 dias',['camaron'],'Similar al camaron, mas grande.'));
FOODS.push(f('calamar','Calamar','Squid','proteina_animal','molusco',92,16,3,1.4,0,0,44,[s('1 porcion',100),s('100g',100)],100,['moluscos'],['halal','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','bajo_grasa','paleo'],'panama_comun',gf(9,8,6,8),0,8,'refrigerador 1 dia',['pulpo','camaron'],'Evitar frito para metas de fat loss.'));
FOODS.push(f('pulpo','Pulpo','Octopus','proteina_animal','molusco',82,15,2.2,1,0,0,230,[s('1 porcion',100),s('100g',100)],100,['moluscos'],['halal','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','bajo_grasa','paleo'],'panama_comun',gf(10,8,6,8),0,60,'refrigerador 1 dia',['calamar','camaron'],'Requiere coccion larga para ablandar.'));
FOODS.push(f('mejillones','Mejillones','Mussels','proteina_animal','molusco',86,12,3.7,2.2,0,0,286,[s('1 porcion',100),s('100g',100)],100,['moluscos'],['halal','sin_gluten','sin_lactosa','bajo_carbo','paleo'],'panama_importado',gf(9,7,7,8),0,10,'refrigerador 1 dia',['almejas'],'Alto en hierro y B12.'));
FOODS.push(f('almejas','Almejas','Clams','proteina_animal','molusco',74,13,2.6,1,0,0,56,[s('1 porcion',100),s('100g',100)],100,['moluscos'],['halal','sin_gluten','sin_lactosa','bajo_carbo','paleo'],'panama_importado',gf(9,7,7,8),0,8,'refrigerador 1 dia',['mejillones'],'Muy alta en hierro.'));

// HUEVOS + DESPOJOS
FOODS.push(f('huevo_entero','Huevo Entero','Whole Egg','proteina_animal','huevo',155,13,1.1,11,0,1.1,124,[s('1 huevo grande',50),s('2 huevos',100)],100,['huevo'],['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','vegetariano','paleo','keto'],'panama_comun',gf(8,10,7,10),0,5,'refrigerador 3 semanas',['clara_huevo'],'Proteina completa ideal.'));
FOODS.push(f('clara_huevo','Clara de Huevo','Egg White','proteina_animal','huevo',52,11,0.7,0.2,0,0.7,166,[s('1 clara',33),s('100g',100)],100,['huevo'],['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','bajo_grasa','vegetariano','paleo'],'panama_comun',gf(10,9,6,8),0,3,'refrigerador 4 dias',['huevo_entero'],'Proteina pura sin grasa.'));
FOODS.push(f('higado_res','Higado de Res','Beef Liver','proteina_animal','despojo',135,20,3.9,3.6,0,0,69,[s('1 porcion',100),s('100g',100)],100,[],['halal','kosher','sin_gluten','sin_lactosa','bajo_carbo','alto_proteina','paleo'],'panama_comun',gf(8,8,7,7),0,10,'refrigerador 1 dia',['bistec_res'],'Muy alta en hierro, B12 y vitamina A.'));
FOODS.push(f('mondongo','Mondongo','Tripe','proteina_animal','despojo',85,12,0,3.7,0,0,97,[s('1 porcion',150),s('100g',100)],150,[],['halal','sin_gluten','sin_lactosa','bajo_carbo','paleo'],'panama_comun',gf(6,6,5,6),0,120,'refrigerador 2 dias',['higado_res'],'Tradicional en sancocho panameño.'));

// ========== LACTEOS ==========
FOODS.push(f('leche_entera','Leche Entera','Whole Milk','lacteo','leche',61,3.2,4.8,3.3,0,4.8,44,[s('1 vaso',240),s('100ml',100)],240,['lacteos'],['halal','kosher','sin_gluten','vegetariano'],'panama_comun',gf(5,8,7,8),30,0,'refrigerador 7 dias',['leche_descremada','leche_almendras'],'Fuente de calcio y proteina.'));
FOODS.push(f('leche_descremada','Leche Descremada','Skim Milk','lacteo','leche',34,3.4,5,0.1,0,5,42,[s('1 vaso',240),s('100ml',100)],240,['lacteos'],['halal','kosher','sin_gluten','bajo_grasa','vegetariano'],'panama_comun',gf(9,8,7,9),32,0,'refrigerador 7 dias',['leche_entera'],'Sin grasa, mantiene proteina.'));
FOODS.push(f('leche_deslactosada','Leche Deslactosada','Lactose-free Milk','lacteo','leche',45,3.2,4.8,1.5,0,4.8,44,[s('1 vaso',240),s('100ml',100)],240,['lacteos'],['halal','kosher','sin_gluten','sin_lactosa','vegetariano'],'panama_comun',gf(7,8,7,8),30,0,'refrigerador 7 dias',['leche_almendras'],'Para intolerantes a lactosa.'));
FOODS.push(f('leche_almendras','Leche de Almendras','Almond Milk','lacteo','leche_vegetal',17,0.6,0.6,1.5,0.3,0,63,[s('1 vaso',240),s('100ml',100)],240,['frutos_secos'],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','bajo_carbo'],'panama_comun',gf(8,3,4,7),25,0,'refrigerador 7 dias',['leche_coco','leche_soya'],'Baja en calorias.'));
FOODS.push(f('leche_soya','Leche de Soya','Soy Milk','lacteo','leche_vegetal',33,3.3,1.8,1.8,0.6,0.9,51,[s('1 vaso',240),s('100ml',100)],240,['soya'],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano'],'panama_comun',gf(7,7,6,8),34,0,'refrigerador 7 dias',['leche_almendras'],'Alternativa vegetal con proteina.'));
FOODS.push(f('leche_coco','Leche de Coco (bebida)','Coconut Milk (drink)','lacteo','leche_vegetal',20,0.2,1.3,1.7,0,1.2,15,[s('1 vaso',240),s('100ml',100)],240,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo'],'panama_comun',gf(7,3,4,7),28,0,'refrigerador 7 dias',['leche_almendras'],'Suave sabor a coco.'));
FOODS.push(f('leche_avena','Leche de Avena','Oat Milk','lacteo','leche_vegetal',47,0.8,7.5,1.5,0.8,4.1,42,[s('1 vaso',240),s('100ml',100)],240,['gluten'],['sin_lactosa','vegetariano','vegano'],'panama_comun',gf(6,4,7,7),60,0,'refrigerador 7 dias',['leche_almendras'],'Cremosa, bebida tendencia.'));
FOODS.push(f('yogurt_griego','Yogurt Griego Natural','Greek Yogurt (plain)','lacteo','yogurt',59,10,3.6,0.4,0,3.2,36,[s('1 taza',227),s('100g',100)],170,['lacteos'],['halal','kosher','sin_gluten','alto_proteina','bajo_grasa','vegetariano'],'panama_comun',gf(10,10,7,10),15,0,'refrigerador 14 dias',['yogurt_natural','requeson'],'Altisimo en proteina.'));
FOODS.push(f('yogurt_frutas','Yogurt con Frutas','Yogurt with Fruit','lacteo','yogurt',95,4,15,2.5,0.5,13,50,[s('1 envase',170),s('100g',100)],170,['lacteos'],['halal','kosher','sin_gluten','vegetariano'],'panama_comun',gf(5,6,7,7),40,0,'refrigerador 14 dias',['yogurt_griego'],'Mas azucar que el natural.'));
FOODS.push(f('yogurt_natural','Yogurt Natural','Plain Yogurt','lacteo','yogurt',61,3.5,4.7,3.3,0,4.7,46,[s('1 taza',245),s('100g',100)],170,['lacteos'],['halal','kosher','sin_gluten','vegetariano'],'panama_comun',gf(7,7,7,8),36,0,'refrigerador 14 dias',['yogurt_griego'],'Balance proteina/grasa.'));
FOODS.push(f('queso_mozzarella','Queso Mozzarella','Mozzarella Cheese','lacteo','queso',280,28,3.1,17,0,1.2,627,[s('1 lonja',30),s('100g',100)],30,['lacteos'],['halal','kosher','sin_gluten','bajo_carbo','alto_proteina','vegetariano','keto'],'panama_comun',gf(5,7,5,7),0,0,'refrigerador 14 dias',['queso_fresco'],'Suave, se derrite bien.'));
FOODS.push(f('queso_cheddar','Queso Cheddar','Cheddar Cheese','lacteo','queso',403,25,1.3,33,0,0.5,621,[s('1 lonja',30),s('100g',100)],30,['lacteos'],['halal','kosher','sin_gluten','bajo_carbo','alto_proteina','vegetariano','keto'],'panama_comun',gf(3,6,4,5),0,0,'refrigerador 21 dias',['queso_mozzarella'],'Fuerte sabor, alto en grasa.'));
FOODS.push(f('queso_parmesano','Queso Parmesano','Parmesan','lacteo','queso',431,38,4.1,29,0,0.8,1529,[s('1 cda',5),s('100g',100)],10,['lacteos'],['halal','kosher','sin_gluten','bajo_carbo','alto_proteina','vegetariano','keto'],'panama_importado',gf(4,7,4,5),0,0,'refrigerador 60 dias',['queso_cheddar'],'Concentrado, pequenas porciones.'));
FOODS.push(f('queso_fresco','Queso Fresco','Fresh Cheese','lacteo','queso',264,20,3.8,19,0,3.5,625,[s('1 porcion',30),s('100g',100)],50,['lacteos'],['halal','kosher','sin_gluten','bajo_carbo','alto_proteina','vegetariano'],'panama_comun',gf(5,7,5,7),0,0,'refrigerador 7 dias',['queso_mozzarella'],'Tipico panameño, suave.'));
FOODS.push(f('queso_crema','Queso Crema','Cream Cheese','lacteo','queso',342,6,4.1,34,0,3.2,321,[s('1 cda',15),s('100g',100)],30,['lacteos'],['halal','kosher','sin_gluten','bajo_carbo','vegetariano','keto'],'panama_comun',gf(3,4,3,5),0,0,'refrigerador 14 dias',['requeson'],'Untable, alto en grasa.'));
FOODS.push(f('requeson','Requeson/Cottage','Cottage Cheese','lacteo','queso',98,11,3.4,4.3,0,2.7,364,[s('1 taza',226),s('100g',100)],150,['lacteos'],['halal','kosher','sin_gluten','alto_proteina','vegetariano'],'panama_comun',gf(9,9,6,9),10,0,'refrigerador 10 dias',['yogurt_griego'],'Alto en proteina, textura grumosa.'));
FOODS.push(f('mantequilla','Mantequilla','Butter','lacteo','grasa_lactea',717,0.9,0.1,81,0,0.1,11,[s('1 cda',14),s('100g',100)],10,['lacteos'],['halal','kosher','sin_gluten','vegetariano','keto'],'panama_comun',gf(2,4,3,4),0,0,'refrigerador 30 dias',['ghee','aceite_oliva'],'100% grasa lactea.'));
FOODS.push(f('ghee','Ghee','Ghee','lacteo','grasa_lactea',900,0,0,100,0,0,0,[s('1 cda',14),s('100g',100)],10,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','keto','paleo'],'panama_importado',gf(3,5,4,5),0,0,'despensa 90 dias',['mantequilla','aceite_coco'],'Mantequilla clarificada, sin lactosa.'));

// ========== CARBOHIDRATOS COMPLEJOS - GRANOS ==========
FOODS.push(f('arroz_blanco','Arroz Blanco Cocido','White Rice (cooked)','carbo_complejo','grano',130,2.7,28,0.3,0.4,0.1,1,[s('1 taza',158),s('100g',100)],150,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','bajo_grasa'],'panama_comun',gf(5,8,9,7),73,20,'refrigerador 4 dias',['arroz_integral','quinoa'],'Base de la dieta panameña.'));
FOODS.push(f('arroz_integral','Arroz Integral Cocido','Brown Rice (cooked)','carbo_complejo','grano',112,2.6,24,0.9,1.8,0.4,5,[s('1 taza',195),s('100g',100)],150,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','bajo_grasa'],'panama_comun',gf(8,8,9,9),68,35,'refrigerador 4 dias',['quinoa','arroz_blanco'],'Mas fibra que el blanco.'));
FOODS.push(f('arroz_jazmin','Arroz Jazmin','Jasmine Rice','carbo_complejo','grano',129,2.9,28,0.3,0.6,0.1,0,[s('1 taza',158),s('100g',100)],150,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','bajo_grasa'],'panama_comun',gf(5,8,9,7),68,20,'refrigerador 4 dias',['arroz_blanco'],'Aromatico, popular para asiatico.'));
FOODS.push(f('quinoa','Quinoa Cocida','Quinoa (cooked)','carbo_complejo','grano',120,4.4,21.3,1.9,2.8,0.9,7,[s('1 taza',185),s('100g',100)],150,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','alto_proteina'],'panama_comun',gf(9,9,9,10),53,15,'refrigerador 5 dias',['arroz_integral'],'Pseudo-cereal con proteina completa.'));
FOODS.push(f('avena','Avena (seca)','Oats (dry)','carbo_complejo','grano',389,16.9,66,6.9,10.6,0,2,[s('1/2 taza',40),s('100g',100)],40,['gluten'],['sin_lactosa','vegetariano','vegano','alto_fibra'],'panama_comun',gf(9,9,10,10),55,5,'despensa 12 meses',['quinoa'],'Alta en fibra beta-glucano.'));
FOODS.push(f('bulgur','Bulgur Cocido','Bulgur (cooked)','carbo_complejo','grano',83,3.1,18.6,0.2,4.5,0.1,5,[s('1 taza',182),s('100g',100)],150,['gluten'],['sin_lactosa','vegetariano','vegano','alto_fibra'],'panama_importado',gf(9,8,9,9),48,15,'refrigerador 4 dias',['quinoa','cuscus'],'Trigo integral, rapido de cocinar.'));
FOODS.push(f('cebada','Cebada Perlada Cocida','Pearl Barley (cooked)','carbo_complejo','grano',123,2.3,28.2,0.4,3.8,0.3,3,[s('1 taza',157),s('100g',100)],150,['gluten'],['sin_lactosa','vegetariano','vegano','alto_fibra'],'panama_importado',gf(8,8,9,9),35,40,'refrigerador 4 dias',['avena','bulgur'],'IG bajo, ideal endurance.'));
FOODS.push(f('maiz','Maiz Dulce','Sweet Corn','carbo_complejo','grano',86,3.3,19,1.4,2.7,3.2,15,[s('1 mazorca',100),s('100g',100)],100,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano'],'panama_comun',gf(6,7,8,8),52,10,'refrigerador 5 dias',['palomitas'],'Base cultural centroamericana.'));
FOODS.push(f('palomitas','Palomitas de Maiz (aire)','Popcorn (air-popped)','carbo_complejo','grano',387,13,78,4.5,15,0.9,8,[s('1 taza',8),s('100g',100)],30,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','alto_fibra'],'panama_comun',gf(8,6,7,8),55,5,'despensa 30 dias',['galletas_integrales'],'Snack ligero sin aceite.'));

// TUBERCULOS
FOODS.push(f('papa','Papa Blanca Cocida','White Potato (boiled)','carbo_complejo','tuberculo',87,1.9,20.1,0.1,1.8,0.9,4,[s('1 mediana',170),s('100g',100)],170,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','bajo_grasa'],'panama_comun',gf(6,7,9,8),78,20,'despensa 30 dias',['camote','yuca'],'Fuente de potasio y vitamina C.'));
FOODS.push(f('camote','Camote (Batata)','Sweet Potato','carbo_complejo','tuberculo',86,1.6,20.1,0.1,3,4.2,55,[s('1 mediano',130),s('100g',100)],130,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','alto_fibra'],'panama_comun',gf(9,8,10,9),63,25,'despensa 21 dias',['papa','yuca'],'Alto en vitamina A, excelente pre-entreno.'));
FOODS.push(f('yuca','Yuca Cocida','Cassava (cooked)','carbo_complejo','tuberculo',191,1.4,45.9,0.3,1.8,2.1,14,[s('1 porcion',150),s('100g',100)],150,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo'],'panama_comun',gf(5,7,9,7),55,30,'refrigerador 4 dias',['name','otoe'],'Tradicional en sancocho panameño.'));
FOODS.push(f('name','Name','Yam','carbo_complejo','tuberculo',118,1.5,27.9,0.2,4.1,0.5,9,[s('1 porcion',150),s('100g',100)],150,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','alto_fibra'],'panama_comun',gf(7,7,9,8),51,35,'despensa 21 dias',['yuca','otoe'],'Ingrediente clave del sancocho.'));
FOODS.push(f('otoe','Otoe','Taro','carbo_complejo','tuberculo',112,1.5,26.5,0.2,4.1,0.4,11,[s('1 porcion',150),s('100g',100)],150,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','alto_fibra'],'panama_comun',gf(7,7,9,8),54,35,'despensa 14 dias',['name','yuca'],'Raiz tradicional panameña.'));
FOODS.push(f('platano_verde','Platano Verde','Green Plantain','carbo_complejo','tuberculo',122,1.3,31.9,0.4,2.3,15,4,[s('1 unidad',180),s('100g',100)],150,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo'],'panama_comun',gf(6,7,9,8),40,15,'despensa 7 dias',['platano_maduro','yuca'],'Base de patacones panameños.'));
FOODS.push(f('platano_maduro','Platano Maduro','Ripe Plantain','carbo_complejo','tuberculo',122,1.3,31.9,0.4,2.3,17,4,[s('1 unidad',180),s('100g',100)],150,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo'],'panama_comun',gf(5,7,9,7),55,15,'despensa 5 dias',['platano_verde','camote'],'Dulce, ideal frito o al horno.'));

// PAN Y PASTA
FOODS.push(f('pan_integral','Pan Integral','Whole Wheat Bread','carbo_complejo','pan',247,13,41,3.4,7,5.7,447,[s('1 rebanada',40),s('100g',100)],40,['gluten'],['sin_lactosa','vegetariano','vegano','alto_fibra'],'panama_comun',gf(7,7,8,8),69,0,'despensa 5 dias',['pan_pita','tortilla_trigo'],'Mas fibra que el blanco.'));
FOODS.push(f('pan_blanco','Pan Blanco','White Bread','carbo_simple','pan',265,9,49,3.2,2.7,5,491,[s('1 rebanada',30),s('100g',100)],30,['gluten'],['sin_lactosa','vegetariano','vegano'],'panama_comun',gf(3,5,7,5),75,0,'despensa 5 dias',['pan_integral'],'Procesado, IG alto.'));
FOODS.push(f('pan_pita','Pan Pita','Pita Bread','carbo_complejo','pan',275,9.1,55.7,1.2,2.2,1.3,536,[s('1 pita',60),s('100g',100)],60,['gluten'],['sin_lactosa','vegetariano','vegano'],'panama_comun',gf(5,6,7,6),57,0,'despensa 5 dias',['tortilla_trigo'],'Versatil para wraps.'));
FOODS.push(f('tortilla_trigo','Tortilla de Trigo','Flour Tortilla','carbo_complejo','pan',306,8.2,51,7.3,3.2,1.3,690,[s('1 tortilla',35),s('100g',100)],35,['gluten'],['sin_lactosa','vegetariano','vegano'],'panama_comun',gf(4,6,7,6),70,0,'despensa 14 dias',['tortilla_maiz','pan_pita'],'Para burritos y wraps.'));
FOODS.push(f('tortilla_maiz','Tortilla de Maiz','Corn Tortilla','carbo_complejo','pan',218,5.7,45.1,2.9,6.3,1.1,45,[s('1 tortilla',24),s('100g',100)],50,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','alto_fibra'],'panama_comun',gf(6,7,8,7),52,0,'despensa 7 dias',['tortilla_trigo'],'Tradicional centroamericana.'));
FOODS.push(f('pasta','Pasta Regular Cocida','Regular Pasta (cooked)','carbo_complejo','pasta',131,5,25,1.1,1.8,0.6,1,[s('1 taza',140),s('100g',100)],100,['gluten','huevo'],['sin_lactosa','vegetariano'],'panama_comun',gf(5,7,9,7),49,10,'refrigerador 5 dias',['pasta_integral'],'Base italiana clasica.'));
FOODS.push(f('pasta_integral','Pasta Integral Cocida','Whole Wheat Pasta','carbo_complejo','pasta',124,5.3,26.5,0.5,3.9,0.6,4,[s('1 taza',140),s('100g',100)],100,['gluten'],['sin_lactosa','vegetariano','vegano','alto_fibra'],'panama_comun',gf(7,7,9,8),48,10,'refrigerador 5 dias',['pasta','quinoa'],'Mas fibra, IG menor.'));
FOODS.push(f('fideos_arroz','Fideos de Arroz','Rice Noodles','carbo_complejo','pasta',109,1.8,24.9,0.2,1,0,19,[s('1 taza',176),s('100g',100)],100,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','bajo_grasa'],'panama_importado',gf(6,7,9,7),53,5,'despensa 12 meses',['pasta_integral'],'Sin gluten, textura ligera.'));
FOODS.push(f('ramen','Fideos Ramen Instantaneos','Instant Ramen','carbo_simple','pasta',436,10,55,18,2.5,1.5,1731,[s('1 paquete',85),s('100g',100)],85,['gluten','huevo'],['vegetariano'],'panama_comun',gf(1,4,5,3),78,5,'despensa 12 meses',['pasta'],'Muy alto en sodio, consumo ocasional.'));
FOODS.push(f('lasagna','Lasana (pasta seca)','Lasagna (dry pasta)','carbo_complejo','pasta',371,13,75,1.5,3,2,6,[s('1 porcion',100),s('100g',100)],100,['gluten','huevo'],['sin_lactosa','vegetariano'],'panama_comun',gf(4,7,7,6),50,30,'despensa 24 meses',['pasta'],'Base de la lasana al horno.'));

// LEGUMBRES
FOODS.push(f('frijoles_negros','Frijoles Negros','Black Beans','carbo_complejo','legumbre',132,8.9,23.7,0.5,8.7,0.3,1,[s('1 taza',172),s('100g',100)],150,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','alto_fibra','alto_proteina'],'panama_comun',gf(9,9,9,10),30,60,'refrigerador 5 dias',['frijoles_rojos','lentejas'],'Pilar de la dieta latina.'));
FOODS.push(f('frijoles_rojos','Frijoles Rojos','Red Beans','carbo_complejo','legumbre',127,8.7,22.8,0.5,6.4,0.3,1,[s('1 taza',177),s('100g',100)],150,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','alto_fibra','alto_proteina'],'panama_comun',gf(9,9,9,10),29,60,'refrigerador 5 dias',['frijoles_negros','habichuelas'],'Acompañante tradicional.'));
FOODS.push(f('lentejas','Lentejas Cocidas','Lentils (cooked)','carbo_complejo','legumbre',116,9,20,0.4,7.9,1.8,2,[s('1 taza',198),s('100g',100)],150,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','alto_fibra','alto_proteina'],'panama_comun',gf(10,9,9,10),32,30,'refrigerador 5 dias',['frijoles_negros','garbanzos'],'Rapida coccion, alta en hierro.'));
FOODS.push(f('garbanzos','Garbanzos Cocidos','Chickpeas (cooked)','carbo_complejo','legumbre',164,8.9,27.4,2.6,7.6,4.8,7,[s('1 taza',164),s('100g',100)],150,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','alto_fibra','alto_proteina'],'panama_comun',gf(9,9,9,10),28,60,'refrigerador 5 dias',['lentejas','frijoles_negros'],'Base del hummus.'));
FOODS.push(f('habichuelas','Habichuelas/Porotos','Pinto Beans','carbo_complejo','legumbre',143,9,26.2,0.7,9,0.3,1,[s('1 taza',171),s('100g',100)],150,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','alto_fibra','alto_proteina'],'panama_comun',gf(9,9,9,10),39,60,'refrigerador 5 dias',['frijoles_rojos'],'Populares en guisos.'));

// ========== CARBOHIDRATOS SIMPLES ==========
FOODS.push(f('azucar','Azucar Blanca','Sugar','carbo_simple','endulzante',387,0,99.8,0,0,99.8,1,[s('1 cda',12),s('100g',100)],5,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano'],'panama_comun',gf(0,2,5,2),65,0,'despensa indefinido',['miel'],'Calorias vacias.'));
FOODS.push(f('miel','Miel','Honey','carbo_simple','endulzante',304,0.3,82.4,0,0.2,82.1,4,[s('1 cda',21),s('100g',100)],10,[],['kosher','sin_gluten','sin_lactosa','vegetariano'],'panama_comun',gf(3,5,7,5),58,0,'despensa indefinido',['azucar'],'Antioxidantes naturales.'));
FOODS.push(f('jalea','Jalea','Jelly','carbo_simple','endulzante',250,0.2,65,0,0.5,50,30,[s('1 cda',20),s('100g',100)],15,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano'],'panama_comun',gf(2,3,6,3),55,0,'refrigerador 90 dias',['mermelada'],'Generalmente alta en azucar.'));
FOODS.push(f('mermelada','Mermelada','Jam','carbo_simple','endulzante',278,0.4,68.9,0.1,1.2,48.5,32,[s('1 cda',20),s('100g',100)],15,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano'],'panama_comun',gf(3,3,6,3),55,0,'refrigerador 90 dias',['jalea'],'Con trozos de fruta.'));
FOODS.push(f('cereal_azucarado','Cereal Azucarado','Sugary Cereal','carbo_simple','cereal',380,6,84,3,3,35,610,[s('1 taza',40),s('100g',100)],40,['gluten'],['sin_lactosa','vegetariano'],'panama_comun',gf(2,4,6,3),77,0,'despensa 6 meses',['avena'],'Ultra procesado, alto en azucar.'));
FOODS.push(f('galletas_dulces','Galletas Dulces','Cookies','carbo_simple','snack',470,5,71,18,2,30,340,[s('1 galleta',10),s('100g',100)],30,['gluten','huevo','lacteos'],['vegetariano'],'panama_comun',gf(1,3,4,3),60,0,'despensa 6 meses',['galletas_avena'],'Ocasional.'));
FOODS.push(f('helado','Helado de Vainilla','Vanilla Ice Cream','carbo_simple','postre',207,3.5,23.6,11,0.7,21.2,80,[s('1 bola',66),s('100g',100)],100,['lacteos','huevo'],['halal','kosher','sin_gluten','vegetariano'],'panama_comun',gf(2,4,5,4),57,0,'freezer 60 dias',['yogurt_griego'],'Placer ocasional.'));

// ========== VEGETALES ==========
FOODS.push(f('lechuga','Lechuga','Lettuce','vegetal','verde',15,1.4,2.9,0.2,1.3,0.8,28,[s('1 taza',47),s('100g',100)],80,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','bajo_carbo','bajo_grasa','paleo','keto'],'panama_comun',gf(10,5,6,9),15,0,'refrigerador 7 dias',['espinaca','arugula'],'Base de ensaladas.'));
FOODS.push(f('espinaca','Espinaca','Spinach','vegetal','verde',23,2.9,3.6,0.4,2.2,0.4,79,[s('1 taza',30),s('100g',100)],100,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','bajo_carbo','bajo_grasa','paleo','keto'],'panama_comun',gf(10,7,7,10),15,3,'refrigerador 5 dias',['kale','acelga'],'Alta en hierro y folato.'));
FOODS.push(f('acelga','Acelga','Swiss Chard','vegetal','verde',19,1.8,3.7,0.2,1.6,1.1,213,[s('1 taza',36),s('100g',100)],100,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','bajo_carbo','bajo_grasa','paleo','keto'],'panama_comun',gf(10,6,7,9),15,5,'refrigerador 5 dias',['espinaca','kale'],'Alta en vitamina K.'));
FOODS.push(f('kale','Kale','Kale','vegetal','verde',49,4.3,8.8,0.9,3.6,2.3,38,[s('1 taza',67),s('100g',100)],100,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','bajo_carbo','bajo_grasa','paleo','keto','alto_fibra'],'panama_comun',gf(10,7,7,10),15,5,'refrigerador 5 dias',['espinaca'],'Superfood denso en nutrientes.'));
FOODS.push(f('arugula','Arugula','Arugula','vegetal','verde',25,2.6,3.7,0.7,1.6,2.1,27,[s('1 taza',20),s('100g',100)],50,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','bajo_carbo','paleo','keto'],'panama_comun',gf(10,5,6,9),15,0,'refrigerador 5 dias',['espinaca','lechuga'],'Sabor picante, para ensaladas.'));
FOODS.push(f('perejil','Perejil','Parsley','vegetal','verde',36,3,6.3,0.8,3.3,0.9,56,[s('1 taza',60),s('100g',100)],10,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','bajo_carbo','paleo'],'panama_comun',gf(10,5,6,8),15,0,'refrigerador 5 dias',['cilantro'],'Hierba fresca aromatica.'));
FOODS.push(f('cilantro','Cilantro','Cilantro','vegetal','verde',23,2.1,3.7,0.5,2.8,0.9,46,[s('1 taza',16),s('100g',100)],10,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','bajo_carbo','paleo'],'panama_comun',gf(10,5,6,8),15,0,'refrigerador 5 dias',['perejil'],'Base aromatica panameña.'));
FOODS.push(f('apio','Apio','Celery','vegetal','verde',16,0.7,3,0.2,1.6,1.3,80,[s('1 tallo',40),s('100g',100)],80,['apio'],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','bajo_carbo','bajo_grasa','paleo','keto'],'panama_comun',gf(10,4,6,8),15,0,'refrigerador 7 dias',['pepino'],'Crujiente, muy bajo en calorias.'));

// CRUCIFERAS
FOODS.push(f('brocoli','Brocoli','Broccoli','vegetal','crucifera',34,2.8,6.6,0.4,2.6,1.7,33,[s('1 taza',91),s('100g',100)],100,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','bajo_carbo','bajo_grasa','paleo','keto'],'panama_comun',gf(10,7,7,10),15,8,'refrigerador 5 dias',['coliflor','bruselas'],'Alto en vitamina C y fibra.'));
FOODS.push(f('coliflor','Coliflor','Cauliflower','vegetal','crucifera',25,1.9,5,0.3,2,1.9,30,[s('1 taza',100),s('100g',100)],100,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','bajo_carbo','bajo_grasa','paleo','keto'],'panama_comun',gf(10,6,6,9),15,8,'refrigerador 5 dias',['brocoli'],'Sustituto de arroz bajo en carbo.'));
FOODS.push(f('repollo','Repollo','Cabbage','vegetal','crucifera',25,1.3,5.8,0.1,2.5,3.2,18,[s('1 taza',89),s('100g',100)],100,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','bajo_carbo','bajo_grasa','paleo','keto'],'panama_comun',gf(10,5,6,9),15,10,'refrigerador 14 dias',['coliflor'],'Economico y versatil.'));
FOODS.push(f('col_rizada','Col Rizada','Collard Greens','vegetal','crucifera',32,3,5.4,0.6,4,0.5,17,[s('1 taza',36),s('100g',100)],100,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','bajo_carbo','paleo','keto'],'panama_comun',gf(10,7,7,9),15,10,'refrigerador 5 dias',['kale'],'Similar al kale.'));
FOODS.push(f('bruselas','Coles de Bruselas','Brussels Sprouts','vegetal','crucifera',43,3.4,9,0.3,3.8,2.2,25,[s('1 taza',88),s('100g',100)],100,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','bajo_carbo','paleo','keto'],'panama_importado',gf(9,7,7,9),15,12,'refrigerador 7 dias',['brocoli'],'Sabor intenso al asar.'));

// SOLANACEAS + CEBOLLAS + OTROS
FOODS.push(f('tomate','Tomate','Tomato','vegetal','solanacea',18,0.9,3.9,0.2,1.2,2.6,5,[s('1 mediano',123),s('100g',100)],120,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','bajo_carbo','bajo_grasa','paleo','keto'],'panama_comun',gf(10,5,7,9),15,0,'refrigerador 7 dias',['pimenton'],'Rico en licopeno.'));
FOODS.push(f('pimenton','Pimenton','Bell Pepper','vegetal','solanacea',31,1,6,0.3,2.1,4.2,4,[s('1 mediano',120),s('100g',100)],120,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','bajo_carbo','bajo_grasa','paleo','keto'],'panama_comun',gf(10,5,7,9),15,0,'refrigerador 10 dias',['tomate'],'Alto en vitamina C.'));
FOODS.push(f('berenjena','Berenjena','Eggplant','vegetal','solanacea',25,1,5.9,0.2,3,3.5,2,[s('1 porcion',100),s('100g',100)],100,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','bajo_carbo','bajo_grasa','paleo','keto'],'panama_comun',gf(10,5,7,9),15,15,'refrigerador 7 dias',['calabacin'],'Versatil al horno.'));
FOODS.push(f('cebolla','Cebolla','Onion','vegetal','cebolla',40,1.1,9.3,0.1,1.7,4.2,4,[s('1 mediana',110),s('100g',100)],100,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo'],'panama_comun',gf(9,5,7,8),10,0,'despensa 30 dias',['puerro','ajo'],'Base aromatica universal.'));
FOODS.push(f('ajo','Ajo','Garlic','vegetal','cebolla',149,6.4,33.1,0.5,2.1,1,17,[s('1 diente',3),s('100g',100)],5,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo'],'panama_comun',gf(10,6,7,9),10,0,'despensa 90 dias',['cebolla'],'Propiedades antibacteriales.'));
FOODS.push(f('puerro','Puerro','Leek','vegetal','cebolla',61,1.5,14.2,0.3,1.8,3.9,20,[s('1 tallo',89),s('100g',100)],100,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo'],'panama_importado',gf(9,5,7,8),15,10,'refrigerador 7 dias',['cebolla'],'Sabor suave.'));
FOODS.push(f('zanahoria','Zanahoria','Carrot','vegetal','raiz',41,0.9,9.6,0.2,2.8,4.7,69,[s('1 mediana',61),s('100g',100)],80,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo'],'panama_comun',gf(9,5,8,9),39,10,'refrigerador 21 dias',['camote'],'Alta en beta-caroteno.'));
FOODS.push(f('pepino','Pepino','Cucumber','vegetal','fresco',15,0.7,3.6,0.1,0.5,1.7,2,[s('1 mediano',300),s('100g',100)],100,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','bajo_carbo','bajo_grasa','paleo','keto'],'panama_comun',gf(10,4,6,9),15,0,'refrigerador 7 dias',['apio'],'Hidratante, 96% agua.'));
FOODS.push(f('calabacin','Calabacin/Zucchini','Zucchini','vegetal','fresco',17,1.2,3.1,0.3,1,2.5,8,[s('1 mediano',196),s('100g',100)],100,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','bajo_carbo','bajo_grasa','paleo','keto'],'panama_comun',gf(10,5,6,9),15,10,'refrigerador 7 dias',['chayote'],'Sustituto de pasta en dietas.'));
FOODS.push(f('chayote','Chayote','Chayote','vegetal','fresco',19,0.8,4.5,0.1,1.7,1.7,2,[s('1 mediano',200),s('100g',100)],150,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','bajo_carbo','bajo_grasa','paleo','keto'],'panama_comun',gf(10,5,7,9),15,15,'refrigerador 14 dias',['calabacin'],'Tipico en sancocho.'));
FOODS.push(f('nabo','Nabo','Turnip','vegetal','raiz',28,0.9,6.4,0.1,1.8,3.8,67,[s('1 mediano',122),s('100g',100)],100,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','bajo_carbo','bajo_grasa','paleo','keto'],'panama_comun',gf(10,5,7,9),30,15,'refrigerador 14 dias',['rabano'],'Raiz suave.'));
FOODS.push(f('remolacha','Remolacha','Beet','vegetal','raiz',43,1.6,9.6,0.2,2.8,6.8,78,[s('1 mediana',82),s('100g',100)],100,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo'],'panama_comun',gf(8,6,9,8),61,40,'refrigerador 21 dias',['zanahoria'],'Mejora rendimiento aerobico.'));
FOODS.push(f('rabano','Rabano','Radish','vegetal','raiz',16,0.7,3.4,0.1,1.6,1.9,39,[s('1 taza',116),s('100g',100)],50,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','bajo_carbo','bajo_grasa','paleo','keto'],'panama_comun',gf(10,4,6,9),15,0,'refrigerador 14 dias',['nabo'],'Crujiente y picante.'));
FOODS.push(f('hongos','Hongos/Champiñones','Mushrooms','vegetal','hongo',22,3.1,3.3,0.3,1,2,5,[s('1 taza',96),s('100g',100)],100,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','bajo_carbo','bajo_grasa','paleo','keto'],'panama_comun',gf(10,6,6,9),15,8,'refrigerador 5 dias',['berenjena'],'Umami natural.'));
FOODS.push(f('esparragos','Esparragos','Asparagus','vegetal','tallo',20,2.2,3.9,0.1,2.1,1.9,2,[s('1 taza',134),s('100g',100)],100,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','bajo_carbo','bajo_grasa','paleo','keto'],'panama_comun',gf(10,6,7,9),15,8,'refrigerador 5 dias',['brocoli'],'Diuretico natural.'));
FOODS.push(f('alcachofa','Alcachofa','Artichoke','vegetal','flor',47,3.3,10.5,0.2,5.4,0.99,94,[s('1 mediana',120),s('100g',100)],100,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','alto_fibra'],'panama_importado',gf(9,6,7,9),15,30,'refrigerador 7 dias',['esparragos'],'Alta en fibra y antioxidantes.'));
FOODS.push(f('aguacate','Aguacate','Avocado','grasa_saludable','fruto',160,2,8.5,14.7,6.7,0.7,7,[s('1/2 aguacate',100),s('100g',100)],100,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','keto','alto_fibra'],'panama_comun',gf(9,7,8,9),15,0,'refrigerador 7 dias',['aceite_oliva'],'Grasas monoinsaturadas de alta calidad.'));

// ========== FRUTAS ==========
FOODS.push(f('banana','Banana/Guineo','Banana','fruta','tropical',89,1.1,22.8,0.3,2.6,12.2,1,[s('1 mediana',118),s('100g',100)],120,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo'],'panama_comun',gf(6,8,10,8),51,0,'despensa 7 dias',['manzana'],'Pre/post entreno ideal.'));
FOODS.push(f('mango','Mango','Mango','fruta','tropical',60,0.8,15,0.4,1.6,13.7,1,[s('1 mediano',200),s('100g',100)],150,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo'],'panama_comun',gf(7,7,9,8),51,0,'despensa 5 dias',['papaya','piña'],'Muy dulce, alto en vitamina C.'));
FOODS.push(f('piña','Piña','Pineapple','fruta','tropical',50,0.5,13.1,0.1,1.4,9.9,1,[s('1 taza',165),s('100g',100)],150,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo'],'panama_comun',gf(8,6,9,9),59,0,'refrigerador 5 dias',['mango','papaya'],'Bromelina ayuda digestion.'));
FOODS.push(f('papaya','Papaya','Papaya','fruta','tropical',43,0.5,10.8,0.3,1.7,7.8,8,[s('1 taza',145),s('100g',100)],150,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo'],'panama_comun',gf(9,6,8,9),60,0,'refrigerador 5 dias',['mango'],'Enzima papaina, digestiva.'));
FOODS.push(f('sandia','Sandia','Watermelon','fruta','tropical',30,0.6,7.6,0.2,0.4,6.2,1,[s('1 taza',152),s('100g',100)],200,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo'],'panama_comun',gf(9,5,8,9),76,0,'refrigerador 7 dias',['melon'],'92% agua, hidratante.'));
FOODS.push(f('melon','Melon','Melon','fruta','tropical',34,0.8,8.2,0.2,0.9,7.9,16,[s('1 taza',177),s('100g',100)],200,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo'],'panama_comun',gf(9,5,8,9),65,0,'refrigerador 5 dias',['sandia'],'Refrescante, bajo en calorias.'));
FOODS.push(f('zapote','Zapote','Sapote','fruta','tropical',134,2.1,33.5,0.6,5.4,0,0,[s('1 unidad',200),s('100g',100)],150,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo'],'panama_comun',gf(5,6,8,7),45,0,'refrigerador 5 dias',['mango'],'Fruta tropical dulce panameña.'));
FOODS.push(f('guanabana','Guanabana/Marañon','Soursop','fruta','tropical',66,1,16.8,0.3,3.3,13.5,14,[s('1 taza',225),s('100g',100)],150,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo'],'panama_comun',gf(7,6,8,8),50,0,'refrigerador 5 dias',['guayaba'],'Fruta tropical en jugos.'));
FOODS.push(f('guayaba','Guayaba','Guava','fruta','tropical',68,2.6,14.3,1,5.4,8.9,2,[s('1 unidad',55),s('100g',100)],100,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','alto_fibra'],'panama_comun',gf(9,6,8,9),25,0,'refrigerador 5 dias',['guanabana'],'Muy alta en vitamina C.'));
FOODS.push(f('maracuya','Maracuya','Passion Fruit','fruta','tropical',97,2.2,23.4,0.7,10.4,11.2,28,[s('1 unidad',18),s('100g',100)],50,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','alto_fibra'],'panama_comun',gf(8,6,8,8),30,0,'refrigerador 7 dias',['guanabana'],'Aromatica, muy fibrosa.'));
FOODS.push(f('coco','Coco (pulpa)','Coconut (meat)','grasa_saludable','tropical',354,3.3,15.2,33.5,9,6.2,20,[s('1 porcion',45),s('100g',100)],30,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','keto','alto_fibra'],'panama_comun',gf(4,5,6,6),45,0,'refrigerador 7 dias',['aceite_coco'],'Grasas saturadas MCT.'));

// TEMPLADAS
FOODS.push(f('manzana','Manzana','Apple','fruta','templada',52,0.3,13.8,0.2,2.4,10.4,1,[s('1 mediana',182),s('100g',100)],180,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo'],'panama_comun',gf(9,5,8,9),36,0,'despensa 21 dias',['pera'],'Fibra soluble, saciante.'));
FOODS.push(f('pera','Pera','Pear','fruta','templada',57,0.4,15.2,0.1,3.1,9.8,1,[s('1 mediana',178),s('100g',100)],180,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo'],'panama_comun',gf(9,5,8,9),38,0,'despensa 14 dias',['manzana'],'Alta en fibra.'));
FOODS.push(f('naranja','Naranja','Orange','fruta','templada',47,0.9,11.8,0.1,2.4,9.4,0,[s('1 mediana',131),s('100g',100)],150,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo'],'panama_comun',gf(9,5,8,9),43,0,'despensa 14 dias',['mandarina'],'Vitamina C clasica.'));
FOODS.push(f('mandarina','Mandarina','Tangerine','fruta','templada',53,0.8,13.3,0.3,1.8,10.6,2,[s('1 mediana',88),s('100g',100)],100,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo'],'panama_comun',gf(9,5,8,9),41,0,'despensa 10 dias',['naranja'],'Facil de pelar.'));
FOODS.push(f('limon','Limon','Lemon','fruta','templada',29,1.1,9.3,0.3,2.8,2.5,2,[s('1 unidad',58),s('100g',100)],30,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','keto'],'panama_comun',gf(10,4,6,8),20,0,'despensa 14 dias',['naranja'],'Acido, para aderezos.'));
FOODS.push(f('uvas','Uvas','Grapes','fruta','templada',69,0.7,18.1,0.2,0.9,15.5,2,[s('1 taza',151),s('100g',100)],100,['sulfitos'],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo'],'panama_importado',gf(6,5,8,7),53,0,'refrigerador 7 dias',['arandanos'],'Resveratrol antioxidante.'));
FOODS.push(f('fresa','Fresa','Strawberry','fruta','baya',32,0.7,7.7,0.3,2,4.9,1,[s('1 taza',144),s('100g',100)],100,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','bajo_carbo'],'panama_comun',gf(10,6,8,9),40,0,'refrigerador 3 dias',['arandanos','frambuesas'],'Baja en calorias, alto en vit C.'));
FOODS.push(f('arandanos','Arandanos','Blueberries','fruta','baya',57,0.7,14.5,0.3,2.4,9.7,1,[s('1 taza',148),s('100g',100)],100,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo'],'panama_importado',gf(10,6,8,9),53,0,'refrigerador 7 dias',['frambuesas','fresa'],'Altisimo en antioxidantes.'));
FOODS.push(f('frambuesas','Frambuesas','Raspberries','fruta','baya',52,1.2,11.9,0.7,6.5,4.4,1,[s('1 taza',123),s('100g',100)],100,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','alto_fibra','bajo_carbo'],'panama_importado',gf(10,6,8,9),32,0,'refrigerador 3 dias',['fresa','arandanos'],'Muy alta en fibra.'));
FOODS.push(f('kiwi','Kiwi','Kiwi','fruta','templada',61,1.1,14.7,0.5,3,9,3,[s('1 unidad',69),s('100g',100)],100,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo'],'panama_comun',gf(9,6,8,9),53,0,'refrigerador 7 dias',['naranja'],'Mas vitamina C que naranja.'));
FOODS.push(f('durazno','Durazno','Peach','fruta','templada',39,0.9,9.5,0.3,1.5,8.4,0,[s('1 mediano',150),s('100g',100)],150,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo'],'panama_importado',gf(9,5,8,9),42,0,'refrigerador 5 dias',['ciruela','manzana'],'Dulce y jugoso.'));
FOODS.push(f('ciruela','Ciruela','Plum','fruta','templada',46,0.7,11.4,0.3,1.4,9.9,0,[s('1 unidad',66),s('100g',100)],100,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo'],'panama_importado',gf(9,5,8,9),40,0,'refrigerador 7 dias',['durazno'],'Digestiva.'));
FOODS.push(f('cerezas','Cerezas','Cherries','fruta','baya',63,1.1,16,0.2,2.1,12.8,0,[s('1 taza',154),s('100g',100)],100,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo'],'panama_importado',gf(8,5,8,8),22,0,'refrigerador 4 dias',['arandanos'],'Antiinflamatorias.'));
FOODS.push(f('pasas','Pasas','Raisins','fruta','seca',299,3.1,79.2,0.5,3.7,59.2,11,[s('1 puñado',40),s('100g',100)],30,['sulfitos'],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo'],'panama_comun',gf(5,6,9,7),64,0,'despensa 180 dias',['datiles'],'Energia concentrada.'));
FOODS.push(f('datiles','Datiles','Dates','fruta','seca',282,2.5,75,0.4,8,63.4,2,[s('1 unidad',24),s('100g',100)],30,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','alto_fibra'],'panama_comun',gf(5,6,9,7),55,0,'despensa 180 dias',['pasas'],'Endulzante natural en reposteria.'));
FOODS.push(f('arandanos_secos','Arandanos Secos','Dried Cranberries','fruta','seca',308,0.1,82.8,1.4,5.7,65,5,[s('1 puñado',40),s('100g',100)],30,['sulfitos'],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano'],'panama_importado',gf(4,5,8,6),62,0,'despensa 180 dias',['pasas'],'Usualmente con azucar agregada.'));

// ========== GRASAS SALUDABLES ==========
FOODS.push(f('almendras','Almendras','Almonds','grasa_saludable','fruto_seco',579,21,22,50,12.5,4.4,1,[s('1 puñado',28),s('100g',100)],30,['frutos_secos'],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','keto','alto_fibra'],'panama_comun',gf(7,8,8,9),0,0,'despensa 365 dias',['nueces','marañones'],'Alta en vitamina E.'));
FOODS.push(f('nueces','Nueces','Walnuts','grasa_saludable','fruto_seco',654,15.2,13.7,65.2,6.7,2.6,2,[s('1 puñado',28),s('100g',100)],30,['frutos_secos'],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','keto'],'panama_comun',gf(7,8,8,9),0,0,'despensa 365 dias',['almendras','pecanas'],'Omega-3 vegetal.'));
FOODS.push(f('marañones','Marañones/Cashews','Cashews','grasa_saludable','fruto_seco',553,18.2,30.2,43.8,3.3,5.9,12,[s('1 puñado',28),s('100g',100)],30,['frutos_secos'],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','keto'],'panama_comun',gf(6,8,8,8),22,0,'despensa 365 dias',['almendras','pistachos'],'Cremosos, cultivo panameño.'));
FOODS.push(f('pistachos','Pistachos','Pistachios','grasa_saludable','fruto_seco',560,20.2,27.2,45.3,10.6,7.7,1,[s('1 puñado',28),s('100g',100)],30,['frutos_secos'],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','keto','alto_fibra'],'panama_importado',gf(7,8,8,9),15,0,'despensa 365 dias',['almendras'],'Proteina vegetal, saciante.'));
FOODS.push(f('macadamias','Macadamias','Macadamia Nuts','grasa_saludable','fruto_seco',718,7.9,13.8,75.8,8.6,4.6,5,[s('1 puñado',28),s('100g',100)],30,['frutos_secos'],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','keto'],'panama_importado',gf(5,7,7,7),10,0,'despensa 180 dias',['nueces'],'Muy alta en grasas monoinsaturadas.'));
FOODS.push(f('pecanas','Pecanas','Pecans','grasa_saludable','fruto_seco',691,9.2,13.9,72,9.6,4,0,[s('1 puñado',28),s('100g',100)],30,['frutos_secos'],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','keto','alto_fibra'],'panama_importado',gf(5,7,7,7),10,0,'despensa 180 dias',['nueces'],'Sabor dulce natural.'));
FOODS.push(f('chia','Semillas de Chia','Chia Seeds','grasa_saludable','semilla',486,16.5,42.1,30.7,34.4,0,16,[s('1 cda',12),s('100g',100)],15,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','keto','alto_fibra','alto_proteina'],'panama_comun',gf(10,8,9,10),30,0,'despensa 365 dias',['linaza'],'Omega-3 y fibra soluble.'));
FOODS.push(f('linaza','Linaza/Lino','Flaxseed','grasa_saludable','semilla',534,18.3,28.9,42.2,27.3,1.6,30,[s('1 cda',7),s('100g',100)],15,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','keto','alto_fibra','alto_proteina'],'panama_comun',gf(10,8,9,10),35,0,'despensa 365 dias',['chia'],'Lignanos, rica en omega-3.'));
FOODS.push(f('girasol_semilla','Semillas de Girasol','Sunflower Seeds','grasa_saludable','semilla',584,20.8,20,51.5,8.6,2.6,9,[s('1 puñado',28),s('100g',100)],30,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','keto','alto_fibra','alto_proteina'],'panama_comun',gf(7,8,7,8),35,0,'despensa 180 dias',['chia','calabaza_semilla'],'Vitamina E.'));
FOODS.push(f('calabaza_semilla','Semillas de Calabaza','Pumpkin Seeds','grasa_saludable','semilla',559,30.2,10.7,49,6,1.4,7,[s('1 puñado',28),s('100g',100)],30,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','keto','alto_proteina'],'panama_comun',gf(8,9,8,9),25,0,'despensa 180 dias',['girasol_semilla'],'Alta en zinc y magnesio.'));
FOODS.push(f('sesamo','Sesamo/Ajonjoli','Sesame Seeds','grasa_saludable','semilla',573,17.7,23.5,49.7,11.8,0.3,11,[s('1 cda',9),s('100g',100)],15,['sesamo'],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','keto','alto_fibra'],'panama_comun',gf(7,7,7,8),35,0,'despensa 365 dias',['chia'],'Calcio vegetal.'));
FOODS.push(f('aceite_oliva','Aceite de Oliva Extra Virgen','Extra Virgin Olive Oil','grasa_saludable','aceite',884,0,0,100,0,0,2,[s('1 cda',14),s('100g',100)],15,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','keto'],'panama_comun',gf(7,8,8,9),0,0,'despensa 24 meses',['aceite_aguacate'],'Base dieta mediterranea.'));
FOODS.push(f('aceite_coco','Aceite de Coco','Coconut Oil','grasa_saludable','aceite',892,0,0,100,0,0,0,[s('1 cda',14),s('100g',100)],15,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','keto'],'panama_comun',gf(5,7,6,7),0,0,'despensa 24 meses',['aceite_oliva'],'MCT, punto de humo alto.'));
FOODS.push(f('aceite_aguacate','Aceite de Aguacate','Avocado Oil','grasa_saludable','aceite',884,0,0,100,0,0,0,[s('1 cda',14),s('100g',100)],15,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','keto'],'panama_importado',gf(7,8,8,9),0,0,'despensa 12 meses',['aceite_oliva'],'Alto punto de humo.'));
FOODS.push(f('aceite_canola','Aceite de Canola','Canola Oil','grasa_saludable','aceite',884,0,0,100,0,0,0,[s('1 cda',14),s('100g',100)],15,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano'],'panama_comun',gf(5,6,6,6),0,0,'despensa 24 meses',['aceite_oliva'],'Neutral, para cocinar.'));
FOODS.push(f('mani_crema','Crema de Mani Natural','Natural Peanut Butter','grasa_saludable','crema',588,25.1,19.6,50,6,9.2,17,[s('1 cda',16),s('100g',100)],30,['cacahuate'],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','alto_proteina'],'panama_comun',gf(6,9,8,8),14,0,'despensa 180 dias',['almendras_crema'],'Sin azucar agregada idealmente.'));
FOODS.push(f('almendras_crema','Crema de Almendras','Almond Butter','grasa_saludable','crema',614,20.9,18.8,55.5,10.3,4.4,7,[s('1 cda',16),s('100g',100)],30,['frutos_secos'],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','alto_proteina'],'panama_comun',gf(7,9,8,8),0,0,'despensa 180 dias',['mani_crema'],'Alternativa al mani.'));
FOODS.push(f('tahini','Tahini','Tahini','grasa_saludable','crema',595,17,21.2,53.8,9.3,0.5,115,[s('1 cda',15),s('100g',100)],30,['sesamo'],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','keto'],'panama_comun',gf(6,8,7,8),0,0,'despensa 180 dias',['almendras_crema'],'Base de hummus.'));

// ========== BEBIDAS ==========
FOODS.push(f('agua','Agua','Water','bebida','agua',0,0,0,0,0,0,0,[s('1 vaso',240),s('100ml',100)],500,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','keto'],'panama_comun',gf(10,10,10,10),0,0,'indefinido',[],'Esencial, meta 2.5-4L/dia.'));
FOODS.push(f('agua_gas','Agua con Gas','Sparkling Water','bebida','agua',0,0,0,0,0,0,2,[s('1 vaso',240),s('100ml',100)],240,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','keto'],'panama_comun',gf(10,10,9,10),0,0,'despensa 12 meses',['agua'],'Sin calorias, saciante.'));
FOODS.push(f('cafe','Cafe Negro','Black Coffee','bebida','cafe',1,0.1,0,0,0,0,4,[s('1 taza',240),s('100ml',100)],240,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','keto'],'panama_comun',gf(10,8,9,10),0,5,'fresco mismo dia',['te_verde'],'Cafeina mejora rendimiento.'));
FOODS.push(f('cafe_leche','Cafe con Leche','Latte','bebida','cafe',56,3,5.4,2.4,0,5.4,48,[s('1 taza',240),s('100ml',100)],240,['lacteos'],['halal','kosher','sin_gluten','vegetariano'],'panama_comun',gf(7,7,8,8),30,5,'fresco mismo dia',['cafe'],'Clasico panameño.'));
FOODS.push(f('te_verde','Te Verde','Green Tea','bebida','te',1,0.2,0,0,0,0,1,[s('1 taza',240),s('100ml',100)],240,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','keto'],'panama_comun',gf(10,8,9,10),0,3,'fresco mismo dia',['te_negro','matcha'],'Catequinas antioxidantes.'));
FOODS.push(f('te_negro','Te Negro','Black Tea','bebida','te',1,0,0.3,0,0,0,3,[s('1 taza',240),s('100ml',100)],240,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','keto'],'panama_comun',gf(10,7,8,9),0,3,'fresco mismo dia',['te_verde'],'Mas cafeina que el verde.'));
FOODS.push(f('matcha','Te Matcha','Matcha Tea','bebida','te',3,0.3,0.5,0,0.2,0,3,[s('1 taza',240),s('100ml',100)],240,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','keto'],'panama_importado',gf(10,8,9,10),0,3,'fresco mismo dia',['te_verde'],'Concentrado de te verde.'));
FOODS.push(f('jugo_naranja','Jugo de Naranja Natural','Fresh Orange Juice','bebida','jugo',45,0.7,10.4,0.2,0.2,8.4,1,[s('1 vaso',240),s('100ml',100)],240,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo'],'panama_comun',gf(5,6,8,7),50,0,'refrigerador 2 dias',['naranja'],'Prefiere comer la fruta entera.'));
FOODS.push(f('jugo_verde','Jugo Verde','Green Juice','bebida','jugo',35,1.5,7,0.3,0.8,4,25,[s('1 vaso',240),s('100ml',100)],240,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo'],'panama_comun',gf(9,6,7,9),35,10,'refrigerador 1 dia',['jugo_naranja'],'Mezcla de verdes + fruta.'));
FOODS.push(f('soda_dieta','Soda Dietetica','Diet Soda','bebida','refresco',0,0,0,0,0,0,40,[s('1 lata',355),s('100ml',100)],355,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano'],'panama_comun',gf(5,3,4,5),0,0,'despensa 9 meses',['agua_gas'],'Endulzantes artificiales.'));
FOODS.push(f('bebida_deportiva','Bebida Deportiva','Sports Drink','bebida','deporte',26,0,6.5,0,0,6,181,[s('1 botella',600),s('100ml',100)],500,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano'],'panama_comun',gf(3,5,9,5),78,0,'despensa 12 meses',['agua'],'Util solo para entrenamientos >60min.'));
FOODS.push(f('batido_proteina','Batido de Proteina','Protein Shake','bebida','suplemento',110,20,5,1,0.5,3,100,[s('1 vaso',250),s('1 scoop',30)],250,['lacteos'],['sin_gluten','alto_proteina','vegetariano'],'panama_comun',gf(9,10,7,8),0,2,'consumir inmediato',['whey_protein'],'Post-entreno rapido.'));
FOODS.push(f('agua_coco','Agua de Coco','Coconut Water','bebida','jugo',19,0.7,3.7,0.2,1.1,2.6,105,[s('1 vaso',240),s('100ml',100)],240,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo'],'panama_comun',gf(8,6,9,9),55,0,'refrigerador 3 dias',['bebida_deportiva'],'Electrolitos naturales.'));

// ========== SNACKS/PROCESADOS ==========
FOODS.push(f('protein_bar','Barra de Proteina','Protein Bar','snack','barra',355,30,35,10,5,10,250,[s('1 barra',60),s('100g',100)],60,['lacteos','frutos_secos','soya'],['alto_proteina'],'panama_comun',gf(7,8,7,8),40,0,'despensa 9 meses',['batido_proteina'],'Practico post-gym.'));
FOODS.push(f('granola','Granola','Granola','snack','cereal',471,10,64,20,7,24,30,[s('1/2 taza',60),s('100g',100)],45,['gluten','frutos_secos'],['sin_lactosa','vegetariano','vegano','alto_fibra'],'panama_comun',gf(5,6,8,7),55,0,'despensa 180 dias',['avena'],'Porciones pequeñas, alta calorias.'));
FOODS.push(f('barrita_cereal','Barrita de Cereal','Cereal Bar','snack','barra',390,6,71,8,3,30,150,[s('1 barra',25),s('100g',100)],25,['gluten'],['vegetariano'],'panama_comun',gf(4,5,7,5),60,0,'despensa 6 meses',['granola'],'Similar a galleta.'));
FOODS.push(f('chips_papa','Papitas Fritas','Potato Chips','snack','frito',536,7,53,34,4.4,0.3,525,[s('1 bolsa',28),s('100g',100)],30,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano'],'panama_comun',gf(1,3,4,3),56,0,'despensa 90 dias',['palomitas'],'Ultra procesado.'));
FOODS.push(f('chips_platano','Chips de Platano','Plantain Chips','snack','frito',519,2.3,58.4,29,3.6,2.8,201,[s('1 porcion',30),s('100g',100)],30,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano'],'panama_comun',gf(2,4,5,4),55,0,'despensa 90 dias',['chips_papa'],'Tipico panameño.'));
FOODS.push(f('chocolate_70','Chocolate 70%','Dark Chocolate 70%','snack','chocolate',598,7.8,45.9,42.6,10.9,24,20,[s('1 onza',28),s('100g',100)],30,['lacteos'],['halal','kosher','sin_gluten','vegetariano'],'panama_comun',gf(5,5,6,6),23,0,'despensa 365 dias',['chocolate_leche'],'Antioxidantes, porciones moderadas.'));
FOODS.push(f('chocolate_leche','Chocolate con Leche','Milk Chocolate','snack','chocolate',535,7.7,59.4,29.7,3.4,51.5,79,[s('1 onza',28),s('100g',100)],30,['lacteos'],['halal','kosher','sin_gluten','vegetariano'],'panama_comun',gf(2,4,5,4),43,0,'despensa 365 dias',['chocolate_70'],'Alto en azucar.'));
FOODS.push(f('galletas_avena','Galletas de Avena','Oat Cookies','snack','galleta',436,7,67,16,4,25,320,[s('1 galleta',15),s('100g',100)],30,['gluten','huevo','lacteos'],['vegetariano'],'panama_comun',gf(4,5,7,5),55,0,'despensa 30 dias',['granola'],'Mejor opcion en galletas.'));
FOODS.push(f('hummus','Hummus','Hummus','snack','dip',166,7.9,14.3,9.6,6,0.3,379,[s('1/4 taza',60),s('100g',100)],60,['sesamo'],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','alto_fibra'],'panama_comun',gf(8,7,7,9),6,0,'refrigerador 7 dias',['guacamole'],'Garbanzos + tahini.'));
FOODS.push(f('guacamole','Guacamole','Guacamole','snack','dip',149,2,8.5,13,5.4,0.9,327,[s('1/4 taza',60),s('100g',100)],60,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','keto'],'panama_comun',gf(8,6,7,8),15,0,'refrigerador 2 dias',['hummus'],'Base aguacate + lima.'));

// ========== SUPLEMENTOS ==========
FOODS.push(f('whey_protein','Whey Protein','Whey Protein','suplemento','proteina',370,78,8,5,1,3,330,[s('1 scoop',30),s('100g',100)],30,['lacteos'],['sin_gluten','alto_proteina','vegetariano'],'panama_comun',gf(10,10,7,9),0,1,'despensa 24 meses',['caseina','batido_proteina'],'Post-entreno rapida absorcion.'));
FOODS.push(f('caseina','Caseina','Casein Protein','suplemento','proteina',360,80,3,2,0.5,1,400,[s('1 scoop',30),s('100g',100)],30,['lacteos'],['sin_gluten','alto_proteina','vegetariano'],'panama_importado',gf(9,10,6,9),0,1,'despensa 24 meses',['whey_protein'],'Liberacion lenta, ideal noche.'));
FOODS.push(f('creatina','Creatina Monohidrato','Creatine Monohydrate','suplemento','performance',0,0,0,0,0,0,0,[s('1 scoop',5),s('100g',100)],5,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano'],'panama_comun',gf(7,10,7,7),0,0,'despensa 36 meses',[],'3-5g/dia, mejora fuerza.'));
FOODS.push(f('bcaa','BCAA','BCAA','suplemento','aminoacido',0,0,0,0,0,0,0,[s('1 scoop',10),s('100g',100)],10,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano'],'panama_comun',gf(7,8,7,7),0,0,'despensa 24 meses',['whey_protein'],'Opcional si proteina suficiente.'));
FOODS.push(f('multivitaminico','Multivitaminico','Multivitamin','suplemento','vitamina',0,0,0,0,0,0,0,[s('1 tableta',1)],1,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano'],'panama_comun',gf(7,7,7,8),0,0,'despensa 24 meses',[],'Seguro como respaldo.'));
FOODS.push(f('omega3','Omega-3','Omega-3','suplemento','grasa',900,0,0,100,0,0,0,[s('1 capsula',1)],1,['pescado'],['halal','kosher','sin_gluten','sin_lactosa'],'panama_comun',gf(9,9,9,10),0,0,'despensa 24 meses',['salmon','chia'],'1-3g EPA+DHA diarios.'));
FOODS.push(f('vitamina_d','Vitamina D3','Vitamin D3','suplemento','vitamina',0,0,0,0,0,0,0,[s('1 capsula',1)],1,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano'],'panama_comun',gf(8,8,8,9),0,0,'despensa 24 meses',[],'1000-4000 UI/dia segun deficit.'));
FOODS.push(f('magnesio','Magnesio','Magnesium','suplemento','mineral',0,0,0,0,0,0,0,[s('1 capsula',1)],1,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano'],'panama_comun',gf(8,8,8,9),0,0,'despensa 24 meses',[],'300-400mg/dia, mejora sueño.'));
FOODS.push(f('glutamina','Glutamina','Glutamine','suplemento','aminoacido',0,0,0,0,0,0,0,[s('1 scoop',5),s('100g',100)],5,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano'],'panama_comun',gf(6,7,7,7),0,0,'despensa 24 meses',[],'Recuperacion, 5-10g/dia.'));

// ========== CONDIMENTOS ==========
FOODS.push(f('sal','Sal','Salt','condimento','basico',0,0,0,0,0,0,38758,[s('1 pizca',0.5),s('1 cdita',6)],1,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','keto'],'panama_comun',gf(5,5,5,5),0,0,'indefinido',[],'Moderar consumo.'));
FOODS.push(f('pimienta','Pimienta Negra','Black Pepper','condimento','especia',251,10.4,63.9,3.3,25.3,0.6,20,[s('1 pizca',0.5),s('1 cdita',2.5)],1,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','keto'],'panama_comun',gf(10,10,10,10),0,0,'despensa 24 meses',[],'Piperina, mejora absorcion curcuma.'));
FOODS.push(f('canela','Canela','Cinnamon','condimento','especia',247,4,80.6,1.2,53.1,2.2,10,[s('1 cdita',2.6)],2,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','keto'],'panama_comun',gf(10,8,8,10),5,0,'despensa 24 meses',[],'Estabiliza azucar en sangre.'));
FOODS.push(f('jengibre','Jengibre','Ginger','condimento','especia',80,1.8,17.8,0.8,2,1.7,13,[s('1 cda',15),s('100g',100)],10,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo'],'panama_comun',gf(10,7,8,9),15,0,'refrigerador 30 dias',[],'Antiinflamatorio.'));
FOODS.push(f('curcuma','Curcuma','Turmeric','condimento','especia',354,7.8,64.9,9.9,21.1,3.2,38,[s('1 cdita',3)],3,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','keto'],'panama_comun',gf(10,8,8,10),0,0,'despensa 24 meses',[],'Curcumina antiinflamatoria.'));
FOODS.push(f('ajo_polvo','Ajo en Polvo','Garlic Powder','condimento','especia',331,16.5,72.7,0.7,9,2.3,60,[s('1 cdita',3)],3,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','keto'],'panama_comun',gf(10,7,7,9),0,0,'despensa 24 meses',['ajo'],'Concentrado, usar menos.'));
FOODS.push(f('paprika','Paprika','Paprika','condimento','especia',282,14.1,53.9,12.9,34.9,10.3,68,[s('1 cdita',2.3)],3,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','keto'],'panama_comun',gf(10,8,8,9),0,0,'despensa 24 meses',[],'Color y sabor ahumado.'));
FOODS.push(f('oregano','Oregano','Oregano','condimento','hierba',265,9,68.9,4.3,42.5,4.1,25,[s('1 cdita',1)],1,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','keto'],'panama_comun',gf(10,8,8,9),0,0,'despensa 24 meses',[],'Antibacterial natural.'));
FOODS.push(f('salsa_soya','Salsa de Soya','Soy Sauce','condimento','salsa',53,8.1,4.9,0.6,0.8,0.4,5493,[s('1 cda',16),s('100ml',100)],15,['soya','gluten'],['sin_lactosa','vegetariano','vegano'],'panama_comun',gf(6,6,6,6),0,0,'despensa 24 meses',[],'Muy alta en sodio.'));
FOODS.push(f('salsa_picante','Salsa Picante','Hot Sauce','condimento','salsa',11,0.9,1.8,0.3,0.6,0.9,2643,[s('1 cdita',5)],5,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','keto'],'panama_comun',gf(10,7,7,9),0,0,'despensa 24 meses',[],'Capsaicina termogenica.'));
FOODS.push(f('mostaza','Mostaza','Mustard','condimento','salsa',66,4,5.3,4,3.3,0.9,1135,[s('1 cda',15)],10,['mostaza','sulfitos'],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','keto'],'panama_comun',gf(9,6,7,8),0,0,'refrigerador 365 dias',[],'Baja en calorias.'));
FOODS.push(f('ketchup','Ketchup','Ketchup','condimento','salsa',112,1.7,26.9,0.3,0.3,22.8,908,[s('1 cda',17)],15,[],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano'],'panama_comun',gf(3,4,6,4),55,0,'refrigerador 180 dias',[],'Alto en azucar.'));
FOODS.push(f('mayonesa','Mayonesa','Mayonnaise','condimento','salsa',680,1,0.6,75,0,0.6,635,[s('1 cda',14)],15,['huevo'],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','keto'],'panama_comun',gf(2,4,4,4),0,0,'refrigerador 90 dias',[],'Alta en grasa, usar con medida.'));
FOODS.push(f('vinagre','Vinagre Balsamico','Balsamic Vinegar','condimento','acido',88,0.5,17,0,0,15,23,[s('1 cda',16),s('100ml',100)],15,['sulfitos'],['halal','kosher','sin_gluten','sin_lactosa','vegetariano','vegano','paleo','keto'],'panama_comun',gf(9,5,6,8),0,0,'despensa 24 meses',[],'Para ensaladas.'));

// Serialize
function serializeValue(v) {
  if (v === null) return 'null';
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (typeof v === 'string') return JSON.stringify(v);
  if (Array.isArray(v)) return '[' + v.map(serializeValue).join(',') + ']';
  if (typeof v === 'object') {
    const parts = [];
    for (const k of Object.keys(v)) parts.push(k + ':' + serializeValue(v[k]));
    return '{' + parts.join(',') + '}';
  }
  return 'null';
}

const lines = FOODS.map(food => '  ' + serializeValue(food) + ',');
const existing = fs.readFileSync(path.join(__dirname, 'nutritionDB.js'), 'utf8');
// Find the "const FOODS = [" marker and rebuild from there
const idx = existing.indexOf('const FOODS = [');
const header = existing.substring(0, idx);
const rest = header + 'const FOODS = [\n' + lines.join('\n') + '\n];\n\n';

const functions = `
// ========== HELPER FUNCTIONS ==========
function getFood(id) {
  return FOODS.find(f => f.id === id) || null;
}

function searchFood(query) {
  if (!query) return [];
  const q = String(query).toLowerCase().trim();
  return FOODS.filter(f =>
    f.name.toLowerCase().includes(q) ||
    f.nameEn.toLowerCase().includes(q) ||
    f.id.includes(q.replace(/\\s+/g, '_'))
  );
}

function filterByAllergens(excludeAllergens) {
  if (!excludeAllergens || !excludeAllergens.length) return FOODS.slice();
  return FOODS.filter(f => !f.allergens.some(a => excludeAllergens.includes(a)));
}

function filterByDietary(tags) {
  if (!tags || !tags.length) return FOODS.slice();
  return FOODS.filter(f => tags.every(t => f.dietaryTags.includes(t)));
}

function calcMacros(foodId, grams) {
  const food = getFood(foodId);
  if (!food) return null;
  const factor = grams / 100;
  return {
    foodId: food.id,
    name: food.name,
    grams: grams,
    cal: Math.round(food.cal * factor),
    protein: +(food.protein * factor).toFixed(1),
    carbs: +(food.carbs * factor).toFixed(1),
    fat: +(food.fat * factor).toFixed(1),
    fiber: +(food.fiber * factor).toFixed(1),
    sugar: +(food.sugar * factor).toFixed(1),
    sodium: Math.round(food.sodium * factor)
  };
}

function recommendFoods(goal, excludeAllergens, count) {
  count = count || 20;
  goal = goal || 'maintenance';
  let pool = filterByAllergens(excludeAllergens || []);
  pool = pool.filter(f => f.goalFit && typeof f.goalFit[goal] === 'number');
  pool.sort((a, b) => b.goalFit[goal] - a.goalFit[goal]);
  return pool.slice(0, count);
}

function buildMenuFromIngredients(availableFoodIds, mealsPerDay, days, goal, allergens) {
  mealsPerDay = mealsPerDay || 5;
  days = days || 1;
  goal = goal || 'maintenance';
  allergens = allergens || [];
  const avail = (availableFoodIds || [])
    .map(getFood)
    .filter(f => f && !f.allergens.some(a => allergens.includes(a)));
  if (!avail.length) return { days: [], warning: 'Sin ingredientes disponibles.' };

  const proteins = avail.filter(f => f.category === 'proteina_animal' || f.category === 'proteina_vegetal');
  const carbs = avail.filter(f => f.category === 'carbo_complejo' || f.category === 'carbo_simple');
  const vegs = avail.filter(f => f.category === 'vegetal');
  const fruits = avail.filter(f => f.category === 'fruta');
  const fats = avail.filter(f => f.category === 'grasa_saludable');
  const dairy = avail.filter(f => f.category === 'lacteo');

  function pick(arr, i) { return arr.length ? arr[i % arr.length] : null; }
  function score(f) { return (f.goalFit && f.goalFit[goal]) || 5; }
  [proteins, carbs, vegs, fruits, fats, dairy].forEach(arr => arr.sort((a, b) => score(b) - score(a)));

  const mealTemplates = [
    ['desayuno', [dairy, fruits, carbs]],
    ['media_mañana', [fruits, fats]],
    ['almuerzo', [proteins, carbs, vegs]],
    ['merienda', [dairy, fruits]],
    ['cena', [proteins, vegs, fats]],
    ['post_cena', [dairy]]
  ];

  const outDays = [];
  for (let d = 0; d < days; d++) {
    const dayMeals = [];
    for (let m = 0; m < Math.min(mealsPerDay, mealTemplates.length); m++) {
      const [label, groups] = mealTemplates[m];
      const foods = groups.map((g, gi) => pick(g, d + m + gi)).filter(Boolean);
      const items = foods.map(f => ({
        foodId: f.id,
        name: f.name,
        grams: f.defaultServing,
        macros: calcMacros(f.id, f.defaultServing)
      }));
      const totals = items.reduce((acc, it) => ({
        cal: acc.cal + it.macros.cal,
        protein: +(acc.protein + it.macros.protein).toFixed(1),
        carbs: +(acc.carbs + it.macros.carbs).toFixed(1),
        fat: +(acc.fat + it.macros.fat).toFixed(1)
      }), { cal: 0, protein: 0, carbs: 0, fat: 0 });
      dayMeals.push({ label, items, totals });
    }
    outDays.push({ day: d + 1, meals: dayMeals });
  }
  return { days: outDays };
}

function getAlternative(foodId, userAllergens) {
  const food = getFood(foodId);
  if (!food) return null;
  userAllergens = userAllergens || [];
  const hasConflict = food.allergens.some(a => userAllergens.includes(a));
  if (!hasConflict) return food;
  const candidates = (food.alternatives || [])
    .map(getFood)
    .filter(f => f && !f.allergens.some(a => userAllergens.includes(a)));
  if (candidates.length) return candidates[0];
  const pool = FOODS.filter(f =>
    f.id !== food.id &&
    f.category === food.category &&
    f.subcategory === food.subcategory &&
    !f.allergens.some(a => userAllergens.includes(a))
  );
  return pool[0] || null;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    FOODS, ALLERGEN_INFO, DIETARY_TAGS,
    getFood, searchFood, filterByAllergens, filterByDietary,
    calcMacros, recommendFoods, buildMenuFromIngredients, getAlternative
  };
}
if (typeof window !== 'undefined') {
  window.NutritionDB = {
    FOODS, ALLERGEN_INFO, DIETARY_TAGS,
    getFood, searchFood, filterByAllergens, filterByDietary,
    calcMacros, recommendFoods, buildMenuFromIngredients, getAlternative
  };
}
`;

fs.writeFileSync(path.join(__dirname, 'nutritionDB.js'), rest + functions);
console.log('Wrote nutritionDB.js with ' + FOODS.length + ' foods');

// Stats
const byCat = {};
const byAll = {};
for (const f of FOODS) {
  byCat[f.category] = (byCat[f.category] || 0) + 1;
  for (const a of f.allergens) byAll[a] = (byAll[a] || 0) + 1;
}
console.log('By category:', byCat);
console.log('By allergen:', byAll);
