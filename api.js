// ================================================================
//  FITRICARDO - API CLIENT + AUTH + SYNC
//  Connects frontend to secure backend
//  Uses localStorage as cache, server as source of truth
// ================================================================

// API base - auto-detects: same origin in production, port 3001 in dev
const API_BASE = (() => {
  // If served from the Express backend, API is on same origin
  if (location.port === '3001' || location.port === '') return '/api';
  // Dev mode: frontend on different port
  return location.protocol + '//' + location.hostname + ':3001/api';
})();

const Auth = {
  token: null,
  user: null,
  _listeners: [],

  init() {
    this.token = localStorage.getItem('fr_token');
    const u = localStorage.getItem('fr_user');
    if (u) try { this.user = JSON.parse(u); } catch(e) {}
    // Set storage scope immediately if user is loaded
    if (this.user && this.user.id) {
      S.setScope(this.user.id);
    }
    if (this.token) this.verify();
  },

  isLoggedIn() {
    return !!this.token && !!this.user;
  },

  onAuthChange(fn) {
    this._listeners.push(fn);
  },

  _notify() {
    this._listeners.forEach(fn => fn(this.isLoggedIn()));
  },

  async register(username, password, pin) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, pin: pin || undefined })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error de registro');
    this._setAuth(data.token, data.user);
    // Set user-scoped storage
    S.setScope(data.user.id);
    // Save last username for convenience
    localStorage.setItem('fr_lastUser', username);
    // Pull server data into scoped localStorage
    await Sync.pullAll();
    return data;
  },

  async login(username, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error de login');
    this._setAuth(data.token, data.user);
    // Set user-scoped storage and migrate old keys if needed
    S.setScope(data.user.id);
    S.migrateOldKeys(data.user.id);
    // Save last username for convenience
    localStorage.setItem('fr_lastUser', username);
    // Sync from server after login
    await Sync.pullAll();
    return data;
  },

  async recover(username, pin, newPassword) {
    const res = await fetch(`${API_BASE}/auth/recover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, pin, newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error de recuperacion');
    return data;
  },

  async verify() {
    try {
      const res = await fetch(`${API_BASE}/auth/verify`, {
        headers: { 'Authorization': 'Bearer ' + this.token }
      });
      if (!res.ok) {
        this.logout();
        return false;
      }
      return true;
    } catch (e) {
      // Offline - keep token, work with localStorage
      console.log('Offline mode - usando datos locales');
      return this.token ? true : false;
    }
  },

  async changePassword(currentPassword, newPassword) {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error');
    return data;
  },

  logout() {
    // Clear user's local data (safe - it's on server)
    S.clearScope();
    this.token = null;
    this.user = null;
    localStorage.removeItem('fr_token');
    localStorage.removeItem('fr_user');
    localStorage.removeItem('fr_offline');
    // Reset to guest scope
    S.setScope('guest');
    this._notify();
  },

  _setAuth(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem('fr_token', token);
    localStorage.setItem('fr_user', JSON.stringify(user));
    this._notify();
  }
};

// ===== SYNC ENGINE =====
const Sync = {
  _queue: [],
  _syncing: false,
  _online: navigator.onLine,

  init() {
    window.addEventListener('online', () => {
      this._online = true;
      this.flush();
    });
    window.addEventListener('offline', () => {
      this._online = false;
    });
  },

  // Push a key to server (debounced)
  push(key, value) {
    if (!Auth.isLoggedIn()) return;
    // Add to queue (replace if same key already queued)
    const idx = this._queue.findIndex(q => q.key === key);
    if (idx >= 0) this._queue[idx].value = value;
    else this._queue.push({ key, value });
    // Debounce
    if (this._pushTimer) clearTimeout(this._pushTimer);
    this._pushTimer = setTimeout(() => this.flush(), 1000);
  },

  // Flush queue to server
  async flush() {
    if (!Auth.isLoggedIn() || !this._online || this._syncing || !this._queue.length) return;
    this._syncing = true;
    const batch = [...this._queue];
    this._queue = [];

    for (const item of batch) {
      try {
        await fetch(`${API_BASE}/data/set`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + Auth.token
          },
          body: JSON.stringify({ key: item.key, value: item.value })
        });
      } catch (e) {
        // Re-queue on failure
        this._queue.push(item);
      }
    }
    this._syncing = false;
  },

  // Pull all data from server to user-scoped localStorage
  async pullAll() {
    if (!Auth.isLoggedIn()) return;
    try {
      const res = await fetch(`${API_BASE}/data/all`, {
        headers: { 'Authorization': 'Bearer ' + Auth.token }
      });
      if (!res.ok) return;
      const { data } = await res.json();
      // Write to scoped localStorage using S.s (without triggering re-sync)
      for (const [key, value] of Object.entries(data)) {
        localStorage.setItem(S._prefix(key), JSON.stringify(value));
      }
      console.log(`Synced ${Object.keys(data).length} keys to scope: ${S._scope}`);
    } catch (e) {
      console.log('Sync pull failed (offline?):', e.message);
    }
  },

  // Migrate current scope's localStorage data to server
  async migrateToServer() {
    if (!Auth.isLoggedIn()) return;
    const data = {};
    const prefix = `fr_${S._scope}_`;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        // Send the short key (without scope prefix) to server
        const shortKey = key.slice(prefix.length);
        data[shortKey] = localStorage.getItem(key);
      }
    }
    if (!Object.keys(data).length) return;

    try {
      const res = await fetch(`${API_BASE}/data/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + Auth.token
        },
        body: JSON.stringify({ data })
      });
      const result = await res.json();
      console.log('Migration result:', result);
      return result;
    } catch (e) {
      console.error('Migration failed:', e);
    }
  }
};

// ===== AUDIT CLIENT =====
const AuditClient = {
  async getLog(options = {}) {
    if (!Auth.isLoggedIn()) return { logs: [], total: 0 };
    try {
      const params = new URLSearchParams(options);
      const res = await fetch(`${API_BASE}/audit/log?${params}`, {
        headers: { 'Authorization': 'Bearer ' + Auth.token }
      });
      return await res.json();
    } catch (e) {
      return { logs: [], total: 0 };
    }
  },

  async getSummary(days = 7) {
    if (!Auth.isLoggedIn()) return null;
    try {
      const res = await fetch(`${API_BASE}/audit/summary?days=${days}`, {
        headers: { 'Authorization': 'Bearer ' + Auth.token }
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  async getTraining(days = 30) {
    if (!Auth.isLoggedIn()) return null;
    try {
      const res = await fetch(`${API_BASE}/audit/training?days=${days}`, {
        headers: { 'Authorization': 'Bearer ' + Auth.token }
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  }
};

// ===== INIT =====
Auth.init();
Sync.init();
