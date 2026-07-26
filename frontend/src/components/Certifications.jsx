// === src/components/Certifications.jsx ===
import { FiAward, FiExternalLink } from 'react-icons/fi';
import { fileUrl } from '../api/api';

const BADGE_CLASSES = ['', 'icon-badge-blue', 'icon-badge-pink', 'icon-badge-orange'];

export default function Certifications({ certifications }) {
  const list = certifications || [];

  return (
    <section id="cert" className="section section-alt">
      <div className="container">
        <div className="section-head">
          <span className="icon-badge icon-badge-orange">
            <FiAward size={18} />
          </span>
          <div className="section-head-text">
            <span className="module-code">Certificates</span>
            <h2 className="section-title">Certifications</h2>
          </div>
        </div>

        {list.length === 0 ? (
          <div className="empty-note">// no certificates added yet</div>
        ) : (
          <div className="cert-grid">
            {list.map((c, i) => (
              <div className="panel-card cert-card" key={c.id}>
                <span className={`icon-badge icon-badge-sm ${BADGE_CLASSES[i % BADGE_CLASSES.length]}`}>
                  <FiAward size={15} />
                </span>
                <h4>{c.title}</h4>
                {c.issuer && <p className="cert-issuer">{c.issuer}</p>}
                {c.date && <p className="cert-date">{c.date}</p>}
                {c.file && (
                  <a href={fileUrl(c.file)} target="_blank" rel="noreferrer" className="cert-view-link">
                    View <FiExternalLink size={12} />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
