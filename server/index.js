// ================================================================
//  LIBRA FIT ASSISTANT - SECURE SERVER
//  Backend con autenticacion, base de datos encriptada, audit log
// ================================================================

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const db = require('./db');
const {
  apiLimiter,
  sanitize,
  securityHeaders,
  requestLogger
} = require('./middleware');

const app = express();
const PORT = process.env.PORT || 3001;

// ===== SECURITY =====
// Helmet: sets security HTTP headers
app.use(helmet({
  contentSecurityPolicy: false, // We serve our own frontend
  crossOriginEmbedderPolicy: false
}));

// Custom security headers
app.use(securityHeaders);

// CORS - only allow our frontend
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    /^http:\/\/192\.168\.\d+\.\d+:\d+$/,
    /^https?:\/\/.*\.railway\.app$/,
    /^https?:\/\/.*\.onrender\.com$/,
    /^https?:\/\/.*\.up\.railway\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing with size limit (prevent large payload attacks)
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

// Input sanitization
app.use(sanitize);

// Rate limiting on API routes
app.use('/api', apiLimiter);

// Request logging
app.use('/api', requestLogger);

// ===== SERVE FRONTEND =====
// Static files from parent directory (the PWA)
app.use(express.static(path.join(__dirname, '..'), {
  maxAge: 0,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
}));

// ===== API ROUTES =====
app.use('/api/auth', require('./routes/auth'));
app.use('/api/data', require('./routes/data'));
app.use('/api/audit', require('./routes/audit'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/errors', require('./routes/errors'));
app.use('/api/chat', require('./routes/chat'));

// ===== HEALTH CHECK + ENV INFO =====
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    server: 'Libra Fit Assistant v2.1',
    environment: process.env.ENVIRONMENT || 'production',
    supabase: !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY),
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// Endpoint publico para que el frontend sepa en que ambiente esta
app.get('/api/env', (req, res) => {
  res.json({
    environment: process.env.ENVIRONMENT || 'production',
    version: '2.1.0'
  });
});

// ===== 404 for unknown API routes =====
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' });
});

// ===== SPA fallback =====
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// ===== ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  db.log({
    action: 'server_error',
    detail: err.message,
    stack: err.stack?.split('\n').slice(0, 3).join(' | '),
    ip: req.ip,
    status: 'failed'
  });
  res.status(500).json({ error: 'Error interno del servidor.' });
});

// ===== START =====
async function startServer() {
  // v2.1: Si hay Supabase configurado, restaurar datos del disco efimero
  if(typeof db.init === 'function'){
    await db.init();
  }

  const env = process.env.ENVIRONMENT || 'production';
  const hasSupabase = !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY);

  app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('  ╔══════════════════════════════════════════╗');
    console.log('  ║   LIBRA FIT ASSISTANT - v2.1              ║');
    console.log('  ╠══════════════════════════════════════════╣');
    console.log(`  ║   Local:   http://localhost:${PORT}          ║`);
    console.log('  ║   Network: http://0.0.0.0:' + PORT + '          ║');
    console.log(`  ║   ENV:     ${env.padEnd(31)} ║`);
    console.log(`  ║   SUPABASE:${(hasSupabase?' SI (persistente)':' NO (efimero!)').padEnd(31)} ║`);
    console.log('  ╠══════════════════════════════════════════╣');
    console.log('  ║   Security: JWT + bcrypt + AES256 +       ║');
    console.log('  ║             rate limit + helmet + CORS    ║');
    console.log('  ╚══════════════════════════════════════════╝');
    console.log('');

    db.log({
      action: 'server_start',
      detail: `Server started on port ${PORT} (env=${env}, supabase=${hasSupabase})`,
      status: 'completed'
    });
  });
}

startServer().catch(e => {
  console.error('Startup failed:', e);
  process.exit(1);
});

module.exports = app;
