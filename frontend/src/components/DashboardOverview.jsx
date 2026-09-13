import { useMemo } from 'react';
import api from '../api/api';
import {
  FiArrowRight,
  FiCalendar,
  FiCoffee,
  FiCode,
  FiDownload,
  FiFolder,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiMapPin,
  FiBookOpen,
  FiClock,
  FiSmile,
  FiSend,
  FiUser
} from 'react-icons/fi';
import { getProjectPath } from '../utils/projectSlug';
import { fileUrl } from '../api/api';
import { useNavigate } from 'react-router-dom';
import { getTechIcon } from '../utils/techIcons';

const statIcons = [FiCalendar, FiFolder, FiSmile, FiCoffee];
const statClasses = ['stat-blue', 'stat-green', 'stat-violet', 'stat-orange'];

const ensureUrl = (value) => {
  if (!value) return '';
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
};

function SocialRail({ socials }) {
  const links = [
    socials?.github && { href: ensureUrl(socials.github), label: 'GitHub', Icon: FiGithub },
    socials?.linkedin && { href: ensureUrl(socials.linkedin), label: 'LinkedIn', Icon: FiLinkedin },
    socials?.twitter && { href: ensureUrl(socials.twitter), label: 'Twitter', Icon: FiSend },
    socials?.email && { href: `mailto:${socials.email}`, label: 'Email', Icon: FiMail }
  ].filter(Boolean);

  if (!links.length) return null;

  return (
    <aside className="social-rail" aria-label="Social links">
      {links.map(({ href, label, Icon }) => (
        <a key={label} href={href} target={href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer" aria-label={label} title={label}>
          <Icon />
        </a>
      ))}
    </aside>
  );
}

function HeroBlock({ hero }) {
  const stats = hero?.stats || [];
  return (
    <section id="home" className="dashboard-hero">
      <div className="hero-text-panel">
        {hero?.title && (
          <div className="role-pill"><span />{hero.title}</div>
        )}
        <h1>
          <span className="hero-greeting">Hi, I'm</span>
          <span className="hero-name-line">{hero?.name || 'Your Name'}</span>
        </h1>
        <h2>{hero?.tagline ? 'Software Developer | MERN Stack' : hero?.title}</h2>
        {hero?.tagline && <p>{hero.tagline}</p>}
        <div className="hero-actions">
          <button className="portfolio-primary-btn" onClick={() => document.getElementById('work-projects')?.scrollIntoView({ behavior: 'smooth' })}>
            View My Work <FiArrowRight />
          </button>
          {hero?.socials?.email && (
            <a className="portfolio-outline-btn" href={`mailto:${hero.socials.email}`} onClick={() => api.post('/api/analytics/track', { event: 'contact_click' }).catch(() => {})}><FiSend /> Contact Me</a>
          )}
        </div>
      </div>

      <div className="hero-visual-panel">
        <div className="hero-dot-grid hero-dot-grid-left" />
        <div className="hero-dot-grid hero-dot-grid-right" />
        <div className="hero-avatar-ring">
          <div className="hero-avatar-inner">
            {hero?.photo ? (
              <img src={fileUrl(hero.photo)} alt={hero?.name || 'Profile'} />
            ) : (
              <div className="hero-avatar-fallback"><FiUser /></div>
            )}
          </div>
        </div>
      </div>

      {!!stats.length && (
        <div className="hero-stats-bar">
          {stats.slice(0, 4).map((stat, index) => {
            const Icon = statIcons[index % statIcons.length];
            return (
              <div className="hero-stat-item" key={`${stat.label}-${index}`}>
                <Icon className={statClasses[index % statClasses.length]} />
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function AboutCompact({ about, hero, contact }) {
  const education = about?.education?.[0];
  const bio = about?.bio?.[0] || '';
  return (
    <section id="about" className="dashboard-about dashboard-cell">
      <div className="dashboard-section-title"><FiUser /><h2>About Me</h2></div>
      <p className="about-summary">{bio}</p>
      <div className="about-info-list">
        <div><FiMapPin /><span>Location</span><strong>{contact?.location || hero?.location || '—'}</strong></div>
        <div><FiBookOpen /><span>Education</span><strong>{education ? `${education.degree} – ${education.school}` : '—'}</strong></div>
        <div><FiMail /><span>Email</span><strong className="link-value">{contact?.email || hero?.socials?.email || '—'}</strong></div>
        <div><FiClock /><span>Availability</span><strong className="availability-value">{contact?.availability || 'Open to Opportunities'}</strong></div>
      </div>
      {hero?.resumeUrl && (
        <a className="portfolio-outline-btn small-btn" href={fileUrl(hero.resumeUrl)} target="_blank" rel="noreferrer" onClick={() => api.post('/api/analytics/track', { event: 'cv_download' }).catch(() => {})}>
          <FiDownload /> Download CV
        </a>
      )}
    </section>
  );
}

function SkillsCompact({ skills }) {
  const flatSkills = useMemo(() => {
    const seen = new Set();
    const result = [];
    (skills?.categories || []).forEach((category) => {
      (category.tags || []).forEach((tag) => {
        const key = String(tag).toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          result.push(tag);
        }
      });
    });
    return result;
  }, [skills]);

  return (
    <section id="stack" className="dashboard-skills dashboard-cell">
      <div className="dashboard-row-heading">
        <div className="dashboard-section-title"><FiCode /><h2>Skills</h2></div>
        <button className="mini-outline-btn" onClick={() => document.getElementById('skills-details')?.scrollIntoView({ behavior: 'smooth' })}>View All</button>
      </div>
      <div className="skills-dashboard-grid">
        {flatSkills.slice(0, 10).map((tag) => {
          const { Icon, color } = getTechIcon(tag);
          return (
            <div className="skill-dashboard-card" key={tag}>
              <Icon style={{ color }} />
              <span>{tag}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ProjectVisual({ project, index }) {
  if (project.image) {
    return <img src={fileUrl(project.image)} alt={project.title} />;
  }
  return (
    <div className={`project-placeholder placeholder-${(index % 4) + 1}`}>
      <span className="placeholder-window large" />
      <span className="placeholder-window small one" />
      <span className="placeholder-window small two" />
      <span className="placeholder-window small three" />
    </div>
  );
}

function ProjectCollection({ title, eyebrow, projects, sectionId }) {
  const navigate = useNavigate();
  const visible = projects.slice(0, 4);

  return (
    <section id={sectionId} className="dashboard-projects dashboard-cell project-collection">
      <div className="dashboard-row-heading">
        <div>
          <div className="project-section-eyebrow">{eyebrow}</div>
          <div className="dashboard-section-title"><FiFolder /><h2>{title}</h2><span className="project-count">{projects.length}</span></div>
        </div>
        <button className="mini-outline-btn" onClick={() => navigate(`/projects?type=${sectionId === 'work' ? 'experience' : 'personal'}`)}>View All</button>
      </div>
      {projects.length === 0 ? (
        <div className="project-empty-state">No projects added yet.</div>
      ) : (
        <div className="projects-dashboard-grid">
          {visible.map((project, index) => (
            <article className={`project-dashboard-card ${project.featured ? 'is-featured' : ''}`} key={project.id || `${project.title}-${index}`}>
              <div className="project-dashboard-image"><ProjectVisual project={project} index={index} /></div>
              <div className="project-card-topline"><span>{project.role || 'Project'}</span>{project.featured && <b>Featured</b>}</div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-dashboard-tags">{(project.tech || []).slice(0, 3).map((tech) => <span key={tech}>{tech}</span>)}</div>
              <button className="project-card-link project-readmore-btn" onClick={() => navigate(getProjectPath(project))}>Read case study <FiArrowRight /></button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function ProjectsCompact({ projects }) {
  const workProjects = projects.filter((p) => (p.category || 'personal') === 'experience');
  const personalProjects = projects.filter((p) => (p.category || 'personal') === 'personal');

  return (
    <div id="work-projects" className="dashboard-project-groups">
      <ProjectCollection title="Work Experience Projects" eyebrow="Client & Production Work" projects={workProjects} sectionId="work" />
      <ProjectCollection title="Personal Projects" eyebrow="Academic & Independent Builds" projects={personalProjects} sectionId="personal-projects" />
    </div>
  );
}

export default function DashboardOverview({ content, projects }) {
  return (
    <main className="portfolio-dashboard-shell">
      <SocialRail socials={content?.hero?.socials} />
      <div className="portfolio-dashboard-card">
        <HeroBlock hero={content?.hero} />
        <div className="dashboard-middle-grid">
          <AboutCompact about={content?.about} hero={content?.hero} contact={content?.contact} />
          <SkillsCompact skills={content?.skills} />
        </div>
        <ProjectsCompact projects={projects || []} />
      </div>
    </main>
  );
}
