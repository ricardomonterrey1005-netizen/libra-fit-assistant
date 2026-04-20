// ================================================================
//  LIBRA FIT - USER MEAL CONFIGURATION
//  Permite al usuario personalizar completamente sus comidas
// ================================================================

const UserMeals = {
  // Plantilla por defecto: 5 comidas diarias todos los dias, sin alimentos
  DEFAULT_TEMPLATE: [
    { id:'desayuno',  label:'Desayuno',   time:'07:00', days:[0,1,2,3,4,5,6], foods:[], notes:'' },
    { id:'merienda1', label:'Merienda 1', time:'10:00', days:[0,1,2,3,4,5,6], foods:[], notes:'' },
    { id:'almuerzo',  label:'Almuerzo',   time:'12:30', days:[0,1,2,3,4,5,6], foods:[], notes:'' },
    { id:'merienda2', label:'Merienda 2', time:'16:00', days:[0,1,2,3,4,5,6], foods:[], notes:'' },
    { id:'cena',      label:'Cena',       time:'19:00', days:[0,1,2,3,4,5,6], foods:[], notes:'' }
  ],

  // Obtiene la plantilla activa del usuario
  getUserMeals(){
    const m = S.g('userMeals', null);
    if(!m || !Array.isArray(m) || !m.length) return JSON.parse(JSON.stringify(this.DEFAULT_TEMPLATE));
    return m;
  },

  // Guarda la plantilla completa
  saveUserMeals(meals){
    S.s('userMeals', meals);
  },

  // Reinicia a la plantilla por defecto
  resetToDefault(){
    this.saveUserMeals(JSON.parse(JSON.stringify(this.DEFAULT_TEMPLATE)));
  },

  // Verifica si el usuario ya ha configurado sus comidas
  hasCustom(){
    return !!S.g('userMeals', null);
  },

  // Obtiene las comidas activas para un dia de la semana (0=Dom..6=Sab)
  getTodayMeals(dow){
    if(dow===undefined||dow===null) dow = new Date().getDay();
    return this.getUserMeals()
      .filter(m => !m.days || m.days.includes(dow))
      .sort((a,b) => a.time.localeCompare(b.time));
  },

  // Calcula macros totales de UNA comida
  calcMealMacros(meal){
    const tot = {cal:0,p:0,c:0,fat:0,fib:0};
    if(!meal||!Array.isArray(meal.foods)) return tot;
    meal.foods.forEach(item => {
      const m = foodMacros(item.foodKey, item.grams||0);
      tot.cal += m.cal; tot.p += m.p; tot.c += m.c; tot.fat += m.fat; tot.fib += m.fib;
    });
    // Redondear
    tot.cal = Math.round(tot.cal);
    tot.p = Math.round(tot.p*10)/10;
    tot.c = Math.round(tot.c*10)/10;
    tot.fat = Math.round(tot.fat*10)/10;
    tot.fib = Math.round(tot.fib*10)/10;
    return tot;
  },

  // Calcula macros totales del dia (todas las comidas activas + extras)
  // Usa las comidas REALMENTE comidas si hay override en st.meals[id] = {foods:[...]}
  calcDayMacros(dow,st){
    dow = dow ?? new Date().getDay();
    st = st || getDay();
    const tot = {cal:0,p:0,c:0,fat:0,fib:0};
    this.getTodayMeals(dow).forEach(meal => {
      const actual = st.meals && st.meals[meal.id];
      // Solo sumar si la comida esta marcada como hecha (como lo hace el sistema legacy)
      if(!actual) return;
      let foodsToUse = meal.foods;
      if(typeof actual === 'object' && Array.isArray(actual.foods)) foodsToUse = actual.foods;
      const m = this.calcMealMacros({foods:foodsToUse});
      tot.cal += m.cal; tot.p += m.p; tot.c += m.c; tot.fat += m.fat; tot.fib += m.fib;
    });
    // Extras (quick-add)
    (st.extras||[]).forEach(e => {
      const c = Number(e.c); if(!isNaN(c)) tot.cal += c;
      if(e.p) tot.p += Number(e.p)||0;
      if(e.cb) tot.c += Number(e.cb)||0;
      if(e.f) tot.fat += Number(e.f)||0;
    });
    tot.cal = Math.round(tot.cal);
    tot.p = Math.round(tot.p*10)/10;
    tot.c = Math.round(tot.c*10)/10;
    tot.fat = Math.round(tot.fat*10)/10;
    tot.fib = Math.round(tot.fib*10)/10;
    return tot;
  },

  // Calcula metas de macros basado en perfil (weight_kg * 1.8g proteina)
  calcTargets(){
    const p = getProfile();
    const bud = calBudget();
    // Peso en kg (si esta en libras convertir)
    let kg = 70;
    const w = getWeights();
    if(w.length) kg = w[0].weight / 2.2046;
    else if(p.wStart) kg = p.wStart / 2.2046;
    const protTarget = Math.round(kg * 1.8);
    // Distribucion: proteina = 4cal/g, carbs = 4cal/g, fat = 9cal/g
    const protCal = protTarget * 4;
    // Fat = 25-30% de calorias
    const fatCal = Math.round(bud.target * 0.28);
    const fatTarget = Math.round(fatCal / 9);
    // Carbs = el resto
    const carbCal = bud.target - protCal - fatCal;
    const carbTarget = Math.max(100, Math.round(carbCal / 4));
    return {
      cal: bud.target,
      p: protTarget,
      c: carbTarget,
      fat: fatTarget,
      fib: 30
    };
  },

  // Reemplazar un alimento en la PLANTILLA
  swapFood(mealId, foodIndex, newFoodKey, newGrams){
    const meals = this.getUserMeals();
    const meal = meals.find(m => m.id === mealId);
    if(!meal || !meal.foods || !meal.foods[foodIndex]) return false;
    meal.foods[foodIndex] = { foodKey:newFoodKey, grams:newGrams||100 };
    this.saveUserMeals(meals);
    return true;
  },

  // Registrar lo que el usuario COMIO de verdad en una comida (override por dia)
  logActualEaten(mealId, foods, st){
    st = st || getDay();
    st.meals = st.meals || {};
    st.meals[mealId] = { done:true, foods: foods };
    saveDay(st);
  },

  // Helper: obtener meal definition por id
  getMealById(id){
    return this.getUserMeals().find(m => m.id === id) || null;
  },

  // Fuzzy search en foods (por key o nombre)
  searchFoods(q,limit=8){
    if(!q||q.length<2) return [];
    return searchFood(q).slice(0, limit);
  }
};

// Helper global: obtiene plan de comida para HOY (usa UserMeals si hay custom, si no el plan legacy)
function getMealForToday(id, dow){
  if(dow===undefined) dow = new Date().getDay();
  // Si hay plantilla custom
  if(UserMeals.hasCustom()){
    const um = UserMeals.getMealById(id);
    if(um){
      const macros = UserMeals.calcMealMacros(um);
      const desc = um.foods && um.foods.length
        ? um.foods.map(f => {
            const food = FOOD[f.foodKey];
            return food ? `${f.grams}g ${food.n}` : f.foodKey;
          }).join(' + ')
        : 'Sin configurar';
      return {
        desc,
        alts: [],
        cal: macros.cal,
        p: macros.p,
        cb: macros.c,
        f: macros.fat,
        fib: macros.fib,
        prep: 0,
        time: um.time,
        label: um.label,
        custom: true,
        foods: um.foods
      };
    }
  }
  // Fallback al sistema legacy
  if(typeof MEALS !== 'undefined' && MEALS[id]) return getMeal(id, dow);
  return null;
}
