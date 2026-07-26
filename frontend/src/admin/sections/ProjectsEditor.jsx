// === src/admin/sections/ProjectsEditor.jsx ===
import { useEffect, useState } from 'react';
import { FiPlus, FiTrash2, FiUploadCloud, FiX } from 'react-icons/fi';
import api, { fileUrl } from '../../api/api';
import { StatusBanner } from './shared';

function ProjectCard({ project, onSaved, onDeleted }) {
  const [draft, setDraft] = useState(project);
  const [techInput, setTechInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);

  const field = (key) => (e) => setDraft({ ...draft, [key]: e.target.value });

  const addTech = () => {
    const val = techInput.trim();
    if (!val) return;
    setDraft({ ...draft, tech: [...(draft.tech || []), val] });
    setTechInput('');
  };
  const removeTech = (i) => setDraft({ ...draft, tech: draft.tech.filter((_, idx) => idx !== i) });

  const save = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const res = await api.put(`/api/projects/${draft.id}`, draft);
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
    if (!window.confirm(`Delete "${draft.title}"? This can't be undone.`)) return;
    setDeleting(true);
    try {
      await api.delete(`/api/projects/${draft.id}`);
      onDeleted(draft.id);
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || 'Could not delete.' });
      setDeleting(false);
    }
  };

  const uploadImage = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post(`/api/projects/${draft.id}/image`, formData);
      setDraft(res.data);
      onSaved(res.data);
      setFile(null);
      setStatus({ type: 'success', text: 'Image uploaded.' });
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || 'Upload failed.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-card panel-card">
      <div className="admin-card-head">
        <input className="admin-card-title-input" value={draft.title} placeholder="Project title" onChange={field('title')} />
        <button type="button" className="admin-icon-btn" onClick={remove} disabled={deleting} aria-label="Delete project">
          <FiTrash2 size={15} />
        </button>
      </div>

      <StatusBanner status={status} />

      <div className="admin-grid-2">
        <label className="admin-field">
          <span>Role</span>
          <input value={draft.role} placeholder="e.g. Full-Stack Developer" onChange={field('role')} />
        </label>
        <label className="admin-field">
          <span>Link (optional)</span>
          <input value={draft.link} placeholder="https://…" onChange={field('link')} />
        </label>
      </div>

      <label className="admin-field">
        <span>Description</span>
        <textarea rows={4} value={draft.description} onChange={field('description')} />
      </label>

      <div className="admin-field-group">
        <span className="admin-field-label">Tech stack</span>
        <div className="admin-tag-row">
          {(draft.tech || []).map((t, i) => (
            <span className="pill admin-tag-pill" key={i}>
              {t}
              <button type="button" onClick={() => removeTech(i)} aria-label="Remove tag">
                <FiX size={12} />
              </button>
            </span>
          ))}
        </div>
        <div className="admin-tag-add">
          <input
            placeholder="Add a technology and press Enter"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTech();
              }
            }}
          />
          <button type="button" className="btn" onClick={addTech}>
            <FiPlus size={14} /> Add
          </button>
        </div>
      </div>

      <div className="admin-upload-row">
        <div className="admin-upload-preview admin-upload-preview-sm panel-card">
          {draft.image ? <img src={fileUrl(draft.image)} alt={draft.title} /> : <span className="admin-upload-placeholder">No image</span>}
        </div>
        <div className="admin-upload-controls">
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
          <button type="button" className="btn" disabled={!file || uploading} onClick={uploadImage}>
            <FiUploadCloud size={14} /> {uploading ? 'Uploading…' : 'Upload cover image'}
          </button>
        </div>
      </div>

      <label className="admin-checkbox">
        <input type="checkbox" checked={!!draft.featured} onChange={(e) => setDraft({ ...draft, featured: e.target.checked })} />
        Feature this project (shown larger, first)
      </label>

      <button type="button" className="btn btn-primary" disabled={saving} onClick={save}>
        {saving ? 'Saving…' : 'Save project'}
      </button>
    </div>
  );
}

export default function ProjectsEditor({ category, heading, subheading }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const load = () =>
    api.get('/api/projects').then((res) => setProjects(res.data.filter((p) => (p.category || 'personal') === category)));

  useEffect(() => {
    setLoading(true);
    load().then(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const createProject = async () => {
    setCreating(true);
    try {
      const res = await api.post('/api/projects', { title: 'New project', category });
      setProjects([...projects, res.data]);
    } finally {
      setCreating(false);
    }
  };

  const onSaved = (updated) => setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  const onDeleted = (id) => setProjects((prev) => prev.filter((p) => p.id !== id));

  if (loading) return <p className="admin-loading">Loading…</p>;

  return (
    <div className="admin-panel">
      <h2>{heading}</h2>
      <p className="admin-panel-sub">{subheading} Each project saves independently.</p>

      <button type="button" className="btn btn-primary" onClick={createProject} disabled={creating} style={{ marginBottom: 24 }}>
        <FiPlus size={14} /> {creating ? 'Adding…' : 'Add project'}
      </button>

      {projects.length === 0 && <p className="admin-empty-hint">No projects yet — click "Add project" to create your first one.</p>}

      <div className="admin-card-stack">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} onSaved={onSaved} onDeleted={onDeleted} />
        ))}
      </div>
    </div>
  );
}
