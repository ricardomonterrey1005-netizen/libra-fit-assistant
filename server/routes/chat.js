// ================================================================
//  LIBRA FIT - CHAT FEEDBACK ENDPOINT (v2.0)
// ================================================================
//  Recibe reports de misses/rejections/dislikes del chat.
//  Se usan en admin panel para entrenar al chat con mas patterns.
// ================================================================

const express = require('express');
const router = express.Router();
const db = require('../db');
const { authRequired } = require('../middleware');

// POST /api/chat/feedback
// Body: { reports: [ { timestamp, userText, detectedIntent, response, context, type, userId } ] }
router.post('/feedback', authRequired, (req, res) => {
  try {
    const { reports } = req.body;
    if(!Array.isArray(reports)) {
      return res.status(400).json({ error: 'reports debe ser un array' });
    }

    // Guardar en DB (separado de audit para facil consulta admin)
    if(!db.data._chatFeedback) db.data._chatFeedback = [];

    reports.forEach(r => {
      db.data._chatFeedback.push({
        id: require('crypto').randomUUID(),
        receivedAt: new Date().toISOString(),
        userId: r.userId || req.user.id,
        timestamp: r.timestamp,
        userText: String(r.userText || '').slice(0, 500),
        detectedIntent: String(r.detectedIntent || 'none'),
        response: String(r.response || '').slice(0, 500),
        userFeedback: String(r.userFeedback || '').slice(0, 200),
        type: r.type || 'miss',
        context: r.context || {},
        reviewed: false,        // admin marca como revisado cuando entrena
        addedAsPattern: false   // admin marca cuando agrega el pattern
      });
    });

    // Max 2000 reports
    if(db.data._chatFeedback.length > 2000) {
      db.data._chatFeedback = db.data._chatFeedback.slice(-2000);
    }

    db._scheduleSave('data');

    db.log({
      action: 'chat_feedback',
      userId: req.user.id,
      detail: `Received ${reports.length} chat reports`,
      status: 'completed'
    });

    res.json({ ok: true, received: reports.length });
  } catch(e) {
    console.error('Chat feedback error:', e);
    res.status(500).json({ error: 'Error interno' });
  }
});

// GET /api/chat/feedback?password=X
// Admin endpoint para listar misses
router.get('/feedback', (req, res) => {
  const pwd = req.query.password;
  const expected = process.env.ADMIN_PASSWORD || 'LibraAdmin2026!';
  if(pwd !== expected) {
    return res.status(403).json({ error: 'No autorizado' });
  }

  const reports = db.data._chatFeedback || [];
  const type = req.query.type;
  const unreviewedOnly = req.query.unreviewed === 'true';
  let filtered = reports;

  if(type) filtered = filtered.filter(r => r.type === type);
  if(unreviewedOnly) filtered = filtered.filter(r => !r.reviewed);

  // Sort desc por timestamp
  filtered.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));

  res.json({
    total: filtered.length,
    reports: filtered.slice(0, 200),
    stats: {
      total: reports.length,
      misses: reports.filter(r => r.type === 'miss').length,
      rejections: reports.filter(r => r.type === 'rejection').length,
      dislikes: reports.filter(r => r.type === 'dislike').length,
      unreviewed: reports.filter(r => !r.reviewed).length
    }
  });
});

// PATCH /api/chat/feedback/:id - marcar como revisado
router.patch('/feedback/:id', (req, res) => {
  const pwd = req.body.password || req.query.password;
  const expected = process.env.ADMIN_PASSWORD || 'LibraAdmin2026!';
  if(pwd !== expected) return res.status(403).json({ error: 'No autorizado' });

  const report = (db.data._chatFeedback || []).find(r => r.id === req.params.id);
  if(!report) return res.status(404).json({ error: 'No encontrado' });

  if(req.body.reviewed !== undefined) report.reviewed = !!req.body.reviewed;
  if(req.body.addedAsPattern !== undefined) report.addedAsPattern = !!req.body.addedAsPattern;

  db._scheduleSave('data');
  res.json({ ok: true });
});

module.exports = router;
