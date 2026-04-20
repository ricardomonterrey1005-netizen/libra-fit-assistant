// ================================================================
//  LIBRA FIT - RECOMMENDER ENGINE (v2.0)
// ================================================================
//  Motor de recomendaciones basado en:
//   - Perfil del usuario (meta, lugar, experiencia, equipment)
//   - exerciseDB.js (134+ ejercicios con goalFit scoring)
//   - nutritionDB.js (alimentos con goalFit + allergens)
//   - supplementsDB.js (stacks por meta)
//   - research/TRAINING_SCIENCE.md (parametros por meta)
//   - research/NUTRITION_SCIENCE.md (macros por meta)
//
//  Output:
//   - Rutina semanal sugerida
//   - Menu sugerido
//   - Stack de suplementos recomendado
//   - Warnings de micronutrientes
// ================================================================

const Recommender = {

  // ===== RUTINAS =====
  // Genera rutina semanal segun perfil
  recommendRoutines() {
    const profile = getProfile();
    const goals = getGoals();
    if(!profile.trainingLocation || !goals.goalType) return null;

    const goal = goals.goalType;
    const loc = profile.trainingLocation;
    const level = profile.experience || 'intermedio';

    // Cuantos dias entrenamos segun schedule actual
    const sched = UserRoutines.getWeekSchedule();
    const trainDays = Object.values(sched).filter(v => v).length;

    // Decidir split segun dias
    let splitType;
    if(trainDays <= 2) splitType = 'full_body';
    else if(trainDays === 3) splitType = 'full_body'; // o push/pull/legs
    else if(trainDays === 4) splitType = 'upper_lower';
    else if(trainDays === 5) splitType = 'ppl_plus';
    else splitType = 'ppl_twice';

    // Buscar templates que encajen
    let templates = UserRoutines.TEMPLATES || [];
    templates = templates.filter(t => {
      if(t.goal && !t.goal.includes(goal)) return false;
      if(t.level && !t.level.includes(level)) return false;
      if(t.location && !t.location.includes(loc)) return false;
      return true;
    });

    if(!templates.length){
      // Fallback: full body peso corporal
      templates = (UserRoutines.TEMPLATES || []).filter(t => t.id === 'tpl_bodyweight' || t.id === 'tpl_full_body');
    }

    // Generar rutinas segun split
    const suggestions = {
      split: splitType,
      routines: templates.slice(0, Math.ceil(trainDays / 2)),
      weeklySchedule: this._generateSchedule(splitType, sched, templates),
      rationale: this._getRoutineRationale(goal, trainDays, loc)
    };

    return suggestions;
  },

  _generateSchedule(split, currentSched, templates) {
    // Mantener los dias marcados por el usuario, asignar rutinas
    const days = Object.keys(currentSched).map(Number).filter(d => currentSched[d]);
    const schedule = { 0:null, 1:null, 2:null, 3:null, 4:null, 5:null, 6:null };

    if(split === 'full_body' && templates[0]){
      days.forEach(d => { schedule[d] = templates[0].id; });
    } else if(split === 'upper_lower' && templates.length >= 2){
      days.forEach((d, i) => { schedule[d] = templates[i % 2].id; });
    } else if(split.startsWith('ppl') && templates.length >= 3){
      days.forEach((d, i) => { schedule[d] = templates[i % 3].id; });
    }
    return schedule;
  },

  _getRoutineRationale(goal, days, loc) {
    const reasons = [];
    if(goal === 'fat_loss') reasons.push('Enfoque en fuerza + cardio para preservar musculo en deficit');
    if(goal === 'muscle_gain') reasons.push('Volumen moderado-alto con progresion');
    if(goal === 'strength') reasons.push('Bajas reps con peso alto, mayor descanso');
    if(goal === 'endurance') reasons.push('Fuerza basica + mucho cardio');

    if(days >= 5) reasons.push('Frecuencia alta: split tipo PPL optimo');
    else if(days >= 3) reasons.push('Frecuencia media: full body o upper/lower');
    else reasons.push('Frecuencia baja: full body obligatorio para estimular todo');

    if(loc === 'sin_equipo') reasons.push('Progresion con variantes mas dificiles (no peso)');
    if(loc === 'aire_libre') reasons.push('Combina bodyweight + cardio al aire libre');

    return reasons;
  },

  // ===== ALIMENTACION =====
  // Recomienda top alimentos para tu meta, filtrados por alergenos
  recommendFoods(count = 20) {
    const goals = getGoals();
    const allergens = S.g('allergens', []);
    if(!goals.goalType || !window.FoodDB) return [];
    return window.FoodDB.recommendFoods(goals.goalType, allergens, count);
  },

  // "Armame mi menu" - genera plan a partir de alimentos disponibles
  buildMenuFromIngredients(availableFoodIds, options = {}) {
    const mealCount = options.mealCount || 3;
    const days = options.days || 1;
    const goals = getGoals();
    const targets = typeof UserMeals !== 'undefined' ? UserMeals.calcTargets()
                  : { cal: 2000, protein: 100, carbs: 250, fat: 65 };

    if(!window.FoodDB) return null;

    // Clasificar ingredientes por categoria
    const byCategory = {};
    availableFoodIds.forEach(id => {
      const food = window.FoodDB.getFood(id);
      if(!food) return;
      const cat = food.category || 'otros';
      if(!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(food);
    });

    // Requerir minimos
    if(!byCategory.proteina_animal && !byCategory.lacteo){
      return { error: 'Necesitas al menos 1 alimento proteico (carne, pollo, huevo, etc.)' };
    }
    if(!byCategory.carbo && !byCategory.fruta){
      return { warning: 'Tu lista tiene poca variedad de carbohidratos' };
    }

    // Generar N comidas balanceadas
    const proteinPerMeal = Math.ceil(targets.protein / mealCount);
    const calPerMeal = Math.ceil(targets.cal / mealCount);

    const plan = [];
    for(let i=0; i<mealCount; i++){
      const meal = {
        label: this._mealLabel(i, mealCount),
        foods: []
      };
      // Proteina
      const protList = byCategory.proteina_animal || byCategory.lacteo || [];
      if(protList.length){
        const p = protList[i % protList.length];
        const grams = Math.min(200, Math.ceil((proteinPerMeal / p.protein) * 100));
        meal.foods.push({ foodKey: p.id, grams, name: p.name });
      }
      // Carbo
      const carbList = byCategory.carbo || byCategory.fruta || [];
      if(carbList.length){
        const c = carbList[i % carbList.length];
        meal.foods.push({ foodKey: c.id, grams: 150, name: c.name });
      }
      // Vegetal si hay
      if(byCategory.vegetal && byCategory.vegetal.length){
        const v = byCategory.vegetal[i % byCategory.vegetal.length];
        meal.foods.push({ foodKey: v.id, grams: 100, name: v.name });
      }
      // Calcular macros de la comida
      let cal = 0, protein = 0;
      meal.foods.forEach(f => {
        const m = window.FoodDB.calcMacros(f.foodKey, f.grams);
        if(m){ cal += m.cal; protein += m.protein; }
      });
      meal.macros = { cal, protein: Math.round(protein) };
      plan.push(meal);
    }

    return { plan, targets, days };
  },

  _mealLabel(i, total) {
    if(total === 2) return ['Desayuno', 'Cena'][i];
    if(total === 3) return ['Desayuno', 'Almuerzo', 'Cena'][i];
    if(total === 4) return ['Desayuno', 'Almuerzo', 'Merienda', 'Cena'][i];
    if(total === 5) return ['Desayuno', 'Merienda 1', 'Almuerzo', 'Merienda 2', 'Cena'][i];
    return `Comida ${i+1}`;
  },

  // ===== SUPLEMENTOS =====
  recommendSupplements() {
    const goals = getGoals();
    if(!goals.goalType || !window.SupplementsDB) return [];
    return window.SupplementsDB.recommendStack(goals.goalType);
  },

  // ===== MICRONUTRIENTES =====
  // Revisa el ultimo X dias de comidas y detecta posibles deficiencias
  checkMicronutrients(daysBack = 7) {
    // Stub simple - expandible con MICRONUTRIENTS.md research
    const warnings = [];
    const goals = getGoals();
    const allergens = S.g('allergens', []);

    // Dietas sin lacteos
    if(allergens.includes('lacteos')){
      warnings.push({
        nutrient: 'calcio',
        risk: 'medium',
        message: 'Al evitar lacteos, monitorea calcio. Fuentes: sardinas, brocoli, kale, tofu fortificado.'
      });
      warnings.push({
        nutrient: 'vitamina_d',
        risk: 'medium',
        message: 'Sin lacteos fortificados, considera suplemento de vitamina D3.'
      });
    }

    // Vegetarianos/veganos
    if(allergens.includes('pescado') && allergens.includes('mariscos')){
      warnings.push({
        nutrient: 'omega_3',
        risk: 'medium',
        message: 'Sin pescados, tu omega-3 EPA/DHA puede estar bajo. Considera suplemento algal.'
      });
    }

    // Dieta baja en calorias
    const bud = calBudget();
    if(bud && bud.target < 1500){
      warnings.push({
        nutrient: 'multi',
        risk: 'medium',
        message: 'Dieta <1500 cal dificil de cubrir micros. Considera multivitaminico.'
      });
    }

    // Sin comer vegetales
    const meals = UserMeals.getUserMeals();
    let hasVeg = false;
    meals.forEach(m => {
      m.foods.forEach(f => {
        const food = window.FoodDB?.getFood(f.foodKey);
        if(food && food.category === 'vegetal') hasVeg = true;
      });
    });
    if(!hasVeg && meals.length){
      warnings.push({
        nutrient: 'fibra',
        risk: 'high',
        message: 'No veo vegetales en tu plan. Fibra y vitaminas pueden estar bajas.'
      });
    }

    return warnings;
  }
};

// ================================================================
//  LIBRA COACH - desbloqueable al tener 7 dias de racha
// ================================================================
const LibraCoach = {
  // Verifica si esta desbloqueado
  isUnlocked() {
    return Streaks.getBest() >= 7;
  },

  // Estado del coach
  getStatus() {
    const streak = Streaks.getCurrent();
    const best = Streaks.getBest();
    return {
      unlocked: best >= 7,
      currentStreak: streak,
      bestStreak: best,
      daysToUnlock: Math.max(0, 7 - best)
    };
  },

  // Genera insights y recomendaciones personalizadas
  getCoachingInsights() {
    if(!this.isUnlocked()) return null;

    const insights = [];
    const goals = getGoals();
    const profile = getProfile();

    // 1. Analisis de progreso hacia meta
    const weights = getWeights();
    if(goals.targetWeight && weights.length >= 3){
      const cur = weights[0].weight;
      const start = goals.startWeight || profile.wStart;
      const target = goals.targetWeight;
      const progress = (start - cur) / (start - target);

      if(goals.targetDate){
        const daysLeft = dBetween(new Date(), pk(goals.targetDate));
        const expectedProgress = 1 - (daysLeft / dBetween(new Date(), pk(goals.targetDate || dk())));

        if(progress < expectedProgress * 0.7){
          insights.push({
            type: 'progress',
            severity: 'warning',
            icon: '⚠️',
            title: 'Vas atrasado en tu meta',
            message: `Llevas ${Math.round(progress*100)}%, deberias ir en ${Math.round(expectedProgress*100)}%.`,
            suggestions: this._getProgressSuggestions(goals.goalType)
          });
        } else if(progress >= expectedProgress){
          insights.push({
            type: 'progress',
            severity: 'success',
            icon: '🎯',
            title: 'Vas perfecto!',
            message: `${Math.round(progress*100)}% de tu meta. Sigue asi.`
          });
        }
      }
    }

    // 2. Analisis de comidas
    const daysBack = 7;
    let totalDays = 0, completedDays = 0;
    for(let i=1; i<=daysBack; i++){
      const d = new Date(); d.setDate(d.getDate() - i);
      const s = getDay(d);
      const meals = UserMeals.getTodayMeals(d.getDay());
      if(meals.length){
        totalDays++;
        const done = Object.values(s.meals).filter(Boolean).length;
        if(done >= meals.length * 0.8) completedDays++;
      }
    }
    if(totalDays > 0){
      const adherence = completedDays / totalDays;
      if(adherence < 0.5){
        insights.push({
          type: 'meal_adherence',
          severity: 'warning',
          icon: '🍽️',
          title: 'Baja adherencia al plan de comidas',
          message: `Solo ${completedDays}/${totalDays} dias completados. Cierta flexibilidad es OK pero consistencia cuenta.`,
          suggestions: [
            'Simplifica tu plan: menos comidas, mas repetibles',
            'Meal prep los domingos ahorra mucho',
            'Deja snacks saludables a la vista'
          ]
        });
      }
    }

    // 3. Analisis de agua
    let lowWaterDays = 0;
    const waterTarget = getSettings().waterTarget || 2500;
    for(let i=1; i<=7; i++){
      const d = new Date(); d.setDate(d.getDate() - i);
      if(getDay(d).water < waterTarget * 0.7) lowWaterDays++;
    }
    if(lowWaterDays >= 4){
      insights.push({
        type: 'hydration',
        severity: 'warning',
        icon: '💧',
        title: 'Te falta agua',
        message: `${lowWaterDays}/7 dias con hidratacion baja. Afecta energia, recuperacion y grasa.`,
        suggestions: ['Pon un vaso de agua al despertar', 'Lleva botella contigo siempre']
      });
    }

    // 4. Analisis de suplementos
    const mySups = getMySups();
    if(window.SupplementsDB && mySups.length){
      const warnings = window.SupplementsDB.checkCombinations(mySups);
      warnings.forEach(w => {
        if(w.severity === 'high' || w.severity === 'medium'){
          insights.push({
            type: 'supplement_warning',
            severity: w.severity === 'high' ? 'danger' : 'warning',
            icon: '💊',
            title: 'Atencion con tus suplementos',
            message: w.message
          });
        }
      });

      // Recomendaciones de supps segun meta que no tiene
      const recommended = Recommender.recommendSupplements();
      const missing = recommended.filter(r => !mySups.includes(r.id)).slice(0, 2);
      if(missing.length){
        insights.push({
          type: 'supplement_recommendation',
          severity: 'info',
          icon: '💡',
          title: 'Suplementos que podrian ayudarte',
          message: `Basado en tu meta, considera: ${missing.map(s => s.name).join(', ')}.`
        });
      }
    }

    // 5. Micronutrientes
    const microWarnings = Recommender.checkMicronutrients();
    microWarnings.forEach(w => {
      insights.push({
        type: 'micronutrient',
        severity: w.risk === 'high' ? 'warning' : 'info',
        icon: '🥗',
        title: `Monitorea tu ${w.nutrient.replace('_', ' ')}`,
        message: w.message
      });
    });

    return insights;
  },

  _getProgressSuggestions(goalType) {
    if(goalType === 'fat_loss') return [
      'Revisa tu deficit calorico - puede ser muy leve',
      'Incrementa cardio a 3-4x/semana',
      'Mide porciones - calorias se subestiman 20-30%',
      'Mas proteina para saciedad (1.8-2g/kg)'
    ];
    if(goalType === 'muscle_gain') return [
      'Superavit puede ser insuficiente - agrega 200-300 cal',
      'Progresion sobrecarga: sube peso o reps cada semana',
      'Proteina 1.6-2.2g/kg',
      'Descanso 48h entre entrenar mismo grupo muscular'
    ];
    if(goalType === 'strength') return [
      'Reduce volumen, aumenta intensidad (3-5 reps)',
      'Mas descanso entre series (3-5 min)',
      'Periodiza: 4 sem construccion + 1 sem deload',
      'Come suficiente - fuerza necesita combustible'
    ];
    return ['Revisa tu consistencia', 'Ajusta calorias', 'Descansa mejor'];
  }
};
