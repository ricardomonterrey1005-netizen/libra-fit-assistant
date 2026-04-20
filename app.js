// ================================================================
//  FITRICARDO - APP (UI + Navigation)
// ================================================================

const App={
  idx:0, // current page index
  pages:['Hoy','Comida','Gym','Progreso','Perfil'],
  subTabs:{Comida:'plan',Gym:'rutina',Progreso:'peso'},

  init(){
    Notif.init();
    this.renderAll();
    // Set first page active
    document.querySelectorAll('.page').forEach((p,i)=>p.classList.toggle('active',i===0));
    this.setupSwipe();
    this.setupNav();
    setInterval(()=>Notif.check(),60000);
    Notif.check();
    // v2.0: Onboarding conversacional se dispara desde authUI.showApp.
    // Dejamos aqui el modal de bienvenida solo como fallback ocasional.
    if(!S.g('onb')){
      // Solo mostrar el modal de bienvenida si el onboarding v2 NO va a dispararse
      // (es decir, si ya hay profile.name). En otros casos Onboarding.start() se encarga.
      const p0 = getProfile();
      if(p0.name){
        setTimeout(()=>this.modal('👋 Bienvenido!',`<p>Tu coach personal inteligente.</p><ul><li>Plan de comidas personalizado</li><li>Tracking de ejercicios y pesos</li><li>Alertas y recordatorios a tus horas</li><li>Libra Chat y Coach inteligentes</li></ul><p><b>Instalar:</b> Chrome → Menu → Agregar a pantalla</p>`),400);
        S.s('onb',1);
      }
    }
  },

  // ===== ONBOARDING (first-time setup) =====
  showOnboarding(){
    const p=getProfile(),g=getGoals();
    const body=`<p style="font-size:13px;color:var(--t2);margin-bottom:12px">Cuentame un poco sobre ti para personalizar tu plan.</p>
      <div class="prof-row"><label>Nombre</label><input class="inp-sm" id="ob_name" value="${p.name||''}" placeholder="Tu nombre"></div>
      <div class="prof-row"><label>Edad</label><input type="number" class="inp-sm" id="ob_age" value="${p.age||''}" placeholder="29"></div>
      <div class="prof-row"><label>Genero</label><select class="inp-sm" id="ob_gender">
        <option value="masculino" ${p.gender==='masculino'?'selected':''}>Masculino</option>
        <option value="femenino" ${p.gender==='femenino'?'selected':''}>Femenino</option></select></div>
      <div class="prof-row"><label>Altura (cm)</label><input type="number" class="inp-sm" id="ob_height" value="${p.height||''}" placeholder="175"></div>
      <div class="prof-row"><label>Peso actual (lbs)</label><input type="number" class="inp-sm" id="ob_wStart" value="${p.wStart||''}" placeholder="195"></div>
      <div class="prof-row"><label>Peso meta (lbs)</label><input type="number" class="inp-sm" id="ob_wGoal" value="${p.wGoal||''}" placeholder="175"></div>
      <div class="prof-row"><label>Fecha meta</label><input type="date" class="inp-sm" id="ob_targetDate" value="${g.targetDate||''}"></div>
      <button class="btn-accent" id="obSave" style="width:100%;margin-top:10px">💪 Empezar mi camino</button>`;
    this.modal('👋 Bienvenido a Libra Fit!',body);
    setTimeout(()=>{
      const btn=document.getElementById('obSave');
      if(btn)btn.onclick=()=>{
        const np={...getProfile()};
        np.name=(document.getElementById('ob_name').value||'').trim();
        np.age=+document.getElementById('ob_age').value||null;
        np.gender=document.getElementById('ob_gender').value;
        np.height=+document.getElementById('ob_height').value||null;
        np.wStart=+document.getElementById('ob_wStart').value||null;
        np.wGoal=+document.getElementById('ob_wGoal').value||null;
        if(!np.name){this.toast('Nombre es requerido');return}
        saveProfile(np);
        const gg=getGoals();
        if(np.wStart){gg.startWeight=np.wStart;const ws=getWeights();if(!ws.length)saveWeights([{date:dk(),weight:np.wStart}])}
        if(np.wGoal)gg.targetWeight=np.wGoal;
        const td=document.getElementById('ob_targetDate').value;
        if(td)gg.targetDate=td;
        saveGoals(gg);
        S.s('onb',1);
        this.closeModal();
        this.toast('✅ Perfil guardado!');
        this.renderAll();
      };
    },50);
  },

  // ===== QUICK ADD FOOD =====
  showQuickAddFood(){
    const quick=[
      {k:'arroz',n:'🍚 Arroz'},{k:'pollo',n:'🍗 Pollo'},{k:'huevo',n:'🥚 Huevo'},
      {k:'tortilla',n:'🫓 Tortilla'},{k:'arepa',n:'🫓 Arepa'},{k:'manzana',n:'🍎 Manzana'},
      {k:'platano',n:'🍌 Platano'},{k:'atun',n:'🐟 Atun'},{k:'yogurt',n:'🥛 Yogurt'},
      {k:'almendras',n:'🌰 Almendras'}
    ];
    const body=`<div style="font-size:12px;color:var(--t2);margin-bottom:8px">Busca o elige una comida:</div>
      <div class="search-row"><input class="search-inp" id="qaInp" placeholder="Ej: pizza, helado, carne..." style="flex:1">
        <button class="btn-accent" data-a="qaSearch">Buscar</button></div>
      <div id="qaRes" style="margin-top:8px;max-height:200px;overflow-y:auto"></div>
      <div style="font-size:11px;color:var(--t3);margin:10px 0 6px">Rapidos:</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
        ${quick.map(q=>`<button class="btn-outline" data-a="qaSel" data-k="${q.k}" style="min-height:48px;padding:10px">${q.n}</button>`).join('')}
      </div>`;
    this.modal('➕ Agregar comida',body);
    setTimeout(()=>{
      const inp=document.getElementById('qaInp');
      if(inp){inp.focus();inp.onkeyup=e=>{if(e.key==='Enter')document.querySelector('[data-a=qaSearch]').click()}}
    },50);
  },

  quickAddFood(foodKey){
    const f=FOOD[foodKey];if(!f)return;
    const qtyStr=prompt(`Cuantas porciones de ${f.n}? (${f.c} cal c/u)`, '1');
    if(qtyStr===null)return;
    const qty=parseFloat(qtyStr)||1;
    const cal=Math.round(f.c*qty);
    const st=getDay();
    st.extras=st.extras||[];
    st.extras.push({n:`${qty>1?qty+'x ':''}${f.n}`,c:cal});
    saveDay(st);
    this.closeModal();
    this.toast(`✅ +${cal} cal (${f.n})`);
    this.renderAll();
  },

  // ===== TRAIN NOW (streamlined gym flow) =====
  showTrainNow(){
    const st=getDay();
    const rut=(typeof getEffectiveRoutine!=='undefined')?getEffectiveRoutine():null;
    if(!rut){this.modal('Descanso','<p>Hoy es descanso. No hay rutina para entrenar.</p>');return}
    let body=`<div style="font-size:12px;color:var(--t2);margin-bottom:8px">${rut.name}</div>`;
    rut.ex.forEach(ex=>{
      const g=EX[ex.id],hist=getExHist(ex.id),last=hist[0];
      const log=st.exLog[ex.id]||{w:last?last.weight:g.dw,sets:Array.from({length:ex.s},()=>({done:false}))};
      const doneCount=log.sets.filter(s=>s.done).length;
      body+=`<div class="c" style="padding:10px;margin-bottom:8px">
        <div style="font-weight:700;font-size:14px">${g.name}</div>
        <div style="font-size:11px;color:var(--t3);margin-bottom:6px">${ex.s}x${ex.r} · ${g.muscle}</div>`;
      if(!g.isTime){
        body+=`<div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
          <button class="btn-outline" data-a="tnAdj" data-e="${ex.id}" data-d="-5" style="min-height:44px;min-width:44px;padding:8px">-5</button>
          <button class="btn-outline" data-a="tnAdj" data-e="${ex.id}" data-d="-2.5" style="min-height:44px;min-width:44px;padding:8px">-2.5</button>
          <div style="flex:1;text-align:center;font-size:18px;font-weight:800;color:var(--accent)">${log.w} lbs</div>
          <button class="btn-outline" data-a="tnAdj" data-e="${ex.id}" data-d="2.5" style="min-height:44px;min-width:44px;padding:8px">+2.5</button>
          <button class="btn-outline" data-a="tnAdj" data-e="${ex.id}" data-d="5" style="min-height:44px;min-width:44px;padding:8px">+5</button>
        </div>`;
      }
      body+=`<div style="display:flex;gap:6px;flex-wrap:wrap">`;
      log.sets.forEach((s,si)=>{
        body+=`<button class="${s.done?'btn-accent':'btn-outline'}" data-a="tnSet" data-e="${ex.id}" data-s="${si}" style="flex:1;min-height:48px;min-width:60px;padding:10px;font-weight:700">${s.done?'✅':'⬜'} S${si+1}</button>`;
      });
      body+=`</div><div style="font-size:11px;color:var(--t3);margin-top:4px">${doneCount}/${log.sets.length} series</div></div>`;
    });
    this.modal('💪 Entrenar ahora',body);
  },

  // ===== NAVIGATION =====
  goTo(i){
    this.idx=i;
    // Display-based navigation (fast, no transform issues)
    document.querySelectorAll('.page').forEach((p,pi)=>p.classList.toggle('active',pi===i));
    document.querySelectorAll('.nav-btn').forEach((b,bi)=>b.classList.toggle('active',bi===i));
    this.renderPage(i);
  },

  setupNav(){
    document.querySelectorAll('.nav-btn').forEach(b=>{
      b.onclick=()=>this.goTo(+b.dataset.idx);
    });
  },

  setupSwipe(){
    const el=document.getElementById('appShell');
    let sx=0,dx=0,swiping=false;
    el.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;dx=0;swiping=true},{passive:true});
    el.addEventListener('touchmove',e=>{if(!swiping)return;dx=e.touches[0].clientX-sx},{passive:true});
    el.addEventListener('touchend',()=>{
      if(!swiping)return;swiping=false;
      if(Math.abs(dx)>60){
        if(dx<0&&this.idx<4)this.goTo(this.idx+1);
        if(dx>0&&this.idx>0)this.goTo(this.idx-1);
      }
    },{passive:true});
  },

  // ===== RENDER =====
  renderAll(){for(let i=0;i<5;i++)this.renderPage(i)},
  renderPage(i){
    const el=document.getElementById('page'+this.pages[i]);
    switch(i){
      case 0:el.innerHTML=this.rHoy();break;
      case 1:el.innerHTML=this.rComida();break;
      case 2:el.innerHTML=this.rGym();break;
      case 3:el.innerHTML=this.rProgreso();break;
      case 4:el.innerHTML=this.rPerfil();break;
    }
    this.bind(el);
  },

  // ===== MODAL / TOAST =====
  modal(t,b,cb){
    document.getElementById('modalTitle').textContent=t;
    const mb=document.getElementById('modalBody');
    mb.innerHTML=b;
    document.getElementById('modalOverlay').classList.add('show');
    document.getElementById('modalOverlay')._cb=cb;
    // Bind modal actions (for custom routine editor etc.)
    try{this.bind(mb)}catch(e){}
  },
  closeModal(){document.getElementById('modalOverlay').classList.remove('show');document.getElementById('modalOverlay')._cb?.()},
  toast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2500)},

  // ===== PAGE 0: HOY =====
  rHoy(){
    const now=new Date(),dow=now.getDay(),st=getDay(),sch=SCHED[dow],g=getGoals(),ins=Engine.allInsights(),br=Engine.briefing();
    // Progress
    let tot=6,dn=Object.values(st.meals).filter(Boolean).length;
    tot++;if(st.water>=4000)dn++;
    const _rutHoy=(typeof getEffectiveRoutine!=='undefined')?getEffectiveRoutine():(sch.g?(sch.g==='A'?RUT_A:RUT_B):null);
    if(_rutHoy){_rutHoy.ex.forEach(e=>{tot+=e.s;const l=st.exLog[e.id];if(l?.sets)dn+=l.sets.filter(x=>x.done).length})}
    const _cardHoy=(typeof isEffectiveCardioDay!=='undefined')?isEffectiveCardioDay():(sch.c===true);
    if(_cardHoy){tot++;if(st.cardioDone)dn++}
    const pct=tot?Math.round(dn/tot*100):0,circ=226.2,off=circ-circ*pct/100;
    const left=g.targetDate?dBetween(now,pk(g.targetDate)):0;
    // Streak system
    Streaks.addDailyXP();
    const streak=Streaks.getCurrent(),bestStreak=Streaks.getBest();
    const lv=Streaks.getLevel(),lvTitle=Streaks.getLevelTitle(),lvProg=Streaks.getLevelProgress();
    const todayScore=getDayScore();
    const badges=Streaks.getBadges();
    const weekScores=Streaks.getWeekScores();
    // Calories
    const cal=todayCal(st,dow),bud=calBudget(),calPct=Math.min(100,cal/bud.target*100);
    const calCol=cal>bud.max?'var(--red)':cal>bud.target?'var(--yellow)':'var(--green)';
    const p=getProfile();

    let h=`<div class="hdr"><div class="hdr-row"><div><div class="hdr-greet">${br[0]} 👋</div><div class="hdr-name">${p.name||'Atleta'} 💪</div>
      <div class="hdr-date">${DAY_NAMES[dow]} ${now.getDate()} de ${MONTHS[now.getMonth()]}</div></div>
      <div class="streak-badge"><div class="streak-fire">🔥</div><div class="streak-num">${streak}</div><div class="streak-lbl">dias</div></div></div></div>`;

    if(left>0&&g.targetDate){const gd=pk(g.targetDate);h+=`<div class="countdown"><div class="cd-label">META: ${gd.getDate()} DE ${MONTHS[gd.getMonth()].toUpperCase()}</div><div class="cd-num">${left}</div><div class="cd-sub">dias restantes 🎯</div></div>`;}

    // === STREAK & LEVEL SECTION ===
    h+=`<div class="streak-section">
      <div class="streak-row">
        <div class="streak-info">
          <div class="streak-level">Nv.${lv} <span class="streak-title">${lvTitle}</span></div>
          <div class="streak-xp-bar"><div class="streak-xp-fill" style="width:${lvProg.pct}%"></div></div>
          <div class="streak-xp-text">${lvProg.current}/${lvProg.needed} XP</div>
        </div>
        <div class="streak-today">
          <div class="streak-today-pct" style="color:${todayScore.pct>=80?'var(--green)':todayScore.pct>=50?'var(--yellow)':'var(--t3)'}">${todayScore.pct}%</div>
          <div class="streak-today-lbl">hoy</div>
        </div>
      </div>
      <div class="streak-week">${weekScores.map(s=>`<div class="streak-day">
        <div class="streak-day-bar"><div class="streak-day-fill" style="height:${s.score}%;background:${s.score>=80?'var(--green)':s.score>=60?'var(--accent)':s.score>0?'var(--yellow)':'var(--border)'}"></div></div>
        <div class="streak-day-lbl">${s.day}</div>
      </div>`).join('')}</div>
      ${badges.length?`<div class="streak-badges">${badges.slice(0,4).map(b=>`<div class="streak-badge-item badge-${b.tier}" title="${b.desc}"><span>${b.icon}</span></div>`).join('')}</div>`:''}
      <div class="streak-mot">${Streaks.getMotivation()}</div>
    </div>`;

    h+=`<div class="ring-wrap"><div class="ring-c"><svg viewBox="0 0 80 80"><circle class="ring-bg" cx="40" cy="40" r="36" stroke-width="6"/><circle class="ring-fg" cx="40" cy="40" r="36" stroke-width="6" stroke-dasharray="${circ}" stroke-dashoffset="${off}"/></svg><div class="ring-pct">${pct}%</div></div>
      <div class="ring-info"><h3>Progreso de hoy</h3><div class="mini">
      <div class="mini-i"><div class="dot" style="background:var(--accent)"></div>${Object.values(st.meals).filter(Boolean).length}/6 comidas</div>
      <div class="mini-i"><div class="dot" style="background:var(--blue)"></div>${(st.water/1000).toFixed(1)}/4L</div>
      <div class="mini-i"><div class="dot" style="background:var(--green)"></div>${_rutHoy?'Gym':'Descanso'}</div></div></div></div>`;

    // Calories summary + quick add button
    h+=`<div class="sec"><div class="sec-t">🔥 Calorias</div>
      <button class="btn-accent" data-a="quickAdd" style="width:100%;margin-bottom:8px;padding:14px;font-size:14px;font-weight:700">➕ Agregar algo que comi</button>
      <div class="c">
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px">
        <div><span style="font-size:24px;font-weight:800;color:${calCol}">${cal}</span><span style="font-size:12px;color:var(--t3)"> / ${bud.target} cal</span></div>
        <span style="font-size:11px;color:var(--t2)">Quedan: <b style="color:${calCol}">${Math.max(0,bud.target-cal)}</b></span></div>
      <div class="cal-bar"><div class="cal-fill" style="width:${calPct}%;background:${calCol}"></div></div>
      ${(st.extras||[]).length?`<div style="margin-top:6px;font-size:11px;color:var(--t3)">${st.extras.map((e,i)=>`${e.n} (${e.c} cal) <span style="color:var(--red);cursor:pointer" data-a="rmExtra" data-i="${i}">✕</span>`).join(' · ')}</div>`:''}</div></div>`;

    // Macros tracking
    const mac=todayMacros(st,dow),mt=macroTargets();
    const mRow=(label,val,tgt,col,unit)=>{
      const pct=Math.min(100,Math.round(val/Math.max(1,tgt)*100));
      return `<div style="margin-bottom:6px">
        <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:2px">
          <span style="color:var(--t2)">${label}</span>
          <span style="color:var(--t1);font-weight:600">${val}${unit} <span style="color:var(--t3);font-weight:400">/ ${tgt}${unit}</span></span>
        </div>
        <div class="cal-bar" style="height:6px"><div class="cal-fill" style="width:${pct}%;background:${col}"></div></div>
      </div>`;
    };
    h+=`<div class="sec"><div class="sec-t">📊 Macros</div><div class="c">
      ${mRow('🥩 Proteina',mac.p,mt.p,'var(--red)','g')}
      ${mRow('🍞 Carbs',mac.c,mt.c,'var(--yellow)','g')}
      ${mRow('🧈 Grasas',mac.fat,mt.fat,'var(--accent)','g')}
      ${mRow('🌾 Fibra',mac.fib,mt.fib,'var(--green)','g')}
    </div></div>`;

    // Insights
    if(ins.length)h+=`<div class="sec"><div class="sec-t">🧠 Coach</div>${ins.map(w=>`<div class="alert ${w.t==='danger'?'a-danger':w.t==='warn'?'a-warn':w.t==='ok'?'a-ok':'a-info'}"><span class="alert-i">${w.i}</span><span>${w.m}</span></div>`).join('')}</div>`;

    // Briefing
    h+=`<div class="sec"><div class="sec-t" data-a="tog" data-t="brief">📋 Briefing ▾</div><div class="c" id="brief">${br.map(b=>`<div style="padding:2px 0;font-size:12px;color:var(--t2)">${b}</div>`).join('')}</div></div>`;

    // Batch
    if(BATCH[dow]){const bc=BATCH[dow];h+=`<div class="batch"><div class="batch-t">🍳 Batch Cooking</div><div class="batch-d"><b>${bc.t}</b><br>Para: ${bc.p} | ⏱️ ${bc.e}</div></div>`}

    // Quick meals
    h+=`<div class="sec"><div class="sec-t">🍽️ Comidas <span style="font-size:11px;color:var(--t3);font-weight:400;margin-left:auto" data-a="go" data-p="1">Ver todo →</span></div>`;
    // Use custom meals if available, otherwise legacy MEAL_ORDER
    const hoyMeals=UserMeals.hasCustom()
      ? UserMeals.getTodayMeals(dow).map(um=>({key:um.id,...getMealForToday(um.id,dow)}))
      : MEAL_ORDER.map(k=>({key:k,...getMeal(k,dow)}));
    hoyMeals.forEach(m=>{const k=m.key,done=st.meals[k];
      h+=`<div class="c ${done?'done':''}" style="display:flex;justify-content:space-between;align-items:center;gap:8px">
        <div style="flex:1"><div class="meal-time">${m.time} - ${m.label}</div><div class="meal-desc">${m.desc}</div>
        <button class="btn-outline" data-a="swapMeal" data-k="${k}" style="margin-top:4px;padding:4px 8px;font-size:10px;min-height:32px">🔄 Cambiar</button></div>
        <button class="chk ${done?'on':''}" data-a="meal" data-k="${k}">${done?'✓':''}</button></div>`});
    h+=`</div>`;

    // Water quick
    h+=`<div class="w-sec"><div class="w-row"><div style="font-size:14px;font-weight:700">💧 Agua</div><div class="w-amt">${(st.water/1000).toFixed(1)} <span>/ 4L</span></div></div>
      <div class="w-bar"><div class="w-fill" style="width:${Math.min(100,st.water/4000*100)}%"></div></div>
      <div class="w-btns"><button class="w-btn" data-a="water" data-v="500">+500ml</button><button class="w-btn" data-a="water" data-v="1000">+1L</button><button class="w-btn undo" data-a="water" data-v="-250">-</button></div></div>`;

    // Exercise quick
    const _rQuick=(typeof getEffectiveRoutine!=='undefined')?getEffectiveRoutine():(sch.g?(sch.g==='A'?RUT_A:RUT_B):null);
    if(_rQuick){const r=_rQuick;const done=r.ex.filter(e=>{const l=st.exLog[e.id];return l?.sets?.filter(x=>x.done).length>=e.s}).length;
      h+=`<div class="sec"><div class="c" style="text-align:center;cursor:pointer" data-a="go" data-p="2">
        <div style="font-weight:700;color:var(--accent)">${r.name}</div>
        <div style="font-size:22px;margin:6px 0">${done}/${r.ex.length} ejercicios</div>
        <div class="btn-accent" style="display:inline-block;margin-top:4px">Ir al Gym →</div></div></div>`}

    // Reminders
    const _cardQuick=(typeof isEffectiveCardioDay!=='undefined')?isEffectiveCardioDay():(sch.c===true);
    h+=`<div class="rem"><div class="rem-t">📌 Hoy</div>
      <div class="rem-i">💧 4L agua (vital sin vegetales)</div><div class="rem-i">🥤 Fibra antes de dormir</div>
      <div class="rem-i">😴 Cama 10:00 PM</div>${_cardQuick?'<div class="rem-i">🏃 Cardio</div>':''}</div>`;

    return h;
  },

  // ===== PAGE 1: COMIDA =====
  rComida(){
    const sub=this.subTabs.Comida||'plan';
    const dow=new Date().getDay(),st=getDay(),cal=todayCal(st,dow),bud=calBudget();
    const tom=Engine.tomorrowPreview();

    let h=`<div class="hdr"><div class="hdr-name">🍽️ Alimentacion</div></div>
      <div class="tabs"><button class="tab ${sub==='plan'?'on':''}" data-a="subtab" data-p="Comida" data-v="plan">Hoy</button>
      <button class="tab ${sub==='manana'?'on':''}" data-a="subtab" data-p="Comida" data-v="manana">Manana</button>
      <button class="tab ${sub==='buscar'?'on':''}" data-a="subtab" data-p="Comida" data-v="buscar">Buscar</button>
      <button class="tab ${sub==='calorias'?'on':''}" data-a="subtab" data-p="Comida" data-v="calorias">Calorias</button></div>`;

    if(sub==='plan'){
      // Today's meal plan
      const calCol=cal>bud.max?'var(--red)':cal>bud.target?'var(--yellow)':'var(--green)';
      h+=`<div class="sec"><div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px">
        <span style="font-size:11px;color:var(--t2)">Hoy: <b style="color:${calCol}">${cal}</b>/${bud.target} cal</span>
        <span style="font-size:11px;color:var(--t2)">${Object.values(st.meals).filter(Boolean).length}/6 ✓</span></div>`;
      const planMeals=UserMeals.hasCustom()
        ? UserMeals.getTodayMeals(dow).map(um=>({key:um.id,...getMealForToday(um.id,dow)}))
        : MEAL_ORDER.map(k=>({key:k,...getMeal(k,dow)}));
      planMeals.forEach(m=>{const k=m.key,done=st.meals[k];
        const macStr=(m.p!==undefined)?` · 🥩 ${m.p||0}g · 🍞 ${m.cb||0}g · 🧈 ${m.f||0}g`:'';
        h+=`<div class="c ${done?'done':''}">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
            <div style="flex:1"><div class="meal-time">${m.time} - ${m.label}</div><div class="meal-desc">${m.desc}</div>
              <div class="meal-meta">~${m.cal} cal${macStr}${m.prep?` · ${m.prep} min prep`:''}</div></div>
            <button class="chk ${done?'on':''}" data-a="meal" data-k="${k}">${done?'✓':''}</button></div>
          <div style="display:flex;gap:6px;margin-top:6px">
            <button class="btn-outline" data-a="swapMeal" data-k="${k}" style="flex:1;padding:6px;font-size:11px;min-height:36px">🔄 Cambiar</button>
            ${m.alts&&m.alts.length?`<button class="btn-outline" data-a="tog" data-t="alt_${k}" style="flex:1;padding:6px;font-size:11px;min-height:36px">💡 Alternativas</button>`:''}
          </div>
          ${m.alts&&m.alts.length?`<div class="alts hide" id="alt_${k}">${m.alts.map(a=>`→ ${a}`).join('<br>')}</div>`:''}</div>`});
      h+=`</div>`;
      if(BATCH[dow])h+=`<div class="batch"><div class="batch-t">🍳 Batch Cooking</div><div class="batch-d">${BATCH[dow].t}<br>Para: ${BATCH[dow].p}</div></div>`;
    }

    if(sub==='manana'){
      h+=`<div class="sec"><div class="sec-t">${tom.dayName} - Que preparar</div>
        <div class="c" style="background:var(--accent-bg)"><div style="font-weight:600;color:var(--accent);margin-bottom:6px">🎒 Lleva preparado:</div>
        ${tom.bring.map(b=>`<div style="font-size:12px;color:var(--t2);padding:2px 0">📦 ${b}</div>`).join('')}
        ${tom.ex?`<div style="font-size:12px;color:var(--t2);padding:2px 0;margin-top:4px">👟 Ropa de gym (${tom.ex.name})</div>`:''}</div></div>`;
      h+=`<div class="sec"><div class="sec-t">Comidas de ${tom.dayName}</div>`;
      tom.meals.forEach(m=>{h+=`<div class="c"><div class="meal-time">${m.time} - ${m.label}</div><div class="meal-desc">${m.desc}</div>
        <div class="meal-meta">~${m.cal} cal${m.prep?` · ${m.prep} min prep`:' · Listo'}</div></div>`});
      h+=`</div>`;
      if(tom.batch)h+=`<div class="batch"><div class="batch-t">🍳 Batch Cooking manana</div><div class="batch-d">${tom.batch.t}</div></div>`;
    }

    if(sub==='buscar'){
      h+=`<div class="sec"><div class="sec-t">🔍 Puedo Comer...?</div>
        <div class="c"><div style="font-size:11px;color:var(--t2);margin-bottom:6px">Busca cualquier comida. Llevas <b>${cal}</b> de ${bud.target} cal hoy.</div>
        <div class="search-row"><input class="search-inp" id="foodQ" placeholder="pizza, helado, cerveza..." onkeyup="if(event.key==='Enter')document.querySelector('[data-a=search]').click()">
        <button class="btn-accent" data-a="search">Buscar</button></div>
        <div id="foodR"></div></div></div>`;
    }

    if(sub==='calorias'){
      const calCol=cal>bud.max?'var(--red)':cal>bud.target?'var(--yellow)':'var(--green)';
      h+=`<div class="sec"><div class="sec-t">🔥 Resumen Calorico</div>
        <div class="c"><div style="text-align:center;margin-bottom:10px">
          <div style="font-size:36px;font-weight:900;color:${calCol}">${cal}</div>
          <div style="font-size:12px;color:var(--t3)">de ${bud.target} cal (limite: ${bud.max})</div></div>
        <div class="cal-bar" style="margin-bottom:12px"><div class="cal-fill" style="width:${Math.min(100,cal/bud.target*100)}%;background:${calCol}"></div></div>
        <div style="font-size:12px;font-weight:600;margin-bottom:6px">Desglose:</div>`;
      const calMeals=UserMeals.hasCustom()
        ? UserMeals.getTodayMeals(dow).map(um=>({key:um.id,...getMealForToday(um.id,dow)}))
        : MEAL_ORDER.map(k=>({key:k,...getMeal(k,dow)}));
      calMeals.forEach(m=>{const k=m.key,done=st.meals[k];
        h+=`<div style="display:flex;justify-content:space-between;font-size:12px;padding:3px 0;color:${done?'var(--t1)':'var(--t3)'}">
          <span>${done?'✅':'☐'} ${m.label}</span><span>${m.cal} cal</span></div>`});
      if((st.extras||[]).length){h+=`<div style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px;font-size:12px;font-weight:600">Extras:</div>`;
        st.extras.forEach((e,i)=>{h+=`<div style="display:flex;justify-content:space-between;font-size:12px;padding:2px 0"><span>${e.n}</span><span>${e.c} cal <span style="color:var(--red);cursor:pointer" data-a="rmExtra" data-i="${i}">✕</span></span></div>`})}
      h+=`<div style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px;display:flex;justify-content:space-between;font-weight:700;font-size:13px"><span>Restante</span><span style="color:${calCol}">${Math.max(0,bud.target-cal)} cal</span></div></div></div>`;
    }

    return h;
  },

  // ===== PAGE 2: GYM =====
  rGym(){
    const sub=this.subTabs.Gym||'rutina';
    const dow=new Date().getDay(),sch=SCHED[dow],st=getDay();
    const rutHoy=(typeof getEffectiveRoutine!=='undefined')?getEffectiveRoutine():(sch.g?(sch.g==='A'?RUT_A:RUT_B):null);
    const cardHoy=(typeof isEffectiveCardioDay!=='undefined')?isEffectiveCardioDay():(sch.c===true);

    let h=`<div class="hdr"><div class="hdr-name">🏋️ Gym</div><div class="hdr-date">${DAY_NAMES[dow]} - ${rutHoy?rutHoy.name:'Descanso'}</div></div>
      <div class="tabs"><button class="tab ${sub==='rutina'?'on':''}" data-a="subtab" data-p="Gym" data-v="rutina">Rutina</button>
      <button class="tab ${sub==='cardio'?'on':''}" data-a="subtab" data-p="Gym" data-v="cardio">Cardio</button>
      <button class="tab ${sub==='config'?'on':''}" data-a="subtab" data-p="Gym" data-v="config">⚙️ Configurar</button>
      <button class="tab ${sub==='manana'?'on':''}" data-a="subtab" data-p="Gym" data-v="manana">Manana</button></div>`;

    if(sub==='rutina'){
      if(rutHoy){
        const rut=rutHoy;
        h+=`<div class="sec"><button class="btn-accent" data-a="trainNow" style="width:100%;padding:16px;font-size:16px;font-weight:800;margin-bottom:10px;min-height:56px">💪 Entrenar ahora</button>
          <div style="font-size:11px;color:var(--t3);margin-bottom:8px">⏰ ${rut.time||''} | descanso variable | 📵 Sin celular</div>`;
        rut.ex.forEach((ex,idx)=>{
          const g=EX[ex.id],hist=getExHist(ex.id),last=hist[0]||null,pr=hist.length?Math.max(...hist.map(x=>x.weight)):0;
          const log=st.exLog[ex.id]||{w:last?last.weight:g.dw,sets:Array.from({length:ex.s},()=>({done:false}))};
          const allDone=log.sets.every(s=>s.done);
          h+=`<div class="c ex-card ${allDone?'done':''}">
            <div class="ex-hdr" data-a="tog" data-t="eg_${ex.id}">
              <div class="ex-num">${idx+1}</div><div style="flex:1"><div class="ex-name">${g.name}</div><div class="ex-muscle">${g.muscle}</div>
              <div class="ex-det">${ex.s}x${ex.r} | ${ex.rest}s</div></div><span class="ex-arrow">▼</span></div>
            <div class="ex-guide hide" id="eg_${ex.id}">
              <div class="g-lbl orange">Como hacerlo:</div><div class="g-txt">${g.how}</div>
              <div class="g-lbl green">Tip:</div><div class="g-txt">${g.tip}</div>
              <div class="g-lbl red">Errores comunes:</div><div class="g-txt">${g.errors.split('|').map(e=>'• '+e.trim()).join('\n')}</div>
              <div class="g-lbl blue">Musculos:</div><div class="g-txt">${g.muscles}</div>
              <div class="g-lbl purple">Respiracion:</div><div class="g-txt">${g.breath}</div>
              <div style="font-size:10px;color:var(--t3);margin-top:6px">🏢 Maquina SmartFit: ${g.machine}</div></div>
            ${!g.isTime?`<div class="ex-wt"><div class="wt-lbl">Peso: ${last?`<span class="wt-sub">Ultimo: ${last.weight}lbs (${fmtDate(last.date)})</span>`:`<span class="wt-sub">Sugerido: ${g.dw}lbs</span>`} ${pr?`<span class="wt-pr">🏆 PR: ${pr}lbs</span>`:''}</div>
              <div class="wt-grp"><button class="wt-adj" data-a="adjW" data-e="${ex.id}" data-d="-5">-5</button><button class="wt-adj" data-a="adjW" data-e="${ex.id}" data-d="-2.5">-2.5</button>
              <input type="number" class="wt-inp" id="w_${ex.id}" value="${log.w}" step="2.5" data-a="chgW" data-e="${ex.id}">
              <button class="wt-adj" data-a="adjW" data-e="${ex.id}" data-d="2.5">+2.5</button><button class="wt-adj" data-a="adjW" data-e="${ex.id}" data-d="5">+5</button></div></div>
              <div id="ww_${ex.id}"></div>`:``}
            <div class="sets-row">${log.sets.map((s,si)=>`<button class="set-btn ${s.done?'on':''}" data-a="set" data-e="${ex.id}" data-s="${si}"><div class="set-n">S${si+1}</div><div class="set-r">${ex.r}</div></button>`).join('')}</div></div>`;
        });
        h+=`</div>`;
      }else{
        h+=`<div class="sec"><div class="c" style="text-align:center;padding:30px"><div style="font-size:44px">${dow===0?'😴':'🧘'}</div>
          <div style="font-size:17px;font-weight:700;margin-top:8px">${dow===0?'Descanso Total':'Descanso Activo'}</div>
          <div style="font-size:13px;color:var(--t2);margin-top:4px">${dow===0?'Tu cuerpo crece descansando!':'Cardio suave si quieres.'}</div></div></div>`;
      }
    }

    if(sub==='config'){
      h+=this.rGymConfig();
    }

    if(sub==='cardio'){
      h+=`<div class="sec"><div class="sec-t">Cardio ${sch.c==='opt'?'(Opcional)':''}</div>`;
      if(cardHoy||sch.c==='opt'){
        CARDIO.forEach(c=>{const sel=st.cardioId===c.id;
          h+=`<div class="cardio-opt ${sel?'sel':''}" data-a="cardio" data-id="${c.id}">
            <div style="font-size:28px">${c.icon}</div><div style="flex:1"><div style="font-weight:600">${c.name}</div>
            <div style="font-size:11px;color:var(--accent)">${c.sub}</div><div style="font-size:11px;color:var(--t2)">${c.dur} - ${c.det}</div>
            <div style="font-size:10px;color:var(--green)">🔥 ~${c.cal} cal</div></div></div>`});
        if(st.cardioId)h+=`<button class="btn-accent ${st.cardioDone?'btn-green':''}" data-a="cardioDone" style="width:100%;margin-top:6px">${st.cardioDone?'✅ Completado!':'Marcar Completado'}</button>`;
      }else h+=`<div class="c" style="text-align:center;color:var(--t3);padding:20px">😴 Descanso de cardio hoy</div>`;
      h+=`</div>`;
    }

    if(sub==='manana'){
      const tp=Engine.tomorrowPreview();
      h+=`<div class="sec"><div class="sec-t">${tp.dayName}</div>`;
      if(tp.ex){
        h+=`<div class="c"><div style="font-weight:700;color:var(--accent);margin-bottom:8px">${tp.ex.name} (${tp.ex.time})</div>`;
        tp.ex.ex.forEach(e=>{const g=EX[e.id],hist=getExHist(e.id),lw=hist.length?hist[0].weight:g.dw;
          h+=`<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid rgba(255,255,255,.03)">
            <span style="font-size:12px">${g.name}</span><span style="font-size:11px;color:var(--t2)">${e.s}x${e.r} · ${lw}lbs</span></div>`});
        h+=`</div>`;
      }else h+=`<div class="c" style="text-align:center;padding:20px;font-size:14px">${tp.date.getDay()===0?'😴 Descanso Total':'🧘 Descanso Activo'}</div>`;
      if(tp.cardio)h+=`<div style="font-size:12px;color:var(--t2);margin-top:6px">🏃 Cardio ${tp.cardio==='opt'?'opcional':'6-7 PM'}</div>`;
      h+=`</div>`;
    }

    return h;
  },

  // ===== GYM: Configuracion de rutinas personalizadas =====
  rGymConfig(){
    if(typeof UserRoutines==='undefined')return '<div class="sec"><div class="c">Cargando...</div></div>';
    const routines=UserRoutines.getUserRoutines();
    const sched=UserRoutines.getWeekSchedule();
    const cardio=UserRoutines.getCardioConfig();
    const cardioTypes=[
      {k:'caminadora',n:'🚶 Caminadora'},{k:'escaladora',n:'🪜 Escaladora'},
      {k:'caminar',n:'🚶‍♂️ Caminar afuera'},{k:'trotar',n:'🏃 Trotar'},
      {k:'eliptica',n:'🏋️ Eliptica'},{k:'bicicleta',n:'🚴 Bicicleta'}
    ];
    let h=`<div class="sec"><div class="sec-t">⚙️ Mis Rutinas</div>
      <div style="font-size:11px;color:var(--t3);margin-bottom:8px">Personaliza tus rutinas y que dias hacerlas.</div>`;

    routines.forEach((r,i)=>{
      h+=`<div class="c" style="padding:10px;margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
          <div style="font-weight:700;color:var(--accent);flex:1">${r.name}</div>
          <button class="btn-outline" style="padding:6px 10px;font-size:11px;min-height:36px" data-a="editRut" data-id="${r.id}">✏️ Editar</button>
          <button class="btn-danger" style="padding:6px 10px;font-size:11px;min-height:36px;margin-left:4px" data-a="delRut" data-id="${r.id}">🗑️</button>
        </div>
        <div style="font-size:11px;color:var(--t2)">${r.exercises.length} ejercicios</div>
      </div>`;
    });

    h+=`<button class="btn-accent" style="width:100%;min-height:48px" data-a="newRut">+ Nueva rutina</button></div>`;

    // Horario semanal
    h+=`<div class="sec"><div class="sec-t">📅 Horario Semanal</div><div class="c" style="padding:10px">`;
    for(let d=0;d<7;d++){
      const cur=sched[d]||'';
      h+=`<div class="prof-row" style="align-items:center">
        <label style="min-width:80px">${DAY_NAMES[d]}</label>
        <select class="inp-sm" data-a="schedDay" data-d="${d}">
          <option value="">— Descanso —</option>
          ${routines.map(r=>`<option value="${r.id}" ${cur===r.id?'selected':''}>${r.name}</option>`).join('')}
        </select>
      </div>`;
    }
    h+=`</div></div>`;

    // Cardio
    h+=`<div class="sec"><div class="sec-t">🏃 Cardio</div><div class="c" style="padding:10px">
      <div style="font-size:11px;color:var(--t2);margin-bottom:6px">Dias de cardio:</div>
      <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px">
        ${DAY_SHORT.map((ds,i)=>{
          const on=cardio.days&&cardio.days.includes(i);
          return `<button class="${on?'btn-accent':'btn-outline'}" data-a="togCardio" data-d="${i}" style="flex:1;min-height:44px;min-width:44px;padding:6px">${ds}</button>`;
        }).join('')}
      </div>
      <div class="prof-row"><label>Tipo</label>
        <select class="inp-sm" data-a="cardioType">
          ${cardioTypes.map(ct=>`<option value="${ct.k}" ${cardio.type===ct.k?'selected':''}>${ct.n}</option>`).join('')}
        </select>
      </div>
      <div class="prof-row"><label>Duracion (min)</label>
        <input type="number" class="inp-sm" id="cardioDur" value="${cardio.duration||20}" min="5" max="180" data-a="cardioDur">
      </div>
    </div></div>`;

    // Reset
    h+=`<div class="sec"><div class="c">
      <button class="btn-outline" style="width:100%;min-height:48px" data-a="resetRut">🔄 Restaurar plantillas por defecto</button>
    </div></div>`;

    return h;
  },

  // ===== EDITOR DE RUTINA =====
  showRoutineEditor(routineId){
    if(typeof UserRoutines==='undefined')return;
    const routines=UserRoutines.getUserRoutines();
    let r=routines.find(x=>x.id===routineId);
    const isNew=!r;
    if(isNew){
      r={id:UserRoutines.newRoutineId(),name:'Nueva rutina',exercises:[]};
    }
    // Keep working copy in module state
    this._editingRoutine=JSON.parse(JSON.stringify(r));
    this._renderRoutineEditor();
  },

  _renderRoutineEditor(){
    const r=this._editingRoutine;
    if(!r)return;
    const groups=UserRoutines.getExerciseOptions();
    const allOpts=Object.entries(groups).map(([g,items])=>
      `<optgroup label="${g}">${items.map(it=>`<option value="${it.key}">${it.name} (${it.muscle})</option>`).join('')}</optgroup>`
    ).join('');

    let body=`<div class="prof-row"><label>Nombre</label>
      <input class="inp-sm" id="reName" value="${(r.name||'').replace(/"/g,'&quot;')}"></div>
      <div style="font-size:12px;color:var(--t2);margin:10px 0 6px;font-weight:600">Ejercicios:</div>
      <div id="reList" style="max-height:320px;overflow-y:auto;margin-bottom:8px">`;

    r.exercises.forEach((ex,i)=>{
      const exInfo=EX[ex.exKey]||{name:ex.exKey,muscle:''};
      body+=`<div class="c" style="padding:8px;margin-bottom:6px">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px">
          <div style="flex:1;font-size:12px"><b>${exInfo.name}</b><br><span style="color:var(--t3);font-size:10px">${exInfo.muscle}</span></div>
          <button class="btn-danger" style="padding:4px 10px;font-size:11px;min-height:36px" data-a="reRm" data-i="${i}">✕</button>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px">
          <div><label style="font-size:10px;color:var(--t3)">Series</label>
            <input type="number" class="inp-sm" min="1" max="10" value="${ex.sets}" data-a="reField" data-i="${i}" data-f="sets"></div>
          <div><label style="font-size:10px;color:var(--t3)">Reps</label>
            <input class="inp-sm" value="${ex.reps||''}" data-a="reField" data-i="${i}" data-f="reps"></div>
          <div><label style="font-size:10px;color:var(--t3)">Desc (s)</label>
            <input type="number" class="inp-sm" min="0" max="600" value="${ex.rest||60}" data-a="reField" data-i="${i}" data-f="rest"></div>
        </div>
      </div>`;
    });

    body+=`</div>
      <div style="display:flex;gap:4px;margin-bottom:10px">
        <select class="inp-sm" id="reAddSel" style="flex:1">${allOpts}</select>
        <button class="btn-outline" style="min-height:44px;padding:8px 12px" data-a="reAdd">+ Agregar</button>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn-outline" style="flex:1;min-height:48px" data-a="reCancel">Cancelar</button>
        <button class="btn-accent" style="flex:1;min-height:48px" data-a="reSave">💾 Guardar</button>
      </div>`;

    this.modal('✏️ Editar rutina',body);
  },

  // ===== PAGE 3: PROGRESO + SUPLEMENTOS =====
  rProgreso(){
    const sub=this.subTabs.Progreso||'peso';
    const w=getWeights(),g=getGoals(),an=Engine.bodyAnalysis(),mySups=getMySups();

    let h=`<div class="hdr"><div class="hdr-name">📊 Progreso</div></div>
      <div class="tabs">
        <button class="tab ${sub==='peso'?'on':''}" data-a="subtab" data-p="Progreso" data-v="peso">Peso</button>
        <button class="tab ${sub==='tendencias'?'on':''}" data-a="subtab" data-p="Progreso" data-v="tendencias">Tendencias</button>
        <button class="tab ${sub==='suple'?'on':''}" data-a="subtab" data-p="Progreso" data-v="suple">Suplementos</button>
      </div>`;

    // ===== TAB TENDENCIAS (nuevo v2.0) =====
    if(sub==='tendencias'){
      const metric = this._progresoMetric || 'score';
      const period = this._progresoPeriod || 'week';
      const meta = (typeof Tracking !== 'undefined' && Tracking.metrics[metric]) || {label:metric, unit:''};

      // Selector metrica
      const metrics = [
        ['score','Puntuacion'], ['cal','Calorias'], ['protein','Proteina'],
        ['carbs','Carbs'], ['fat','Grasas'], ['fiber','Fibra'], ['water','Agua']
      ];
      h += `<div class="sec"><div class="sec-t">📊 Tendencias</div>`;
      h += `<div class="track-selectors">
        <div class="track-sel-row">
          ${metrics.map(([k,l]) => `<button class="track-chip ${metric===k?'on':''}" data-a="trackMetric" data-v="${k}">${l}</button>`).join('')}
        </div>
        <div class="track-sel-row" style="margin-top:8px">
          <button class="track-chip ${period==='week'?'on':''}" data-a="trackPeriod" data-v="week">Semana</button>
          <button class="track-chip ${period==='month'?'on':''}" data-a="trackPeriod" data-v="month">Mes</button>
          <button class="track-chip ${period==='year'?'on':''}" data-a="trackPeriod" data-v="year">Ano</button>
        </div>
      </div>`;

      h += `<div class="c" style="padding:12px">
        <div class="track-title">${meta.label} · ${period==='week'?'Ultimos 7 dias':period==='month'?'Este mes':'Este ano'}</div>`;
      if(typeof Tracking !== 'undefined'){
        h += Tracking.renderTracking(metric, period);
      } else {
        h += `<div style="color:var(--t3);padding:20px;text-align:center">Tracking no disponible</div>`;
      }
      h += `</div></div>`;
    }

    if(sub==='peso'){
      h+=`<div class="sec"><div class="c"><div class="search-row"><input type="number" class="search-inp" id="bwInp" placeholder="Peso en libras..." step="0.1">
        <button class="btn-accent" data-a="logW">Guardar</button></div></div></div>`;
      h+=`<div class="stats" style="padding:0 14px">
        <div class="stat"><div class="stat-v" style="color:var(--accent)">${w.length?w[0].weight:'--'}</div><div class="stat-l">Actual (lbs)</div></div>
        <div class="stat"><div class="stat-v" style="color:${w.length>1?(w[0].weight<=w[w.length-1].weight?'var(--green)':'var(--red)'):'var(--t3)'}">
          ${w.length>1?((w[0].weight-w[w.length-1].weight>0?'+':'')+(w[0].weight-w[w.length-1].weight).toFixed(1)):'--'}</div><div class="stat-l">Cambio total</div></div></div>`;
      // Goals
      h+=`<div class="sec"><div class="sec-t">🎯 Meta</div><div class="c">
        <div class="prof-row"><label>Peso meta (lbs)</label><input type="number" class="inp-sm" id="gW" value="${g.targetWeight||''}" placeholder="175" data-a="goal" data-f="targetWeight"></div>
        <div class="prof-row"><label>Fecha meta</label><input type="date" class="inp-sm" id="gD" value="${g.targetDate||''}" data-a="goal" data-f="targetDate"></div>
        <div class="prof-row"><label>Peso inicial</label><input type="number" class="inp-sm" id="gS" value="${g.startWeight||''}" placeholder="195" data-a="goal" data-f="startWeight"></div></div></div>`;
      // Analysis
      if(an.length)h+=`<div class="sec"><div class="sec-t">🧠 Analisis</div>${an.map(a=>`<div class="alert ${a.t==='ok'?'a-ok':a.t==='warn'?'a-warn':'a-info'}"><span class="alert-i">${a.i}</span><span>${a.m}</span></div>`).join('')}</div>`;
      // Chart SVG (nuevo v2.0)
      if(w.length>=2 && typeof Tracking !== 'undefined'){
        const period = this._pesoPeriod || 'month';
        h += `<div class="sec"><div class="sec-t">📈 Tendencia de peso</div>
          <div class="track-sel-row" style="padding:0 12px 8px">
            <button class="track-chip ${period==='week'?'on':''}" data-a="pesoP" data-v="week">Semana</button>
            <button class="track-chip ${period==='month'?'on':''}" data-a="pesoP" data-v="month">Mes</button>
            <button class="track-chip ${period==='year'?'on':''}" data-a="pesoP" data-v="year">Ano</button>
          </div>
          <div class="c" style="padding:12px">${Tracking.renderTracking('weight', period)}</div></div>`;
      }
      // History
      if(w.length)h+=`<div class="sec"><div class="sec-t">📋 Historial</div>${w.slice(0,20).map((x,i)=>{const df=i<w.length-1?x.weight-w[i+1].weight:0;
        return`<div class="c" style="padding:8px 12px;display:flex;justify-content:space-between"><span style="font-size:12px;color:var(--t2)">${fmtDate(x.date)}</span><div>
          <span style="font-weight:700">${x.weight}</span>${df?`<span style="font-size:11px;color:${df<0?'var(--green)':'var(--red)'};margin-left:6px">${df>0?'+':''}${df.toFixed(1)}</span>`:''}</div></div>`}).join('')}</div>`;
    }


    if(sub==='suple'){
      const SDB = window.SupplementsDB;
      h += `<div class="alert a-warn" style="margin:10px 14px"><span class="alert-i">⚠️</span>
        <span style="font-size:11px"><b>AVISO:</b> Info educativa. NO es receta medica. Consulta tu medico.</span></div>`;

      // Mis suplementos activos
      h += `<div class="sec"><div class="sec-t">💊 Mis Suplementos</div>`;
      if(mySups.length && SDB){
        mySups.forEach(id => {
          const s = SDB.getSupplement(id);
          if(!s) return;
          h += `<div class="c" style="padding:10px 12px">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <div><b style="font-size:13px">${s.name}</b>
                <span style="font-size:10px;color:var(--t3);margin-left:6px">Evidencia ${s.evidenceTier}</span></div>
              <button class="btn-danger" style="padding:4px 10px;font-size:10px" data-a="rmSup" data-id="${s.id}">Quitar</button>
            </div>
            <div style="font-size:11px;color:var(--t2);margin-top:6px">${s.mainBenefit}</div>
            <div style="font-size:11px;color:var(--t3);margin-top:4px">Dosis: ${s.dose.daily || s.dose.maintenance || '-'}</div>
          </div>`;
        });

        // Check peligros
        const warnings = SDB.checkCombinations(mySups);
        if(warnings.length){
          h += `<div class="c" style="padding:10px 12px">`;
          warnings.forEach(w => {
            const clr = w.severity === 'high' ? 'var(--red)' : w.severity === 'medium' ? 'var(--yellow)' : 'var(--t3)';
            h += `<div style="font-size:11px;color:${clr};margin:4px 0">⚠️ ${w.message}</div>`;
          });
          h += `</div>`;
        }
      } else {
        h += `<div class="c" style="text-align:center;color:var(--t3);padding:16px">
          Sin suplementos activos. Agregalos desde el catalogo abajo.</div>`;
      }
      h += `</div>`;

      // Catalogo (filtrado por meta si hay)
      const goalType = g.goalType;
      h += `<div class="sec"><div class="sec-t">📦 Catalogo ${goalType ? '(recomendados para tu meta)' : ''}</div>`;
      if(SDB){
        const list = goalType ? SDB.byGoal(goalType) : SDB.SUPPLEMENTS;
        const displayed = goalType ? list : list.filter(s => ['A','B+','B'].includes(s.evidenceTier));

        displayed.slice(0, 20).forEach(s => {
          const active = mySups.includes(s.id);
          const tierColor = s.evidenceTier === 'A' ? 'var(--green)'
                         : s.evidenceTier?.startsWith('B') ? 'var(--yellow)'
                         : 'var(--t3)';
          h += `<div class="c" style="padding:10px 12px">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <div style="flex:1">
                <b style="font-size:13px">${s.name}</b>
                <span style="font-size:10px;color:${tierColor};margin-left:6px">${s.evidenceTier}</span>
              </div>
              ${active
                ? `<span style="font-size:11px;color:var(--green)">✓ Activo</span>`
                : `<button class="btn-accent" style="padding:4px 10px;font-size:11px" data-a="addSup" data-id="${s.id}">+ Agregar</button>`}
            </div>
            <div style="font-size:11px;color:var(--t2);margin-top:4px">${s.mainBenefit}</div>
          </div>`;
        });
      }
      h += `</div>`;
      h += `<div class="rem" style="margin:10px 14px">
        <div class="rem-t">📋 Recordatorio</div>
        <div class="rem-i">NO es receta medica. Consulta profesional.</div>
        <div class="rem-i">Suplementos complementan, no reemplazan alimentacion.</div>
      </div>`;
    }

    return h;
  },

  // ===== PAGE 4: PERFIL =====
  rPerfil(){
    const p=getProfile(),set=getSettings();
    let h=`<div class="hdr"><div class="hdr-name">👤 Perfil</div><div class="hdr-date">Tu informacion y preferencias</div></div>`;

    h+=`<div class="sec"><div class="sec-t">📝 Datos Personales</div><div class="c">
      <div class="prof-row"><label>Nombre</label><input class="inp-sm" id="pf_name" value="${p.name||''}"></div>
      <div class="prof-row"><label>Edad</label><input type="number" class="inp-sm" id="pf_age" value="${p.age||''}"></div>
      <div class="prof-row"><label>Genero</label><select class="inp-sm" id="pf_gender"><option value="masculino" ${p.gender==='masculino'?'selected':''}>Masculino</option><option value="femenino" ${p.gender==='femenino'?'selected':''}>Femenino</option></select></div>
      <div class="prof-row"><label>Altura (cm)</label><input type="number" class="inp-sm" id="pf_height" value="${p.height||''}" placeholder="175"></div>
      <div class="prof-row"><label>Peso inicial (lbs)</label><input type="number" class="inp-sm" id="pf_wStart" value="${p.wStart||''}" placeholder="195"></div>
      <div class="prof-row"><label>Peso meta (lbs)</label><input type="number" class="inp-sm" id="pf_wGoal" value="${p.wGoal||''}" placeholder="175"></div>
      <div class="prof-row"><label>Actividad</label><select class="inp-sm" id="pf_activity">
        <option value="sedentario" ${p.activity==='sedentario'?'selected':''}>Sedentario</option>
        <option value="ligero" ${p.activity==='ligero'?'selected':''}>Ligero</option>
        <option value="moderado" ${p.activity==='moderado'?'selected':''}>Moderado (gym)</option>
        <option value="activo" ${p.activity==='activo'?'selected':''}>Muy activo</option></select></div></div></div>`;

    h+=`<div class="sec"><div class="sec-t">📋 Body Scan</div><div class="c">
      <div style="font-size:11px;color:var(--t2);margin-bottom:6px">Datos de InBody, DEXA o similar.</div>
      <div class="prof-row"><label>% Grasa</label><input type="number" step="0.1" class="inp-sm" id="pf_bodyFat" value="${p.bodyFat||''}" placeholder="25.0"></div>
      <div class="prof-row"><label>Masa muscular (lbs)</label><input type="number" class="inp-sm" id="pf_muscleMass" value="${p.muscleMass||''}" placeholder="130"></div>
      <div class="prof-row"><label>Grasa visceral</label><input type="number" class="inp-sm" id="pf_visceralFat" value="${p.visceralFat||''}" placeholder="8"></div>
      <div class="prof-row"><label>Edad metabolica</label><input type="number" class="inp-sm" id="pf_metaAge" value="${p.metaAge||''}" placeholder="32"></div>
      <div class="prof-row"><label>BMR (cal/dia)</label><input type="number" class="inp-sm" id="pf_bmr" value="${p.bmr||''}" placeholder="1750"></div>
      <div class="prof-row"><label>Notas</label><textarea class="inp-sm" id="pf_notes" placeholder="Observaciones...">${p.notes||''}</textarea></div>
      <button class="btn-accent" data-a="savePf" style="width:100%;margin-top:8px">💾 Guardar</button></div></div>`;

    // Body scan analysis
    if(p.bodyFat||p.visceralFat||p.metaAge){
      h+=`<div class="sec"><div class="sec-t">🧠 Analisis</div>`;
      if(p.bodyFat)h+=`<div class="alert ${p.bodyFat<20?'a-ok':p.bodyFat<25?'a-info':'a-warn'}"><span class="alert-i">${p.bodyFat<20?'💪':'📊'}</span><span>Grasa: ${p.bodyFat}%. ${p.bodyFat<15?'Atletico!':p.bodyFat<20?'Buen nivel.':p.bodyFat<25?'Normal. Cardio + dieta lo bajan.':'Por encima. Deficit + cardio.'} (Ideal: 15-20%)</span></div>`;
      if(p.visceralFat)h+=`<div class="alert ${p.visceralFat<=9?'a-ok':'a-warn'}"><span class="alert-i">${p.visceralFat<=9?'✅':'⚠️'}</span><span>Visceral: ${p.visceralFat}. ${p.visceralFat<=9?'Saludable!':'Alto. Caminadora inclinada es lo mejor.'} (Ideal: 1-9)</span></div>`;
      if(p.metaAge&&p.age)h+=`<div class="alert ${p.metaAge<=p.age?'a-ok':'a-warn'}"><span class="alert-i">${p.metaAge<=p.age?'🎉':'⏰'}</span><span>Edad metab: ${p.metaAge} (real: ${p.age}). ${p.metaAge<=p.age?'Metabolismo ok!':'Ejercicio y dieta lo mejoran.'}</span></div>`;
      if(p.bmr)h+=`<div class="alert a-info"><span class="alert-i">🔥</span><span>BMR: ${p.bmr} cal/dia. Ingesta ideal: ${p.bmr}-${Math.round(p.bmr*1.2)} cal + ejercicio.</span></div>`;
      h+=`</div>`;
    }

    // ===== CONFIGURAR COMIDAS =====
    const userMeals=UserMeals.getUserMeals();
    h+=`<div class="sec"><div class="sec-t">⚙️ Configurar comidas</div>
      <div class="c"><div style="font-size:11px;color:var(--t2);margin-bottom:8px">Personaliza tu plan de comidas. Cada comida tiene hora, dias activos y alimentos con gramaje.</div>
      ${userMeals.length?userMeals.map((m,mi)=>{
        const macros=UserMeals.calcMealMacros(m);
        const daysTxt=m.days&&m.days.length===7?'Todos los dias':(m.days||[]).map(d=>DAY_SHORT[d]).join(', ');
        const foodsTxt=(m.foods||[]).length?m.foods.map(f=>{const fd=FOOD[f.foodKey];return fd?`${f.grams}g ${fd.n}`:f.foodKey}).join(' + '):'Sin alimentos';
        return `<div class="c" style="padding:10px;margin-bottom:6px;background:var(--accent-soft)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
            <div><b style="font-size:14px">${m.time} · ${m.label}</b></div>
            <div style="display:flex;gap:4px">
              <button class="btn-outline" style="padding:6px 10px;font-size:11px;min-height:36px" data-a="editMeal" data-i="${mi}">✏️</button>
              <button class="btn-danger" style="padding:6px 10px;font-size:11px;min-height:36px" data-a="delMeal" data-i="${mi}">🗑️</button>
            </div>
          </div>
          <div style="font-size:11px;color:var(--t2)">📅 ${daysTxt}</div>
          <div style="font-size:11px;color:var(--t2);margin-top:2px">🍽️ ${foodsTxt}</div>
          <div style="font-size:11px;color:var(--accent);margin-top:4px">${macros.cal} cal · 🥩 ${macros.p}g · 🍞 ${macros.c}g · 🧈 ${macros.fat}g</div>
        </div>`;
      }).join(''):'<div style="text-align:center;color:var(--t3);padding:12px">Sin comidas. Agrega una abajo.</div>'}
      <button class="btn-accent" data-a="addMeal" style="width:100%;margin-top:6px;min-height:48px">+ Agregar comida</button>
      <button class="btn-outline" data-a="resetMeals" style="width:100%;margin-top:6px;font-size:11px">Restaurar plantilla por defecto</button>
      </div></div>`;

    h+=`<div class="sec"><div class="sec-t">🔔 Notificaciones</div><div class="c">
      ${[['notif','🔔 Notificaciones','Todas las alertas'],['morning','☀️ Briefing matutino','A tu hora de despertar'],['meal','🍽️ Comidas','A las horas de tus comidas'],['water','💧 Agua','Cada pocas horas'],['gym','🏋️ Ejercicio','Antes de entrenar'],['sleep','😴 Dormir','A tu hora de dormir']].map(([k,l,s])=>
        `<div class="set-row"><div><div class="set-lbl">${l}</div><div class="set-sub">${s}</div></div><button class="tog ${set[k]?'on':''}" data-a="togSet" data-k="${k}"></button></div>`).join('')}</div></div>`;

    // Security section
    h+=`<div class="sec"><div class="sec-t">🔒 Seguridad</div><div class="c">`;
    if(typeof Auth!=='undefined'&&Auth.isLoggedIn()){
      h+=`<div class="set-row"><div><div class="set-lbl">👤 ${Auth.user?.username||'Usuario'}</div><div class="set-sub">Sesion activa</div></div>
        <button class="btn-outline" style="padding:6px 12px;font-size:11px" data-a="logout">Cerrar Sesion</button></div>`;
      h+=`<div class="set-row"><div><div class="set-lbl">🔑 Contrasena</div><div class="set-sub">Cambiar contrasena</div></div>
        <button class="btn-outline" style="padding:6px 12px;font-size:11px" data-a="changePw">Cambiar</button></div>`;
      h+=`<div class="set-row"><div><div class="set-lbl">📋 Audit Log</div><div class="set-sub">Historial de actividad</div></div>
        <button class="btn-outline" style="padding:6px 12px;font-size:11px" data-a="viewAudit">Ver</button></div>`;
      h+=`<div class="set-row"><div><div class="set-lbl">☁️ Sincronizar</div><div class="set-sub">Enviar datos al servidor</div></div>
        <button class="btn-outline" style="padding:6px 12px;font-size:11px" data-a="syncNow">Sync</button></div>`;
    }else{
      h+=`<div style="text-align:center;padding:8px;font-size:12px;color:var(--t3)">Modo offline. Crea cuenta para seguridad completa.</div>`;
    }
    h+=`</div></div>`;

    h+=`<div class="sec"><div class="c">
      <button class="btn-danger" data-a="reset" style="width:100%;margin-bottom:6px">Reiniciar hoy</button>
      <button class="btn-outline" data-a="export" style="width:100%;margin-bottom:6px">Exportar datos</button>
      <button class="btn-outline" data-a="reportError" style="width:100%;min-height:48px">🐞 Reportar un error</button>
      <div style="font-size:10px;color:var(--t3);margin-top:6px;text-align:center">Si algo no funciona, enviame un reporte</div>
      </div></div>`;

    h+=`<div class="sec"><div class="c" style="text-align:center;padding:16px"><div style="font-size:30px">💪</div>
      <div style="font-weight:700;margin-top:4px">Libra Fit Assistant v1.0</div>
      <div style="font-size:11px;color:var(--t3)">Backend seguro &bull; JWT Auth &bull; Encrypted DB</div></div></div>`;

    return h;
  },

  // ===== EVENT BINDING =====
  bind(el){
    // Delegate change events (for select/input inside routines config)
    el.onchange=e=>{
      const t=e.target.closest('[data-a]');if(!t)return;
      const a=t.dataset.a;
      if(a==='schedDay'&&typeof UserRoutines!=='undefined'){
        const sch=UserRoutines.getWeekSchedule();
        sch[+t.dataset.d]=t.value||null;
        UserRoutines.saveWeekSchedule(sch);
        this.toast('📅 Horario guardado');
      } else if(a==='cardioType'&&typeof UserRoutines!=='undefined'){
        const cfg=UserRoutines.getCardioConfig();
        cfg.type=t.value;UserRoutines.saveCardioConfig(cfg);
      } else if(a==='cardioDur'&&typeof UserRoutines!=='undefined'){
        const cfg=UserRoutines.getCardioConfig();
        cfg.duration=+t.value||20;UserRoutines.saveCardioConfig(cfg);
      } else if(a==='reField'&&this._editingRoutine){
        const r=this._editingRoutine,i=+t.dataset.i,f=t.dataset.f;
        if(r.exercises[i]){
          if(f==='sets'||f==='rest')r.exercises[i][f]=+t.value||0;
          else r.exercises[i][f]=t.value;
        }
      } else if(a==='goal'){
        const gg=getGoals();gg[t.dataset.f]=t.dataset.f==='targetDate'?t.value:+t.value;saveGoals(gg);
      } else if(a==='chgW'){
        const an=Engine.exAnalysis(t.dataset.e,+t.value),wd=document.getElementById('ww_'+t.dataset.e);
        if(wd)wd.innerHTML=an.out.map(w=>`<div class="alert ${w.t==='danger'?'a-danger':w.t==='ok'?'a-ok':'a-warn'}" style="margin:4px 12px"><span class="alert-i">${w.i}</span><span style="font-size:11px">${w.m}</span></div>`).join('');
      }
    };
    el.onclick=e=>{
      const t=e.target.closest('[data-a]');if(!t)return;
      const a=t.dataset.a,st=getDay();

      if(a==='meal'){
        const mk=t.dataset.k,cur=st.meals[mk];
        // Si es un override con foods, desmarcar completamente
        if(cur&&typeof cur==='object')delete st.meals[mk];
        else st.meals[mk]=!cur;
        saveDay(st);this.renderAll();
        this.toast(st.meals[mk]?'✅ Completado':'↩ Desmarcado');
      }
      if(a==='water'){st.water=Math.max(0,st.water+parseInt(t.dataset.v));saveDay(st);
        if(st.water>=4000&&st.water-parseInt(t.dataset.v)<4000)this.modal('🎉 4 Litros!','<p>Meta de agua cumplida!</p>');
        this.renderAll()}
      if(a==='rmExtra'){st.extras.splice(+t.dataset.i,1);saveDay(st);this.renderAll()}
      if(a==='tog'){const el=document.getElementById(t.dataset.t);if(el)el.classList.toggle('hide')}
      if(a==='go'){this.goTo(+t.dataset.p)}
      if(a==='subtab'){this.subTabs[t.dataset.p]=t.dataset.v;this.renderPage({Comida:1,Gym:2,Progreso:3}[t.dataset.p]);this.bind(document.getElementById('page'+t.dataset.p))}
      if(a==='trackMetric'){this._progresoMetric=t.dataset.v;this.renderPage(3);this.bind(document.getElementById('pageProgreso'))}
      if(a==='trackPeriod'){this._progresoPeriod=t.dataset.v;this.renderPage(3);this.bind(document.getElementById('pageProgreso'))}
      if(a==='pesoP'){this._pesoPeriod=t.dataset.v;this.renderPage(3);this.bind(document.getElementById('pageProgreso'))}

      if(a==='search'){
        const q=document.getElementById('foodQ')?.value?.trim();if(!q)return;
        const res=searchFood(q),rDiv=document.getElementById('foodR'),dow=new Date().getDay(),st2=getDay();
        if(!res.length){rDiv.innerHTML=`<div style="color:var(--t3);font-size:12px;padding:6px">No encontre "${q}". Intenta: pizza, pollo, cerveza...</div>`;return}
        rDiv.innerHTML=res.map(f=>{
          const r=canIEat(f.k,st2,dow);if(!r)return'';
          const cls=r.ans==='go'?'food-go':r.ans==='no'?'food-no':'food-warn';
          const icon=r.ans==='go'?'✅':r.ans==='no'?'🚫':'⚠️';
          return`<div class="food-result ${cls}"><div style="display:flex;justify-content:space-between;margin-bottom:4px"><b>${icon} ${f.n}</b><b>${f.c} cal</b></div>
            <div style="font-size:10px;color:var(--t2);margin-bottom:4px">🥩 ${f.p}g · 🍞 ${f.cb}g · 🧈 ${f.f}g</div>
            <div style="font-size:11px;white-space:pre-line">${r.msg}</div>
            ${r.ans!=='no'?`<button class="btn-accent" style="width:100%;margin-top:6px;font-size:11px;padding:8px" data-a="addFood" data-k="${f.k}">+ Agregar (${f.c} cal)</button>`:''}</div>`}).join('')}

      if(a==='addFood'){const f=FOOD[t.dataset.k];if(!f)return;st.extras=st.extras||[];st.extras.push({n:f.n,c:f.c});saveDay(st);this.toast(`+${f.c} cal (${f.n})`);this.renderAll()}

      if(a==='set'){
        const eid=t.dataset.e,si=+t.dataset.s,rut=(typeof getEffectiveRoutine!=='undefined'?getEffectiveRoutine():null)||{ex:[]},exDef=rut.ex.find(x=>x.id===eid)||{s:3};
        if(!st.exLog[eid]){const wi=document.getElementById('w_'+eid);st.exLog[eid]={w:wi?+wi.value:EX[eid].dw,sets:Array.from({length:exDef.s},()=>({done:false}))}}
        const wi2=document.getElementById('w_'+eid);if(wi2)st.exLog[eid].w=+wi2.value;
        st.exLog[eid].sets[si].done=!st.exLog[eid].sets[si].done;saveDay(st);
        if(st.exLog[eid].sets.every(s=>s.done)&&st.exLog[eid].w>0){const h=getExHist(eid),td=dk();saveExHist(eid,[{date:td,weight:st.exLog[eid].w},...h.filter(x=>x.date!==td)].slice(0,100))}
        this.renderPage(2);this.bind(document.getElementById('pageGym'))}

      if(a==='adjW'){const inp=document.getElementById('w_'+t.dataset.e);if(inp){inp.value=Math.max(0,+inp.value+ +t.dataset.d);
        const an=Engine.exAnalysis(t.dataset.e,+inp.value),wd=document.getElementById('ww_'+t.dataset.e);
        if(wd)wd.innerHTML=an.out.map(w=>`<div class="alert ${w.t==='danger'?'a-danger':w.t==='ok'?'a-ok':'a-warn'}" style="margin:4px 12px"><span class="alert-i">${w.i}</span><span style="font-size:11px">${w.m}</span></div>`).join('');
        if(st.exLog[t.dataset.e])st.exLog[t.dataset.e].w=+inp.value;saveDay(st)}}

      if(a==='chgW'){const an=Engine.exAnalysis(t.dataset.e,+t.value),wd=document.getElementById('ww_'+t.dataset.e);
        if(wd)wd.innerHTML=an.out.map(w=>`<div class="alert ${w.t==='danger'?'a-danger':w.t==='ok'?'a-ok':'a-warn'}" style="margin:4px 12px"><span class="alert-i">${w.i}</span><span style="font-size:11px">${w.m}</span></div>`).join('')}

      if(a==='cardio'){st.cardioId=t.closest('[data-id]').dataset.id;saveDay(st);this.renderPage(2);this.bind(document.getElementById('pageGym'))}
      if(a==='cardioDone'){st.cardioDone=!st.cardioDone;saveDay(st);this.renderAll()}

      if(a==='logW'){const v=+document.getElementById('bwInp')?.value;if(!v||v<50||v>500){this.modal('⚠️','<p>Peso valido (50-500 lbs)</p>');return}
        const ws=getWeights();ws.unshift({date:dk(),weight:v});const seen=new Set();saveWeights(ws.filter(w=>{if(seen.has(w.date))return false;seen.add(w.date);return true}));
        const gg=getGoals();if(!gg.startWeight){gg.startWeight=v;saveGoals(gg)}
        this.toast(`⚖️ ${v} lbs guardado`);this.renderPage(3);this.bind(document.getElementById('pageProgreso'))}

      if(a==='goal'){const gg=getGoals();gg[t.dataset.f]=t.dataset.f==='targetDate'?t.value:+t.value;saveGoals(gg)}

      if(a==='addSup'){const ms=getMySups();if(!ms.includes(t.dataset.id)){ms.push(t.dataset.id);saveMySups(ms);this.toast('💊 Suplemento agregado');this.renderPage(3);this.bind(document.getElementById('pageProgreso'))}}
      if(a==='rmSup'){const ms=getMySups().filter(x=>x!==t.dataset.id);saveMySups(ms);this.renderPage(3);this.bind(document.getElementById('pageProgreso'))}

      if(a==='togSet'){const s=getSettings();s[t.dataset.k]=!s[t.dataset.k];saveSettings(s);if(s.notif)Notif.init();this.renderPage(4);this.bind(document.getElementById('pagePerfil'))}

      if(a==='savePf'){
        const p=getProfile();
        ['name','age','gender','height','wStart','wGoal','activity','bodyFat','muscleMass','visceralFat','metaAge','bmr','notes'].forEach(f=>{
          const el=document.getElementById('pf_'+f);if(!el)return;
          if(['age','height','wStart','wGoal','bodyFat','muscleMass','visceralFat','metaAge','bmr'].includes(f))p[f]=el.value?+el.value:null;
          else p[f]=el.value});
        saveProfile(p);const gg=getGoals();if(p.wStart&&!gg.startWeight){gg.startWeight=p.wStart;saveGoals(gg)}
        if(p.wGoal){gg.targetWeight=p.wGoal;saveGoals(gg)}
        this.toast('✅ Perfil guardado');this.renderPage(4);this.bind(document.getElementById('pagePerfil'))}

      if(a==='reset'){if(confirm('Borrar datos de hoy?')){S.d('d_'+dk());this.toast('Reiniciado');this.renderAll()}}
      if(a==='export'){const d={};const prefix=S._prefix('');for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k.startsWith(prefix))d[k]=localStorage.getItem(k)}
        const b=new Blob([JSON.stringify(d,null,2)],{type:'application/json'}),u=URL.createObjectURL(b),l=document.createElement('a');l.href=u;l.download=`librafit_backup_${dk()}.json`;l.click()}

      if(a==='logout'){
        if(confirm('Cerrar sesion? Tus datos quedan guardados en el servidor y vuelven cuando te logueas.')){
          if(typeof Auth!=='undefined')Auth.logout();
          localStorage.removeItem('fr_offline');
          location.reload();
        }
      }
      if(a==='changePw'){
        this.modal('Cambiar Contrasena',`<div class="auth-field"><label>Actual</label><input type="password" id="cpCur" class="search-inp" style="width:100%;margin-bottom:8px"></div>
          <div class="auth-field"><label>Nueva</label><input type="password" id="cpNew" class="search-inp" style="width:100%;margin-bottom:8px"></div>
          <button class="btn-accent" style="width:100%" onclick="(async()=>{try{await Auth.changePassword(document.getElementById('cpCur').value,document.getElementById('cpNew').value);App.closeModal();App.toast('Contrasena actualizada')}catch(e){alert(e.message)}})()">Actualizar</button>`)
      }
      if(a==='viewAudit'){
        if(typeof AuditClient!=='undefined'){
          AuditClient.getLog({limit:30}).then(r=>{
            const logs=r.logs||[];
            const html=logs.length?logs.map(l=>`<div style="padding:4px 0;border-bottom:1px solid var(--divider);font-size:11px">
              <div style="color:var(--t3)">${new Date(l.timestamp).toLocaleString()}</div>
              <div><b>${l.action}</b> ${l.detail||''}</div>
              <div style="color:${l.status==='completed'?'var(--green)':l.status==='failed'?'var(--red)':'var(--t3)'}">${l.status||''}</div></div>`).join('')
              :'<p>No hay registros aun.</p>';
            this.modal('Audit Log',html)
          })
        }
      }
      if(a==='quickAdd'){this.showQuickAddFood();return}
      if(a==='qaSel'){const k=t.dataset.k;this.quickAddFood(k);return}
      if(a==='qaSearch'){
        const q=document.getElementById('qaInp')?.value?.trim();if(!q)return;
        const res=searchFood(q),rDiv=document.getElementById('qaRes');
        if(!res.length){rDiv.innerHTML=`<div style="color:var(--t3);font-size:12px;padding:6px">No encontre "${q}". Prueba con otro nombre.</div>`;return}
        rDiv.innerHTML=res.slice(0,8).map(f=>`<button class="btn-outline" style="width:100%;margin-bottom:4px;padding:10px;text-align:left;min-height:44px" data-a="qaSel" data-k="${f.k}"><b>${f.n}</b> <span style="color:var(--t3);float:right">${f.c} cal</span></button>`).join('');
      }
      if(a==='trainNow'){this.showTrainNow();return}
      if(a==='tnSet'){
        const eid=t.dataset.e,si=+t.dataset.s,rut=(typeof getEffectiveRoutine!=='undefined'?getEffectiveRoutine():null)||{ex:[]},exDef=rut.ex.find(x=>x.id===eid);
        if(!exDef)return;
        if(!st.exLog[eid]){const h=getExHist(eid),lw=h.length?h[0].weight:EX[eid].dw;st.exLog[eid]={w:lw,sets:Array.from({length:exDef.s},()=>({done:false}))}}
        st.exLog[eid].sets[si].done=!st.exLog[eid].sets[si].done;saveDay(st);
        if(st.exLog[eid].sets.every(s=>s.done)&&st.exLog[eid].w>0){const h=getExHist(eid),td=dk();saveExHist(eid,[{date:td,weight:st.exLog[eid].w},...h.filter(x=>x.date!==td)].slice(0,100))}
        this.showTrainNow();
      }
      if(a==='tnAdj'){
        const eid=t.dataset.e,d=+t.dataset.d,rut=(typeof getEffectiveRoutine!=='undefined'?getEffectiveRoutine():null)||{ex:[]},exDef=rut.ex.find(x=>x.id===eid);
        if(!exDef)return;
        if(!st.exLog[eid]){const h=getExHist(eid),lw=h.length?h[0].weight:EX[eid].dw;st.exLog[eid]={w:lw,sets:Array.from({length:exDef.s},()=>({done:false}))}}
        st.exLog[eid].w=Math.max(0,st.exLog[eid].w+d);saveDay(st);this.showTrainNow();
      }
      // ===== MEAL CONFIG =====
      if(a==='addMeal'){this.showMealEditor(null);return}
      if(a==='editMeal'){this.showMealEditor(+t.dataset.i);return}
      if(a==='delMeal'){
        if(!confirm('Eliminar esta comida?'))return;
        const ums=UserMeals.getUserMeals();ums.splice(+t.dataset.i,1);UserMeals.saveUserMeals(ums);
        this.toast('🗑️ Comida eliminada');this.renderAll();return;
      }
      if(a==='resetMeals'){
        if(!confirm('Restaurar plantilla por defecto? Perderas tu configuracion.'))return;
        UserMeals.resetToDefault();this.toast('✅ Plantilla restaurada');this.renderAll();return;
      }
      if(a==='mealAddFood'){this.mealEditorAddFood();return}
      if(a==='mealRmFood'){this.mealEditorRmFood(+t.dataset.i);return}
      if(a==='mealSave'){this.mealEditorSave();return}
      if(a==='mealFoodSearch'){this.mealEditorSearch();return}
      if(a==='mealPickFood'){this.mealEditorPickFood(t.dataset.k);return}
      if(a==='swapMeal'){this.showSwapMeal(t.dataset.k);return}
      if(a==='swapPick'){this.swapPickFood(t.dataset.mealid,t.dataset.k);return}

      if(a==='syncNow'){
        if(typeof Sync!=='undefined'){
          Sync.migrateToServer().then(()=>{this.toast('Datos sincronizados')}).catch(()=>{this.toast('Error de sync')})
        }
      }

      // ===== Error report =====
      if(a==='reportError'){
        if(typeof ErrorReportUI!=='undefined')ErrorReportUI.open();
        else this.toast('Sistema de reportes no disponible');
        return;
      }

      // ===== Custom routines config =====
      if(a==='newRut'){this.showRoutineEditor(null);return}
      if(a==='editRut'){this.showRoutineEditor(t.dataset.id);return}
      if(a==='delRut'){
        if(!confirm('Borrar esta rutina?'))return;
        const list=UserRoutines.getUserRoutines().filter(r=>r.id!==t.dataset.id);
        UserRoutines.saveUserRoutines(list);
        // Limpiar del schedule
        const sch=UserRoutines.getWeekSchedule();
        Object.keys(sch).forEach(k=>{if(sch[k]===t.dataset.id)sch[k]=null});
        UserRoutines.saveWeekSchedule(sch);
        this.toast('🗑️ Rutina eliminada');
        this.renderPage(2);this.bind(document.getElementById('pageGym'));
        return;
      }
      if(a==='schedDay'){
        const sch=UserRoutines.getWeekSchedule();
        sch[+t.dataset.d]=t.value||null;
        UserRoutines.saveWeekSchedule(sch);
        this.toast('📅 Horario guardado');
        return;
      }
      if(a==='togCardio'){
        const cfg=UserRoutines.getCardioConfig();
        const d=+t.dataset.d;
        cfg.days=cfg.days||[];
        if(cfg.days.includes(d))cfg.days=cfg.days.filter(x=>x!==d);
        else cfg.days.push(d);
        cfg.days.sort();
        UserRoutines.saveCardioConfig(cfg);
        this.renderPage(2);this.bind(document.getElementById('pageGym'));
        return;
      }
      if(a==='cardioType'){
        const cfg=UserRoutines.getCardioConfig();
        cfg.type=t.value;UserRoutines.saveCardioConfig(cfg);return;
      }
      if(a==='cardioDur'){
        const cfg=UserRoutines.getCardioConfig();
        cfg.duration=+t.value||20;UserRoutines.saveCardioConfig(cfg);return;
      }
      if(a==='resetRut'){
        if(!confirm('Restaurar rutinas por defecto? Se borraran tus rutinas actuales.'))return;
        S.d('userRoutines');S.d('weekSchedule');S.d('cardioConfig');
        this.toast('✅ Restaurado');
        this.renderPage(2);this.bind(document.getElementById('pageGym'));
        return;
      }

      // ===== Routine editor (modal) =====
      if(a==='reField'){
        const r=this._editingRoutine;if(!r)return;
        const i=+t.dataset.i,f=t.dataset.f;
        if(!r.exercises[i])return;
        if(f==='sets'||f==='rest')r.exercises[i][f]=+t.value||0;
        else r.exercises[i][f]=t.value;
        return;
      }
      if(a==='reRm'){
        const r=this._editingRoutine;if(!r)return;
        r.exercises.splice(+t.dataset.i,1);
        this._renderRoutineEditor();
        return;
      }
      if(a==='reAdd'){
        const r=this._editingRoutine;if(!r)return;
        const sel=document.getElementById('reAddSel');
        if(!sel||!sel.value)return;
        const ex=EX[sel.value];
        r.exercises.push({exKey:sel.value,sets:3,reps:'10-12',rest:60,weight:null});
        this._renderRoutineEditor();
        return;
      }
      if(a==='reCancel'){this._editingRoutine=null;this.closeModal();return}
      if(a==='reSave'){
        const r=this._editingRoutine;if(!r)return;
        const nameInp=document.getElementById('reName');
        if(nameInp)r.name=(nameInp.value||'').trim()||'Sin nombre';
        const list=UserRoutines.getUserRoutines();
        const idx=list.findIndex(x=>x.id===r.id);
        if(idx>=0)list[idx]=r;else list.push(r);
        UserRoutines.saveUserRoutines(list);
        this._editingRoutine=null;
        this.closeModal();
        this.toast('✅ Rutina guardada');
        this.renderPage(2);this.bind(document.getElementById('pageGym'));
        return;
      }
    };
  },

  // ===== MEAL EDITOR =====
  _editingMeal: null, // {index:number|null, data:{id,label,time,days,foods,notes}}

  showMealEditor(idx){
    const ums=UserMeals.getUserMeals();
    let meal;
    if(idx===null||idx===undefined){
      meal={id:'m_'+Date.now(),label:'Nueva comida',time:'08:00',days:[0,1,2,3,4,5,6],foods:[],notes:''};
      this._editingMeal={index:null,data:meal};
    }else{
      meal=JSON.parse(JSON.stringify(ums[idx]));
      this._editingMeal={index:idx,data:meal};
    }
    this.renderMealEditor();
  },

  renderMealEditor(){
    const m=this._editingMeal.data;
    const macros=UserMeals.calcMealMacros(m);
    const dayLabels=['D','L','M','X','J','V','S'];
    let body=`
      <div class="prof-row"><label>Nombre</label><input class="inp-sm" id="me_label" value="${m.label||''}"></div>
      <div class="prof-row"><label>Hora</label><input type="time" class="inp-sm" id="me_time" value="${m.time||'08:00'}"></div>
      <div style="margin:6px 0">
        <div style="font-size:11px;color:var(--t2);margin-bottom:4px">Dias activos</div>
        <div style="display:flex;gap:4px;flex-wrap:wrap">
          ${dayLabels.map((d,i)=>`<button class="${m.days.includes(i)?'btn-accent':'btn-outline'}" data-a="meToggleDay" data-d="${i}" style="min-width:40px;min-height:40px;padding:8px;font-size:12px">${d}</button>`).join('')}
        </div>
      </div>
      <div style="margin:8px 0 4px;font-size:12px;font-weight:600;color:var(--t1)">🍽️ Alimentos</div>
      <div id="me_foods">
        ${(m.foods||[]).map((f,i)=>{
          const fd=FOOD[f.foodKey];
          const nm=fd?fd.n:f.foodKey;
          const cal=fd?foodMacros(f.foodKey,f.grams).cal:0;
          return `<div class="c" style="padding:6px 8px;margin-bottom:4px;display:flex;align-items:center;gap:6px">
            <div style="flex:1;font-size:12px"><b>${nm}</b> <span style="color:var(--t3)">${cal} cal</span></div>
            <input type="number" class="inp-sm" id="me_g_${i}" value="${f.grams}" style="width:70px;padding:4px" oninput="App.updateMealEditorGrams(${i},this.value)">
            <span style="font-size:10px;color:var(--t3)">g</span>
            <button class="btn-danger" data-a="mealRmFood" data-i="${i}" style="padding:4px 8px;font-size:10px;min-height:32px">✕</button>
          </div>`;
        }).join('')}
      </div>
      <div style="margin:8px 0">
        <div class="search-row">
          <input class="search-inp" id="me_foodQ" placeholder="Buscar alimento..." style="flex:1" onkeyup="if(event.key==='Enter')App.mealEditorSearch()">
          <button class="btn-accent" data-a="mealFoodSearch" style="min-height:44px">Buscar</button>
        </div>
        <div id="me_foodRes" style="margin-top:6px;max-height:180px;overflow-y:auto"></div>
      </div>
      <div class="c" style="padding:8px;background:var(--accent-soft);margin-top:6px">
        <div style="font-size:11px;color:var(--t2)">Total estimado:</div>
        <div style="font-size:13px;font-weight:700;color:var(--accent)">${macros.cal} cal · 🥩 ${macros.p}g · 🍞 ${macros.c}g · 🧈 ${macros.fat}g · 🌾 ${macros.fib}g</div>
      </div>
      <div class="prof-row" style="margin-top:6px"><label>Notas</label><input class="inp-sm" id="me_notes" value="${m.notes||''}" placeholder="Opcional"></div>
      <button class="btn-accent" data-a="mealSave" style="width:100%;margin-top:8px;min-height:48px">💾 Guardar</button>
    `;
    this.modal(this._editingMeal.index===null?'➕ Nueva comida':'✏️ Editar comida',body);
    // Bind day toggle
    setTimeout(()=>{
      document.querySelectorAll('[data-a=meToggleDay]').forEach(b=>{
        b.onclick=()=>{
          const d=+b.dataset.d;
          const idx=m.days.indexOf(d);
          if(idx>=0)m.days.splice(idx,1);else m.days.push(d);
          m.days.sort();
          this.renderMealEditor();
        };
      });
    },50);
  },

  updateMealEditorGrams(i,val){
    const m=this._editingMeal.data;
    const g=parseFloat(val)||0;
    if(m.foods[i])m.foods[i].grams=g;
    // Update totals without full re-render
    const macros=UserMeals.calcMealMacros(m);
    // Lightweight update
    const el=document.querySelector('#modalBody .c[style*="accent-soft"] div:last-child');
    if(el)el.innerHTML=`${macros.cal} cal · 🥩 ${macros.p}g · 🍞 ${macros.c}g · 🧈 ${macros.fat}g · 🌾 ${macros.fib}g`;
  },

  mealEditorSearch(){
    const q=document.getElementById('me_foodQ')?.value?.trim();
    if(!q){document.getElementById('me_foodRes').innerHTML='';return}
    const res=searchFood(q).slice(0,10);
    const div=document.getElementById('me_foodRes');
    if(!res.length){div.innerHTML=`<div style="color:var(--t3);font-size:12px;padding:4px">No encontre "${q}".</div>`;return}
    div.innerHTML=res.map(f=>{
      const srv=f.serving||100;
      return `<button class="btn-outline" data-a="mealPickFood" data-k="${f.k}" style="width:100%;margin-bottom:4px;padding:10px;text-align:left;min-height:44px;font-size:12px">
        <b>${f.n}</b> <span style="color:var(--t3);float:right">${f.cat||''} · ${srv}g default</span>
      </button>`;
    }).join('');
  },

  mealEditorPickFood(foodKey){
    const f=FOOD[foodKey];if(!f)return;
    const g=parseFloat(prompt(`Cuantos gramos de ${f.n}?`, f.serving||100));
    if(!g||g<=0)return;
    this._editingMeal.data.foods.push({foodKey,grams:g});
    this.renderMealEditor();
  },

  mealEditorRmFood(i){
    this._editingMeal.data.foods.splice(i,1);
    this.renderMealEditor();
  },

  mealEditorSave(){
    const m=this._editingMeal.data;
    m.label=(document.getElementById('me_label')?.value||m.label).trim();
    m.time=document.getElementById('me_time')?.value||m.time;
    m.notes=(document.getElementById('me_notes')?.value||'').trim();
    // Sync grams from inputs
    m.foods.forEach((f,i)=>{
      const inp=document.getElementById('me_g_'+i);
      if(inp)f.grams=parseFloat(inp.value)||f.grams;
    });
    if(!m.days.length){this.toast('⚠️ Elige al menos un dia');return}
    const ums=UserMeals.getUserMeals();
    if(this._editingMeal.index===null)ums.push(m);
    else ums[this._editingMeal.index]=m;
    UserMeals.saveUserMeals(ums);
    this.closeModal();
    this.toast('✅ Comida guardada');
    this.renderAll();
  },

  // ===== RUNTIME SWAP =====
  _swappingMeal: null,
  showSwapMeal(mealId){
    this._swappingMeal={id:mealId,foods:[]};
    const body=`<div style="font-size:12px;color:var(--t2);margin-bottom:8px">Que comiste en vez? Busca y agrega los alimentos con sus gramos.</div>
      <div class="search-row">
        <input class="search-inp" id="sw_q" placeholder="Buscar: pollo, arroz..." style="flex:1" onkeyup="if(event.key==='Enter')document.querySelector('[data-a=swSearch]').click()">
        <button class="btn-accent" data-a="swSearch" style="min-height:44px">Buscar</button>
      </div>
      <div id="sw_res" style="margin-top:6px;max-height:200px;overflow-y:auto"></div>
      <div id="sw_selected" style="margin-top:8px"></div>
      <button class="btn-accent" data-a="swApply" style="width:100%;margin-top:8px;min-height:48px">💾 Registrar como comido</button>`;
    this.modal('🔄 Cambiar comida',body);
    setTimeout(()=>{
      document.querySelector('[data-a=swSearch]').onclick=()=>this.swapSearch();
      document.querySelector('[data-a=swApply]').onclick=()=>this.swapApply();
    },50);
  },

  swapSearch(){
    const q=document.getElementById('sw_q')?.value?.trim();if(!q)return;
    const res=searchFood(q).slice(0,10),div=document.getElementById('sw_res');
    if(!res.length){div.innerHTML=`<div style="color:var(--t3);font-size:12px;padding:4px">No encontre "${q}".</div>`;return}
    div.innerHTML=res.map(f=>`<button class="btn-outline" data-a="swapPick" data-mealid="${this._swappingMeal.id}" data-k="${f.k}" style="width:100%;margin-bottom:4px;padding:10px;text-align:left;min-height:44px;font-size:12px">
      <b>${f.n}</b> <span style="color:var(--t3);float:right">${f.cat||''}</span>
    </button>`).join('');
    setTimeout(()=>{
      div.querySelectorAll('[data-a=swapPick]').forEach(b=>{
        b.onclick=()=>this.swapPickFood(b.dataset.mealid,b.dataset.k);
      });
    },30);
  },

  swapPickFood(mealId,foodKey){
    const f=FOOD[foodKey];if(!f)return;
    const g=parseFloat(prompt(`Cuantos gramos de ${f.n}?`, f.serving||100));
    if(!g||g<=0)return;
    this._swappingMeal.foods.push({foodKey,grams:g});
    this.updateSwapSelected();
  },

  updateSwapSelected(){
    const div=document.getElementById('sw_selected');if(!div)return;
    const tot=UserMeals.calcMealMacros({foods:this._swappingMeal.foods});
    div.innerHTML=`<div class="c" style="padding:8px;background:var(--accent-soft)">
      <div style="font-size:11px;font-weight:600;margin-bottom:4px">Comida real:</div>
      ${this._swappingMeal.foods.map((it,i)=>{
        const fd=FOOD[it.foodKey];
        return `<div style="font-size:11px;padding:2px 0">${it.grams}g ${fd?fd.n:it.foodKey} <span style="color:var(--red);cursor:pointer;margin-left:4px" onclick="App._swappingMeal.foods.splice(${i},1);App.updateSwapSelected()">✕</span></div>`;
      }).join('')||'<div style="font-size:11px;color:var(--t3)">Sin alimentos</div>'}
      <div style="font-size:12px;font-weight:700;color:var(--accent);margin-top:4px">Total: ${tot.cal} cal · 🥩 ${tot.p}g · 🍞 ${tot.c}g · 🧈 ${tot.fat}g</div>
    </div>`;
  },

  swapApply(){
    if(!this._swappingMeal.foods.length){this.toast('⚠️ Agrega al menos un alimento');return}
    UserMeals.logActualEaten(this._swappingMeal.id,this._swappingMeal.foods);
    this.closeModal();
    this.toast('✅ Comida registrada');
    this.renderAll();
  }
};

// Service Worker for PWA install & offline
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
