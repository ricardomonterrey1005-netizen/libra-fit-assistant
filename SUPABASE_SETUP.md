# SUPABASE_SETUP.md - Guia paso a paso

> Proposito: Resolver el problema critico de persistencia en Render Free tier.
> Render Free tiene **disco efimero**: cada reinicio borra los datos.
> Supabase es **gratis** (500 MB) y persistente con backups automaticos.

---

## Por que Supabase

La app usa archivos JSON encriptados (`users.json`, `database.json`, `audit.json`)
para guardar todo. En Render Free tier estos archivos viven en disco efimero:
**se borran en cada restart, deploy, o tras 15 min de inactividad**.

Supabase Storage:
- ✅ Gratis hasta 1 GB (necesitamos < 10 MB realmente)
- ✅ Persistencia real con backups diarios automaticos
- ✅ Se sincroniza en background (no bloquea la app)
- ✅ Mismos archivos encriptados (nuestro AES-256-CBC sigue aplicando)
- ✅ Fallback graceful: si no hay Supabase, la app funciona con disco local

---

## Pasos (hacerlo UNA vez, 10 minutos)

### 1. Crear cuenta en Supabase
1. Ir a https://supabase.com
2. Click en "Start your project"
3. Iniciar sesion con GitHub (o crear cuenta nueva)

### 2. Crear proyecto
1. Click en "New Project"
2. Nombre: `librafit` (o lo que prefieras)
3. Database Password: genera uno fuerte (lo usas raro despues, Supabase lo guarda)
4. Region: `South America (Sao Paulo)` - el mas cercano a Panama
5. Plan: **Free**
6. Click "Create new project" (tarda ~2 min)

### 3. Obtener las credenciales
Ya con el proyecto creado:

1. En el sidebar izquierdo: click "Project Settings" (icono engranaje abajo)
2. En Settings: click "API"
3. Vas a ver 3 valores importantes:

```
Project URL:       https://xxxxxxxxxxxx.supabase.co
Project API keys:
  anon / public:   eyJhbG... (NO usar este)
  service_role:    eyJhbG... (USAR ESTE - es secret)
```

**IMPORTANTE:** Usa el **service_role key** (no el anon key). Aparece con un
warning rojo "This key has the ability to bypass Row Level Security. Never share
it publicly." - precisamente por eso lo necesitamos (uso backend).

### 4. Configurar env vars en Render

1. Ir a https://dashboard.render.com
2. Abrir tu servicio `libra-fit-app`
3. En sidebar izquierdo: click "Environment"
4. Agregar 3 env vars:

```
Key: SUPABASE_URL
Value: https://xxxxxxxxxxxx.supabase.co  (el Project URL del paso 3)

Key: SUPABASE_SERVICE_KEY
Value: eyJhbG...  (el service_role key completo del paso 3)

Key: SUPABASE_BUCKET
Value: librafit-data  (opcional, este es el default)
```

5. Click "Save Changes"
6. Render va a redesplegar automaticamente (~2 min)

### 5. Verificar

1. En Render Dashboard, tab "Logs" del servicio
2. Busca en el log del deploy estos mensajes:
```
[DB] Supabase detectado. Intentando restaurar datos...
[DB] database.json not found (first run?)
[DB] users.json not found (first run?)
  ║   SUPABASE: SI (persistente)               ║
```

3. Crea una cuenta en la app (o loguea la existente)
4. Espera 30 segundos
5. En Supabase dashboard > Storage > `librafit-data` bucket
6. Deberias ver: `database.json`, `users.json`, `audit.json`

### 6. Bucket: crear manualmente si la app no lo hace
Si ves en logs "ensureBucket failed", crea el bucket a mano:

1. Supabase dashboard > Storage
2. Click "New bucket"
3. Name: `librafit-data`
4. Public bucket: **NO** (dejar apagado)
5. Click "Save"

---

## Testing

Para verificar que funciona:

1. **Reiniciar el servicio en Render:**
   - Dashboard > servicio > Manual Deploy > Deploy latest commit
2. **Verificar que los usuarios siguen existiendo:**
   - Despues del deploy, logueate con la misma cuenta
   - Si funciona: PERSISTENCIA ARREGLADA ✅

Antes de Supabase: reiniciar el servicio perdia todas las cuentas.
Despues de Supabase: las cuentas persisten eternamente.

---

## Troubleshooting

### "SUPABASE: NO (efimero!)"
- Verifica que agregaste las env vars en Render
- Verifica que los nombres sean EXACTOS: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`
- Redespliega manualmente (Manual Deploy)

### "upload failed"
- Verifica que el bucket `librafit-data` exista en Supabase
- Verifica que usaste el `service_role` key (no el anon key)

### "ensureBucket failed"
- Crea el bucket manualmente (ver paso 6)
- Confirma que tu plan Supabase sea Free o superior

---

## Arquitectura tecnica

```
┌──────────────────────────────────────────────┐
│            LIBRA FIT APP (Render)             │
│                                                │
│  server/db.js                                  │
│   ├─ readFile()  ← Lee de disco local         │
│   ├─ writeFile() ├─ Escribe a disco local      │
│   │              └─ Upload async a Supabase   │
│   └─ init()      ← Restaura desde Supabase    │
│                   si el disco esta vacio       │
└──────────────────────────────────────────────┘
                    │
                    │  HTTPS + service_role key
                    ▼
┌──────────────────────────────────────────────┐
│        SUPABASE STORAGE (persistente)         │
│                                                │
│  Bucket: librafit-data/                        │
│   ├─ users.json       (encriptado AES-256-CBC) │
│   ├─ database.json    (encriptado AES-256-CBC) │
│   └─ audit.json       (encriptado AES-256-CBC) │
└──────────────────────────────────────────────┘
```

**Doble capa de seguridad:**
1. Archivos encriptados con AES-256-CBC antes de subir
2. Supabase requiere el service_role key para leer

Aunque Supabase fuera hackeado, verian basura encriptada (no pueden
desencriptar sin el `FR_SECRET` que vive solo en Render).

---

## Costos

**Gratis** hasta:
- 500 MB de Database Storage (no usamos Database, solo Storage)
- 1 GB de Storage (archivos)
- 2 GB de Bandwidth / mes
- Unlimited API requests

Libra Fit con 1000 usuarios activos usa: ~5 MB total. Sobrado.

Si alguna vez crecemos mas, Supabase Pro: $25/mes para 8 GB.

---

## Rotar el service_role key

Si sospechas que el key se filtro:

1. Supabase Dashboard > Project Settings > API
2. "Reset service_role key" (destruye el anterior)
3. Copia el nuevo key
4. Render Dashboard > Environment > update `SUPABASE_SERVICE_KEY`
5. Redeploy

Nota: al rotar, los datos existentes SE MANTIENEN (no se pierden).
Solo se invalida el key viejo.

---

## Alternativa: migrar a Postgres si crece

Si algun dia pasamos de 1000 usuarios activos, conviene migrar
el storage de JSON files a Supabase Postgres (tablas reales).

Ventajas de Postgres:
- Queries en SQL (vs iterar JSON)
- Indexes para performance
- Transacciones
- Constraints (foreign keys)

Cuando pase, creamos `server/db-postgres.js` con mismo interface.
Por ahora, Storage + JSON es suficiente y mucho mas simple.
