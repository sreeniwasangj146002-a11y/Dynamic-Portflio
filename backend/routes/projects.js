// === backend/routes/projects.js ===
const express = require('express');
const { nanoid } = require('nanoid');
const { readDB, writeDB } = require('../db');
const { requireAuth } = require('../middleware/auth');
const { uploadPhoto } = require('../middleware/upload');

const router = express.Router();

// GET /api/projects -> public
router.get('/', (req, res) => {
  const db = readDB();
  res.json(db.projects || []);
});

// POST /api/projects -> admin only, create
router.post('/', requireAuth, (req, res) => {
  const db = readDB();
  const project = {
    id: nanoid(8),
    category: req.body.category === 'experience' ? 'experience' : 'personal',
    title: req.body.title || 'Untitled project',
    role: req.body.role || '',
    description: req.body.description || '',
    tech: Array.isArray(req.body.tech) ? req.body.tech : [],
    link: req.body.link || '',
    image: req.body.image || '',
    featured: !!req.body.featured
  };
  db.projects = db.projects || [];
  db.projects.push(project);
  writeDB(db);
  res.status(201).json(project);
});

// PUT /api/projects/:id -> admin only, update
router.put('/:id', requireAuth, (req, res) => {
  const db = readDB();
  const idx = (db.projects || []).findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Project not found.' });

  db.projects[idx] = { ...db.projects[idx], ...req.body, id: db.projects[idx].id };
  writeDB(db);
  res.json(db.projects[idx]);
});

// DELETE /api/projects/:id -> admin only
router.delete('/:id', requireAuth, (req, res) => {
  const db = readDB();
  const before = (db.projects || []).length;
  db.projects = (db.projects || []).filter((p) => p.id !== req.params.id);
  if (db.projects.length === before) {
    return res.status(404).json({ message: 'Project not found.' });
  }
  writeDB(db);
  res.json({ message: 'Project deleted.' });
});

// POST /api/projects/:id/image -> admin only, upload a cover image for a project
router.post('/:id/image', requireAuth, uploadPhoto.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No image file received.' });

  const db = readDB();
  const idx = (db.projects || []).findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Project not found.' });

  db.projects[idx].image = `/uploads/photos/${req.file.filename}`;
  writeDB(db);
  res.json(db.projects[idx]);
});

module.exports = router;
