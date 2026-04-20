// ================================================================
//  LIBRA FIT - ADMIN ROUTES
//  Password-protected endpoints for monitoring/backup.
//  Never exposes passwords, JWT tokens, PIN hashes, or raw data content.
// ================================================================

const express = require('express');
const router = express.Router();
const db = require('../db');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'LibraAdmin2026!';

function checkPass(pass) {
  return typeof pass === 'string' && pass === ADMIN_PASSWORD;
}

function sanitizeUser(u, data) {
  const keys = data && data[u.id] ? Object.keys(data[u.id]) : [];
  return {
    id: u.id,
    username: u.username,
    createdAt: u.createdAt,
    lastLogin: u.lastLogin,
    loginCount: u.loginCount || 0,
    locked: !!u.locked,
    failedAttempts: u.failedAttempts || 0,
    hasRecoveryPin: !!u.recoveryPin,
    dataKeysCount: keys.length,
    dataKeys: keys
  };
}

// ===== POST /api/admin/stats =====
router.post('/stats', (req, res) => {
  const { password } = req.body || {};
  if (!checkPass(password)) {
    db.log({
      action: 'admin_access_denied',
      detail: `Bad admin password from ${req.ip}`,
      ip: req.ip,
      status: 'blocked'
    });
    return res.status(401).json({ error: 'Contrasena admin incorrecta.' });
  }

  const users = db.users.map(u => sanitizeUser(u, db.data));

  // Recent audit (last 50, without sensitive fields)
  const recentAudit = db.audit
    .slice(-50)
    .reverse()
    .map(l => ({
      id: l.id,
      timestamp: l.timestamp,
      action: l.action,
      userId: l.userId,
      detail: l.detail,
      status: l.status,
      ip: l.ip
    }));

  // Data size
  let totalDataSize = 0;
  try { totalDataSize = JSON.stringify(db.data).length; } catch (e) {}

  db.log({
    action: 'admin_stats',
    detail: 'Admin panel stats accessed',
    ip: req.ip,
    status: 'completed'
  });

  res.json({
    ok: true,
    stats: {
      totalUsers: users.length,
      totalAuditEvents: db.audit.length,
      totalDataSize,
      serverUptimeSec: Math.round(process.uptime()),
      nodeVersion: process.version,
      serverTime: new Date().toISOString()
    },
    users,
    recentAudit
  });
});

// ===== GET /api/admin/audit?password=...&action=... =====
router.get('/audit', (req, res) => {
  const { password, action, limit } = req.query;
  if (!checkPass(password)) {
    return res.status(401).json({ error: 'Contrasena admin incorrecta.' });
  }

  let logs = db.audit.slice();
  if (action) logs = logs.filter(l => l.action === action);
  logs.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
  const lim = Math.min(parseInt(limit) || 200, 2000);
  logs = logs.slice(0, lim).map(l => ({
    id: l.id,
    timestamp: l.timestamp,
    action: l.action,
    userId: l.userId,
    detail: l.detail,
    status: l.status,
    ip: l.ip
  }));

  res.json({ ok: true, total: logs.length, logs });
});

// ===== GET /api/admin/versions =====
// v2.1: Lista los ultimos 30 commits para UI de rollback
router.get('/versions', (req, res) => {
  if (!checkPass(req.query.password)) {
    return res.status(401).json({ error: 'Contrasena admin incorrecta.' });
  }

  const { exec } = require('child_process');
  const path = require('path');
  const repoDir = path.join(__dirname, '..', '..');

  // Formato: hash|author|date|message (separado por |)
  const cmd = 'git log --pretty=format:"%H|%h|%an|%ai|%s" -n 30';

  exec(cmd, { cwd: repoDir, maxBuffer: 500000 }, (err, stdout) => {
    if(err){
      return res.status(500).json({
        error: 'No se puede leer git log. Render puede no tener .git en el build.',
        details: err.message
      });
    }
    const lines = stdout.trim().split('\n').filter(Boolean);
    const commits = lines.map(line => {
      const [fullHash, shortHash, author, date, ...messageParts] = line.split('|');
      return {
        hash: fullHash,
        shortHash,
        author,
        date,
        message: messageParts.join('|'),
        isCurrent: false  // Se marca abajo
      };
    });

    // Marcar el commit actual (HEAD)
    exec('git rev-parse HEAD', { cwd: repoDir }, (err2, head) => {
      const currentHash = err2 ? '' : head.trim();
      commits.forEach(c => { if(c.hash === currentHash) c.isCurrent = true; });

      res.json({
        ok: true,
        currentHash,
        environment: process.env.ENVIRONMENT || 'production',
        commits
      });
    });
  });
});

// ===== GET /api/admin/version-info =====
// Informacion extendida del deploy actual
router.get('/version-info', (req, res) => {
  if (!checkPass(req.query.password)) {
    return res.status(401).json({ error: 'Contrasena admin incorrecta.' });
  }

  const { execSync } = require('child_process');
  const path = require('path');
  const repoDir = path.join(__dirname, '..', '..');

  let hash = 'unknown', branch = 'unknown', date = 'unknown';
  try {
    hash = execSync('git rev-parse HEAD', { cwd: repoDir }).toString().trim();
    branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: repoDir }).toString().trim();
    date = execSync(`git show -s --format=%ai ${hash}`, { cwd: repoDir }).toString().trim();
  } catch(e) {}

  res.json({
    ok: true,
    hash,
    shortHash: hash.slice(0, 7),
    branch,
    date,
    environment: process.env.ENVIRONMENT || 'production',
    supabase: !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY),
    uptime: Math.round(process.uptime())
  });
});

// ===== POST /api/admin/export-users =====
// Returns a JSON backup of users (metadata only) for download
router.post('/export-users', (req, res) => {
  const { password } = req.body || {};
  if (!checkPass(password)) {
    return res.status(401).json({ error: 'Contrasena admin incorrecta.' });
  }
  const users = db.users.map(u => sanitizeUser(u, db.data));
  db.log({
    action: 'admin_export_users',
    detail: `Exported ${users.length} users`,
    ip: req.ip,
    status: 'completed'
  });
  res.json({ ok: true, exportedAt: new Date().toISOString(), count: users.length, users });
});

module.exports = router;
