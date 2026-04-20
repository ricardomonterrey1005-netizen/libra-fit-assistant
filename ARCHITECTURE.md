# ARCHITECTURE.md - Revision Completa de Sistema

> Fecha: 2026-04-19
> Proposito: Auditar cada capa (frontend, backend, DB, seguridad, deploy, etc)
> Identificar: que funciona, que falta, que esta roto

---

## 🚨 ALERTA CRITICA: Perdida de Datos en Render Free Tier

### El problema
Render Free Tier usa **discos efimeros** (ephemeral disk).
Esto significa que cuando el servicio:
- Se reinicia (ej: despues de un deploy)
- Se duerme (15 min inactividad, plan free)
- Se apaga por cualquier razon

**TODOS los archivos creados durante la ejecucion se BORRAN.**

### Que datos estamos guardando asi?
```
server/data/database.json   - TODOS los datos de los usuarios
server/data/users.json      - Cuentas, passwords, PINs
server/data/audit.json      - Log de auditoria
```

### Impacto
- Cada vez que Render reinicia el servicio (puede ser varias veces al dia), se pierden:
  - Todas las cuentas creadas
  - Todo el progreso de los usuarios
  - Todos los reportes de errores
  - Todo el audit log

### La evidencia
Esto explica perfectamente por que tu cuenta que creaste en un deploy anterior **no pudo loguearse despues**: el servidor se reinicio, el `users.json` se perdio, tu cuenta dejo de existir.

### Solucion urgente (3 opciones gratuitas)

#### Opcion A: Supabase (RECOMENDADO)
- Postgres gratis 500MB
- Auth incluido (podemos reemplazar o mantener el nuestro)
- Storage para archivos
- Se mantiene persistente
- API REST o client JS
- Costo: **$0**

#### Opcion B: Neon
- Postgres serverless gratis 0.5GB
- Solo DB, sin auth/storage extra
- Dormido = cold start pero persiste data
- Costo: **$0**

#### Opcion C: Render Disk Attached
- Adjuntar disco persistente a Render
- Mantenemos JSON files
- Minimo $7/mes
- **El usuario NO quiere gastar dinero**

### Recomendacion
**Migrar a Supabase** (opcion A). Ventajas:
- 100% gratis para nuestro tamano
- Postgres "real" con queries SQL
- Podemos escalar sin dolor
- Backups automaticos gratis
- Es exactamente lo que apps pro usan

### Tiempo estimado de migracion
- Convertir db.js a usar Supabase client: 3-4 horas
- Migrar schemas (users, data, audit, errors): 1-2 horas
- Testing: 2 horas
- **Total: 6-8 horas**

---

## 📋 Revision Completa por Capa

### 1. Frontend (Vanilla JS PWA)

#### ✅ Lo que funciona bien
| Aspecto | Estado |
|---------|--------|
| PWA instalable | Si (manifest + sw.js) |
| Offline-first | Si (service worker cachea assets) |
| Responsive mobile-first | Si |
| Dark theme | Si |
| Storage por usuario | Si (scoped localStorage v1.1.0) |
| Sync con server | Si (api.js + Sync module) |
| Auth flow | Si (JWT + PIN recovery) |
| i18n preparado | No (solo espanol por ahora, OK) |

#### ❌ Lo que falta
| Gap | Impacto | Prioridad |
|-----|---------|-----------|
| No minificacion | ~500KB JS sin comprimir carga lento | Media |
| No bundler (webpack/vite) | Scripts sueltos, orden importa | Baja |
| Sin TypeScript | Errores de tipo en runtime | Baja |
| Sin lazy loading | Carga todo al inicio | Media |
| Sin tests (Jest, Playwright) | Cambios pueden romper cosas | Alta |
| Sin error tracking real (Sentry) | Solo tenemos nuestro reporter basico | Media |
| Sin analytics | No sabemos que usan los users | Baja |
| No hay preload de fonts | FOIT/FOUT en mobile lento | Baja |

---

### 2. Backend (Node/Express)

#### ✅ Lo que funciona bien
| Aspecto | Estado |
|---------|--------|
| JWT auth | Si (HS256, 7 dias) |
| Bcrypt passwords | Si (cost 12) |
| Rate limiting | Si (login, register, API general) |
| Helmet security headers | Si |
| CORS configurado | Si (restringido a dominios propios) |
| Input sanitization | Si (middleware) |
| Audit log | Si (con filtros) |
| Error 500 handler | Si |
| SPA fallback | Si |

#### ❌ Lo que falta
| Gap | Impacto | Prioridad |
|-----|---------|-----------|
| **No persistencia (ephemeral disk)** | **DATOS SE PIERDEN** | **CRITICA** |
| Sin validacion de schemas (Zod/Joi) | Campos malformados pasan | Alta |
| Sin API versioning (/api/v1, /api/v2) | Cambios breaking afectan users | Media |
| Sin paginacion estandarizada | Respuestas grandes pueden romper | Media |
| Sin request ID tracing | Debugging dificil | Baja |
| Sin health check profundo | Solo uptime, no DB health | Media |
| Sin graceful shutdown | Conexiones abiertas se cortan | Baja |
| No hay monitoring (uptime robot) | No sabemos si esta caido | Media |
| Sin backup automatizado | **Si DB existiera, no hay backups** | Alta |

---

### 3. Base de Datos (JSON encriptado)

#### ✅ Lo que funciona bien
| Aspecto | Estado |
|---------|--------|
| Encriptacion AES-256-CBC | Si |
| Debounced writes | Si (previene overwrites rapidos) |
| Save en SIGINT/SIGTERM | Si (pero no ayuda con ephemeral disk) |
| Datos por usuario aislados | Si |
| Audit log integrado | Si |

#### ❌ Lo que falta
| Gap | Impacto | Prioridad |
|-----|---------|-----------|
| **No persistencia real** | **Todo se pierde al reiniciar** | **CRITICA** |
| No hay migraciones | Cambios de schema rompen datos viejos | Alta |
| No hay queries/indexes | O(n) para encontrar nada | Alta |
| Single file = no escala | Un solo archivo para todo | Media |
| No hay concurrency control | Race conditions potenciales | Media |
| Sin backups externos | No hay fallback si se corrompe | **CRITICA** |
| Sin historial de cambios | No sabemos que cambio cuando | Media |

---

### 4. Seguridad

#### ✅ Lo que funciona bien
| Aspecto | Estado |
|---------|--------|
| Passwords bcrypt cost 12 | Si |
| JWT con secret en env | Si |
| AES-256-CBC para DB | Si |
| PIN recovery bcrypt | Si |
| Rate limit login (5/15min) | Si |
| Rate limit register (3/hora) | Si |
| Account lockout (10 fails) | Si |
| CORS whitelist | Si |
| Helmet headers | Si |
| HTTPS enforced en Render | Si |
| Input sanitization | Si |
| No secrets en git | Si (via env vars) |

#### ❌ Lo que falta
| Gap | Impacto | Prioridad |
|-----|---------|-----------|
| **Default secrets en codigo** | Si deploy sin env, usa default publico | Alta |
| Sin 2FA | Cuentas vulnerables | Media |
| Sin session revocation (JWT blacklist) | Token comprometido sigue valido 7d | Alta |
| Sin CSP headers estrictos | XSS mitigation debil | Media |
| Sin SRI en scripts externos (fonts) | Supply chain attack posible | Baja |
| Sin penetration testing | No sabemos vulnerabilidades reales | Media |
| Admin password default visible | `LibraAdmin2026!` en codigo | Alta |
| Sin refresh tokens | Unico JWT = peligro si comprometido | Media |
| No hay encryption at rest en DB (si fuera SQL) | N/A hasta migrar | Alta |
| Sin WAF (Web Application Firewall) | Ataques basicos no filtrados | Media |

---

### 5. Deploy / DevOps

#### ✅ Lo que funciona
| Aspecto | Estado |
|---------|--------|
| Auto-deploy desde GitHub | Si (push a master) |
| SSL/HTTPS automatico | Si (Render) |
| Variables de entorno | Si |
| Logs accesibles | Si (Render dashboard) |

#### ❌ Lo que falta (TU PEDIDO)
| Gap | Impacto | Prioridad |
|-----|---------|-----------|
| **Sin ambiente staging** | Cambios van directo a prod | **ALTA** |
| **Sin rollback facil** | Bug en prod = panico | **ALTA** |
| **Sin versionado/tags** | No podemos referirnos a versiones | **ALTA** |
| Sin CI/CD pipeline (tests, lint) | Codigo roto puede llegar a prod | Alta |
| Sin feature flags | No podemos activar features gradualmente | Media |
| Sin canary/blue-green deploy | Todos los users afectados simultaneo | Media |
| Sin Infrastructure as Code (Terraform) | Config manual en Render | Baja |

---

## 🎯 Solucion: Sistema Staging + Rollback (Tu Pedido)

### Arquitectura Propuesta

```
┌─────────────────────────────────────────────────────────────┐
│                     GitHub Repository                        │
│                                                               │
│  master branch         staging branch      tags (releases)   │
│  (production)          (testing)           v1.0.0, v1.1.0..  │
└───────────┬────────────────────┬────────────────┬───────────┘
            │                    │                │
            ▼                    ▼                ▼
    ┌──────────────┐    ┌──────────────┐  ┌──────────────┐
    │ Render Prod  │    │ Render Staging│  │ Git History  │
    │ libra-fit-app│    │libra-fit-test│  │ (rollback)   │
    │              │    │              │  │              │
    │ Users reales │    │ Testing Admin│  │ Any commit   │
    └──────────────┘    └──────────────┘  └──────────────┘
            │                    │                │
            └────────┬───────────┴────────┬───────┘
                     ▼                    ▼
            ┌──────────────────────────────────────┐
            │       Supabase (DB Persistente)       │
            │                                        │
            │  prod_users, prod_data, prod_audit    │
            │  staging_users, staging_data, ...     │
            └──────────────────────────────────────┘
```

### Flujo de Release

```
1. Desarrollo local
   ↓
2. git push origin staging
   → Deploy automatico a libra-fit-staging.onrender.com
   → Admin prueba ahi (con usuarios de prueba)
   ↓
3. Admin aprueba → Merge staging → master
   → git tag v1.x.x
   → Deploy a libra-fit-app.onrender.com (production)
   ↓
4. Si hay bug critico:
   → Admin panel boton "Rollback"
   → Lista de versiones (tags) recientes
   → Selecciona v1.x.x-1
   → Render redespliega ese commit
   → Production vuelve a estado estable
```

### Implementacion v2.0

#### Fase 1: Staging environment
```yaml
# render.yaml (actualizado)
services:
  - type: web
    name: libra-fit-app         # Production
    branch: master
    envVars:
      - key: ENVIRONMENT
        value: production
      - key: DB_SCHEMA_PREFIX
        value: prod_

  - type: web
    name: libra-fit-staging      # Staging
    branch: staging
    envVars:
      - key: ENVIRONMENT
        value: staging
      - key: DB_SCHEMA_PREFIX
        value: staging_
```

Staging URL: `https://libra-fit-staging.onrender.com`
- Misma funcionalidad que prod
- DB separada (schema prefix)
- Banner arriba: "⚠️ STAGING - Datos de prueba"
- Solo admin puede acceder (requiere login admin)

#### Fase 2: Version tagging y archive
```bash
# Automatizado via GitHub Actions (gratis)
on:
  push:
    branches: [master]

jobs:
  tag-and-release:
    - Read version from package.json
    - Create git tag
    - Create GitHub Release with changelog
    - Save snapshot of codebase
```

#### Fase 3: Rollback UI en Admin Panel
Nueva seccion en `/admin.html`:

```
┌──────────────────────────────────────────┐
│  🔄 Control de Versiones                  │
├──────────────────────────────────────────┤
│  Version actual en produccion: v1.3.0    │
│  Deployed: 2026-04-19 14:22 UTC          │
│                                           │
│  Historial:                               │
│  ● v1.3.0 (actual) - Custom config ✓     │
│  ○ v1.2.0 - Admin panel + onboarding     │
│  ○ v1.1.0 - Auth refactor                │
│  ○ v1.0.0 - Release inicial              │
│                                           │
│  [🔙 Rollback a v1.2.0]                  │
│                                           │
│  Testing en staging:                      │
│  staging.libra-fit-app.com (v1.4.0-beta) │
│  [🚀 Promover staging a produccion]      │
└──────────────────────────────────────────┘
```

#### Fase 4: Feature flags
Para cambios menores sin re-deploy:
```js
const FEATURES = {
  newChat: { enabled: false, rolloutPct: 0 },     // Off para todos
  libraCoach: { enabled: true, rolloutPct: 100 }, // On para todos
  newOnboarding: { enabled: true, rolloutPct: 50 } // 50% de users
};

// En cliente
if (Features.isEnabled('newChat', userId)) {
  // Nuevo chat
} else {
  // Chat viejo
}
```

Feature flags se administran desde el admin panel.

---

## 📊 Matriz de Prioridades v2.0

### 🔴 CRITICO (hacer primero o datos se siguen perdiendo)
1. **Migrar DB a Supabase** - Datos persisten
2. **Backups automaticos** - Seguridad de datos
3. **Cambiar ADMIN_PASSWORD default** (ya configurado en env pero aun esta hardcoded como fallback)
4. **Environment detection** (prod/staging/dev)

### 🟡 ALTA (tu pedido explicito)
5. **Staging environment** (branch + deploy separado)
6. **Rollback UI** en admin panel
7. **Version tagging** automatico
8. **Feature flags** basicos
9. **Limpiar legacy Ricardo-specific** (segun AUDIT.md)

### 🟢 MEDIA (calidad)
10. **Input validation con Zod**
11. **Tests basicos** (Vitest + Playwright)
12. **Sentry para error tracking real**
13. **CI/CD pipeline** (GitHub Actions)
14. **Refresh tokens** en auth
15. **2FA opcional**
16. **CSP headers estrictos**

### 🔵 BAJA (polish)
17. TypeScript migration
18. Bundler (Vite)
19. Lazy loading
20. Analytics privacy-friendly (Plausible)

---

## 🔐 Secretos que Deben Rotarse Periodicamente

| Secret | Donde | Rotacion |
|--------|-------|----------|
| FR_JWT_SECRET | env var Render | Cada 6 meses |
| FR_SECRET (encryption) | env var Render | Cada 12 meses (cuidado: si rotas sin re-encriptar, pierdes datos) |
| ADMIN_PASSWORD | env var Render | Cada 3 meses |
| SUPABASE_SERVICE_KEY (cuando migremos) | env var | Cada 6 meses |
| GitHub tokens (si usamos GitHub Actions) | GitHub secrets | Cada 6 meses |

---

## 🧪 Testing Strategy (Propuesta v2.0)

### Unit tests (Vitest)
- engine.js: calBudget, todayCal, macros
- meals.js: calcMealMacros, swapFood
- routines.js: buildRoutine
- libra.js: intent detection, FAQ lookup

### Integration tests (Supertest)
- POST /api/auth/register + login flow
- POST /api/data/set + GET /api/data/all
- Rate limit triggers

### E2E tests (Playwright)
- Register new user → onboarding → Hoy page
- Login → modify meals → logout → login → data persisted
- Error report flow

### Manual test checklist
- Nuevos usuarios en incognito
- Cross-device sync
- PWA install iOS/Android
- Offline mode
- Admin panel

---

## 📈 Observability (Lo que nos falta saber)

### Metricas importantes (gratis con buenas tools)

#### Plausible Analytics (privacy-friendly, $0 self-hosted o $9/mo cloud)
- Unique visitors
- Popular pages
- Countries
- Devices
- **Sin cookies, GDPR compliant**

#### Sentry (free tier 5k errors/mo)
- Errores JS en produccion
- Performance (Web Vitals)
- Release tracking
- User context

#### UptimeRobot (free 50 monitors)
- Ping cada 5 min
- Alerta por email si cae

#### Logtail / BetterStack (free 1GB logs/mo)
- Logs agregados del server
- Full-text search
- Alertas por patrones

---

## 💾 Plan de Backup (Propuesta)

### Con Supabase
- **Backup nativo Supabase**: snapshot diario automatico (free tier)
- **Backup adicional nuestro**: job nocturno que exporta JSON a GitHub Gist (gratis, versionado)
- **Backup local**: boton en admin panel para exportar todo a JSON descargable

### Script de backup
```js
// server/scripts/backup.js
async function backupToGitHub() {
  const data = await db.exportAll();
  const encrypted = encrypt(JSON.stringify(data));
  const filename = `backup-${new Date().toISOString()}.enc`;

  // Upload como gist privado via GitHub API
  await fetch('https://api.github.com/gists', {
    method: 'POST',
    headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
    body: JSON.stringify({
      description: `Backup ${filename}`,
      public: false,
      files: { [filename]: { content: encrypted } }
    })
  });
}

// Cron: todos los dias a las 3 AM
setInterval(backupToGitHub, 24 * 60 * 60 * 1000);
```

### Retention policy
- Ultimos 7 dias: diarios
- Ultimas 4 semanas: semanales
- Ultimos 12 meses: mensuales
- Eliminar automaticamente mas viejos

---

## 🎯 Roadmap Recomendado

### Semana 1: Fundacion
- [ ] Migrar a Supabase (CRITICO)
- [ ] Configurar staging environment
- [ ] Implementar version tagging automatico
- [ ] Cambiar defaults de secrets

### Semana 2: Rollback + Limpieza
- [ ] Admin panel rollback UI
- [ ] Limpiar codigo legacy (Ricardo-specific)
- [ ] Rebrand FitRicardo → Libra Fit
- [ ] Backup automatico a GitHub Gist

### Semana 3: Features v2.0
- [ ] Profile v2 con onboarding conversacional
- [ ] Recomendador de rutinas
- [ ] Recomendador de alimentacion
- [ ] Integrar exerciseDB.js + nutritionDB.js
- [ ] Tracking de micronutrientes

### Semana 4: Libra Inteligente
- [ ] Libra Coach (desbloqueable 7 dias)
- [ ] Libra Chat mejorado (Groq AI gratis)
- [ ] Sistema de alertas por deficiencias
- [ ] Quick-add sobre la marcha

### Semana 5: Calidad
- [ ] Tests basicos
- [ ] Sentry + UptimeRobot
- [ ] Input validation Zod
- [ ] Refresh tokens

### Semana 6: Polish
- [ ] Feature flags
- [ ] Rate limits afinados
- [ ] CSP estricto
- [ ] Performance optimizacion

---

## ❓ Preguntas Abiertas para el Usuario

1. **Supabase**: Ok migrar? (gratis, resuelve persistencia)
2. **Tier Render**: Seguimos free o consideras paid ($7/mo da persistencia nativa)?
3. **Dominio custom**: Te interesa un dominio propio (ej: librafit.app) o seguimos con .onrender.com?
4. **Email transaccional**: Para reset de password via email (en lugar de solo PIN), necesitariamos SendGrid/Resend free tier
5. **Modelo de AI para Libra**: Ok usar Groq API gratis? Requiere crear cuenta gratis y guardar key en env

---

## 📝 Conclusion

La app tiene **buena base** en muchas areas (seguridad, PWA, arquitectura modular). Pero tiene:

- **1 problema CRITICO**: datos se pierden por Render ephemeral disk
- **3 gaps importantes** para el nuevo pedido: staging, versioning, rollback
- **~15 mejoras** recomendadas para escala

**Orden recomendado:**
1. Resolver persistencia (Supabase) - sin esto nada mas importa
2. Staging + rollback (tu pedido)
3. Limpieza legacy + features v2.0
4. Calidad y observability

---

*Documento generado como parte del audit completo pre-v2.0.*
