# Plan de Desarrollo - Libra Fit Assistant

> Documento vivo. Se actualiza con cada cambio en el proyecto.
> Ultima actualizacion: 2026-04-19

## Filosofia Core

**ADN: Minimalista · Intuitivo · Rapido · Util · Limpio**

Lee `DESIGN_PRINCIPLES.md` antes de tocar codigo. Los 10 mandamientos son LEY.

Regla de oro: *"Si te quita mas tiempo del que te da, estamos haciendolo mal."*

---

## Estado Actual: v2.0.0 - LIVE EN PRODUCCION

### v2.0.0 (2026-04-19) - MAJOR RELEASE

**Rebranding completo + limpieza total + arquitectura v2.0**

#### Cambios criticos (breaking)
- ELIMINADO todo el hardcode personal de Ricardo:
  - MEALS plan diario (era el plan especifico de Ricardo)
  - RUT_A/RUT_B/SCHED (sus rutinas y sus dias de entrenamiento)
  - BATCH cooking (sus dias de cocinar)
  - SUPS list (los suplementos que el tomaba)
  - Notif con 9 horarios hardcoded a sus horas (6AM, 4:45AM, 9:50AM etc)
  - Mensajes "entrenas 5 AM", "cama 10 PM"
  - Profile default con name='Ricardo', age=29
  - DEFAULT_SCHEDULE de routines.js con Mie/Sab/Dom descanso (sus dates)
- ELIMINADO guest mode / "Usar sin cuenta" - solo acceso con cuenta
- AGREGADO boton logout con confirmacion
- Data.js ahora es solo constantes genericas + stubs vacios + Proxy
  compat para EX/FOOD que delegan a ExerciseDB/FoodDB

#### Nuevas caracteristicas
- **Onboarding conversacional (13 pasos)**: nombre, datos basicos, meta
  principal, detalle contextual de meta, lugar de entrenamiento,
  frecuencia + horario gym, cardio, patron alimentario, horarios comidas,
  alergias, suplementos, horarios recordatorios, resumen con BMR/TDEE.
- **BMR/TDEE dinamicos** con Mifflin-St Jeor + activity multiplier
- **Tracking completo**: 7 metricas (score/cal/protein/carbs/fat/fiber/
  water) × 3 periodos (semana/mes/ano) + grafica de peso SVG
- **Quick-add FAB siempre visible**: registrar comida/agua/peso/supp en
  cualquier momento sin navegar
- **nutritionDB.js**: 55+ alimentos con macros + alergenos + dietary tags
- **supplementsDB.js**: 24 suplementos con evidencia cientifica (Tier A-D).
  Detecta abuso de dosis y combinaciones peligrosas (yohimbina+cafeina,
  5-HTP+antidepresivos, BCAA redundante, tribulus scam, etc.)
- **exerciseDB.js**: 134 ejercicios estilo Hevy con goalFit scoring
- **Recommender engine**: genera rutina semanal segun split optimo,
  top alimentos por meta+alergenos, "armame menu con ingredientes",
  stack de suplementos segun meta, deteccion micronutrientes en riesgo
- **Libra Coach**: desbloqueable a 7 dias de mejor racha. Insights
  personalizados: progreso vs meta, adherencia, hidratacion, warnings
  de supplements, micronutrientes.
- **Chat feedback loop**: chatFeedback.js captura misses/rejections y
  los envia al admin panel para entrenamiento. Intent 'rejection' detecta
  cuando usuario dice "no es eso", "estas mal", etc.

#### Archivos nuevos (11)
- onboarding.js, tracking.js, recommender.js, chatFeedback.js
- nutritionDB.js, supplementsDB.js
- server/routes/chat.js
- research/TRAINING_SCIENCE.md, NUTRITION_SCIENCE.md
- research/MICRONUTRIENTS.md, SUPPLEMENTS.md
- SESSION_PROGRESS.md, ARCHITECTURE.md, AUDIT.md
- DESIGN_PRINCIPLES.md, LIBRA_CHAT_SPEC.md, COMO_FUNCIONA.md, RESEARCH.md

#### Archivos refactorizados completos
- data.js (era 534 lineas hardcoded -> 150 lineas constantes genericas)
- engine.js (Notif.check reescrito, BMR/TDEE agregados, eliminado hardcode)
- meals.js (DEFAULT_TEMPLATE vacio)
- routines.js (DEFAULT_SCHEDULE vacio, TEMPLATES opcionales)

#### Decisiones tomadas
- Migrar a Supabase: pendiente (persistencia Render ephemeral disk)
- Staging environment: pendiente (branch staging + 2do deploy Render)
- Sin dominio custom (mantener .onrender.com)
- Sin IA en chat (rule-based NLP + feedback loop manual)
- Sin email transaccional (recovery por PIN)

#### Pendiente para v2.1
- Migrar BD a Supabase (critical - datos se pierden en Render)
- Staging environment + rollback UI en admin
- Expandir nutritionDB de 55 a 200+ alimentos
- Expandir chat patterns con sub-agentes (millones de variaciones)

---

### v1.3.0 (archive)

**URL:** https://libra-fit-app.onrender.com
**Admin:** https://libra-fit-app.onrender.com/admin.html
**Deploy:** Render.com Free Tier (auto-deploy desde GitHub master)

---

## Historial de Versiones (Changelog)

### v1.3.0 (2026-04-19) - Config Personalizada + Error Reporting

#### Problema resuelto:
La app antes solo servia para el plan de comidas/ejercicios de Ricardo.
Ahora cada usuario puede configurar sus propias comidas, rutinas, horarios, etc.

#### Funcionalidades entregadas:
- [x] **FOOD database expandida:** ~60 alimentos en espanol con macros completos por 100g
- [x] **UserMeals system:** Configuracion de comidas personalizada por usuario con template default
- [x] **Editor de comidas:** UI en Perfil para crear/editar comidas con hora, dias de semana, alimentos y gramos
- [x] **Live swap de comidas:** Boton "🔄 Cambiar" en cada comida para cambiar lo que se comio en tiempo real
- [x] **Tracking de macros completo:** Protein, carbs, grasas, fibra con barras de progreso en Hoy
- [x] **Targets automaticos:** Protein target = peso_kg * 1.8, fat 28%, carbs resto
- [x] **UserRoutines system:** Rutinas personalizadas + 6 templates default (push/pull/legs/upper/lower/full)
- [x] **EX database expandida:** +27 ejercicios nuevos (pecho, espalda, hombro, brazos, piernas, gluteos, core)
- [x] **Editor de rutinas:** UI en Gym tab para crear/editar con sets/reps/rest por ejercicio
- [x] **Horario semanal:** Usuario asigna rutinas a dias de la semana
- [x] **Cardio config:** Dias + tipo (escaladora/caminar/trotar) + duracion
- [x] **LogBuffer (errorReport.js):** Ring buffer 200 entradas captura console.log/warn/error + uncaught errors
- [x] **Reporte de errores:** Boton "🐞 Reportar un error" en Perfil, envia logs + device + URL al server
- [x] **Server endpoint /api/errors:** Guarda max 500 reportes FIFO en DB encriptada
- [x] **Admin panel errores:** Tab "Reportes de errores" en admin.html con filtro, view logs, delete
- [x] **Notificaciones gated:** Notif.init/send/check retornan early si !Auth.isLoggedIn()
- [x] **Libra chat ampliado:** Nuevos intents ask_protein, ask_macros, suggest_protein, plan_meal_food
- [x] **Backward compatibility:** Todo funciona con plan legacy de Ricardo si no hay config custom

#### Archivos nuevos:
- `meals.js` - UserMeals module completo
- `routines.js` - UserRoutines module completo
- `errorReport.js` - LogBuffer + ErrorReporter + UI modal
- `server/routes/errors.js` - endpoints POST/GET/DELETE errores
- `RESEARCH.md` - Investigacion de mercado (MyFitnessPal, Cronometer, Strong, Hevy, Noom, etc.)

#### Archivos modificados:
- `data.js` - FOOD DB expandida (60+ alimentos con macros), EX DB (+27 ejercicios)
- `engine.js` - todayCal delega a UserMeals, todayMacros(), macroTargets(), Notif gated por auth
- `app.js` - Config UIs de comidas y rutinas, editor modals, swap modal, macros bars, boton reportar error
- `libra.js` - +4 intents de macros, parseo de "voy a desayunar Xg de Y"
- `server/index.js` - mount /api/errors
- `server/routes/admin.js` - endpoints de errores para admin panel
- `admin.html` - tab "Reportes de errores"
- `index.html` - scripts de meals.js, routines.js, errorReport.js; Notif.init post-login

#### Decisiones tecnicas:
- **FOOD macros por 100g** (estandar USDA) vs por serving - permite calcular cualquier cantidad exacta
- **UserMeals.getMealForToday** routing entre custom y legacy para backward compat perfecto
- **LogBuffer wrap** de console mantiene funcionalidad original (delegacion a console.* nativo)
- **Error reports dentro del DB encriptado** - no archivo aparte, todo en AES-256-CBC
- **Notif init post-login** - permiso de browser solo se pide cuando el usuario esta loggeado
- **Templates de rutinas** - 6 populares (push/pull/legs etc) para onboarding rapido
- **Ingested research insights:** USDA + Open Food Facts fallback recomendado para futuro, Groq AI para v1.4

---

### v1.2.0 (2026-04-19) - Onboarding, Admin, UX Polish

#### Bugs criticos resueltos:
- [x] **Nuevo usuario ya no ve datos de Ricardo:** `getProfile()` default ahora tiene `name:''`, `age:null`. `getGoals()` default tiene `targetDate:null`.
- [x] **Fallback UI:** `app.js` muestra `'Atleta'` en vez de `'Ricardo'` si no hay nombre; countdown solo se muestra si hay `goals.targetDate`, con label dinamico (`META: X DE MES`).
- [x] **Registro servidor limpio:** `server/routes/auth.js` crea usuarios con `profile.name=''`, `goals.targetDate=null`, `mysups=[]`.

#### Funcionalidades nuevas:
- [x] **Onboarding modal** (`App.showOnboarding`): se dispara si `profile.name` vacio al iniciar. Pide nombre/edad/genero/altura/peso actual/peso meta/fecha meta. Guarda en profile + goals + bw.
- [x] **Admin Panel** (`admin.html` + `server/routes/admin.js`):
  - `POST /api/admin/stats` (password en body) → stats, lista de usuarios, audit reciente.
  - `GET /api/admin/audit?password=X&action=Y&limit=N` → audit filtrable.
  - `POST /api/admin/export-users` → JSON de backup con metadata (sin passwords/tokens).
  - Password en env `ADMIN_PASSWORD` (default `LibraAdmin2026!`). Agregado a `render.yaml`.
- [x] **Libra Chat expandido:**
  - Nuevos intents: `ask_today`, `ask_gym_today`, `ask_meal_now`, `ask_water`, `tip`, `faq`.
  - `Libra.faq` knowledge base con ~15 entradas: calorias, proteina, frecuencia gym, comer de noche, cafe, perdida semanal, plateau, hambre, cardio ayunas, descanso entre series, agua, etc.
  - `faqLookup()` usa include literal + word-overlap scoring (>=2 palabras).
  - Motivation acepta: `dame animo`, `motivame`, `sin ganas`.
  - Fallback: sugerencias en lugar de "no entendi".
- [x] **UX Calorias** (pagina Hoy):
  - Boton grande "➕ Agregar algo que comi" → `App.showQuickAddFood()`.
  - Modal con busqueda + 10 atajos (Arroz, Pollo, Huevo, Tortilla, Arepa, Manzana, Platano, Atun, Yogurt, Almendras).
  - Prompt de cantidad → suma a `st.extras`.
- [x] **UX Gym** (`App.showTrainNow()`):
  - Boton "💪 Entrenar ahora" en top de rutina.
  - Modal con todos los ejercicios de hoy. Controles +/- 5, +/- 2.5 lbs (min 44px). Series tap-friendly (min 48px).
  - Auto-guarda en `exHist` al completar todas las series con peso > 0.
- [x] **FOOD DB:** nuevos items `tortilla`, `platano`, `yogurt` (alias).

#### Documentacion:
- [x] `SECURITY.md` nuevo: bcrypt, JWT, AES, rate limits, lockout, audit, rotacion de claves, hardening.
- [x] `CLAUDE.md` v1.2.0 con admin URL y seccion de novedades.

#### Archivos modificados:
- `engine.js` — defaults limpios en getProfile/getGoals.
- `app.js` — showOnboarding, showQuickAddFood, showTrainNow, quickAddFood, nuevos data-a handlers.
- `libra.js` — intents nuevos, Libra.faq + faqLookup, cases, fallback mejorado.
- `data.js` — FOOD: tortilla, platano, yogurt.
- `server/routes/auth.js` — registro con defaults limpios.
- `server/routes/admin.js` — NUEVO.
- `server/index.js` — monta `/api/admin`.
- `render.yaml` — env `ADMIN_PASSWORD`.
- `admin.html` — NUEVO.
- `SECURITY.md` — NUEVO.

---

### v1.1.0 (2026-04-13) - Auth & Session Refactor

#### Funcionalidades entregadas:
- [x] **User-scoped localStorage:** Cada usuario tiene datos aislados con prefix `fr_{userId}_{key}`
- [x] **Modo guest aislado:** Datos guest bajo `fr_guest_` no se mezclan con datos de usuarios
- [x] **Limpieza al logout:** S.clearScope() elimina datos locales del usuario (seguros en servidor)
- [x] **Restauracion al login:** Sync.pullAll() descarga datos del servidor al scope del usuario
- [x] **Migracion automatica:** Keys antiguas sin scope se migran al scope del usuario al primer login
- [x] **PIN de recuperacion:** Campo opcional de 4 digitos en registro, hasheado con bcrypt en servidor
- [x] **Endpoint de recovery:** POST /api/auth/recover valida username + PIN + nueva contrasena
- [x] **UI de recovery:** Formulario "Olvide mi contrasena" con validacion completa
- [x] **Ultimo usuario recordado:** Pre-llena username en login, muestra "Bienvenido de vuelta, X"
- [x] **Multi-usuario en mismo dispositivo:** Datos completamente aislados por scope

#### Archivos modificados:
- `engine.js` - S object con _scope, setScope(), clearScope(), migrateOldKeys(), _prefix()
- `api.js` - Auth.login/register/logout con scope management, Auth.recover(), Sync.pullAll() scoped
- `index.html` - PIN field, recovery form, welcome back message, pre-fill username
- `server/routes/auth.js` - PIN hashing en registro, POST /api/auth/recover endpoint
- `server/db.js` - createUser() acepta hashedPin, campo recoveryPin en user object

#### Decisiones tecnicas:
- PIN hasheado con bcrypt (cost 10) en servidor - nunca en texto plano
- Recovery usa rate limiter de login para prevenir brute force
- migrateOldKeys() detecta keys no-scopeadas vs ya-scopeadas por formato UUID
- clearScope() al logout previene data leak entre usuarios
- fr_lastUser se almacena sin scope (global al dispositivo)

---

### v1.0.0 (2026-04-13) - Release Inicial
**Commit:** 92b65a3

#### Funcionalidades entregadas:
- [x] Plan de comidas completo (6 comidas/dia, 7 dias/semana)
- [x] Conteo de calorias automatico con meta diaria
- [x] Tracking de agua (meta 4000ml)
- [x] Rutinas de gym por dia con tracking de peso
- [x] Cardio tracking (escaladora lun/mie/vie)
- [x] Asistente Libra (NLP espanol, chat inteligente)
- [x] Comidas parciales ("solo me comi dos tortillas")
- [x] Sistema de rachas/puntos (XP, niveles, badges)
- [x] Grafico semanal de rendimiento
- [x] Mensajes motivacionales de disciplina
- [x] Auth con JWT (registro/login)
- [x] Base de datos encriptada (AES-256-CBC)
- [x] PWA instalable (service worker + manifest)
- [x] Deploy permanente en Render.com
- [x] Repositorio en GitHub

#### Bugs corregidos en esta version:
- Fix: todayCal() retornaba NaN cuando habia extras (`.cal` -> `.c`)
- Fix: Numeros en espanol no se parseaban ("dos" -> 2, "mitad" -> 0.5)
- Fix: "la mitad del almuerzo" no funcionaba (almuerzo es comida, no alimento)
- Fix: API_BASE hardcoded no funcionaba en produccion

#### Decisiones tecnicas:
- **Sin frameworks:** Vanilla JS para mantener la app ligera y rapida
- **JSON encriptado vs DB real:** Por ahora suficiente para 1 usuario. Migrar a SQLite/Postgres si crece
- **localStorage + Server:** Experiencia offline-first con respaldo en servidor
- **Render Free:** Gratis pero se duerme. Aceptable para uso personal
- **NLP propio vs API de IA:** NLP basico local para no depender de APIs externas ni costos

---

## Arquitectura del Sistema

```
[Celular/Browser]
      |
      v
  index.html (SPA)
      |
      +-- data.js .......... Datos estaticos (comidas, ejercicios, horarios)
      +-- engine.js ........ Motor (storage, calorias, rachas, XP)
      +-- libra.js ......... Asistente IA (NLP, intents, acciones)
      +-- app.js ........... UI (renderizado, navegacion, modales)
      +-- api.js ........... Auth + Sync con servidor
      +-- styles.css ....... Estilos (dark theme, responsive)
      +-- sw.js ............ Service Worker (cache offline)
      |
      v
  server/index.js (Express)
      |
      +-- JWT Auth (registro, login, verify)
      +-- BD Encriptada (.enc files)
      +-- Rate Limiting
      +-- Helmet Security
      +-- CORS
      +-- Audit Logging
```

### Flujo de datos:
1. Usuario abre la app -> Service Worker sirve cache si offline
2. app.js inicializa -> lee localStorage (engine.js S.g())
3. Si hay internet -> api.js sincroniza con servidor
4. Usuario interactua -> engine.js procesa -> S.s() guarda local + sync
5. Libra (chat) -> NLP detecta intent -> ejecuta accion correspondiente

### Paginas de la SPA:
| # | Pagina | Contenido |
|---|--------|-----------|
| 0 | Hoy | Resumen del dia, comidas, agua, rachas, XP |
| 1 | Comida | Plan alimenticio, alternativas, extras |
| 2 | Gym | Rutina del dia, tracking peso, cardio |
| 3 | Progreso | Graficos peso, calorias, tendencias |
| 4 | Perfil | Config usuario, datos, backup, Libra chat |

---

## Motor NLP - Libra (libra.js)

### Intents reconocidos (v1.2.0):
| Intent | Patrones (espanol) | Accion |
|--------|-------------------|--------|
| log_meal | "comi", "desayune", "almorce" | Registra comida completa |
| partial_meal | "solo comi", "la mitad", "no termine" | Ajusta calorias parcialmente |
| log_water | "agua", "tome agua", "vaso" | Suma agua al tracking |
| log_exercise | "hice X con Y libras" | Registra peso en ejercicio |
| ask_streak | "racha", "puntos", "nivel", "xp" | Muestra info de gamificacion |
| ask_calories | "calorias", "cuantas llevo" | Muestra resumen calorias |
| ask_today | "que toca hoy", "que dia es hoy" | Resumen del dia |
| ask_gym_today | "rutina hoy", "ejercicios hoy" | Lista ejercicios de hoy |
| ask_meal_now | "que como ahora", "proxima comida" | Siguiente comida por hora |
| ask_water | "cuanta agua", "agua que llevo" | Muestra intake actual |
| ask_progress | "como voy", "mi progreso" | Resumen semanal |
| ask_food | "puedo comer X", "calorias de X" | Recomienda si comer algo |
| tip | "tip", "consejo", "que me recomiendas" | Tip aleatorio |
| motivation | "desanimado", "sin ganas", "motivame" | Mensaje motivacional |
| faq | fuzzy match a Libra.faq | Respuesta educativa |
| log_weight | "peso 190 libras", "me pese" | Registra peso |
| modify_goal | "cambiar meta", "quiero pesar X" | Actualiza goal |
| modify_profile | "tengo X anos", "mido X" | Actualiza profile |
| toggle_setting | "activa/desactiva X" | Toggle notificaciones |
| navigate | "ir a X" | Cambia pagina |
| help | "ayuda", "que puedes", "comandos" | Muestra ayuda |

### FAQ System (nuevo en v1.2.0)
`Libra.faq` es un array de `{patterns: [...], response: string|function}`.
- `faqLookup(normText)` primero busca `includes()` exacto.
- Si no matchea, word-overlap scoring: palabras > 3 chars, si una palabra esta
  contenida en (o contiene) alguna palabra del patron, suma 1 punto. Requiere >= 2.
- Se llama desde `detectIntent()` despues de todos los otros intents pero antes
  de `unknown`.

Preguntas cubiertas: calorias necesarias (dinamico con calBudget),
proteina (dinamico con peso), frecuencia gym, mito comer de noche, cafe,
perdida semanal saludable, cuando veo resultados, hambre, plateau,
ganar peso, que es deficit, desayunar/ayuno, cardio ayunas, descanso series, agua.

### Mapa de alimentos parciales (partialMap):
| Alimento | Calorias por unidad |
|----------|-------------------|
| tortilla | 75 |
| arepa | 75 |
| huevo | 72 |
| clara | 17 |
| arroz (taza) | 200 |
| lentejas (taza) | 230 |
| almendra (unidad) | 7 |

---

## Sistema de Gamificacion (engine.js)

### Puntuacion diaria (getDayScore):
| Categoria | Puntos max | Calculo |
|-----------|-----------|---------|
| Comidas | 40 | (comidas_hechas / 6) * 40 |
| Agua | 20 | min(1, agua/4000) * 20 |
| Gym | 25 | Si dia de gym: completo=25, parcial=proporcional |
| Cardio | 15 | Si dia de cardio: hecho=15, no=0 |
| **Total** | **100** | Suma de arriba |

### Niveles:
| Nivel | Titulo | XP requerido |
|-------|--------|-------------|
| 1 | Novato | 0 |
| 2 | Constante | 100 |
| 3 | Disciplinado | 300 |
| 4 | Guerrero | 600 |
| 5 | Titan | 1000 |
| 6 | Leyenda | 2000 |

### Badges:
| Badge | Requisito | Tier |
|-------|----------|------|
| 3 dias seguidos | 3 dias score >= 60% | Bronce |
| 1 semana | 7 dias seguidos | Plata |
| 2 semanas | 14 dias seguidos | Oro |
| 1 mes | 30 dias seguidos | Platino |

---

## Roadmap Futuro (Ideas pendientes)

### Prioridad Alta
- [ ] Testing completo de la app en produccion
- [ ] Verificar que todos los flujos funcionen en movil
- [ ] Agregar .gitignore (node_modules, .enc files)

### Prioridad Media
- [ ] Notificaciones push reales (Web Push API)
- [ ] Graficos mas detallados en Progreso (Chart.js o similar)
- [ ] Exportar/importar datos (backup manual)
- [ ] Modo offline mas robusto (queue de sync)

### Prioridad Baja
- [x] Multi-usuario real (implementado en v1.1.0 con user-scoped localStorage)
- [ ] Cambiar plan de comidas desde la app
- [ ] Integracion con Google Fit / Apple Health
- [ ] Tema claro opcional
- [ ] Idioma ingles opcional

---

## Notas Tecnicas Importantes

### Sobre el Storage (engine.js):
- `S._scope` contiene el userId actual o 'guest'
- `S._prefix(key)` retorna `fr_{scope}_{key}` (ej: `fr_abc123_profile`)
- `S.g(key)` lee de localStorage con prefix scopeado
- `S.s(key, val)` guarda en localStorage scopeado Y hace sync al servidor
- `S.d(key)` elimina de localStorage scopeado Y del servidor
- `S.setScope(userId)` cambia el scope activo
- `S.clearScope()` elimina todas las keys del scope actual
- `S.migrateOldKeys(userId)` migra keys antiguas `fr_X` a `fr_{userId}_X`
- Los datos del dia se guardan como `d_YYYY-MM-DD` (dentro del scope)
- Keys globales (sin scope): `fr_token`, `fr_user`, `fr_offline`, `fr_lastUser`

### Sobre el Server (server/index.js):
- Puerto: process.env.PORT || 3001
- JWT Secret: generado automaticamente al arrancar si no existe
- BD: archivos .enc en el filesystem del servidor
- Rate limit: 100 requests / 15 min por IP

### Sobre el Deploy:
- Render hace auto-deploy cuando se pushea a master
- Build command: `cd server && npm install`
- Start command: `node server/index.js`
- El servidor sirve los archivos estaticos del frontend
- En produccion, API_BASE = `/api` (mismo origen)

---

*Este documento se actualiza automaticamente con cada sesion de desarrollo.*
