import { useEffect, useState } from 'react';
import { FiArrowLeft, FiArrowUpRight, FiBriefcase, FiCalendar, FiUsers, FiLayers, FiCheckCircle } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import api, { fileUrl } from '../api/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { applyAppearance } from '../utils/fontPresets';
import { trackPageView } from '../utils/analytics';
import { slugifyProject } from '../utils/projectSlug';

const Block = ({ title, text, items }) => (text || items?.length) ? <section className="case-block panel-card"><h2>{title}</h2>{text&&<p>{text}</p>}{items?.length>0&&<ul>{items.map((x,i)=><li key={i}><FiCheckCircle />{x}</li>)}</ul>}</section> : null;

export default function ProjectDetail(){
  const { id } = useParams(); const navigate=useNavigate();
  const [content,setContent]=useState(null); const [project,setProject]=useState(null); const [missing,setMissing]=useState(false);
  useEffect(() => {
    let active = true;
    setMissing(false);
    setProject(null);
    trackPageView();

    const loadProject = async () => {
      try {
        const contentResponse = await api.get('/api/content');
        if (!active) return;
        setContent(contentResponse.data);
        applyAppearance(contentResponse.data.appearance);

        let found = null;
        try {
          // New backend supports both readable slugs and the original project id.
          const detailResponse = await api.get(`/api/projects/${encodeURIComponent(id)}`);
          found = detailResponse.data;
        } catch (detailError) {
          // Compatibility fallback: older backends may only expose GET /api/projects.
          const listResponse = await api.get('/api/projects');
          found = (listResponse.data || []).find((item) =>
            item.id === id ||
            item.slug === id ||
            slugifyProject(item.title || item.id) === id
          );
        }

        if (!found) {
          if (active) setMissing(true);
          return;
        }

        if (!active) return;
        setProject(found);
        api.post('/api/analytics/track', {
          event: 'project_view',
          projectId: found.id,
          projectTitle: found.title,
          path: window.location.pathname
        }).catch(() => {});
      } catch (error) {
        if (active) setMissing(true);
      }
    };

    loadProject();
    return () => { active = false; };
  }, [id]);
  if(missing) return <div className="page-loading">Project not found.</div>;
  if(!content||!project) return <div className="page-loading">Loading case study…</div>;
  return <div className="portfolio-page"><Navbar name={content.hero?.name} resumeUrl={content.hero?.resumeUrl}/><main className="inner-page case-study-page">
    <button className="back-link" onClick={()=>navigate('/projects')}><FiArrowLeft/> All projects</button>
    <section className="case-hero">
      <div className="case-hero-copy"><span className="inner-kicker">{project.category==='experience'?'Work Experience Project':'Personal Project'}</span><h1>{project.title}</h1><p>{project.description}</p><div className="project-dashboard-tags">{(project.tech||[]).map(t=><span key={t}>{t}</span>)}</div>{project.link&&<a className="portfolio-primary-btn case-live-btn" href={project.link} target="_blank" rel="noreferrer">Open project <FiArrowUpRight/></a>}</div>
      {project.image&&<div className="case-hero-image panel-card"><img src={fileUrl(project.image)} alt={project.title}/></div>}
    </section>
    <section className="case-meta-grid">
      <div className="panel-card"><FiBriefcase/><span>Role</span><strong>{project.role||'Developer'}</strong></div>
      <div className="panel-card"><FiLayers/><span>Company / Client</span><strong>{project.company||'Independent'}</strong></div>
      <div className="panel-card"><FiCalendar/><span>Duration</span><strong>{project.duration||'—'}</strong></div>
      <div className="panel-card"><FiUsers/><span>Team</span><strong>{project.teamSize||'—'}</strong></div>
    </section>
    <div className="case-content-grid">
      <Block title="The problem" text={project.problem}/><Block title="My solution" text={project.solution}/><Block title="Key features" items={project.features}/><Block title="Challenges & engineering decisions" items={project.challenges}/><Block title="Result / impact" text={project.outcome}/>
    </div>
  </main><Footer hero={content.hero}/></div>;
}
