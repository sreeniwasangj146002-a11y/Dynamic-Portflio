// === src/components/Navbar.jsx ===
import { useEffect, useState } from 'react';
import { FiMenu, FiX, FiHome, FiUser, FiCpu, FiBriefcase, FiFolder, FiMail, FiDownload, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../theme/ThemeContext';
import { fileUrl } from '../api/api';

const LINKS = [
  { id: 'home', label: 'Home', icon: FiHome },
  { id: 'about', label: 'About', icon: FiUser },
  { id: 'stack', label: 'Skills', icon: FiCpu },
  { id: 'work', label: 'Projects', icon: FiFolder },
  { id: 'experience', label: 'Experience', icon: FiBriefcase },
  { id: 'contact', label: 'Contact', icon: FiMail }
];

export default function Navbar({ name, title, resumeUrl }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-inner">
        <button className="navbar-wordmark" onClick={() => go('home')}>
          <span className="navbar-name">{name || 'Portfolio'}</span>
          {title && <span className="navbar-role">{title}</span>}
        </button>

        <nav className="navbar-links">
          {LINKS.map((l) => (
            <button key={l.id} className="navbar-link" onClick={() => go(l.id)}>
              {l.label}
            </button>
          ))}
        </nav>

        <div className="navbar-actions">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? <FiMoon size={16} /> : <FiSun size={16} />}
          </button>
          {resumeUrl && (
            <a className="btn btn-primary navbar-resume" href={fileUrl(resumeUrl)} target="_blank" rel="noreferrer">
              <FiDownload size={14} /> Download CV
            </a>
          )}
          <button className="navbar-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="navbar-mobile">
          {LINKS.map((l) => (
            <button key={l.id} className="navbar-mobile-link" onClick={() => go(l.id)}>
              <l.icon size={15} /> {l.label}
            </button>
          ))}
          {resumeUrl && (
            <a className="btn btn-primary" href={fileUrl(resumeUrl)} target="_blank" rel="noreferrer">
              <FiDownload size={14} /> Download CV
            </a>
          )}
        </div>
      )}
    </header>
  );
}
