// === backend/routes/certifications.js ===
const express = require('express');
const { nanoid } = require('nanoid');
const { readDB, writeDB } = require('../db');
const { requireAuth } = require('../middleware/auth');
const { uploadCertificate } = require('../middleware/upload');

const router = express.Router();

// GET /api/certifications -> public
router.get('/', (req, res) => {
  const db = readDB();
  res.json(db.certifications || []);
});

// POST /api/certifications -> admin only, create (metadata only)
router.post('/', requireAuth, (req, res) => {
  const db = readDB();
  const cert = {
    id: nanoid(8),
    title: req.body.title || 'Untitled certificate',
    issuer: req.body.issuer || '',
    date: req.body.date || '',
    file: req.body.file || ''
  };
  db.certifications = db.certifications || [];
  db.certifications.push(cert);
  writeDB(db);
  res.status(201).json(cert);
});

// PUT /api/certifications/:id -> admin only, update metadata
router.put('/:id', requireAuth, (req, res) => {
  const db = readDB();
  const idx = (db.certifications || []).findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Certificate not found.' });

  db.certifications[idx] = { ...db.certifications[idx], ...req.body, id: db.certifications[idx].id };
  writeDB(db);
  res.json(db.certifications[idx]);
});

// POST /api/certifications/:id/file -> admin only, upload the cert image/PDF
router.post('/:id/file', requireAuth, uploadCertificate.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file received.' });

  const db = readDB();
  const idx = (db.certifications || []).findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Certificate not found.' });

  db.certifications[idx].file = `/uploads/certificates/${req.file.filename}`;
  writeDB(db);
  res.json(db.certifications[idx]);
});

// DELETE /api/certifications/:id -> admin only
router.delete('/:id', requireAuth, (req, res) => {
  const db = readDB();
  const before = (db.certifications || []).length;
  db.certifications = (db.certifications || []).filter((c) => c.id !== req.params.id);
  if (db.certifications.length === before) {
    return res.status(404).json({ message: 'Certificate not found.' });
  }
  writeDB(db);
  res.json({ message: 'Certificate deleted.' });
});

module.exports = router;
