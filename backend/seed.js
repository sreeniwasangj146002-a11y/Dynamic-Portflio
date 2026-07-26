// === backend/seed.js ===
// Creates data/db.json with starter content pulled from the resume, and
// hashes the admin password from .env. Runs automatically on first server
// start (server.js calls ensureSeeded()), or manually via `npm run seed`.

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { DB_PATH } = require('./db');

function ensureSeeded() {
  if (fs.existsSync(DB_PATH)) return;

  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'changeme123';
  const passwordHash = bcrypt.hashSync(password, 10);

  const initialData = {
    admin: {
      username,
      passwordHash
    },
    hero: {
      name: '',
      title: '',
      tagline: '',
      location: '',
      photo: '',
      resumeUrl: '',
      stats: [],
      socials: {
        email: '',
        phone: '',
        linkedin: '',
        github: '',
        twitter: ''
      }
    },
    about: {
      bio: [],
      highlights: [],
      education: []
    },
    skills: {
      categories: []
    },
    contact: {
      email: '',
      phone: '',
      location: '',
      availability: ''
    },
    appearance: {
      fontPreset: 'modern',
      baseFontSize: 16
    },
    projects: [],
    experiences: [],
    certifications: []
  };

  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
  console.log('Created data/db.json (empty). Log in to the Admin Panel to add your content.');
  console.log(`Admin login -> username: "${username}"  password: "${password}"`);
  console.log('Change this password from the Admin Panel after your first login.');
}

module.exports = { ensureSeeded };

// Allow running directly: `npm run seed` (re-seeds only if db.json is missing)
if (require.main === module) {
  ensureSeeded();
}
