/**
 * supplementsDB.js - Libra Fit Supplements Database
 * Basado en research/SUPPLEMENTS.md (ISSN, NIH, PubMed, Examine.com).
 *
 * Cada suplemento tiene:
 *  - Dosis optima + maxima segura
 *  - Evidencia cientifica (A/B/C/D)
 *  - Metas para las que sirve
 *  - Contraindicaciones + interacciones
 *  - Costo mensual estimado
 *  - Forma de dosificacion
 *
 * Usado por:
 *  - Onboarding (usuario selecciona sus supps)
 *  - Libra Coach (detecta abuso / combinaciones peligrosas)
 *  - Recomendador (sugiere supps segun meta)
 */

// Helper compacto
function _s(id, name, cat, evidenceTier, data) {
  return {
    id, name, category: cat, evidenceTier,
    mainBenefit: data.mainBenefit || '',
    bestFor: data.bestFor || [],
    dose: data.dose || {},
    safeUpperLimit: data.safeUpperLimit || null,
    sideEffects: data.sideEffects || [],
    contraindications: data.contraindications || [],
    interactions: data.interactions || [],
    cost: data.cost || { monthly: '?', value: 'medio' },
    timing: data.timing || null,
    cycling: data.cycling || null,
    notes: data.notes || '',
    wadaBanned: data.wadaBanned || false
  };
}

const SUPPLEMENTS = [
  // ===== TIER A (evidencia fuerte) =====
  _s('creatina_monohidrato', 'Creatina Monohidrato', 'aminoacidos_derivados', 'A', {
    mainBenefit: 'Aumenta fuerza y masa muscular',
    bestFor: ['muscle_gain', 'strength'],
    dose: { daily: '3-5 g', loading: '20 g/dia por 5-7 dias (opcional)', maintenance: '5 g/dia' },
    safeUpperLimit: '10 g/dia',
    sideEffects: ['Retencion de agua intracelular (no peligroso)', 'Malestar GI si >5g de una vez'],
    contraindications: ['Enfermedad renal pre-existente'],
    interactions: ['Aumentar ingesta de agua ~500ml extra/dia'],
    cost: { monthly: '$8-20', value: 'excelente' },
    timing: 'Cualquier momento. Mejor con carbs/protein post-entreno',
    cycling: 'No necesario',
    notes: 'El suplemento mas estudiado. Seguro y efectivo para cualquiera que entrene.'
  }),

  _s('whey_protein', 'Whey Protein', 'proteinas', 'A', {
    mainBenefit: 'Completa los requerimientos de proteina diaria',
    bestFor: ['muscle_gain', 'fat_loss', 'strength'],
    dose: { daily: '20-40 g por toma', servingSize: '1 scoop = ~30g' },
    safeUpperLimit: 'No aplica (es alimento)',
    sideEffects: ['Hinchazon si intolerante a lactosa'],
    contraindications: ['Alergia lacteos (usar vegan protein)'],
    cost: { monthly: '$25-50', value: 'bueno' },
    timing: 'Post-entreno o entre comidas',
    notes: 'Practico para hitting 1.6-2.2 g/kg proteina. Alternativas: caseina, vegan.'
  }),

  _s('cafeina', 'Cafeina', 'estimulantes', 'A', {
    mainBenefit: 'Mejora rendimiento y energia',
    bestFor: ['fat_loss', 'endurance', 'strength'],
    dose: { daily: '100-400 mg', preWorkout: '3-6 mg/kg peso corporal' },
    safeUpperLimit: '400 mg/dia (adultos sanos)',
    sideEffects: ['Ansiedad', 'Insomnio si tarde', 'Taquicardia'],
    contraindications: ['Hipertension severa', 'Arritmias', 'Ansiedad'],
    interactions: ['No combinar con >200mg cafe + pre-workouts + energy drinks'],
    cost: { monthly: '$1-5', value: 'excelente' },
    timing: '30-45 min antes del entreno. No despues de las 2 PM.',
    cycling: '1-2 semanas off cada 8 semanas para resetear tolerancia',
    notes: 'Incluye cafe, te, chocolate. Suma tu cafeina total del dia.'
  }),

  _s('vitamina_d3', 'Vitamina D3', 'vitaminas', 'A', {
    mainBenefit: 'Salud osea, inmunidad, testosterona, estado animo',
    bestFor: ['fat_loss', 'muscle_gain', 'endurance', 'strength', 'maintenance'],
    dose: { daily: '1000-4000 IU', optimal: '2000-4000 IU' },
    safeUpperLimit: '4000 IU/dia (cronicamente)',
    sideEffects: ['Nauseas si excede UL', 'Calcificacion si >10000 IU cronico'],
    contraindications: ['Hipercalcemia', 'Sarcoidosis'],
    cost: { monthly: '$3-8', value: 'excelente' },
    timing: 'Con grasa en la comida (mejor absorcion)',
    notes: 'Alto % de adultos tiene deficiencia. Considera medir niveles si puedes.'
  }),

  _s('omega_3', 'Omega 3 (EPA/DHA)', 'acidos_grasos', 'A', {
    mainBenefit: 'Salud cardiovascular, anti-inflamatorio, posible MPS',
    bestFor: ['muscle_gain', 'endurance', 'maintenance', 'fat_loss'],
    dose: { daily: '1-3 g EPA+DHA combinados' },
    safeUpperLimit: '5 g/dia EPA+DHA',
    sideEffects: ['Eructos con sabor a pescado (comprar con recubrimiento)'],
    contraindications: ['Anticoagulantes (warfarina) - consultar medico'],
    interactions: ['Warfarina, aspirina - riesgo sangrado'],
    cost: { monthly: '$10-25', value: 'excelente' },
    timing: 'Con comida',
    notes: 'Si comes pescado graso 2x/sem, no necesitas. Solo si tu dieta es baja en pescado.'
  }),

  _s('beta_alanina', 'Beta-Alanina', 'aminoacidos_derivados', 'A', {
    mainBenefit: 'Mejora rendimiento en esfuerzos 1-4 minutos',
    bestFor: ['strength', 'endurance'],
    dose: { daily: '3.2-6.4 g dividido en 2-4 tomas' },
    safeUpperLimit: '6.4 g/dia',
    sideEffects: ['Parestesia (hormigueo en piel) - inofensivo'],
    cost: { monthly: '$10-15', value: 'bueno' },
    timing: 'Cualquier momento. Dividir dosis para reducir hormigueo',
    notes: 'Tarda 4-6 semanas en saturar carnosina muscular.'
  }),

  _s('citrulina_malato', 'Citrulina Malato', 'aminoacidos_derivados', 'B+', {
    mainBenefit: 'Ergogenico en entrenamiento de fuerza',
    bestFor: ['strength', 'muscle_gain'],
    dose: { preWorkout: '6-8 g 30-60 min antes del entreno' },
    safeUpperLimit: '10 g/dia',
    sideEffects: ['Malestar GI en dosis altas'],
    cost: { monthly: '$10-20', value: 'bueno' },
    timing: '30-60 min pre-entreno',
    notes: 'Mejora pump y reduce fatiga muscular.'
  }),

  _s('nitratos_remolacha', 'Nitratos (Remolacha)', 'nitratos', 'A', {
    mainBenefit: 'Mejora endurance y reduce presion arterial',
    bestFor: ['endurance'],
    dose: { preWorkout: '400-800 mg nitrato o 300-500 ml jugo' },
    sideEffects: ['Coloracion rosada en orina y heces (inofensivo)'],
    contraindications: ['Uso de medicamentos para disfuncion erectil'],
    cost: { monthly: '$15-30', value: 'bueno' },
    timing: '2-3 horas antes del ejercicio',
    notes: 'Principalmente util para atletas de endurance.'
  }),

  _s('electrolitos', 'Electrolitos (Sodio/Potasio/Magnesio)', 'electrolitos', 'A', {
    mainBenefit: 'Previene hiponatremia y calambres en ejercicio prolongado',
    bestFor: ['endurance'],
    dose: { perHour: '300-700 mg sodio/hora + reponer perdidas' },
    sideEffects: ['Nauseas si excedes'],
    cost: { monthly: '$5-15', value: 'bueno' },
    timing: 'Durante ejercicio >60 min o ambiente caluroso',
    notes: 'Solo necesario en entrenamientos >60-90 min o condiciones calurosas.'
  }),

  _s('magnesio_glicinato', 'Magnesio Glicinato', 'minerales', 'B', {
    mainBenefit: 'Mejora sueno, reduce calambres, recuperacion',
    bestFor: ['muscle_gain', 'endurance', 'strength', 'maintenance'],
    dose: { daily: '200-400 mg' },
    safeUpperLimit: '350 mg/dia (suplemento)',
    sideEffects: ['Diarrea si excedes', 'Citrato mas laxante que glicinato'],
    cost: { monthly: '$5-15', value: 'bueno' },
    timing: '30-60 min antes de dormir',
    notes: 'Glicinato es la forma mas absorbible y suave con el estomago.'
  }),

  _s('zinc', 'Zinc', 'minerales', 'B', {
    mainBenefit: 'Testosterona e inmunidad (en deficientes)',
    bestFor: ['muscle_gain', 'strength'],
    dose: { daily: '15-30 mg' },
    safeUpperLimit: '40 mg/dia',
    sideEffects: ['Nauseas en ayunas', 'Deficiencia de cobre si excedes cronico'],
    interactions: ['Hierro, calcio - tomar separado'],
    cost: { monthly: '$3-8', value: 'bueno' },
    timing: 'Con comida',
    notes: 'Solo util si tienes deficiencia. No boostea T en gente normal.'
  }),

  _s('ashwagandha', 'Ashwagandha (KSM-66)', 'adaptogenos', 'B', {
    mainBenefit: 'Reduce estres, mejora sueno, modesto efecto sobre testosterona',
    bestFor: ['muscle_gain', 'strength', 'maintenance'],
    dose: { daily: '300-600 mg extracto estandarizado' },
    sideEffects: ['Somnolencia en algunas personas'],
    contraindications: ['Embarazo', 'Enfermedades autoinmunes', 'Hipertiroidismo'],
    interactions: ['Inmunosupresores', 'Sedantes'],
    cost: { monthly: '$15-25', value: 'bueno' },
    timing: 'Noche (para sueno) o manana (para estres)',
    notes: 'KSM-66 es la forma mejor estudiada.'
  }),

  _s('melatonina', 'Melatonina', 'sueno', 'B', {
    mainBenefit: 'Mejora inicio del sueno',
    bestFor: ['maintenance'],
    dose: { daily: '0.3-1 mg (no necesitas mas)', maxRecommended: '3 mg' },
    safeUpperLimit: '5 mg/dia',
    sideEffects: ['Somnolencia matutina si dosis alta', 'Pesadillas vividas'],
    contraindications: ['Embarazo', 'Medicamentos anticoagulantes'],
    interactions: ['Alcohol - evitar'],
    cost: { monthly: '$3-10', value: 'bueno' },
    timing: '30-60 min antes de dormir',
    cycling: 'Usar periodicamente, no diario cronico',
    notes: 'Mucha gente toma demasiado. 0.3 mg es suficiente.'
  }),

  _s('multivitaminico', 'Multivitaminico', 'vitaminas', 'C', {
    mainBenefit: 'Cubre deficiencias menores',
    bestFor: ['maintenance'],
    dose: { daily: '1 tableta' },
    safeUpperLimit: 'Seguir dosis de etiqueta',
    cost: { monthly: '$5-15', value: 'medio' },
    timing: 'Con desayuno',
    notes: 'No reemplaza una buena alimentacion. Seguro pero evidencia mixta de beneficio real.'
  }),

  // ===== TIER B/C (evidencia moderada) =====
  _s('caseina', 'Caseina', 'proteinas', 'B', {
    mainBenefit: 'Proteina de liberacion lenta, ideal pre-dormir',
    bestFor: ['muscle_gain'],
    dose: { daily: '30-40 g antes de dormir' },
    sideEffects: ['Hinchazon si intolerante a lactosa'],
    contraindications: ['Alergia lacteos'],
    cost: { monthly: '$25-40', value: 'medio' },
    timing: 'Antes de dormir',
    notes: 'Opcional. Whey puede sustituir si el total diario es adecuado.'
  }),

  _s('bcaa', 'BCAA (Branched Chain Amino Acids)', 'aminoacidos', 'C', {
    mainBenefit: 'Marginal si la proteina diaria es suficiente',
    bestFor: [],
    dose: { perServing: '5-10 g' },
    cost: { monthly: '$15-30', value: 'pobre' },
    notes: 'Si consumes suficiente proteina (1.6g/kg+), BCAA es redundante. Gasto innecesario para la mayoria.'
  }),

  _s('glutamina', 'Glutamina', 'aminoacidos', 'D', {
    mainBenefit: 'Marginal para musculo. Posible beneficio en GI en algunas condiciones.',
    bestFor: [],
    dose: { daily: '5-10 g' },
    cost: { monthly: '$15-25', value: 'pobre' },
    notes: 'Evidencia DEBIL para gaining muscle. Sobrevalorada.'
  }),

  // ===== PELIGROSOS / REQUIEREN CUIDADO =====
  _s('yohimbina', 'Yohimbina', 'estimulantes', 'C', {
    mainBenefit: 'Posible efecto en perdida de grasa localizada (en deficit + ayuno)',
    bestFor: ['fat_loss'],
    dose: { daily: '0.2 mg/kg peso corporal' },
    safeUpperLimit: '0.3 mg/kg',
    sideEffects: ['Ansiedad', 'Taquicardia', 'Insomnio', 'Nauseas'],
    contraindications: ['Ansiedad', 'Hipertension', 'Cardiovascular disease', 'Antidepresivos'],
    interactions: ['Cafeina - potencia efectos', 'ISRS - sindrome serotoninergico'],
    cost: { monthly: '$15-25', value: 'peligroso' },
    timing: 'Manana en ayunas',
    notes: 'Usar con precaucion. Monitorea presion arterial.'
  }),

  _s('sinefrina', 'Sinefrina', 'estimulantes', 'C', {
    mainBenefit: 'Efecto termogenico leve',
    bestFor: ['fat_loss'],
    dose: { daily: '20-50 mg' },
    safeUpperLimit: '50 mg/dia',
    sideEffects: ['Taquicardia', 'Hipertension'],
    contraindications: ['Cardiovascular issues', 'Hipertension'],
    interactions: ['Cafeina >200mg - taquicardia grave'],
    cost: { monthly: '$15-25', value: 'pobre' },
    notes: 'No combinar con cafeina en dosis altas.'
  }),

  _s('5_htp', '5-HTP', 'sueno', 'C', {
    mainBenefit: 'Posible mejora de sueno y estado animico',
    bestFor: [],
    dose: { daily: '50-300 mg' },
    safeUpperLimit: '400 mg/dia',
    sideEffects: ['Nauseas', 'Diarrea'],
    contraindications: ['Embarazo', 'Antidepresivos (ISRS) - sindrome serotoninergico'],
    interactions: ['ISRS, IMAO, triptanes - MUY PELIGROSO (sindrome serotoninergico)'],
    cost: { monthly: '$10-20', value: 'medio' },
    notes: 'NUNCA combinar con antidepresivos.'
  }),

  // ===== INEFICACES / SCAMS =====
  _s('tribulus', 'Tribulus Terrestris', 'testosterona_natural', 'D', {
    mainBenefit: 'Ninguno demostrado',
    bestFor: [],
    dose: { daily: 'N/A' },
    cost: { monthly: '$20-35', value: 'scam' },
    notes: 'Evidencia cientifica DEBIL. No aumenta testosterona en humanos. Ahorra tu dinero.'
  }),

  _s('dhea', 'DHEA', 'hormonal', 'C', {
    mainBenefit: 'Precursor hormonal - evidencia mixta',
    bestFor: [],
    dose: { daily: '25-50 mg (solo con supervision medica)' },
    contraindications: ['Jovenes', 'Cancer hormonal', 'Embarazo'],
    cost: { monthly: '$10-25', value: 'peligroso' },
    notes: 'Banned por WADA. Requiere supervision medica.',
    wadaBanned: true
  })
];

// ===== API =====
window.SupplementsDB = {
  SUPPLEMENTS,

  getSupplement(id) {
    return SUPPLEMENTS.find(s => s.id === id) || null;
  },

  search(query) {
    if(!query) return [];
    const q = String(query).toLowerCase();
    return SUPPLEMENTS.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.id.includes(q.replace(/\s/g, '_')) ||
      (s.mainBenefit || '').toLowerCase().includes(q)
    );
  },

  byCategory(cat) {
    return SUPPLEMENTS.filter(s => s.category === cat);
  },

  byGoal(goal) {
    return SUPPLEMENTS
      .filter(s => s.bestFor && s.bestFor.includes(goal))
      .sort((a, b) => {
        const tierOrder = { 'A': 0, 'B+': 1, 'B': 2, 'C': 3, 'D': 4 };
        return (tierOrder[a.evidenceTier] || 99) - (tierOrder[b.evidenceTier] || 99);
      });
  },

  getCategories() {
    const cats = new Set();
    SUPPLEMENTS.forEach(s => cats.add(s.category));
    return Array.from(cats);
  },

  // Detectar abuso de dosis (Libra Coach lo usa)
  checkDose(supId, doseInGramsOrMg) {
    const s = this.getSupplement(supId);
    if(!s || !s.safeUpperLimit) return null;
    // Parse numerico del upper limit
    const ulMatch = String(s.safeUpperLimit).match(/([\d.]+)/);
    if(!ulMatch) return null;
    const ul = parseFloat(ulMatch[1]);
    if(doseInGramsOrMg > ul) {
      return {
        warning: true,
        message: `Tu dosis de ${s.name} (${doseInGramsOrMg}) excede el limite seguro (${s.safeUpperLimit}).`,
        severity: doseInGramsOrMg > ul * 1.5 ? 'high' : 'medium'
      };
    }
    return null;
  },

  // Detectar combinaciones peligrosas
  checkCombinations(userSupIds) {
    const warnings = [];
    const set = new Set(userSupIds);

    // Yohimbina + Cafeina
    if(set.has('yohimbina') && set.has('cafeina')) {
      warnings.push({ severity: 'high', message: 'Yohimbina + Cafeina: riesgo cardiovascular. Separar dosis o eliminar una.' });
    }
    // Sinefrina + Cafeina alta
    if(set.has('sinefrina') && set.has('cafeina')) {
      warnings.push({ severity: 'medium', message: 'Sinefrina + Cafeina: taquicardia. Monitorea tu frecuencia cardiaca.' });
    }
    // 5-HTP solo (warning general sobre antidepresivos)
    if(set.has('5_htp')) {
      warnings.push({ severity: 'high', message: '5-HTP: NUNCA combinar con antidepresivos (ISRS, IMAO). Riesgo grave.' });
    }
    // BCAA + whey (redundante)
    if(set.has('bcaa') && set.has('whey_protein')) {
      warnings.push({ severity: 'info', message: 'BCAA + Whey: BCAA es redundante si ya tomas whey. Ahorra ese dinero.' });
    }
    // Glutamina (poca evidencia)
    if(set.has('glutamina')) {
      warnings.push({ severity: 'info', message: 'Glutamina: evidencia debil para ganar musculo. Considera eliminar.' });
    }
    // Tribulus (scam)
    if(set.has('tribulus')) {
      warnings.push({ severity: 'info', message: 'Tribulus: sin evidencia cientifica. No funciona. Ahorra tu dinero.' });
    }

    return warnings;
  },

  // Recomendacion stack segun meta
  recommendStack(goal) {
    // Tier A/B+ evidence only
    const strong = SUPPLEMENTS.filter(s =>
      s.bestFor.includes(goal) &&
      ['A', 'B+', 'B'].includes(s.evidenceTier)
    );
    return strong.slice(0, 6);
  },

  count() {
    return SUPPLEMENTS.length;
  }
};

if(typeof module !== 'undefined' && module.exports) {
  module.exports = { SUPPLEMENTS, SupplementsDB: window.SupplementsDB };
}
