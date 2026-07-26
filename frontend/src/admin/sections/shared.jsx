// === src/admin/sections/shared.jsx ===
import { FiPlus, FiTrash2 } from 'react-icons/fi';

export function StatusBanner({ status }) {
  if (!status) return null;
  return <div className={`admin-status admin-status-${status.type}`}>{status.text}</div>;
}

// Editable list of plain strings (bio paragraphs, highlights, etc.)
export function StringListField({ label, items, onChange, placeholder, textarea }) {
  const update = (i, value) => {
    const next = [...items];
    next[i] = value;
    onChange(next);
  };
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, '']);

  return (
    <div className="admin-field-group">
      <span className="admin-field-label">{label}</span>
      {items.length === 0 && <p className="admin-empty-hint">Nothing here yet — add one below.</p>}
      {items.map((val, i) => (
        <div className="admin-list-row" key={i}>
          {textarea ? (
            <textarea rows={3} value={val} placeholder={placeholder} onChange={(e) => update(i, e.target.value)} />
          ) : (
            <input value={val} placeholder={placeholder} onChange={(e) => update(i, e.target.value)} />
          )}
          <button type="button" className="admin-icon-btn" onClick={() => remove(i)} aria-label="Remove">
            <FiTrash2 size={15} />
          </button>
        </div>
      ))}
      <button type="button" className="admin-add-btn" onClick={add}>
        <FiPlus size={14} /> Add
      </button>
    </div>
  );
}
