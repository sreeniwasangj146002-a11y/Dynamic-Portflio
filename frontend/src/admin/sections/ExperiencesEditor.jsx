// === src/admin/sections/ExperiencesEditor.jsx ===
import { useEffect, useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import api from '../../api/api';
import { StatusBanner, StringListField } from './shared';

function ExperienceCard({ exp, onSaved, onDeleted }) {
  const [draft, setDraft] = useState(exp);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [status, setStatus] = useState(null);

  const field = (key) => (e) => setDraft({ ...draft, [key]: e.target.value });

  const save = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const res = await api.put(`/api/experiences/${draft.id}`, draft);
      setDraft(res.data);
      onSaved(res.data);
      setStatus({ type: 'success', text: 'Saved.' });
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || 'Could not save.' });
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete "${draft.company}"? This can't be undone.`)) return;
    setDeleting(true);
    try {
      await api.delete(`/api/experiences/${draft.id}`);
      onDeleted(draft.id);
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || 'Could not delete.' });
      setDeleting(false);
    }
  };

  return (
    <div className="admin-card panel-card">
      <div className="admin-card-head">
        <input className="admin-card-title-input" value={draft.company} placeholder="Company name" onChange={field('company')} />
        <button type="button" className="admin-icon-btn" onClick={remove} disabled={deleting} aria-label="Delete experience">
          <FiTrash2 size={15} />
        </button>
      </div>

      <StatusBanner status={status} />

      <div className="admin-grid-2">
        <label className="admin-field">
          <span>Role / title</span>
          <input value={draft.role} onChange={field('role')} placeholder="e.g. Software Developer (MERN)" />
        </label>
        <label className="admin-field">
          <span>Location</span>
          <input value={draft.location} onChange={field('location')} placeholder="City, Country" />
        </label>
        <label className="admin-field">
          <span>Start date</span>
          <input value={draft.startDate} onChange={field('startDate')} placeholder="e.g. June 2025" />
        </label>
        <label className="admin-field">
          <span>End date</span>
          <input value={draft.endDate} onChange={field('endDate')} placeholder="Leave blank if current" disabled={draft.current} />
        </label>
      </div>

      <label className="admin-checkbox">
        <input type="checkbox" checked={!!draft.current} onChange={(e) => setDraft({ ...draft, current: e.target.checked })} />
        This is my current role
      </label>

      <label className="admin-field">
        <span>Description</span>
        <textarea rows={3} value={draft.description} onChange={field('description')} />
      </label>

      <StringListField
        label="Highlights (short bullet points)"
        items={draft.highlights || []}
        onChange={(highlights) => setDraft({ ...draft, highlights })}
        placeholder="e.g. Built role-based JWT authentication from scratch"
      />

      <button type="button" className="btn btn-primary" disabled={saving} onClick={save}>
        {saving ? 'Saving…' : 'Save experience'}
      </button>
    </div>
  );
}

export default function ExperiencesEditor() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const load = () => api.get('/api/experiences').then((res) => setExperiences(res.data));

  useEffect(() => {
    load().then(() => setLoading(false));
  }, []);

  const createExp = async () => {
    setCreating(true);
    try {
      const res = await api.post('/api/experiences', { company: 'New company' });
      setExperiences([...experiences, res.data]);
    } finally {
      setCreating(false);
    }
  };

  const onSaved = (updated) => setExperiences((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  const onDeleted = (id) => setExperiences((prev) => prev.filter((e) => e.id !== id));

  if (loading) return <p className="admin-loading">Loading…</p>;

  return (
    <div className="admin-panel">
      <h2>Experiences</h2>
      <p className="admin-panel-sub">Your work history — company, role, dates, and what you did there.</p>

      <button type="button" className="btn btn-primary" onClick={createExp} disabled={creating} style={{ marginBottom: 24 }}>
        <FiPlus size={14} /> {creating ? 'Adding…' : 'Add experience'}
      </button>

      {experiences.length === 0 && <p className="admin-empty-hint">No experience entries yet — click "Add experience" to create one.</p>}

      <div className="admin-card-stack">
        {experiences.map((e) => (
          <ExperienceCard key={e.id} exp={e} onSaved={onSaved} onDeleted={onDeleted} />
        ))}
      </div>
    </div>
  );
}
