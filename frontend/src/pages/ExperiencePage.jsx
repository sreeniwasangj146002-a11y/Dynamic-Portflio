import { useEffect, useState } from 'react';
import api from '../api/api';
import Navbar from '../components/Navbar';
import Experiences from '../components/Experiences';
import Footer from '../components/Footer';
import { applyAppearance } from '../utils/fontPresets';
import { trackPageView } from '../utils/analytics';

export default function ExperiencePage(){
 const [content,setContent]=useState(null),[experiences,setExperiences]=useState([]);
 useEffect(()=>{trackPageView();Promise.all([api.get('/api/content'),api.get('/api/experiences')]).then(([c,e])=>{setContent(c.data);setExperiences(e.data);applyAppearance(c.data.appearance);});},[]);
 if(!content)return <div className="page-loading">Loading experience…</div>;
 return <div className="portfolio-page"><Navbar name={content.hero?.name} resumeUrl={content.hero?.resumeUrl}/><main className="inner-page"><section className="inner-hero"><span className="inner-kicker">Career Journey</span><h1>Experience & responsibilities.</h1><p>A detailed timeline of the teams, products and systems I have worked on.</p></section><Experiences experiences={experiences}/></main><Footer hero={content.hero}/></div>;
}
