// === backend/db.js ===
// Tiny file-based database. No external DB server required.
// All content the admin panel edits (hero, about, skills, projects,
// certifications, contact info, admin credentials) lives in data/db.json.

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data', 'db.json');

function readDB() {
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

module.exports = { readDB, writeDB, DB_PATH };
