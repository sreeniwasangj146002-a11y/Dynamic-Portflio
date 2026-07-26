// === src/admin/AdminLogin.jsx ===
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import { useAuth } from './AuthContext';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-screen">
      <form className="admin-login-card panel-card fade-up" onSubmit={handleSubmit}>
        <span className="icon-badge admin-login-icon">
          <FiLock size={18} />
        </span>
        <span className="module-code">Admin access</span>
        <h1>Console login</h1>
        <p className="admin-login-sub">Sign in to edit the site — hero, projects, certificates, everything.</p>

        <label className="admin-field">
          <span>Username</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoFocus
            required
          />
        </label>

        <label className="admin-field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {error && <div className="admin-error">{error}</div>}

        <button className="btn btn-primary admin-login-btn" type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
