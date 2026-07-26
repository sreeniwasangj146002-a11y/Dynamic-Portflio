// === src/components/Contact.jsx ===
import { useState } from 'react';
import { FiMail, FiMapPin, FiPhone, FiSend, FiGithub, FiLinkedin } from 'react-icons/fi';
import api from '../api/api';

export default function Contact({ contact, hero }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  const field = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);
    try {
      await api.post('/api/contact', form);
      setStatus({ type: 'success', text: "Message sent — I'll get back to you soon." });
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || 'Could not send. Try again shortly.' });
    } finally {
      setSending(false);
    }
  };

  const hasContact = contact?.email || contact?.phone || contact?.location || hero?.socials?.github || hero?.socials?.linkedin;

  return (
    <section id="contact" className="section">
      <div className="container">
        <div className="section-head">
          <span className="icon-badge icon-badge-blue">
            <FiMail size={18} />
          </span>
          <div className="section-head-text">
            <span className="module-code">Contact</span>
            <h2 className="section-title">Let's talk</h2>
            {contact?.availability && <p className="section-sub">{contact.availability}</p>}
          </div>
        </div>

        <div className="contact-grid">
          <div className="panel-card contact-info">
            {hasContact ? (
              <>
                {contact.email && (
                  <a className="contact-info-row" href={`mailto:${contact.email}`}>
                    <span className="icon-badge icon-badge-sm"><FiMail size={14} /></span> {contact.email}
                  </a>
                )}
                {contact.phone && (
                  <a className="contact-info-row" href={`tel:${contact.phone}`}>
                    <span className="icon-badge icon-badge-sm icon-badge-orange"><FiPhone size={14} /></span> {contact.phone}
                  </a>
                )}
                {contact.location && (
                  <span className="contact-info-row">
                    <span className="icon-badge icon-badge-sm icon-badge-blue"><FiMapPin size={14} /></span> {contact.location}
                  </span>
                )}
                {hero?.socials?.linkedin && (
                  <a className="contact-info-row" href={hero.socials.linkedin} target="_blank" rel="noreferrer">
                    <span className="icon-badge icon-badge-sm icon-badge-pink"><FiLinkedin size={14} /></span> LinkedIn
                  </a>
                )}
                {hero?.socials?.github && (
                  <a className="contact-info-row" href={hero.socials.github} target="_blank" rel="noreferrer">
                    <span className="icon-badge icon-badge-sm"><FiGithub size={14} /></span> GitHub
                  </a>
                )}
              </>
            ) : (
              <div className="empty-note">// contact info not configured yet</div>
            )}
          </div>

          <form className="panel-card contact-form" onSubmit={submit}>
            <label className="form-field">
              <span>Name</span>
              <input value={form.name} onChange={field('name')} required />
            </label>
            <label className="form-field">
              <span>Email</span>
              <input type="email" value={form.email} onChange={field('email')} required />
            </label>
            <label className="form-field">
              <span>Message</span>
              <textarea rows={4} value={form.message} onChange={field('message')} required />
            </label>

            {status && <div className={`status-banner status-${status.type}`}>{status.text}</div>}

            <button className="btn btn-primary" type="submit" disabled={sending}>
              {sending ? 'Sending…' : (
                <>
                  <FiSend size={14} /> Send message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
