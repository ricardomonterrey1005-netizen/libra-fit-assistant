// ================================================================
//  LIBRA FIT - USER MEAL CONFIGURATION
// ================================================================
//  v2.0: Plantilla VACIA por defecto. El usuario configura todo en
//  el onboarding. No hay horarios ni alimentos pre-cargados.
//
//  Estructura por comida:
//    { id, label, time, days:[0-6], foods:[{foodKey, grams}], notes }
// ================================================================

const UserMeals = {
  // ===== USER DATA =====
  // Usuario nuevo: arreglo vacio. Configura en onboarding.
  getUserMeals() {
    return S.g('userMeals', []);
  },

  saveUserMeals(meals) {
    S.s('userMeals', meals);
  },

  resetToDefault() {
    this.saveUserMeals([]);
  },

  hasCustom() {
    if (typeof localStorage === 'undefined') return false;
    return !!localStorage.getItem(S._prefix('userMeals'));
  },

  // ===== QUERIES =====
  getTodayMeals(dow = new Date().getDay()) {
    const meals = this.getUserMeals();
    return meals.filter(m => Array.isArray(m.days) && m.days.includes(dow));
  },

  getMealById(id) {
    if (!id) return null;
    return this.getUserMeals().find(m => m.id === id) || null;
  },

  // ===== CALCULOS =====
  // Calcula macros totales de una comida (sumando foods[].grams * macros/100g)
  calcMealMacros(meal) {
    const totals = { cal:0, protein:0, carbs:0, fat:0, fiber:0 };
    if (!meal || !Array.isArray(meal.foods)) return totals;
    meal.foods.forEach(f => {
      const food = this._getFoodData(f.foodKey);
      if (!food) return;
      const grams = Number(f.grams) || 0;
      const factor = grams / 100;
      totals.cal     += (food.cal     || 0) * factor;
      totals.protein += (food.protein || 0) * factor;
      totals.carbs   += (food.carbs   || 0) * factor;
      totals.fat     += (food.fat     || 0) * factor;
      totals.fiber   += (food.fiber   || 0) * factor;
    });
    Object.keys(totals).forEach(k => { totals[k] = Math.round(totals[k] * 10) / 10; });
    return totals;
  },

  // Calcula totales del dia (todas las comidas activas + extras registrados)
  calcDayMacros(dow = new Date().getDay(), dayState = null) {
    const totals = { cal:0, protein:0, carbs:0, fat:0, fiber:0 };
    const todayMeals = this.getTodayMeals(dow);

    // Comidas del plan marcadas como hechas
    todayMeals.forEach(meal => {
      if (!dayState || !dayState.meals) return;
      const mealState = dayState.meals[meal.id];
      if (!mealState) return;
      // Si hay override (comio algo distinto), usar ese
      const effective = mealState.foods || meal.foods;
      const macros = this.calcMealMacros({ foods: effective });
      Object.keys(totals).forEach(k => { totals[k] += macros[k]; });
    });

    // Extras registrados
    if (dayState && Array.isArray(dayState.extras)) {
      dayState.extras.forEach(e => {
        totals.cal     += Number(e.cal)     || Number(e.c) || 0;
        totals.protein += Number(e.protein) || Number(e.p) || 0;
        totals.carbs   += Number(e.carbs)   || Number(e.cb) || 0;
        totals.fat     += Number(e.fat)     || Number(e.f) || 0;
        totals.fiber   += Number(e.fiber)   || 0;
      });
    }

    Object.keys(totals).forEach(k => { totals[k] = Math.round(totals[k] * 10) / 10; });
    return totals;
  },

  // Calcula targets del usuario (proteina, grasa, carbs)
  // Basado en peso corporal + meta + actividad
  calcTargets() {
    const profile = typeof getProfile === 'function' ? getProfile() : {};
    const goals = typeof getGoals === 'function' ? getGoals() : {};
    const weightLbs = profile.wStart || profile.weight || 0;
    const weightKg = weightLbs * 0.453592;

    // Calorias target viene del BMR/TDEE si existe
    let calTarget = 2000;
    if (typeof calBudget === 'function') {
      const bud = calBudget();
      calTarget = bud.target || 2000;
    }

    // Proteina: depende de la meta
    let proteinPerKg = 1.6;
    if (goals.goalType === 'fat_loss')    proteinPerKg = 2.0;  // preservar musculo
    if (goals.goalType === 'muscle_gain') proteinPerKg = 1.8;
    if (goals.goalType === 'strength')    proteinPerKg = 1.8;
    if (goals.goalType === 'endurance')   proteinPerKg = 1.4;

    const proteinTarget = weightKg > 0 ? Math.round(weightKg * proteinPerKg) : 0;
    const fatTarget = Math.round((calTarget * 0.28) / 9);                 // 28% cal de grasa
    const proteinCal = proteinTarget * 4;
    const fatCal = fatTarget * 9;
    const carbsTarget = Math.max(0, Math.round((calTarget - proteinCal - fatCal) / 4));
    const fiberTarget = 25 + (weightKg > 70 ? 5 : 0);

    return { cal: calTarget, protein: proteinTarget, carbs: carbsTarget, fat: fatTarget, fiber: fiberTarget };
  },

  // ===== ACCIONES =====
  // Cambiar un alimento de una comida (live swap)
  swapFood(mealId, foodIndex, newFoodKey, newGrams) {
    const meals = this.getUserMeals();
    const meal = meals.find(m => m.id === mealId);
    if (!meal || !meal.foods[foodIndex]) return false;
    meal.foods[foodIndex] = { foodKey: newFoodKey, grams: newGrams };
    this.saveUserMeals(meals);
    return true;
  },

  // Registrar lo que se comio realmente (override del plan)
  // dayState.meals[mealId] = { done:true, foods:[{foodKey,grams}] }
  logActualEaten(dayState, mealId, foods) {
    if (!dayState.meals) dayState.meals = {};
    dayState.meals[mealId] = { done: true, foods: foods, at: new Date().toISOString() };
    return dayState;
  },

  // Busca alimentos por texto (fuzzy)
  searchFoods(query) {
    if (!query) return [];
    if (typeof window !== 'undefined' && window.FoodDB && window.FoodDB.searchFood) {
      return window.FoodDB.searchFood(query);
    }
    return [];
  },

  // ===== HELPERS =====
  newMealId() {
    return 'meal_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  },

  _getFoodData(foodKey) {
    if (typeof window !== 'undefined' && window.FoodDB && window.FoodDB.getFood) {
      const f = window.FoodDB.getFood(foodKey);
      if (f) return {
        cal: f.cal, protein: f.protein, carbs: f.carbs,
        fat: f.fat, fiber: f.fiber, name: f.name
      };
    }
    // Fallback a constante FOOD (que usa Proxy a FoodDB tambien)
    if (typeof FOOD !== 'undefined' && FOOD[foodKey]) {
      const f = FOOD[foodKey];
      return {
        cal: f.c, protein: f.p, carbs: f.cb, fat: f.f,
        fiber: f.fib || 0, name: f.n
      };
    }
    return null;
  }
};

// ===== HELPERS GLOBALES =====
// getMealForToday(id, dow) - retorna la comida de hoy (custom o null)
function getMealForToday(id, dow) {
  const today = UserMeals.getTodayMeals(dow);
  return today.find(m => m.id === id) || null;
}
