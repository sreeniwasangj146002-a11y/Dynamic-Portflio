import { useEffect, useState } from 'react';
import { FiActivity, FiEye, FiUsers, FiSearch, FiDownload, FiMail, FiExternalLink } from 'react-icons/fi';
import api from '../../api/api';

export default function AnalyticsEditor() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api.get('/api/analytics').then((res) => setData(res.data)).catch((err) => setError(err.response?.data?.message || 'Could not load analytics.')).finally(() => setLoading(false));
  };

  useEffect(load, []);
  if (loading) return <p className="admin-loading">Loading analytics…</p>;
  if (error) return <p className="admin-empty-hint">{error}</p>;

  const stats = [
    ['Total page views', data.totalViews, FiEye],
    ['Unique visitors', data.uniqueVisitors, FiUsers],
    ['Last 7 days', data.views7d, FiActivity],
    ['Search referrals', data.searchVisits, FiSearch],
    ['CV clicks', data.cvDownloads, FiDownload],
    ['Contact clicks', data.contactClicks, FiMail]
  ];

  return (
    <div className="admin-panel">
      <div className="analytics-heading-row">
        <div><h2>Portfolio Analytics</h2><p className="admin-panel-sub">Track visitors, page views, traffic sources, project clicks and conversions.</p></div>
        <button className="btn" onClick={load}>Refresh</button>
      </div>

      <div className="analytics-stat-grid">
        {stats.map(([label,value,Icon]) => <div className="admin-card analytics-stat-card" key={label}><Icon/><strong>{value ?? 0}</strong><span>{label}</span></div>)}
      </div>

      <div className="analytics-two-col">
        <div className="admin-card">
          <h3>Traffic sources</h3>
          <div className="analytics-list">{data.topSources?.length ? data.topSources.map((s) => <div key={s.source}><span><FiExternalLink/> {s.source}</span><strong>{s.count}</strong></div>) : <p>No traffic data yet.</p>}</div>
        </div>
        <div className="admin-card">
          <h3>Most viewed projects</h3>
          <div className="analytics-list">{data.projectViews?.length ? data.projectViews.map((p) => <div key={p.id}><span>{p.title}</span><strong>{p.count}</strong></div>) : <p>Project click data will appear here.</p>}</div>
        </div>
      </div>

      <div className="admin-card analytics-note">
        <h3>Google search visibility</h3>
        <p>This dashboard can count visits that arrive from Google/Bing and can capture a search phrase when the browser provides it. Exact Google impressions, clicks, average position and all search queries require Google Search Console integration after your deployed domain is verified.</p>
        {!!data.searchTerms?.length && <div className="analytics-search-terms">{data.searchTerms.map((q) => <span key={q}>{q}</span>)}</div>}
      </div>
    </div>
  );
}
