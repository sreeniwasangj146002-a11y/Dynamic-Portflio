// === backend/mailer.js ===
// Sends the contact form to your inbox using Nodemailer. Configure via
// .env — either the simple Gmail path (EMAIL_USER + EMAIL_PASS, an App
// Password — NOT your regular Gmail password) or generic SMTP
// (SMTP_HOST/SMTP_PORT/SMTP_SECURE) for any other provider.
//
// Gmail App Password (2-minute setup):
//   1. Turn on 2-Step Verification: https://myaccount.google.com/security
//   2. Create an App Password:      https://myaccount.google.com/apppasswords
//   3. Put your Gmail address in EMAIL_USER and the 16-character app
//      password (no spaces) in EMAIL_PASS.

const nodemailer = require('nodemailer');

function isConfigured() {
  return Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);
}

function createTransporter() {
  if (process.env.SMTP_HOST) {
    // Generic SMTP (any provider: Outlook, Zoho, a custom mail server, etc.)
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for port 465, false for 587/25
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
  }

  // Default: Gmail, using an App Password
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
}

async function sendContactEmail({ name, email, message }) {
  if (!isConfigured()) {
    const err = new Error(
      'Email is not configured on the server. Set EMAIL_USER and EMAIL_PASS in backend/.env, then restart the server.'
    );
    err.code = 'EMAIL_NOT_CONFIGURED';
    throw err;
  }

  const transporter = createTransporter();
  const to = process.env.EMAIL_TO || process.env.EMAIL_USER;

  await transporter.sendMail({
    from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
    to,
    replyTo: email,
    subject: `New portfolio message from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
    html: `
      <div style="font-family: sans-serif; font-size: 14px; color: #1c2233;">
        <p><strong>From:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
      </div>
    `
  });
}

function escapeHtml(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

module.exports = { sendContactEmail, isConfigured };
