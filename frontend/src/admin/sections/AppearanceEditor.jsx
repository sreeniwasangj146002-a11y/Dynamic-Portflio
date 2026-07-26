// === src/admin/sections/AppearanceEditor.jsx ===
import { useEffect, useState } from 'react';
import { FiCheck } from 'react-icons/fi';
import api from '../../api/api';
import { StatusBanner } from './shared';
import { FONT_PRESETS, FONT_SIZE_OPTIONS, applyAppearance } from '../../utils/fontPresets';

const EMPTY = { fontPreset: 'modern', baseFontSize: 16 };

export default function AppearanceEditor() {
  const [appearance, setAppearance] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    api.get('/api/content').then((res) => {
      const next = { ...EMPTY, ...res.data.appearance };
      setAppearance(next);
      setLoading(false);
    });
  }, []);

  const choosePreset = (id) => {
    const next = { ...appearance, fontPreset: id };
    setAppearance(next);
    applyAppearance(next); // live preview on this page too
  };

  const chooseSize = (id) => {
    const next = { ...appearance, baseFontSize: id };
    setAppearance(next);
    applyAppearance(next);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      await api.put('/api/content/appearance', appearance);
      setStatus({ type: 'success', text: 'Appearance saved — the live site now uses these settings.' });
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || 'Could not save.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="admin-loading">Loading…</p>;

  return (
    <div className="admin-panel">
      <h2>Appearance</h2>
      <p className="admin-panel-sub">Choose the font style and base text size used across the public site.</p>
      <StatusBanner status={status} />

      <form onSubmit={save}>
        <div className="admin-field-group">
          <span className="admin-field-label">Font style</span>
          <div className="appearance-preset-grid">
            {FONT_PRESETS.map((p) => (
              <button
                type="button"
                key={p.id}
                className={`appearance-preset-card ${appearance.fontPreset === p.id ? 'active' : ''}`}
                onClick={() => choosePreset(p.id)}
              >
                {appearance.fontPreset === p.id && (
                  <span className="appearance-preset-check">
                    <FiCheck size={12} />
                  </span>
                )}
                <span className="appearance-preset-name" style={{ fontFamily: p.display }}>Aa</span>
                <span className="appearance-preset-label">{p.label}</span>
                <span className="appearance-preset-sample">{p.sample}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="admin-field-group">
          <span className="admin-field-label">Base text size</span>
          <div className="appearance-size-row">
            {FONT_SIZE_OPTIONS.map((s) => (
              <button
                type="button"
                key={s.id}
                className={`appearance-size-btn ${appearance.baseFontSize === s.id ? 'active' : ''}`}
                onClick={() => chooseSize(s.id)}
              >
                {s.label}
                <span className="appearance-size-px">{s.id}px</span>
              </button>
            ))}
          </div>
        </div>

        <div className="panel-card appearance-preview" style={{ fontFamily: appearance.fontPreset ? undefined : undefined }}>
          <span className="admin-field-label">Live preview</span>
          <h3 style={{ fontFamily: FONT_PRESETS.find((p) => p.id === appearance.fontPreset)?.display }}>
            The quick brown fox
          </h3>
          <p style={{ fontFamily: FONT_PRESETS.find((p) => p.id === appearance.fontPreset)?.body, color: 'var(--text-muted)' }}>
            This is how body text and paragraphs will look across your site with the selected style and size.
          </p>
        </div>

        <button className="btn btn-primary" type="submit" disabled={saving} style={{ marginTop: 20 }}>
          {saving ? 'Saving…' : 'Save appearance'}
        </button>
      </form>
    </div>
  );
}
