// === src/admin/sections/AboutEditor.jsx ===
import { useEffect, useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import api from '../../api/api';
import { StatusBanner, StringListField } from './shared';

const EMPTY = { bio: [], highlights: [], education: [] };

export default function AboutEditor() {
  const [about, setAbout] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    api.get('/api/content').then((res) => {
      setAbout({ ...EMPTY, ...res.data.about });
      setLoading(false);
    });
  }, []);

  const updateEdu = (i, key, value) => {
    const education = [...about.education];
    education[i] = { ...education[i], [key]: value };
    setAbout({ ...about, education });
  };
  const addEdu = () =>
    setAbout({ ...about, education: [...about.education, { degree: '', school: '', detail: '', date: '' }] });
  const removeEdu = (i) => setAbout({ ...about, education: about.education.filter((_, idx) => idx !== i) });

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      await api.put('/api/content/about', about);
      setStatus({ type: 'success', text: 'About section saved.' });
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || 'Could not save.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="admin-loading">Loading…</p>;

  return (
    <div className="admin-panel">
      <h2>About</h2>
      <p className="admin-panel-sub">Your story, in your own words, plus a highlights list and education history.</p>
      <StatusBanner status={status} />

      <form onSubmit={save}>
        <StringListField
          label="Bio paragraphs"
          items={about.bio}
          onChange={(bio) => setAbout({ ...about, bio })}
          placeholder="Write a paragraph about your background and what you work on."
          textarea
        />

        <StringListField
          label="Highlights (short bullet points)"
          items={about.highlights}
          onChange={(highlights) => setAbout({ ...about, highlights })}
          placeholder="e.g. Role-based JWT authentication built from scratch"
        />

        <div className="admin-field-group">
          <span className="admin-field-label">Education</span>
          {about.education.length === 0 && <p className="admin-empty-hint">Add your degrees / schools below.</p>}
          {about.education.map((edu, i) => (
            <div className="admin-edu-row panel-card" key={i}>
              <button type="button" className="admin-icon-btn admin-edu-remove" onClick={() => removeEdu(i)} aria-label="Remove">
                <FiTrash2 size={15} />
              </button>
              <div className="admin-grid-2">
                <label className="admin-field">
                  <span>Degree</span>
                  <input value={edu.degree} onChange={(e) => updateEdu(i, 'degree', e.target.value)} />
                </label>
                <label className="admin-field">
                  <span>School</span>
                  <input value={edu.school} onChange={(e) => updateEdu(i, 'school', e.target.value)} />
                </label>
                <label className="admin-field">
                  <span>Detail (grade / score)</span>
                  <input value={edu.detail} onChange={(e) => updateEdu(i, 'detail', e.target.value)} />
                </label>
                <label className="admin-field">
                  <span>Date</span>
                  <input value={edu.date} onChange={(e) => updateEdu(i, 'date', e.target.value)} />
                </label>
              </div>
            </div>
          ))}
          <button type="button" className="admin-add-btn" onClick={addEdu}>
            <FiPlus size={14} /> Add education entry
          </button>
        </div>

        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save about section'}
        </button>
      </form>
    </div>
  );
}
