// === src/admin/AuthContext.js ===
import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));
  const [username, setUsername] = useState(() => localStorage.getItem('admin_username') || '');

  const login = useCallback(async (usernameInput, password) => {
    const res = await api.post('/api/auth/login', { username: usernameInput, password });
    localStorage.setItem('admin_token', res.data.token);
    localStorage.setItem('admin_username', res.data.username);
    setToken(res.data.token);
    setUsername(res.data.username);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    setToken(null);
    setUsername('');
  }, []);

  return (
    <AuthContext.Provider value={{ token, username, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
