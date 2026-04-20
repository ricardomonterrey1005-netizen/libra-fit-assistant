# CLAUDE.md - Libra Fit Assistant

> Este archivo es leido automaticamente por Claude Code al inicio de cada sesion.
> Contiene el contexto completo del proyecto para que cualquier instancia pueda continuar el trabajo sin perder informacion.
> **REGLA OBLIGATORIA:** Cada vez que se haga un cambio en el proyecto, este archivo y DEVELOPMENT.md DEBEN actualizarse.

## Proyecto

**Nombre:** Libra Fit Assistant
**Version:** 1.2.0
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
  styles.css         - Estilos completos (dark theme, responsive)
  data.js            - Datos estaticos: comidas, ejercicios, horarios
  engine.js          - Motor principal: storage, helpers, calorias, rachas/XP
  libra.js           - Asistente IA (NLP en espanol, intents, ejecutor)
  app.js             - UI, navegacion, renderizado de paginas
  api.js             - Cliente API, Auth, Sync con servidor
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
