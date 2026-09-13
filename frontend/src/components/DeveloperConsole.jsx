import { FiTerminal } from 'react-icons/fi';

export default function DeveloperConsole({ content, projects = [] }) {
  const skills = [];
  (content?.skills?.categories || []).forEach((c) => (c.tags || []).forEach((s) => { if (!skills.includes(s)) skills.push(s); }));
  const work = projects.filter((p) => p.category === 'experience').slice(0, 3);
  return (
    <section className="dev-console-wrap">
      <div className="dev-console panel-card">
        <div className="dev-console-head"><span><FiTerminal /> developer-console</span><span className="console-dots">● ● ●</span></div>
        <div className="dev-console-body">
          <p><b>&gt; whoami</b></p><p className="console-result">{content?.hero?.name} — {content?.hero?.title}</p>
          <p><b>&gt; skills --top</b></p><p className="console-result">{skills.slice(0, 7).join(' · ')}</p>
          <p><b>&gt; projects --work</b></p><p className="console-result">{work.map((p) => p.title).join(' · ') || 'Projects loading...'}</p>
          <p><b>&gt; status</b></p><p className="console-result console-green">{content?.contact?.availability || 'Open to Opportunities'} ✓</p>
        </div>
      </div>
    </section>
  );
}
