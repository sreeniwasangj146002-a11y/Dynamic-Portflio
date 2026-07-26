// === src/components/About.jsx ===
import { FiUser, FiMail, FiMapPin, FiBookOpen, FiClock, FiCode, FiLayers, FiDatabase, FiCpu } from 'react-icons/fi';
import { fileUrl } from '../api/api';

const HIGHLIGHT_ICONS = [FiCode, FiLayers, FiDatabase, FiCpu];
const BADGE_CLASSES = ['', 'icon-badge-blue', 'icon-badge-pink', 'icon-badge-orange'];

export default function About({ about, hero, contact }) {
  const hasBio = about?.bio?.length > 0;
  const hasHighlights = about?.highlights?.length > 0;
  const hasEdu = about?.education?.length > 0;
  const empty = !hasBio && !hasHighlights && !hasEdu;

  const details = [
    hero?.name && { icon: FiUser, label: 'Name', value: hero.name },
    hero?.socials?.email && { icon: FiMail, label: 'Email', value: hero.socials.email },
    (hero?.location || contact?.location) && { icon: FiMapPin, label: 'Location', value: hero?.location || contact?.location },
    hasEdu && { icon: FiBookOpen, label: 'Education', value: about.education[0].school },
    contact?.availability && { icon: FiClock, label: 'Availability', value: contact.availability, accent: true }
  ].filter(Boolean);

  return (
    <section id="about" className="section">
      <div className="container">
        <div className="section-head">
          <span className="icon-badge">
            <FiUser size={18} />
          </span>
          <div className="section-head-text">
            <span className="module-code">About</span>
            <h2 className="section-title">Who's building this</h2>
          </div>
        </div>

        {empty && <div className="empty-note">// about section not configured yet</div>}

        <div className="about-grid">
          {(hero?.photo || hasBio) && (
            <div className="about-left">
              {hero?.photo && (
                <div className="about-photo-frame panel-card">
                  <img src={fileUrl(hero.photo)} alt={hero.name} />
                </div>
              )}
              {hasBio && (
                <div className="about-bio">
                  {about.bio.map((p, i) => (
                    <p key={i} className="about-bio-p">
                      {p}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          {details.length > 0 && (
            <div className="panel-card about-details">
              {details.map((d, i) => (
                <div className="about-detail-row" key={i}>
                  <span className={`icon-badge icon-badge-sm ${BADGE_CLASSES[i % BADGE_CLASSES.length]}`}>
                    <d.icon size={15} />
                  </span>
                  <div>
                    <p className="about-detail-label">{d.label}</p>
                    <p className={`about-detail-value ${d.accent ? 'about-detail-accent' : ''}`}>{d.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {hasHighlights && (
          <div className="about-highlights-grid">
            {about.highlights.map((h, i) => {
              const Icon = HIGHLIGHT_ICONS[i % HIGHLIGHT_ICONS.length];
              return (
                <div className="panel-card about-highlight-card" key={i}>
                  <span className={`icon-badge ${BADGE_CLASSES[i % BADGE_CLASSES.length]}`}>
                    <Icon size={17} />
                  </span>
                  <p>{h}</p>
                </div>
              );
            })}
          </div>
        )}

        {hasEdu && (
          <div className="edu-block">
            <div className="about-highlights-head">
              <span className="icon-badge icon-badge-blue">
                <FiBookOpen size={16} />
              </span>
              <h3>Education</h3>
            </div>
            <div className="edu-timeline">
              {about.education.map((edu, i) => (
                <div className="edu-row" key={i}>
                  <span className="edu-date mono">{edu.date}</span>
                  <div className="edu-line" />
                  <div className="edu-detail">
                    <h4>{edu.degree}</h4>
                    <p className="edu-school">{edu.school}</p>
                    {edu.detail && <p className="edu-grade">{edu.detail}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
