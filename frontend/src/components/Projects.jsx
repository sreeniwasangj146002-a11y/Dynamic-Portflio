// === src/components/Projects.jsx ===
import { FiArrowUpRight, FiFolder } from 'react-icons/fi';
import { fileUrl } from '../api/api';

const PILL_CLASSES = ['pill', 'pill-blue', 'pill-pink', 'pill-orange', 'pill-green'];

function ProjectCard({ project, featured }) {
  return (
    <div className={`panel-card project-card ${featured ? 'project-card-featured' : ''}`}>
      {project.image && (
        <div className="project-image">
          <img src={fileUrl(project.image)} alt={project.title} />
        </div>
      )}
      <div className="project-body">
        <div className="project-heading">
          <h3>{project.title}</h3>
          {project.link && (
            <a href={project.link} target="_blank" rel="noreferrer" className="project-link" aria-label="Open project">
              <FiArrowUpRight size={16} />
            </a>
          )}
        </div>
        {project.role && <p className="project-role">{project.role}</p>}
        {project.description && <p className="project-desc">{project.description}</p>}
        {project.tech?.length > 0 && (
          <div className="skills-tags project-tech">
            {project.tech.map((t, i) => (
              <span className={PILL_CLASSES[i % PILL_CLASSES.length]} key={i}>
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Projects({ projects, id, icon: Icon = FiFolder, badgeClass = '', moduleCode, title, altBg }) {
  const list = projects || [];
  const featured = list.find((p) => p.featured);
  const rest = list.filter((p) => p !== featured);

  return (
    <section id={id} className={`section ${altBg ? 'section-alt' : ''}`}>
      <div className="container">
        <div className="section-head">
          <span className={`icon-badge ${badgeClass}`}>
            <Icon size={18} />
          </span>
          <div className="section-head-text">
            <span className="module-code">{moduleCode}</span>
            <h2 className="section-title">{title}</h2>
          </div>
        </div>

        {list.length === 0 ? (
          <div className="empty-note">// nothing added here yet</div>
        ) : (
          <div className="projects-layout">
            {featured && <ProjectCard project={featured} featured />}
            <div className="projects-grid">
              {rest.map((p) => (
                <ProjectCard project={p} key={p.id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
