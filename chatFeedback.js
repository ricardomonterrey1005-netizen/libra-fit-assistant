// ================================================================
//  LIBRA FIT - CHAT FEEDBACK LOOP (v2.0)
// ================================================================
//  Captura fallos del chat de Libra y los envia al admin panel para
//  que se puedan usar como entrenamiento futuro.
//
//  Se dispara:
//   - Cuando Libra no entiende (low confidence)
//   - Cuando el usuario dice "no es eso", "estas mal", etc.
//   - Cuando el usuario pulsa el boton 👎 en un mensaje
// ================================================================

const ChatFeedback = {
  queue: [],
  sending: false,

  // Reportar que el chat no entendio
  reportMiss(userText, detectedIntent, response, context) {
    const report = {
      timestamp: new Date().toISOString(),
      userText: userText || '',
      detectedIntent: detectedIntent || 'none',
      response: response || '',
      context: context || {},
      userId: (typeof Auth !== 'undefined' && Auth.user) ? Auth.user.id : null,
      type: 'miss'
    };
    this.queue.push(report);
    this._flush();
  },

  // Reportar que el usuario dio thumbs down
  reportDislike(userText, response) {
    const report = {
      timestamp: new Date().toISOString(),
      userText: userText || '',
      response: response || '',
      userId: (typeof Auth !== 'undefined' && Auth.user) ? Auth.user.id : null,
      type: 'dislike'
    };
    this.queue.push(report);
    this._flush();
  },

  // Reportar rechazo explicito del usuario ("no es eso")
  reportRejection(userText, response, userFeedback) {
    const report = {
      timestamp: new Date().toISOString(),
      userText: userText || '',
      response: response || '',
      userFeedback: userFeedback || '',
      userId: (typeof Auth !== 'undefined' && Auth.user) ? Auth.user.id : null,
      type: 'rejection'
    };
    this.queue.push(report);
    this._flush();
  },

  // Flush queue al servidor (cuando hay conexion)
  async _flush() {
    if(this.sending || !this.queue.length) return;
    if(typeof Auth === 'undefined' || !Auth.isLoggedIn()) {
      // Guardar local si no hay sesion
      const stored = S.g('chatMisses', []);
      stored.push(...this.queue);
      S.s('chatMisses', stored.slice(-50));  // max 50
      this.queue = [];
      return;
    }

    this.sending = true;
    const batch = this.queue.splice(0, 20);

    try {
      await fetch(`${API_BASE}/chat/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + Auth.token
        },
        body: JSON.stringify({ reports: batch })
      });
    } catch(e) {
      // Si falla, re-poner en queue
      this.queue.unshift(...batch);
      // Tambien guardar local como backup
      const stored = S.g('chatMisses', []);
      stored.push(...batch);
      S.s('chatMisses', stored.slice(-50));
    }

    this.sending = false;
    // Si quedan, seguir flushing
    if(this.queue.length) setTimeout(() => this._flush(), 2000);
  }
};

// Sincronizar cualquier miss almacenado local cuando volvemos a tener sesion
if(typeof window !== 'undefined'){
  window.addEventListener('online', () => {
    const stored = S.g('chatMisses', []);
    if(stored.length && typeof Auth !== 'undefined' && Auth.isLoggedIn()){
      ChatFeedback.queue.push(...stored);
      S.s('chatMisses', []);
      ChatFeedback._flush();
    }
  });
}
