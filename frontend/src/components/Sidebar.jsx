// === src/components/Sidebar.jsx ===
import { useEffect, useState } from 'react';
import {
  FiHome, FiUser, FiCpu, FiBriefcase, FiFolder, FiMail,
  FiSun, FiMoon, FiGithub, FiLinkedin, FiTwitter, FiCode
} from 'react-icons/fi';
import { useTheme } from '../theme/ThemeContext';

const NAV = [
  { id: 'home', label: 'Home', icon: FiHome },
  { id: 'about', label: 'About', icon: FiUser },
  { id: 'stack', label: 'Skills', icon: FiCpu },
  { id: 'work', label: 'Projects', icon: FiFolder },
  { id: 'experience', label: 'Experience', icon: FiBriefcase },
  { id: 'contact', label: 'Contact', icon: FiMail }
];

export default function Sidebar({ hero }) {
  const { theme, toggleTheme } = useTheme();
  const [active, setActive] = useState('home');

  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(Boolean);
    if (sections.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <aside className="sidebar">
      <button className="sidebar-logo" onClick={() => go('home')} aria-label="Home">
        <FiCode size={20} />
      </button>

      <nav className="sidebar-nav">
        {NAV.map((n) => (
          <button
            key={n.id}
            className={`sidebar-nav-item ${active === n.id ? 'active' : ''}`}
            onClick={() => go(n.id)}
            title={n.label}
          >
            <n.icon size={19} />
            <span className="sidebar-tooltip">{n.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        {hero?.socials?.github && (
          <a href={hero.socials.github} target="_blank" rel="noreferrer" className="sidebar-social" aria-label="GitHub">
            <FiGithub size={17} />
          </a>
        )}
        {hero?.socials?.linkedin && (
          <a href={hero.socials.linkedin} target="_blank" rel="noreferrer" className="sidebar-social" aria-label="LinkedIn">
            <FiLinkedin size={17} />
          </a>
        )}
        {hero?.socials?.twitter && (
          <a href={hero.socials.twitter} target="_blank" rel="noreferrer" className="sidebar-social" aria-label="Twitter">
            <FiTwitter size={17} />
          </a>
        )}
        <button className="sidebar-theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? <FiMoon size={17} /> : <FiSun size={17} />}
        </button>
      </div>
    </aside>
  );
}
