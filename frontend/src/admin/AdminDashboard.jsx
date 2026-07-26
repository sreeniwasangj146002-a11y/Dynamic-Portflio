// === src/admin/AdminDashboard.jsx ===
import { useState } from 'react';
import {
  FiHome, FiUser, FiCpu, FiBriefcase, FiFolder, FiFolderPlus,
  FiAward, FiMail, FiShield, FiLogOut, FiExternalLink, FiMenu, FiX, FiType
} from 'react-icons/fi';
import { useAuth } from './AuthContext';
import { useTheme } from '../theme/ThemeContext';
import HeroEditor from './sections/HeroEditor';
import AboutEditor from './sections/AboutEditor';
import SkillsEditor from './sections/SkillsEditor';
import ExperiencesEditor from './sections/ExperiencesEditor';
import ProjectsEditor from './sections/ProjectsEditor';
import CertificationsEditor from './sections/CertificationsEditor';
import ContactEditor from './sections/ContactEditor';
import AppearanceEditor from './sections/AppearanceEditor';
import SecurityEditor from './sections/SecurityEditor';

const TABS = [
  { key: 'home', label: 'Home', icon: FiHome },
  { key: 'about', label: 'About', icon: FiUser },
  { key: 'skills', label: 'Skills', icon: FiCpu },
  { key: 'experiences', label: 'Experiences', icon: FiBriefcase },
  { key: 'experience-projects', label: 'Experience Projects', icon: FiFolder },
  { key: 'personal-projects', label: 'Personal Projects', icon: FiFolderPlus },
  { key: 'certifications', label: 'Certificates', icon: FiAward },
  { key: 'contact', label: 'Contact', icon: FiMail },
  { key: 'appearance', label: 'Appearance', icon: FiType },
  { key: 'security', label: 'Security', icon: FiShield }
];

export default function AdminDashboard() {
  const { username, logout } = useAuth();
  const { theme } = useTheme();
  const [active, setActive] = useState('home');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const select = (key) => {
    setActive(key);
    setMobileNavOpen(false);
  };

  return (
    <div className="admin-shell" data-theme-context={theme}>
      <button className="admin-mobile-toggle" onClick={() => setMobileNavOpen(!mobileNavOpen)} aria-label="Toggle menu">
        {mobileNavOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      <aside className={`admin-sidebar ${mobileNavOpen ? 'admin-sidebar-open' : ''}`}>
        <div className="admin-sidebar-top">
          <div className="admin-brand">
            <span className="icon-badge">
              <FiHome size={16} />
            </span>
            <div>
              <p className="admin-brand-title">Console</p>
              <p className="admin-signed-in">Signed in as <strong>{username}</strong></p>
            </div>
          </div>
        </div>

        <nav className="admin-nav">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`admin-nav-item ${active === t.key ? 'active' : ''}`}
              onClick={() => select(t.key)}
            >
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <a className="admin-nav-item" href="/" target="_blank" rel="noreferrer">
            <FiExternalLink size={16} /> View live site
          </a>
          <button className="admin-nav-item admin-logout" onClick={logout}>
            <FiLogOut size={16} /> Log out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        {active === 'home' && <HeroEditor />}
        {active === 'about' && <AboutEditor />}
        {active === 'skills' && <SkillsEditor />}
        {active === 'experiences' && <ExperiencesEditor />}
        {active === 'experience-projects' && (
          <ProjectsEditor
            category="experience"
            heading="Experience projects"
            subheading="Projects you built as part of a job or client engagement."
          />
        )}
        {active === 'personal-projects' && (
          <ProjectsEditor
            category="personal"
            heading="Personal projects"
            subheading="Side projects, academic work, and things you built on your own time."
          />
        )}
        {active === 'certifications' && <CertificationsEditor />}
        {active === 'contact' && <ContactEditor />}
        {active === 'appearance' && <AppearanceEditor />}
        {active === 'security' && <SecurityEditor />}
      </main>
    </div>
  );
}
