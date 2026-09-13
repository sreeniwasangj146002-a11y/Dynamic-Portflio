import { useState } from 'react';
import { FiCode, FiDownload, FiMenu, FiX } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import api, { fileUrl } from '../api/api';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/#about', label: 'About' },
  { to: '/#stack', label: 'Skills' },
  { to: '/projects', label: 'Projects' },
  { to: '/experience', label: 'Experience' },
  { to: '/contact', label: 'Contact' }
];

export default function Navbar({ name, resumeUrl }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const go = (to) => {
    setOpen(false);
    if (to.startsWith('/#')) {
      const id = to.slice(2);
      if (location.pathname === '/') {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        navigate(`/#${id}`);
      }
      return;
    }
    navigate(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isActive = (to) => to === '/' ? location.pathname === '/' : !to.includes('#') && location.pathname.startsWith(to);

  return (
    <header className="portfolio-navbar">
      <div className="portfolio-navbar-inner">
        <button className="portfolio-brand" onClick={() => go('/')} aria-label="Go to home">
          <span className="portfolio-brand-icon"><FiCode /></span>
          <span>{name || 'Portfolio'}</span>
        </button>

        <nav className="portfolio-nav-links" aria-label="Primary navigation">
          {LINKS.map((link) => (
            <button key={link.to} className={`portfolio-nav-link ${isActive(link.to) ? 'active' : ''}`} onClick={() => go(link.to)}>
              {link.label}
            </button>
          ))}
        </nav>

        <div className="portfolio-nav-actions">
          {resumeUrl && (
            <a className="portfolio-outline-btn portfolio-resume-btn" href={fileUrl(resumeUrl)} target="_blank" rel="noreferrer" onClick={() => api.post('/api/analytics/track', { event: 'cv_download' }).catch(() => {})}>
              <FiDownload /> Download CV
            </a>
          )}
          <button className="portfolio-menu-btn" onClick={() => setOpen((v) => !v)} aria-label="Toggle navigation">{open ? <FiX /> : <FiMenu />}</button>
        </div>
      </div>

      {open && (
        <div className="portfolio-mobile-menu">
          {LINKS.map((link) => <button key={link.to} className={isActive(link.to) ? 'active' : ''} onClick={() => go(link.to)}>{link.label}</button>)}
          {resumeUrl && <a href={fileUrl(resumeUrl)} target="_blank" rel="noreferrer"><FiDownload /> Download CV</a>}
        </div>
      )}
    </header>
  );
}
