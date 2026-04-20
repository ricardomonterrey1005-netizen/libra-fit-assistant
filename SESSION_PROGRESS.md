# SESSION_PROGRESS.md - Tracker de Sesion v2.0

> Documento que se actualiza con cada commit para saber EXACTAMENTE donde quedamos.
> Si la sesion se corta, este archivo tiene el checkpoint.

## Objetivo de la sesion

Implementar TODO lo pendiente del v2.0 en una sesion larga con commits frecuentes.

## Decisiones del usuario (recap)

- ✅ Migrar a Supabase (gratis)
- ✅ Staging environment (gratis)
- ❌ Sin dominio custom (mantener .onrender.com)
- ❌ Sin IA en chat (entrenar con reglas)
- ❌ Sin email transaccional (mantener PIN)
- ✅ Eliminar TODOS los datos hardcoded de Ricardo
- ✅ Eliminar modo invitado/sin-cuenta
- ✅ Agregar boton de logout
- ✅ Tracking: semanal/mensual/anual para todos los datos
- ✅ Grafica de peso
- ✅ Zero datos precargados en perfil nuevo

## Checkpoints

### [ ] COMMIT 1: Limpieza legacy total
Estado: PENDIENTE
Archivos a modificar:
- data.js: eliminar MEALS, RUT_A, RUT_B, SCHED, BATCH, SUPS hardcoded
- routines.js: eliminar DEFAULT_ROUTINES, DEFAULT_SCHEDULE, DEFAULT_CARDIO
- engine.js: eliminar Notif.check con horarios hardcoded + mysups default
- meals.js: eliminar DEFAULT_TEMPLATE hardcoded con horas
- libra.js: limpiar mensajes con "5 AM", "10 PM", etc.
- index.html: eliminar boton "Usar sin cuenta"
- app.js: agregar boton logout en Perfil + limpiar 'Ricardo' fallback
- server/routes/auth.js: registro crea perfil 100% vacio

Mensaje de commit: "v2.0-cleanup: eliminar TODO el hardcode personal de Ricardo + sin guest mode + logout"

### [ ] COMMIT 2: BMR/TDEE + Tracking views
Estado: PENDIENTE
Archivos:
- engine.js: funciones calcBMR, calcTDEE, calcDeficit, calcProteinTarget
- app.js: tracking views semanal/mensual/anual con graficas simples SVG
- app.js: grafica de peso (svg line chart)

Mensaje: "v2.0-tracking: BMR/TDEE + graficas semanal/mensual/anual + peso"

### [ ] COMMIT 3: Onboarding v2 conversacional
Estado: PENDIENTE
Archivos:
- onboarding.js (NEW): flujo conversacional multi-paso
- app.js: integracion con onboarding v2
- Pasos: nombre, edad, sexo, peso, altura, meta, detalle meta, lugar entreno,
         frecuencia, horarios, dias, comidas (frecuencia + horarios),
         alergias, suplementos actuales, PIN

Mensaje: "v2.0-onboarding: flujo conversacional completo multi-paso"

### [ ] COMMIT 4: Databases completas
Estado: PENDIENTE
Archivos:
- nutritionDB.js (NEW): 200+ alimentos con macros, micronutrientes, alergenos, tags
- research/SUPPLEMENTS.md (NEW): ciencia de suplementos
- supplementsDB.js (NEW): 50+ suplementos con dosis, tipo, contraindicaciones

Mensaje: "v2.0-dbs: nutritionDB (200+ alimentos) + supplementsDB (50+ supps) + ciencia"

### [ ] COMMIT 5: Chat v2 + Quick-add
Estado: PENDIENTE
Archivos:
- libra.js (REFACTOR): nueva arquitectura del spec
- patterns/ (NEW DIR): patterns por dominio (meals, exercise, queries, etc.)
- app.js: boton quick-add prominente
- server/routes/chat.js (NEW): endpoint /api/chat/miss
- admin.html: seccion "Chat Misses" para retraining

Mensaje: "v2.0-chat: refactor libra.js + quick-add prominente + feedback loop"

### [ ] COMMIT 6: Recomendadores + Libra Coach
Estado: PENDIENTE
Archivos:
- recommender.js (NEW): motor que genera rutinas/dietas
- libraCoach.js (NEW): detecta problemas y recomienda
- app.js: UI del coach desbloqueable a 7 dias

Mensaje: "v2.0-coach: recomendadores + Libra Coach desbloqueable"

### [ ] COMMIT 7: Docs finales
Estado: PENDIENTE
Archivos:
- CLAUDE.md: version 2.0, actualizar secciones
- DEVELOPMENT.md: changelog v2.0
- COMO_FUNCIONA.md: actualizar con lo nuevo

Mensaje: "v2.0-docs: documentacion final completa"

## Log de decisiones tomadas durante implementacion

(Se llena mientras avanzo)

## Bugs/issues encontrados

(Se llena si aparecen)

## Si se corta la sesion

1. Leer este archivo
2. Ver cual fue el ultimo commit que se marco como [x]
3. Continuar desde el siguiente commit pendiente
4. Si hay archivos modificados sin committear, revisar `git status`
