// === src/components/Experiences.jsx ===
import { FiBriefcase, FiMapPin } from 'react-icons/fi';

const BADGE_CLASSES = ['', 'icon-badge-blue', 'icon-badge-pink', 'icon-badge-orange'];

export default function Experiences({ experiences }) {
  const list = experiences || [];

  return (
    <section id="experience" className="section">
      <div className="container">
        <div className="section-head">
          <span className="icon-badge icon-badge-pink">
            <FiBriefcase size={18} />
          </span>
          <div className="section-head-text">
            <span className="module-code">Experience</span>
            <h2 className="section-title">Where I've worked</h2>
          </div>
        </div>

        {list.length === 0 ? (
          <div className="empty-note">// no experience added yet</div>
        ) : (
          <div className="exp-list">
            {list.map((exp, i) => (
              <div className="panel-card exp-card" key={exp.id}>
                <span className={`icon-badge exp-icon ${BADGE_CLASSES[i % BADGE_CLASSES.length]}`}>
                  <FiBriefcase size={18} />
                </span>
                <div className="exp-body">
                  <div className="exp-card-head">
                    <div>
                      <h3>{exp.role}</h3>
                      <p className="exp-company">{exp.company}</p>
                    </div>
                    <div className="exp-meta">
                      <span className="pill pill-blue">
                        {exp.startDate}
                        {exp.startDate && (exp.current ? ' — Present' : exp.endDate ? ` — ${exp.endDate}` : '')}
                      </span>
                      {exp.location && (
                        <span className="exp-location">
                          <FiMapPin size={12} /> {exp.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {exp.description && <p className="exp-desc">{exp.description}</p>}

                  {exp.highlights?.length > 0 && (
                    <ul className="exp-highlights">
                      {exp.highlights.map((h, hi) => (
                        <li key={hi}>{h}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
