// ================================================================
//  LIBRA FIT - TRACKING VIEWS
// ================================================================
//  Graficas SVG nativas (sin librerias externas).
//  Vistas: semanal, mensual, anual para cualquier metrica.
//
//  Metricas soportadas:
//   - score    (score diario 0-100)
//   - cal      (calorias consumidas)
//   - protein  (proteina diaria g)
//   - carbs    (carbohidratos diarios g)
//   - fat      (grasa diaria g)
//   - water    (agua diaria mL)
//   - weight   (peso corporal lb/kg)
//   - steps    (pasos, futuro)
// ================================================================

const Tracking = {
  // ===== DATA COLLECTION =====
  // Obtener valor de una metrica en un dia especifico
  getDayValue(date, metric) {
    const st = getDay(date);
    const dow = date.getDay();

    switch(metric) {
      case 'score':
        return getDayScore(date).pct;

      case 'cal':
        return Math.round(todayCal(st, dow));

      case 'protein':
        return Math.round(todayMacros(st, dow).protein);

      case 'carbs':
        return Math.round(todayMacros(st, dow).carbs);

      case 'fat':
        return Math.round(todayMacros(st, dow).fat);

      case 'fiber':
        return Math.round(todayMacros(st, dow).fiber);

      case 'water':
        return Math.round(st.water / 1000 * 10) / 10;  // en litros

      case 'weight': {
        const weights = getWeights();
        const dkStr = dk(date);
        const entry = weights.find(w => w.date === dkStr);
        return entry ? entry.weight : null;
      }

      default:
        return 0;
    }
  },

  // ===== DATA WINDOWS =====
  // Semana (ultimos 7 dias)
  getWeekData(metric) {
    const data = [];
    for(let i=6; i>=0; i--){
      const d = new Date(); d.setDate(d.getDate() - i);
      data.push({
        date: dk(d),
        label: DAY_SHORT[d.getDay()],
        value: this.getDayValue(d, metric)
      });
    }
    return data;
  },

  // Mes (dias 1-hoy del mes actual)
  getMonthData(metric) {
    const data = [];
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
    for(let day=1; day<=daysInMonth; day++){
      const d = new Date(now.getFullYear(), now.getMonth(), day);
      if(d > now) break;
      data.push({
        date: dk(d),
        label: String(day),
        value: this.getDayValue(d, metric)
      });
    }
    return data;
  },

  // Ano (promedio/total por mes del ano actual)
  getYearData(metric) {
    const data = [];
    const now = new Date();
    for(let month=0; month<=now.getMonth(); month++){
      const values = [];
      const daysInMonth = new Date(now.getFullYear(), month+1, 0).getDate();
      for(let day=1; day<=daysInMonth; day++){
        const d = new Date(now.getFullYear(), month, day);
        if(d > now) break;
        const v = this.getDayValue(d, metric);
        if(v != null && v !== 0) values.push(v);
      }
      // Score y peso usan promedio. Otras metricas usan promedio tambien
      // (puede cambiar a suma para agua/cal si se prefiere)
      const avg = values.length ? Math.round(values.reduce((a,b)=>a+b,0) / values.length) : 0;
      data.push({
        month,
        label: MONTHS_SHORT[month] || MONTHS[month].slice(0,3),
        value: avg,
        count: values.length
      });
    }
    return data;
  },

  // ===== SVG CHARTS (minimalista, sin librerias) =====
  // Bar chart simple
  renderBarChart(data, opts = {}) {
    const w = opts.width || 300;
    const h = opts.height || 120;
    const pad = opts.padding || 16;
    const color = opts.color || 'var(--accent)';
    const showValues = opts.showValues !== false;
    const target = opts.target || null;   // linea de meta

    if(!data.length) return '<div class="chart-empty">Sin datos</div>';

    const max = Math.max(...data.map(d => d.value || 0), target || 0, 1);
    const barW = (w - pad*2) / data.length;
    const barGap = Math.max(2, barW * 0.15);
    const innerBarW = barW - barGap;

    let bars = '';
    data.forEach((d, i) => {
      const val = d.value || 0;
      const barH = max > 0 ? (val / max) * (h - pad*2) : 0;
      const x = pad + i * barW + barGap/2;
      const y = h - pad - barH;
      bars += `<rect x="${x}" y="${y}" width="${innerBarW}" height="${barH}"
                     fill="${color}" rx="2" opacity="${val > 0 ? 1 : 0.2}"/>`;
      if(showValues && val > 0){
        bars += `<text x="${x + innerBarW/2}" y="${y - 3}" fill="var(--t3)"
                       text-anchor="middle" font-size="9">${val}</text>`;
      }
      bars += `<text x="${x + innerBarW/2}" y="${h - 4}" fill="var(--t3)"
                     text-anchor="middle" font-size="9">${d.label}</text>`;
    });

    // Target line
    let targetLine = '';
    if(target && max > 0){
      const targetY = h - pad - (target / max) * (h - pad*2);
      targetLine = `<line x1="${pad}" y1="${targetY}" x2="${w-pad}" y2="${targetY}"
                          stroke="var(--yellow)" stroke-width="1" stroke-dasharray="3,3" opacity="0.6"/>
                    <text x="${w-pad}" y="${targetY - 3}" fill="var(--yellow)"
                          text-anchor="end" font-size="9">meta: ${target}</text>`;
    }

    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg"
                 style="width:100%;height:${h}px;display:block">
              ${targetLine}
              ${bars}
            </svg>`;
  },

  // Line chart (para peso u otras metricas continuas)
  renderLineChart(data, opts = {}) {
    const w = opts.width || 300;
    const h = opts.height || 120;
    const pad = opts.padding || 16;
    const color = opts.color || 'var(--accent)';
    const fillColor = opts.fillColor || color;

    // Filtrar puntos nulos
    const valid = data.map((d, i) => ({ ...d, i })).filter(d => d.value != null);
    if(valid.length < 2){
      return `<div class="chart-empty" style="text-align:center;padding:20px;color:var(--t3);font-size:12px">
                Necesitas al menos 2 registros
              </div>`;
    }

    const values = valid.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const xStep = (w - pad*2) / (data.length - 1 || 1);
    const points = valid.map(d => {
      const x = pad + d.i * xStep;
      const y = h - pad - ((d.value - min) / range) * (h - pad*2);
      return `${x},${y}`;
    }).join(' ');

    // Area fill
    const firstX = pad + valid[0].i * xStep;
    const lastX = pad + valid[valid.length-1].i * xStep;
    const areaPoints = `${firstX},${h-pad} ${points} ${lastX},${h-pad}`;

    // Labels de min/max
    const maxLabel = `<text x="${pad}" y="${pad + 8}" fill="var(--t3)" font-size="9">${max}</text>`;
    const minLabel = `<text x="${pad}" y="${h - pad - 3}" fill="var(--t3)" font-size="9">${min}</text>`;

    // Labels en eje X (primero y ultimo)
    const xLabels = `
      <text x="${firstX}" y="${h - 2}" fill="var(--t3)" font-size="9" text-anchor="start">${valid[0].label}</text>
      <text x="${lastX}" y="${h - 2}" fill="var(--t3)" font-size="9" text-anchor="end">${valid[valid.length-1].label}</text>
    `;

    // Puntos
    let dots = '';
    valid.forEach(d => {
      const x = pad + d.i * xStep;
      const y = h - pad - ((d.value - min) / range) * (h - pad*2);
      dots += `<circle cx="${x}" cy="${y}" r="3" fill="${color}" stroke="var(--bg2)" stroke-width="1.5"/>`;
    });

    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg"
                 style="width:100%;height:${h}px;display:block">
              <polygon points="${areaPoints}" fill="${fillColor}" opacity="0.15"/>
              <polyline points="${points}" fill="none" stroke="${color}" stroke-width="2"
                        stroke-linejoin="round" stroke-linecap="round"/>
              ${dots}
              ${maxLabel}
              ${minLabel}
              ${xLabels}
            </svg>`;
  },

  // ===== METADATA DE METRICAS =====
  metrics: {
    score:   { label:'Puntuacion diaria',  color:'var(--accent)', unit:'%',   chart:'bar' },
    cal:     { label:'Calorias',           color:'var(--red)',    unit:'cal', chart:'bar' },
    protein: { label:'Proteina',           color:'var(--blue)',   unit:'g',   chart:'bar' },
    carbs:   { label:'Carbohidratos',      color:'var(--yellow)', unit:'g',   chart:'bar' },
    fat:     { label:'Grasas',             color:'var(--green)',  unit:'g',   chart:'bar' },
    fiber:   { label:'Fibra',              color:'var(--green)',  unit:'g',   chart:'bar' },
    water:   { label:'Agua',               color:'var(--blue)',   unit:'L',   chart:'bar' },
    weight:  { label:'Peso corporal',      color:'var(--accent)', unit:'lbs', chart:'line' }
  },

  // ===== FULL RENDERER =====
  // Retorna HTML completo para una metrica en un periodo
  renderTracking(metric, period = 'week') {
    const meta = this.metrics[metric] || { label: metric, color:'var(--accent)', unit:'', chart:'bar' };
    let data;
    if(period === 'week')  data = this.getWeekData(metric);
    else if(period === 'month') data = this.getMonthData(metric);
    else if(period === 'year')  data = this.getYearData(metric);
    else data = this.getWeekData(metric);

    // Calcular stats
    const values = data.map(d => d.value).filter(v => v != null && v !== 0);
    const avg = values.length ? Math.round(values.reduce((a,b)=>a+b,0) / values.length) : 0;
    const total = values.reduce((a,b)=>a+b,0);
    const max = values.length ? Math.max(...values) : 0;
    const min = values.length ? Math.min(...values) : 0;

    // Target si aplica (para cal/protein usar macroTargets)
    let target = null;
    if(typeof macroTargets === 'function'){
      const t = macroTargets();
      if(metric === 'cal') target = t.cal || t.target;
      if(metric === 'protein') target = t.protein;
      if(metric === 'carbs') target = t.carbs;
      if(metric === 'fat') target = t.fat;
      if(metric === 'fiber') target = t.fiber;
    }
    if(metric === 'water'){
      const s = getSettings();
      target = ((s.waterTarget || 2500) / 1000);
    }

    const chartHTML = meta.chart === 'line'
      ? this.renderLineChart(data, { color: meta.color })
      : this.renderBarChart(data, { color: meta.color, target });

    return `
      <div class="track-stats">
        <div class="track-stat">
          <div class="track-stat-v">${avg}</div>
          <div class="track-stat-l">Promedio</div>
        </div>
        <div class="track-stat">
          <div class="track-stat-v">${max}</div>
          <div class="track-stat-l">Maximo</div>
        </div>
        <div class="track-stat">
          <div class="track-stat-v">${min || '-'}</div>
          <div class="track-stat-l">Minimo</div>
        </div>
      </div>
      <div class="track-chart">${chartHTML}</div>
    `;
  }
};
