// === backend/routes/upload.js ===
const express = require('express');
const { readDB, writeDB } = require('../db');
const { requireAuth } = require('../middleware/auth');
const { uploadPhoto, uploadResume } = require('../middleware/upload');

const router = express.Router();

// POST /api/upload/photo -> admin only, replaces the hero profile photo
router.post('/photo', requireAuth, uploadPhoto.single('photo'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No photo file received.' });

  const db = readDB();
  db.hero.photo = `/uploads/photos/${req.file.filename}`;
  writeDB(db);
  res.json({ photo: db.hero.photo });
});

// POST /api/upload/resume -> admin only, replaces the downloadable resume PDF
router.post('/resume', requireAuth, uploadResume.single('resume'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No resume file received.' });

  const db = readDB();
  db.hero.resumeUrl = `/uploads/resume/${req.file.filename}`;
  writeDB(db);
  res.json({ resumeUrl: db.hero.resumeUrl });
});

module.exports = router;
