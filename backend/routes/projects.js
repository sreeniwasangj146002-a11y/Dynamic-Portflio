// === backend/routes/projects.js ===
const express = require('express');
const { nanoid } = require('nanoid');
const { readDB, writeDB } = require('../db');
const { requireAuth } = require('../middleware/auth');
const { uploadPhoto } = require('../middleware/upload');

const router = express.Router();

const slugify = (value = '') => String(value)
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const projectSlug = (project = {}) => project.slug || slugify(project.title || project.id || 'project');

// GET /api/projects -> public
router.get('/', (req, res) => {
  const db = readDB();
  // Always expose a stable readable slug, including for older project records.
  res.json((db.projects || []).map((project) => ({ ...project, slug: projectSlug(project) })));
});

// GET /api/projects/:identifier -> public project detail.
// Accept both the original nanoid and the readable slug so existing links never break.
router.get('/:identifier', (req, res) => {
  const db = readDB();
  const identifier = decodeURIComponent(req.params.identifier || '');
  const project = (db.projects || []).find((p) =>
    p.id === identifier || p.slug === identifier || projectSlug(p) === identifier
  );
  if (!project) return res.status(404).json({ message: 'Project not found.' });
  res.json({ ...project, slug: projectSlug(project) });
});

// POST /api/projects -> admin only, create
router.post('/', requireAuth, (req, res) => {
  const db = readDB();
  const project = {
    id: nanoid(8),
    slug: slugify(req.body.slug || req.body.title || 'untitled-project'),
    category: req.body.category === 'experience' ? 'experience' : 'personal',
    title: req.body.title || 'Untitled project',
    role: req.body.role || '',
    description: req.body.description || '',
    tech: Array.isArray(req.body.tech) ? req.body.tech : [],
    link: req.body.link || '',
    image: req.body.image || '',
    featured: !!req.body.featured,
    company: req.body.company || '',
    duration: req.body.duration || '',
    teamSize: req.body.teamSize || '',
    problem: req.body.problem || '',
    solution: req.body.solution || '',
    outcome: req.body.outcome || '',
    features: Array.isArray(req.body.features) ? req.body.features : [],
    challenges: Array.isArray(req.body.challenges) ? req.body.challenges : []
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

  const merged = { ...db.projects[idx], ...req.body, id: db.projects[idx].id };
  merged.slug = slugify(req.body.slug || merged.slug || merged.title || merged.id);
  db.projects[idx] = merged;
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
