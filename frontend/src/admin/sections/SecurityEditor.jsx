// === src/admin/sections/SecurityEditor.jsx ===
import { useState } from 'react';
import api from '../../api/api';
import { StatusBanner } from './shared';

export default function SecurityEditor() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    setSaving(true);
    try {
      await api.post('/api/auth/change-password', { currentPassword, newPassword });
      setStatus({ type: 'success', text: 'Password changed. Use it next time you log in.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || 'Could not change password.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-panel">
      <h2>Security</h2>
      <p className="admin-panel-sub">Change the password used to log in to this admin panel.</p>
      <StatusBanner status={status} />

      <form onSubmit={submit} className="admin-password-form">
        <label className="admin-field">
          <span>Current password</span>
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
        </label>
        <label className="admin-field">
          <span>New password</span>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={6} required />
        </label>
        <label className="admin-field">
          <span>Confirm new password</span>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} minLength={6} required />
        </label>
        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </div>
  );
}
