// ================================================================
//  FITRICARDO - DATA ROUTES (CRUD + Sync)
// ================================================================

const express = require('express');
const router = express.Router();
const db = require('../db');
const { authRequired } = require('../middleware');

// All routes require authentication
router.use(authRequired);

// ===== GET single key =====
router.get('/get/:key', (req, res) => {
  const value = db.getData(req.user.id, req.params.key);
  res.json({ ok: true, key: req.params.key, value });
});

// ===== SET single key =====
router.post('/set', (req, res) => {
  const { key, value } = req.body;
  if (!key || typeof key !== 'string') {
    return res.status(400).json({ error: 'Key requerida.' });
  }
  // Prevent overwriting auth-related keys
  if (['__users', '__audit'].includes(key)) {
    db.log({
      action: 'data_write_blocked',
      userId: req.user.id,
      detail: `Attempted to write protected key: ${key}`,
      ip: req.ip,
      status: 'blocked'
    });
    return res.status(403).json({ error: 'Key protegida.' });
  }

  db.setData(req.user.id, key, value);

  // Audit log for important actions
  const auditableKeys = ['profile', 'goals', 'settings', 'bw', 'mysups'];
  const isDayKey = key.startsWith('d_');
  const isExHist = key.startsWith('eh_');

  if (auditableKeys.includes(key) || isDayKey || isExHist) {
    let detail = `Updated: ${key}`;
    let action = 'data_update';

    if (isDayKey) {
      // Log specific day actions
      if (value?.meals) {
        const mealsDone = Object.values(value.meals).filter(Boolean).length;
        detail = `Dia ${key.replace('d_','')}: ${mealsDone}/6 comidas, ${value.water||0}ml agua`;
        action = 'day_update';
      }
    } else if (key === 'bw' && Array.isArray(value) && value.length > 0) {
      detail = `Peso registrado: ${value[0].weight} lbs (${value[0].date})`;
      action = 'weight_logged';
    } else if (key === 'profile') {
      detail = `Perfil actualizado`;
      action = 'profile_update';
    } else if (key === 'goals') {
      detail = `Meta actualizada: ${value?.targetWeight || '?'} lbs para ${value?.targetDate || '?'}`;
      action = 'goals_update';
    } else if (key === 'mysups') {
      detail = `Suplementos: ${(value || []).join(', ')}`;
      action = 'supplements_update';
    } else if (isExHist) {
      const exId = key.replace('eh_', '');
      const lastEntry = Array.isArray(value) && value[0];
      detail = `Ejercicio ${exId}: ${lastEntry?.weight || '?'} lbs (${lastEntry?.date || '?'})`;
      action = 'exercise_logged';
    }

    db.log({
      action,
      userId: req.user.id,
      detail,
      key,
      ip: req.ip,
      status: 'completed'
    });
  }

  res.json({ ok: true });
});

// ===== DELETE key =====
router.delete('/delete/:key', (req, res) => {
  db.deleteData(req.user.id, req.params.key);

  db.log({
    action: 'data_delete',
    userId: req.user.id,
    detail: `Deleted: ${req.params.key}`,
    key: req.params.key,
    ip: req.ip,
    status: 'completed'
  });

  res.json({ ok: true });
});

// ===== GET ALL data (for sync) =====
router.get('/all', (req, res) => {
  const data = db.getAllData(req.user.id);
  res.json({ ok: true, data });
});

// ===== BULK IMPORT (migrate from localStorage) =====
router.post('/import', (req, res) => {
  const { data } = req.body;
  if (!data || typeof data !== 'object') {
    return res.status(400).json({ error: 'Datos invalidos.' });
  }

  // Sanitize: remove any keys that could be dangerous
  const sanitized = {};
  for (const [key, value] of Object.entries(data)) {
    // Remove fr_ prefix if present (from localStorage migration)
    const cleanKey = key.startsWith('fr_') ? key.slice(3) : key;
    if (!['__proto__', 'constructor', 'prototype'].includes(cleanKey)) {
      sanitized[cleanKey] = typeof value === 'string' ? JSON.parse(value) : value;
    }
  }

  db.importData(req.user.id, sanitized);

  db.log({
    action: 'data_import',
    userId: req.user.id,
    detail: `Imported ${Object.keys(sanitized).length} keys from localStorage`,
    ip: req.ip,
    status: 'completed'
  });

  res.json({ ok: true, imported: Object.keys(sanitized).length });
});

// ===== EXPORT all data =====
router.get('/export', (req, res) => {
  const data = db.getAllData(req.user.id);

  db.log({
    action: 'data_export',
    userId: req.user.id,
    detail: `Exported ${Object.keys(data).length} keys`,
    ip: req.ip,
    status: 'completed'
  });

  res.json({ ok: true, data, exportedAt: new Date().toISOString() });
});

module.exports = router;
