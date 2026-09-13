// === backend/server.js ===
const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const { ensureSeeded } = require('./seed');
ensureSeeded();

const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');
const projectsRoutes = require('./routes/projects');
const experiencesRoutes = require('./routes/experiences');
const certificationsRoutes = require('./routes/certifications');
const uploadRoutes = require('./routes/upload');
const contactRoutes = require('./routes/contact');
const analyticsRoutes = require('./routes/analytics');

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Serve uploaded files (photos, resume, certificates) statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/experiences', experiencesRoutes);
app.use('/api/certifications', certificationsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Multer / general error handler
app.use((err, req, res, next) => {
  if (err) {
    return res.status(400).json({ message: err.message || 'Something went wrong.' });
  }
  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Portfolio backend running on http://localhost:${PORT}`);
});
