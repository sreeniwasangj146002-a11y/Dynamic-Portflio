// === src/components/Hero.jsx ===
import { FiDownload, FiMail, FiMapPin, FiCalendar, FiFolder, FiUsers, FiAward } from 'react-icons/fi';
import { fileUrl } from '../api/api';
import { getTechIcon } from '../utils/techIcons';

const STAT_ICONS = [FiCalendar, FiFolder, FiUsers, FiAward];
const BADGE_CLASSES = ['', 'icon-badge-blue', 'icon-badge-pink', 'icon-badge-orange'];

export default function Hero({ hero, skills }) {
  const hasContent = hero?.name;
  const allTags = (skills?.categories || []).flatMap((c) => c.tags || []).slice(0, 4);

  const floatPositions = ['float-tl', 'float-tr', 'float-bl', 'float-br'];

  return (
    <section id="home" className="hero">
      <div className="container hero-inner">
        <div className="hero-copy fade-up">
          {hero?.title && (
            <span className="pill pill-green hero-kicker">
              <span className="hero-kicker-dot" /> {hero.title}
            </span>
          )}

          {hasContent ? (
            <>
              <h1 className="hero-name">
                Hi, I'm <span className="gradient-text">{hero.name}</span>
              </h1>
              {hero.tagline && <p className="hero-tagline">{hero.tagline}</p>}
              {hero.location && (
                <p className="hero-location">
                  <FiMapPin size={14} /> {hero.location}
                </p>
              )}

              <div className="hero-cta">
                <a className="btn btn-primary" href="#work" onClick={(e) => { e.preventDefault(); document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  View my work →
                </a>
                {hero.socials?.email && (
                  <a className="btn" href={`mailto:${hero.socials.email}`}>
                    <FiMail size={14} /> Contact me
                  </a>
                )}
                {hero.resumeUrl && (
                  <a className="btn" href={fileUrl(hero.resumeUrl)} target="_blank" rel="noreferrer">
                    <FiDownload size={14} /> CV
                  </a>
                )}
              </div>

              {hero.stats?.length > 0 && (
                <div className="hero-stats">
                  {hero.stats.map((s, i) => {
                    const Icon = STAT_ICONS[i % STAT_ICONS.length];
                    return (
                      <div className="hero-stat panel-card" key={i}>
                        <span className={`icon-badge icon-badge-sm ${BADGE_CLASSES[i % BADGE_CLASSES.length]}`}>
                          <Icon size={15} />
                        </span>
                        <span className="hero-stat-value">{s.value}</span>
                        <span className="hero-stat-label">{s.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="empty-note" style={{ marginTop: 20 }}>
              // profile not configured yet — log in at /admin to add your name, title, and tagline
            </div>
          )}
        </div>

        <div className="hero-photo-wrap fade-up">
          <div className="hero-photo-frame">
            {hero?.photo ? (
              <img src={fileUrl(hero.photo)} alt={hero.name || 'Profile'} />
            ) : (
              <div className="hero-photo-placeholder">No photo yet</div>
            )}
          </div>

          {allTags.map((tag, i) => {
            const { Icon, color } = getTechIcon(tag);
            return (
              <div className={`hero-float-badge ${floatPositions[i % floatPositions.length]}`} key={i} title={tag}>
                <Icon size={18} style={{ color }} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
