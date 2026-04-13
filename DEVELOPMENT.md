# Plan de Desarrollo - Libra Fit Assistant

> Documento vivo. Se actualiza con cada cambio en el proyecto.
> Ultima actualizacion: 2026-04-13

---

## Estado Actual: v1.1.0 - LIVE EN PRODUCCION

**URL:** https://libra-fit-app.onrender.com
**Deploy:** Render.com Free Tier (auto-deploy desde GitHub master)

---

## Historial de Versiones (Changelog)

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

### Intents reconocidos:
| Intent | Patrones (espanol) | Accion |
|--------|-------------------|--------|
| log_meal | "comi", "desayune", "almorce" | Registra comida completa |
| partial_meal | "solo comi", "la mitad", "no termine" | Ajusta calorias parcialmente |
| add_water | "agua", "tome agua", "vaso" | Suma agua al tracking |
| log_gym | "entrene", "hice gym", "ejercicio" | Registra sesion de gym |
| ask_streak | "racha", "puntos", "nivel", "xp" | Muestra info de gamificacion |
| ask_calories | "calorias", "cuantas llevo" | Muestra resumen calorias |
| set_weight | "peso", "me peso" | Registra peso corporal |
| help | "ayuda", "que puedes", "comandos" | Muestra ayuda |

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
