// ================================================================
//  FITRICARDO - SECURITY MIDDLEWARE
// ================================================================

const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const db = require('./db');

const JWT_SECRET = process.env.FR_JWT_SECRET || 'fitricardo-jwt-secret-2026-change-in-production';
const JWT_EXPIRY = '7d'; // Token expires in 7 days

// ===== JWT HELPERS =====
function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

// ===== AUTH MIDDLEWARE =====
function authRequired(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    db.log({
      action: 'auth_failed',
      detail: 'Missing or invalid authorization header',
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'failed'
    });
    return res.status(401).json({ error: 'No autorizado. Inicia sesion.' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    db.log({
      action: 'auth_failed',
      detail: 'Invalid or expired token',
      ip: req.ip,
      status: 'failed'
    });
    return res.status(401).json({ error: 'Token invalido o expirado. Inicia sesion de nuevo.' });
  }

  // Check if user still exists and is not locked
  const user = db.findUser(decoded.username);
  if (!user || user.locked) {
    return res.status(401).json({ error: 'Cuenta bloqueada o eliminada.' });
  }

  req.user = decoded;
  next();
}

// ===== RATE LIMITERS =====

// General API: 100 requests per minute
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: 'Demasiadas solicitudes. Espera un momento.' },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    db.log({
      action: 'rate_limited',
      detail: `IP: ${req.ip}, Path: ${req.path}`,
      ip: req.ip,
      status: 'blocked'
    });
    res.status(429).json({ error: 'Demasiadas solicitudes. Espera un momento.' });
  }
});

// Login: 5 attempts per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Demasiados intentos de login. Espera 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    db.log({
      action: 'login_rate_limited',
      detail: `IP: ${req.ip}, Username: ${req.body?.username}`,
      ip: req.ip,
      status: 'blocked'
    });
    res.status(429).json({ error: 'Demasiados intentos. Espera 15 minutos.' });
  }
});

// Register: 3 per hour
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { error: 'Demasiados registros. Espera 1 hora.' }
});

// ===== INPUT SANITIZATION =====
function sanitize(req, res, next) {
  // Prevent prototype pollution
  if (req.body && typeof req.body === 'object') {
    delete req.body.__proto__;
    delete req.body.constructor;
    delete req.body.prototype;
  }
  // Limit body size check (express.json already limits)
  next();
}

// ===== SECURITY HEADERS =====
function securityHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.removeHeader('X-Powered-By');
  next();
}

// ===== REQUEST LOGGER =====
function requestLogger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    // Only log non-GET requests or errors
    if (req.method !== 'GET' || res.statusCode >= 400) {
      db.log({
        action: 'api_request',
        userId: req.user?.id,
        detail: `${req.method} ${req.path} [${res.statusCode}] ${duration}ms`,
        ip: req.ip,
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration,
        status: res.statusCode < 400 ? 'completed' : 'failed'
      });
    }
  });
  next();
}

module.exports = {
  generateToken,
  verifyToken,
  authRequired,
  apiLimiter,
  loginLimiter,
  registerLimiter,
  sanitize,
  securityHeaders,
  requestLogger,
  JWT_SECRET
};
