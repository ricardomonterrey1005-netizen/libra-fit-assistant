# COMO FUNCIONA - Libra Fit Assistant

> Guia en lenguaje simple, pensada para alguien con conocimiento basico de software.
> Analogias de construccion civil (edificios) para explicar arquitectura.

---

## 1. Que es Libra Fit

Libra Fit es una **aplicacion web progresiva (PWA)** de fitness. Es como una app de celular que vive en internet pero se puede "instalar" en tu telefono y funciona incluso sin internet.

La idea central: **un coach inteligente personalizable** que te dice que comer, que entrenar, cuanto progresas, y te recomienda ajustes.

URL actual: `https://libra-fit-app.onrender.com`
Codigo: `https://github.com/ricardomonterrey1005-netizen/libra-fit-assistant`

---

## 2. La analogia del edificio

Piensa en la app como un **edificio de oficinas**:

```
          ╔══════════════════════════════════════════╗
          ║       🏢 LIBRA FIT ASSISTANT            ║
          ║                                           ║
 Planta 5 ║  📱 Vista del usuario (lo que ve)        ║  ← Frontend
          ║                                           ║
 Planta 4 ║  🧠 Asistente Libra (chat + coach)       ║  ← Logica inteligente
          ║                                           ║
 Planta 3 ║  📊 Motor de datos (calculos, rachas)    ║  ← Engine
          ║                                           ║
 Planta 2 ║  🔒 Control de acceso (login, permisos)  ║  ← Auth
          ║                                           ║
 Planta 1 ║  🏗️ Backend (servidor Node.js)           ║  ← Servidor
          ║                                           ║
Cimientos ║  💾 Base de datos (donde se guarda todo) ║  ← DB
          ╚══════════════════════════════════════════╝
          🔧 Servicios externos: Render (hosting), GitHub (codigo)
```

Cada "piso" tiene una funcion especifica. El usuario solo interactua con el piso 5 (la vista), pero todos los demas trabajan en segundo plano.

---

## 3. Las partes del sistema explicadas

### 🏢 LA FACHADA (Frontend) - Lo que el usuario ve

**Que es:** La interfaz visual en el navegador/celular.

**Tecnologias:** HTML, CSS, JavaScript puro (sin frameworks).

**Archivos principales:**
| Archivo | Rol | Analogia |
|---------|-----|----------|
| `index.html` | Estructura visual | Los planos del edificio |
| `styles.css` | Diseno y colores | Pintura, acabados |
| `app.js` | Navegacion + pantallas | Los pasillos y escaleras |
| `manifest.json` | Config de PWA | Permiso de ocupacion |
| `sw.js` | Funcionalidad offline | Generador de emergencia |
| `icons/` | Iconos app | Senaletica |

**Como trabaja:**
Cuando abres la app, se carga `index.html`. Ese archivo es como un esqueleto. Luego `styles.css` lo decora y `app.js` le da vida (botones funcionan, pantallas cambian).

La app tiene **5 pantallas** (tabs inferiores):
- **Hoy**: resumen del dia (comidas, agua, gym, racha)
- **Comida**: plan alimenticio y alternativas
- **Gym**: rutina del dia y seguimiento
- **Progreso**: graficos y tendencias
- **Perfil**: config del usuario

---

### 🧠 EL ASISTENTE LIBRA - Chat + Coach

**Que es:** El "cerebro" que conversa con el usuario y le recomienda cosas.

**Archivos:**
| Archivo | Rol |
|---------|-----|
| `libra.js` | Motor conversacional (NLP rule-based) |
| `LIBRA_CHAT_SPEC.md` | Especificacion detallada del chat |

**Como trabaja (analogia):**
Es como un **portero inteligente** del edificio. Le hablas, entiende lo que le dices, y hace algo:
- "Me comi 200g de pollo" → registra la comida y actualiza calorias
- "Cuanta agua llevo?" → lee el dato y te lo dice
- "No tengo ganas" → te da un mensaje motivacional

**IMPORTANTE:** Por decision tuya, NO usa inteligencia artificial (como ChatGPT). Es **reglas programadas** que reconocen patrones de texto. Esto lo hace:
- Instantaneo (< 50 milisegundos)
- Sin costos (no paga por API)
- Completamente offline
- Predecible

La contra: hay que ensenarle todas las formas posibles de decir las cosas (millones de variaciones). Por eso hay un **sistema de reporte de fallos**: cuando el chat no entiende algo, se registra automaticamente para que luego se le ensene esa variacion.

---

### 📊 EL MOTOR DE DATOS (Engine) - Los calculos

**Que es:** Todas las operaciones matematicas y logicas que la app hace.

**Archivos:**
| Archivo | Rol |
|---------|-----|
| `engine.js` | Calculos (calorias, rachas, XP, notificaciones) |
| `meals.js` | Config personalizada de comidas |
| `routines.js` | Config personalizada de rutinas |
| `exerciseDB.js` | Base de datos de ejercicios (134 items) |
| `data.js` | Datos estaticos heredados (legacy) |

**Que calcula:**
- **Calorias del dia**: suma de todo lo que comiste
- **Macros**: proteina, carbos, grasa, fibra totales
- **Agua**: cuantos mL llevas
- **Racha**: cuantos dias seguidos completaste las metas
- **XP y nivel**: sistema de gamificacion (como videojuego)
- **Badges**: logros desbloqueables
- **Proyecciones**: cuando llegaras a tu meta si sigues asi
- **Notificaciones**: cuando recordarte cosas

**Analogia:** Es como los **sistemas mecanicos** del edificio (aire acondicionado, ascensores). Trabajan atras del escenario, no los ves pero si fallan, todo se siente mal.

---

### 🔒 CONTROL DE ACCESO (Auth) - Quien entra

**Que es:** Sistema de cuentas, login, permisos.

**Archivos:**
| Archivo | Rol |
|---------|-----|
| `api.js` (frontend) | Comunicacion con el servidor |
| `server/routes/auth.js` | Endpoints de registro/login/recovery |
| `server/middleware.js` | Verificacion de permisos |

**Como funciona (analogia):**
Es como el **control de acceso de un edificio**:
1. **Registro**: creas cuenta con usuario + password + PIN de recuperacion (4 digitos)
2. **Login**: entras con usuario + password → recibes una "tarjeta magnetica" (llamada **JWT token**) valida por 7 dias
3. **Cada vez que haces algo** (ver datos, guardar): muestras la tarjeta
4. **Si olvidas password**: usas el PIN para resetearla
5. **Si fallas 10 veces**: tu cuenta se bloquea (anti-hackers)

**Seguridad aplicada:**
- Passwords hasheados con bcrypt (no se guardan en texto plano)
- JWT firmado con llave secreta (no se puede falsificar)
- Rate limiting (no te dejan probar passwords infinito)
- Bloqueo automatico tras 10 intentos fallidos
- Audit log (se registra cada login, cada cambio de password)

---

### 🏗️ EL BACKEND (Servidor) - El motor central

**Que es:** El servidor que recibe peticiones, procesa, responde.

**Tecnologias:** Node.js + Express.

**Archivos:**
| Archivo | Rol |
|---------|-----|
| `server/index.js` | Servidor principal (punto de entrada) |
| `server/db.js` | Acceso a la base de datos |
| `server/middleware.js` | Filtros de seguridad |
| `server/routes/auth.js` | Rutas de autenticacion |
| `server/routes/data.js` | Rutas de datos del usuario |
| `server/routes/admin.js` | Rutas de admin |
| `server/routes/audit.js` | Rutas de audit log |
| `server/routes/errors.js` | Rutas de error reporting |

**Como trabaja (analogia):**
Es como una **oficina central** a donde llegan todas las peticiones:
- Recepcionista (middleware) revisa credenciales
- Departamentos (rutas) atienden cada tipo de peticion
- Archivo central (db.js) guarda/recupera datos

**Corre en:** Render.com (servicio de hosting gratuito)

---

### 💾 LA BASE DE DATOS (DB) - Donde se guarda todo

**Que es:** El almacen permanente de informacion.

**Actualmente (v1.x):**
| Archivo | Contiene |
|---------|----------|
| `server/data/users.json` | Lista de cuentas (usernames, passwords hasheados, PINs) |
| `server/data/database.json` | Todos los datos de usuarios (comidas, ejercicios, etc) |
| `server/data/audit.json` | Log de actividad |
| `server/data/errors.json` | Reportes de errores |

**Todos encriptados con AES-256-CBC** (mismo tipo de encriptacion que usa el gobierno).

### 🚨 PROBLEMA CRITICO (lo encontre en la auditoria):

Render Free Tier usa **"disco efimero"**. Esto significa que cuando el servidor se reinicia (por deploy o por estar inactivo), **TODOS los .json se borran**. Por eso:
- Tu cuenta que creaste la vez pasada se perdio
- Cualquier usuario nuevo pierde datos al rato

**Solucion ya aprobada por ti: migrar a Supabase** (Postgres gratis 500MB, persistente, backups automaticos).

---

### 🌐 LOS SERVICIOS EXTERNOS

**Que son:** Empresas/plataformas gratuitas donde vive la app.

| Servicio | Para que | Costo |
|----------|----------|-------|
| **GitHub** | Guardar el codigo y su historial | $0 |
| **Render.com** | Ejecutar el servidor 24/7 | $0 |
| **Supabase** (pendiente migrar) | Base de datos persistente | $0 |
| **Uptime Robot** (pendiente) | Verificar que no se caiga | $0 |

---

## 4. Como fluye la informacion

### Ejemplo 1: Usuario abre la app por primera vez

```
1. Usuario entra a libra-fit-app.onrender.com
       ↓
2. Su navegador pide los archivos al servidor (HTML, CSS, JS)
       ↓
3. Servidor envia todo (se cachea en el celular)
       ↓
4. La app carga y muestra pantalla de login
       ↓
5. Usuario se registra (usuario + password + PIN)
       ↓
6. Frontend envia registro al servidor (encriptado via HTTPS)
       ↓
7. Servidor hashea password, guarda cuenta, genera tarjeta magnetica (JWT)
       ↓
8. Frontend recibe tarjeta y la guarda en memoria del navegador
       ↓
9. Se dispara onboarding: app pregunta nombre, meta, peso, etc.
       ↓
10. Todo se guarda en localStorage (cache local) Y en el servidor
```

### Ejemplo 2: Usuario registra una comida

```
1. Usuario tocqueia "Desayuno" → marca como completado
       ↓
2. Frontend ACTUALIZA LA UI INSTANTANEAMENTE (Optimistic UI)
       ↓
3. En paralelo (sin bloquear), envia el cambio al servidor
       ↓
4. Servidor actualiza la base de datos
       ↓
5. Si el usuario cambia de dispositivo, al loguearse:
   - Se descargan todos los datos del servidor
   - El dato del desayuno aparece inmediato
```

### Ejemplo 3: Usuario dice a Libra "me comi 200g de salmon"

```
1. Usuario escribe en el chat de Libra
       ↓
2. Libra normaliza el texto (quita acentos, puntuacion)
       ↓
3. Libra detecta entidades:
   - Cantidad: 200
   - Unidad: g (gramos)
   - Alimento: salmon
       ↓
4. Libra puntua intents (intenciones posibles):
   - log_meal: 92% confianza ← gana
   - ask_calories: 12%
   - plan_meal: 35%
       ↓
5. Como confianza > 60%, ejecuta la accion
       ↓
6. Busca "salmon" en la base de alimentos → 206 cal/100g
       ↓
7. Calcula: 200g × 206/100 = 412 cal
       ↓
8. Registra en las comidas del dia
       ↓
9. Responde: "Anotado! 200g de salmon = 412 cal. Llevas 1,234/2,000 cal hoy."
       ↓
10. Actualiza UI en la pantalla Hoy si el usuario la abre
```

---

## 5. Quien hace que cosa (mapa de archivos)

### Frontend (lo que corre en el navegador del usuario)

```
FitRicardo/
├─ index.html             🏠 La casa (estructura)
├─ styles.css             🎨 La pintura y acabados
├─ manifest.json          📄 Permiso de ocupacion PWA
├─ sw.js                  🔌 Sistema offline
│
├─ app.js                 🧭 Navegacion y pantallas
├─ api.js                 🔗 Puente al servidor
├─ engine.js              🧮 Calculadora (calorias, rachas)
├─ libra.js               🗣️ Chat de Libra
├─ meals.js               🍽️ Gestion comidas personalizadas
├─ routines.js            🏋️ Gestion rutinas personalizadas
├─ exerciseDB.js          📚 Base datos 134 ejercicios
├─ data.js                📜 Datos legacy (a limpiar)
├─ errorReport.js         🐞 Capturador de errores
│
├─ admin.html             👨‍💼 Panel de administrador
├─ icons/                 🎯 Iconos PWA
│
└─ server/                🏢 Servidor (no corre en el navegador)
    ├─ index.js           Punto de entrada servidor
    ├─ db.js              Acceso a DB
    ├─ middleware.js      Filtros de seguridad
    ├─ package.json       Dependencias
    └─ routes/
        ├─ auth.js        Login, registro, recovery
        ├─ data.js        CRUD datos usuario
        ├─ audit.js       Log de auditoria
        ├─ admin.js       Endpoints admin
        └─ errors.js      Reportes de errores
```

### Documentos (guias y especificaciones)

```
├─ CLAUDE.md              📖 Contexto del proyecto (Claude lee esto primero)
├─ DEVELOPMENT.md         📋 Plan y changelog
├─ DESIGN_PRINCIPLES.md   ⚖️ 10 mandamientos de diseno
├─ ARCHITECTURE.md        🏗️ Revision de arquitectura
├─ AUDIT.md               🔍 Codigo basura a limpiar
├─ RESEARCH.md            🔬 Investigacion de mercado
├─ SECURITY.md            🔒 Documentacion de seguridad
├─ LIBRA_CHAT_SPEC.md     🧠 Especificacion del chat v2
├─ COMO_FUNCIONA.md       📘 ESTE DOCUMENTO
│
└─ research/              🧪 Ciencia detras de las recomendaciones
    ├─ TRAINING_SCIENCE.md      Metas, periodizacion, rutinas
    ├─ NUTRITION_SCIENCE.md     Calorias, macros, dietas
    └─ MICRONUTRIENTS.md        13 vitaminas + 12 minerales
```

---

## 6. Estado actual (que funciona) vs v2.0 (que viene)

### ✅ Lo que ya FUNCIONA en produccion (v1.3.0)

#### Core
- Login/registro con JWT + recuperacion por PIN
- Datos aislados por usuario (multi-user)
- Sync automatico localStorage ↔ servidor
- PWA instalable en celular

#### Features
- Plan de comidas editable con 60+ alimentos con macros
- Sistema de rutinas personalizable (6 templates + editor)
- Tracking de calorias, proteina, carbos, grasas, fibra, agua
- Sistema de rachas y XP (gamificacion)
- Chat Libra basico con ~20 intents + FAQ de 15 preguntas
- Quick-add de comidas sobre la marcha
- Reportes de errores al admin panel

#### Infra
- Admin panel en `/admin.html`
- Audit log completo
- Notificaciones (solo con sesion activa)
- Auto-deploy desde GitHub

### 🚧 Lo que esta PENDIENTE para v2.0 (lo que pediste)

#### Critico
- ❌ **Migrar a Supabase** (datos se pierden por disco efimero de Render)
- ❌ **Staging environment + rollback UI**
- ❌ **Limpiar codigo legacy** (tus horarios, dias, suplementos estan hardcoded como defaults)

#### Features nuevas
- ❌ **Onboarding conversacional profundo** (meta, dias, horas, comidas, alergenos, suplementos)
- ❌ **Recomendador de rutinas** segun perfil (usa exerciseDB.js + ciencia investigada)
- ❌ **Recomendador de alimentacion** (menu automatico, "armame menu con lo que tengo")
- ❌ **Tracking de micronutrientes** + alerta deficiencias
- ❌ **Tracking de suplementos** + algoritmo anti-abuso
- ❌ **Libra Coach** (se desbloquea a 7 dias de racha, recomienda cambios)
- ❌ **Libra Chat v2** (millones de variaciones entrenadas)

#### Calidad
- ❌ Tests automatizados
- ❌ Sentry (tracking de errores real)
- ❌ Refresh tokens
- ❌ 2FA opcional

### 🏭 Lo que investigamos pero NO se subio

Los ultimos 2 sub-agentes alcanzaron tu limite de API:
- ❌ `nutritionDB.js` (base de 200+ alimentos con alergenos)
- ❌ `research/SUPPLEMENTS.md` (ciencia de suplementos)

Estos se pueden regenerar cuando se resetee el limite (1am Panama) o los hago yo directamente.

---

## 7. Decisiones ya tomadas (tus decisiones)

| Tema | Decision |
|------|----------|
| Persistencia | ✅ Migrar a Supabase |
| Staging | ✅ Hacer staging environment |
| Dominio custom | ❌ Mantener libra-fit-app.onrender.com (gratis) |
| IA para chat | ❌ NO usar IA. Entrenar chat con reglas |
| Email transaccional | ❌ Mantener recuperacion por PIN (gratis, sin dominio) |
| Costo | $0 (todo gratis) |

---

## 8. Roadmap propuesto

### Semana 1: Fundacion
- Migrar de JSON a Supabase
- Cuenta Supabase + schemas (users, data, audit, errors, chat_misses)
- Adaptar `server/db.js` a usar Supabase client
- Testing que persistencia funciona

### Semana 2: Staging + Limpieza
- Branch `staging` + deploy separado
- Admin panel: boton de rollback a version anterior
- Limpiar legacy (tus horarios, dias, suplementos de defaults)
- Rebrand FitRicardo → LibraFit en todos lados

### Semana 3: Onboarding v2 + Perfil v2
- Flujo conversacional multi-paso
- Meta con submetas medibles
- Contexto: donde entrena, horarios, alergenos, suplementos actuales
- Calculo automatico BMR + TDEE + targets

### Semana 4: Recomendadores
- Motor de rutinas basado en perfil + ciencia
- Motor de alimentacion (top alimentos + "armame menu")
- Integracion exerciseDB.js + nutritionDB.js
- Tracking de micronutrientes con deteccion deficiencias

### Semana 5: Libra Chat v2 (el diferenciador)
- Refactor de libra.js con arquitectura del spec
- Lanzar sub-agentes (cuando reseteen) para generar patterns masivos
- Sistema de feedback loop (reporta fallos al admin)
- Testing con casos reales

### Semana 6: Libra Coach + Polish
- Logica de recomendaciones correctivas
- Alertas por desvio de meta
- UI de desbloqueo a 7 dias racha
- Performance tuning + tests

---

## 9. Documentos importantes que tienes

Para retomar el proyecto en cualquier momento, lee en este orden:

1. **CLAUDE.md** - Resumen del proyecto (lee primero)
2. **DESIGN_PRINCIPLES.md** - Como programar (10 mandamientos)
3. **ARCHITECTURE.md** - Revision tecnica + problemas identificados
4. **AUDIT.md** - Que limpiar del codigo legacy
5. **LIBRA_CHAT_SPEC.md** - Como funciona el chat
6. **DEVELOPMENT.md** - Plan y changelog
7. **research/** - Ciencia (nutricion, ejercicio, micronutrientes)
8. **COMO_FUNCIONA.md** - ESTE documento (vision general)

---

## 10. Glosario para ingeniero civil

| Termino | Que significa |
|---------|---------------|
| **PWA** | Progressive Web App. App web instalable como nativa. |
| **Frontend** | Lo que el usuario ve (navegador). |
| **Backend** | Servidor que procesa peticiones. |
| **API** | Forma en que frontend pide cosas al backend. |
| **JSON** | Formato de datos tipo lista de propiedades. |
| **JWT** | Token de autenticacion (tarjeta magnetica digital). |
| **Hash** | Password encriptado de una via (no se puede des-hashear). |
| **localStorage** | Memoria local del navegador (cache). |
| **Encriptacion AES-256** | Cifrado militar, el mismo que usan bancos. |
| **Render** | Servicio de hosting (equivalente a AWS pero simple/gratis). |
| **Supabase** | Base de datos en la nube (alternativa a Firebase). |
| **Endpoint** | URL especifica que hace algo (ej: `/api/login`). |
| **Intent** | Intencion detectada del usuario en el chat. |
| **Entity** | Dato extraido (ej: cantidad, alimento). |
| **Optimistic UI** | Actualizar pantalla antes de confirmar con servidor. |
| **Deploy** | Subir codigo a produccion. |
| **Rollback** | Volver a version anterior. |
| **Staging** | Ambiente de prueba separado de produccion. |

---

## 11. Preguntas que suelen surgir

### Q: La app es segura?
R: Si. Passwords hasheados con bcrypt (cost 12, mas fuerte que la mayoria). Datos encriptados en servidor con AES-256-CBC. Comunicacion HTTPS. Proteccion contra ataques comunes (rate limit, helmet, CORS restringido).

### Q: Cuanto cuesta mantener la app?
R: $0. Todo en planes gratuitos (Render + GitHub + Supabase). El unico limite es la persistencia de Render que estamos por resolver con Supabase.

### Q: Cuantos usuarios puede aguantar?
R: Con la infraestructura actual gratuita:
- Render free: hasta ~100 usuarios activos simultaneos
- Supabase free: 50,000 usuarios registrados
Suficiente para fase piloto. Escalar seria $7-25/mes cuando crezca.

### Q: Los datos de los usuarios estan seguros?
R: Si, con una advertencia: en v1.x se pueden perder por el problema del disco efimero de Render. Por eso migrar a Supabase es PRIORIDAD 1 en v2.0.

### Q: Quien puede ver los datos de los usuarios?
R: Solo:
1. El propio usuario (su cuenta)
2. Tu (via admin panel con password)
Los datos estan encriptados en servidor. Ni Render ni GitHub ven contenido.

### Q: Como se hace un cambio en la app?
R: 
1. Se edita el codigo localmente
2. Se hace `git commit` (se guarda en historial)
3. Se hace `git push` (se sube a GitHub)
4. Render detecta el push y redespliega automatico
5. En 1-2 min esta en produccion

Con staging (v2.0): ira primero a staging, se prueba, se aprueba, va a prod.

### Q: Y si lanzamos un bug?
R: En v2.0 habra sistema de rollback: desde el admin panel se puede volver a la version anterior con 1 click.

### Q: Por que no usar ChatGPT en el chat?
R: Tu decision (buena):
- No dependencia de APIs externas
- Cero costo
- Instantaneo (< 50ms vs 1-3 segundos)
- Funciona offline
- Predecible (no "alucinaciones")
- Privacidad total (nada sale de tu servidor)

La contra: requiere entrenar manualmente muchos patrones. Por eso el spec de chat v2 es extenso.

---

## 12. Como se programa la app

Como ingeniero civil, te daras cuenta que programar es similar a construir:

**Ingenieria civil** | **Desarrollo software**
---|---
Planos (arquitectura) | `ARCHITECTURE.md`, `DESIGN_PRINCIPLES.md`
Especificaciones | `LIBRA_CHAT_SPEC.md`, research docs
Cronograma obra | `DEVELOPMENT.md` (roadmap)
Libro de obra | Git commits
Entregables | Deploys a produccion
Control de calidad | Tests automatizados (pendiente)
Fiscalizacion | Code review (yo lo hago)
Normativa | `DESIGN_PRINCIPLES.md`
Materiales | Librerias (npm packages)
Mano de obra | Claude (yo)
Proyectista | Tu (defines requisitos)

---

**Este documento se actualizara cuando haya cambios mayores.**

Si quieres que profundice en alguna parte en particular, dime.
