import api from '../api/api';
export function trackPageView(path = window.location.pathname) {
  try {
    let visitorId = localStorage.getItem('portfolio_visitor_id');
    if (!visitorId) { visitorId = `v_${Date.now()}_${Math.random().toString(36).slice(2,10)}`; localStorage.setItem('portfolio_visitor_id', visitorId); }
    const referrer = document.referrer || '';
    let searchTerm = '';
    try { const u = referrer ? new URL(referrer) : null; searchTerm = u?.searchParams?.get('q') || u?.searchParams?.get('query') || ''; } catch (_) {}
    api.post('/api/analytics/track', { event:'page_view', visitorId, path, referrer, searchTerm, screen:`${window.screen.width}x${window.screen.height}` }).catch(()=>{});
  } catch (_) {}
}
