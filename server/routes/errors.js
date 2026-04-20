// ================================================================
//  LIBRA FIT - ERROR REPORTS ROUTES
//  Recibe reportes de errores desde el frontend (PWA) y los guarda.
// ================================================================

const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const db = require('../db');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'LibraAdmin2026!';
const MAX_REPORTS = 500;

function getReports() {
  if (!db.data._errorReports) db.data._errorReports = [];
  return db.data._errorReports;
}

function saveReports(reports) {
  // Store in db.data under a special key (not user-scoped)
  db.data._errorReports = reports.slice(-MAX_REPORTS);
  db._scheduleSave('data');
}

function checkAdmin(pass) {
  return typeof pass === 'string' && pass === ADMIN_PASSWORD;
}

// ===== POST /api/errors/report =====
// Autenticacion opcional: si hay JWT valido, se asocia el userId, sino anonimo.
router.post('/report', (req, res) => {
  try {
    const {
      description = '',
      logs = [],
      url = '',
      page = '',
      userAgent = '',
      timestamp = new Date().toISOString(),
      platform = '',
      language = '',
      screen: screenRes = '',
      viewport = '',
      online = true
    } = req.body || {};

    // Try to extract userId from JWT (optional)
    let userId = null;
    let username = null;
    const authHeader = req.headers.authorization || '';
    if (authHeader.startsWith('Bearer ')) {
      try {
        const jwt = require('jsonwebtoken');
        const JWT_SECRET = process.env.JWT_SECRET || 'fitricardo-jwt-secret-change-in-production';
        const decoded = jwt.verify(authHeader.slice(7), JWT_SECRET);
        userId = decoded.userId || null;
        username = decoded.username || null;
      } catch (e) { /* anonymous */ }
    }

    // Defensive sizing: limit logs array and total payload
    const safeLogs = Array.isArray(logs) ? logs.slice(-300).map(l => ({
      t: Number(l.t) || Date.now(),
      level: String(l.level || '').slice(0, 20),
      msg: String(l.msg || '').slice(0, 1000)
    })) : [];

    const report = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      userId,
      username,
      description: String(description).slice(0, 2000),
      url: String(url).slice(0, 500),
      page: String(page).slice(0, 50),
      userAgent: String(userAgent).slice(0, 500),
      timestamp: String(timestamp).slice(0, 50),
      platform: String(platform).slice(0, 50),
      language: String(language).slice(0, 20),
      screen: String(screenRes).slice(0, 20),
      viewport: String(viewport).slice(0, 20),
      online: !!online,
      ip: req.ip,
      logs: safeLogs
    };

    const reports = getReports();
    reports.push(report);
    saveReports(reports);

    db.log({
      action: 'error_report',
      detail: `Bug reported by ${username || 'anonymous'}: ${report.description.slice(0, 80) || '(sin descripcion)'}`,
      userId: userId || undefined,
      ip: req.ip,
      status: 'completed'
    });

    res.json({ ok: true, id: report.id });
  } catch (e) {
    console.error('error-report save failed:', e);
    res.status(500).json({ error: 'No se pudo guardar el reporte.' });
  }
});

// ===== GET /api/errors?password=ADMIN =====
// Admin-only: listar todos los reportes
router.get('/', (req, res) => {
  const { password, limit } = req.query;
  if (!checkAdmin(password)) {
    return res.status(401).json({ error: 'Contrasena admin incorrecta.' });
  }
  const reports = getReports().slice();
  reports.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  const lim = Math.min(parseInt(limit) || 200, MAX_REPORTS);
  res.json({ ok: true, total: reports.length, reports: reports.slice(0, lim) });
});

// ===== DELETE /api/errors/:id?password=ADMIN =====
router.delete('/:id', (req, res) => {
  const { password } = req.query;
  if (!checkAdmin(password)) {
    return res.status(401).json({ error: 'Contrasena admin incorrecta.' });
  }
  const reports = getReports().filter(r => r.id !== req.params.id);
  saveReports(reports);
  res.json({ ok: true });
});

// ===== DELETE /api/errors?password=ADMIN (clear all) =====
router.delete('/', (req, res) => {
  const { password } = req.query;
  if (!checkAdmin(password)) {
    return res.status(401).json({ error: 'Contrasena admin incorrecta.' });
  }
  saveReports([]);
  res.json({ ok: true });
});

module.exports = router;
