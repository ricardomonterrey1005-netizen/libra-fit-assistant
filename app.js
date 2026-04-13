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
    if(!S.g('onb')){setTimeout(()=>this.modal('👋 Bienvenido!',`<p>Tu coach personal inteligente.</p><ul><li>Te dice que comer y cuando</li><li>Trackea ejercicios con pesos</li><li>Alertas y recordatorios</li><li>Te avisa si algo no va bien</li></ul><p><b>Instalar en celular:</b> Chrome → Menu → Agregar a pantalla</p>`),400);S.s('onb',1)}
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
    document.getElementById('modalBody').innerHTML=b;
    document.getElementById('modalOverlay').classList.add('show');
    document.getElementById('modalOverlay')._cb=cb;
  },
  closeModal(){document.getElementById('modalOverlay').classList.remove('show');document.getElementById('modalOverlay')._cb?.()},
  toast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2500)},

  // ===== PAGE 0: HOY =====
  rHoy(){
    const now=new Date(),dow=now.getDay(),st=getDay(),sch=SCHED[dow],g=getGoals(),ins=Engine.allInsights(),br=Engine.briefing();
    // Progress
    let tot=6,dn=Object.values(st.meals).filter(Boolean).length;
    tot++;if(st.water>=4000)dn++;
    if(sch.g){const r=sch.g==='A'?RUT_A:RUT_B;r.ex.forEach(e=>{tot+=e.s;const l=st.exLog[e.id];if(l?.sets)dn+=l.sets.filter(x=>x.done).length})}
    if(sch.c===true){tot++;if(st.cardioDone)dn++}
    const pct=tot?Math.round(dn/tot*100):0,circ=226.2,off=circ-circ*pct/100;
    const left=dBetween(now,pk(g.targetDate||'2026-05-10'));
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

    let h=`<div class="hdr"><div class="hdr-row"><div><div class="hdr-greet">${br[0]} 👋</div><div class="hdr-name">${p.name||'Ricardo'} 💪</div>
      <div class="hdr-date">${DAY_NAMES[dow]} ${now.getDate()} de ${MONTHS[now.getMonth()]}</div></div>
      <div class="streak-badge"><div class="streak-fire">🔥</div><div class="streak-num">${streak}</div><div class="streak-lbl">dias</div></div></div></div>`;

    if(left>0)h+=`<div class="countdown"><div class="cd-label">META: 10 DE MAYO</div><div class="cd-num">${left}</div><div class="cd-sub">dias restantes 🎯</div></div>`;

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
      <div class="mini-i"><div class="dot" style="background:var(--green)"></div>${sch.g?'Gym':'Descanso'}</div></div></div></div>`;

    // Calories summary
    h+=`<div class="sec"><div class="sec-t">🔥 Calorias</div><div class="c">
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px">
        <div><span style="font-size:24px;font-weight:800;color:${calCol}">${cal}</span><span style="font-size:12px;color:var(--t3)"> / ${bud.target} cal</span></div>
        <span style="font-size:11px;color:var(--t2)">Quedan: <b style="color:${calCol}">${Math.max(0,bud.target-cal)}</b></span></div>
      <div class="cal-bar"><div class="cal-fill" style="width:${calPct}%;background:${calCol}"></div></div>
      ${(st.extras||[]).length?`<div style="margin-top:6px;font-size:11px;color:var(--t3)">${st.extras.map((e,i)=>`${e.n} (${e.c} cal) <span style="color:var(--red);cursor:pointer" data-a="rmExtra" data-i="${i}">✕</span>`).join(' · ')}</div>`:''}</div></div>`;

    // Insights
    if(ins.length)h+=`<div class="sec"><div class="sec-t">🧠 Coach</div>${ins.map(w=>`<div class="alert ${w.t==='danger'?'a-danger':w.t==='warn'?'a-warn':w.t==='ok'?'a-ok':'a-info'}"><span class="alert-i">${w.i}</span><span>${w.m}</span></div>`).join('')}</div>`;

    // Briefing
    h+=`<div class="sec"><div class="sec-t" data-a="tog" data-t="brief">📋 Briefing ▾</div><div class="c" id="brief">${br.map(b=>`<div style="padding:2px 0;font-size:12px;color:var(--t2)">${b}</div>`).join('')}</div></div>`;

    // Batch
    if(BATCH[dow]){const bc=BATCH[dow];h+=`<div class="batch"><div class="batch-t">🍳 Batch Cooking</div><div class="batch-d"><b>${bc.t}</b><br>Para: ${bc.p} | ⏱️ ${bc.e}</div></div>`}

    // Quick meals
    h+=`<div class="sec"><div class="sec-t">🍽️ Comidas <span style="font-size:11px;color:var(--t3);font-weight:400;margin-left:auto" data-a="go" data-p="1">Ver todo →</span></div>`;
    MEAL_ORDER.forEach(k=>{const m=getMeal(k,dow),done=st.meals[k];
      h+=`<div class="c ${done?'done':''}" style="display:flex;justify-content:space-between;align-items:center;gap:8px">
        <div style="flex:1"><div class="meal-time">${m.time} - ${m.label}</div><div class="meal-desc">${m.desc}</div></div>
        <button class="chk ${done?'on':''}" data-a="meal" data-k="${k}">${done?'✓':''}</button></div>`});
    h+=`</div>`;

    // Water quick
    h+=`<div class="w-sec"><div class="w-row"><div style="font-size:14px;font-weight:700">💧 Agua</div><div class="w-amt">${(st.water/1000).toFixed(1)} <span>/ 4L</span></div></div>
      <div class="w-bar"><div class="w-fill" style="width:${Math.min(100,st.water/4000*100)}%"></div></div>
      <div class="w-btns"><button class="w-btn" data-a="water" data-v="500">+500ml</button><button class="w-btn" data-a="water" data-v="1000">+1L</button><button class="w-btn undo" data-a="water" data-v="-250">-</button></div></div>`;

    // Exercise quick
    if(sch.g){const r=sch.g==='A'?RUT_A:RUT_B;const done=r.ex.filter(e=>{const l=st.exLog[e.id];return l?.sets?.filter(x=>x.done).length>=e.s}).length;
      h+=`<div class="sec"><div class="c" style="text-align:center;cursor:pointer" data-a="go" data-p="2">
        <div style="font-weight:700;color:var(--accent)">${r.name}</div>
        <div style="font-size:22px;margin:6px 0">${done}/${r.ex.length} ejercicios</div>
        <div class="btn-accent" style="display:inline-block;margin-top:4px">Ir al Gym →</div></div></div>`}

    // Reminders
    h+=`<div class="rem"><div class="rem-t">📌 Hoy</div>
      <div class="rem-i">💧 4L agua (vital sin vegetales)</div><div class="rem-i">🥤 Fibra antes de dormir</div>
      <div class="rem-i">😴 Cama 10:00 PM</div>${sch.c===true?'<div class="rem-i">🏃 Cardio 6-7 PM</div>':''}</div>`;

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
      MEAL_ORDER.forEach(k=>{const m=getMeal(k,dow),done=st.meals[k];
        h+=`<div class="c ${done?'done':''}">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
            <div style="flex:1"><div class="meal-time">${m.time} - ${m.label}</div><div class="meal-desc">${m.desc}</div>
              <div class="meal-meta">~${m.cal} cal${m.prep?` · ${m.prep} min prep`:' · Listo'}</div></div>
            <button class="chk ${done?'on':''}" data-a="meal" data-k="${k}">${done?'✓':''}</button></div>
          <div class="alt-row" data-a="tog" data-t="alt_${k}">💡 Alternativas</div>
          <div class="alts hide" id="alt_${k}">${m.alts.map(a=>`→ ${a}`).join('<br>')}</div></div>`});
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
      MEAL_ORDER.forEach(k=>{const m=getMeal(k,dow),done=st.meals[k];
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

    let h=`<div class="hdr"><div class="hdr-name">🏋️ Gym</div><div class="hdr-date">${DAY_NAMES[dow]} - ${sch.g?`Rutina ${sch.g}`:'Descanso'}</div></div>
      <div class="tabs"><button class="tab ${sub==='rutina'?'on':''}" data-a="subtab" data-p="Gym" data-v="rutina">Rutina</button>
      <button class="tab ${sub==='cardio'?'on':''}" data-a="subtab" data-p="Gym" data-v="cardio">Cardio</button>
      <button class="tab ${sub==='manana'?'on':''}" data-a="subtab" data-p="Gym" data-v="manana">Manana</button></div>`;

    if(sub==='rutina'){
      if(sch.g){
        const rut=sch.g==='A'?RUT_A:RUT_B;
        h+=`<div class="sec"><div style="font-size:11px;color:var(--t3);margin-bottom:8px">⏰ ${rut.time} | 45-60s descanso | 📵 Sin celular</div>`;
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

    if(sub==='cardio'){
      h+=`<div class="sec"><div class="sec-t">Cardio ${sch.c==='opt'?'(Opcional)':'6-7 PM'}</div>`;
      if(sch.c===true||sch.c==='opt'){
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

  // ===== PAGE 3: PROGRESO + SUPLEMENTOS =====
  rProgreso(){
    const sub=this.subTabs.Progreso||'peso';
    const w=getWeights(),g=getGoals(),an=Engine.bodyAnalysis(),mySups=getMySups();

    let h=`<div class="hdr"><div class="hdr-name">📊 Progreso</div></div>
      <div class="tabs"><button class="tab ${sub==='peso'?'on':''}" data-a="subtab" data-p="Progreso" data-v="peso">Peso</button>
      <button class="tab ${sub==='semanal'?'on':''}" data-a="subtab" data-p="Progreso" data-v="semanal">Semanal</button>
      <button class="tab ${sub==='suple'?'on':''}" data-a="subtab" data-p="Progreso" data-v="suple">Suplementos</button></div>`;

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
      // Chart
      if(w.length>1){const l14=w.slice(0,14).reverse(),mn=Math.min(...l14.map(x=>x.weight))-2,mx=Math.max(...l14.map(x=>x.weight))+2,rng=mx-mn;
        h+=`<div class="sec"><div class="sec-t">📈 Ultimos ${l14.length} registros</div><div class="chart"><div class="chart-y"><span>${mx.toFixed(0)}</span><span>${((mx+mn)/2).toFixed(0)}</span><span>${mn.toFixed(0)}</span></div>
          <div class="chart-bars">${l14.map(x=>`<div class="chart-col"><div class="chart-bar" style="height:${(x.weight-mn)/rng*100}%"></div><div class="chart-xl">${pk(x.date).getDate()}</div></div>`).join('')}</div></div></div>`}
      // History
      if(w.length)h+=`<div class="sec"><div class="sec-t">📋 Historial</div>${w.slice(0,20).map((x,i)=>{const df=i<w.length-1?x.weight-w[i+1].weight:0;
        return`<div class="c" style="padding:8px 12px;display:flex;justify-content:space-between"><span style="font-size:12px;color:var(--t2)">${fmtDate(x.date)}</span><div>
          <span style="font-weight:700">${x.weight}</span>${df?`<span style="font-size:11px;color:${df<0?'var(--green)':'var(--red)'};margin-left:6px">${df>0?'+':''}${df.toFixed(1)}</span>`:''}</div></div>`}).join('')}</div>`;
    }

    if(sub==='semanal'){
      h+=`<div class="sec"><div class="sec-t">📅 Ultimos 7 dias</div>`;
      for(let i=0;i<7;i++){const d=new Date();d.setDate(d.getDate()-i);const s=getDay(d),m=Object.values(s.meals).filter(Boolean).length,wa=s.water>=4000,
        ex=Object.keys(s.exLog).some(k=>s.exLog[k]?.sets?.some(x=>x.done)),dw=d.getDay();
        h+=`<div class="c" style="padding:8px 12px;display:flex;justify-content:space-between"><span style="font-size:12px;color:var(--t2)">${fmtDate(dk(d))}</span>
          <div style="display:flex;gap:6px;font-size:11px"><span>${m}/6🍽️</span><span>${wa?'✅':'❌'}💧</span><span>${ex?'✅':(SCHED[dw].g?'❌':'😴')}🏋️</span></div></div>`}
      h+=`</div>`;
    }

    if(sub==='suple'){
      h+=`<div class="alert a-warn" style="margin:10px 14px"><span class="alert-i">⚠️</span><span style="font-size:11px"><b>AVISO:</b> Info educativa. NO receta medica. Consulta tu medico.</span></div>`;

      // My supplements
      h+=`<div class="sec"><div class="sec-t">💊 Mis Suplementos</div>`;
      if(mySups.length){
        const mySupData=SUPS.filter(s=>mySups.includes(s.id));
        mySupData.forEach(s=>{
          h+=`<div class="c" style="padding:8px 12px"><div style="display:flex;justify-content:space-between;align-items:center">
            <div><span style="margin-right:6px">${s.icon}</span><b style="font-size:13px">${s.name}</b></div>
            <button class="btn-danger" style="padding:4px 10px;font-size:10px" data-a="rmSup" data-id="${s.id}">Quitar</button></div>
            ${s.schedule?`<div style="font-size:11px;color:var(--t2);margin-top:4px">⏰ ${s.schedule.time} (${s.schedule.label}) · ${s.schedule.amount}</div>`:''}</div>`;
        });
      }else h+=`<div class="c" style="text-align:center;color:var(--t3);padding:16px">No tienes suplementos activos. Agrega abajo.</div>`;
      h+=`</div>`;

      // All supplements catalog
      h+=`<div class="sec"><div class="sec-t">📦 Catalogo</div>`;
      SUPS.forEach(s=>{
        const active=mySups.includes(s.id);
        const pc=s.prio==='alta'?'var(--green)':s.prio==='media'?'var(--yellow)':'var(--t3)';
        h+=`<div class="c sup-card"><div class="sup-hdr" data-a="tog" data-t="sup_${s.id}">
          <span class="sup-icon">${s.icon}</span><div style="flex:1"><div class="sup-name">${s.name}</div>
          <div class="sup-prio" style="color:${pc}">${s.prio==='alta'?'MUY RECOMENDADO':s.prio==='media'?'RECOMENDADO':'OPCIONAL'}</div></div>
          <span style="font-size:11px;color:var(--t3)">▼</span></div>
          <div style="padding:0 12px 10px"><div class="sup-rec">💡 <b>Para ti:</b> ${s.forYou}</div>
          ${!active?`<button class="btn-accent" style="width:100%;margin-top:8px;font-size:12px" data-a="addSup" data-id="${s.id}">+ Agregar a mi rutina</button>`
            :`<div style="text-align:center;font-size:11px;color:var(--green);margin-top:6px">✅ En tu rutina</div>`}</div>
          <div class="sup-body hide" id="sup_${s.id}">
            <div class="sup-sec"><div class="sup-sl" style="color:var(--green)">✅ Beneficios</div><div class="sup-st">${s.ben.map(b=>'• '+b).join('<br>')}</div></div>
            <div class="sup-sec"><div class="sup-sl" style="color:var(--yellow)">⚠️ Contras</div><div class="sup-st">${s.con.map(c=>'• '+c).join('<br>')}</div></div>
            <div class="sup-sec"><div class="sup-sl" style="color:var(--red)">🚨 Efectos Adversos</div><div class="sup-st">${s.side}</div></div>
            <div class="sup-sec"><div class="sup-sl" style="color:var(--blue)">💊 Dosis</div><div class="sup-st">${s.dose}</div></div>
            <div class="sup-sec"><div class="sup-sl" style="color:var(--purple)">⏰ Cuando</div><div class="sup-st">${s.when}</div></div>
            <div class="sup-sec"><div class="sup-sl" style="color:var(--t2)">🏷️ Marcas</div><div class="sup-st">${s.brands}</div></div>
          </div></div>`;
      });
      h+=`</div><div class="rem"><div class="rem-t">📋 Recordatorio</div><div class="rem-i">NO es receta medica. Consulta profesional.</div><div class="rem-i">Suplementos COMPLEMENTAN, no reemplazan alimentacion.</div></div>`;
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

    h+=`<div class="sec"><div class="sec-t">🔔 Notificaciones</div><div class="c">
      ${[['notif','🔔 Notificaciones','Todas las alertas'],['morning','☀️ Briefing','Resumen 6 AM'],['meal','🍽️ Comidas','10 min antes'],['water','💧 Agua','Cada 2 horas'],['gym','🏋️ Ejercicio','Antes gym/cardio'],['sleep','😴 Dormir','9:45 PM']].map(([k,l,s])=>
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
      <button class="btn-outline" data-a="export" style="width:100%">Exportar datos</button></div></div>`;

    h+=`<div class="sec"><div class="c" style="text-align:center;padding:16px"><div style="font-size:30px">💪</div>
      <div style="font-weight:700;margin-top:4px">Libra Fit Assistant v1.0</div>
      <div style="font-size:11px;color:var(--t3)">Backend seguro &bull; JWT Auth &bull; Encrypted DB</div></div></div>`;

    return h;
  },

  // ===== EVENT BINDING =====
  bind(el){
    el.onclick=e=>{
      const t=e.target.closest('[data-a]');if(!t)return;
      const a=t.dataset.a,st=getDay();

      if(a==='meal'){st.meals[t.dataset.k]=!st.meals[t.dataset.k];saveDay(st);this.renderAll();this.toast(st.meals[t.dataset.k]?'✅ Completado':'↩ Desmarcado')}
      if(a==='water'){st.water=Math.max(0,st.water+parseInt(t.dataset.v));saveDay(st);
        if(st.water>=4000&&st.water-parseInt(t.dataset.v)<4000)this.modal('🎉 4 Litros!','<p>Meta de agua cumplida!</p>');
        this.renderAll()}
      if(a==='rmExtra'){st.extras.splice(+t.dataset.i,1);saveDay(st);this.renderAll()}
      if(a==='tog'){const el=document.getElementById(t.dataset.t);if(el)el.classList.toggle('hide')}
      if(a==='go'){this.goTo(+t.dataset.p)}
      if(a==='subtab'){this.subTabs[t.dataset.p]=t.dataset.v;this.renderPage({Comida:1,Gym:2,Progreso:3}[t.dataset.p]);this.bind(document.getElementById('page'+t.dataset.p))}

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
        const eid=t.dataset.e,si=+t.dataset.s,dow=new Date().getDay(),sch=SCHED[dow],rut=sch.g==='A'?RUT_A:RUT_B,exDef=rut.ex.find(x=>x.id===eid);
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
      if(a==='export'){const d={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k.startsWith('fr_'))d[k]=localStorage.getItem(k)}
        const b=new Blob([JSON.stringify(d,null,2)],{type:'application/json'}),u=URL.createObjectURL(b),l=document.createElement('a');l.href=u;l.download=`fitricardo_${dk()}.json`;l.click()}

      if(a==='logout'){if(typeof Auth!=='undefined'){Auth.logout();localStorage.removeItem('fr_offline')}}
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
      if(a==='syncNow'){
        if(typeof Sync!=='undefined'){
          Sync.migrateToServer().then(()=>{this.toast('Datos sincronizados')}).catch(()=>{this.toast('Error de sync')})
        }
      }
    };
  }
};

// Service Worker for PWA install & offline
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
