import { useEffect, useMemo, useState } from 'react';
import { FiArrowRight, FiSearch, FiFolder } from 'react-icons/fi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api, { fileUrl } from '../api/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { applyAppearance } from '../utils/fontPresets';
import { trackPageView } from '../utils/analytics';
import { getProjectPath } from '../utils/projectSlug';

export default function ProjectsPage() {
  const [content, setContent] = useState(null);
  const [projects, setProjects] = useState([]);
  const [query, setQuery] = useState('');
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const type = params.get('type') || 'all';

  useEffect(() => {
    trackPageView();
    Promise.all([api.get('/api/content'), api.get('/api/projects')]).then(([c,p]) => {
      setContent(c.data); setProjects(p.data); applyAppearance(c.data.appearance);
    });
  }, []);

  const filtered = useMemo(() => projects.filter((p) => {
    const typeOk = type === 'all' || (p.category || 'personal') === type;
    const hay = `${p.title} ${p.role} ${p.description} ${(p.tech || []).join(' ')}`.toLowerCase();
    return typeOk && hay.includes(query.toLowerCase());
  }), [projects, type, query]);

  if (!content) return <div className="page-loading">Loading projects…</div>;

  return <div className="portfolio-page">
    <Navbar name={content.hero?.name} resumeUrl={content.hero?.resumeUrl} />
    <main className="inner-page">
      <section className="inner-hero">
        <span className="inner-kicker"><FiFolder /> Project Library</span>
        <h1>Work that shows how I build.</h1>
        <p>Production work, client systems and independent projects. Open any project to read the full case study.</p>
      </section>
      <section className="project-browser panel-card">
        <div className="project-browser-toolbar">
          <div className="project-filter-tabs">
            {[['all','All'],['experience','Work Projects'],['personal','Personal Projects']].map(([v,l]) =>
              <button key={v} className={type===v?'active':''} onClick={() => setParams(v==='all'?{}:{type:v})}>{l}</button>)}
          </div>
          <label className="project-search"><FiSearch /><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search projects or technology" /></label>
        </div>
        <div className="project-library-grid">
          {filtered.map((project, index) => <article className="project-library-card" key={project.id}>
            <div className="project-library-image">{project.image ? <img src={fileUrl(project.image)} alt={project.title}/> : <div className={`project-placeholder placeholder-${(index%4)+1}`} />}</div>
            <div className="project-library-content">
              <div className="project-card-topline"><span>{project.category==='experience'?'Work Project':'Personal Project'}</span>{project.featured&&<b>Featured</b>}</div>
              <h2>{project.title}</h2><p>{project.description}</p>
              <div className="project-dashboard-tags">{(project.tech||[]).slice(0,5).map(t=><span key={t}>{t}</span>)}</div>
              <button className="project-card-link project-readmore-btn" onClick={()=>navigate(getProjectPath(project))}>Read more <FiArrowRight/></button>
            </div>
          </article>)}
        </div>
        {!filtered.length && <div className="project-empty-state">No projects match this filter.</div>}
      </section>
    </main>
    <Footer hero={content.hero}/>
  </div>;
}
