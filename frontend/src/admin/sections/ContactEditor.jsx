// === src/admin/sections/ContactEditor.jsx ===
import { useEffect, useState } from 'react';
import api from '../../api/api';
import { StatusBanner } from './shared';

const EMPTY = { email: '', phone: '', location: '', availability: '' };

export default function ContactEditor() {
  const [contact, setContact] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    api.get('/api/content').then((res) => {
      setContact({ ...EMPTY, ...res.data.contact });
      setLoading(false);
    });
  }, []);

  const field = (key) => (e) => setContact({ ...contact, [key]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      await api.put('/api/content/contact', contact);
      setStatus({ type: 'success', text: 'Contact info saved.' });
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || 'Could not save.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="admin-loading">Loading…</p>;

  return (
    <div className="admin-panel">
      <h2>Contact</h2>
      <p className="admin-panel-sub">Shown in the Contact section of the public site.</p>
      <StatusBanner status={status} />

      <form onSubmit={save}>
        <div className="admin-grid-2">
          <label className="admin-field">
            <span>Email</span>
            <input value={contact.email} onChange={field('email')} placeholder="you@example.com" />
          </label>
          <label className="admin-field">
            <span>Phone</span>
            <input value={contact.phone} onChange={field('phone')} placeholder="+91 ..." />
          </label>
          <label className="admin-field">
            <span>Location</span>
            <input value={contact.location} onChange={field('location')} placeholder="City, State, Country" />
          </label>
          <label className="admin-field">
            <span>Availability note</span>
            <input value={contact.availability} onChange={field('availability')} placeholder="e.g. Open to new opportunities" />
          </label>
        </div>

        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save contact info'}
        </button>
      </form>
    </div>
  );
}
