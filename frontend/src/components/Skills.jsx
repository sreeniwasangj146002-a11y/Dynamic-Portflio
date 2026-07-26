// === src/components/Skills.jsx ===
import { FiCpu } from 'react-icons/fi';
import { getTechIcon } from '../utils/techIcons';

export default function Skills({ skills }) {
  const categories = skills?.categories || [];

  return (
    <section id="stack" className="section section-alt">
      <div className="container">
        <div className="section-head">
          <span className="icon-badge icon-badge-blue">
            <FiCpu size={18} />
          </span>
          <div className="section-head-text">
            <span className="module-code">Skills</span>
            <h2 className="section-title">What I build with</h2>
          </div>
        </div>

        {categories.length === 0 ? (
          <div className="empty-note">// skills not configured yet</div>
        ) : (
          <div className="skills-categories">
            {categories.map((cat, i) => (
              <div key={i} className="skills-category">
                <h3 className="skills-category-title">{cat.name}</h3>
                <div className="skills-tile-grid">
                  {cat.tags.map((tag, tIdx) => {
                    const { Icon, color } = getTechIcon(tag);
                    return (
                      <div className="panel-card skills-tile" key={tIdx}>
                        <Icon size={26} style={{ color }} />
                        <span>{tag}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
