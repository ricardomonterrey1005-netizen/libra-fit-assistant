# AUDIT.md - Escaneo Completo del Codigo

> Fecha: 2026-04-19
> Proposito: Identificar codigo legacy, hardcodeado para Ricardo, o basura antes de v2.0
> Estado: PRE-MIGRACION A v2.0

---

## Resumen Ejecutivo

La app tiene **5,700 lineas de JS** distribuidas en 17 archivos. De esas, aproximadamente **~1,500 lineas son legacy/Ricardo-specific** que deben eliminarse o migrarse a configuracion por usuario en v2.0.

### Hallazgos criticos

| Categoria | Archivos afectados | Lineas | Accion |
|-----------|-------------------|--------|--------|
| **Branding "FitRicardo"** | 9 archivos | ~15 refs | RENOMBRAR a "Libra Fit" |
| **Plan de comidas hardcoded** | data.js (MEALS, MEAL_ORDER, BATCH) | ~200 lineas | ELIMINAR (reemplazado por meals.js) |
| **Rutinas hardcoded** | data.js (RUT_A, RUT_B, SCHED) | ~15 lineas | ELIMINAR (reemplazado por routines.js) |
| **Referencias legacy en UI** | app.js, libra.js, engine.js | ~68 refs | MIGRAR a usar UserMeals/UserRoutines exclusivamente |
| **FOOD duplicado** | data.js tiene 60+ alimentos que seran sustituidos por nutritionDB.js v2.0 | ~300 lineas | ELIMINAR tras v2.0 |
| **EX basico** | data.js tiene ~30 ejercicios, se reemplaza por exerciseDB.js v2.0 con 150+ | ~150 lineas | ELIMINAR tras v2.0 |
| **Notificaciones hardcoded** | engine.js Notif.check() usa IDs fijos desayuno/merienda1/etc | ~20 lineas | RESCRIBIR para usar UserMeals |
| **Fallbacks legacy en app.js** | `sch.g==='A'?RUT_A:RUT_B` | ~6 lugares | ELIMINAR cuando no haya fallback |

---

## 1. Branding Legacy "FitRicardo"

### Archivos a renombrar:
```
server/package.json          line 2   "name": "fitricardo-server"
server/package.json          line 4   "description": "FitRicardo Secure Backend"
server/package-lock.json     line 2,8 "name": "fitricardo-server"
server/db.js                 line 16  default secret 'fitricardo-secure-key-2026-...'
server/middleware.js         line 9   default JWT 'fitricardo-jwt-secret-2026-...'
server/routes/errors.js      line 54  default JWT 'fitricardo-jwt-secret-change-...'
sw.js                        line 29  notification title 'FitRicardo'
app.js                       line 898 export filename `fitricardo_${dk()}.json`
.claude/launch.json          line 5   "name": "fitricardo"
routines.js                  line 193 comment "Fallback al SCHED original de Ricardo"
```

### Accion v2.0:
Reemplazar TODO por `librafit` o `libra-fit-assistant`. Los defaults de secrets ya son safe (env vars en produccion), pero el branding se ve raro.

---

## 2. Plan de Comidas Hardcoded (data.js)

### Problema
`data.js` lineas 10-38 tienen el objeto `MEALS` con el plan EXACTO de Ricardo:
- 6 comidas fijas (desayuno, merienda1, almuerzo, merienda2, cena, fibra)
- Horarios fijos (7:00, 10:00, 12:00, 16:30, 20:30, 21:30)
- Platos especificos por dia ("Carne guisada + arroz + lentejas")
- Calorias fijas

### Lo que ya existe como reemplazo
`meals.js` - `UserMeals` con template personalizable por usuario.

### Por que todavia esta ahi
Backward compat: si el usuario no ha configurado sus comidas, cae al legacy `MEALS`.

### Accion v2.0
ELIMINAR `MEALS`, `MEAL_ORDER`, `BATCH`, `getMeal()` del data.js. Todo debe venir de `UserMeals.getUserMeals()` con template default vacio. Forzar al usuario a configurar sus comidas en onboarding.

### Referencias a limpiar
```
data.js:10-44    MEALS, MEAL_ORDER, getMeal(), BATCH
engine.js:19 refs de getMeal y MEAL_ORDER
app.js:12 refs a getMeal, MEAL_ORDER, BATCH
libra.js:25 refs
meals.js:1 ref (para fallback)
```

---

## 3. Rutinas Hardcoded (data.js)

### Problema
`data.js` lineas 208-220:
```js
const RUT_A = {...Rutina A: Gluteos y Pecho, 5:00-6:00 AM, ejercicios fijos}
const RUT_B = {...Rutina B: Espalda y Hombros, 5:00-6:00 AM, ejercicios fijos}
const SCHED = {0:null, 1:'A', 2:'B', 3:'A', 4:'B', 5:'A', 6:null}
```

Esto es RUTINA ESPECIFICA DE RICARDO con sus horarios (5AM).

### Reemplazo existente
`routines.js` - `UserRoutines.DEFAULT_ROUTINES` tiene 6 templates (push/pull/legs/upper/lower/full).

### Accion v2.0
ELIMINAR `RUT_A`, `RUT_B`, `SCHED`, `CARDIO` (data.js:213) del data.js. Todo viene del recomendador y `UserRoutines`.

### Referencias a limpiar
```
app.js:192,196,304,402,403,646  usos de SCHED[dow] y RUT_A/B
routines.js:193                  fallback ex profeso
engine.js:6 refs
libra.js:4 refs
```

---

## 4. FOOD Database Duplicado

### Estado actual
`data.js:223-530` tiene `FOOD` + `FOOD_EXT` con ~80 alimentos (mezcla de junk food y comidas de plan Ricardo).

### Reemplazo v2.0
`nutritionDB.js` (en construccion por sub-agente) tendra 200+ alimentos con:
- Macros completos (cal, protein, carbs, fat, fiber, sugar, sodium)
- Alergenos clasificados
- Categorias detalladas
- Servings multiples
- goalFit scores

### Accion v2.0
ELIMINAR `FOOD` y `FOOD_EXT` de data.js. Todo viene de `nutritionDB.js`.

---

## 5. EX Database Basico

### Estado actual
`data.js:47-207` tiene `EX` con ~30 ejercicios. Metadata basica: name, muscle, group, equip, dw, how, muscles, errors.

### Reemplazo v2.0
`exerciseDB.js` (en construccion) tendra 150+ ejercicios con:
- primaryMuscle + secondaryMuscles
- equipmentType (gym/casa/aire libre/sin equipo)
- difficulty, force, mechanic, type
- recovery (horas)
- calPerMin
- goalFit scores
- variations, contraindications, progression

### Accion v2.0
ELIMINAR `EX` de data.js. Todo viene de `exerciseDB.js`.

---

## 6. Notificaciones con IDs Hardcoded

### Problema
`engine.js:320-337` (Notif.check) tiene IDs fijos:
```js
if(t>=590 && !st.meals.merienda1) this.send('Merienda 1', getMeal('merienda1', dow).desc);
if(t>=710 && !st.meals.almuerzo) this.send('Almorzar', getMeal('almuerzo', dow).desc);
```

Si el usuario renombra sus comidas (ej: "brunch" en vez de "desayuno"), las notificaciones NO disparan.

### Accion v2.0
Rescribir `Notif.check()` para iterar sobre `UserMeals.getUserMeals()` y disparar notificacion cuando se acerque la hora de CADA comida del usuario (sea como se llame).

---

## 7. Codigo Muerto / Dead Code Identificado

### En engine.js
- `Engine.briefing()` (linea 176-187): genera string del dia basado en RUT_A/RUT_B. Ya no se usa si eliminamos rutinas legacy.
- `Engine.tomorrowPreview()` (linea 189-195): similar, basado en legacy.
- `calBudget()` (linea 90): no considera meta del usuario, usa solo BMR. Incompleto.

### En app.js
- Multiple fallbacks `sch.g==='A'?RUT_A:RUT_B` (lineas 196, 304, 403): se pueden simplificar cuando eliminemos legacy.
- `BATCH` rendering (lineas 283, 354): feature "batch cooking" que solo aplica al plan de Ricardo.

### En libra.js
- Intents que referencian mealKey legacy (desayuno/merienda1/etc): refactorizar para usar custom meal IDs.

---

## 8. Problemas de Arquitectura

### Storage mezcla conceptos
Todo en localStorage con prefix `fr_{scope}_{key}`. OK pero:
- Algunas keys son por-dia (`d_2026-04-19`)
- Otras son perfiles (`profile`, `goals`, `settings`)
- Otras son config (`userMeals`, `userRoutines`)
- Hace falta una funcion clara `resetUserData()` para testing

### Sin migraciones
Cuando cambia el schema (ej: goals del v1.0 no tenia `targetDate`, pero v1.2+ si), no hay sistema de migracion. Datos viejos se rompen silenciosamente.

### Sin tests
Cero tests automaticos. Todo manual. Para v2.0 se recomienda al menos tests de:
- Storage scoping
- Auth flow
- Recommender engines

---

## 9. Plan de Limpieza v2.0

### Fase 1: Preparacion (pre-limpieza)
1. Asegurar que `nutritionDB.js` y `exerciseDB.js` estan completos (sub-agentes trabajando)
2. Crear tests manuales que demuestren funcionamiento
3. Backup en git antes de cada fase

### Fase 2: Eliminacion Legacy Data
1. Eliminar `MEALS`, `MEAL_ORDER`, `getMeal`, `BATCH` de data.js
2. Eliminar `RUT_A`, `RUT_B`, `SCHED`, `CARDIO` de data.js
3. Eliminar `EX` de data.js (migrar a exerciseDB.js)
4. Eliminar `FOOD`, `FOOD_EXT` de data.js (migrar a nutritionDB.js)
5. Dejar en data.js solo: `DAY_NAMES`, `DAY_SHORT`, `MONTHS`, constantes puras.

### Fase 3: Migracion de Referencias
1. app.js: Reemplazar fallbacks `sch.g==='A'?RUT_A:RUT_B` por solo `getEffectiveRoutine()` (que ahora tambien maneja el default).
2. engine.js Notif.check: iterar sobre UserMeals dinamicamente.
3. libra.js: actualizar intents para usar getUserMeals dinamico.
4. Eliminar `Engine.briefing` y `Engine.tomorrowPreview` obsoletos.

### Fase 4: Rebranding
1. server/package.json: name "libra-fit-server"
2. sw.js: notification title "Libra Fit"
3. app.js: export filename `librafit_${dk()}.json`
4. Defaults de secrets: `librafit-...`
5. .claude/launch.json: name "librafit"

### Fase 5: Nuevas Features v2.0
1. Profile v2 (extended: metas medibles, alergenos, condiciones)
2. Onboarding conversacional
3. Recomendadores (rutina + comidas)
4. Libra Coach (desbloqueable)
5. Libra Chat mejorado

---

## 10. Archivos que DEBEN Existir en v2.0

```
librafit/
├── index.html                 (SPA entry)
├── admin.html                 (admin panel)
├── styles.css
├── manifest.json
├── render.yaml
├── package.json
├── sw.js                      (service worker)
│
├── Core:
├── api.js                     (auth + sync)
├── engine.js                  (storage, helpers, scores, streaks) - LIMPIO sin Ricardo
├── app.js                     (UI) - LIMPIO de legacy
│
├── Data (nuevos):
├── constants.js               (DAY_NAMES, MONTHS - lo que antes era data.js sin contenido Ricardo)
├── exerciseDB.js              (150+ ejercicios, estilo Hevy) - NUEVO
├── nutritionDB.js             (200+ alimentos con alergenos) - NUEVO
│
├── Systems:
├── meals.js                   (UserMeals) - EXISTE
├── routines.js                (UserRoutines) - EXISTE
├── profile.js                 (Perfil v2: metas medibles) - NUEVO v2.0
├── onboarding.js              (Dialogo conversacional) - NUEVO v2.0
├── recommender.js             (Motor de recomendaciones) - NUEVO v2.0
├── coach.js                   (Libra Coach desbloqueable) - NUEVO v2.0
├── libra.js                   (Libra Chat mejorado) - EXISTE pero a mejorar
├── errorReport.js             (logs + report) - EXISTE
│
├── Docs:
├── CLAUDE.md                  (contexto para Claude)
├── DEVELOPMENT.md             (plan de desarrollo)
├── SECURITY.md                (seguridad)
├── RESEARCH.md                (investigacion mercado)
├── AUDIT.md                   (este archivo)
├── research/
│   ├── TRAINING_SCIENCE.md    (ciencia de entrenamiento)
│   └── NUTRITION_SCIENCE.md   (ciencia de nutricion)
│
└── server/
    ├── index.js
    ├── db.js
    ├── middleware.js
    ├── package.json
    └── routes/
        ├── auth.js
        ├── data.js
        ├── audit.js
        ├── admin.js
        └── errors.js
```

---

## 11. Estimacion de Esfuerzo

| Fase | Esfuerzo | Prioridad |
|------|----------|-----------|
| Eliminar legacy data | 2-3 horas | ALTA (post DB v2.0) |
| Migrar referencias | 3-4 horas | ALTA |
| Rebranding | 30 min | MEDIA |
| Profile v2 + Onboarding | 4-6 horas | ALTA |
| Recommender engine | 6-8 horas | ALTA |
| Libra Coach | 4-6 horas | MEDIA |
| Libra Chat mejorado | 4-6 horas | ALTA |
| Testing + QA | 2-3 horas | CRITICA |

**Total estimado v2.0: 25-40 horas de desarrollo**

---

## Conclusion

El codigo base actual tiene ~26% de legacy/hardcoded que debe eliminarse. La limpieza no es opcional: cualquier nueva feature chocara con estos legacy si no se limpia primero.

**Orden recomendado:**
1. Esperar que terminen los 4 sub-agentes (exerciseDB, nutritionDB, training science, nutrition science)
2. Ejecutar Fase 2 (eliminar legacy data) + Fase 3 (migrar refs) + Fase 4 (rebrand) en un solo commit
3. Empezar features v2.0 (profile, onboarding, recommenders, coach) sobre base limpia
4. Desplegar v2.0 cuando todo este estable

---

*Audit realizado automaticamente en la sesion de Claude Code.*
