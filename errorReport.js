// ================================================================
//  LIBRA FIT - ERROR REPORTING SYSTEM
//  Captura console.logs, errores globales y los envia al servidor.
// ================================================================

const LogBuffer = {
  buffer: [],
  maxSize: 200,
  add(level, args) {
    try {
      const msg = Array.from(args).map(a => {
        if (a === null) return 'null';
        if (a === undefined) return 'undefined';
        if (typeof a === 'string') return a;
        if (a instanceof Error) return a.stack || a.message;
        try { return JSON.stringify(a); } catch { return String(a); }
      }).join(' ').slice(0, 500);
      this.buffer.push({ t: Date.now(), level, msg });
      if (this.buffer.length > this.maxSize) this.buffer.shift();
    } catch (e) { /* never throw from logger */ }
  },
  getRecent(secondsAgo = 30) {
    const cutoff = Date.now() - secondsAgo * 1000;
    return this.buffer.filter(l => l.t >= cutoff);
  },
  getAll() {
    return this.buffer.slice();
  },
  clear() {
    this.buffer = [];
  }
};

// Wrap console methods
(function wrapConsole() {
  ['log', 'warn', 'error', 'info', 'debug'].forEach(method => {
    const orig = console[method];
    if (!orig) return;
    console[method] = function (...args) {
      LogBuffer.add(method, args);
      try { orig.apply(console, args); } catch (e) {}
    };
  });
})();

// Global error handlers
window.addEventListener('error', e => {
  LogBuffer.add('uncaught', [
    e.message || 'Unknown error',
    e.filename || '',
    'line ' + (e.lineno || '?'),
    'col ' + (e.colno || '?')
  ]);
});
window.addEventListener('unhandledrejection', e => {
  LogBuffer.add('rejection', [
    'Unhandled promise rejection:',
    e.reason ? (e.reason.stack || e.reason.message || String(e.reason)) : 'unknown'
  ]);
});

// ===== ERROR REPORTER =====
const ErrorReporter = {
  async send(description, secondsAgo = 60) {
    const payload = {
      description: (description || '').slice(0, 2000),
      logs: LogBuffer.getRecent(secondsAgo),
      url: location.href,
      page: (typeof App !== 'undefined' && App.pages) ? App.pages[App.idx || 0] : '',
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      platform: navigator.platform,
      language: navigator.language,
      screen: `${screen.width}x${screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      online: navigator.onLine
    };

    const headers = { 'Content-Type': 'application/json' };
    if (typeof Auth !== 'undefined' && Auth.isLoggedIn && Auth.isLoggedIn()) {
      headers['Authorization'] = 'Bearer ' + Auth.token;
    }

    const base = (typeof API_BASE !== 'undefined') ? API_BASE : '/api';
    const res = await fetch(base + '/errors/report', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Error enviando reporte');
    }
    return res.json();
  }
};

// ===== UI HELPER =====
const ErrorReportUI = {
  open() {
    if (typeof App === 'undefined' || !App.modal) {
      alert('App no lista');
      return;
    }
    const body = `
      <p style="font-size:13px;color:var(--t2);margin-bottom:10px">
        Describe que estaba pasando cuando ocurrio el problema. Enviaremos automaticamente los ultimos logs de la app.
      </p>
      <textarea id="erDesc" class="inp-sm" rows="5" style="width:100%;min-height:120px;padding:10px;background:var(--card2,#161616);color:var(--t1);border:1px solid var(--border);border-radius:8px" placeholder="Ej: el boton de agregar agua no hace nada..."></textarea>
      <div style="display:flex;gap:8px;margin-top:10px">
        <button class="btn-outline" onclick="App.closeModal()" style="flex:1;min-height:48px">Cancelar</button>
        <button class="btn-accent" id="erSendBtn" style="flex:1;min-height:48px">📨 Enviar reporte</button>
      </div>
      <div id="erStatus" style="font-size:12px;color:var(--t3);margin-top:8px;min-height:16px"></div>
    `;
    App.modal('🐞 Reportar error', body);
    setTimeout(() => {
      const btn = document.getElementById('erSendBtn');
      if (!btn) return;
      btn.onclick = async () => {
        const desc = (document.getElementById('erDesc').value || '').trim();
        const status = document.getElementById('erStatus');
        btn.disabled = true;
        btn.textContent = 'Enviando...';
        status.textContent = '';
        try {
          await ErrorReporter.send(desc, 120);
          status.textContent = '✅ Reporte enviado. Gracias!';
          status.style.color = 'var(--green,#4ade80)';
          setTimeout(() => App.closeModal(), 1200);
        } catch (e) {
          status.textContent = '❌ ' + (e.message || 'Error enviando');
          status.style.color = 'var(--red,#f44336)';
          btn.disabled = false;
          btn.textContent = '📨 Reintentar';
        }
      };
    }, 50);
  }
};
