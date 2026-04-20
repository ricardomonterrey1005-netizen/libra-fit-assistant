# CLAUDE.md - Libra Fit Assistant

> Este archivo es leido automaticamente por Claude Code al inicio de cada sesion.
> Contiene el contexto completo del proyecto para que cualquier instancia pueda continuar el trabajo sin perder informacion.
> **REGLA OBLIGATORIA:** Cada vez que se haga un cambio en el proyecto, este archivo y DEVELOPMENT.md DEBEN actualizarse.

## ⚠️ LEE ESTO PRIMERO - FILOSOFIA DE DESARROLLO

**ANTES de escribir cualquier linea de codigo, LEE `DESIGN_PRINCIPLES.md`.**

Los 10 mandamientos que SIEMPRE deben respetarse:
1. **No esperaras** - Cero spinners. Optimistic UI. < 100ms de respuesta.
2. **No mostraras lo innecesario** - Progressive disclosure. Una decision por pantalla.
3. **No repetiras codigo ni conceptos** - DRY. Single source of truth.
4. **No agregaras lo que no usas** - YAGNI. Codigo muerto se elimina.
5. **Hablaras el idioma del usuario** - Todo en espanol natural.
6. **Respetaras el contexto del usuario** - Usa hora, dia, meta para ser relevante.
7. **Construiras con CSS Variables** - Design tokens, no hacks.
8. **No interrumpiras al usuario** - Toasts > modales. Sin spam.
9. **Mediras todo y optimizaras lo medido** - Sentry + Web Vitals.
10. **Borraras sin piedad** - Codigo sin uso = basura.

**ADN de la app: Minimalista · Intuitivo · Rapido · Util · Limpio**

> "Si te quita mas tiempo del que te da, estamos haciendolo mal."

Si una decision viola alguno de estos principios, SE RECHAZA o SE REESCRIBE.

Referencias obligatorias antes de features nuevos:
- `DESIGN_PRINCIPLES.md` - Como construir
- `AUDIT.md` - Que limpiar
- `ARCHITECTURE.md` - Como escalar
- `research/` - Ciencia detras de recomendaciones

## Proyecto

**Nombre:** Libra Fit Assistant
**Version:** 2.1.0
**Tipo:** PWA (Progressive Web App) - Coach de fitness con IA
**Usuario:** Ricardo Monterrey (Panama)
**Idioma UI:** Espanol (todo en espanol, sin excepciones)

## URLs y Accesos

- **Produccion:** https://libra-fit-app.onrender.com
- **Admin Panel:** https://libra-fit-app.onrender.com/admin.html (password: env `ADMIN_PASSWORD`)
- **GitHub:** https://github.com/ricardomonterrey1005-netizen/libra-fit-assistant
- **Render Dashboard:** dashboard.render.com (cuenta: ricardo.monterrey1005@gmail.com)
- **Plan Render:** Free (se duerme tras inactividad, ~50s para despertar)

## Stack Tecnico

| Capa | Tecnologia |
|------|-----------|
| Frontend | Vanilla JS (sin frameworks), HTML5, CSS3 |
| Backend | Node.js + Express (server/index.js, puerto 3001) |
| Auth | JWT + bcryptjs |
| BD | JSON encriptado con AES-256-CBC (archivos .enc en server/) |
| PWA | Service Worker (sw.js) + manifest.json |
| Deploy | Render.com (Free tier, auto-deploy desde GitHub master) |
| Seguridad | Helmet, CORS, Rate Limiting, Audit Logging |

## Arquitectura de Archivos

```
FitRicardo/
  index.html        - HTML principal (SPA, 5 paginas)
  admin.html        - Panel de administracion (password-protected)
  SECURITY.md       - Documentacion completa de seguridad
  RESEARCH.md       - Investigacion de mercado fitness apps (v1.3.0)
  styles.css         - Estilos completos (dark theme, responsive)
  data.js            - Datos estaticos: comidas, ejercicios, horarios, FOOD DB con macros
  engine.js          - Motor principal: storage, helpers, calorias, rachas/XP, macros
  libra.js           - Asistente IA (NLP en espanol, intents, FAQ)
  app.js             - UI, navegacion, renderizado de paginas
  api.js             - Cliente API, Auth, Sync con servidor
  meals.js           - UserMeals: config de comidas personalizada (v1.3.0)
  routines.js        - UserRoutines: config de rutinas personalizada (v1.3.0)
  errorReport.js     - LogBuffer + ErrorReporter (v1.3.0)
  sw.js              - Service Worker para PWA offline
  manifest.json      - Manifest PWA (nombre, iconos, colores)
  render.yaml        - Config de deployment para Render.com
  package.json       - Metadata del proyecto
  CLAUDE.md          - ESTE ARCHIVO - contexto para Claude Code
  DEVELOPMENT.md     - Plan de desarrollo, changelog, roadmap
  server/
    index.js         - Backend Express completo
    package.json     - Dependencias del servidor
    routes/
      auth.js        - Registro, login, recovery
      data.js        - CRUD datos por usuario
      audit.js       - Audit log del usuario
      admin.js       - Endpoints admin (v1.2.0)
      errors.js      - Reporte de errores (v1.3.0)
    node_modules/    - (no se sube a git)
  icons/             - Iconos PWA
  .claude/
    launch.json      - Config del preview server
```

## Funcionalidades Principales

### 1. Plan de Comidas (data.js + app.js)
- 6 comidas diarias con horarios fijos
- Menus diferentes por dia de semana
- Alternativas para cada comida
- Conteo de calorias automatico
- Tracking de agua (meta: 4000ml)

### 2. Asistente Libra (libra.js)
- NLP en espanol con fuzzy matching
- Intents: log_meal, partial_meal, add_water, log_gym, ask_streak, ask_calories, help
- Partial meals: "solo me comi dos tortillas" ajusta calorias
- Numeros en espanol: "dos" = 2, "mitad" = 0.5
- partialMap: tortilla=75cal, arepa=75, huevo=72, etc.
- Contexto conversacional persistente

### 3. Gym/Cardio (data.js + app.js)
- Rutinas por dia con ejercicios especificos
- Tracking de peso por ejercicio con historial
- Cardio: escaladora 20min (lun/mie/vie)
- Instrucciones detalladas de cada ejercicio

### 4. Sistema de Rachas/Gamificacion (engine.js + app.js)
- getDayScore(): puntua cada dia (meals 40pts, water 20pts, gym 25pts, cardio 15pts)
- Streaks: racha actual, mejor racha, motivacion
- XP y Niveles: Novato -> Constante -> Disciplinado -> Guerrero -> Titan -> Leyenda
- Badges: bronce (3 dias), plata (7), oro (14), platino (30)
- Grafico semanal de barras
- Mensajes motivacionales contextuales

### 5. Auth y Sync (api.js + server/index.js)
- Registro/login con JWT
- Datos encriptados en servidor (AES-256-CBC)
- localStorage como cache, servidor como fuente de verdad
- Sync bidireccional automatico
- **User-scoped localStorage:** Cada usuario tiene sus propios datos en localStorage con prefix `fr_{userId}_`
- **Modo guest:** Datos locales bajo scope `fr_guest_`
- **Recuperacion por PIN:** PIN de 4 digitos opcional en registro, endpoint POST /api/auth/recover
- **Ultimo usuario:** Se recuerda el ultimo username en `fr_lastUser` y se pre-llena en login

### 6. Sistema de Auth Detallado (v1.1.0)

#### Storage Scoping (engine.js S object):
- `S._scope` - ID del usuario actual o 'guest'
- `S.setScope(userId)` - cambia el scope activo
- `S._prefix(key)` - retorna `fr_{scope}_{key}`
- `S.g(key)`, `S.s(key,val)`, `S.d(key)` - usan prefix con scope
- `S.clearScope()` - elimina todas las keys del scope actual
- `S.migrateOldKeys(userId)` - migra keys antiguas sin scope al scope del usuario

#### Flujo Login:
1. Auth.login() -> server valida -> _setAuth(token, user)
2. S.setScope(user.id) -> localStorage ahora lee/escribe con prefix del usuario
3. S.migrateOldKeys(user.id) -> migra datos viejos sin scope (una sola vez)
4. Sync.pullAll() -> descarga datos del servidor al localStorage scopeado
5. authUI.showApp() -> App.init()

#### Flujo Logout:
1. S.clearScope() -> elimina datos locales del usuario (seguros en servidor)
2. token/user removidos de localStorage
3. S.setScope('guest') -> scope vuelve a guest
4. authUI.showAuth() -> muestra pantalla de login

#### Flujo Recovery:
1. Usuario hace click en "Olvide mi contrasena"
2. Ingresa username + PIN de 4 digitos + nueva contrasena
3. POST /api/auth/recover valida PIN hasheado con bcrypt
4. Si es correcto, resetea contrasena y desbloquea cuenta

## Reglas de Desarrollo

1. **Idioma:** Todo en espanol (UI, comentarios, mensajes de Libra)
2. **Costo:** El usuario NO quiere gastar dinero. Solo planes gratuitos.
3. **Autonomia:** Claude tiene permiso total para hacer cambios sin pedir permiso
4. **PWA:** Mantener siempre instalabilidad y funcionalidad offline
5. **Dark Theme:** La app usa tema oscuro (#000, #111, #1a1a2e)
6. **Mobile First:** Disenar primero para celular (375px), luego desktop
7. **ACTUALIZACION OBLIGATORIA:** Al hacer cualquier cambio, actualizar CLAUDE.md y DEVELOPMENT.md
8. **Deploy:** Tras cambios, hacer commit + push a master. Render auto-deploya.

## Novedades v2.1 (infra)

### Persistencia real (Supabase Storage)
- **Problema critico resuelto**: Render Free tiene disco efimero, perdiamos
  datos en cada restart. Cuenta creada se perdia al rato.
- **Solucion**: `server/storage-supabase.js` sincroniza los JSON encriptados
  con Supabase Storage (gratis, 1GB). Fallback graceful a disco si no
  hay env vars.
- `server/db.js` modificado: writeFile() sube async a Supabase, init()
  descarga si disco vacio.
- Env vars requeridas: SUPABASE_URL, SUPABASE_SERVICE_KEY, SUPABASE_BUCKET
- Setup completo en SUPABASE_SETUP.md

### Staging environment
- `render.yaml` con 2 servicios: libra-fit-app (master) + libra-fit-staging (staging)
- Datos aislados por bucket Supabase distinto
- Banner amarillo "🧪 STAGING" en UI si ENVIRONMENT=staging
- Endpoint /api/env para que frontend detecte ambiente
- Guia completa en STAGING.md

### Rollback UI en admin panel
- Endpoint /api/admin/versions lista ultimos 30 commits via git log
- Endpoint /api/admin/version-info muestra deploy actual (hash, branch, uptime)
- Admin panel seccion "Control de Versiones" con tabla de commits
- Boton "Rollback" copia comando git al portapapeles (safe o destructive)
- Marca commit actual como "▶ ACTUAL"

## Novedades v2.0 (MAJOR)

### Arquitectura v2.0
Nuevos modulos que complementan el core:
- `onboarding.js` - Flujo conversacional 13 pasos para perfil completo
- `tracking.js` - Graficas SVG semanal/mensual/anual de cualquier metrica
- `nutritionDB.js` - Base de datos alimentos con macros + alergenos + tags
- `supplementsDB.js` - 24 suplementos con evidencia cientifica (Tier A-D)
- `recommender.js` - Motor de recomendaciones + Libra Coach
- `chatFeedback.js` - Feedback loop para entrenar chat sin IA
- `server/routes/chat.js` - Endpoint para recibir chat misses

### Investigacion cientifica en research/
- TRAINING_SCIENCE.md - Periodizacion, dosis, reps por meta
- NUTRITION_SCIENCE.md - Macros, calorias, dietas por meta
- MICRONUTRIENTS.md - 13 vitaminas + 12 minerales + deteccion deficits
- SUPPLEMENTS.md - ISSN, NIH, 75 suplementos evaluados

### Cambios criticos
1. **Cero datos hardcoded** - Usuarios nuevos empiezan 100% vacios
2. **Sin guest mode** - Solo con cuenta autentificada
3. **BMR/TDEE dinamicos** - Mifflin-St Jeor en engine.js
4. **Horarios del usuario** - Notif.check lee settings.morningTime etc.
5. **Quick-add FAB** - Comida/agua/peso/sup sobre la marcha
6. **Libra Coach** - Desbloqueable a 7 dias de mejor racha
7. **Tracking completo** - 7 metricas × 3 periodos (semana/mes/ano)

### Filosofia (DESIGN_PRINCIPLES.md)
- Minimalista · Intuitivo · Rapido · Util · Limpio
- Cero spinners (optimistic UI)
- Progressive disclosure
- Todo en espanol natural
- Touch targets >= 44-48px
- 10 mandamientos inviolables

## Bugs Conocidos/Resueltos

| Bug | Estado | Solucion |
|-----|--------|----------|
| todayCal() NaN con extras | RESUELTO | Cambiar `e.cal` a `e.c` (extras usan `.c`) |
| "dos tortillas" no parseaba | RESUELTO | Agregar mapa de numeros espanol en nums() |
| "la mitad del almuerzo" fallaba | RESUELTO | Detectar mitad/medio antes de buscar alimento |
| API_BASE hardcoded puerto 3001 | RESUELTO | Usar auto-deteccion en api.js |
| localStorage sin scope por usuario | RESUELTO | Keys ahora usan `fr_{userId}_{key}` con migracion automatica |
| Datos visibles tras logout | RESUELTO | S.clearScope() limpia datos locales al salir |
| Sin recuperacion de contrasena | RESUELTO | PIN de 4 digitos en registro + endpoint /api/auth/recover |
| Multi-usuario en mismo dispositivo | RESUELTO | Cada usuario tiene su propio scope en localStorage |
| Nuevo usuario veia datos de Ricardo | RESUELTO (v1.2.0) | Defaults vacios en getProfile/getGoals, registro servidor con name='' y targetDate=null |
| Countdown usaba fecha hardcoded 2026-05-10 | RESUELTO (v1.2.0) | Solo muestra si hay goals.targetDate, label dinamico |
| Chat Libra respondia "no entendi" mucho | RESUELTO (v1.2.0) | Nuevos intents + FAQ + fallback con sugerencias |
| App solo servia para plan de Ricardo | RESUELTO (v1.3.0) | UserMeals/UserRoutines permiten config personalizada por usuario |
| Notificaciones sin auth | RESUELTO (v1.3.0) | Notif gated por Auth.isLoggedIn() |
| Sin reporte de errores | RESUELTO (v1.3.0) | LogBuffer + boton en Perfil + admin panel |
| Horarios Ricardo en notificaciones | RESUELTO (v2.0) | Notif.check usa horarios del usuario desde settings |
| DEFAULT_SCHEDULE de Ricardo (Mie/Sab/Dom descanso) | RESUELTO (v2.0) | Schedule vacio por default, usuario configura en onboarding |
| Sin sistema recomendador cientifico | RESUELTO (v2.0) | recommender.js + Libra Coach con evidencia cientifica |
| Chat sin feedback loop | RESUELTO (v2.0) | chatFeedback.js + admin endpoint para entrenamiento |
| Sin tracking mensual/anual | RESUELTO (v2.0) | tracking.js con graficas SVG semana/mes/ano |
| Onboarding simple no captura contexto | RESUELTO (v2.0) | onboarding.js conversacional 13 pasos |
| Modo invitado permitia datos compartidos | RESUELTO (v2.0) | Guest mode eliminado, solo con cuenta |
| Sin quick-add sobre la marcha | RESUELTO (v2.0) | FAB flotante siempre visible con 4 acciones rapidas |
| Sin deteccion de abuso suplementos | RESUELTO (v2.0) | SupplementsDB.checkCombinations + LibraCoach alerts |

## Novedades v1.3.0 (CONFIG PERSONALIZADA + ERROR REPORTING)

### Sistema de Comidas Personalizado (meals.js)
- **FOOD database expandida:** ~60 alimentos en espanol con macros por 100g
  (cal100, p100, c100, f100, fib100), categoria, serving tipico, nota
- **UserMeals.getUserMeals()** - devuelve template del usuario desde `S.g('userMeals', DEFAULT_TEMPLATE)`
- **UserMeals.saveUserMeals(meals)** - guarda config personalizada
- **UserMeals.calcMealMacros(meal)** - suma calorias + macros de foods[].grams
- **UserMeals.calcDayMacros(dow, st)** - total del dia
- **UserMeals.calcTargets()** - calcula targets: protein=peso_kg*1.8, fat=28%cal, carbs=resto
- **UserMeals.swapFood(mealId, idx, newFoodKey, newGrams)** - cambio en tiempo real
- **UserMeals.logActualEaten(mealId, foods)** - registra lo que realmente se comio
- **getMealForToday(id, dow)** - helper global que elige custom o legacy
- Backward compat: si no hay custom, usa legacy MEALS
- UI: "⚙️ Configurar comidas" en Perfil, editor con hora/dias/foods/macros preview
- Swap en tiempo real: boton "🔄 Cambiar" en cada comida

### Sistema de Rutinas Personalizado (routines.js)
- **EX database expandida:** +27 ejercicios nuevos (pecho, espalda, hombro, brazos, piernas, gluteos, core)
- **UserRoutines.getUserRoutines()** - rutinas del usuario desde `S.g('userRoutines', DEFAULT_ROUTINES)`
- **UserRoutines.getWeekSchedule()** - horario semanal {0-6: routineId|null}
- **UserRoutines.getCardioConfig()** - dias + tipo + duracion de cardio
- **UserRoutines.getTodayRoutine()** - rutina de hoy
- **UserRoutines.DEFAULT_ROUTINES** - 6 templates: push, pull, legs, upper, lower, full body
- **getEffectiveRoutine()** - helper global con fallback a RUT_A/RUT_B legacy
- **isEffectiveCardioDay()** - helper global con fallback a SCHED legacy
- UI: "⚙️ Configurar" en Gym tab, lista rutinas + editor sets/reps/rest + horario 7 dias + cardio config

### Sistema de Reporte de Errores (errorReport.js + server/routes/errors.js)
- **LogBuffer** - ring buffer 200 entradas, wrap de console.log/warn/error/info/debug
- **Global handlers:** window.onerror + unhandledrejection
- **ErrorReporter.send(description)** - POST /api/errors/report con logs + device + url
- **POST /api/errors/report** - guarda en `db.data._errorReports` (max 500 FIFO)
- **GET /api/errors?password=X** - admin only, lista reportes
- **DELETE /api/errors/:id** y **DELETE /api/errors** - admin cleanup
- UI: boton "🐞 Reportar un error" en Perfil
- Admin: tab "Reportes de errores" en /admin.html con filtro, view, delete, clear-all

### Notificaciones gated por Auth
- `Notif.init()`, `Notif.send()`, `Notif.check()` retornan early si `!Auth.isLoggedIn()`
- Permiso solo se pide post-login (desde authUI.showApp)
- Guest/offline mode NO recibe notificaciones

### Macros tracking
- `engine.js` todayCal() delega a UserMeals cuando hay custom template
- `todayMacros(st, dow)` - total cal, protein, carbs, fat, fiber del dia
- `macroTargets()` - targets calculados segun peso
- UI Hoy: barras de progreso para protein, carbs, grasas, fibra

### Libra chat ampliado
- `ask_protein` - "cuanta proteina llevo", "me falta proteina"
- `ask_macros` - "mis macros"
- `suggest_protein` - "que debo comer para completar mi proteina"
- `plan_meal_food` - "voy a desayunar 200g de salmon" → parse + log con macros

## Novedades v1.2.0

### Onboarding first-run
- Al primer ingreso sin `profile.name`, `App.showOnboarding()` muestra un modal
  pidiendo: nombre, edad, genero, altura, peso actual, peso meta, fecha meta.
- Guarda en profile + goals + registra peso inicial en `bw` si no existe.
- Se dispara desde `App.init()` antes del modal de bienvenida clasico.

### Panel de Admin
- `/admin.html` accesible con password (env `ADMIN_PASSWORD`, default `LibraAdmin2026!`).
- Endpoints: `POST /api/admin/stats`, `GET /api/admin/audit`, `POST /api/admin/export-users`.
- Muestra: stats (usuarios/logins/uptime/data size), tabla de usuarios, audit log filtrable.
- Boton "Export usuarios" descarga JSON con metadata (sin passwords ni tokens).

### Libra Chat mejorado
- Nuevos intents: `ask_today`, `ask_gym_today`, `ask_meal_now`, `ask_water`, `tip`.
- FAQ fuzzy-match con ~15 preguntas comunes (proteina, calorias, plateau, etc.) en `Libra.faq`.
- Fallback con sugerencias en lugar de "no entendi".
- Motivacion acepta: "dame animo", "motivame", "sin ganas".

### UX Calorias
- Boton grande "➕ Agregar algo que comi" en Hoy.
- Modal quick-add: busqueda + 10 comidas rapidas (Arroz, Pollo, Huevo, Tortilla, Arepa, Manzana, Platano, Atun, Yogurt, Almendras).
- Prompt de cantidad, suma a `st.extras`.

### UX Gym
- Boton "💪 Entrenar ahora" en top de Gym.
- Modal streamlined con todos los ejercicios, botones +/- de peso, series tap-friendly (min 48px).
- Al completar todas las series se auto-guarda en historial.

### Seguridad
- `SECURITY.md` documenta: bcrypt cost 12, JWT HS256 7d, AES-256-CBC,
  rate limits, lockout 10 fallos, audit log, limitaciones, rotacion de claves.

## Contacto del Usuario
- **Nombre:** Ricardo Monterrey
- **Email:** ricardo.monterrey1005@gmail.com
- **GitHub:** ricardomonterrey1005-netizen
- **Ubicacion:** Panama City, Panama
