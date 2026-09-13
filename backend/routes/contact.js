const express = require('express');
const { nanoid } = require('nanoid');
const { sendContactEmail, isConfigured } = require('../mailer');
const { readDB, writeDB } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) return res.status(400).json({ message: 'Name, email, and message are all required.' });

  const db = readDB();
  db.messages = Array.isArray(db.messages) ? db.messages : [];
  const saved = { id: nanoid(10), name: String(name).slice(0,100), email: String(email).slice(0,160), message: String(message).slice(0,4000), status: 'new', createdAt: new Date().toISOString() };
  db.messages.unshift(saved); writeDB(db);

  if (isConfigured()) {
    try { await sendContactEmail({ name, email, message }); }
    catch (err) { console.error('[contact] Email failed, but message was saved:', err.message); }
  }
  res.status(201).json({ message: 'Message received successfully!' });
});

router.get('/', requireAuth, (req,res) => { const db=readDB(); res.json(db.messages || []); });
router.put('/:id', requireAuth, (req,res) => { const db=readDB(); const i=(db.messages||[]).findIndex(m=>m.id===req.params.id); if(i<0)return res.status(404).json({message:'Message not found.'}); db.messages[i]={...db.messages[i], status:req.body.status || db.messages[i].status}; writeDB(db); res.json(db.messages[i]); });
router.delete('/:id', requireAuth, (req,res) => { const db=readDB(); const before=(db.messages||[]).length; db.messages=(db.messages||[]).filter(m=>m.id!==req.params.id); if(db.messages.length===before)return res.status(404).json({message:'Message not found.'}); writeDB(db); res.json({message:'Deleted.'}); });

module.exports = router;
