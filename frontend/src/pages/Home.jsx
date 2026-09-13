import { useEffect, useState } from 'react';
import api from '../api/api';
import { applyAppearance } from '../utils/fontPresets';
import Navbar from '../components/Navbar';
import DashboardOverview from '../components/DashboardOverview';
import Skills from '../components/Skills';
import Experiences from '../components/Experiences';
import Certifications from '../components/Certifications';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import DeveloperConsole from '../components/DeveloperConsole';

export default function Home() {
  const [content, setContent] = useState(null);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      let visitorId = localStorage.getItem('portfolio_visitor_id');
      if (!visitorId) {
        visitorId = `v_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
        localStorage.setItem('portfolio_visitor_id', visitorId);
      }
      const referrer = document.referrer || '';
      let searchTerm = '';
      try {
        const refUrl = referrer ? new URL(referrer) : null;
        searchTerm = refUrl?.searchParams?.get('q') || refUrl?.searchParams?.get('query') || '';
      } catch (_) {}
      api.post('/api/analytics/track', {
        event: 'page_view', visitorId, path: window.location.pathname, referrer, searchTerm,
        screen: `${window.screen.width}x${window.screen.height}`
      }).catch(() => {});
    } catch (_) {}
  }, []);

  useEffect(() => {
    Promise.all([
      api.get('/api/content'),
      api.get('/api/projects'),
      api.get('/api/experiences'),
      api.get('/api/certifications')
    ])
      .then(([contentRes, projectsRes, experiencesRes, certsRes]) => {
        setContent(contentRes.data);
        setProjects(projectsRes.data);
        setExperiences(experiencesRes.data);
        setCertifications(certsRes.data);
        applyAppearance(contentRes.data.appearance);
        if (contentRes.data.seo?.title) document.title = contentRes.data.seo.title;
        if (contentRes.data.seo?.description) {
          let meta = document.querySelector('meta[name="description"]');
          if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
          meta.content = contentRes.data.seo.description;
        }
        setTimeout(() => {
          const id = window.location.hash.replace('#', '');
          if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      })
      .catch((error) => {
        console.error('Failed to load portfolio data:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading">Loading portfolio…</div>;

  return (
    <div className="portfolio-page">
      <Navbar name={content?.hero?.name} resumeUrl={content?.hero?.resumeUrl} />
      <DashboardOverview content={content} projects={projects} />

      <div id="skills-details" className="detail-sections">
        <Skills skills={content?.skills} />
        <Experiences experiences={experiences} />
        <Certifications certifications={certifications} />
        <DeveloperConsole content={content} projects={projects} />
        <Contact contact={content?.contact} hero={content?.hero} />
        <Footer hero={content?.hero} />
      </div>
    </div>
  );
}
