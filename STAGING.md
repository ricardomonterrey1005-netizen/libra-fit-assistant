# STAGING.md - Ambiente de prueba

> Dos ambientes separados: produccion y staging.
> Proposito: probar cambios antes de publicarlos a usuarios reales.

---

## URLs

- **Produccion:**  https://libra-fit-app.onrender.com        (master branch)
- **Staging:**     https://libra-fit-staging.onrender.com    (staging branch)

Cualquier usuario normal ve produccion. Staging es para el admin.

---

## Como identifico en que ambiente estoy

**Produccion:**
- Titulo en browser: "Libra Fit"
- Sin banner

**Staging:**
- Titulo en browser: "🧪 STAGING · Libra Fit"
- Banner amarillo arriba: "🧪 STAGING · Datos de prueba separados de produccion"
- Datos NO son los mismos que produccion (bucket Supabase distinto)

---

## Setup (hacerlo UNA vez)

### 1. Git: crear rama staging
Ya hecho en el repo. Si no existe en GitHub, push:
```
git push origin staging
```

### 2. Render: crear segundo servicio
1. Ir a https://dashboard.render.com
2. New + -> Web Service
3. Connect repo: `libra-fit-assistant`
4. Configuracion:
   - Name: `libra-fit-staging`
   - Region: misma que produccion
   - Branch: `staging`  ← IMPORTANTE
   - Build Command: `cd server && npm install`
   - Start Command: `node server/index.js`
   - Plan: Free
5. Click "Create Web Service"

### 3. Configurar env vars en staging
En el nuevo servicio staging:

```
NODE_ENV           = production
ENVIRONMENT        = staging          ← Esto activa el banner
PORT               = 3001
ADMIN_PASSWORD     = (el mismo o distinto que prod)
FR_SECRET          = (mismo que prod si quieres compartir encriptacion)
FR_JWT_SECRET      = (puede ser distinto)
SUPABASE_URL       = (mismo proyecto Supabase)
SUPABASE_SERVICE_KEY = (mismo key)
SUPABASE_BUCKET    = librafit-staging  ← bucket DIFERENTE, datos aislados
```

**IMPORTANTE:** `SUPABASE_BUCKET` debe ser DIFERENTE entre prod y staging.
Asi los datos no se mezclan. Prod usa `librafit-data`, staging usa
`librafit-staging`.

### 4. Crear el bucket staging en Supabase
1. Supabase Dashboard > Storage
2. New bucket
3. Name: `librafit-staging`
4. Public: NO
5. Save

---

## Flujo de trabajo

### Probar un cambio grande:

```bash
# 1. Estas en master. Cambiar a staging y traer cambios
git checkout staging
git merge master

# 2. Hacer cambios en el codigo
# ... coding ...

# 3. Push a staging (auto-deploya a libra-fit-staging.onrender.com)
git add .
git commit -m "feat: probar nueva UI"
git push origin staging

# 4. Esperar 2 min, probar en https://libra-fit-staging.onrender.com
# (puedes crear un usuario de prueba ahi, no afecta produccion)

# 5. Si OK, promover a produccion:
git checkout master
git merge staging
git push origin master
# Auto-deploya a produccion en 2 min

# 6. Si algo mal en produccion: rollback via admin panel
```

### Probar un hotfix (cambio pequeno y urgente):

```bash
# Si es super urgente y no tienes tiempo de probar en staging
git checkout master
# ... fix ...
git commit -m "fix: bug critico"
git push origin master
# Deploy directo a prod
```

No recomendado, pero viable para cambios triviales.

---

## Diferencias prod vs staging

| Aspecto | Produccion | Staging |
|---------|-----------|---------|
| URL | libra-fit-app.onrender.com | libra-fit-staging.onrender.com |
| Rama | master | staging |
| Supabase bucket | librafit-data | librafit-staging |
| Usuarios | reales | de prueba |
| Banner UI | no | 🧪 STAGING amarillo |
| Titulo browser | Libra Fit | 🧪 STAGING · Libra Fit |

Misma base de codigo. Mismos env vars de encriptacion (si quieres compartir),
pero datos separados por bucket.

---

## Reglas

1. **NUNCA** probar algo destructivo (borrar usuarios, resetear DB) en produccion
2. **SIEMPRE** probar cambios grandes (schema, auth flow, onboarding) en staging primero
3. Los usuarios de prueba en staging pueden tener datos falsos
4. Si necesitas comparar: crea la misma cuenta en prod y en staging

---

## Costos

Render Free tier: hasta 750 horas/mes de compute por servicio.
- 1 servicio corriendo 24/7 usa 720h (dentro del limite)
- 2 servicios corriendo 24/7 = 1440h (pasa el limite)

**Solucion:** Render Free duerme el servicio tras 15 min sin trafico.
Si staging recibe poco trafico (solo lo usas para testing), casi nunca
cuenta horas. En la practica ambos servicios Free funcionan sin problema.

Si algun dia queremos eliminar el spin-down:
- Render Starter ($7/mes) por servicio
- Total: $14/mes (prod + staging)
