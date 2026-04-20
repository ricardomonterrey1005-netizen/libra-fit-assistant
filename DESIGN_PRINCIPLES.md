# DESIGN_PRINCIPLES.md - Los 10 Mandamientos de Libra Fit

> **Este documento es OBLIGATORIO leer antes de cualquier sesion de desarrollo.**
> Cada commit, cada feature, cada linea de codigo debe respetar estos principios.
> Si un cambio viola alguno de estos principios, se rechaza o se reescribe.

## El ADN de Libra Fit

**Minimalista · Intuitivo · Rapido · Util · Limpio**

La app existe para que el usuario **tome mejores decisiones sobre su salud**, no para que admire la app.
Cada pantalla, cada boton, cada animacion debe justificar su existencia.

---

## 🧭 Los 10 Mandamientos

### 1. No esperaras

**Regla:** Ninguna accion del usuario debe requerir esperar. Cero loading spinners visibles en flujos normales.

**Como:**
- **Optimistic UI**: La UI actualiza ANTES de que el server responda. Si falla, revierte + toast.
  ```js
  // MAL
  btn.onclick = async () => {
    showSpinner();
    await saveToServer(data);
    updateUI();
    hideSpinner();
  }

  // BIEN
  btn.onclick = async () => {
    updateUI();  // Inmediato
    saveToServer(data).catch(() => {
      revertUI();
      toast('Error. Reintentando...');
    });
  }
  ```
- **Cache first, network in background**: localStorage es la fuente visual. Server sync en segundo plano.
- **Precompute** en vez de calcular on-render.
- **Debounce** operaciones costosas (busquedas, sync).
- Si algo DEBE esperar (primer login, pull inicial), **skeleton loader** con forma real, NO spinner generico.

**Target:** Cualquier interaccion <100ms de respuesta visual. 60 FPS siempre.

---

### 2. No mostraras lo innecesario

**Regla:** Cada pantalla responde a UNA pregunta del usuario. La informacion secundaria se oculta hasta que la pida.

**Como:**
- **Progressive disclosure**: muestra lo esencial. "Ver mas" revela detalle.
- **Una decision por pantalla**: Hoy = que hacer hoy. Progreso = como voy. No mezclar.
- **Elimina chrome visual**: bordes innecesarios, separadores, iconos decorativos.
- Si un dato se puede inferir, no lo muestres. Si "llevas 3/6 comidas", no pongas tambien "faltan 3".
- **Jerarquia visual clara**: 1 titulo, 1 dato principal, 2-3 secundarios max por seccion.

**Test:** Si eliminas un elemento y el usuario puede seguir tomando la decision, **eliminalo**.

---

### 3. No repetiras codigo ni conceptos

**Regla:** DRY (Don't Repeat Yourself). Una fuente de verdad para cada dato, una implementacion para cada comportamiento.

**Como:**
- **Un solo lugar** para cada constante/config (constants.js, no duplicar en 3 archivos).
- **Helpers reutilizables** (`fmtDate`, `calcMacros`, etc.) en un solo lugar.
- **Componentes/funciones de UI reutilizables** (ej: `renderMealCard`, `renderProgressBar`).
- Si copias un bloque de codigo, extraelo a funcion.
- En UI: si un boton aparece en 3 pantallas, crealo 1 vez como helper.

---

### 4. No agregaras lo que no usas

**Regla:** YAGNI (You Aren't Gonna Need It). No agregues "por si acaso".

**Como:**
- No importes librerias para funcionalidades simples (un carousel no necesita swiper.js).
- No anadas parametros opcionales que "quiza" se usen luego.
- No hagas "marcos" genericos: resuelve el problema concreto.
- Cuando dudes: empieza minimo, expande cuando haya evidencia real.

**Ejemplo:** Tenemos `FOOD_EXT` con alimentos que nadie usa. BORRAR.

---

### 5. Hablaras el idioma del usuario

**Regla:** Todo en espanol natural. Cero jerga tecnica. Cero palabras en ingles.

**Como:**
- UI: "Guardar" no "Save". "Rutina" no "Workout".
- Toasts: "Listo", "Guardado", "Hecho". No "Success".
- Errores: "No se pudo guardar. Intenta de nuevo." no "Error 500".
- Fechas: "Hoy", "Ayer", "Hace 3 dias". No "2026-04-19T..."
- Numeros: "3.5 lbs" o "1,500 cal". Redondear a lo util.

**Excepcion:** Codigo interno (variables, funciones, ids) puede estar en ingles para compatibilidad. Pero comentarios en espanol cuando expliquen logica del dominio.

---

### 6. Respetaras el contexto del usuario

**Regla:** La app sabe que hora es, que dia, que meta tiene el usuario. USA esa info para ser relevante.

**Como:**
- A las 8 AM: muestra desayuno, no cena.
- Si viene del gym: pregunta "como te fue", no muestra meal plan.
- Si el usuario no hace cardio, oculta la seccion de cardio.
- Si no toma suplementos, oculta la seccion de suplementos.
- Adapta el lenguaje: principiante vs avanzado usan palabras distintas.

**Ejemplo malo:** Mostrar "1/5 rutinas completadas" a un usuario que no entrena.
**Ejemplo bueno:** Esa metrica no existe en su UI.

---

### 7. Construiras con CSS Variables, no con hacks

**Regla:** La app tiene un sistema de diseno coherente. Todo sale del mismo paleta.

**Como:**
- **Colores**: solo via `var(--accent)`, `var(--bg)`, `var(--t1)`, etc.
- **Espaciados**: multiples de 4px (4, 8, 12, 16, 24, 32...).
- **Tipografia**: 1 fuente (Inter), tamanos definidos (11, 12, 14, 16, 18, 22, 28).
- **Radios**: 8px (cards), 12px (modals), 999px (pills).
- **Sombras**: 1 sombra estandar definida.
- **Transiciones**: 150ms ease para micro, 250ms ease-out para mayores.
- Nunca `style="color:#fff"` inline. Siempre CSS variable.

---

### 8. No interrumpiras al usuario

**Regla:** El usuario esta tratando de lograr algo. Tu trabajo es facilitar, no molestar.

**Como:**
- **Modales solo para decisiones criticas** (confirmar eliminacion, onboarding).
- **Toasts sutiles** para confirmaciones (3 seg, bottom, no bloqueante).
- **Alertas respetuosas**: maximo 1 notificacion activa a la vez.
- **No spam de permisos**: pide notificaciones DESPUES de que el usuario guste la app.
- **No pop-ups de "rate the app"**: la app no es el producto, la salud lo es.
- **Onboarding**: preguntas esenciales, saltable si el usuario quiere.

---

### 9. Mediras todo y optimizaras lo medido

**Regla:** Si no lo medimos, no sabemos. Instrumentacion minima pero obligatoria.

**Como:**
- **Performance**: Web Vitals (LCP, FID, CLS) en la pantalla inicial.
- **Uso**: que pantallas se ven mas (Plausible analytics).
- **Errores**: Sentry captura todo error en produccion.
- **Conversion**: cuantos completan onboarding vs abandonan.
- **Retention**: cuantos vuelven al dia 2, 7, 30.

**Regla de oro:** Si algo tarda mas de 200ms, encuentra por que y arreglalo.

---

### 10. Borraras sin piedad

**Regla:** Codigo que no se usa = basura que confunde. Eliminalo.

**Como:**
- **Cada sesion de dev**: busca funciones/variables sin referencias, eliminalas.
- **Cuando refactorizas**: borra el codigo viejo, no lo comentes "por si acaso" (git lo guarda).
- **Imports no usados**: fuera.
- **Archivos huerfanos**: fuera.
- **Features sin uso medido**: si tras 30 dias nadie los usa, fuera.
- **Comentarios TODO viejos**: si tienen >6 meses, crea issue o eliminalos.

---

## 🎨 Reglas Especificas de UI

### Jerarquia visual (por orden de importancia)
1. **Accion principal** (CTA): boton grande, color accent.
2. **Dato clave**: numero grande, tipografia bold.
3. **Contexto**: texto t1, tamano medio.
4. **Detalles**: t2 o t3, tamano pequeno.
5. **Metadata**: t3, pequeno, usado solo si relevante.

### Layout mobile-first (objetivo: 375px)
- **Padding consistente**: 16px lateral, 20px top.
- **Cards**: padding 16px interno, gap 12px entre ellas.
- **Listas**: altura minima 48px por item (touch-friendly).
- **Botones**: altura minima 44px (iOS), 48px (Android).
- **Texto minimo**: 14px (body), 11px (meta), nunca menos.

### Colores (dark mode por default)
```
--bg        #000       Fondo principal
--bg2       #0a0a0a    Fondo de cards
--bg3       #141414    Fondo de inputs
--border    #1f1f1f    Bordes sutiles
--t1        #fafafa    Texto principal
--t2        #a3a3a3    Texto secundario
--t3        #525252    Texto terciario/meta
--accent    #a78bfa    Morado acento
--green     #4ade80    Exito
--yellow    #fbbf24    Warning
--red       #f87171    Error
--blue      #60a5fa    Info
```

### Iconografia
- **Emoji**: OK para personalidad ligera (🏋️ 💧 🔥).
- **SVG inline**: para iconos funcionales (navegacion, botones).
- **Nunca icon fonts** (FontAwesome, etc.).
- Tamano estandar: 20px (inline), 24px (botones), 32px (feature), 48px (heroe).

### Animaciones
- **Principio**: animaciones informan, no decoran.
- **Duracion**: 150ms (micro), 250ms (normal), 400ms (max entrada de pagina).
- **Easing**: `ease-out` para entradas, `ease-in` para salidas.
- **Nunca**: bounces, spins largos, animaciones sincronicas complejas.
- **Respeta** `prefers-reduced-motion`.

---

## 💻 Reglas Especificas de Codigo

### Arquitectura JS
- **Vanilla JS** hasta que haya razon tecnica real para framework.
- **Modulos logicos separados** (`meals.js`, `routines.js`, etc.), no monolito.
- **Sin dependencies para funcionalidades triviales** (date-fns? No, `new Date()`).
- **Una responsabilidad por modulo.**

### Nombres
```js
// MAL
function d() {}
function handleX() {}
const data = {}

// BIEN
function calcDailyMacros() {}
function onSubmitMeal() {}
const todayMeals = {}
```

### Funciones
- **Max 30 lineas**. Si es mas, separa.
- **Max 3 parametros**. Si son mas, pasa un objeto.
- **Early return**. Evita nested ifs.
- **Puras cuando sea posible**. Inputs → output, sin side effects.

### Comentarios
- **Codigo autoexplicativo > comentarios**.
- **Comentarios solo para explicar POR QUE**, no QUE.
- **JSDoc solo en APIs publicas** (funciones exportadas).

### Error handling
- **Nunca `try/catch` silencioso**. Si atrapas, logueas O manejas.
- **Fallbacks utiles**: si falla cargar datos, muestra estado vacio con accion clara.
- **Nunca** `alert()`. Usa toast o modal custom.

### Performance
- **Lazy load** lo que no se ve inicialmente.
- **Debounce** inputs/resize (150ms).
- **Virtualiza** listas > 50 items.
- **Minimiza reflows**: cambia clases, no styles individuales en loops.
- **IntersectionObserver** para viewport detection.

---

## 🚫 Anti-patrones (No Hacer)

### UI
- ❌ Spinners genericos cuando puedes hacer skeleton o optimistic.
- ❌ Modales apilados.
- ❌ Tooltips largos (si necesita tooltip, el diseno fallo).
- ❌ Iconos sin label en navegacion principal.
- ❌ Mas de 5 opciones en navigation bar.
- ❌ Forms con mas de 5 campos visibles a la vez.
- ❌ Scrolls horizontales (excepto carousels explicitos).
- ❌ Infinito scroll sin "cargar mas" manual (problema de retencion).

### Codigo
- ❌ Variables globales (excepto modulos exportados intencionalmente).
- ❌ `eval`, `innerHTML` con user input, `setTimeout(code_string, x)`.
- ❌ Callbacks anidados (usa async/await).
- ❌ Magic numbers (define constantes).
- ❌ Comentarios de commit en codigo (`// fix bug 2024-01-15`).
- ❌ Codigo comentado "por si acaso". Usa git.
- ❌ `console.log` en produccion (usa LogBuffer o elimina).

### Arquitectura
- ❌ Guardar state en 2 lugares (DB + localStorage) sin single source of truth.
- ❌ Logica de negocio en la UI (app.js debe solo renderizar, la logica en engine.js/modules).
- ❌ APIs sin version (rompe clientes).
- ❌ Secrets hardcoded (aunque sean defaults).

---

## 📐 Sistema de Medidas (Design Tokens)

Todo en la app usa estos tokens. Si un valor no esta aqui, **no se usa**.

```css
/* Spacing */
--s-1: 4px;
--s-2: 8px;
--s-3: 12px;
--s-4: 16px;
--s-5: 20px;
--s-6: 24px;
--s-8: 32px;
--s-10: 40px;
--s-12: 48px;

/* Font sizes */
--f-xs: 11px;    /* meta */
--f-sm: 12px;    /* caption */
--f-base: 14px;  /* body */
--f-md: 16px;    /* body large */
--f-lg: 18px;    /* subheading */
--f-xl: 22px;    /* heading */
--f-2xl: 28px;   /* display */
--f-3xl: 36px;   /* hero number */

/* Radii */
--r-sm: 6px;
--r-md: 8px;
--r-lg: 12px;
--r-xl: 16px;
--r-full: 999px;

/* Shadows */
--sh-sm: 0 1px 2px rgba(0,0,0,0.5);
--sh-md: 0 4px 8px rgba(0,0,0,0.4);
--sh-lg: 0 12px 24px rgba(0,0,0,0.5);

/* Transitions */
--t-fast: 150ms;
--t-base: 250ms;
--t-slow: 400ms;
--t-ease: cubic-bezier(0.16, 1, 0.3, 1);
```

---

## 📊 Metricas de Calidad (KPIs del Codigo)

### Performance
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- First Input Delay: < 100ms
- Cumulative Layout Shift: < 0.1
- Total JS bundle: < 300KB (gzipped)
- Tiempo de respuesta de interaccion: < 100ms

### Code quality
- Funciones > 30 lineas: 0
- Funciones > 3 params: 0
- Dead code (no referenciado): 0
- console.log en prod: 0
- TODO/FIXME > 3 meses: 0

### UX
- Pantallas con > 7 elementos interactivos: 0 (cognitive overload)
- Texto < 14px body: 0
- Toque < 44px: 0
- Acciones que requieren > 2 taps: minimizar

---

## 🔍 Checklist Pre-Commit

Antes de hacer commit, verifica:
- [ ] No hay `console.log` nuevos (usa LogBuffer si necesitas log)
- [ ] No hay codigo comentado
- [ ] No hay imports sin usar
- [ ] Funciones tienen nombres descriptivos
- [ ] Textos en espanol (UI) / espanol en comentarios de logica
- [ ] CSS usa variables, no valores hardcoded
- [ ] Nuevas pantallas siguen jerarquia visual
- [ ] Nuevas interacciones son < 100ms percibidas
- [ ] Si agregaste feature, consideraste su toggle on/off
- [ ] DEVELOPMENT.md y CLAUDE.md actualizados

---

## 📖 Inspiraciones y Referencias

Estas apps/sistemas encarnan estos principios. Referirse a ellos cuando haya dudas:

- **Linear.app**: minimalismo y velocidad.
- **Apple Health**: data density pero digerible.
- **Hevy**: UI de fitness limpia y rapida.
- **Notion mobile**: progressive disclosure.
- **Steve Krug's "Don't Make Me Think"**: filosofia UX.
- **Dieter Rams' 10 Principles**: diseno industrial aplicable a software.
- **Apple HIG**: conventions de mobile.
- **Material Design 3**: densidad y jerarquia.

---

## 🎯 Resumen en 1 Frase

> **"Si te quita mas tiempo del que te da, estamos haciendolo mal."**

Cada linea de codigo, cada pixel en pantalla, cada segundo de carga debe justificar su existencia.

La app existe para **servir al usuario**, no al reves.

---

*Este documento se revisa cada 3 meses. Si alguna regla no se sigue en >2 commits, se reforma o se elimina.*
