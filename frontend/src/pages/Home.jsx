// === src/pages/Home.jsx ===
import { useEffect, useState } from 'react';
import { FiBriefcase, FiFolder } from 'react-icons/fi';
import api from '../api/api';
import { applyAppearance } from '../utils/fontPresets';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Experiences from '../components/Experiences';
import Projects from '../components/Projects';
import Certifications from '../components/Certifications';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  const [content, setContent] = useState(null);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);

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
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="page-loading">Loading…</div>;
  }

  const experienceProjects = projects.filter((p) => p.category === 'experience');
  const personalProjects = projects.filter((p) => p.category !== 'experience');

  return (
    <>
      <Navbar name={content?.hero?.name} title={content?.hero?.title} resumeUrl={content?.hero?.resumeUrl} />
      <Hero hero={content?.hero} skills={content?.skills} />
      <About about={content?.about} hero={content?.hero} contact={content?.contact} />
      <Skills skills={content?.skills} />
      <Projects
        id="work"
        projects={experienceProjects}
        icon={FiBriefcase}
        badgeClass=""
        moduleCode="Experience Projects"
        title="Projects at work"
        altBg
      />
      <Projects
        id="personal-work"
        projects={personalProjects}
        icon={FiFolder}
        badgeClass="icon-badge-pink"
        moduleCode="Personal Projects"
        title="Projects on my own time"
      />
      <Experiences experiences={experiences} />
      <Certifications certifications={certifications} />
      <Contact contact={content?.contact} hero={content?.hero} />
      <Footer hero={content?.hero} />
    </>
  );
}
