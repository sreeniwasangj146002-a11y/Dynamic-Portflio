// === backend/routes/auth.js ===
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readDB, writeDB } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login  { username, password } -> { token }
router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const db = readDB();
  const admin = db.admin;

  if (!admin || username !== admin.username) {
    return res.status(401).json({ message: 'Incorrect username or password.' });
  }

  const valid = bcrypt.compareSync(password, admin.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: 'Incorrect username or password.' });
  }

  const token = jwt.sign({ username: admin.username }, process.env.JWT_SECRET, {
    expiresIn: '12h'
  });

  res.json({ token, username: admin.username });
});

// GET /api/auth/me -> confirms the current token is valid
router.get('/me', requireAuth, (req, res) => {
  res.json({ username: req.admin.username });
});

// POST /api/auth/change-password  { currentPassword, newPassword }
router.post('/change-password', requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new password are required.' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters.' });
  }

  const db = readDB();
  const valid = bcrypt.compareSync(currentPassword, db.admin.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: 'Current password is incorrect.' });
  }

  db.admin.passwordHash = bcrypt.hashSync(newPassword, 10);
  writeDB(db);

  res.json({ message: 'Password updated successfully.' });
});

module.exports = router;
