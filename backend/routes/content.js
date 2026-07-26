// === backend/routes/content.js ===
const express = require('express');
const { readDB, writeDB } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/content -> public, everything the public site needs in one call
router.get('/', (req, res) => {
  const db = readDB();
  res.json({
    hero: db.hero,
    about: db.about,
    skills: db.skills,
    contact: db.contact,
    appearance: db.appearance || { fontPreset: 'modern', baseFontSize: 16 }
  });
});

// PUT /api/content/hero -> admin only
router.put('/hero', requireAuth, (req, res) => {
  const db = readDB();
  db.hero = { ...db.hero, ...req.body };
  writeDB(db);
  res.json(db.hero);
});

// PUT /api/content/about -> admin only
router.put('/about', requireAuth, (req, res) => {
  const db = readDB();
  db.about = { ...db.about, ...req.body };
  writeDB(db);
  res.json(db.about);
});

// PUT /api/content/skills -> admin only (replaces the whole categories array)
router.put('/skills', requireAuth, (req, res) => {
  const db = readDB();
  db.skills = { categories: req.body.categories || [] };
  writeDB(db);
  res.json(db.skills);
});

// PUT /api/content/contact -> admin only
router.put('/contact', requireAuth, (req, res) => {
  const db = readDB();
  db.contact = { ...db.contact, ...req.body };
  writeDB(db);
  res.json(db.contact);
});

// PUT /api/content/appearance -> admin only (font style + base size for the public site)
router.put('/appearance', requireAuth, (req, res) => {
  const db = readDB();
  db.appearance = {
    fontPreset: req.body.fontPreset || 'modern',
    baseFontSize: Number(req.body.baseFontSize) || 16
  };
  writeDB(db);
  res.json(db.appearance);
});

module.exports = router;
