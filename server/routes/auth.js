// ================================================================
//  FITRICARDO - AUTH ROUTES
// ================================================================

const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require('../db');
const { generateToken, loginLimiter, registerLimiter, authRequired } = require('../middleware');

// ===== REGISTER =====
router.post('/register', registerLimiter, async (req, res) => {
  try {
    const { username, password, pin } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contrasena requeridos.' });
    }
    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({ error: 'Usuario: 3-30 caracteres.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Contrasena: minimo 6 caracteres.' });
    }
    // Only alphanumeric username
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).json({ error: 'Usuario solo letras, numeros y _' });
    }

    // Check if user exists
    if (db.findUser(username)) {
      db.log({
        action: 'register_failed',
        detail: `Username already exists: ${username}`,
        ip: req.ip,
        status: 'failed'
      });
      return res.status(409).json({ error: 'Usuario ya existe.' });
    }

    // Hash password (cost factor 12)
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = db.createUser(username, hashedPassword);

    // Generate token
    const token = generateToken(user);

    // Log
    db.log({
      action: 'register',
      userId: user.id,
      detail: `New user registered: ${username}`,
      ip: req.ip,
      status: 'completed'
    });

    // Initialize default data
    db.setData(user.id, 'profile', {
      name: username,
      age: null,
      gender: 'masculino',
      height: null,
      wStart: null,
      wGoal: null,
      activity: 'moderado',
      bodyFat: null,
      muscleMass: null,
      visceralFat: null,
      metaAge: null,
      bmr: null,
      notes: ''
    });
    db.setData(user.id, 'settings', {
      notif: true, water: true, sleep: true,
      meal: true, gym: true, morning: true
    });
    db.setData(user.id, 'mysups', ['creatina', 'fibra', 'multi']);
    db.setData(user.id, 'goals', {
      targetWeight: null,
      targetDate: '2026-05-10',
      startWeight: null
    });
    db.setData(user.id, 'bw', []);

    res.status(201).json({
      ok: true,
      token,
      user: { id: user.id, username: user.username }
    });
  } catch (e) {
    console.error('Register error:', e);
    res.status(500).json({ error: 'Error interno.' });
  }
});

// ===== LOGIN =====
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contrasena requeridos.' });
    }

    const user = db.findUser(username);
    if (!user) {
      db.log({
        action: 'login_failed',
        detail: `User not found: ${username}`,
        ip: req.ip,
        status: 'failed'
      });
      return res.status(401).json({ error: 'Usuario o contrasena incorrectos.' });
    }

    // Check if account is locked
    if (user.locked) {
      db.log({
        action: 'login_blocked',
        userId: user.id,
        detail: 'Account locked',
        ip: req.ip,
        status: 'blocked'
      });
      return res.status(423).json({ error: 'Cuenta bloqueada por seguridad. Contacta soporte.' });
    }

    // Verify password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      // Increment failed attempts
      const attempts = (user.failedAttempts || 0) + 1;
      const updates = { failedAttempts: attempts };
      // Lock after 10 failed attempts
      if (attempts >= 10) {
        updates.locked = true;
        db.log({
          action: 'account_locked',
          userId: user.id,
          detail: `Account locked after ${attempts} failed attempts`,
          ip: req.ip,
          status: 'blocked'
        });
      }
      db.updateUser(user.id, updates);

      db.log({
        action: 'login_failed',
        userId: user.id,
        detail: `Wrong password (attempt ${attempts})`,
        ip: req.ip,
        status: 'failed'
      });
      return res.status(401).json({ error: 'Usuario o contrasena incorrectos.' });
    }

    // Success - reset failed attempts
    db.updateUser(user.id, {
      lastLogin: new Date().toISOString(),
      loginCount: (user.loginCount || 0) + 1,
      failedAttempts: 0
    });

    const token = generateToken(user);

    db.log({
      action: 'login',
      userId: user.id,
      detail: `Login successful from ${req.ip}`,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'completed'
    });

    res.json({
      ok: true,
      token,
      user: { id: user.id, username: user.username }
    });
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ error: 'Error interno.' });
  }
});

// ===== VERIFY TOKEN =====
router.get('/verify', authRequired, (req, res) => {
  res.json({ ok: true, user: req.user });
});

// ===== CHANGE PASSWORD =====
router.post('/change-password', authRequired, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Contrasenas requeridas.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Nueva contrasena: minimo 6 caracteres.' });
    }

    const user = db.findUser(req.user.username);
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      db.log({
        action: 'password_change_failed',
        userId: req.user.id,
        detail: 'Wrong current password',
        ip: req.ip,
        status: 'failed'
      });
      return res.status(401).json({ error: 'Contrasena actual incorrecta.' });
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    db.updateUser(user.id, { password: hashed });

    db.log({
      action: 'password_changed',
      userId: req.user.id,
      detail: 'Password changed successfully',
      ip: req.ip,
      status: 'completed'
    });

    res.json({ ok: true, message: 'Contrasena actualizada.' });
  } catch (e) {
    console.error('Password change error:', e);
    res.status(500).json({ error: 'Error interno.' });
  }
});

module.exports = router;
