// ================================================================
//  LIBRA FIT - CORE ENGINE (storage, calculos, rachas, notifs)
// ================================================================
//  v2.0 CLEAN:
//  - Cero defaults personales (nombre, horarios, suplementos, rutinas)
//  - BMR/TDEE dinamicos (Mifflin-St Jeor)
//  - Notificaciones basadas en config del usuario (horarios propios)
// ================================================================

// ===== HELPERS DE FECHAS =====
function dk(d=new Date()){return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function pk(k){const[y,m,d]=k.split('-').map(Number);return new Date(y,m-1,d)}
function dBetween(a,b){return Math.ceil((b-a)/864e5)}
function fmtDate(k){const d=pk(k);return`${DAY_SHORT[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()].slice(0,3)}`}
function tomorrow(){const d=new Date();d.setDate(d.getDate()+1);return d}

// ===== STORAGE (localStorage + Server Sync) =====
const S = {
  _scope: 'guest',
  _prefix(k){ return `fr_${this._scope}_${k}` },
  setScope(userId){
    this._scope = userId || 'guest';
    console.log('Storage scope:', this._scope);
  },
  g(k, d=null){
    try { const v = localStorage.getItem(this._prefix(k)); return v ? JSON.parse(v) : d; }
    catch(e) { return d; }
  },
  s(k, v){
    localStorage.setItem(this._prefix(k), JSON.stringify(v));
    if(typeof Sync !== 'undefined' && Sync.push) Sync.push(k, v);
  },
  d(k){
    localStorage.removeItem(this._prefix(k));
    if(typeof Sync !== 'undefined' && Auth?.isLoggedIn() && typeof API_BASE !== 'undefined'){
      fetch(`${API_BASE}/data/delete/${k}`, {
        method: 'DELETE', headers: {'Authorization': 'Bearer ' + Auth.token}
      }).catch(() => {});
    }
  },
  clearScope(){
    const prefix = `fr_${this._scope}_`;
    const toRemove = [];
    for(let i=0; i<localStorage.length; i++){
      const key = localStorage.key(i);
      if(key && key.startsWith(prefix)) toRemove.push(key);
    }
    toRemove.forEach(k => localStorage.removeItem(k));
    console.log(`Cleared ${toRemove.length} keys for scope: ${this._scope}`);
  },
  migrateOldKeys(userId){
    const oldPrefix = 'fr_';
    const newPrefix = `fr_${userId}_`;
    const skipKeys = ['fr_token','fr_user','fr_offline','fr_lastUser'];
    const toMigrate = [];
    for(let i=0; i<localStorage.length; i++){
      const key = localStorage.key(i);
      if(!key || !key.startsWith(oldPrefix)) continue;
      if(skipKeys.includes(key)) continue;
      const afterPrefix = key.slice(3);
      if(afterPrefix.includes('_') && (afterPrefix.startsWith('guest_') || afterPrefix.match(/^[0-9a-f]{8}-/))) continue;
      toMigrate.push(key);
    }
    if(!toMigrate.length) return false;
    toMigrate.forEach(key => {
      const shortKey = key.slice(3);
      const val = localStorage.getItem(key);
      localStorage.setItem(newPrefix + shortKey, val);
      localStorage.removeItem(key);
    });
    console.log(`Migrated ${toMigrate.length} old keys to scope: ${userId}`);
    return true;
  }
};

// ===== STATE GETTERS (todos con defaults VACIOS/NULL) =====
function getDay(d=new Date()){ return S.g('d_'+dk(d), {meals:{}, water:0, exLog:{}, cardioId:null, cardioDone:false, extras:[]}) }
function saveDay(st, d=new Date()){ S.s('d_'+dk(d), st) }

// Profile VACIO por defecto - usuario completa en onboarding
function getProfile(){ return S.g('profile', {
  name:'', age:null, gender:null, height:null,
  wStart:null, wGoal:null, activity:null,
  bodyFat:null, muscleMass:null, visceralFat:null, metaAge:null,
  bmr:null, notes:''
})}
function saveProfile(p){ S.s('profile', p) }

// Goals VACIOS - sin fecha meta, sin peso meta
function getGoals(){ return S.g('goals', {
  goalType:null,      // fat_loss, muscle_gain, etc.
  targetWeight:null,
  targetDate:null,
  startWeight:null,
  subGoals:[]         // metas medibles adicionales
})}
function saveGoals(g){ S.s('goals', g) }

// Settings con defaults razonables (todo activado pero horarios son del usuario)
function getSettings(){ return S.g('settings', {
  notif:true, water:true, sleep:true, meal:true, gym:true, morning:true,
  // Horarios personalizables (usuario los define en onboarding)
  morningTime:'07:00',       // briefing matutino
  sleepTime:'22:00',         // hora de dormir
  waterEvery:2,              // recordar agua cada N horas
  waterTarget:2500           // mL/dia default (se ajusta por peso)
})}
function saveSettings(s){ S.s('settings', s) }

function getWeights(){ return S.g('bw', []) }
function saveWeights(w){ S.s('bw', w) }

function getExHist(id){ return S.g('eh_'+id, []) }
function saveExHist(id, h){ S.s('eh_'+id, h) }

// Suplementos del usuario - VACIO por defecto (configura en onboarding)
function getMySups(){ return S.g('mysups', []) }
function saveMySups(s){ S.s('mysups', s) }

// ===== BMR / TDEE (Mifflin-St Jeor) =====
// Calcula Basal Metabolic Rate (calorias en reposo)
function calcBMR(profile){
  const p = profile || getProfile();
  if(!p.age || !p.height || !p.wStart || !p.gender) return null;
  const weightKg = p.wStart * 0.453592;       // lbs a kg
  const heightCm = p.height * 2.54;           // inches a cm si usa inches, o ya es cm
  // Si height viene en cm (> 100), no convertir
  const h = p.height > 100 ? p.height : p.height * 2.54;
  const base = 10 * weightKg + 6.25 * h - 5 * p.age;
  return Math.round(p.gender === 'femenino' ? base - 161 : base + 5);
}

// Calcula Total Daily Energy Expenditure
function calcTDEE(profile){
  const bmr = calcBMR(profile);
  if(!bmr) return null;
  const p = profile || getProfile();
  const act = (typeof ACTIVITY_LEVELS !== 'undefined' && ACTIVITY_LEVELS[p.activity])
            ? ACTIVITY_LEVELS[p.activity].multiplier : 1.375;
  return Math.round(bmr * act);
}

// Calcula target calorico segun meta
function calBudget(){
  const p = getProfile();
  const g = getGoals();
  const tdee = calcTDEE(p);
  if(!tdee) return { target:2000, min:1200, max:2500, tdee:null, bmr:null };
  let target = tdee;
  if(g.goalType === 'fat_loss')    target = Math.round(tdee * 0.80);   // deficit 20%
  if(g.goalType === 'muscle_gain') target = Math.round(tdee * 1.10);   // surplus 10%
  if(g.goalType === 'strength')    target = Math.round(tdee * 1.05);
  const bmr = calcBMR(p);
  const floor = p.gender === 'femenino' ? 1200 : 1500;
  const min = Math.max(floor, bmr || floor);       // nunca bajar del BMR
  const max = Math.round(tdee * 1.20);
  return { target, min, max, tdee, bmr };
}

// ===== MACROS TRACKING =====
function todayCal(st, dow){
  st = st || getDay();
  dow = dow ?? new Date().getDay();
  if(typeof UserMeals !== 'undefined' && UserMeals.hasCustom()){
    return UserMeals.calcDayMacros(dow, st).cal;
  }
  // Fallback: solo extras registrados
  let t = 0;
  (st.extras || []).forEach(e => { const c = Number(e.cal) || Number(e.c); if(!isNaN(c)) t += c; });
  return t;
}

function todayMacros(st, dow){
  st = st || getDay();
  dow = dow ?? new Date().getDay();
  if(typeof UserMeals !== 'undefined' && UserMeals.hasCustom()){
    return UserMeals.calcDayMacros(dow, st);
  }
  // Fallback: sumar extras
  const tot = { cal:0, protein:0, carbs:0, fat:0, fiber:0 };
  (st.extras || []).forEach(e => {
    tot.cal     += Number(e.cal)     || Number(e.c) || 0;
    tot.protein += Number(e.protein) || Number(e.p) || 0;
    tot.carbs   += Number(e.carbs)   || Number(e.cb) || 0;
    tot.fat     += Number(e.fat)     || Number(e.f) || 0;
    tot.fiber   += Number(e.fiber)   || 0;
  });
  return tot;
}

// Metas de macros - calculadas dinamicamente
function macroTargets(){
  if(typeof UserMeals !== 'undefined' && UserMeals.calcTargets){
    return UserMeals.calcTargets();
  }
  const bud = calBudget();
  return { cal: bud.target, protein:0, carbs:0, fat:0, fiber:25 };
}

// Evaluador "puedo comer X?" - solo si existe FoodDB
function canIEat(foodKey, st, dow){
  const f = typeof FOOD !== 'undefined' ? FOOD[foodKey] : null;
  if(!f) return null;
  const cur = todayCal(st, dow);
  const b = calBudget();
  const rem = b.target - cur;
  const after = cur + f.c;
  let ans, msg;
  if(after <= b.target && f.v === 'ok'){ ans='go'; msg=`Si. ${f.n} (${f.c} cal) entra bien. Quedan ${rem} cal.`; }
  else if(after > b.max){ ans='no'; msg=`No recomendado. Te pasarias del limite (${after} > ${b.max}).`; }
  else if(after <= b.max){ ans='warn'; msg=`Puedes, pero ajusta el dia (${after}/${b.target}).`; }
  else { ans='warn'; msg=`Con moderacion.`; }
  return { ans, msg, food: f, cur, rem, after };
}

// ===== SMART ENGINE (analisis) =====
const Engine = {
  bodyAnalysis(){
    const w = getWeights(), g = getGoals(), out = [];
    if(!w.length){
      out.push({t:'info', i:'⚖️', m:'Registra tu peso para trackear progreso.'});
      return out;
    }
    const cur = w[0].weight;
    if(g.targetWeight && g.startWeight){
      const loss = g.startWeight - cur;
      const total = g.startWeight - g.targetWeight;
      const pct = total !== 0 ? Math.round(loss / total * 100) : 0;
      if(g.targetDate){
        const left = dBetween(new Date(), pk(g.targetDate));
        if(pct >= 100) out.push({t:'ok', i:'🏆', m:`META CUMPLIDA! Llegaste a ${g.targetWeight} lbs.`});
        else if(left > 0){
          const rate = ((cur - g.targetWeight) / (left / 7)).toFixed(1);
          out.push({t:'info', i:'🎯', m:`Llevas ${Math.max(0,loss).toFixed(1)}/${total} lbs. Faltan ${left} dias (~${rate} lbs/sem).`});
          if(rate > 2) out.push({t:'warn', i:'⚠️', m:`${rate} lbs/sem es agresivo. Saludable: 0.5-1 lbs/sem.`});
        }
      }
    }
    if(w.length >= 3){
      const wk = w.filter(x => dBetween(pk(x.date), new Date()) <= 7);
      if(wk.length >= 2){
        const ch = wk[0].weight - wk[wk.length-1].weight;
        if(ch > 0.5) out.push({t:'warn', i:'📈', m:`+${ch.toFixed(1)} lbs esta semana. Revisa tu plan.`});
        else if(ch < -3) out.push({t:'warn', i:'⚡', m:`-${Math.abs(ch).toFixed(1)} lbs esta semana. Mucho, puede ser agua/musculo.`});
        else if(ch < -0.5) out.push({t:'ok', i:'✅', m:`-${Math.abs(ch).toFixed(1)} lbs esta semana. Buen ritmo.`});
      }
    }
    return out;
  },
  exAnalysis(id, nw){
    const h = getExHist(id), out = [];
    if(!h.length) return { out, sug: nw };
    const last = h[0].weight, pr = Math.max(...h.map(x => x.weight));
    if(nw > last * 1.15) out.push({t:'danger', i:'🚨', m:`+${Math.round((nw-last)/last*100)}% peso. Sube gradual (2-5 lbs).`});
    if(nw < last * .75 && nw > 0) out.push({t:'warn', i:'📉', m:`Bajaste mucho (${last}→${nw}). Todo bien?`});
    if(nw > pr && nw > 0) out.push({t:'ok', i:'🏆', m:`NUEVO PR! ${nw} lbs.`});
    return { out, sug: last, pr, last, lastDate: h[0].date };
  },
  mealCheck(){
    const out = [];
    if(typeof UserMeals === 'undefined' || !UserMeals.hasCustom()) return out;
    let miss = 0, tot = 0, done = 0;
    for(let i=1; i<=7; i++){
      const d = new Date(); d.setDate(d.getDate() - i);
      const s = getDay(d);
      const todayMeals = UserMeals.getTodayMeals(d.getDay());
      if(!todayMeals.length) continue;
      const dm = Object.values(s.meals).filter(Boolean).length;
      tot += todayMeals.length;
      done += dm;
      if(dm < Math.floor(todayMeals.length / 2)) miss++;
    }
    if(miss >= 3) out.push({t:'warn', i:'🍽️', m:`${miss} dias incompletos. No saltes comidas.`});
    const pct = tot ? Math.round(done/tot*100) : 0;
    if(pct < 60 && tot) out.push({t:'warn', i:'📉', m:`${pct}% comidas esta semana. Meta: 85%+.`});
    else if(pct >= 90 && tot) out.push({t:'ok', i:'⭐', m:`${pct}% comidas. EXCELENTE!`});
    return out;
  },
  gymCheck(){
    const out = [];
    if(typeof UserRoutines === 'undefined' || !UserRoutines.hasCustomConfig()) return out;
    let days = 0;
    for(let i=1; i<=14; i++){
      const d = new Date(); d.setDate(d.getDate() - i);
      const s = getDay(d);
      if(Object.keys(s.exLog).some(k => { const l = s.exLog[k]; return l?.sets?.some(x => x.done); })) break;
      days++;
    }
    if(days >= 4 && days < 7) out.push({t:'warn', i:'🏋️', m:`${days} dias sin entrenar. Ve aunque sea 30 min.`});
    else if(days >= 7) out.push({t:'danger', i:'🚨', m:`${days} dias sin entrenar! Vuelve hoy.`});
    return out;
  },
  waterCheck(){
    const out = [];
    const settings = getSettings();
    const target = settings.waterTarget || 2500;
    const min = target * 0.75;
    let low = 0;
    for(let i=1; i<=7; i++){
      const d = new Date(); d.setDate(d.getDate() - i);
      if(getDay(d).water < min) low++;
    }
    if(low >= 4) out.push({t:'danger', i:'💧', m:`${low}/7 dias con poca agua. Rinones necesitan agua.`});
    return out;
  },
  allInsights(){
    return [...this.bodyAnalysis(), ...this.mealCheck(), ...this.gymCheck(), ...this.waterCheck()];
  },
  briefing(d=new Date()){
    const b = [];
    const h = d.getHours();
    b.push(h<12 ? 'Buenos dias' : 'Buenas ' + (h<18 ? 'tardes' : 'noches'));
    const routine = typeof getEffectiveRoutine === 'function' ? getEffectiveRoutine() : null;
    if(routine) b.push(`🏋️ ${routine.name}`);
    else b.push('Descanso');
    const isCardio = typeof isEffectiveCardioDay === 'function' ? isEffectiveCardioDay() : false;
    if(isCardio) b.push('🏃 Cardio hoy');
    if(typeof UserMeals !== 'undefined' && UserMeals.hasCustom()){
      const mealsToday = UserMeals.getTodayMeals(d.getDay());
      if(mealsToday.length){
        b.push('🍽️ ' + mealsToday.map(m => `${m.time} ${m.label}`).join(' | '));
      }
    }
    const target = (getSettings().waterTarget || 2500) / 1000;
    b.push(`💧 Meta: ${target} L`);
    return b;
  },
  tomorrowPreview(){
    const t = tomorrow(), dow = t.getDay();
    const meals = typeof UserMeals !== 'undefined' ? UserMeals.getTodayMeals(dow) : [];
    const routine = typeof UserRoutines !== 'undefined'
                  ? UserRoutines.routineToLegacy(UserRoutines.getTodayRoutine(t))
                  : null;
    return {
      date: t,
      dayName: DAY_NAMES[dow],
      meals,
      ex: routine,
      cardio: typeof UserRoutines !== 'undefined' ? UserRoutines.isCardioDay(t) : false,
      batch: null,
      bring: meals.map(m => `${m.label}`)
    };
  }
};

// ===== STREAK & GAMIFICATION =====
function getDayScore(d=new Date()){
  const st = getDay(d), dow = d.getDay();
  let pts = 0, max = 0;

  // Comidas (40 pts max) - solo si hay plan configurado
  if(typeof UserMeals !== 'undefined' && UserMeals.hasCustom()){
    const mealsToday = UserMeals.getTodayMeals(dow);
    if(mealsToday.length){
      const done = Object.values(st.meals).filter(Boolean).length;
      pts += Math.round(done / mealsToday.length * 40);
      max += 40;
    }
  }

  // Agua (20 pts max)
  const waterTarget = getSettings().waterTarget || 2500;
  const wPct = Math.min(1, st.water / waterTarget);
  pts += Math.round(wPct * 20); max += 20;

  // Gym (25 pts max) - solo si hay rutina hoy
  const routine = typeof UserRoutines !== 'undefined' ? UserRoutines.getTodayRoutine(d) : null;
  if(routine && routine.exercises && routine.exercises.length){
    let exDone = 0, exTotal = 0;
    routine.exercises.forEach(e => {
      exTotal += e.sets || 0;
      const l = st.exLog[e.exKey];
      if(l?.sets) exDone += l.sets.filter(x => x.done).length;
    });
    if(exTotal > 0){
      pts += Math.round(exDone / exTotal * 25);
      max += 25;
    }
  }

  // Cardio (15 pts max) - solo si es dia de cardio
  if(typeof UserRoutines !== 'undefined' && UserRoutines.isCardioDay(d)){
    pts += st.cardioDone ? 15 : 0;
    max += 15;
  }

  return { pts, max, pct: max ? Math.round(pts/max*100) : 0 };
}

const Streaks = {
  getCurrent(){
    let streak = 0;
    for(let i=1; i<=365; i++){
      const d = new Date(); d.setDate(d.getDate() - i);
      const sc = getDayScore(d);
      if(sc.max === 0) break;          // si no hay plan configurado, cortar
      if(sc.pct >= 60) streak++;
      else break;
    }
    return streak;
  },
  getBest(){
    const saved = S.g('bestStreak', 0);
    const cur = this.getCurrent();
    if(cur > saved) S.s('bestStreak', cur);
    return Math.max(saved, cur);
  },
  getXP(){ return S.g('totalXP', 0); },
  addDailyXP(){
    const today = dk();
    if(S.g('lastXPDay') === today) return;
    const y = new Date(); y.setDate(y.getDate() - 1);
    const sc = getDayScore(y);
    const xp = sc.pts * 10;
    S.s('totalXP', (S.g('totalXP', 0)) + xp);
    S.s('lastXPDay', today);
  },
  getLevel(){ return Math.floor(this.getXP() / 500) + 1; },
  getLevelProgress(){
    const xp = this.getXP();
    const inLevel = xp % 500;
    return { current: inLevel, needed: 500, pct: Math.round(inLevel/500*100) };
  },
  getLevelTitle(){
    const lv = this.getLevel();
    if(lv >= 20) return 'Leyenda';
    if(lv >= 15) return 'Master';
    if(lv >= 10) return 'Veterano';
    if(lv >= 7)  return 'Guerrero';
    if(lv >= 5)  return 'Dedicado';
    if(lv >= 3)  return 'Constante';
    return 'Novato';
  },
  getBadges(){
    const badges = [];
    const streak = this.getCurrent();
    const best = this.getBest();
    const lv = this.getLevel();
    if(streak >= 3)  badges.push({id:'s3',  icon:'🔥', name:'3 dias seguidos',  tier:'bronze'});
    if(streak >= 7)  badges.push({id:'s7',  icon:'⚡', name:'Semana perfecta',   tier:'silver'});
    if(streak >= 14) badges.push({id:'s14', icon:'💎', name:'2 semanas',         tier:'gold'});
    if(streak >= 30) badges.push({id:'s30', icon:'👑', name:'Mes completo',      tier:'platinum'});
    if(best >= 7 && streak < 7) badges.push({id:'b7', icon:'🏅', name:'Ex-guerrero', tier:'bronze'});
    if(lv >= 5)  badges.push({id:'l5',  icon:'🎖️', name:'Nivel 5',  tier:'silver'});
    if(lv >= 10) badges.push({id:'l10', icon:'🏆', name:'Nivel 10', tier:'gold'});
    return badges;
  },
  getMotivation(){
    const s = this.getCurrent();
    if(s === 0)  return 'Hoy es el dia 1. Empieza tu racha.';
    if(s < 3)    return `${s} dia${s>1?'s':''} seguido${s>1?'s':''}. No rompas la cadena.`;
    if(s < 7)    return `${s} dias. Estas construyendo un habito.`;
    if(s < 14)   return `${s} dias de racha. Ya eres constante.`;
    if(s < 30)   return `${s} dias. Estas en otro nivel.`;
    return `${s} dias. Eres una leyenda.`;
  },
  getWeekScores(){
    const scores = [];
    for(let i=6; i>=0; i--){
      const d = new Date(); d.setDate(d.getDate() - i);
      const sc = getDayScore(d);
      scores.push({ date: dk(d), day: DAY_SHORT[d.getDay()], score: sc.pct, pts: sc.pts });
    }
    return scores;
  },
  // NUEVO v2.0: scores por mes
  getMonthScores(){
    const scores = [];
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
    for(let day=1; day<=daysInMonth; day++){
      const d = new Date(now.getFullYear(), now.getMonth(), day);
      if(d > now) break;
      const sc = getDayScore(d);
      scores.push({ date: dk(d), day, score: sc.pct, pts: sc.pts });
    }
    return scores;
  },
  // NUEVO v2.0: scores por ano (promedio por mes)
  getYearScores(){
    const scores = [];
    const now = new Date();
    for(let month=0; month<=now.getMonth(); month++){
      let total = 0, count = 0;
      const daysInMonth = new Date(now.getFullYear(), month+1, 0).getDate();
      for(let day=1; day<=daysInMonth; day++){
        const d = new Date(now.getFullYear(), month, day);
        if(d > now) break;
        const sc = getDayScore(d);
        if(sc.max > 0){ total += sc.pct; count++; }
      }
      scores.push({
        month, name: MONTHS_SHORT ? MONTHS_SHORT[month] : MONTHS[month].slice(0,3),
        score: count ? Math.round(total/count) : 0, days: count
      });
    }
    return scores;
  }
};

// ===== NOTIFICACIONES (basadas en horarios del usuario) =====
const Notif = {
  ok: false,
  _isLogged(){ return typeof Auth !== 'undefined' && Auth.isLoggedIn && Auth.isLoggedIn(); },
  async init(){
    if(!this._isLogged()) return;
    if('Notification' in window){
      if(Notification.permission === 'granted') this.ok = true;
      else if(Notification.permission !== 'denied'){
        this.ok = (await Notification.requestPermission()) === 'granted';
      }
    }
  },
  send(t, b, tag='g'){
    if(!this._isLogged() || !this.ok) return;
    try { new Notification(t, { body: b, tag, renotify: true }); }
    catch(e){ navigator.serviceWorker?.ready?.then(r => r.showNotification(t, {body:b, tag, renotify:true})); }
  },
  // Parse "HH:MM" a minutos desde medianoche
  _timeToMin(hhmm){
    if(!hhmm || typeof hhmm !== 'string') return -1;
    const [h, m] = hhmm.split(':').map(Number);
    if(isNaN(h) || isNaN(m)) return -1;
    return h * 60 + m;
  },
  // Check se llama cada minuto - dispara notificaciones basadas en horarios del USUARIO
  check(){
    if(!this._isLogged()) return;
    const now = new Date();
    const curMin = now.getHours() * 60 + now.getMinutes();
    const set = getSettings();
    const st = getDay();
    const dow = now.getDay();
    const sent = k => {
      const sk = `n_${k}_${dk()}`;
      if(S.g(sk)) return true;
      S.s(sk, true);
      return false;
    };
    const inWindow = (targetMin) => targetMin >= 0 && curMin >= targetMin && curMin < targetMin + 2;

    // Briefing matutino (hora del usuario)
    if(set.morning){
      const t = this._timeToMin(set.morningTime);
      if(inWindow(t) && !sent('am')){
        const b = Engine.briefing();
        this.send('Buenos dias ☀️', b[1] || 'Tu plan de hoy');
      }
    }

    // Comidas - iterar sobre las del usuario
    if(set.meal && typeof UserMeals !== 'undefined'){
      const mealsToday = UserMeals.getTodayMeals(dow);
      mealsToday.forEach(meal => {
        const t = this._timeToMin(meal.time);
        if(inWindow(t) && !st.meals[meal.id] && !sent('m_'+meal.id)){
          this.send(`🍽️ ${meal.label}`, `Hora de ${meal.label.toLowerCase()}`);
        }
      });
    }

    // Gym (15 min antes de hora definida por usuario - o default si no)
    if(set.gym && typeof UserRoutines !== 'undefined'){
      const routine = UserRoutines.getTodayRoutine(now);
      if(routine && routine.time){
        const gymMin = this._timeToMin(routine.time);
        if(gymMin >= 0){
          const alertMin = gymMin - 15;
          if(inWindow(alertMin) && !sent('gym')){
            this.send('🏋️ Gym en 15 min', routine.name);
          }
        }
      }
    }

    // Cardio
    if(set.gym && typeof UserRoutines !== 'undefined' && UserRoutines.isCardioDay(now)){
      const cfg = UserRoutines.getCardioConfig();
      if(cfg.time){
        const t = this._timeToMin(cfg.time);
        if(inWindow(t - 15) && !st.cardioDone && !sent('cd')){
          this.send('🏃 Cardio', 'En 15 min');
        }
      }
    }

    // Agua - cada N horas entre las 8 AM y 8 PM
    if(set.water){
      const waterTarget = set.waterTarget || 2500;
      const every = set.waterEvery || 2;
      for(let h=8; h<=20; h+=every){
        if(inWindow(h*60) && st.water < waterTarget && !sent(`w${h}`)){
          const left = (waterTarget - st.water) / 1000;
          this.send('💧 Hora de agua', `Llevas ${(st.water/1000).toFixed(1)}L. Faltan ${left.toFixed(1)}L.`);
        }
      }
    }

    // Dormir (hora del usuario)
    if(set.sleep){
      const t = this._timeToMin(set.sleepTime);
      if(inWindow(t - 15) && !sent('sl')){
        this.send('😴 A dormir en 15 min', 'Descansar = recuperacion + quema de grasa');
      }
    }
  }
};
