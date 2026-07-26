// === src/admin/sections/SkillsEditor.jsx ===
import { useEffect, useState } from 'react';
import { FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import api from '../../api/api';
import { StatusBanner } from './shared';

export default function SkillsEditor() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const [tagDrafts, setTagDrafts] = useState({});

  useEffect(() => {
    api.get('/api/content').then((res) => {
      setCategories(res.data.skills?.categories || []);
      setLoading(false);
    });
  }, []);

  const updateName = (i, name) => {
    const next = [...categories];
    next[i] = { ...next[i], name };
    setCategories(next);
  };
  const addCategory = () => setCategories([...categories, { name: '', tags: [] }]);
  const removeCategory = (i) => setCategories(categories.filter((_, idx) => idx !== i));

  const addTag = (i) => {
    const draft = (tagDrafts[i] || '').trim();
    if (!draft) return;
    const next = [...categories];
    next[i] = { ...next[i], tags: [...next[i].tags, draft] };
    setCategories(next);
    setTagDrafts({ ...tagDrafts, [i]: '' });
  };
  const removeTag = (i, tagIdx) => {
    const next = [...categories];
    next[i] = { ...next[i], tags: next[i].tags.filter((_, idx) => idx !== tagIdx) };
    setCategories(next);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      await api.put('/api/content/skills', { categories });
      setStatus({ type: 'success', text: 'Skills saved.' });
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || 'Could not save.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="admin-loading">Loading…</p>;

  return (
    <div className="admin-panel">
      <h2>Skills</h2>
      <p className="admin-panel-sub">Group your skills into categories (e.g. Frontend, Backend, Integrations) with tags in each.</p>
      <StatusBanner status={status} />

      <form onSubmit={save}>
        {categories.length === 0 && <p className="admin-empty-hint">No categories yet — add one below.</p>}
        {categories.map((cat, i) => (
          <div className="admin-skill-card panel-card" key={i}>
            <div className="admin-skill-card-head">
              <input
                className="admin-skill-name-input"
                value={cat.name}
                placeholder="Category name (e.g. Frontend)"
                onChange={(e) => updateName(i, e.target.value)}
              />
              <button type="button" className="admin-icon-btn" onClick={() => removeCategory(i)} aria-label="Remove category">
                <FiTrash2 size={15} />
              </button>
            </div>

            <div className="admin-tag-row">
              {cat.tags.map((tag, tIdx) => (
                <span className="pill admin-tag-pill" key={tIdx}>
                  {tag}
                  <button type="button" onClick={() => removeTag(i, tIdx)} aria-label="Remove tag">
                    <FiX size={12} />
                  </button>
                </span>
              ))}
            </div>

            <div className="admin-tag-add">
              <input
                placeholder="Add a skill and press Enter"
                value={tagDrafts[i] || ''}
                onChange={(e) => setTagDrafts({ ...tagDrafts, [i]: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag(i);
                  }
                }}
              />
              <button type="button" className="btn" onClick={() => addTag(i)}>
                <FiPlus size={14} /> Add
              </button>
            </div>
          </div>
        ))}

        <button type="button" className="admin-add-btn" onClick={addCategory}>
          <FiPlus size={14} /> Add category
        </button>

        <div style={{ marginTop: 24 }}>
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save skills'}
          </button>
        </div>
      </form>
    </div>
  );
}
