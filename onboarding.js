// ================================================================
//  LIBRA FIT - ONBOARDING v2 (conversacional multi-paso)
// ================================================================
//  Se dispara al crear cuenta o si el perfil esta incompleto.
//  Construye perfil completo + metas medibles + plan semanal.
//
//  Pasos (saltables con [mas tarde]):
//   1. Bienvenida + nombre
//   2. Datos basicos (edad, sexo, peso, altura)
//   3. Meta principal
//   4. Detalle de meta (cuanto, cuando)
//   5. Lugar de entrenamiento
//   6. Frecuencia y horarios de entreno
//   7. Cardio (dias, tipo, duracion)
//   8. Patron alimentario
//   9. Horarios de comidas
//  10. Alergias
//  11. Suplementos actuales
//  12. Horarios de recordatorios
//  13. PIN de recuperacion
//  14. Resumen + terminar
// ================================================================

const Onboarding = {
  step: 0,
  data: {},

  // ===== ENTRY POINT =====
  start() {
    this.step = 0;
    this.data = {
      profile: { ...getProfile() },
      goals: { ...getGoals() },
      settings: { ...getSettings() },
      mySups: getMySups().slice(),
      allergens: S.g('allergens', []),
      weekSchedule: UserRoutines.getWeekSchedule(),
      cardioConfig: UserRoutines.getCardioConfig(),
      userMeals: UserMeals.getUserMeals()
    };
    this.render();
  },

  // Abrir solo si no esta completo el perfil
  shouldShow() {
    const p = getProfile();
    return !p.name || !p.age || !p.wStart;
  },

  // ===== RENDER PASO ACTUAL =====
  render() {
    const el = document.getElementById('onboardingModal');
    if(!el) this._createContainer();
    const step = this.STEPS[this.step];
    if(!step){ return this.finish(); }

    const container = document.getElementById('onboardingModal');
    container.classList.remove('hide');
    container.innerHTML = `
      <div class="onb-backdrop"></div>
      <div class="onb-box">
        <div class="onb-progress">
          <div class="onb-progress-fill" style="width:${(this.step / this.STEPS.length) * 100}%"></div>
        </div>
        <div class="onb-step">Paso ${this.step + 1} / ${this.STEPS.length}</div>
        <div class="onb-icon">${step.icon}</div>
        <h2 class="onb-title">${step.title}</h2>
        ${step.subtitle ? `<div class="onb-subtitle">${step.subtitle}</div>` : ''}
        <div class="onb-body" id="onbBody">${step.render.call(this)}</div>
        <div class="onb-actions">
          ${this.step > 0
            ? '<button class="onb-back" onclick="Onboarding.back()">← Atras</button>'
            : '<div></div>'}
          <button class="onb-next" id="onbNext" onclick="Onboarding.next()">
            ${this.step === this.STEPS.length - 1 ? '🎉 Terminar' : 'Siguiente →'}
          </button>
        </div>
      </div>
    `;
    // Focus primer input
    setTimeout(() => {
      const firstInput = container.querySelector('input, select, textarea');
      if(firstInput) firstInput.focus();
    }, 100);
  },

  _createContainer() {
    if(document.getElementById('onboardingModal')) return;
    const div = document.createElement('div');
    div.id = 'onboardingModal';
    div.className = 'onb-modal hide';
    document.body.appendChild(div);
  },

  back() {
    if(this.step > 0){ this.step--; this.render(); }
  },

  next() {
    const step = this.STEPS[this.step];
    if(step.validate){
      const err = step.validate.call(this);
      if(err){ this._showError(err); return; }
    }
    if(step.save) step.save.call(this);
    this.step++;
    this.render();
  },

  _showError(msg) {
    const body = document.getElementById('onbBody');
    if(!body) return;
    const existing = body.querySelector('.onb-error');
    if(existing) existing.remove();
    const err = document.createElement('div');
    err.className = 'onb-error';
    err.textContent = msg;
    body.appendChild(err);
    setTimeout(() => err.remove(), 4000);
  },

  finish() {
    // Guardar todo
    saveProfile(this.data.profile);
    saveGoals(this.data.goals);
    saveSettings(this.data.settings);
    saveMySups(this.data.mySups);
    S.s('allergens', this.data.allergens);
    UserRoutines.saveWeekSchedule(this.data.weekSchedule);
    UserRoutines.saveCardioConfig(this.data.cardioConfig);
    UserMeals.saveUserMeals(this.data.userMeals);
    S.s('onb_done', true);

    // Cerrar modal
    const container = document.getElementById('onboardingModal');
    if(container) container.classList.add('hide');

    // Refrescar app
    if(typeof App !== 'undefined' && App.renderAll) App.renderAll();
    if(typeof App !== 'undefined' && App.toast) App.toast('🎉 Perfil creado!');
  },

  _getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  },

  // ===== STEPS =====
  STEPS: [
    // ----- PASO 1: Bienvenida + nombre -----
    {
      icon: '👋',
      title: 'Hola! Soy Libra',
      subtitle: 'Tu coach inteligente personal. Vamos a configurar tu perfil en unos minutos.',
      render() {
        return `
          <label class="onb-label">Como te llamas?</label>
          <input type="text" id="ob_name" class="onb-input" placeholder="Tu nombre"
                 value="${this.data.profile.name || ''}" autocomplete="given-name">
        `;
      },
      validate() {
        const v = this._getVal('ob_name');
        if(!v || v.length < 2) return 'Escribe tu nombre para continuar';
        return null;
      },
      save() { this.data.profile.name = this._getVal('ob_name'); }
    },

    // ----- PASO 2: Datos basicos -----
    {
      icon: '📏',
      title: 'Tus datos basicos',
      subtitle: 'Esto me ayuda a calcular tus calorias y macros exactos.',
      render() {
        const p = this.data.profile;
        return `
          <div class="onb-row">
            <label class="onb-label">Edad</label>
            <input type="number" id="ob_age" class="onb-input" placeholder="28" min="13" max="90"
                   value="${p.age || ''}">
          </div>
          <div class="onb-row">
            <label class="onb-label">Sexo</label>
            <div class="onb-choices">
              <button class="onb-choice ${p.gender==='masculino'?'on':''}" data-v="masculino" onclick="Onboarding._pick(this,'gender')">Masculino</button>
              <button class="onb-choice ${p.gender==='femenino'?'on':''}" data-v="femenino" onclick="Onboarding._pick(this,'gender')">Femenino</button>
            </div>
          </div>
          <div class="onb-row-2">
            <div>
              <label class="onb-label">Peso actual (lbs)</label>
              <input type="number" id="ob_weight" class="onb-input" placeholder="175" min="50" max="500" step="0.1"
                     value="${p.wStart || ''}">
            </div>
            <div>
              <label class="onb-label">Altura (cm)</label>
              <input type="number" id="ob_height" class="onb-input" placeholder="175" min="120" max="230"
                     value="${p.height || ''}">
            </div>
          </div>
          <div class="onb-row">
            <label class="onb-label">Nivel de actividad diaria</label>
            <select id="ob_activity" class="onb-input">
              <option value="">Elige...</option>
              <option value="sedentario" ${p.activity==='sedentario'?'selected':''}>Sedentario (oficina, poco mov)</option>
              <option value="ligero" ${p.activity==='ligero'?'selected':''}>Ligero (ejercicio 1-3x/sem)</option>
              <option value="moderado" ${p.activity==='moderado'?'selected':''}>Moderado (ejercicio 3-5x/sem)</option>
              <option value="activo" ${p.activity==='activo'?'selected':''}>Activo (ejercicio 6-7x/sem)</option>
              <option value="muy_activo" ${p.activity==='muy_activo'?'selected':''}>Muy activo (intenso diario)</option>
            </select>
          </div>
        `;
      },
      validate() {
        const age = parseInt(this._getVal('ob_age'));
        const weight = parseFloat(this._getVal('ob_weight'));
        const height = parseInt(this._getVal('ob_height'));
        const activity = this._getVal('ob_activity');
        if(!age || age < 13) return 'Ingresa una edad valida';
        if(!weight || weight < 50) return 'Ingresa tu peso';
        if(!height || height < 120) return 'Ingresa tu altura en cm';
        if(!activity) return 'Selecciona tu nivel de actividad';
        if(!this.data.profile.gender) return 'Selecciona tu sexo';
        return null;
      },
      save() {
        this.data.profile.age = parseInt(this._getVal('ob_age'));
        this.data.profile.wStart = parseFloat(this._getVal('ob_weight'));
        this.data.profile.height = parseInt(this._getVal('ob_height'));
        this.data.profile.activity = this._getVal('ob_activity');
        // Registrar peso inicial en bw[]
        const weights = getWeights();
        if(!weights.length){
          weights.push({ date: dk(), weight: this.data.profile.wStart });
          saveWeights(weights);
        }
      }
    },

    // ----- PASO 3: Meta principal -----
    {
      icon: '🎯',
      title: 'Cual es tu meta?',
      subtitle: 'Elige una. Podemos cambiarla luego.',
      render() {
        const goal = this.data.goals.goalType;
        return `
          <div class="onb-goals">
            ${Object.entries(GOAL_TYPES).map(([k, g]) => `
              <button class="onb-goal ${goal===k?'on':''}" data-v="${k}" onclick="Onboarding._pickGoal(this)">
                <div class="onb-goal-icon">${g.icon}</div>
                <div class="onb-goal-name">${g.name}</div>
              </button>
            `).join('')}
          </div>
        `;
      },
      validate() {
        if(!this.data.goals.goalType) return 'Selecciona una meta';
        return null;
      },
      save() {
        this.data.goals.startWeight = this.data.profile.wStart;
      }
    },

    // ----- PASO 4: Detalle de meta -----
    {
      icon: '📊',
      title: 'Tu meta en numeros',
      subtitle: 'Una meta medible es una meta cumplible.',
      render() {
        const g = this.data.goals;
        const p = this.data.profile;
        const goalType = g.goalType;
        // Fecha minima: 30 dias desde hoy
        const minDate = new Date(); minDate.setDate(minDate.getDate() + 30);
        const minDateStr = dk(minDate);
        // Fecha default: 90 dias
        const defDate = new Date(); defDate.setDate(defDate.getDate() + 90);
        const defDateStr = dk(defDate);

        if(goalType === 'fat_loss' || goalType === 'muscle_gain'){
          const verb = goalType === 'fat_loss' ? 'bajar' : 'subir';
          return `
            <label class="onb-label">Cuantas libras quieres ${verb}?</label>
            <input type="number" id="ob_lbs" class="onb-input"
                   placeholder="10" min="1" max="100" step="0.5"
                   value="${g.targetWeight ? Math.abs(p.wStart - g.targetWeight) : ''}">
            <label class="onb-label" style="margin-top:12px">Fecha meta (minimo 30 dias)</label>
            <input type="date" id="ob_date" class="onb-input"
                   min="${minDateStr}" value="${g.targetDate || defDateStr}">
            <div class="onb-hint" id="ob_rate"></div>
          `;
        }
        if(goalType === 'endurance'){
          return `
            <label class="onb-label">Que distancia quieres correr?</label>
            <select id="ob_distance" class="onb-input">
              <option value="5k">5 km</option>
              <option value="10k">10 km</option>
              <option value="21k">Media maraton (21 km)</option>
              <option value="42k">Maraton (42 km)</option>
              <option value="otro">Otro</option>
            </select>
            <label class="onb-label" style="margin-top:12px">Cuando quieres lograrlo?</label>
            <input type="date" id="ob_date" class="onb-input" min="${minDateStr}" value="${defDateStr}">
            <label class="onb-label" style="margin-top:12px">Ya corres actualmente? Cuantos km por semana?</label>
            <input type="number" id="ob_currentKm" class="onb-input" placeholder="0" min="0" step="1">
          `;
        }
        if(goalType === 'strength'){
          return `
            <label class="onb-label">Cual ejercicio quieres mejorar?</label>
            <select id="ob_exercise" class="onb-input">
              <option value="press_banca">Press de banca</option>
              <option value="sentadilla">Sentadilla</option>
              <option value="peso_muerto">Peso muerto</option>
              <option value="press_militar">Press militar</option>
              <option value="dominadas">Dominadas</option>
            </select>
            <label class="onb-label" style="margin-top:12px">Peso actual (lbs)</label>
            <input type="number" id="ob_currentW" class="onb-input" placeholder="0" min="0">
            <label class="onb-label" style="margin-top:12px">Peso meta (lbs)</label>
            <input type="number" id="ob_targetW" class="onb-input" placeholder="0" min="0">
            <label class="onb-label" style="margin-top:12px">Fecha meta</label>
            <input type="date" id="ob_date" class="onb-input" min="${minDateStr}" value="${defDateStr}">
          `;
        }
        // maintenance, tone, recovery
        return `
          <label class="onb-label">Por cuanto tiempo?</label>
          <select id="ob_duration" class="onb-input">
            <option value="30">1 mes (prueba)</option>
            <option value="90" selected>3 meses (cambio real)</option>
            <option value="180">6 meses (transformacion)</option>
            <option value="365">1 ano (estilo de vida)</option>
          </select>
          <div class="onb-hint" style="margin-top:12px">
            Para metas de mantenimiento/tonificacion, la constancia importa mas que la fecha.
          </div>
        `;
      },
      save() {
        const goalType = this.data.goals.goalType;
        if(goalType === 'fat_loss' || goalType === 'muscle_gain'){
          const lbs = parseFloat(this._getVal('ob_lbs'));
          const date = this._getVal('ob_date');
          if(lbs){
            this.data.goals.targetWeight = goalType === 'fat_loss'
              ? this.data.profile.wStart - lbs
              : this.data.profile.wStart + lbs;
          }
          if(date) this.data.goals.targetDate = date;
        } else if(goalType === 'endurance'){
          this.data.goals.subGoals = [{
            type: 'distance',
            distance: this._getVal('ob_distance'),
            date: this._getVal('ob_date'),
            currentKm: parseFloat(this._getVal('ob_currentKm')) || 0
          }];
          if(this._getVal('ob_date')) this.data.goals.targetDate = this._getVal('ob_date');
        } else if(goalType === 'strength'){
          this.data.goals.subGoals = [{
            type: 'pr',
            exercise: this._getVal('ob_exercise'),
            currentWeight: parseFloat(this._getVal('ob_currentW')) || 0,
            targetWeight: parseFloat(this._getVal('ob_targetW')) || 0
          }];
          if(this._getVal('ob_date')) this.data.goals.targetDate = this._getVal('ob_date');
        } else {
          const days = parseInt(this._getVal('ob_duration')) || 90;
          const target = new Date(); target.setDate(target.getDate() + days);
          this.data.goals.targetDate = dk(target);
        }
      }
    },

    // ----- PASO 5: Lugar de entrenamiento -----
    {
      icon: '📍',
      title: 'Donde entrenas?',
      subtitle: 'Con esto te recomiendo ejercicios disponibles para ti.',
      render() {
        const current = this.data.profile.trainingLocation || null;
        return `
          <div class="onb-goals">
            ${Object.entries(TRAINING_LOCATIONS).map(([k, loc]) => `
              <button class="onb-goal ${current===k?'on':''}" data-v="${k}" onclick="Onboarding._pickLocation(this)">
                <div class="onb-goal-name">${loc.name}</div>
              </button>
            `).join('')}
          </div>
        `;
      },
      validate() {
        if(!this.data.profile.trainingLocation) return 'Selecciona un lugar';
        return null;
      }
    },

    // ----- PASO 6: Frecuencia + horarios de entreno -----
    {
      icon: '📅',
      title: 'Cuando entrenas?',
      subtitle: 'Marca los dias y elige la hora.',
      render() {
        const sched = this.data.weekSchedule || {0:null,1:null,2:null,3:null,4:null,5:null,6:null};
        const days = ['Dom','Lun','Mar','Mie','Jue','Vie','Sab'];
        return `
          <label class="onb-label">Que dias vas a entrenar?</label>
          <div class="onb-days">
            ${days.map((d, i) => `
              <button class="onb-day ${sched[i]?'on':''}" data-d="${i}" onclick="Onboarding._toggleDay(this)">${d}</button>
            `).join('')}
          </div>
          <label class="onb-label" style="margin-top:16px">A que hora entrenas?</label>
          <input type="time" id="ob_gymTime" class="onb-input"
                 value="${this.data.profile.gymTime || '18:00'}">
          <div class="onb-hint">Te avisare 15 min antes.</div>
        `;
      },
      save() {
        this.data.profile.gymTime = this._getVal('ob_gymTime') || '18:00';
        // Marcar dias con '_train' como placeholder (rutinas se asignan despues)
        Object.keys(this.data.weekSchedule).forEach(k => {
          if(this.data.weekSchedule[k] === '_train') this.data.weekSchedule[k] = '_train';
        });
      }
    },

    // ----- PASO 7: Cardio -----
    {
      icon: '🏃',
      title: 'Haces cardio?',
      subtitle: 'Opcional. Puedes saltar si no.',
      render() {
        const cfg = this.data.cardioConfig || { days:[], type:null, duration:0 };
        const days = ['Dom','Lun','Mar','Mie','Jue','Vie','Sab'];
        return `
          <label class="onb-label">Dias de cardio</label>
          <div class="onb-days">
            ${days.map((d, i) => `
              <button class="onb-day ${cfg.days.includes(i)?'on':''}" data-d="${i}" onclick="Onboarding._toggleCardioDay(this)">${d}</button>
            `).join('')}
          </div>
          <label class="onb-label" style="margin-top:16px">Tipo</label>
          <select id="ob_cardioType" class="onb-input">
            <option value="">Sin cardio</option>
            ${Object.entries(CARDIO_TYPES).map(([k, c]) =>
              `<option value="${k}" ${cfg.type===k?'selected':''}>${c.icon} ${c.name}</option>`
            ).join('')}
          </select>
          <label class="onb-label" style="margin-top:12px">Duracion (min)</label>
          <input type="number" id="ob_cardioDur" class="onb-input"
                 placeholder="20" min="0" max="180" value="${cfg.duration || 20}">
          <label class="onb-label" style="margin-top:12px">Hora</label>
          <input type="time" id="ob_cardioTime" class="onb-input" value="${cfg.time || '07:00'}">
        `;
      },
      save() {
        this.data.cardioConfig.type = this._getVal('ob_cardioType') || null;
        this.data.cardioConfig.duration = parseInt(this._getVal('ob_cardioDur')) || 0;
        this.data.cardioConfig.time = this._getVal('ob_cardioTime') || '07:00';
      }
    },

    // ----- PASO 8: Patron alimentario -----
    {
      icon: '🍽️',
      title: 'Como te alimentas?',
      subtitle: 'Para armarte un plan realista.',
      render() {
        const pat = this.data.profile.eatingPattern;
        return `
          <div class="onb-goals">
            ${Object.entries(EATING_PATTERNS).map(([k, p]) => `
              <button class="onb-goal ${pat===k?'on':''}" data-v="${k}" onclick="Onboarding._pickPattern(this)">
                <div class="onb-goal-name">${p.name}</div>
                <div class="onb-goal-desc">${p.desc}</div>
              </button>
            `).join('')}
          </div>
        `;
      }
    },

    // ----- PASO 9: Horarios de comidas -----
    {
      icon: '⏰',
      title: 'Tus horarios de comida',
      subtitle: 'Cuantas comidas y a que horas?',
      render() {
        // Default: 3-5 comidas
        const meals = this.data.userMeals && this.data.userMeals.length
          ? this.data.userMeals
          : [
              { id:'desayuno',  label:'Desayuno',  time:'07:00', days:[0,1,2,3,4,5,6], foods:[], notes:'' },
              { id:'almuerzo',  label:'Almuerzo',  time:'13:00', days:[0,1,2,3,4,5,6], foods:[], notes:'' },
              { id:'cena',      label:'Cena',      time:'19:00', days:[0,1,2,3,4,5,6], foods:[], notes:'' }
            ];
        this.data.userMeals = meals;

        return `
          <label class="onb-label">Cuantas comidas al dia?</label>
          <div class="onb-choices">
            ${[2,3,4,5,6].map(n => `
              <button class="onb-choice ${meals.length===n?'on':''}" data-v="${n}"
                      onclick="Onboarding._setMealCount(${n})">${n}</button>
            `).join('')}
          </div>
          <div id="mealTimesList" style="margin-top:16px">
            ${meals.map((m, i) => `
              <div class="onb-row">
                <label class="onb-label">${m.label}</label>
                <input type="time" class="onb-input ob_mealTime" data-i="${i}"
                       value="${m.time}">
              </div>
            `).join('')}
          </div>
        `;
      },
      save() {
        const times = document.querySelectorAll('.ob_mealTime');
        times.forEach((input, i) => {
          if(this.data.userMeals[i]) this.data.userMeals[i].time = input.value;
        });
      }
    },

    // ----- PASO 10: Alergias -----
    {
      icon: '🚫',
      title: 'Tienes alergias?',
      subtitle: 'Opcional. Selecciona las que apliquen.',
      render() {
        const current = this.data.allergens || [];
        return `
          <div class="onb-checks">
            ${Object.entries(COMMON_ALLERGENS).map(([k, a]) => `
              <label class="onb-check">
                <input type="checkbox" data-allergen="${k}" ${current.includes(k)?'checked':''}>
                <span>${a.name}</span>
              </label>
            `).join('')}
          </div>
        `;
      },
      save() {
        const checks = document.querySelectorAll('[data-allergen]');
        this.data.allergens = [];
        checks.forEach(c => {
          if(c.checked) this.data.allergens.push(c.dataset.allergen);
        });
      }
    },

    // ----- PASO 11: Suplementos actuales -----
    {
      icon: '💊',
      title: 'Tomas suplementos?',
      subtitle: 'Opcional. Selecciona los que tomas actualmente.',
      render() {
        const SDB = window.SupplementsDB;
        if(!SDB) return '<div class="onb-hint">Cargando...</div>';
        const current = this.data.mySups || [];
        // Top 10 con evidencia A/B
        const top = SDB.SUPPLEMENTS.filter(s => ['A','B+','B'].includes(s.evidenceTier)).slice(0, 12);
        return `
          <div class="onb-checks">
            ${top.map(s => `
              <label class="onb-check">
                <input type="checkbox" data-sup="${s.id}" ${current.includes(s.id)?'checked':''}>
                <span>${s.name}</span>
              </label>
            `).join('')}
          </div>
          <div class="onb-hint">Podras agregar mas en la seccion Suplementos.</div>
        `;
      },
      save() {
        const checks = document.querySelectorAll('[data-sup]');
        this.data.mySups = [];
        checks.forEach(c => {
          if(c.checked) this.data.mySups.push(c.dataset.sup);
        });
      }
    },

    // ----- PASO 12: Horarios de recordatorios -----
    {
      icon: '🔔',
      title: 'Horarios de recordatorios',
      subtitle: 'Cuando quieres que te recuerde las cosas.',
      render() {
        const s = this.data.settings;
        return `
          <label class="onb-label">Hora de despertar</label>
          <input type="time" id="ob_morning" class="onb-input" value="${s.morningTime || '07:00'}">

          <label class="onb-label" style="margin-top:12px">Hora de dormir</label>
          <input type="time" id="ob_sleep" class="onb-input" value="${s.sleepTime || '22:00'}">

          <label class="onb-label" style="margin-top:12px">Meta diaria de agua (mL)</label>
          <input type="number" id="ob_water" class="onb-input"
                 placeholder="2500" min="1000" max="6000" step="250" value="${s.waterTarget || 2500}">
          <div class="onb-hint">Sugerencia: 35 mL x kg de peso corporal.</div>
        `;
      },
      save() {
        this.data.settings.morningTime = this._getVal('ob_morning') || '07:00';
        this.data.settings.sleepTime = this._getVal('ob_sleep') || '22:00';
        this.data.settings.waterTarget = parseInt(this._getVal('ob_water')) || 2500;
      }
    },

    // ----- PASO 13: Resumen -----
    {
      icon: '✅',
      title: 'Todo listo!',
      subtitle: 'Resumen de tu perfil.',
      render() {
        const p = this.data.profile;
        const g = this.data.goals;
        const goalName = GOAL_TYPES[g.goalType]?.name || '-';
        const loc = TRAINING_LOCATIONS[p.trainingLocation]?.name || '-';
        const daysWithTraining = Object.values(this.data.weekSchedule).filter(v => v).length;

        // Calcular BMR/TDEE previa
        const tempP = { ...p };
        const bmr = calcBMR(tempP);
        const tdee = calcTDEE(tempP);

        return `
          <div class="onb-summary">
            <div class="onb-sum-row"><span>Nombre:</span> <b>${p.name}</b></div>
            <div class="onb-sum-row"><span>Meta:</span> <b>${goalName}</b></div>
            ${g.targetWeight ? `<div class="onb-sum-row"><span>Peso meta:</span> <b>${g.targetWeight} lbs</b></div>` : ''}
            ${g.targetDate ? `<div class="onb-sum-row"><span>Fecha meta:</span> <b>${g.targetDate}</b></div>` : ''}
            <div class="onb-sum-row"><span>Entrenas en:</span> <b>${loc}</b></div>
            <div class="onb-sum-row"><span>Dias de entreno:</span> <b>${daysWithTraining}/sem</b></div>
            <div class="onb-sum-row"><span>Comidas/dia:</span> <b>${this.data.userMeals.length}</b></div>
            ${bmr ? `<div class="onb-sum-row"><span>BMR:</span> <b>${bmr} cal</b></div>` : ''}
            ${tdee ? `<div class="onb-sum-row"><span>TDEE:</span> <b>${tdee} cal</b></div>` : ''}
            <div class="onb-hint" style="margin-top:12px">
              Despues de terminar, Libra te armara rutinas y comidas sugeridas segun tus datos.
              Podras editarlo todo.
            </div>
          </div>
        `;
      }
    }
  ],

  // ===== HELPERS DE UI =====
  _pick(btn, field) {
    const parent = btn.parentElement;
    parent.querySelectorAll('.onb-choice').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    this.data.profile[field] = btn.dataset.v;
  },

  _pickGoal(btn) {
    const parent = btn.parentElement;
    parent.querySelectorAll('.onb-goal').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    this.data.goals.goalType = btn.dataset.v;
  },

  _pickLocation(btn) {
    const parent = btn.parentElement;
    parent.querySelectorAll('.onb-goal').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    this.data.profile.trainingLocation = btn.dataset.v;
  },

  _pickPattern(btn) {
    const parent = btn.parentElement;
    parent.querySelectorAll('.onb-goal').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    this.data.profile.eatingPattern = btn.dataset.v;
  },

  _toggleDay(btn) {
    const d = parseInt(btn.dataset.d);
    btn.classList.toggle('on');
    if(btn.classList.contains('on')){
      this.data.weekSchedule[d] = '_train';  // placeholder, se asigna rutina luego
    } else {
      this.data.weekSchedule[d] = null;
    }
  },

  _toggleCardioDay(btn) {
    const d = parseInt(btn.dataset.d);
    btn.classList.toggle('on');
    const days = this.data.cardioConfig.days || [];
    if(btn.classList.contains('on')){
      if(!days.includes(d)) days.push(d);
    } else {
      const idx = days.indexOf(d);
      if(idx >= 0) days.splice(idx, 1);
    }
    this.data.cardioConfig.days = days;
  },

  _setMealCount(n) {
    const currentCount = this.data.userMeals.length;
    if(n === currentCount) return;
    // Plantillas predefinidas segun count
    const templates = {
      2: [['desayuno','Desayuno','08:00'], ['cena','Cena','19:00']],
      3: [['desayuno','Desayuno','07:00'], ['almuerzo','Almuerzo','13:00'], ['cena','Cena','19:00']],
      4: [['desayuno','Desayuno','07:00'], ['merienda1','Merienda','10:30'], ['almuerzo','Almuerzo','13:00'], ['cena','Cena','19:00']],
      5: [['desayuno','Desayuno','07:00'], ['merienda1','Merienda 1','10:30'], ['almuerzo','Almuerzo','13:00'], ['merienda2','Merienda 2','16:30'], ['cena','Cena','19:00']],
      6: [['desayuno','Desayuno','07:00'], ['merienda1','Merienda 1','10:00'], ['almuerzo','Almuerzo','13:00'], ['merienda2','Merienda 2','16:00'], ['cena','Cena','19:00'], ['snack','Snack nocturno','21:00']]
    };
    const tpl = templates[n] || templates[3];
    this.data.userMeals = tpl.map(([id, label, time]) => ({
      id, label, time, days:[0,1,2,3,4,5,6], foods:[], notes:''
    }));
    // Re-render
    this.render();
  }
};
