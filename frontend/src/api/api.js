// === src/api/api.js ===
import axios from 'axios';

// Absolute backend URL. Defaults to http://localhost:5000 for local dev
// (works whether the frontend is run with `npm start` or served as a static
// build on a different port). Set REACT_APP_API_URL in a frontend/.env when
// deploying the backend somewhere else, e.g. https://api.yourdomain.com
export const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Uploaded files (photos, resumes, certificates, project images) come back
// from the API as relative paths like "/uploads/photos/xyz.jpg". Those only
// resolve correctly when the browser's current origin IS the backend. Since
// the frontend and backend usually run on different ports/domains, every
// <img src> / <a href> to an uploaded file must go through this helper so
// it always points at the actual backend, not wherever the page is hosted.
export function fileUrl(path) {
  if (!path) return path;
  if (/^https?:\/\//i.test(path)) return path; // already absolute
  return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
}

export default api;
