// === src/admin/sections/CertificationsEditor.jsx ===
import { useEffect, useState } from 'react';
import { FiPlus, FiTrash2, FiUploadCloud } from 'react-icons/fi';
import api, { fileUrl } from '../../api/api';
import { StatusBanner } from './shared';

function CertCard({ cert, onSaved, onDeleted }) {
  const [draft, setDraft] = useState(cert);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);

  const field = (key) => (e) => setDraft({ ...draft, [key]: e.target.value });

  const save = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const res = await api.put(`/api/certifications/${draft.id}`, draft);
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
      await api.delete(`/api/certifications/${draft.id}`);
      onDeleted(draft.id);
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || 'Could not delete.' });
      setDeleting(false);
    }
  };

  const uploadFile = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post(`/api/certifications/${draft.id}/file`, formData);
      setDraft(res.data);
      onSaved(res.data);
      setFile(null);
      setStatus({ type: 'success', text: 'Certificate file uploaded.' });
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || 'Upload failed.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-card panel-card">
      <div className="admin-card-head">
        <input className="admin-card-title-input" value={draft.title} placeholder="Certificate title" onChange={field('title')} />
        <button type="button" className="admin-icon-btn" onClick={remove} disabled={deleting} aria-label="Delete certificate">
          <FiTrash2 size={15} />
        </button>
      </div>

      <StatusBanner status={status} />

      <div className="admin-grid-2">
        <label className="admin-field">
          <span>Issuer</span>
          <input value={draft.issuer} placeholder="e.g. Anthropic" onChange={field('issuer')} />
        </label>
        <label className="admin-field">
          <span>Date</span>
          <input value={draft.date} placeholder="e.g. April 2026" onChange={field('date')} />
        </label>
      </div>

      <div className="admin-upload-row">
        <div className="admin-upload-preview admin-upload-preview-sm panel-card">
          {draft.file ? (
            draft.file.toLowerCase().endsWith('.pdf') ? (
              <span className="admin-upload-placeholder">PDF</span>
            ) : (
              <img src={fileUrl(draft.file)} alt={draft.title} />
            )
          ) : (
            <span className="admin-upload-placeholder">No file</span>
          )}
        </div>
        <div className="admin-upload-controls">
          <input type="file" accept="image/*,application/pdf" onChange={(e) => setFile(e.target.files[0])} />
          <button type="button" className="btn" disabled={!file || uploading} onClick={uploadFile}>
            <FiUploadCloud size={14} /> {uploading ? 'Uploading…' : 'Upload certificate file'}
          </button>
          {draft.file && (
            <a className="admin-inline-link" href={fileUrl(draft.file)} target="_blank" rel="noreferrer">
              View current file ↗
            </a>
          )}
        </div>
      </div>

      <button type="button" className="btn btn-primary" disabled={saving} onClick={save}>
        {saving ? 'Saving…' : 'Save certificate'}
      </button>
    </div>
  );
}

export default function CertificationsEditor() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const load = () => api.get('/api/certifications').then((res) => setCerts(res.data));

  useEffect(() => {
    load().then(() => setLoading(false));
  }, []);

  const createCert = async () => {
    setCreating(true);
    try {
      const res = await api.post('/api/certifications', { title: 'New certificate' });
      setCerts([...certs, res.data]);
    } finally {
      setCreating(false);
    }
  };

  const onSaved = (updated) => setCerts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  const onDeleted = (id) => setCerts((prev) => prev.filter((c) => c.id !== id));

  if (loading) return <p className="admin-loading">Loading…</p>;

  return (
    <div className="admin-panel">
      <h2>Certificates</h2>
      <p className="admin-panel-sub">Add or update certifications, and upload the certificate image or PDF for each.</p>

      <button type="button" className="btn btn-primary" onClick={createCert} disabled={creating} style={{ marginBottom: 24 }}>
        <FiPlus size={14} /> {creating ? 'Adding…' : 'Add certificate'}
      </button>

      {certs.length === 0 && <p className="admin-empty-hint">No certificates yet — click "Add certificate" to create your first one.</p>}

      <div className="admin-card-stack">
        {certs.map((c) => (
          <CertCard key={c.id} cert={c} onSaved={onSaved} onDeleted={onDeleted} />
        ))}
      </div>
    </div>
  );
}
