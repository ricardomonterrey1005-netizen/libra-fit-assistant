# SECURITY.md - Libra Fit Assistant

> Documentacion completa de las medidas de seguridad implementadas en la app,
> que esta y que NO esta protegido, y recomendaciones de hardening.
> Ultima actualizacion: v1.2.0

---

## 1. Autenticacion

### Passwords
- Hasheados con **bcryptjs** (cost factor **12**).
- Nunca se almacenan en texto plano ni se retornan al cliente.
- Validacion: minimo 6 caracteres.

### JWT
- Algoritmo: **HS256** (firmado con `FR_JWT_SECRET`).
- Expiracion: **7 dias** (`JWT_EXPIRY = '7d'`).
- Enviados en header `Authorization: Bearer <token>`.
- Se verifican en cada request con `authRequired` middleware.
- El middleware tambien valida que el usuario existe y NO esta bloqueado.

### PIN de Recuperacion
- Campo opcional de 4 digitos numericos en registro.
- Hasheado con bcrypt (cost 10) en servidor.
- Endpoint `POST /api/auth/recover` valida el PIN y resetea la contrasena.
- Usa el mismo `loginLimiter` para prevenir brute-force.

### Account Lockout
- Tras **10 intentos fallidos** de login, la cuenta se bloquea (`locked = true`).
- Una cuenta bloqueada no puede iniciar sesion hasta ser desbloqueada manualmente
  o por exito del flujo de recovery (resetea `locked` a `false`).

---

## 2. Base de Datos

### Encriptacion at-rest
- Algoritmo: **AES-256-CBC**.
- Clave derivada con SHA-256 de `FR_SECRET`.
- IV aleatorio (16 bytes) por escritura; concatenado al cifrado: `iv:cipher`.
- Archivos encriptados:
  - `server/data/users.json` (usuarios)
  - `server/data/database.json` (datos por usuario)
  - `server/data/audit.json` (audit log)

### Aislamiento por usuario
- Todos los endpoints `/api/data/*` validan JWT y solo devuelven/modifican datos
  del `req.user.id` extraido del token.
- No hay forma de un usuario autenticado acceder a datos de otro usuario.

### Almacenamiento en cliente
- `localStorage` scopeado por usuario con prefijo `fr_{userId}_{key}`.
- Modo guest usa `fr_guest_`.
- Al hacer logout se limpian todas las keys del scope.

---

## 3. Proteccion de Endpoints

### Helmet
- Cabeceras HTTP de seguridad automaticas:
  - `X-DNS-Prefetch-Control`
  - `Strict-Transport-Security` (via Render HTTPS)
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`

### CORS
- Whitelist de origenes permitidos:
  - localhost (desarrollo)
  - Redes locales `192.168.x.x`
  - `*.onrender.com`, `*.railway.app`
- `credentials: true` para cookies (actualmente no se usan).

### Rate Limiting (`express-rate-limit`)
| Endpoint | Limite | Ventana |
|---------|--------|---------|
| General `/api/*` | 100 req | 1 min |
| `/api/auth/login` | 5 intentos | 15 min |
| `/api/auth/recover` | 5 intentos | 15 min |
| `/api/auth/register` | 3 registros | 1 hora |

Todas las violaciones se registran en el audit log con `action: 'rate_limited'`.

### Input Sanitization
- Middleware `sanitize` elimina `__proto__`, `constructor`, `prototype` de
  bodies JSON para prevenir prototype pollution.
- `express.json({ limit: '1mb' })` previene payloads gigantes.
- Usernames validados con regex `/^[a-zA-Z0-9_]+$/`.

---

## 4. Audit Logging

Cada evento relevante se registra en `audit.json` (encriptado):
- `register`, `register_failed`
- `login`, `login_failed`, `login_blocked`, `account_locked`
- `password_changed`, `password_change_failed`
- `password_recovered`, `recover_failed`
- `auth_failed` (token invalido)
- `rate_limited`, `login_rate_limited`
- `server_error`, `server_start`
- `day_update`, `weight_logged`, `exercise_logged`, `profile_update`, `goals_update`
- `admin_stats`, `admin_export_users`, `admin_access_denied`

Cada registro incluye: `id`, `timestamp`, `action`, `userId`, `detail`, `ip`,
`userAgent`, `status`.

Se mantiene un maximo de 10.000 entradas (rotacion automatica).

---

## 5. Panel de Admin

### Proteccion
- Acceso en `/admin.html` (frontend estatico).
- Endpoints bajo `/api/admin/*`:
  - `POST /api/admin/stats` (password en body)
  - `GET /api/admin/audit?password=...`
  - `POST /api/admin/export-users`
- Password comparada con `process.env.ADMIN_PASSWORD`.
- Default: `LibraAdmin2026!` — **cambiala en Render dashboard**.

### Lo que el admin VE
- Lista de usuarios con: username, createdAt, lastLogin, loginCount, locked,
  failedAttempts, hasRecoveryPin (booleano), dataKeysCount.
- Audit log paginado y filtrable por accion.
- Stats del servidor (uptime, version Node, tamaño total de datos).

### Lo que el admin NO VE
- Passwords (ni hash).
- JWT tokens.
- PIN hashes.
- Contenido crudo de `database.json` por usuario.

---

## 6. Lo que NO esta protegido (limitaciones conocidas)

- **No hay 2FA / MFA.** Solo password + PIN de recuperacion.
- **Password esta en memoria brevemente** durante el hash/compare de bcrypt.
  Estandar en cualquier app; mitigacion es no hacer dumps de memoria del server.
- **No hay rotacion automatica de JWT** — un token robado vale 7 dias.
- **No hay revocacion de tokens** (blacklist). Al cambiar password, tokens viejos
  siguen validos hasta su expiracion natural.
- **ADMIN_PASSWORD no tiene rate limit dedicado** — usa el general de `/api`
  (100 req/min). Considera agregar uno especifico si es critico.
- **No hay CSP (Content-Security-Policy)** — deshabilitado para servir frontend
  propio.
- **Service Worker cachea en el cliente** — datos sensibles cacheados en localStorage
  son legibles por otro JS que corra en el mismo origen (proteccion via same-origin
  policy del browser).
- **Render free tier** se duerme tras inactividad; no hay HA.

---

## 7. Como rotar claves

### `FR_SECRET` (clave de encriptacion de BD)
**CUIDADO:** si rotas esto con datos existentes, los .json encriptados dejan de
poder leerse.

Proceso seguro:
1. Desde el servidor corriente, llama a `db.flush()` para asegurar escritura.
2. Corre un script que lea con la clave vieja y reescriba con la nueva
   (descencriptar todo en memoria → cambiar env var → re-encriptar).
3. Solo despues, actualiza `FR_SECRET` en Render y reinicia.

### `FR_JWT_SECRET`
Seguro de rotar en cualquier momento. Efecto: todos los usuarios tendran que
re-loguearse (sus tokens actuales se vuelven invalidos). Deseable si sospechas
un token comprometido.

### `ADMIN_PASSWORD`
Cambiar en Render dashboard. Toma efecto al reiniciar.

---

## 8. Recomendaciones de hardening para produccion

- [ ] Implementar 2FA (TOTP) para admin y opcionalmente usuarios.
- [ ] Agregar rate limiter especifico para `/api/admin/*` (ej. 10/min).
- [ ] Blacklist de tokens JWT al cambiar password o logout explicito.
- [ ] Rotar `FR_JWT_SECRET` periodicamente (cada 90 dias).
- [ ] Agregar notificacion al usuario por login desde IP nueva.
- [ ] CAPTCHA en registro/login tras N fallos desde la misma IP.
- [ ] Considerar migrar a SQLite/Postgres con cifrado de columna si crece > 100 usuarios.
- [ ] Backups automaticos diarios de `server/data/` a almacenamiento offsite.
- [ ] Monitoreo con alertas (ej. Sentry) para `server_error` y spikes de `login_failed`.
- [ ] HTTPS forzado (Render lo hace por default).
- [ ] CSP estricto cuando se consolide el frontend.

---

## 9. Variables de entorno de produccion

| Variable | Proposito | Default |
|----------|-----------|---------|
| `PORT` | Puerto HTTP | 3001 |
| `FR_SECRET` | Clave AES-256 para BD | fallback inseguro |
| `FR_JWT_SECRET` | Secreto HS256 para JWT | fallback inseguro |
| `ADMIN_PASSWORD` | Password del panel admin | `LibraAdmin2026!` |
| `NODE_ENV` | Entorno | `production` |

**Importante:** los defaults `fitricardo-secure-key-*` y `LibraAdmin2026!`
DEBEN cambiarse en produccion. En Render: Dashboard → Environment.

---

## 10. Contacto / Reportar vulnerabilidades

Email: ricardo.monterrey1005@gmail.com

No divulgues publicamente antes de contactar.
