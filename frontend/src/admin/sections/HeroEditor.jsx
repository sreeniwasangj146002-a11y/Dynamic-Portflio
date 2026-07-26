// === src/admin/sections/HeroEditor.jsx ===
import { useEffect, useState } from 'react';
import { FiPlus, FiTrash2, FiUploadCloud } from 'react-icons/fi';
import api, { fileUrl } from '../../api/api';
import { StatusBanner } from './shared';

const EMPTY = {
  name: '',
  title: '',
  tagline: '',
  location: '',
  photo: '',
  resumeUrl: '',
  stats: [],
  socials: { email: '', phone: '', linkedin: '', github: '', twitter: '' }
};

export default function HeroEditor() {
  const [hero, setHero] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  useEffect(() => {
    api.get('/api/content').then((res) => {
      setHero({ ...EMPTY, ...res.data.hero, socials: { ...EMPTY.socials, ...res.data.hero?.socials } });
      setLoading(false);
    });
  }, []);

  const field = (key) => (e) => setHero({ ...hero, [key]: e.target.value });
  const socialField = (key) => (e) => setHero({ ...hero, socials: { ...hero.socials, [key]: e.target.value } });

  const updateStat = (i, key, value) => {
    const stats = [...hero.stats];
    stats[i] = { ...stats[i], [key]: value };
    setHero({ ...hero, stats });
  };
  const addStat = () => setHero({ ...hero, stats: [...hero.stats, { label: '', value: '' }] });
  const removeStat = (i) => setHero({ ...hero, stats: hero.stats.filter((_, idx) => idx !== i) });

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      await api.put('/api/content/hero', hero);
      setStatus({ type: 'success', text: 'Hero section saved.' });
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || 'Could not save.' });
    } finally {
      setSaving(false);
    }
  };

  const uploadPhoto = async () => {
    if (!photoFile) return;
    setUploadingPhoto(true);
    setStatus(null);
    try {
      const formData = new FormData();
      formData.append('photo', photoFile);
      const res = await api.post('/api/upload/photo', formData);
      setHero({ ...hero, photo: res.data.photo });
      setPhotoFile(null);
      setStatus({ type: 'success', text: 'Photo uploaded.' });
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || 'Photo upload failed.' });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const uploadResume = async () => {
    if (!resumeFile) return;
    setUploadingResume(true);
    setStatus(null);
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      const res = await api.post('/api/upload/resume', formData);
      setHero({ ...hero, resumeUrl: res.data.resumeUrl });
      setResumeFile(null);
      setStatus({ type: 'success', text: 'Resume uploaded.' });
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || 'Resume upload failed.' });
    } finally {
      setUploadingResume(false);
    }
  };

  if (loading) return <p className="admin-loading">Loading…</p>;

  return (
    <div className="admin-panel">
      <h2>Hero &amp; header</h2>
      <p className="admin-panel-sub">This is the first thing a visitor sees — your name, title, tagline, and profile photo.</p>
      <StatusBanner status={status} />

      <div className="admin-upload-row">
        <div className="admin-upload-preview panel-card">
          {hero.photo ? <img src={fileUrl(hero.photo)} alt="Profile" /> : <span className="admin-upload-placeholder">No photo</span>}
        </div>
        <div className="admin-upload-controls">
          <label className="admin-field-label">Profile photo</label>
          <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} />
          <button type="button" className="btn" disabled={!photoFile || uploadingPhoto} onClick={uploadPhoto}>
            <FiUploadCloud size={14} /> {uploadingPhoto ? 'Uploading…' : 'Upload photo'}
          </button>
        </div>
        <div className="admin-upload-controls">
          <label className="admin-field-label">Resume (PDF)</label>
          <input type="file" accept="application/pdf" onChange={(e) => setResumeFile(e.target.files[0])} />
          <button type="button" className="btn" disabled={!resumeFile || uploadingResume} onClick={uploadResume}>
            <FiUploadCloud size={14} /> {uploadingResume ? 'Uploading…' : 'Upload resume'}
          </button>
          {hero.resumeUrl && <a className="admin-inline-link" href={fileUrl(hero.resumeUrl)} target="_blank" rel="noreferrer">View current resume ↗</a>}
        </div>
      </div>

      <form onSubmit={save}>
        <div className="admin-grid-2">
          <label className="admin-field">
            <span>Full name</span>
            <input value={hero.name} onChange={field('name')} placeholder="e.g. Sreeniwasan G J" />
          </label>
          <label className="admin-field">
            <span>Title / role</span>
            <input value={hero.title} onChange={field('title')} placeholder="e.g. Full-Stack Developer (MERN)" />
          </label>
        </div>

        <label className="admin-field">
          <span>Tagline</span>
          <textarea rows={3} value={hero.tagline} onChange={field('tagline')} placeholder="One or two sentences that sum up what you do." />
        </label>

        <label className="admin-field">
          <span>Location</span>
          <input value={hero.location} onChange={field('location')} placeholder="City, State, Country" />
        </label>

        <div className="admin-field-group">
          <span className="admin-field-label">Stats (shown as small readouts in the hero)</span>
          {hero.stats.length === 0 && <p className="admin-empty-hint">e.g. "1+" / "Years experience"</p>}
          {hero.stats.map((s, i) => (
            <div className="admin-list-row admin-stat-row" key={i}>
              <input placeholder="Value (e.g. 1+)" value={s.value} onChange={(e) => updateStat(i, 'value', e.target.value)} />
              <input placeholder="Label (e.g. Years experience)" value={s.label} onChange={(e) => updateStat(i, 'label', e.target.value)} />
              <button type="button" className="admin-icon-btn" onClick={() => removeStat(i)} aria-label="Remove">
                <FiTrash2 size={15} />
              </button>
            </div>
          ))}
          <button type="button" className="admin-add-btn" onClick={addStat}>
            <FiPlus size={14} /> Add stat
          </button>
        </div>

        <div className="admin-field-group">
          <span className="admin-field-label">Contact links</span>
          <div className="admin-grid-2">
            <label className="admin-field">
              <span>Email</span>
              <input value={hero.socials.email} onChange={socialField('email')} placeholder="you@example.com" />
            </label>
            <label className="admin-field">
              <span>Phone</span>
              <input value={hero.socials.phone} onChange={socialField('phone')} placeholder="+91 ..." />
            </label>
            <label className="admin-field">
              <span>LinkedIn URL</span>
              <input value={hero.socials.linkedin} onChange={socialField('linkedin')} placeholder="https://linkedin.com/in/..." />
            </label>
            <label className="admin-field">
              <span>GitHub URL</span>
              <input value={hero.socials.github} onChange={socialField('github')} placeholder="https://github.com/..." />
            </label>
            <label className="admin-field">
              <span>Twitter / X URL</span>
              <input value={hero.socials.twitter} onChange={socialField('twitter')} placeholder="https://x.com/..." />
            </label>
          </div>
        </div>

        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save hero section'}
        </button>
      </form>
    </div>
  );
}
