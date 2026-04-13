// ================================================================
//  FITRICARDO - SMART ENGINE + STORAGE
// ================================================================

// ===== HELPERS =====
function dk(d=new Date()){return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function pk(k){const[y,m,d]=k.split('-').map(Number);return new Date(y,m-1,d)}
function dBetween(a,b){return Math.ceil((b-a)/864e5)}
function fmtDate(k){const d=pk(k);return`${DAY_SHORT[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()].slice(0,3)}`}
function tomorrow(){const d=new Date();d.setDate(d.getDate()+1);return d}

// ===== STORAGE (localStorage + Server Sync) =====
const S={
  _scope:'guest',
  _prefix(k){return`fr_${this._scope}_${k}`},
  setScope(userId){
    this._scope=userId||'guest';
    console.log('Storage scope:',this._scope);
  },
  g(k,d=null){try{const v=localStorage.getItem(this._prefix(k));return v?JSON.parse(v):d}catch(e){return d}},
  s(k,v){
    localStorage.setItem(this._prefix(k),JSON.stringify(v));
    // Sync to server if available
    if(typeof Sync!=='undefined'&&Sync.push)Sync.push(k,v);
  },
  d(k){
    localStorage.removeItem(this._prefix(k));
    // Sync deletion to server
    if(typeof Sync!=='undefined'&&Auth?.isLoggedIn()&&typeof API_BASE!=='undefined'){
      fetch(`${API_BASE}/data/delete/${k}`,{
        method:'DELETE',headers:{'Authorization':'Bearer '+Auth.token}
      }).catch(()=>{});
    }
  },
  // Remove all keys for current scope
  clearScope(){
    const prefix=`fr_${this._scope}_`;
    const toRemove=[];
    for(let i=0;i<localStorage.length;i++){
      const key=localStorage.key(i);
      if(key&&key.startsWith(prefix))toRemove.push(key);
    }
    toRemove.forEach(k=>localStorage.removeItem(k));
    console.log(`Cleared ${toRemove.length} keys for scope: ${this._scope}`);
  },
  // Migrate old unscoped fr_ keys to a user scope
  migrateOldKeys(userId){
    const oldPrefix='fr_';
    const newPrefix=`fr_${userId}_`;
    // Skip keys that are auth-related or already scoped
    const skipKeys=['fr_token','fr_user','fr_offline','fr_lastUser'];
    const toMigrate=[];
    for(let i=0;i<localStorage.length;i++){
      const key=localStorage.key(i);
      if(!key||!key.startsWith(oldPrefix))continue;
      if(skipKeys.includes(key))continue;
      // Skip if key is already scoped (fr_<userId>_ or fr_guest_)
      const afterPrefix=key.slice(3); // after 'fr_'
      if(afterPrefix.includes('_')&&(afterPrefix.startsWith('guest_')||afterPrefix.match(/^[0-9a-f]{8}-/)))continue;
      toMigrate.push(key);
    }
    if(!toMigrate.length)return false;
    toMigrate.forEach(key=>{
      const shortKey=key.slice(3); // remove 'fr_'
      const val=localStorage.getItem(key);
      localStorage.setItem(newPrefix+shortKey,val);
      localStorage.removeItem(key);
    });
    console.log(`Migrated ${toMigrate.length} old keys to scope: ${userId}`);
    return true;
  }
};

function getDay(d=new Date()){return S.g('d_'+dk(d),{meals:{},water:0,exLog:{},cardioId:null,cardioDone:false,extras:[]})}
function saveDay(st,d=new Date()){S.s('d_'+dk(d),st)}
function getProfile(){return S.g('profile',{name:'Ricardo',age:29,gender:'masculino',height:null,wStart:null,wGoal:null,activity:'moderado',bodyFat:null,muscleMass:null,visceralFat:null,metaAge:null,bmr:null,notes:''})}
function saveProfile(p){S.s('profile',p)}
function getGoals(){return S.g('goals',{targetWeight:null,targetDate:'2026-05-10',startWeight:null})}
function saveGoals(g){S.s('goals',g)}
function getSettings(){return S.g('settings',{notif:true,water:true,sleep:true,meal:true,gym:true,morning:true})}
function saveSettings(s){S.s('settings',s)}
function getWeights(){return S.g('bw',[])}
function saveWeights(w){S.s('bw',w)}
function getExHist(id){return S.g('eh_'+id,[])}
function saveExHist(id,h){S.s('eh_'+id,h)}
function getMySups(){return S.g('mysups',['creatina','fibra','multi'])}
function saveMySups(s){S.s('mysups',s)}

// ===== CALORIE ENGINE =====
function calBudget(){const p=getProfile();return{target:p.bmr?Math.round(p.bmr*1.15):1900,min:1500,max:2200}}
function todayCal(st,dow){
  let t=0;
  MEAL_ORDER.forEach(k=>{if(st.meals[k])t+=getMeal(k,dow).cal});
  (st.extras||[]).forEach(e=>{const c=Number(e.c);if(!isNaN(c))t+=c});
  return t;
}
function canIEat(foodKey,st,dow){
  const f=FOOD[foodKey];if(!f)return null;
  const cur=todayCal(st,dow),b=calBudget(),rem=b.target-cur,after=cur+f.c;
  let ans,msg;
  if(f.v==='ok'&&after<=b.target){ans='go';msg=`Si! ${f.n} (${f.c} cal) entra perfecto. Te quedan ${rem} cal.`}
  else if(after>b.max){ans='no';msg=`No recomendado. ${f.n}=${f.c} cal, llevas ${cur}. Te pasarias a ${after} (limite ${b.max}).`}
  else if(f.v==='bad'){ans='no';msg=`${f.n} tiene ${f.c} cal y no es bueno para tu meta. ${after>b.target?'Ademas te pasas de calorias.':'Caloricamente entra pero no es nutritivo.'}`}
  else if(after<=b.max){ans='warn';msg=`Puedes pero vas justo. ${f.n}=${f.c} cal. Quedarias en ${after}/${b.target}.`}
  else{ans='warn';msg=`${f.n}=${f.c} cal. Con moderacion podria estar bien.`}
  msg+='\n'+f.note;
  return{ans,msg,food:f,cur,rem,after};
}

// ===== SMART ENGINE =====
const Engine={
  bodyAnalysis(){
    const w=getWeights(),g=getGoals(),out=[];
    if(!w.length){out.push({t:'info',i:'⚖️',m:'Registra tu peso para trackear progreso.'});return out}
    const cur=w[0].weight;
    if(g.targetWeight&&g.startWeight){
      const loss=g.startWeight-cur,total=g.startWeight-g.targetWeight,pct=Math.round(loss/total*100);
      const left=dBetween(new Date(),pk(g.targetDate));
      if(pct>=100)out.push({t:'ok',i:'🏆',m:`META CUMPLIDA! Llegaste a ${g.targetWeight} lbs!`});
      else if(left>0){
        const rate=((cur-g.targetWeight)/(left/7)).toFixed(1);
        out.push({t:'info',i:'🎯',m:`Llevas ${Math.max(0,loss).toFixed(1)}/${total} lbs. Faltan ${left} dias (~${rate} lbs/sem).`});
        if(rate>2)out.push({t:'warn',i:'⚠️',m:`${rate} lbs/sem es agresivo. Saludable: 1-2 lbs/sem.`});
      }
    }
    if(w.length>=3){
      const wk=w.filter(x=>dBetween(pk(x.date),new Date())<=7);
      if(wk.length>=2){
        const ch=wk[0].weight-wk[wk.length-1].weight;
        if(ch>0.5)out.push({t:'warn',i:'📈',m:`+${ch.toFixed(1)} lbs esta semana. Revisa dieta.`});
        else if(ch<-3)out.push({t:'warn',i:'⚡',m:`-${Math.abs(ch).toFixed(1)} lbs esta semana. Puede ser musculo.`});
        else if(ch<-0.5)out.push({t:'ok',i:'✅',m:`-${Math.abs(ch).toFixed(1)} lbs esta semana. Buen ritmo!`});
      }
      const tw=w.filter(x=>dBetween(pk(x.date),new Date())<=14);
      if(tw.length>=4&&Math.max(...tw.map(x=>x.weight))-Math.min(...tw.map(x=>x.weight))<1)
        out.push({t:'info',i:'📊',m:'Peso estancado 2 semanas. Mas cardio o menos porciones arroz.'});
    }
    return out;
  },
  exAnalysis(id,nw){
    const h=getExHist(id),g=EX[id],out=[];
    if(!h.length)return{out,sug:g.dw};
    const last=h[0].weight,pr=Math.max(...h.map(x=>x.weight));
    if(nw>last*1.15)out.push({t:'danger',i:'🚨',m:`+${Math.round((nw-last)/last*100)}% peso! Ultimo: ${last}lbs. Sube gradual (2-5lbs).`});
    if(nw<last*.75&&nw>0)out.push({t:'warn',i:'📉',m:`Bajaste mucho (${last}→${nw}). Descansaste bien?`});
    if(nw>pr&&nw>0)out.push({t:'ok',i:'🏆',m:`NUEVO PR! ${nw} lbs (antes: ${pr}).`});
    if(h.length>=4&&h.slice(0,4).every(x=>x.weight===last)&&nw===last)
      out.push({t:'info',i:'💡',m:`${h.length+1} sesiones con ${last}lbs. Sube 2-5lbs.`});
    return{out,sug:last,pr,last:last,lastDate:h[0].date};
  },
  mealCheck(){
    const out=[];let miss=0,tot=0,done=0;
    for(let i=1;i<=7;i++){const d=new Date();d.setDate(d.getDate()-i);const s=getDay(d);
      const dm=Object.values(s.meals).filter(Boolean).length;if(Object.keys(s.meals).length){tot+=6;done+=dm;if(dm<3)miss++}}
    if(miss>=3)out.push({t:'warn',i:'🍽️',m:`${miss} dias incompletos. No saltes comidas.`});
    const pct=tot?Math.round(done/tot*100):0;
    if(pct<60&&tot)out.push({t:'warn',i:'📉',m:`${pct}% comidas esta semana. Meta: 85%+.`});
    else if(pct>=90&&tot)out.push({t:'ok',i:'⭐',m:`${pct}% comidas. EXCELENTE!`});
    return out;
  },
  gymCheck(){
    const out=[];let days=0;
    for(let i=1;i<=14;i++){const d=new Date();d.setDate(d.getDate()-i);const s=getDay(d);
      if(Object.keys(s.exLog).some(k=>{const l=s.exLog[k];return l?.sets?.some(x=>x.done)}))break;days++}
    if(days>=4&&days<7)out.push({t:'warn',i:'🏋️',m:`${days} dias sin gym. Ve aunque sea 30 min!`});
    else if(days>=7)out.push({t:'danger',i:'🚨',m:`${days} dias sin entrenar! Ve HOY.`});
    return out;
  },
  waterCheck(){
    const out=[];let low=0;
    for(let i=1;i<=7;i++){const d=new Date();d.setDate(d.getDate()-i);if(getDay(d).water<3000)low++}
    if(low>=4)out.push({t:'danger',i:'💧',m:`${low}/7 dias <3L agua. Rinones NECESITAN esa agua!`});
    return out;
  },
  allInsights(){return[...this.bodyAnalysis(),...this.mealCheck(),...this.gymCheck(),...this.waterCheck()]},
  briefing(d=new Date()){
    const dow=d.getDay(),sch=SCHED[dow],b=[];
    const h=d.getHours();b.push(h<12?'Buenos dias':'Buenas '+(h<18?'tardes':'noches'));
    if(sch.g){const r=sch.g==='A'?RUT_A:RUT_B;b.push(`🏋️ ${r.name} (${r.time})`)}
    else b.push(dow===0?'😴 Descanso total':'🧘 Descanso activo');
    if(sch.c===true)b.push('🏃 Cardio 6-7 PM');
    const ms=[];['merienda1','almuerzo','merienda2'].forEach(k=>{const m=getMeal(k,dow);ms.push(`${m.label}: ${m.desc}`)});
    b.push('📦 '+ms.join(' | '));
    if(BATCH[dow])b.push(`🍳 BATCH: ${BATCH[dow].t} (${BATCH[dow].e})`);
    b.push('💧 Meta: 4 litros');
    return b;
  },
  tomorrowPreview(){
    const t=tomorrow(),dow=t.getDay(),sch=SCHED[dow];
    const meals=MEAL_ORDER.map(k=>({key:k,...getMeal(k,dow)}));
    const ex=sch.g?(sch.g==='A'?RUT_A:RUT_B):null;
    const bring=[];
    ['merienda1','merienda2','almuerzo'].forEach(k=>{const m=getMeal(k,dow);bring.push(`${m.label}: ${m.desc}`)});
    return{date:t,dayName:DAY_NAMES[dow],meals,ex,cardio:sch.c,batch:BATCH[dow]||null,bring};
  }
};

// ===== STREAK & GAMIFICATION ENGINE =====
function getDayScore(d=new Date()){
  const st=getDay(d),dow=d.getDay(),sch=SCHED[dow];
  let pts=0,max=0;
  // Meals (40 pts max)
  const mealsDone=Object.values(st.meals).filter(Boolean).length;
  pts+=Math.round(mealsDone/6*40);max+=40;
  // Water (20 pts max)
  const wPct=Math.min(1,st.water/4000);
  pts+=Math.round(wPct*20);max+=20;
  // Gym (25 pts max) - only if scheduled
  if(sch.g){
    const r=sch.g==='A'?RUT_A:RUT_B;
    let exDone=0,exTotal=0;
    r.ex.forEach(e=>{const l=st.exLog[e.id];exTotal+=e.s;if(l?.sets)exDone+=l.sets.filter(x=>x.done).length});
    pts+=Math.round(exDone/Math.max(1,exTotal)*25);max+=25;
  }
  // Cardio (15 pts max) - only if scheduled
  if(sch.c===true){pts+=st.cardioDone?15:0;max+=15}
  return{pts,max,pct:max?Math.round(pts/max*100):0};
}

const Streaks={
  // Calculate current streak (consecutive days with score ≥ 60%)
  getCurrent(){
    let streak=0;
    for(let i=1;i<=365;i++){
      const d=new Date();d.setDate(d.getDate()-i);
      const sc=getDayScore(d);
      if(sc.pct>=60)streak++;else break;
    }
    return streak;
  },
  // Get best streak ever
  getBest(){
    const saved=S.g('bestStreak',0);
    const cur=this.getCurrent();
    if(cur>saved){S.s('bestStreak',cur)}
    return Math.max(saved,cur);
  },
  // Get total XP (sum of all daily scores * 10)
  getXP(){return S.g('totalXP',0)},
  // Add XP for today (called once per day)
  addDailyXP(){
    const today=dk();
    if(S.g('lastXPDay')===today)return;
    // Calculate yesterday's score
    const y=new Date();y.setDate(y.getDate()-1);
    const sc=getDayScore(y);
    const xp=sc.pts*10;
    S.s('totalXP',(S.g('totalXP',0))+xp);
    S.s('lastXPDay',today);
  },
  // Get level from XP
  getLevel(){
    const xp=this.getXP();
    return Math.floor(xp/500)+1;
  },
  // XP progress to next level
  getLevelProgress(){
    const xp=this.getXP();
    const inLevel=xp%500;
    return{current:inLevel,needed:500,pct:Math.round(inLevel/500*100)};
  },
  // Level titles
  getLevelTitle(){
    const lv=this.getLevel();
    if(lv>=20)return'Leyenda';if(lv>=15)return'Master';if(lv>=10)return'Veterano';
    if(lv>=7)return'Guerrero';if(lv>=5)return'Dedicado';if(lv>=3)return'Constante';
    return'Novato';
  },
  // Check achievements/badges
  getBadges(){
    const badges=[];
    const streak=this.getCurrent();
    const best=this.getBest();
    const lv=this.getLevel();
    // Streak badges
    if(streak>=3)badges.push({id:'s3',icon:'🔥',name:'3 dias seguidos',desc:'Racha de 3 dias',tier:'bronze'});
    if(streak>=7)badges.push({id:'s7',icon:'⚡',name:'Semana perfecta',desc:'7 dias sin fallar',tier:'silver'});
    if(streak>=14)badges.push({id:'s14',icon:'💎',name:'2 semanas',desc:'14 dias de disciplina',tier:'gold'});
    if(streak>=30)badges.push({id:'s30',icon:'👑',name:'Mes completo',desc:'30 dias seguidos!',tier:'platinum'});
    if(best>=7&&streak<7)badges.push({id:'b7',icon:'🏅',name:'Ex-guerrero',desc:`Tu mejor racha: ${best} dias`,tier:'bronze'});
    // Level badges
    if(lv>=5)badges.push({id:'l5',icon:'🎖️',name:'Dedicado',desc:'Nivel 5 alcanzado',tier:'silver'});
    if(lv>=10)badges.push({id:'l10',icon:'🏆',name:'Veterano',desc:'Nivel 10 alcanzado',tier:'gold'});
    // Special checks
    let waterDays=0;for(let i=1;i<=7;i++){const d=new Date();d.setDate(d.getDate()-i);if(getDay(d).water>=4000)waterDays++}
    if(waterDays>=7)badges.push({id:'w7',icon:'💧',name:'Hidratado',desc:'7 dias con 4L+',tier:'silver'});
    let gymDays=0;for(let i=1;i<=7;i++){const d=new Date();d.setDate(d.getDate()-i);const s=getDay(d);
      if(Object.keys(s.exLog).some(k=>s.exLog[k]?.sets?.some(x=>x.done)))gymDays++}
    if(gymDays>=5)badges.push({id:'g5',icon:'🏋️',name:'Maquina',desc:'5 dias de gym esta semana',tier:'gold'});
    return badges;
  },
  // Get motivational message based on streak
  getMotivation(){
    const s=this.getCurrent();
    if(s===0)return'Hoy es el dia 1. Empieza tu racha!';
    if(s<3)return`${s} dia${s>1?'s':''} seguido${s>1?'s':''}. No rompas la cadena!`;
    if(s<7)return`${s} dias! Estas construyendo un habito. Sigue asi!`;
    if(s<14)return`${s} dias de racha! Ya eres constante. Brutal!`;
    if(s<30)return`${s} dias! Estas en otro nivel. Eres disciplina pura!`;
    return`${s} DIAS! Eres una leyenda. Nadie te para!`;
  },
  // Weekly scores for chart
  getWeekScores(){
    const scores=[];
    for(let i=6;i>=0;i--){
      const d=new Date();d.setDate(d.getDate()-i);
      const sc=getDayScore(d);
      scores.push({date:dk(d),day:DAY_SHORT[d.getDay()],score:sc.pct,pts:sc.pts});
    }
    return scores;
  }
};

// ===== NOTIFICATIONS =====
const Notif={
  ok:false,
  async init(){if('Notification'in window){if(Notification.permission==='granted')this.ok=true;
    else if(Notification.permission!=='denied'){this.ok=(await Notification.requestPermission())==='granted'}}},
  send(t,b,tag='g'){if(!this.ok)return;try{new Notification(t,{body:b,tag,renotify:true})}catch(e){
    navigator.serviceWorker?.ready?.then(r=>r.showNotification(t,{body:b,tag,renotify:true}))}},
  check(){
    const n=new Date(),h=n.getHours(),m=n.getMinutes(),t=h*60+m,set=getSettings(),st=getDay(),dow=n.getDay(),sch=SCHED[dow];
    const sent=k=>{const sk=`fr_n_${k}_${dk()}`;if(S.g(sk))return true;S.s(sk,true);return false};
    if(set.morning&&t>=360&&t<362&&!sent('am'))this.send('Buenos dias! ☀️',Engine.briefing()[1]);
    if(set.gym&&sch.g&&t>=285&&t<287&&!sent('gym'))this.send('🏋️ Gym en 15 min!','Preparate!');
    if(set.meal){
      if(t>=590&&t<592&&!st.meals.merienda1&&!sent('m1'))this.send('🍌 Merienda 1',getMeal('merienda1',dow).desc);
      if(t>=710&&t<712&&!st.meals.almuerzo&&!sent('al'))this.send('🍽️ Almorzar',getMeal('almuerzo',dow).desc);
      if(t>=980&&t<982&&!st.meals.merienda2&&!sent('m2'))this.send('🍎 Merienda 2',getMeal('merienda2',dow).desc);
      if(t>=1220&&t<1222&&!st.meals.cena&&!sent('ce'))this.send('🌙 Cenar',getMeal('cena',dow).desc);
      if(t>=1285&&t<1287&&!st.meals.fibra&&!sent('fi'))this.send('🥤 Fibra!','No olvides antes de dormir');
    }
    if(set.water)for(let wh=8;wh<=20;wh+=2)if(t>=wh*60&&t<wh*60+2&&st.water<4000&&!sent(`w${wh}`))
      this.send('💧 Agua!',`Llevas ${(st.water/1000).toFixed(1)}L. Faltan ${((4000-st.water)/1000).toFixed(1)}L.`);
    if(set.gym&&sch.c===true&&t>=1065&&t<1067&&!st.cardioDone&&!sent('cd'))this.send('🏃 Cardio!','En 15 min. A quemar grasa!');
    if(set.sleep&&t>=1305&&t<1307&&!sent('sl'))this.send('😴 A dormir','En 15 min en cama. Descanso = quemar grasa.');
  }
};
