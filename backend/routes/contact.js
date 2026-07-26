// === backend/routes/contact.js ===
const express = require('express');
const { sendContactEmail, isConfigured } = require('../mailer');

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are all required.' });
  }

  if (!isConfigured()) {
    // Email isn't set up yet — log it so nothing is silently lost, but
    // tell the caller clearly so the form doesn't falsely claim success.
    console.warn('[contact] EMAIL_USER/EMAIL_PASS not set — logging message instead of sending:', {
      name, email, message
    });
    return res.status(503).json({
      message: 'This site can\'t send email yet. Set EMAIL_USER and EMAIL_PASS in backend/.env, then restart the server.'
    });
  }

  try {
    await sendContactEmail({ name, email, message });
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (err) {
    console.error('[contact] Failed to send email:', err.message);
    res.status(502).json({ message: 'Could not send your message right now. Please try again shortly.' });
  }
});

module.exports = router;
