// === backend/routes/experiences.js ===
const express = require('express');
const { nanoid } = require('nanoid');
const { readDB, writeDB } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/experiences -> public
router.get('/', (req, res) => {
  const db = readDB();
  res.json(db.experiences || []);
});

// POST /api/experiences -> admin only, create
router.post('/', requireAuth, (req, res) => {
  const db = readDB();
  const exp = {
    id: nanoid(8),
    company: req.body.company || 'New company',
    role: req.body.role || '',
    location: req.body.location || '',
    startDate: req.body.startDate || '',
    endDate: req.body.endDate || '',
    current: !!req.body.current,
    description: req.body.description || '',
    highlights: Array.isArray(req.body.highlights) ? req.body.highlights : []
  };
  db.experiences = db.experiences || [];
  db.experiences.push(exp);
  writeDB(db);
  res.status(201).json(exp);
});

// PUT /api/experiences/:id -> admin only, update
router.put('/:id', requireAuth, (req, res) => {
  const db = readDB();
  const idx = (db.experiences || []).findIndex((x) => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Experience not found.' });

  db.experiences[idx] = { ...db.experiences[idx], ...req.body, id: db.experiences[idx].id };
  writeDB(db);
  res.json(db.experiences[idx]);
});

// DELETE /api/experiences/:id -> admin only
router.delete('/:id', requireAuth, (req, res) => {
  const db = readDB();
  const before = (db.experiences || []).length;
  db.experiences = (db.experiences || []).filter((x) => x.id !== req.params.id);
  if (db.experiences.length === before) {
    return res.status(404).json({ message: 'Experience not found.' });
  }
  writeDB(db);
  res.json({ message: 'Experience deleted.' });
});

module.exports = router;
