# CLAUDE.md - Libra Fit Assistant

> Este archivo es leido automaticamente por Claude Code al inicio de cada sesion.
> Contiene el contexto completo del proyecto para que cualquier instancia pueda continuar el trabajo sin perder informacion.
> **REGLA OBLIGATORIA:** Cada vez que se haga un cambio en el proyecto, este archivo y DEVELOPMENT.md DEBEN actualizarse.

## Proyecto

**Nombre:** Libra Fit Assistant
**Version:** 1.0.0
**Tipo:** PWA (Progressive Web App) - Coach de fitness con IA
**Usuario:** Ricardo Monterrey (Panama)
**Idioma UI:** Espanol (todo en espanol, sin excepciones)

## URLs y Accesos

- **Produccion:** https://libra-fit-app.onrender.com
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

## Contacto del Usuario
- **Nombre:** Ricardo Monterrey
- **Email:** ricardo.monterrey1005@gmail.com
- **GitHub:** ricardomonterrey1005-netizen
- **Ubicacion:** Panama City, Panama
