# LIBRA_CHAT_SPEC.md - Especificacion del Chat v2

> Libra Chat es el **diferenciador principal** de la app.
> Debe ser rapido, confiable, y entender miles de variaciones sin IA.
> Todo rule-based NLP, todo local, todo instantaneo.

---

## Filosofia del Chat

Alineado con DESIGN_PRINCIPLES.md:

1. **Cero espera**: respuestas instantaneas (< 50ms).
2. **Nunca "no entendi" sin plan B**: si no hay alta confianza, clarifica o sugiere.
3. **Aprende del fallo**: cada rejection se reporta al admin para retraining.
4. **Millions of ways to say the same thing**: un intent debe tener 50+ variaciones.
5. **Context-aware**: sabe que hora es, que dia, que meta tiene el usuario.
6. **Natural**: el usuario no debe adaptarse al chat, el chat se adapta al usuario.

---

## Arquitectura

### Pipeline de procesamiento

```
User message "me comi 200g de salmon"
    ↓
[1. Normalize]
    "me comi 200 g de salmon"  (lowercase, no accents, no punct)
    ↓
[2. Tokenize]
    ["me", "comi", "200", "g", "de", "salmon"]
    ↓
[3. Extract entities]
    { quantity: 200, unit: "g", food: "salmon" }
    ↓
[4. Score all intents]
    log_meal: 0.92  ← winner
    ask_calories: 0.12
    plan_meal: 0.35
    ...
    ↓
[5. Confidence check]
    0.92 > threshold (0.6) → execute
    If below → clarify
    ↓
[6. Execute handler]
    Libra.intents.log_meal.handler({quantity:200, unit:'g', food:'salmon'})
    ↓
[7. Response + action]
    "Anotado! 200g de salmon = 412 cal, 40g proteina. Llevas 1,234/2,000 cal hoy."
    + update UI if needed
    ↓
[8. Save to context]
    context.lastIntent = 'log_meal'
    context.lastEntities = {...}
```

### Sistema de Intent + Pattern

Cada intent tiene multiples estrategias de matching:

```js
{
  id: 'log_meal',                    // Identificador unico

  // Patterns ordenados por especificidad (mas especifico primero)
  patterns: [
    // Exact phrases (highest confidence)
    { type: 'phrase', text: 'me comi', weight: 0.8 },
    { type: 'phrase', text: 'acabo de comer', weight: 0.8 },
    { type: 'phrase', text: 'voy a comer', weight: 0.7 },
    // ...

    // Regex patterns
    { type: 'regex', re: /^comi\s/, weight: 0.9 },
    { type: 'regex', re: /(desayune|almorce|cene|merende)\s/, weight: 0.95 },

    // Keyword combinations (lower individual weight, accumulate)
    { type: 'keyword', words: ['comer', 'comi', 'comida'], weight: 0.4 },
    { type: 'keyword', words: ['plato', 'bocado', 'porcion'], weight: 0.3 },

    // Anti-patterns (reduce score if these appear)
    { type: 'anti', text: 'que puedo comer', penalty: -0.5 },  // Es ask_food
    { type: 'anti', text: 'no comi', penalty: -0.8 },           // Negacion
  ],

  // Entidades requeridas (sin ellas, confidence baja)
  requiredEntities: ['food'],
  optionalEntities: ['quantity', 'unit', 'meal'],

  // Contexto que boost
  contextBoost: {
    timeOfDay: {
      '06:00-10:00': { for: 'desayuno', boost: 0.1 },
      '11:30-14:00': { for: 'almuerzo', boost: 0.1 },
      '18:00-21:00': { for: 'cena', boost: 0.1 }
    },
    lastIntent: {
      'ask_meal_now': 0.15  // Si ultimo intent fue "que como?", mas probable log
    }
  },

  // Handler
  handler: (entities, context) => {
    const food = FoodDB.find(entities.food);
    if (!food) {
      return {
        text: `Hmm, no encuentro "${entities.food}" en mi base. Puedes decirme cuantas calorias tiene? O decir otro alimento?`,
        action: 'clarify',
        reportMiss: true   // Esto se reporta al admin para agregar el alimento
      };
    }
    // ... logic
    return {
      text: `Anotado! ${quantity}${unit} de ${food.name} = ${cal} cal. Llevas ${total} hoy.`,
      action: 'refresh'
    };
  }
}
```

### Sistema de Entities

```js
Libra.extractors = {
  // Numeros (arabigos + espanol)
  quantity: (text) => {
    const spanishNums = {un:1, uno:1, una:1, dos:2, tres:3, cuatro:4, cinco:5,
                        medio:0.5, media:0.5, mitad:0.5, doble:2, ...};
    const match = text.match(/(\d+(?:\.\d+)?)\s*(g|gramos|kg|ml|l|oz|lb|libras|taza|tazas|cucharada|cucharadas|vaso|vasos|unidad|unidades|pieza|piezas)?/);
    if (match) return { value: parseFloat(match[1]), unit: match[2] };
    // Buscar palabras
    for (const word of Object.keys(spanishNums)) {
      if (text.includes(word)) return { value: spanishNums[word] };
    }
    return null;
  },

  // Food matching (fuzzy against FoodDB)
  food: (text, foodDB) => {
    // 1. Exact ID match
    // 2. Exact name match
    // 3. Fuzzy match (Levenshtein < 3)
    // 4. Synonym lookup
    // 5. Partial match
    return bestMatch;
  },

  // Exercise matching
  exercise: (text, exDB) => { /* similar */ },

  // Time ("ahora", "a las 3", "a las 3 pm", "manana", "en 2 horas")
  time: (text) => { /* parser */ },

  // Meal type ("desayuno", "almuerzo", "cena")
  meal: (text) => { /* lookup */ },

  // Boolean si/no
  affirmative: (text) => /^(si|sip|dale|claro|ok|de una|va|hagalo|confirmo|yes)/.test(text),
  negative: (text) => /^(no|nop|negativo|cancela|mejor no|no gracias)/.test(text),
};
```

### Context & Memory

```js
Libra.context = {
  lastIntent: null,               // Ultimo intent detectado
  lastEntities: {},               // Ultimas entidades extraidas
  awaitingConfirm: null,          // Esperando confirmacion de algo
  awaitingInput: null,            // Esperando dato especifico (ej: cantidad)
  currentPage: 0,                 // Pagina actual del usuario
  timeOfDay: 'morning',           // morning|afternoon|evening|night
  sessionTopic: null,             // Topico conversacional actual
  recentMisses: 0,                // Contador para no insistir si falla mucho
  language: 'es'                  // Futuro: multilingual
};
```

### Fallback Chain

Cuando ningun intent supera threshold:

```js
function handleFallback(userText) {
  // 1. Check FAQ knowledge base
  const faqMatch = Libra.faq.find(text => fuzzyMatch(userText, f.patterns));
  if (faqMatch && faqMatch.score > 0.5) return faqMatch.response;

  // 2. Keyword extraction - sugerir algo relevante
  const keywords = extractKeywords(userText);
  if (keywords.some(k => MEAL_KEYWORDS.includes(k))) {
    return suggestMealOptions();
  }
  if (keywords.some(k => EX_KEYWORDS.includes(k))) {
    return suggestExerciseOptions();
  }

  // 3. Check if user is asking a question
  if (isQuestion(userText)) {
    return `Buena pregunta. No tengo una respuesta exacta, pero puedo ayudarte con: ${getRelevantOptions()}`;
  }

  // 4. Report miss and show suggestions
  Libra.reportMiss(userText);
  return {
    text: `No estoy seguro. Puedo ayudarte con: registrar comidas, agua, ejercicios, ver tu progreso, responder dudas. Prueba: "me comi 200g de pollo" o "como voy?"`,
    suggestions: ['me comi algo', 'cuanto llevo', 'que toca hoy', 'ayuda']
  };
}
```

### Reporting System

Cuando el chat falla O el usuario da feedback negativo:

```js
Libra.reportMiss = async function(userText, detectedIntent, myResponse, userFeedback) {
  const report = {
    timestamp: new Date().toISOString(),
    userText: userText,
    detectedIntent: detectedIntent || 'none',
    confidence: lastConfidence,
    response: myResponse,
    userFeedback: userFeedback || 'no_match',
    context: { ...Libra.context },
    userId: Auth.user?.id
  };

  // Enviar al admin panel
  await fetch('/api/chat/miss', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + Auth.token },
    body: JSON.stringify(report)
  });

  // Incrementar contador local
  Libra.context.recentMisses++;
};

// Trigger cuando usuario dice "no es eso"
Libra.userRejected = function(reason) {
  const lastMsg = Libra.history[Libra.history.length - 2]?.text;  // Su mensaje
  const myLastResp = Libra.history[Libra.history.length - 1]?.text;
  Libra.reportMiss(lastMsg, Libra.context.lastIntent, myLastResp, reason);
  return {
    text: 'Perdon, no te entendi bien. Puedes decirmelo de otra forma? O dime exactamente que quieres.',
    action: 'clarify'
  };
};
```

### Confidence Levels

```
0.90 - 1.00: Ejecutar directamente
0.70 - 0.89: Ejecutar pero ofrecer "no era eso? dime mas"
0.50 - 0.69: Preguntar clarificacion: "quieres decir X o Y?"
0.30 - 0.49: Mostrar opciones: "puedo ayudar con X, Y, Z"
0.00 - 0.29: Fallback + report
```

---

## Intents Requeridos (lista completa)

### Registro & Log (accion)
- `log_meal` - "me comi X"
- `log_partial_meal` - "solo comi la mitad"
- `log_water` - "tome X agua"
- `log_exercise_set` - "hice X kg de press"
- `log_exercise_done` - "termine el ejercicio"
- `log_cardio` - "hice cardio"
- `log_weight` - "peso X kg"
- `log_supplement` - "tome mi creatina"
- `log_sleep` - "dormi 8 horas"

### Swap / Cambio (accion)
- `swap_meal_food` - "en vez de X comi Y"
- `swap_exercise` - "cambia este ejercicio"
- `add_unplanned_meal` - "me comi algo extra"
- `add_unplanned_exercise` - "hice un ejercicio extra"

### Consulta (pregunta)
- `ask_calories` - "cuantas calorias llevo"
- `ask_protein` - "cuanta proteina"
- `ask_macros` - "mis macros"
- `ask_water` - "cuanta agua"
- `ask_weight` - "mi peso"
- `ask_weight_progress` - "he bajado?"
- `ask_streak` - "mi racha"
- `ask_level` - "mi nivel"
- `ask_meal_now` - "que como ahora"
- `ask_meal_next` - "proxima comida"
- `ask_meal_tomorrow` - "que como manana"
- `ask_exercise_today` - "que rutina tengo"
- `ask_exercise_history` - "mi ultimo peso en X"
- `ask_progress` - "como voy"
- `ask_goal_eta` - "cuando llego a mi meta"
- `ask_today_plan` - "que toca hoy"
- `ask_budget_remaining` - "cuanto me queda de calorias"
- `ask_supplement_schedule` - "cuales suplementos tomo hoy"
- `ask_deficit` - "estoy en deficit?"
- `ask_surplus` - "estoy comiendo mucho?"

### Configuracion (accion)
- `change_goal` - "cambia mi meta"
- `edit_meal_plan` - "edita mis comidas"
- `edit_routine` - "edita mi rutina"
- `set_reminder` - "recuerdame X a las Y"
- `disable_notification` - "no me avises X"
- `add_allergen` - "soy alergico a X"
- `add_supplement` - "agrega X a mis suplementos"

### FAQ / Conocimiento (pregunta)
- `faq_protein_need` - "cuanta proteina necesito"
- `faq_calorie_deficit` - "que es deficit"
- `faq_best_cardio` - "cual cardio es mejor"
- `faq_cheat_meal` - "puedo comer un cheat"
- `faq_night_eating` - "es malo comer de noche"
- `faq_coffee` - "puedo tomar cafe"
- `faq_alcohol` - "y el alcohol"
- `faq_supplements` - "que suplementos tomar"
- `faq_creatine` - "que es creatina"
- `faq_rest_days` - "cuantos dias descansar"
- `faq_sleep` - "cuanto dormir"
- `faq_water_amount` - "cuanta agua tomar"
- `faq_fasting` - "ayuno intermitente"
- `faq_keto` - "la dieta keto"
- `faq_plateau` - "estoy estancado"
- `faq_muscle_vs_fat` - "musculo vs grasa"
- ... 50+ mas

### Motivacion / Emocional
- `motivate_lost_motivation` - "no tengo ganas"
- `motivate_tired` - "estoy cansado"
- `motivate_stressed` - "estresado"
- `motivate_hungry` - "tengo hambre"
- `motivate_plateau_frustration` - "no veo resultados"
- `motivate_celebrate` - "lo logre"
- `motivate_cheat_guilt` - "me sali del plan"

### Meta (conversacion)
- `greeting` - "hola"
- `farewell` - "gracias, chao"
- `affirm` - "si", "ok"
- `deny` - "no"
- `reject` - "no es eso", "estas mal"
- `help` - "ayuda", "que puedes"
- `unclear` - ambiguous input
- `confirm_pending` - confirmacion de accion previa

---

## Patterns Database Structure

Los sub-agentes generaran patterns en este formato:

```js
// patterns/meal_patterns.js
window.MEAL_PATTERNS = {
  log_meal: {
    exact: [
      'me comi',
      'acabo de comer',
      'almorce',
      'desayune',
      'cene',
      'merende',
      // ... 100+ exact phrases
    ],
    regex: [
      /^comi\s+/,
      /^desayunar(e|o|on)\s+/,
      /^voy a (desayun|almorz|cen|comer|merend)/,
      // ...
    ],
    keywords: [
      // Palabras sueltas con peso bajo
      'comer', 'comida', 'plato', 'bocado', 'mordida', 'porcion',
      // ...
    ],
    antiPatterns: [
      // Cosas que NO deberian matchear a log_meal
      'que puedo comer',
      'que comere',
      'cuando como',
      'no comi',
      // ...
    ]
  },
  // ... 50+ intents
};
```

### Combinable Patterns

Frases complejas se construyen con plantillas:

```
TEMPLATE: "[log_verb] [optional:quantity] [optional:unit] de [food]"
EXPANDS TO:
  - "comi 200g de pollo"
  - "me comi 200 gramos de pollo"
  - "acabo de comer 200g de pollo"
  - "almorce pollo"
  - "desayune 2 huevos"
  - ... millions of combinations
```

---

## Performance Requirements

- Chat.chat(text) debe responder en < 50ms (medido)
- Patterns evaluation debe ser O(n) donde n = num patterns
- No network calls para intents conocidos (todo local)
- Reporting de misses es async, no bloquea UI

---

## Testing

Cada intent debe tener:
- Al menos 30 test cases positivos (deberian matchear)
- Al menos 10 test cases negativos (no deberian matchear)
- Edge cases conocidos (negaciones, condicionales, futuros)

Test suite se corre en CI antes de cada deploy.

---

## Roadmap de Implementacion

1. **Base engine** (libra.js refactor) - 1 dia
2. **Pattern databases** (sub-agentes) - 1 dia paralelo
3. **FAQ system** - 0.5 dia
4. **Context system** - 0.5 dia
5. **Reporting + admin panel integration** - 1 dia
6. **Testing** - 1 dia
7. **Iteration desde reports** - continuo

Total inicial: ~5 dias. Luego mejora continua desde feedback.

---

*Este es un documento vivo. Se actualiza cuando se agrega/cambia un intent.*
