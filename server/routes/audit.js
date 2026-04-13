// ================================================================
//  FITRICARDO - AUDIT LOG ROUTES
// ================================================================

const express = require('express');
const router = express.Router();
const db = require('../db');
const { authRequired } = require('../middleware');

router.use(authRequired);

// ===== GET AUDIT LOG =====
router.get('/log', (req, res) => {
  const { action, from, to, limit, offset } = req.query;
  const result = db.getAuditLog(req.user.id, {
    action,
    from,
    to,
    limit: limit ? parseInt(limit) : 50,
    offset: offset ? parseInt(offset) : 0
  });
  res.json({ ok: true, ...result });
});

// ===== GET AUDIT SUMMARY =====
router.get('/summary', (req, res) => {
  const days = parseInt(req.query.days) || 7;
  const summary = db.getAuditSummary(req.user.id, Math.min(days, 90));
  res.json({ ok: true, summary });
});

// ===== GET TRAINING DATA (what was done / not done) =====
router.get('/training', (req, res) => {
  const days = parseInt(req.query.days) || 30;
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceStr = since.toISOString();

  const logs = db.getAuditLog(req.user.id, { limit: 5000 }).logs
    .filter(l => l.timestamp >= sinceStr);

  // Analyze patterns
  const training = {
    period: `${days} dias`,
    totalActions: logs.length,

    // Meals
    mealLogs: logs.filter(l => l.action === 'day_update').length,

    // Weight tracking
    weightLogs: logs.filter(l => l.action === 'weight_logged'),

    // Exercise history
    exerciseLogs: logs.filter(l => l.action === 'exercise_logged'),

    // Profile changes
    profileChanges: logs.filter(l => l.action === 'profile_update').length,

    // Goal changes
    goalChanges: logs.filter(l => l.action === 'goals_update'),

    // Supplement changes
    supplementChanges: logs.filter(l => l.action === 'supplements_update'),

    // Security events
    securityEvents: logs.filter(l =>
      ['login', 'login_failed', 'auth_failed', 'rate_limited', 'account_locked', 'password_changed'].includes(l.action)
    ),

    // Failed actions
    failures: logs.filter(l => l.status === 'failed'),

    // Blocked actions
    blocked: logs.filter(l => l.status === 'blocked'),

    // Data imports/exports
    dataOps: logs.filter(l => ['data_import', 'data_export'].includes(l.action)),

    // Activity by hour
    byHour: {},

    // Activity by day of week
    byDayOfWeek: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
  };

  // Calculate time patterns
  logs.forEach(l => {
    const d = new Date(l.timestamp);
    const hour = d.getHours();
    const dow = d.getDay();
    training.byHour[hour] = (training.byHour[hour] || 0) + 1;
    training.byDayOfWeek[dow]++;
  });

  res.json({ ok: true, training });
});

module.exports = router;
