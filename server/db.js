// ================================================================
//  FITRICARDO - SECURE JSON DATABASE
//  Archivo encriptado con acceso solo via API autenticada
// ================================================================

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DB_DIR, 'database.json');
const AUDIT_FILE = path.join(DB_DIR, 'audit.json');
const USERS_FILE = path.join(DB_DIR, 'users.json');

// Encryption key derivado del environment
const ENC_KEY = process.env.FR_SECRET || 'fitricardo-secure-key-2026-change-in-production';
const ALGORITHM = 'aes-256-cbc';

function getKey() {
  return crypto.createHash('sha256').update(ENC_KEY).digest();
}

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text) {
  const parts = text.split(':');
  const iv = Buffer.from(parts.shift(), 'hex');
  const encrypted = parts.join(':');
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Initialize database directory
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

function readFile(filepath, defaultData) {
  try {
    if (!fs.existsSync(filepath)) return defaultData;
    const raw = fs.readFileSync(filepath, 'utf8');
    if (!raw.trim()) return defaultData;
    // Try encrypted first
    try {
      return JSON.parse(decrypt(raw));
    } catch {
      // Fallback: unencrypted (first run migration)
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error(`Error reading ${filepath}:`, e.message);
    return defaultData;
  }
}

function writeFile(filepath, data) {
  const json = JSON.stringify(data, null, 2);
  const encrypted = encrypt(json);
  fs.writeFileSync(filepath, encrypted, 'utf8');
}

// ===== DATABASE CLASS =====
class Database {
  constructor() {
    this.data = readFile(DB_FILE, {});
    this.users = readFile(USERS_FILE, []);
    this.audit = readFile(AUDIT_FILE, []);
    this._saveTimer = null;
  }

  // Debounced save to prevent excessive writes
  _scheduleSave(file = 'data') {
    if (this._saveTimer) clearTimeout(this._saveTimer);
    this._saveTimer = setTimeout(() => {
      this._save(file);
    }, 500);
  }

  _save(file = 'all') {
    try {
      if (file === 'data' || file === 'all') writeFile(DB_FILE, this.data);
      if (file === 'users' || file === 'all') writeFile(USERS_FILE, this.users);
      if (file === 'audit' || file === 'all') writeFile(AUDIT_FILE, this.audit);
    } catch (e) {
      console.error('DB save error:', e.message);
    }
  }

  // ===== USER OPERATIONS =====
  findUser(username) {
    return this.users.find(u => u.username === username.toLowerCase());
  }

  createUser(username, hashedPassword, hashedPin) {
    const user = {
      id: crypto.randomUUID(),
      username: username.toLowerCase(),
      password: hashedPassword,
      recoveryPin: hashedPin || null,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      loginCount: 0,
      locked: false,
      failedAttempts: 0
    };
    this.users.push(user);
    this._save('users');
    return user;
  }

  updateUser(userId, updates) {
    const idx = this.users.findIndex(u => u.id === userId);
    if (idx === -1) return null;
    Object.assign(this.users[idx], updates);
    this._save('users');
    return this.users[idx];
  }

  // ===== DATA OPERATIONS (per user) =====
  getUserData(userId) {
    if (!this.data[userId]) this.data[userId] = {};
    return this.data[userId];
  }

  getData(userId, key, defaultVal = null) {
    const userData = this.getUserData(userId);
    return userData[key] !== undefined ? userData[key] : defaultVal;
  }

  setData(userId, key, value) {
    if (!this.data[userId]) this.data[userId] = {};
    this.data[userId][key] = value;
    this._scheduleSave('data');
    return true;
  }

  deleteData(userId, key) {
    if (this.data[userId]) {
      delete this.data[userId][key];
      this._scheduleSave('data');
    }
    return true;
  }

  getAllData(userId) {
    return this.getUserData(userId);
  }

  // Bulk import (for migration from localStorage)
  importData(userId, dataObj) {
    if (!this.data[userId]) this.data[userId] = {};
    Object.assign(this.data[userId], dataObj);
    this._save('data');
    return true;
  }

  // ===== AUDIT LOG =====
  log(entry) {
    const record = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...entry
    };
    this.audit.push(record);
    // Keep last 10000 entries
    if (this.audit.length > 10000) {
      this.audit = this.audit.slice(-10000);
    }
    this._scheduleSave('audit');
    return record;
  }

  getAuditLog(userId, options = {}) {
    let logs = this.audit.filter(l => l.userId === userId);
    if (options.action) logs = logs.filter(l => l.action === options.action);
    if (options.from) logs = logs.filter(l => l.timestamp >= options.from);
    if (options.to) logs = logs.filter(l => l.timestamp <= options.to);
    // Sort newest first
    logs.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    // Pagination
    const limit = options.limit || 50;
    const offset = options.offset || 0;
    return {
      total: logs.length,
      logs: logs.slice(offset, offset + limit)
    };
  }

  // Get audit summary (what was done / not done)
  getAuditSummary(userId, days = 7) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceStr = since.toISOString();
    const logs = this.audit.filter(l => l.userId === userId && l.timestamp >= sinceStr);

    const summary = {
      totalActions: logs.length,
      byAction: {},
      byDay: {},
      attempted: [],
      completed: [],
      failed: []
    };

    logs.forEach(l => {
      // Count by action type
      summary.byAction[l.action] = (summary.byAction[l.action] || 0) + 1;
      // Count by day
      const day = l.timestamp.split('T')[0];
      if (!summary.byDay[day]) summary.byDay[day] = { actions: 0, details: [] };
      summary.byDay[day].actions++;
      summary.byDay[day].details.push({ action: l.action, detail: l.detail, status: l.status });
      // Categorize
      if (l.status === 'completed') summary.completed.push(l);
      else if (l.status === 'failed') summary.failed.push(l);
      else summary.attempted.push(l);
    });

    return summary;
  }

  // Force save everything now
  flush() {
    if (this._saveTimer) {
      clearTimeout(this._saveTimer);
      this._saveTimer = null;
    }
    this._save('all');
  }
}

// Singleton
const db = new Database();

// Save on exit
process.on('SIGINT', () => { db.flush(); process.exit(0); });
process.on('SIGTERM', () => { db.flush(); process.exit(0); });
process.on('exit', () => { db.flush(); });

module.exports = db;
